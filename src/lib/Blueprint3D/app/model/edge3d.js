import * as THREE from "three";
import Core from "../core";

/**
 * A edge is the basic element to create Rooms.
 */
export default class Edge3D {
  /** The unique id of each edge. */
  id;

  locked = false;

  moved_callbacks = [];
  deleted_callbacks = [];
  action_callbacks = [];

  /**
   * Constructs a new edge.
   * @param start Start vertex.
   * @param end End vertex.
   */
  constructor(start, end) {
    this.start = start;
    this.end = end;

    this.id = this.getUuid();

    this.start.attachStart(this);
    this.end.attachEnd(this);
  }

  getUuid() {
    return [this.start.id, this.end.id].join();
  }

  resetFrontBack() {}

  snapToAxis(
    tolerance = Core.Configuration.getNumericValue(Core.configSnapTolernance)
  ) {
    // order here is important, but unfortunately arbitrary
    this.start.snapToAxis(tolerance);
    this.end.snapToAxis(tolerance);
  }

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

  relativeMove(dx, dy) {
    if (this.locked || this.start.locked || this.end.locked) return;

    this.start.move(this.getStartX() + dx, this.getStartY() + dy, false);
    this.end.move(this.getEndX() + dx, this.getEndY() + dy, false);

    const change = {
      prev: {
        start: { x: this.getStartX(), y: this.getStartY() },
        end: { x: this.getEndX(), y: this.getEndY() },
      },
    };
    this.snapToAxis();
    change.current = {
      start: { x: this.getStartX(), y: this.getStartY() },
      end: { x: this.getEndX(), y: this.getEndY() },
    };
  }

  fireMoved() {
    // this.moved_callbacks.fire();
    this.moved_callbacks.forEach((cb) => typeof cb === "function" && cb());
  }

  fireRedraw() {}

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
    this.start.detachEdge(this);
    this.end.detachEdge(this);
    // this.deleted_callbacks.fire(this);
    this.deleted_callbacks.forEach(
      (cb) => typeof cb === "function" && cb(this)
    );
  }

  setStart(vertex) {
    this.start.detachEdge(this);
    vertex.attachStart(this);
    this.start = vertex;
    this.fireMoved();
  }

  setEnd(vertex) {
    this.end.detachEdge(this);
    vertex.attachEnd(this);
    this.end = vertex;
    this.fireMoved();
  }

  distanceFrom(x, y, z) {
    const point = new THREE.Vector3(x, y, z);
    const start = new THREE.Vector3(this.start.x, this.start.y, this.start.z);
    const end = new THREE.Vector3(this.end.x, this.end.y, this.end.z);
    const line = new THREE.Line3(start, end);
    return line.closestPointToPoint(point).distanceTo(point);
  }

  /** Return the vertex opposite of the one provided.
   * @param vertex The given vertex.
   * @returns The opposite vertex.
   */
  oppositeVertex(vertex) {
    if (this.start === vertex) {
      return this.end;
    }
    if (this.end === vertex) {
      return this.start;
    }
    console.log("edge does not connect to vertex");
  }

  setLocked(locked) {
    this.locked = locked;
    this.start.setLocked(locked);
    this.end.setLocked(locked);
  }

  getEdgeCenter() {
    const start = { x: this.start.x, y: this.start.y, z: this.start.z };
    const end = { x: this.end.x, y: this.end.y, z: this.end.z };
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
      z: (start.z + end.z) / 2,
    };
  }

  getEdgeLength() {
    const start = { x: this.start.x, y: this.start.y, z: this.start.z };
    const end = { x: this.end.x, y: this.end.y, z: this.end.z };
    const length = Math.sqrt(
      (start.x - end.x) ** 2 + (start.y - end.y) ** 2 + (start.z - end.z) ** 2
    );
    return length;
  }
}
