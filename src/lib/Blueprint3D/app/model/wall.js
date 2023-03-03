import Core from "../core";
import * as THREE from "three";

export const defaultWallTexture = {
  url: `${Core.Configuration.getStringValue(
    "defaultPathPrefix"
  )}/rooms/textures/blank.png`,
  stretch: true,
  scale: 0,
};

export const EXPOSED_SIDE = {
  inside: -1,
  none: 0,
  outside: 1,
};

/**
 * A Wall is the basic element to create Rooms.
 *
 * Walls consists of two half edges.
 */
export default class Wall {
  /** The unique id of each wall. */
  id;

  layer = null;

  /** Front is the plane from start to end. */
  edge = null;

  /** */
  orphan = false;

  locked = false;

  hasRoofInteraction = false;

  windowInfo = null;

  /** Items attached to this wall */
  items = [];

  /** */
  onItems = [];

  interiorTexture = defaultWallTexture;
  exteriorTexture = defaultWallTexture;

  interiorConduction = 0;
  exteriorConduction = 0;

  /** Wall thickness. */
  thickness = Core.Configuration.getNumericValue(Core.configWallThickness);
  thicknessDirection = Core.Configuration.getNumericValue(
    Core.configWallThicknessDirection
  );

  /** */
  isObstacleWall = false;
  isOutsideWall = Core.Configuration.getBooleanValue(Core.configWallIsOutside);

  keepOutsideWall = false;

  offset = 0;

  /** Wall height. */
  height = 0;

  layer = null;

  moved_callbacks = [];
  deleted_callbacks = [];
  action_callbacks = [];

  /**
   * Constructs a new wall.
   * @param start Start corner.
   * @param end End corner.
   */
  constructor(start, end, height = 0) {
    this.start = start;
    this.end = end;

    this.height =
      height || Core.Configuration.getNumericValue(Core.configWallHeight);
    /** Wall thickness. */
    this.thickness = Core.Configuration.getNumericValue(
      Core.configWallThickness
    );
    this.thicknessDirection = Core.Configuration.getNumericValue(
      Core.configWallThicknessDirection
    );
    /** */
    this.isOutsideWall = Core.Configuration.getBooleanValue(
      Core.configWallIsOutside
    );

    this.id = this.getUuid();

    this.start.attachStart(this);
    this.end.attachEnd(this);
  }

  exposedArea() {
    const { edge } = this;
    const isExposedWall = this.checkIsOutsideWall();
    let area = 0;
    if (isExposedWall) {
      const side = this.getExposedSide();
      if (side === EXPOSED_SIDE.outside) return edge.exteriorArea();
      else if (side === EXPOSED_SIDE.inside) return edge.interiorArea();
    } else {
    }
    return area;
  }

  getConduction() {
    const isExposedWall = this.checkIsOutsideWall();
    if (isExposedWall) {
      const side = this.getExposedSide();
      if (side === EXPOSED_SIDE.outside) return this.exteriorConduction || 0;
      else if (side === EXPOSED_SIDE.inside)
        return this.interiorConduction || 0;
    }
    return EXPOSED_SIDE.none;
  }

  getDirection(orientation) {
    let direction = 0;
    const isExposedWall = this.checkIsOutsideWall();
    if (isExposedWall) {
      const side = this.getExposedSide();
      let v = null;
      if (side === EXPOSED_SIDE.outside) v = this.exteriorDirectionVector();
      else if (side === EXPOSED_SIDE.inside) v = this.interiorDirectionVector();
      if (!v) return 0;
      const center = this.getWallCenter();
      v.x -= center.x;
      v.y -= center.y;
      const vec3 = new THREE.Vector3(v.x, 0, v.y);
      const target = new THREE.Vector3(0, 0, -1);
      const normal = vec3.clone().cross(target);
      let angle = vec3.angleTo(target);
      if (normal.y < 0) angle *= -1;
      direction = (angle / Math.PI) * 180 - orientation;
      if (direction < 0) direction += 360;
    }
    return direction;
  }

  getInclination() {
    return 0;
  }

