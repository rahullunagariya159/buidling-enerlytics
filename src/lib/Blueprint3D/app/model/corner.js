import * as THREE from "three";
import Core from "../core";
const cornerTolerance = Core.Configuration.getNumericValue(
  Core.configSnapTolernance
);

/**
 * Corners are used to define Walls.
 */
export default class Corner {
  layer = null;

  wallStarts = [];
  wallEnds = [];

  moved_callbacks = [];
  deleted_callbacks = [];
  action_callbacks = [];

  locked = false;

  angles = [];
  angleDirections = [];
  startAngles = [];
  endAngles = [];
  cyclicNeighbors = [];

  /** Constructs a corner.
   * @param floorplan The associated floorplan.
   * @param x X coordinate.
   * @param y Y coordinate.
   * @param id An optional unique id. If not set, created internally.
   */
  constructor(floorplan, x, y, id) {
    this.floorplan = floorplan;
    this.x = x;
    this.y = y;
    this.id = id || Core.Utils.guid();
  }

  clone() {
    const { x, y, layer } = this;
    const newCorner = layer.newCorner(x, y);
    return newCorner;
  }

  /** Add function to moved callbacks.
   * @param func The function to be added.
   */
  fireOnMove(func) {
    this.moved_callbacks.push(func);
  }

  /** Add function to deleted callbacks.
   * @param func The function to be added.
   */
  fireOnDelete(func) {
    this.deleted_callbacks.push(func);
  }

  /** Add function to action callbacks.
   * @param func The function to be added.
   */
  fireOnAction(func) {
    this.action_callbacks.push(func);
  }

  /**
   * @returns
   * @deprecated
   */
  getX() {
    return this.x;
  }

  /**
   * @returns
   * @deprecated
   */
  getY() {
    return this.y;
  }

  getLocation() {
    return new THREE.Vector2(this.x, this.y);
  }

  snap() {
    const pointByAxis = this.getSnapByAxis();
    const pointByAngles = this.getSnapByAngles();

    const rawPoints = [];
    pointByAxis && rawPoints.push(pointByAxis);
    pointByAngles && rawPoints.push(pointByAngles);

    const points = rawPoints.sort(
      (a, b) => this.distanceFrom(a.x, a.y) - this.distanceFrom(b.x, b.y)
    );
    if (points.length) {
      this.x = points[0].x;
      this.y = points[0].y;
    }
  }

  getSnapByAxis(tolerance = cornerTolerance, corners, point) {
    if (!Core.Configuration.getBooleanValue(Core.configSnapMode)) return;
    point = point || { x: this.x, y: this.y };
    let snapped = false;
    corners = corners || this.adjacentCorners();
    for (let corner of corners) {
      if (Math.abs(corner.x - this.x) < tolerance) {
        point.x = corner.x;
        snapped = true;
      }
      if (Math.abs(corner.y - this.y) < tolerance) {
        point.y = corner.y;
        snapped = true;
      }
    }
    return snapped ? point : null;
  }

  /**
   * Snap point to snap angle
   * @param {Number} tolerance tolerance degree
   * @returns
   */
  getSnapByAngles(tolerance = 2, x, y) {
    if (!Core.Configuration.getBooleanValue(Core.configSnapMode)) return;
    const snapAngles = [
      30, 45, 60, 90, 120, 135, 150, 210, 225, 240, 270, 300, 315, 330,
    ];
    var neighbors = this.adjacentCorners();
    if (neighbors.length < 2) {
      return;
    }
    x = x || this.x;
    y = y || this.y;
    var start = new THREE.Vector2(x, y);
    var points = [];
    for (var i = 0; i < neighbors.length; i++) {
      points.push(new THREE.Vector2(neighbors[i].x, neighbors[i].y));
    }

    var indicesAndAngles = Core.Utils.getCyclicOrder(points, start);
    var indices = indicesAndAngles["indices"];
    var angles = indicesAndAngles["angles"];
    var N = indices.length < 3 ? 1 : indices.length;
    for (i = 0; i < N; i++) {
      const next = (i + 1) % indices.length;
      const cindex = indices[i];
      const nindex = indices[next];

      const vectorA = points[cindex].clone();
      const vectorB = points[nindex].clone();

      const angle = Math.abs(angles[next] - angles[i]);
      const snapAngle = [...snapAngles].sort(
        (a, b) => Math.abs(a - angle) - Math.abs(b - angle)
      )[0];
      if (Math.abs(snapAngle - angle) > tolerance) continue;
      const diffAngle = snapAngle - angle;
      const vectorNew = vectorB
        .clone()
        .rotateAround(start.clone(), (diffAngle * Math.PI) / 180);

      const tmpStart = start.clone().add(vectorB.clone().sub(vectorNew));
      const newStart = Core.Utils.findLineLineCrossPoint(
        vectorA.x,
        vectorA.y,
        start.x,
        start.y,
        vectorB.x,
        vectorB.y,
        tmpStart.x,
        tmpStart.y
      );
      if (newStart) {
        snapAngle === 180 && console.log(newStart);
        return {
          x: newStart.x,
          y: newStart.y,
        };
      }
    }
    return null;
  }

