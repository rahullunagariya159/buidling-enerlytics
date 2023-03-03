import Core from "../core";
import Corner from "./corner";
import HalfEdge from "./half_edge";
import Room from "./room";
import Wall, { defaultWallTexture } from "./wall";

export default class Layer {
  floorplan = null;

  layerIndex = 100;
  layerLabel = "0";

  offset = 0;
  height = Core.Configuration.getNumericValue(Core.configWallHeight);

  floorThickness = Core.Configuration.getNumericValue(
    Core.configFloorThickness
  );

  visible = true;

  corners = [];
  walls = [];
  rooms = [];

  updated_callbacks = [];

  constructor(index, offset, height) {
    this.setLayerIndex(index);
    this.offset = offset;
    this.height = height;
  }

  setLayerIndex = (index) => {
    this.layerIndex = index;
    this.layerLabel = index < 100 ? `B${100 - index}` : `${index - 100}`;
  };

  setOffset = (offset) => {
    let delta = this.offset - offset;
    this.offset = offset;
    const wallItems = [];
    this.walls.forEach((wall) => {
      wallItems.push(...wall.items);
    });
    wallItems.forEach((item) => {
      item.position.y -= delta;
      item.moveChildMeshes();
      item.rotateChildMeshes();
    });
    this.calculateRooms();
  };

  setHeight = (height) => {
    this.height = height;
    this.walls.forEach((wall) => {
      wall.height = height;
    });
  };

  setVisible = (visible) => {
    this.visible = visible;
    this.walls.forEach((wall) =>
      wall.items.forEach((item) => {
        item.forceVisible = visible;
        item.visible = visible;
      })
    );
    this.rooms.forEach((room) => (room.visible = visible));
  };

  setFloorThickness = (thickness) => {
    this.floorThickness = thickness;
  };

  remove = () => {
    this.walls.forEach((wall) => {
      wall.removeItems();
    });
    this.corners = [];
    this.walls = [];
  };

  update = () => {
    this.calculateRooms();
    this.updated_callbacks.forEach((cb) => cb());
  };

  /**
   * Creates a new corner.
   * @param x The x coordinate.
   * @param y The y coordinate.
   * @param id An optional id. If unspecified, the id will be created internally.
   * @returns The new corner.
   */
  newCorner(x, y, id) {
    var corner = new Corner(this.floorplan, x, y, id);
    corner.layer = this;
    corner.fireOnDelete(this.removeCorner);
    this.corners.push(corner);
    return corner;
  }

  getCorners = () => {
    return this.corners.filter((c) => c.layer.layerIndex === this.layerIndex);
  };

  /** Removes a corner.
   * @param corner The corner to be removed.
   */
  removeCorner = (corner) => {
    Core.Utils.removeValue(this.corners, corner);
    this.rooms.forEach((room) => {
      const { corners } = room;
      if (corners.includes(corner)) {
        Core.Utils.removeValue(corners, corner);
      }
    });
    // this.update();
  };

  /**
   * Creates a new wall.
   * @param start The start corner.
   * @param end he end corner.
   * @returns The new wall.
   */
  newWall(start, end, height = this.height, autoSplit = false) {
    if (!start || !end) return;
    if (this.checkWallIsExist(start, end)) return;
    let hasCrossWall = false;
    autoSplit && (hasCrossWall = this.autoSplitWalls(start, end));
    if (!hasCrossWall) {
      var wall = new Wall(start, end, height);
      wall.layer = this;
      wall.fireOnDelete(this.removeWall);
      this.walls.push(wall);
      return wall;
    }
    return null;
  }

  checkWallIsExist = (start, end) => {
    let exist = false;
    this.walls.forEach((w) => {
      let _start = w.start;
      let _end = w.end;
      if (
        _start.distanceFrom(start.x, start.y) === 0 &&
        _end.distanceFrom(end.x, end.y) === 0
      ) {
        exist = true;
      } else if (
        _end.distanceFrom(start.x, start.y) === 0 &&
        _start.distanceFrom(end.x, end.y) === 0
      ) {
        exist = true;
      }
    });
    return exist;
  };

