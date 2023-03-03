import * as THREE from "three";
import Core from "../core";

import Layer from "./layer";
import ObstacleLayer from "./obstacleLayer";
import Roof from "./roof";

const defaultFloorPlanTolerance = Core.Configuration.getNumericValue(
  Core.configSnapTolernance
);

/**
 * A Floorplan represents a number of Walls, Corners and Rooms.
 */
export default class Floorplan {
  scene = null;

  orientation = 0;
  buildingOffset = 0;

  /** */
  layers = [];

  activeLayer = null;
  activeLayerIndex = null;

  roof = new Roof(this);

  obstacleEditMode = false;
  obstacleLayer = new ObstacleLayer(-1, 0, 2.5);

  roofLayer = this.newLayer(-1, 0, 0);

  /** */
  redraw_callbacks = [];

  updated_rooms = [];
  layerUpdatedCallbacks = [];
  buildingOffsetUpdatedCallbacks = [];
  activeLayerChangedCallbacks = [];
  roomLoadedCallbacks = [];

  /** Constructs a floorplan. */
  constructor() {
    this.obstacleLayer.floorplan = this;
  }

  fireOnRedraw = (callback) => this.redraw_callbacks.push(callback);
  fireOnUpdatedRooms = (callback) => this.updated_rooms.push(callback);
  fireOnLayersUpdated = (callback) => this.layerUpdatedCallbacks.push(callback);
  fireOnActiveLayerChanged = (callback) =>
    this.activeLayerChangedCallbacks.push(callback);

  setBuildingOffset = (offset) => {
    const delta = offset - this.buildingOffset;
    this.getWalls().forEach((wall) => {
      wall.items.forEach((item) => {
        item.position.y += delta;
        item.dimensionHelper.position.y += delta;
      });
    });
    if (offset > 0 && this.getLayer(99)) {
      // first underground floor
      const height = this.getLayer(99).height;
      if (offset >= height) {
        for (let i = this.layers.length - 1; i >= 0; i--) {
          this.layers[i + 1] = this.layers[i];
          let nextLayer = this.layers[i + 1];
          if (nextLayer) {
            nextLayer.setLayerIndex(i + 1);
            nextLayer.offset += nextLayer.height;
            nextLayer.calculateRooms();
          }
        }
        offset -= height;
      }
    } else if (offset < 0 && this.getLayer(100)) {
      const height = this.getLayer(100).height;
      if (-offset >= height) {
        for (let i = 0; i < this.layers.length - 1; i++) {
          this.layers[i] = this.layers[i + 1];
          let nextLayer = this.layers[i];
          if (nextLayer) {
            nextLayer.setLayerIndex(i);
            nextLayer.offset -= nextLayer.height;
            nextLayer.calculateRooms();
            if (i < 100)
              nextLayer.getWalls().forEach((wall) => wall.removeItems());
          }
        }
        this.layers.splice(this.layers.length - 1);
        offset += height;
      }
    }
    for (let i = this.layers.length - 1; i >= 0; i--) {
      if (this.layers[i]) {
        this.roof.offset = this.layers[i].offset + this.layers[i].height;
        break;
      }
    }
    this.buildingOffset = offset;
    this.update(false);
  };

  // layer manipulation
  cloneLayer = (currentLayer, nextIndex, offset, height) => {
    if (!currentLayer) return;
    const corners = currentLayer.getCorners();
    const walls = currentLayer.getWalls();

    const newLayer = this.newLayer(nextIndex, offset, height);

    const newCorners = [];

    corners.forEach((c) => newCorners.push(newLayer.newCorner(c.x, c.y)));
    walls.forEach((w) => {
      const start = newCorners[corners.indexOf(w.start)];
      const end = newCorners[corners.indexOf(w.end)];
      const _wall = newLayer.newWall(start, end, newLayer.height);
      _wall.thickness = w.thickness;
      _wall.thicknessDirection = w.thicknessDirection;
      _wall.isOutsideWall = w.isOutsideWall;
    });

    newLayer.updated_callbacks.push(() => this.update());
    return newLayer;
  };

  newLayer(index, offset, height) {
    const layer = new Layer(index, offset, height);
    layer.floorplan = this;
    return layer;
  }