  getWallCentroid() {
    const { layer, height } = this;
    const { floorplan } = layer;
    const center = this.getWallCenter();
    const z = layer.offset + height / 2 + floorplan.buildingOffset;
    return [center.x, center.y, z];
  }

  getWindowShare() {
    return this.windowInfo ? this.windowInfo.coverRate / 100 : 0;
  }

  getWindowHeight() {
    return this.windowInfo ? this.windowInfo.height : 0;
  }

  getWindowSillHeight() {
    return this.windowInfo ? this.windowInfo.sillHeight : 0;
  }

  isStart = (corner) => this.start === corner;
  isEnd = (corner) => this.end === corner;

  toVec2() {
    const { start, end } = this;
    return new THREE.Vector2(end.x - start.x, end.y - start.y);
  }

  getUuid() {
    return [this.start.id, this.end.id].join();
  }

  resetFrontBack() {
    this.edge = null;
  }

  snapToAxis(
    tolerance = Core.Configuration.getNumericValue(Core.configSnapTolernance)
  ) {
    const { floorplan } = this.start;
    const rawCorners = floorplan.getCorners(floorplan.activeLayerIndex);
    const corners = [];
    rawCorners.forEach((corner) => {
      if (corner !== this.start && corner !== this.end) corners.push(corner);
    });

    // // order here is important, but unfortunately arbitrary
    // this.start.snapToAxis(tolerance, corners);
    // this.end.snapToAxis(tolerance, corners);
  }

  removeItem = (item) => {
    if (item) {
      Core.Utils.removeValue(this.items, item);
      item.remove();
    }
  };

  removeItems = () => {
    this.windowInfo = null;
    const { items } = this;
    if (items.length) {
      for (let i = items.length - 1; i >= 0; i--) {
        items[i] && items[i].remove();
      }
    }
    this.items = [];
  };

  fireOnMove(func) {
    this.moved_callbacks.push(func);
  }

  fireOnDelete(func) {
    this.deleted_callbacks.push(func);
  }

  dontFireOnDelete(func) {
    const index = this.deleted_callbacks.indexOf(func);
    // this.deleted_callbacks.remove(func);
    this.deleted_callbacks.splice(index, 1);
  }

  fireOnAction(func) {
    this.action_callbacks.push(func);
  }

  fireAction(action) {
    // this.action_callbacks.fire(action);
    this.action_callbacks.forEach(
      (cb) => typeof cb === "function" && cb(action)
    );
  }

  handleStartMoved = (x, y, prevX, prevY) => {
    const change = {
      prev: {
        start: { x: prevX, y: prevY },
        end: { x: this.getEndX(), y: this.getEndY() },
      },
      current: {
        start: { x, y },
        end: { x: this.getEndX(), y: this.getEndY() },
      },
    };
    this.moveWallItems(change);
  };

  handleEndMoved = (x, y, prevX, prevY) => {
    const change = {
      prev: {
        start: { x: this.getStartX(), y: this.getStartY() },
        end: { x: prevX, y: prevY },
      },
      current: {
        start: { x: this.getStartX(), y: this.getStartY() },
        end: { x, y },
      },
    };
    this.moveWallItems(change);
  };

  move(x, y, snap = true) {
    const center = this.getWallCenter();
    this.relativeMove(x - center.x, y - center.y, snap);
  }

