import * as THREE from "three";

import Core from "../core";
import HalfEdge from "./half_edge";
import InclinedWall from "./inclinedWall";
import { EXPOSED_SIDE } from "./wall";

const defaultRoomTexture = {
  url: `${Core.Configuration.getStringValue(
    "defaultPathPrefix"
  )}rooms/textures/marbletiles.jpg`,
  scale: 4,
};

/**
 * A Room is the combination of a Floorplan with a floor plane.
 */
export default class Room {
  /** */
  interiorCorners = [];
  baseCorners = [];

  floorCorners = [];
  ceilingCorners = [];

  corners = [];

  walls = [];
  inclinedWalls = [];

  hull = [];

  tags = [];

  name = "Room";
  nameChanged = false;

  area = 0;
  areaCenter = {};

  visible = true;

  /** */
  edgePointer = null;

  /** floor plane for intersection testing */
  floorPlane = null;

  /** */
  customTexture = false;

  /** */
  floorChangeCallbacks = [];

  layer = null;

  texture = defaultRoomTexture;

  conduction = 0;

  offset = 0;
  height = Core.Configuration.getNumericValue(Core.configWallHeight);

  /**
   *  ordered CCW
   */
  constructor(layer, corners, offset, height) {
    this.layer = layer;
    this.corners = corners;
    this.offset = offset;
    this.height = height;
    this.updateWalls();
    this.updateInteriorCorners();
    this.updateBaseCorners();
    this.updateArea();
  }

  setName = (name) => {
    this.name = name;
    this.nameChanged = true;
  };

  clearInclinedWalls = () => {
    this.inclinedWalls = [];
  };

  getRoomVolume = () => {
    try {
      const { hull } = this;
      function getVolume(geometry) {
        if (!geometry.isBufferGeometry) {
          console.log(
            "'geometry' must be an indexed or non-indexed buffer geometry"
          );
          return 0;
        }
        var isIndexed = geometry.index !== null;
        let position = geometry.attributes.position;
        let sum = 0;
        let p1 = new THREE.Vector3(),
          p2 = new THREE.Vector3(),
          p3 = new THREE.Vector3();
        if (!isIndexed) {
          let faces = position.count / 3;
          for (let i = 0; i < faces; i++) {
            p1.fromBufferAttribute(position, i * 3 + 0);
            p2.fromBufferAttribute(position, i * 3 + 1);
            p3.fromBufferAttribute(position, i * 3 + 2);
            sum += signedVolumeOfTriangle(p1, p2, p3);
          }
        } else {
          let index = geometry.index;
          let faces = index.count / 3;
          for (let i = 0; i < faces; i++) {
            p1.fromBufferAttribute(position, index.array[i * 3 + 0]);
            p2.fromBufferAttribute(position, index.array[i * 3 + 1]);
            p3.fromBufferAttribute(position, index.array[i * 3 + 2]);
            sum += signedVolumeOfTriangle(p1, p2, p3);
          }
        }
        return sum;
      }

      function signedVolumeOfTriangle(p1, p2, p3) {
        return p1.dot(p2.cross(p3)) / 6.0;
      }
      return getVolume(hull);
    } catch (_) {
      return 0;
    }
  };

  addInclinedWall = (corners, plane) => {
    this.inclinedWalls.push(new InclinedWall(this, corners, plane));
  };

  getRoomCentriod = () => {
    return Core.Utils.centroid(this.floorCorners);
  };

  getFloorArea = () => {
    return Core.Utils.area(this.floorCorners);
  };

  getCeilingArea = () => {
    return Core.Utils.area(this.ceilingCorners);
  };

  static getUuidByCorners = (corners = []) => {
    return Core.Utils.map(corners, (c) => c.id)
      .sort()
      .join();
  };

  getUuid() {
    return this.constructor.getUuidByCorners(this.corners);
  }

  fireOnFloorChange(callback) {
    this.floorChangeCallbacks.push(callback);
  }

  getTexture() {
    return this.texture || defaultRoomTexture;
  }

  updateArea(ignoreWall = false) {
    this.area = Core.Utils.area(this.corners);
    this.areaCenter = Core.Utils.centroid(this.corners);

    let wallArea = 0;
    this.walls.forEach((wall) => {
      const side = wall.getRoomInteractionSide(this);
      if (side === EXPOSED_SIDE.none) return;
      const { edge } = wall;
      if (side === EXPOSED_SIDE.outside) {
        // exterior
        wallArea += Core.Utils.area([
          edge.midStart(),
          edge.exteriorStart(),
          edge.exteriorEnd(),
          edge.midEnd(),
        ]);
      } else if (side === EXPOSED_SIDE.inside) {
        // interior
        wallArea += Core.Utils.area([
          edge.midStart(),
          edge.interiorStart(),
          edge.interiorEnd(),
          edge.midEnd(),
        ]);
      }
    });
    !ignoreWall && (this.area -= wallArea);
    return this;
  }