  getLayer(layerIndex) {
    try {
      return this.layers[layerIndex];
    } catch (_) {
      return null;
    }
  }

  getActiveLayer() {
    return this.getLayer(this.activeLayerIndex);
  }

  getLayers() {
    const scope = this;
    const layersData = [];

    for (let index in scope.layers) {
      const layer = scope.layers[index];
      if (!layer) continue;
      layersData.push({
        index: index - 100,
        offset: layer.offset,
        height: layer.height,
        visible: layer.visible,
        floorThickness: layer.floorThickness,
      });
    }
    return layersData;
  }

  setActiveLayerIndex = (index) => {
    if (Number.isInteger(index)) index = index - 0 + 100;
    this.activeLayerIndex = index;
    this.activeLayer = this.getLayer(index);
    this.activeLayerChangedCallbacks.forEach((cb) => cb(index));
  };

  setLayerHeight = (index, height = 0) => {
    height -= 0;
    if (Number.isInteger(index)) index = index - 0 + 100;
    const layer = this.getLayer(index);
    if (!layer) return;

    if (index >= 100) {
      const dHeight = height - layer.height;
      for (let i = index + 1; i < this.layers.length; i++) {
        const tmp = this.layers[i];
        if (!tmp) continue;
        tmp.setOffset(tmp.offset + dHeight);
      }
      layer.setHeight(height);
      let lastLayer = null;
      if (this.layers.length) {
        lastLayer = this.layers[this.layers.length - 1];
      }
      if (lastLayer) this.roof.offset = lastLayer.offset + lastLayer.height;
    } else {
      const dHeight = height - layer.height;
      for (let i = 0; i <= index; i++) {
        const tmp = this.layers[i];
        if (!tmp) continue;
        tmp.setOffset(tmp.offset - dHeight);
      }
      layer.setHeight(height);
    }
    this.update(false);
  };

  setLayerVisible = (index, visible) => {
    if (Number.isInteger(index)) index = index - 0 + 100;
    const layer = this.getLayer(index);
    if (!layer) return;

    layer.setVisible(visible);
    this.update(false);
  };

  cloneAboveLayer = (index) => {
    if (!Number.isInteger(index)) return;
    index = index - 0 + 100;
    const currentLayer = this.getLayer(index);
    if (!currentLayer) return;
    if (index >= 100) {
      let nextIndex = index + 1;
      for (let i = index + 1; i < this.layers.length; i++) {
        const layer = this.layers[i];
        if (!layer) continue;
        layer.setLayerIndex(layer.layerIndex + 1);
        layer.setOffset(layer.offset + currentLayer.height);
      }
      const newLayer = this.cloneLayer(
        currentLayer,
        nextIndex,
        currentLayer.offset + currentLayer.height,
        currentLayer.height
      );
      if (newLayer) {
        this.layers.splice(nextIndex, 0, newLayer);
        newLayer.calculateRooms();
        this.roof.offset += newLayer.height;
        this.update(false);
      }
      return nextIndex - 100;
    } else {
      let nextIndex = index;
      for (let i = 0; i <= index; i++) {
        const layer = this.layers[i];
        if (!layer) continue;
        layer.setLayerIndex(layer.layerIndex - 1);
        layer.setOffset(layer.offset - currentLayer.height);
      }
      const newLayer = this.cloneLayer(
        currentLayer,
        nextIndex,
        currentLayer.offset + currentLayer.height,
        currentLayer.height
      );
      if (newLayer) {
        for (let i = 0; i < nextIndex; i++) {
          this.layers[i] = this.layers[i + 1];
        }
        this.layers[nextIndex] = newLayer;
        newLayer.calculateRooms();
        this.update(false);
      }
      return nextIndex - 100;
    }
  };