  /** Moves corner relatively to new position.
   * @param dx The delta x.
   * @param dy The delta y.
   */
  relativeMove(dx, dy) {
    if (this.locked) return;
    this.move(this.x + dx, this.y + dy);
  }

  fireAction(action) {
    // this.action_callbacks.fire(action);
    this.action_callbacks.forEach(
      (cb) => typeof cb === "function" && cb(action)
    );
  }

  /** Remove callback. Fires the delete callbacks. */
  remove() {
    // this.deleted_callbacks.fire(this);
    this.deleted_callbacks.forEach(
      (cb) => typeof cb === "function" && cb(this)
    );
  }

  /** Removes all walls. */
  removeAll() {
    [...this.wallStarts, ...this.wallEnds].forEach((wall) => wall.remove());
    this.remove();
  }

  /** Moves corner to new position.
   * @param newX The new x position.
   * @param newY The new y position.
   */
  move(newX, newY, willSnap = true, autoMerge = true) {
    if (this.locked) return;
    const prevX = this.x;
    const prevY = this.y;
    this.x = newX;
    this.y = newY;
    autoMerge && this.mergeWithIntersected();

    // willSnap && this.snap();
    // willSnap && this.snapToAngles();

    // this.moved_callbacks.fire(this.x, this.y);
    this.moved_callbacks.forEach(
      (cb) => typeof cb === "function" && cb(this.x, this.y, prevX, prevY)
    );

    this.wallStarts.forEach((wall) => {
      wall.fireMoved();
    });

    this.wallEnds.forEach((wall) => {
      wall.fireMoved();
    });
  }

  /** Gets the adjacent corners.
   * @returns Array of corners.
   */
  adjacentCorners() {
    const retArray = [];
    for (var i = 0; i < this.wallStarts.length; i++) {
      retArray.push(this.wallStarts[i].getEnd());
    }
    for (i = 0; i < this.wallEnds.length; i++) {
      retArray.push(this.wallEnds[i].getStart());
    }
    return retArray;
  }

  /** Checks if a wall is connected.
   * @param wall A wall.
   * @returns True in case of connection.
   */
  isWallConnected(wall) {
    for (var i = 0; i < this.wallStarts.length; i++) {
      if (this.wallStarts[i] === wall) {
        return true;
      }
    }
    for (i = 0; i < this.wallEnds.length; i++) {
      if (this.wallEnds[i] === wall) {
        return true;
      }
    }
    return false;
  }

  /**
   *
   */
  distanceFrom(x, y) {
    const distance = Core.Utils.distance(x, y, this.x, this.y);
    // console.log('x,y ' + x + ',' + y + ' to ' + this.getX() + ',' + this.getY() + ' is ' + distance);
    return distance;
  }

  /** Gets the distance from a wall.
   * @param wall A wall.
   * @returns The distance.
   */
  distanceFromWall(wall) {
    return wall.distanceFrom(this.x, this.y);
  }

  /** Gets the distance from a corner.
   * @param corner A corner.
   * @returns The distance.
   */
  distanceFromCorner(corner) {
    return this.distanceFrom(corner.x, corner.y);
  }

  /** Detaches a wall.
   * @param wall A wall.
   */
  detachWall(wall) {
    Core.Utils.removeValue(this.wallStarts, wall);
    Core.Utils.removeValue(this.wallEnds, wall);
    if (this.wallStarts.length === 0 && this.wallEnds.length === 0) {
      this.remove();
    }
  }

  /** Attaches a start wall.
   * @param wall A wall.
   */
  attachStart(wall) {
    this.wallStarts.push(wall);
  }

  /** Attaches an end wall.
   * @param wall A wall.
   */
  attachEnd(wall) {
    this.wallEnds.push(wall);
  }

  /** Get wall to corner.
   * @param corner A corner.
   * @return The associated wall or null.
   */
  wallTo(corner) {
    for (let i = 0; i < this.wallStarts.length; i++) {
      if (this.wallStarts[i].getEnd() === corner) {
        return this.wallStarts[i];
      }
    }
    return null;
  }

  /** Get wall from corner.
   * @param corner A corner.
   * @return The associated wall or null.
   */
  wallFrom(corner) {
    for (let i = 0; i < this.wallEnds.length; i++) {
      if (this.wallEnds[i].getStart() === corner) {
        return this.wallEnds[i];
      }
    }
    return null;
  }

  /** Get wall to or from corner.
   * @param corner A corner.
   * @return The associated wall or null.
   */
  wallToOrFrom(corner) {
    return this.wallTo(corner) || this.wallFrom(corner);
  }