  autoSplitWalls = (start, end) => {
    let points = [start, end];
    const vertexTolerance = Core.Configuration.getNumericValue(
      Core.configSnapTolernance
    );
    let hasCrossWall = false;
    const { walls } = this;
    const count = walls.length;

    const newPoints = [];
    for (let i = 0; i < count; i++) {
      const wall = walls[i];
      if (!points.includes(wall.start) && !points.includes(wall.end)) {
        const s = start;
        const e = end;
        const _s = wall.start;
        const _e = wall.end;
        const p = Core.Utils.findLineLineCrossPoint(
          s.x,
          s.y,
          e.x,
          e.y,
          _s.x,
          _s.y,
          _e.x,
          _e.y,
          true
        );
        if (p) {
          if (
            start.distanceFrom(p.x, p.y) < vertexTolerance ||
            end.distanceFrom(p.x, p.y) < vertexTolerance
          ) {
            continue;
          }
          hasCrossWall = true;
          const corner = this.newCorner(p.x, p.y);
          newPoints.push(corner);

          // split exist wall
          wall.setEnd(corner);
          this.newWall(corner, _e, this.height);
        }
      }
    }

    if (hasCrossWall) {
      newPoints.sort((a, b) => {
        let dA = a.distanceFrom(start.x, start.y);
        let dB = b.distanceFrom(start.x, start.y);
        return dA - dB;
      });
      points = [start, ...newPoints, end];
      for (let i = 0; i < points.length - 1; i++) {
        let s = points[i];
        let e = points[i + 1];
        this.newWall(s, e, this.height);
      }
    }
    return hasCrossWall;
  };

  getWalls = () => {
    this.walls.forEach((wall) => {
      if (!wall.edge) {
        wall.orphan = true;
        const back = new HalfEdge(null, wall, this.offset);
        back.generatePlane();
      }
    });
    return this.walls.filter((w) => w.layer.layerIndex === this.layerIndex);
  };

  /** Removes a wall.
   * @param wall The wall to be removed.
   */
  removeWall = (wall) => {
    wall.removeItems();
    Core.Utils.removeValue(this.walls, wall);
    // this.update();
  };

  reduceWalls() {
    const corners = this.corners;
    for (let i = corners.length - 1; i >= 0; i--) {
      const corner = corners[i];
      const walls = [...corner.wallStarts, ...corner.wallEnds];
      if (walls.length === 2) {
        corner.updateAngles();
        if (corner.angles[0] === 180) {
          const newCorner = walls[1].oppositeCorner(corner);
          newCorner.detachWall(walls[1]);
          if (walls[0].isStart(corner)) {
            walls[0].start = newCorner;
            newCorner.attachStart(walls[0]);
          } else {
            walls[0].end = newCorner;
            newCorner.attachEnd(walls[0]);
          }
          this.removeCorner(corner);
          this.removeWall(walls[1]);
        }
      }
    }
  }

  getRooms = () => {
    this.rooms.forEach((room) => (room.floorThickness = this.floorThickness));
    return this.rooms;
  };

  calculateRooms(initialData = {}) {
    const rooms = [];
    const roomCorners = this.findRooms(this.corners);

    const generateRoomName = () => {
      let roomIndex = rooms.length + 1;
      if (roomIndex < 10) roomIndex = "0" + roomIndex;
      return `Room ${this.layerLabel}${roomIndex}`;
    };
    roomCorners.forEach((corners) => {
      const uuid = Room.getUuidByCorners(corners);

      const newRoom = new Room(this, corners, this.offset, this.height);

      if (initialData[uuid]) {
        newRoom.name = initialData[uuid].name;
        newRoom.tags = Array.isArray(initialData[uuid].tags)
          ? initialData[uuid].tags
          : [];
        newRoom.texture = initialData[uuid].texture;
        newRoom.conduction = initialData[uuid].conduction;
      } else {
        const tmp = this.rooms.filter((room) => room.getUuid() === uuid);
        if (tmp.length) {
          // restore prev properties
          newRoom.name = tmp[0].nameChanged ? tmp[0].name : generateRoomName();
          // newRoom.name = generateRoomName();
          newRoom.tags = tmp[0].tags;
          newRoom.texture = tmp[0].texture;
          newRoom.conduction = tmp[0].conduction;
          newRoom.visible = tmp[0].visible;
        } else {
          newRoom.name = generateRoomName();
        }
      }
      rooms.push(newRoom);
    });

    this.rooms = rooms;
    this.walls.forEach((wall) => {
      wall.edge && wall.edge.generatePlane();
      if (wall.keepOutsideWall) {
        if (wall.prevIsOutsideWall && !wall.isOutsideWall) {
          wall.interiorTexture = defaultWallTexture;
          wall.exteriorTexture = defaultWallTexture;
          wall.removeItems();
          wall.prevIsOutsideWall = wall.isOutsideWall;
        }
        return;
      }
      if (!wall.checkIsOutsideWall()) wall.isOutsideWall = false;
      else wall.isOutsideWall = true;
    });
  }