  cloneBelowLayer = (index) => {
    if (!Number.isInteger(index)) return;
    index = index - 0 + 100;
    const currentLayer = this.getLayer(index);
    if (!currentLayer) return;
    if (index > 100) {
      let nextIndex = index;
      for (let i = index; i < this.layers.length; i++) {
        const layer = this.layers[i];
        if (!layer) continue;
        layer.setLayerIndex(layer.layerIndex + 1);
        layer.setOffset(layer.offset + currentLayer.height);
      }
      const newLayer = this.cloneLayer(
        currentLayer,
        nextIndex,
        currentLayer.offset - currentLayer.height,
        currentLayer.height
      );
      if (newLayer) {
        this.layers.splice(index, 0, newLayer);
        this.roof.offset += newLayer.height;
        newLayer.calculateRooms();
        this.update(false);
      }
      return nextIndex - 100;
    } else {
      // for underground floors
      let nextIndex = index - 1;
      for (let i = 0; i < index; i++) {
        const layer = this.layers[i];
        if (!layer) continue;
        layer.setLayerIndex(layer.layerIndex - 1);
        layer.setOffset(layer.offset - currentLayer.height);
      }
      const newLayer = this.cloneLayer(
        currentLayer,
        nextIndex,
        currentLayer.offset - currentLayer.height,
        currentLayer.height
      );
      if (newLayer) {
        for (let i = 0; i < nextIndex; i++) {
          this.layers[i] = this.layers[i + 1];
        }
        this.layers[nextIndex] = newLayer;
        newLayer.calculateRooms();
        this.update(false);
      }
      return nextIndex - 100;
    }
  };

  swapLayers = (cIndex, nIndex, direction = 1) => {
    const currentLayer = this.getLayer(cIndex);
    const nextLayer = this.getLayer(nIndex);
    if (!currentLayer || !nextLayer) return false;
    nextLayer.setLayerIndex(cIndex);
    currentLayer.setLayerIndex(nIndex);
    if (direction === 1) {
      nextLayer.setOffset(currentLayer.offset);
      currentLayer.setOffset(nextLayer.offset + nextLayer.height - 0);
    } else if (direction === -1) {
      currentLayer.setOffset(nextLayer.offset);
      nextLayer.setOffset(currentLayer.offset + currentLayer.height - 0);
    }

    this.layers[nIndex] = currentLayer;
    this.layers[cIndex] = nextLayer;
    return true;
  };

  moveAboveLayer = (index) => {
    if (!Number.isInteger(index)) return;
    index = index - 0 + 100;
    let nIndex = index + 1;
    if (index < 100 && nIndex >= 100) return null;
    if (this.swapLayers(index, nIndex, 1)) {
      this.update(false);
      return nIndex - 100;
    }
    return null;
  };

  moveBelowLayer = (index) => {
    if (!Number.isInteger(index)) return;
    index = index - 0 + 100;
    let nIndex = index - 1;
    if (nIndex < 100 && index >= 100) return null;
    if (this.swapLayers(index, nIndex, -1)) {
      this.update(false);
      return nIndex - 100;
    }
    return null;
  };

  removeLayer = (index) => {
    if (!Number.isInteger(index)) return;
    index = index - 0 + 100;
    const currentLayer = this.getLayer(index);
    if (!currentLayer) return;
    if (index >= 100) {
      for (let i = index + 1; i < this.layers.length; i++) {
        const layer = this.layers[i];
        if (!layer) continue;
        layer.setLayerIndex(i - 1);
        layer.setOffset(layer.offset - currentLayer.height);
      }
      this.roof.offset -= currentLayer.height;
      currentLayer.remove();
      Core.Utils.removeValue(this.layers, currentLayer);
    } else {
      for (let i = index; i > 0; i--) {
        this.layers[i] = this.layers[i - 1];
        const layer = this.layers[i];
        if (!layer) continue;
        layer.setLayerIndex(i);
        layer.setOffset(layer.offset + currentLayer.height);
      }
    }
    currentLayer.remove();
    this.update(false);
  };

  setRoomVisible = (uuid, visible, autoUpdate = true) => {
    this.getRooms().forEach((room) => {
      if (room.getUuid() === uuid) {
        room.visible = visible;
      }
    });
    autoUpdate && this.update(false);
  };

  getRoomsInfo() {
    const scope = this;
    const rooms = [];

    for (let index in scope.layers) {
      const layer = scope.layers[index];
      if (!layer) continue;
      layer.getRooms().forEach((room) => {
        rooms.push({
          uuid: room.getUuid(),
          layerIndex: index - 100,
          name: room.name,
          tags: room.tags,
          area: room.updateArea().area,
          visible: room.visible,
        });
      });
    }
    return rooms;
  }