  /**
   *
   */
  combineWithCorner(corner) {
    // update position to other corner's
    this.x = corner.x;
    this.y = corner.y;
    // absorb the other corner's wallStarts and wallEnds
    for (var i = corner.wallStarts.length - 1; i >= 0; i--) {
      corner.wallStarts[i].setStart(this);
    }
    for (i = corner.wallEnds.length - 1; i >= 0; i--) {
      corner.wallEnds[i].setEnd(this);
    }
    // delete the other corner
    corner.removeAll();
    this.removeDuplicateWalls();
  }

  mergeWithIntersected() {
    const { layer } = this;
    if (!layer) return;
    // check corners
    const corners = layer.getCorners();
    for (var i = 0; i < corners.length; i++) {
      const corner = corners[i];
      if (
        this.distanceFromCorner(corner) < cornerTolerance &&
        corner !== this
      ) {
        this.combineWithCorner(corner);
        return true;
      }
    }

    // check walls
    const walls = layer.getWalls();
    const rooms = layer.getRooms();
    for (i = 0; i < walls.length; i++) {
      const wall = walls[i];
      if (
        this.distanceFromWall(wall) < cornerTolerance &&
        !this.isWallConnected(wall)
      ) {
        // update position to be on wall
        const intersection = Core.Utils.closestPointOnLine(
          this.x,
          this.y,
          wall.getStart().x,
          wall.getStart().y,
          wall.getEnd().x,
          wall.getEnd().y
        );
        this.x = intersection.x;
        this.y = intersection.y;
        wall.removeItems();
        // merge this corner into wall by breaking wall into two parts
        const height = layer.height;
        const _wall = layer.newWall(this, wall.getEnd(), height, true);
        try {
          _wall.thickness = wall.thickness;
          _wall.thicknessDirection = wall.thicknessDirection;
          _wall.isOutsideWall = wall.isOutsideWall;
          _wall.interiorTexture = wall.interiorTexture;
          _wall.exteriorTexture = wall.exteriorTexture;
        } catch (_) {
          console.log(_);
        }

        const { start, end } = wall;
        rooms.forEach((room) => {
          const { corners } = room;
          const flag = corners.includes(start) && corners.includes(end);
          flag && room.corners.push(this);
        });

        wall.setEnd(this);
        return true;
      }
    }
    return false;
  }

  /** Ensure we do not have duplicate walls (i.e. same start and end points) */
  removeDuplicateWalls() {
    // delete the wall between these corners, if it exists
    const wallEndpoints = {};
    const wallStartpoints = {};
    for (var i = this.wallStarts.length - 1; i >= 0; i--) {
      if (this.wallStarts[i].getEnd() === this) {
        // remove zero length wall
        this.wallStarts[i].remove();
      } else if (this.wallStarts[i].getEnd().id in wallEndpoints) {
        // remove duplicated wall
        this.wallStarts[i].remove();
      } else {
        wallEndpoints[this.wallStarts[i].getEnd().id] = true;
      }
    }
    for (i = this.wallEnds.length - 1; i >= 0; i--) {
      if (this.wallEnds[i].getStart() === this) {
        // removed zero length wall
        this.wallEnds[i].remove();
      } else if (this.wallEnds[i].getStart().id in wallStartpoints) {
        // removed duplicated wall
        this.wallEnds[i].remove();
      } else {
        wallStartpoints[this.wallEnds[i].getStart().id] = true;
      }
    }
  }

  setLocked(locked) {
    this.locked = locked;
  }

  /**
   * update angles between adjacent corners
   * @param {Object} additionalCorner
   * @returns
   */
  updateAngles(additionalCorner = null) {
    var neighbors = this.adjacentCorners();
    additionalCorner && neighbors.push(additionalCorner);
    this.angles = [];
    this.angleDirections = [];
    this.startAngles = [];
    this.endAngles = [];
    this.cyclicNeighbors = [];
    if (neighbors.length < 2) {
      return;
    }

    var start = new THREE.Vector2(this.x, this.y);
    var points = [];
    for (var i = 0; i < neighbors.length; i++) {
      points.push(new THREE.Vector2(neighbors[i].x, neighbors[i].y));
    }

    var indicesAndAngles = Core.Utils.getCyclicOrder(points, start);
    var indices = indicesAndAngles["indices"];
    var angles = indicesAndAngles["angles"];
    var N = indices.length < 3 ? 1 : indices.length;
    for (i = 0; i < N; i++) {
      var next = (i + 1) % indices.length;
      var cindex = indices[i];
      var nindex = indices[next];

      var vectorA = points[cindex].clone().sub(start).normalize();
      var vectorB = points[nindex].clone().sub(start).normalize();
      var midVector = vectorA.add(vectorB).normalize().multiplyScalar(0.4);

      var diffAngle = Math.abs(angles[next] - angles[i]);
      diffAngle = diffAngle > 180 ? 360 - diffAngle : diffAngle;
      diffAngle = Math.round(diffAngle * 10) / 10;
      this.startAngles.push(angles[i]);
      this.endAngles.push(angles[next]);
      this.angles.push(diffAngle);
      this.angleDirections.push(midVector);
      this.cyclicNeighbors.push(neighbors[indices[i]]);
    }
  }
}