  /**
   * textureStretch always true, just an argument for consistency with walls
   */
  setTexture(textureUrl, conduction = 0) {
    console.log(conduction);
    this.texture = {
      url: textureUrl,
      scale: 1,
      width: 1,
      height: 1,
    };
    this.conduction = conduction;
    document.dispatchEvent(new CustomEvent(Core.BP3D_EVENT_ADD_TO_UNDO_STACK));
    // this.floorChangeCallbacks.fire();
    this.floorChangeCallbacks.forEach((cb) => typeof cb === "function" && cb());
  }

  cycleIndex(index) {
    if (index < 0) {
      return (index += this.corners.length);
    }
    return index % this.corners.length;
  }

  updateInteriorCorners() {
    if (this.corners.length === 0) return;
    const visited = {};
    this.interiorCorners = [];
    let startCorner = this.corners[0];
    let corner = this.corners[0];
    while (true) {
      visited[corner.id] = true;
      this.interiorCorners.push({ x: corner.x, y: corner.y });
      const walls = [...corner.wallStarts, ...corner.wallEnds].filter(
        (wall) => {
          let count = 0;
          this.corners.includes(wall.start) && count++;
          this.corners.includes(wall.end) && count++;
          return count === 2;
        }
      );
      if (walls.length === 0) break;
      let newCorner = null;
      for (const wall of walls) {
        const opposite = wall.oppositeCorner(corner);
        if (!visited[opposite.id]) {
          wall.edge && wall.edge.generatePlane();
          newCorner = opposite;
          break;
        }
      }
      if (!newCorner) break;
      corner = newCorner;
      if (corner === startCorner) {
        break;
      }
    }
  }

  updateBaseCorners() {
    this.baseCorners = [];
    const { interiorCorners, walls } = this;
    for (let i = 0; i < interiorCorners.length; i++) {
      let _current = interiorCorners[i];
      let _next = interiorCorners[(i + 1) % interiorCorners.length];
      let wall = null;
      for (let w of walls) {
        const { start, end } = w;
        const _c =
          start.distanceFrom(_current.x, _current.y) === 0 ||
          end.distanceFrom(_current.x, _current.y) === 0;
        const _n =
          start.distanceFrom(_next.x, _next.y) === 0 ||
          end.distanceFrom(_next.x, _next.y) === 0;
        if (_c && _n) {
          wall = w;
          break;
        }
      }
      if (!wall) continue;
      const { edge } = wall;

      const side = wall.getRoomInteractionSide(this);
      if (_current.x === wall.start.x && _current.y === wall.start.y) {
        let start = edge.midStart();
        let end = edge.midEnd();
        if (side === EXPOSED_SIDE.inside) {
          start = edge.exteriorStart();
          end = edge.exteriorEnd();
        } else if (side === EXPOSED_SIDE.outside) {
          start = edge.interiorStart();
          end = edge.interiorEnd();
        }
        this.baseCorners.push(start, end);
      } else if (_current.x === wall.end.x && _current.y === wall.end.y) {
        let start = edge.midStart();
        let end = edge.midEnd();
        if (side === EXPOSED_SIDE.inside) {
          start = edge.exteriorStart();
          end = edge.exteriorEnd();
        } else if (side === EXPOSED_SIDE.outside) {
          start = edge.interiorStart();
          end = edge.interiorEnd();
        }
        this.baseCorners.push(end, start);
      }
    }
  }

  /**
   * Populates each wall's half edge relating to this room
   * this creates a fancy doubly connected edge list (DCEL)
   */
  updateWalls() {
    this.walls = [];
    for (let i = 0; i < this.corners.length; i++) {
      const firstCorner = this.corners[i];
      const secondCorner = this.corners[(i + 1) % this.corners.length];

      // find if wall is heading in that direction
      const wallTo = firstCorner.wallTo(secondCorner);
      const wallFrom = firstCorner.wallFrom(secondCorner);

      if (wallTo) {
        var edge = new HalfEdge(this, wallTo, this.offset);
        this.walls.push(wallTo);
        edge.generatePlane();
      } else if (wallFrom) {
        edge = new HalfEdge(this, wallFrom, this.offset);
        this.walls.push(wallFrom);
        edge.generatePlane();
      } else {
        // something horrible has happened
        console.log("corners arent connected by a wall, uh oh");
      }
    }
  }
}