  setLayerFloorThickness = (index, thickness) => {
    if (Number.isInteger(index)) index = index - 0 + 100;
    const layer = this.getLayer(index);
    if (!layer) return;

    layer.setFloorThickness(thickness);
    this.update(false);
  };

  /** */
  regenerateRoof = (force = true) => {
    if (!force) {
      if (this.roof.vertices.length && this.roof.edges.length) {
        return;
      }
    }

    let corners = [];
    let lastLayer = null;
    if (this.layers.length) {
      lastLayer = this.layers[this.layers.length - 1];
    }
    if (!lastLayer) return;

    let items = [];
    this.scene.items.forEach((item) => item.isRoofItem && items.push(item));
    for (let i = items.length - 1; i >= 0; i--) {
      items[i].remove();
    }

    let walls = lastLayer
      .getWalls()
      .filter((wall) => wall.checkIsOutsideWall());
    walls.forEach((wall) => {
      const { edge } = wall;
      let side = wall.getExposedSide();
      if (side === 1) {
        corners.push(edge.exteriorStart(), edge.exteriorEnd());
      } else if (side === -1) {
        corners.push(edge.interiorStart(), edge.interiorEnd());
      }
    });
    this.roof.offset = lastLayer.offset + lastLayer.height;
    this.roof.regenerate(corners);
    this.update(false);
  };

  getSameLayerWalls = (wall) => {
    const layer = wall.start.layer;
    return layer.getWalls();
  };

  getSameFaceWalls = (wall) => {
    const walls = this.getAllWalls();
    const res = [];
    walls.forEach((candidate) => {
      const isSameFace = wall.checkIsSameFace(candidate);
      // console.log(isSameFace);
      isSameFace && res.push(candidate);
    });
    return res;
  };

  getAllWalls = () => {
    const walls = [];
    this.layers.forEach((layer) => layer && walls.push(...layer.getWalls()));
    return walls;
  };

  roofFaces() {
    const faces = [];

    this.roof.getFaces().forEach((face) => {
      const offset = this.roof.offset;
      face.vertices.forEach((vertex) => {
        vertex.offset = offset;
      });
      faces.push(face);
    });
    return faces;
  }

  roofEdges() {
    const edges = [];
    this.roof.getEdges().forEach((edge) => {
      edge.offset = this.roof.offset;
      edges.push(edge);
    });
    return edges;
  }

  roofVertices() {
    const vertices = [];
    this.roof.getVertices().forEach((vertex) => {
      vertex.offset = this.roof.offset;
      vertices.push(vertex);
    });
    return vertices;
  }

  // hack
  wallEdges() {
    var edges = [];

    this.layers.forEach((layer) => {
      layer &&
        layer.getWalls().forEach((wall) => {
          if (wall.edge) {
            wall.edge.layerOffset = layer.offset;
            edges.push(wall.edge);
          }
        });
    });
    return edges;
  }

  obstacleWallEdges() {
    var edges = [];
    // console.log(this.obstacleLayer.getCorners(), this.obstacleLayer.getWalls());
    this.obstacleLayer.getWalls().forEach((wall) => {
      if (wall.edge) {
        wall.edge.layerOffset = 0;
        edges.push(wall.edge);
      }
    });
    return edges;
  }

  // hack
  wallEdgePlanes() {
    const planes = [];
    this.layers.forEach((layer) => {
      layer &&
        layer.getWalls().forEach((wall) => {
          if (wall.edge) {
            const plane = wall.edge.plane;
            planes.push(plane);
          }
        });
    });
    return planes;
  }

  /** Gets the walls. */
  getWalls(layerIndex = null) {
    if (layerIndex !== null) {
      const layer = this.layers[layerIndex];
      if (layer) return layer.getWalls();
      return [];
    }

    const walls = [];
    this.layers.forEach((layer) => {
      layer && walls.push(...layer.getWalls());
    });
    return walls;
  }

  /** Gets the corners. */
  getCorners(layerIndex = null) {
    if (layerIndex !== null) {
      const layer = this.layers[layerIndex];
      if (layer) return layer.getCorners();
      return [];
    }
    const corners = [];
    this.layers.forEach((layer) => {
      layer && corners.push(...layer.getCorners());
    });
    return corners;
  }