  relativeMove(dx, dy, snap = true, autoMerge = false) {
    if (this.locked || this.start.locked || this.end.locked) return;
    const { start, end } = this;

    const sX = start.x;
    const sY = start.y;
    const eX = end.x;
    const eY = end.y;

    let nsX = sX + dx;
    let nsY = sY + dy;
    let neX = eX + dx;
    let neY = eY + dy;

    const startWalls = [...start.wallStarts, ...start.wallEnds];
    const endWalls = [...end.wallStarts, ...end.wallEnds];
    Core.Utils.removeValue(startWalls, this);
    Core.Utils.removeValue(endWalls, this);

    const { projectionPointToLine, pointDistanceFromLine } = Core.Utils;

    function calculateFixedAngleCorner(opposite, pX, pY) {
      const res = { x: pX, y: pY };

      try {
        const { x, y } = opposite;
        const p1 = projectionPointToLine(x, y, sX, sY, eX, eY);
        const p2 = projectionPointToLine(x, y, nsX, nsY, neX, neY);
        const l = pointDistanceFromLine(x, y, sX, sY, eX, eY);
        const L = pointDistanceFromLine(x, y, nsX, nsY, neX, neY);

        const delta = { x: pX - p1.x, y: pY - p1.y };
        delta.x *= L / l;
        delta.y *= L / l;

        res.x = p2.x + delta.x;
        res.y = p2.y + delta.y;
      } catch (_) {
        res.x = pX;
        res.y = pY;
      }
      return res;
    }

    const mV = new THREE.Vector3(dx, 0, dy);
    const wV = new THREE.Vector3(sX - eX, 0, sY - eY);
    const angle = mV.angleTo(wV);
    if (angle !== 0 && angle !== Math.PI) {
      if (startWalls.length === 1) {
        const wall = startWalls[0];
        const opposite = wall.start === start ? wall.end : wall.start;
        const newP = calculateFixedAngleCorner(opposite, sX, sY);
        nsX = newP.x;
        nsY = newP.y;
      }
      if (endWalls.length === 1) {
        const wall = endWalls[0];
        const opposite = wall.start === end ? wall.end : wall.start;

        const newP = calculateFixedAngleCorner(opposite, eX, eY);
        neX = newP.x;
        neY = newP.y;
      }
    }

    this.start.move(nsX, nsY, false, autoMerge);
    this.end.move(neX, neY, false, autoMerge);

    snap && this.snapToAxis();
    // const change = {
    //   prev: {
    //     start: { x: this.getStartX(), y: this.getStartY() },
    //     end: { x: this.getEndX(), y: this.getEndY() },
    //   },
    // };
    // change.current = {
    //   start: { x: this.getStartX(), y: this.getStartY() },
    //   end: { x: this.getEndX(), y: this.getEndY() },
    // };
    // this.moveWallItems(change);
  }

  moveWallItems(change) {
    const { prev, current } = change;
    if (!this.items.length) return;
    // console.log(prev, current);
    this.items.forEach((item) => {
      const pos = item.position;
      const prevLength = Math.sqrt(
        (prev.start.x - prev.end.x) ** 2 + (prev.start.y - prev.end.y) ** 2
      );

      const prevDistance = Math.sqrt(
        (prev.start.x - pos.x) ** 2 + (prev.start.y - pos.z) ** 2
      );
      const ratio = prevDistance / prevLength;
      const targetPos = {
        x: current.start.x + (current.end.x - current.start.x) * ratio,
        y: pos.y,
        z: current.start.y + (current.end.y - current.start.y) * ratio,
      };
      const dx = targetPos.x - pos.x;
      const dz = targetPos.z - pos.z;

      item.relativeMove(dx, dz);

      const v1 = new THREE.Vector3(
        prev.end.x - prev.start.x,
        0,
        prev.end.y - prev.start.y
      );
      const v2 = new THREE.Vector3(
        current.end.x - current.start.x,
        0,
        current.end.y - current.start.y
      );

      const normal = new THREE.Vector3().copy(v1).cross(v2);

      let dAngle = v1.angleTo(v2);
      if (normal.y < 0) dAngle = -dAngle;

      let angle = item.rotation.y;
      angle += dAngle;
      item.rotation.y = angle;
      item.dimensionHelper.rotation.y = angle;
    });
  }

  fireMoved() {
    // this.moved_callbacks.fire();
    this.moved_callbacks.forEach((cb) => typeof cb === "function" && cb());
  }

  fireRedraw() {
    if (this.edge) {
      this.edge.redrawCallbacks.forEach(
        (cb) => typeof cb === "function" && cb()
      );
    }
  }

  getStart() {
    return this.start;
  }

  getEnd() {
    return this.end;
  }

  getStartX() {
    return this.start.getX();
  }

  getEndX() {
    return this.end.getX();
  }