  findRooms(corners) {
    function _calculateTheta(previousCorner, currentCorner, nextCorner) {
      return Core.Utils.angle2pi(
        previousCorner.x - currentCorner.x,
        previousCorner.y - currentCorner.y,
        nextCorner.x - currentCorner.x,
        nextCorner.y - currentCorner.y
      );
    }

    function _removeDuplicateRooms(roomArray) {
      const results = [];
      const lookup = {};
      const hashFunc = function (corner) {
        return corner.id;
      };
      const sep = "-";
      for (let i = 0; i < roomArray.length; i++) {
        // rooms are cycles, shift it around to check uniqueness
        let add = true;
        const room = roomArray[i];
        for (let j = 0; j < room.length; j++) {
          const roomShift = Core.Utils.cycle(room, j);
          var str = Core.Utils.map(roomShift, hashFunc).join(sep);
          if (lookup.hasOwnProperty(str)) {
            add = false;
          }
        }
        if (add) {
          results.push(roomArray[i]);
          lookup[str] = true;
        }
      }
      return results;
    }

    function _findTightestCycle(firstCorner, secondCorner) {
      const stack = [];

      let next = {
        corner: secondCorner,
        previousCorners: [firstCorner],
      };
      const visited = {};
      visited[firstCorner.id] = true;

      while (next) {
        // update previous corners, current corner, and visited corners
        const currentCorner = next.corner;
        visited[currentCorner.id] = true;

        // did we make it back to the startCorner?
        if (next.corner === firstCorner && currentCorner !== secondCorner) {
          return next.previousCorners;
        }

        const addToStack = [];
        const adjacentCorners = next.corner.adjacentCorners();
        for (let i = 0; i < adjacentCorners.length; i++) {
          const nextCorner = adjacentCorners[i];

          // is this where we came from?
          // give an exception if its the first corner and we aren't at the second corner
          if (
            nextCorner.id in visited &&
            !(nextCorner === firstCorner && currentCorner !== secondCorner)
          ) {
            continue;
          }

          // nope, throw it on the queue
          addToStack.push(nextCorner);
        }

        const previousCorners = next.previousCorners.slice(0);
        previousCorners.push(currentCorner);
        if (addToStack.length > 1) {
          // visit the ones with smallest theta first
          const previousCorner =
            next.previousCorners[next.previousCorners.length - 1];
          addToStack.sort(function (a, b) {
            return (
              _calculateTheta(previousCorner, currentCorner, b) -
              _calculateTheta(previousCorner, currentCorner, a)
            );
          });
        }

        if (addToStack.length > 0) {
          // add to the stack
          addToStack.forEach((corner) => {
            stack.push({
              corner: corner,
              previousCorners: previousCorners,
            });
          });
        }

        // pop off the next one
        next = stack.pop();
      }
      return [];
    }

    // find tightest loops, for each corner, for each adjacent
    // TODO: optimize this, only check corners with > 2 adjacents, or isolated cycles
    const loops = [];

    corners.forEach((firstCorner) => {
      firstCorner.adjacentCorners().forEach((secondCorner) => {
        loops.push(_findTightestCycle(firstCorner, secondCorner));
      });
    });

    // remove duplicates
    const uniqueLoops = _removeDuplicateRooms(loops);
    //remove CW loops
    return Core.Utils.removeIf(uniqueLoops, Core.Utils.isClockwise);
  }