  getItems() {
    return this.scene.items;
  }

  /** Gets the rooms. */
  getRooms(layerIndex = null) {
    if (layerIndex !== null) {
      const layer = this.layers[layerIndex];
      if (layer) {
        return layer.getRooms();
      }
      return [];
    }
    const rooms = [];
    this.layers.forEach((layer) => {
      if (!layer) return;
      rooms.push(...layer.getRooms());
    });
    return rooms;
  }

  /**
   * Get overlapped corner by position (x, y)
   * @param {Number} x position X
   * @param {Number} y position Y
   * @param {Number} tolerance tolenrance
   * @param {Wall} wall check if corner is in wall
   * @returns
   */
  overlappedCorner(x, y, tolerance, wall) {
    let corners = [];
    const activeLayer = this.obstacleEditMode
      ? this.obstacleLayer
      : this.getActiveLayer();
    if (!activeLayer) return;
    corners = activeLayer.getCorners();

    tolerance = tolerance || defaultFloorPlanTolerance;
    for (const corner of corners) {
      if (corner.distanceFrom(x, y) < tolerance) {
        if (wall && wall.start !== corner && wall.end !== corner) continue;
        return corner;
      }
    }
    return null;
  }

  overlappedWall(x, y, tolerance) {
    let walls = [];
    const activeLayer = this.obstacleEditMode
      ? this.obstacleLayer
      : this.getActiveLayer();
    if (activeLayer) {
      walls = activeLayer.getWalls();
    }

    tolerance = tolerance || defaultFloorPlanTolerance;
    for (let i = 0; i < walls.length; i++) {
      if (walls[i].distanceFrom(x, y) < tolerance) {
        return walls[i];
      }
    }
    return null;
  }