  getStartY() {
    return this.start.getY();
  }

  getEndY() {
    return this.end.getY();
  }

  remove() {
    this.start.detachWall(this);
    this.end.detachWall(this);
    // this.deleted_callbacks.fire(this);
    this.deleted_callbacks.forEach(
      (cb) => typeof cb === "function" && cb(this)
    );
  }

  setStart(corner) {
    this.start.detachWall(this);
    corner.attachStart(this);
    this.start = corner;
    this.fireMoved();
  }

  setEnd(corner) {
    this.end.detachWall(this);
    corner.attachEnd(this);
    this.end = corner;
    this.fireMoved();
  }

  distanceFrom(x, y) {
    return Core.Utils.pointDistanceFromLine(
      x,
      y,
      this.getStartX(),
      this.getStartY(),
      this.getEndX(),
      this.getEndY()
    );
  }

  closestPoint(x, y) {
    const point = Core.Utils.closestPointOnLine(
      x,
      y,
      this.getStartX(),
      this.getStartY(),
      this.getEndX(),
      this.getEndY()
    );
    const distance = this.distanceFrom(x, y);
    return { point, distance };
  }

  /** Return the corner opposite of the one provided.
   * @param corner The given corner.
   * @returns The opposite corner.
   */
  oppositeCorner(corner) {
    if (this.start === corner) {
      return this.end;
    }
    if (this.end === corner) {
      return this.start;
    }
    console.log("Wall does not connect to corner");
  }

  setLocked(locked) {
    this.locked = locked;
    this.start.setLocked(locked);
    this.end.setLocked(locked);
  }