  getArea() {
    let area = 0;
    this.rooms.forEach((room) => {
      area += room.updateArea(true).area;
    });
    return area;
  }

  getLayerMetadata(orientation = 0) {
    const layer = this;

    const RoomName = [];
    const RoomHeight = [];
    const RoomVolume = [];
    const WallArea = [];
    const WallOutside = [];
    const WallConduction = [];
    const WallDirection = [];
    const WallInclination = [];
    const WallCentroid = [];
    const WindowShare = [];
    const WindowHeight = [];
    const WindowSillHeight = [];
    const UsableFloorArea = [];
    const RoomCentroid = [];
    const TotalFloorArea = [];
    const FloorOutside = [];
    const RoomAboveGround = [];

    const o = orientation;
    layer.getRooms().forEach((room) => {
      const offset = layer.offset + this.floorplan.buildingOffset;

      const { walls, inclinedWalls } = room;
      const areaCenter = room.getRoomCentriod();
      RoomName.push(room.name);
      RoomHeight.push(room.height);
      RoomVolume.push(room.getRoomVolume());
      UsableFloorArea.push(room.getFloorArea());
      RoomCentroid.push([areaCenter.x, areaCenter.y, offset + room.height / 2]);
      TotalFloorArea.push(room.updateArea(true).area || room.getFloorArea());
      FloorOutside.push(true);
      RoomAboveGround.push(offset >= 0);

      const validWalls = [...walls, ...inclinedWalls].filter(
        (_w) => _w.exposedArea() > 0
      );

      const _wallArea = validWalls.map((_w) => _w.exposedArea());
      const _wallOutside = validWalls.map((_w) => _w.checkIsOutsideWall());
      const _wallConduction = validWalls.map((_w) => _w.getConduction());
      const _wallDirection = validWalls.map((_w) => _w.getDirection(o));
      const _wallInclination = validWalls.map((_w) => _w.getInclination());
      const _wallCentroid = validWalls.map((_w) => _w.getWallCentroid());
      const _windowShare = validWalls.map((_w) => _w.getWindowShare());
      const _windowHeight = validWalls.map((_w) => _w.getWindowHeight());
      const _windowSillHeight = validWalls.map((_w) =>
        _w.getWindowSillHeight()
      );

      // floor & ceiling
      if (room.getFloorArea() > 0) {
        _wallArea.push(room.getFloorArea());
        _wallOutside.push(false);
        _wallConduction.push(room.conduction || 0);
        _wallDirection.push(0);
        _wallInclination.push(90);
        _wallCentroid.push([areaCenter.x, offset, areaCenter.y]);
        _windowShare.push(0);
        _windowHeight.push(0);
        _windowSillHeight.push(0);
      }
      if (room.getCeilingArea() > 0) {
        _wallArea.push(room.getCeilingArea());
        _wallOutside.push(false);
        _wallConduction.push(0);
        _wallDirection.push(0);
        _wallInclination.push(90);
        _wallCentroid.push([areaCenter.x, offset, areaCenter.y]);
        _windowShare.push(0);
        _windowHeight.push(0);
        _windowSillHeight.push(0);
      }
      WallArea.push(_wallArea);
      WallOutside.push(_wallOutside);
      WallConduction.push(_wallConduction);
      WallDirection.push(_wallDirection);
      WallInclination.push(_wallInclination);
      WallCentroid.push(_wallCentroid);
      WindowShare.push(_windowShare);
      WindowHeight.push(_windowHeight);
      WindowSillHeight.push(_windowSillHeight);
    });

    return {
      RoomName,
      RoomHeight,
      RoomVolume,
      WallArea,
      WallOutside,
      WallConduction,
      WallDirection,
      WallInclination,
      WallCentroid,
      WindowShare,
      WindowHeight,
      WindowSillHeight,
      UsableFloorArea,
      RoomCentroid,
      TotalFloorArea,
      FloorOutside,
      RoomAboveGround,
    };
  }
}