  overlappedRoom = (x, y) => {
    let rooms = [];
    if (this.getActiveLayer()) rooms = this.getActiveLayer().getRooms();
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      if (Core.Utils.pointInPolygon(x, y, room.corners)) {
        return room;
      }
    }
    return null;
  };

  overlappedItem(x, y) {
    const items = this.getItems();
    let res = null;
    for (const item of items) {
      const hullPointsCollection = item.getSnapPoints();
      let isOverlapped = false;
      for (const corners of hullPointsCollection) {
        if (Core.Utils.pointInPolygon(x, y, corners)) {
          isOverlapped = true;
          break;
        }
      }
      if (isOverlapped) {
        res = item;
        break;
      }
    }
    return res;
  }

  calculateRulerData() {
    const corners = [
      ...this.getCorners(this.activeLayerIndex).map((corner) => {
        return { x: corner.x, y: corner.y };
      }),
    ];
    // this.getItems().forEach((item) => corners.push(...item.getCorners()));
    let xRulers = [];
    let yRulers = [];
    for (var i = 0; i < corners.length; i++) {
      let exist = false;
      for (const corner of xRulers) {
        if (corner.x === corners[i].x) {
          exist = true;
          break;
        }
      }
      !exist && xRulers.push(corners[i]);

      exist = false;
      for (const corner of yRulers) {
        if (corner.y === corners[i].y) {
          exist = true;
          break;
        }
      }
      !exist && yRulers.push(corners[i]);
    }

    xRulers = xRulers.sort((a, b) => a.x - b.x);
    yRulers = yRulers.sort((a, b) => a.y - b.y);

    const rulerData = { x: [], y: [] };
    for (i = 0; i < xRulers.length - 1; i++) {
      rulerData.x.push({
        start: xRulers[i],
        end: xRulers[i + 1],
        length: Math.abs(xRulers[i].x - xRulers[i + 1].x),
      });
    }
    for (i = 0; i < yRulers.length - 1; i++) {
      rulerData.y.push({
        start: yRulers[i],
        end: yRulers[i + 1],
        length: Math.abs(yRulers[i].y - yRulers[i + 1].y),
      });
    }
    return rulerData;
  }

  saveFloorplan() {
    const layersData = [];
    const itemsData = [];
    const roofData = {
      offset: 0,
      vertices: {},
      edges: [],
      faces: {},
    };
    const obstacleData = {
      offset: 0,
    };

    // add roof data
    (() => {
      roofData.offset = this.roof.offset;
      this.roof.vertices.forEach((vertex) => {
        roofData.vertices[vertex.id] = {
          x: vertex.x,
          y: vertex.y,
          z: vertex.z,
          id: vertex.id,
        };
      });

      this.roof.edges.forEach((edge) => {
        roofData.edges.push({
          start: edge.start.id,
          end: edge.end.id,
        });
      });

      this.roof.getFaces().forEach((face) => {
        roofData.faces[face.getUuid()] = {
          color: face.color,
        };
      });
      this.roof.items.forEach((object) => {
        itemsData.push({
          uuid: object.uuid,
          item_name: object.metadata.itemName,
          item_type: object.metadata.itemType,
          model_url: object.metadata.modelUrl || object.metadata.threeModel,
          xpos: object.position.x,
          ypos: object.position.y,
          zpos: object.position.z,
          rotation: object.rotation.y,
          metadata: object.metadata,
          options: object.getOptions(),
        });
      });
      // console.log(roofData);
    })();

    // add obstacle data
    (() => {
      const layer = this.obstacleLayer;
      const floorplan = {
        corners: {},
        walls: [],
      };
      layer.getCorners().forEach((corner) => {
        floorplan.corners[corner.id] = {
          x: corner.x,
          y: corner.y,
        };
      });

      layer.getWalls().forEach((wall) => {
        floorplan.walls.push({
          corner1: wall.getStart().id,
          corner2: wall.getEnd().id,
          height: wall.height,
        });
      });
      obstacleData.floorplan = floorplan;
    })();

    // add layers
    for (let [i, layer] of this.layers.entries()) {
      if (!layer) continue;
      const { offset, height, floorThickness } = layer;
      const floorplan = {
        corners: {},
        walls: [],
        rooms: {},
      };

      layer.getCorners().forEach((corner) => {
        floorplan.corners[corner.id] = {
          x: corner.x,
          y: corner.y,
        };
      });

      layer.getWalls().forEach((wall) => {
        floorplan.walls.push({
          corner1: wall.getStart().id,
          corner2: wall.getEnd().id,
          thickness: wall.thickness,
          thicknessDirection: wall.thicknessDirection,
          isOutsideWall: wall.isOutsideWall,
          interiorTexture: wall.interiorTexture,
          exteriorTexture: wall.exteriorTexture,
          interiorConduction: wall.interiorConduction,
          exteriorConduction: wall.exteriorConduction,
        });
      });

      layer.getRooms().forEach((room) => {
        floorplan.rooms[room.getUuid()] = {
          name: room.name,
          tags: room.tags,
          texture: room.texture,
          conduction: room.conduction,
        };
      });

      layer.getWalls().forEach((wall) => {
        wall.items.forEach((object) => {
          itemsData.push({
            uuid: object.uuid,
            item_name: object.metadata.itemName,
            item_type: object.metadata.itemType,
            model_url: object.metadata.modelUrl || object.metadata.threeModel,
            xpos: object.position.x,
            ypos: object.position.y,
            zpos: object.position.z,
            rotation: object.rotation.y,
            metadata: object.metadata,
            options: object.getOptions(),
          });
        });
      });

      layersData[i] = {
        offset,
        height,
        floorThickness,
        floorplan,
      };
    }

    return {
      buildingOffset: this.buildingOffset,
      layers: layersData,
      roof: roofData,
      obstacle: obstacleData,
      items: itemsData,
    };
  }

  loadFloorplan(data, resetCamera = true, addToUndoStack = false) {
    this.reset();

    // load layers
    const { layers, roof, obstacle } = data;
    this.buildingOffset = data.hasOwnProperty("buildingOffset")
      ? data.buildingOffset
      : 0;

    for (let [index, layerData] of layers.entries()) {
      index -= 0;
      if (!layerData) continue;
      const { floorplan, offset, height, floorThickness } = layerData;

      const layer = this.newLayer(index, offset, height);
      if (floorThickness) layer.setFloorThickness(floorThickness);

      const corners = {};
      if (
        floorplan === null ||
        !("corners" in floorplan) ||
        !("walls" in floorplan)
      ) {
        return;
      }
      for (let id in floorplan.corners) {
        const corner = floorplan.corners[id];
        corners[id] = layer.newCorner(corner.x, corner.y, id);
      }
      floorplan.walls.forEach((wall) => {
        const _wall = layer.newWall(
          corners[wall.corner1],
          corners[wall.corner2]
        );
        if (wall.hasOwnProperty("isOutsideWall"))
          _wall.isOutsideWall = wall.isOutsideWall;
        if (wall.hasOwnProperty("thickness")) _wall.thickness = wall.thickness;
        if (wall.hasOwnProperty("thicknessDirection"))
          _wall.thicknessDirection = wall.thicknessDirection;
        _wall.interiorTexture = wall.interiorTexture;
        _wall.exteriorTexture = wall.exteriorTexture;
        _wall.interiorConduction = wall.interiorConduction;
        _wall.exteriorConduction = wall.exteriorConduction;
      });

      // load obstacle layer
      (() => {
        const { floorplan } = obstacle;

        const layer = this.obstacleLayer;

        const corners = {};
        if (
          floorplan === null ||
          !("corners" in floorplan) ||
          !("walls" in floorplan)
        ) {
          return;
        }

        layer.corners = [];
        layer.walls = [];

        for (let id in floorplan.corners) {
          const corner = floorplan.corners[id];
          corners[id] = layer.newCorner(corner.x, corner.y, id);
        }

        floorplan.walls.forEach((wall) => {
          layer.newWall(
            corners[wall.corner1],
            corners[wall.corner2],
            wall.height
          );
        });
      })();

      layer.calculateRooms(floorplan.rooms);

      this.layers[index] = layer;
    }

    // load roof
    this.roof.loadData(roof, addToUndoStack);

    this.update(resetCamera, addToUndoStack);
    // this.roomLoadedCallbacks.fire();
    this.roomLoadedCallbacks.forEach((cb) => typeof cb === "function" && cb());
  }

  /** */
  reset() {
    this.roof.reset();
    this.obstacleLayer.reset();
    this.layers = [];
  }

  /**
   * Update rooms
   */
  update(resetCamera = true, addToUndoStack = true) {
    const scope = this;
    scope.getActiveLayer() && scope.getActiveLayer().calculateRooms();
    scope.obstacleLayer.calculateRooms();
    scope.roof.calculateFaces();

    scope.assignOrphanEdges();

    addToUndoStack &&
      document.dispatchEvent(
        new CustomEvent(Core.BP3D_EVENT_ADD_TO_UNDO_STACK)
      );

    scope.updated_rooms.forEach((cb) => cb(resetCamera));

    scope.buildingOffsetUpdatedCallbacks.forEach((cb) =>
      cb(scope.buildingOffset)
    );
    scope.layerUpdatedCallbacks.forEach((cb) =>
      cb(scope.getLayers(), scope.getRoomsInfo())
    );
  }

  /**
   * Returns the center of the floorplan in the y plane
   */
  getCenter() {
    return this.getDimensions(true);
  }

  getSize() {
    return this.getDimensions(false);
  }

  getDimensions(center) {
    center = center || false; // otherwise, get size

    let xMin = Infinity;
    let xMax = -Infinity;
    let zMin = Infinity;
    let zMax = -Infinity;

    this.getCorners().forEach((corner) => {
      if (corner.x < xMin) xMin = corner.x;
      if (corner.x > xMax) xMax = corner.x;
      if (corner.y < zMin) zMin = corner.y;
      if (corner.y > zMax) zMax = corner.y;
    });
    let ret;
    if (
      xMin === Infinity ||
      xMax === -Infinity ||
      zMin === Infinity ||
      zMax === -Infinity
    ) {
      ret = new THREE.Vector3();
    } else {
      if (center) {
        // center
        ret = new THREE.Vector3((xMin + xMax) * 0.5, 0, (zMin + zMax) * 0.5);
      } else {
        // size
        ret = new THREE.Vector3(xMax - xMin, 0, zMax - zMin);
      }
    }
    return ret;
  }

  assignOrphanEdges() { }
}