  getWallCenter() {
    const start = { x: this.start.x, y: this.start.y };
    const end = { x: this.end.x, y: this.end.y };
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };
  }

  getWallArea() {
    const length = this.getWallLength();
    return length * this.height;
  }

  getWallLength() {
    const start = { x: this.start.x, y: this.start.y };
    const end = { x: this.end.x, y: this.end.y };
    const length = Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2);
    return length;
  }

  setWallLength(value) {
    if (value > 0) {
      const rate = value / this.getWallLength();
      let center = { x: 0, y: 0 };

      if (!this.start.locked && !this.end.locked) {
        center = this.getWallCenter();
      } else if (this.start.locked && !this.end.locked) {
        center = {
          x: this.getStartX(),
          y: this.getStartY(),
        };
      } else if (!this.start.locked && this.end.locked) {
        center = {
          x: this.getEndX(),
          y: this.getEndY(),
        };
      } else {
        return;
      }
      /** Start */
      let newX = 0;
      let newY = 0;
      newX = center.x + (this.start.x - center.x) * rate;
      newY = center.y + (this.start.y - center.y) * rate;
      this.start.move(newX, newY, false);

      /** End */
      newX = center.x + (this.end.x - center.x) * rate;
      newY = center.y + (this.end.y - center.y) * rate;
      this.end.move(newX, newY, false);

      // this.planner.view.draw();
    }
  }

  setIsOutsideWall(isOutsideWall) {
    this.isOutsideWall = isOutsideWall;
  }

  exteriorDirectionVector = () => {
    const center = this.getWallCenter();
    const vec = this.toVec2().normalize().multiplyScalar(0.1);
    const vecCenter = new THREE.Vector2(center.x, center.y);

    const p = vecCenter
      .clone()
      .add(vec)
      .rotateAround(vecCenter, Math.PI / 2);
    return p;
  };

  interiorDirectionVector = () => {
    const center = this.getWallCenter();
    const vec = this.toVec2().normalize().multiplyScalar(0.1);
    const vecCenter = new THREE.Vector2(center.x, center.y);

    const p = vecCenter
      .clone()
      .add(vec)
      .rotateAround(vecCenter, -Math.PI / 2);
    return p;
  };

  getRoomInteractionSide = (room) => {
    const p1 = this.exteriorDirectionVector();
    const p2 = this.interiorDirectionVector();
    const e = Core.Utils.pointInPolygon(p1.x, p1.y, room.corners);
    const i = Core.Utils.pointInPolygon(p2.x, p2.y, room.corners);
    if (e) return EXPOSED_SIDE.outside;
    if (i) return EXPOSED_SIDE.inside;
    return EXPOSED_SIDE.none;
  };

  getExposedSide() {
    const { layer } = this;
    const rooms = layer.getRooms();

    const p1 = this.exteriorDirectionVector();
    const p2 = this.interiorDirectionVector();

    let side = EXPOSED_SIDE.none;
    rooms.forEach((room) => {
      // pi
      let res = Core.Utils.pointInPolygon(p1.x, p1.y, room.corners);
      if (res) side = EXPOSED_SIDE.inside; // interior
      res = Core.Utils.pointInPolygon(p2.x, p2.y, room.corners);
      if (res) side = EXPOSED_SIDE.outside; // exterior
    });

    return side;
  }

  checkIsOutsideWall() {
    const { layer } = this;
    const rooms = layer.getRooms();

    const p1 = this.exteriorDirectionVector();
    const p2 = this.interiorDirectionVector();

    let exCount = 0;
    let inCount = 0;
    rooms.forEach((room) => {
      // pi
      let res = Core.Utils.pointInPolygon(p1.x, p1.y, room.corners);
      res && exCount++;
      res = Core.Utils.pointInPolygon(p2.x, p2.y, room.corners);
      res && inCount++;
    });

    return exCount === 0 || inCount === 0 ? true : false;
  }

  findInsideRoomPoint() {
    if (this.checkIsOutsideWall()) {
      const { layer } = this;
      const rooms = layer.getRooms();

      const p1 = this.exteriorDirectionVector();
      const p2 = this.interiorDirectionVector();

      let point = null;
      rooms.forEach((room) => {
        // pi
        let res = Core.Utils.pointInPolygon(p1.x, p1.y, room.corners);
        res && (point = p1);
        res = Core.Utils.pointInPolygon(p2.x, p2.y, room.corners);
        res && (point = p2);
      });
      return point;
    }
    return null;
  }

  checkIsSameFace(wall) {
    const tolerance = 0.1;
    if (
      (this.start.distanceFromCorner(wall.start) < tolerance &&
        this.end.distanceFromCorner(wall.end) < tolerance) ||
      (this.start.distanceFromCorner(wall.end) < tolerance &&
        this.end.distanceFromCorner(wall.start) < tolerance)
    ) {
      return true;
    }
    return false;
  }

  setTexture(texture, conduction = 0) {
    this.interiorTexture = texture;
    this.exteriorTexture = texture;
    this.interiorConduction = this.exteriorConduction = conduction;
  }

  setInteriorTexture(texture, conduction = 0) {
    this.interiorTexture = texture;
    this.interiorConduction = conduction;
  }

  setExteriorTexture(texture, conduction = 0) {
    this.exteriorTexture = texture;
    this.exteriorConduction = conduction;
  }

  /**
   * Detach start and end corners from adjacent walls
   */
  detachFromAdjacentWalls() {
    const { start, end } = this;

    start.detachWall(this);
    end.detachWall(this);

    const newStart = start.clone();
    const newEnd = end.clone();

    this.start = newStart;
    this.end = newEnd;

    this.id = this.getUuid();

    this.start.attachStart(this);
    this.end.attachEnd(this);

    this.start.moved_callbacks.push(this.handleStartMoved);
    this.end.moved_callbacks.push(this.handleEndMoved);
  }

  detachCorner(corner) {
    const { start, end } = this;
    let newCorner = null;
    if (corner === start) {
      start.detachWall(this);
      const newStart = start.clone();
      this.start = newStart;
      this.id = this.getUuid();
      this.start.attachStart(this);
      this.start.moved_callbacks.push(this.handleStartMoved);
      newCorner = newStart;
    } else if (corner === end) {
      end.detachWall(this);
      const newEnd = end.clone();
      this.end = newEnd;
      this.id = this.getUuid();
      this.end.attachEnd(this);
      this.end.moved_callbacks.push(this.handleEndMoved);
      newCorner = newEnd;
    }
    return newCorner;
  }
}
