import * as THREE from "three";
import Core from "../core";

const vertexTolerance = Core.Configuration.getNumericValue(
  Core.configSnapTolernance
);

/**
 * Vertexes are used to define edges.
 */
export default class Vertex3D {
  edgeStarts = [];
  edgeEnds = [];

  /** Callbacks to be fired on movement. */
  moved_callbacks = [];
  deleted_callbacks = [];
  action_callbacks = [];

  locked = false;
  selected = false;

  /** Constructs a vertex.
   * @param parent The associated parent.
   * @param x X coordinate.
   * @param y Y coordinate.
   * @param z Z coordinate
   * @param id An optional unique id. If not set, created internally.
   */
  constructor(parent, x, y, z, id) {
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.z = z;
    this.id = id || Core.Utils.guid();
  }

  toVec3() {
    return new THREE.Vector3(this.x, this.y, this.z);
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

  setLocked = (locked) => (this.locked = locked);

  setPosition = (axis, value) => {
    switch (axis.toLowerCase()) {
      case "x":
        this.x = value;
        break;
      case "z":
        this.y = value - this.parent.offset;
        break;
      case "y":
        this.z = value;
        break;
      default:
        break;
    }
    this.moved_callbacks.forEach((cb) => cb());
  };
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

  /**
   * @returns
   * @deprecated
   */
  getZ() {
    return this.z;
  }

  /**
   *
   */
  snapToAxis(
    tolerance = Core.Configuration.getNumericValue(Core.configSnapTolernance)
  ) {
    // this.x = parseInt(this.x / tolerance, 10) * tolerance;
    // this.y = parseInt(this.y / tolerance, 10) * tolerance;
    // try to snap this vertex to an axis
    const snapped = {
      x: false,
      y: false,
      z: false,
    };
    const scope = this;
    this.adjacentVertices().forEach((vertex) => {
      if (Math.abs(vertex.x - scope.x) < tolerance) {
        scope.x = vertex.x;
        snapped.x = true;
      }
      if (Math.abs(vertex.y - scope.y) < tolerance) {
        scope.y = vertex.y;
        snapped.y = true;
      }
      if (Math.abs(vertex.z - scope.z) < tolerance) {
        scope.z = vertex.z;
        snapped.z = true;
      }
    });
    return snapped;
  }

  /** Moves vertex relatively to new position.
   * @param dx The delta x.
   * @param dy The delta y.
   * @param dz The delta z.
   */
  relativeMove(dx, dy, dz) {
    if (this.locked) return;
    this.move(this.x + dx, this.y + dy, this.z + dz);
  }

  fireAction(action) {
    // this.action_callbacks.fire(action);
    this.action_callbacks.forEach((cb) => cb(action));
  }

  /** Remove callback. Fires the delete callbacks. */
  remove() {
    // this.deleted_callbacks.fire(this);
    this.deleted_callbacks.forEach((cb) => cb(this));
  }

  /** Removes all edges. */
  removeAll() {
    // console.log(this.edgeStarts, this.edgeEnds);
    [...this.edgeStarts, ...this.edgeEnds].forEach((edge) => edge.remove());
    this.remove();
  }

  /** Moves vertex to new position.
   * @param newX The new x position.
   * @param newY The new y position.
   * @param newZ The new z position.
   */
  move(newX, newY, newZ, willSnap = true) {
    if (this.locked) return;
    const prevX = this.x;
    const prevY = this.y;
    const prevZ = this.z;
    this.x = newX;
    this.y = newY;
    this.z = newZ;
    this.mergeWithIntersected();

    willSnap && this.snapToAxis();
    // this.moved_callbacks.fire(this.x, this.y);
    this.moved_callbacks.forEach((cb) =>
      cb(this.x, this.y, this.z, prevX, prevY, prevZ)
    );
  }

  /** Gets the adjacent vertices.
   * @returns Array of vertices.
   */
  adjacentVertices() {
    const retArray = [];
    for (var i = 0; i < this.edgeStarts.length; i++) {
      retArray.push(this.edgeStarts[i].getEnd());
    }
    for (i = 0; i < this.edgeEnds.length; i++) {
      retArray.push(this.edgeEnds[i].getStart());
    }
    return retArray;
  }

  /** Checks if a edge is connected.
   * @param edge A edge.
   * @returns True in case of connection.
   */
  isEdgeConnected(edge) {
    for (var i = 0; i < this.edgeStarts.length; i++) {
      if (this.edgeStarts[i] === edge) {
        return true;
      }
    }
    for (i = 0; i < this.edgeEnds.length; i++) {
      if (this.edgeEnds[i] === edge) {
        return true;
      }
    }
    return false;
  }

  /**
   *
   */
  distanceFrom(x, y, z) {
    return new THREE.Vector3(x, y, z).distanceTo(
      new THREE.Vector3(this.x, this.y, this.z)
    );
  }

  /** Gets the distance from a edge.
   * @param edge A edge.
   * @returns The distance.
   */
  distanceFromEdge(edge) {
    return edge.distanceFrom(this.x, this.y, this.z);
  }

  /** Gets the distance from a vertex.
   * @param vertex A vertex.
   * @returns The distance.
   */
  distanceFromVertex(vertex) {
    return this.distanceFrom(vertex.x, vertex.y, vertex.z);
  }

  /** Detaches a edge.
   * @param edge A edge.
   */
  detachEdge(edge) {
    Core.Utils.removeValue(this.edgeStarts, edge);
    Core.Utils.removeValue(this.edgeEnds, edge);
    if (this.edgeStarts.length === 0 && this.edgeEnds.length === 0) {
      this.remove();
    }
  }

  /** Attaches a start edge.
   * @param edge A edge.
   */
  attachStart(edge) {
    this.edgeStarts.push(edge);
  }

  /** Attaches an end edge.
   * @param edge A edge.
   */
  attachEnd(edge) {
    this.edgeEnds.push(edge);
  }

  /** Get edge to vertex.
   * @param vertex A vertex.
   * @return The associated edge or null.
   */
  edgeTo(vertex) {
    for (let i = 0; i < this.edgeStarts.length; i++) {
      if (this.edgeStarts[i].getEnd() === vertex) {
        return this.edgeStarts[i];
      }
    }
    return null;
  }

  /** Get edge from vertex.
   * @param vertex A vertex.
   * @return The associated edge or null.
   */
  edgeFrom(vertex) {
    for (let i = 0; i < this.edgeEnds.length; i++) {
      if (this.edgeEnds[i].getStart() === vertex) {
        return this.edgeEnds[i];
      }
    }
    return null;
  }

  /** Get edge to or from vertex.
   * @param vertex A vertex.
   * @return The associated edge or null.
   */
  edgeToOrFrom(vertex) {
    return this.edgeTo(vertex) || this.edgeFrom(vertex);
  }

  /**
   *
   */
  combineWithVertex(vertex) {
    // update position to other vertex's
    this.x = vertex.x;
    this.y = vertex.y;
    this.z = vertex.z;
    // absorb the other vertex's edgeStarts and edgeEnds
    for (var i = vertex.edgeStarts.length - 1; i >= 0; i--) {
      vertex.edgeStarts[i].setStart(this);
    }
    for (i = vertex.edgeEnds.length - 1; i >= 0; i--) {
      vertex.edgeEnds[i].setEnd(this);
    }
    // delete the other vertex
    vertex.removeAll();
    this.removeDuplicateEdges();
    this.parent.update();
  }

  mergeWithIntersected() {
    // check vertices
    const { vertices, edges } = this.parent;
    for (var i = 0; i < vertices.length; i++) {
      const vertex = vertices[i];
      if (
        this.distanceFromVertex(vertex) < vertexTolerance &&
        vertex !== this
      ) {
        this.combineWithVertex(vertex);
        return true;
      }
    }
    // check edges
    for (i = 0; i < edges.length; i++) {
      const edge = edges[i];
      if (
        this.distanceFromEdge(edge) < vertexTolerance &&
        !this.isEdgeConnected(edge)
      ) {
        // update position to be on edge
        const intersection = Core.Utils.closestPointOnLine(
          this.x,
          this.y,
          edge.getStart().x,
          edge.getStart().y,
          edge.getEnd().x,
          edge.getEnd().y
        );
        this.x = intersection.x;
        this.y = intersection.y;
        // merge this vertex into edge by breaking edge into two parts
        this.parent.newEdge(this, edge.getEnd());
        edge.setEnd(this);
        this.parent.update();
        return true;
      }
    }
    return false;
  }

  /** Ensure we do not have duplicate edges (i.e. same start and end points) */
  removeDuplicateEdges() {
    // delete the edge between these vertices, if it exists
    const edgeEndpoints = {};
    const edgeStartpoints = {};
    for (var i = this.edgeStarts.length - 1; i >= 0; i--) {
      if (this.edgeStarts[i].getEnd() === this) {
        // remove zero length edge
        this.edgeStarts[i].remove();
      } else if (this.edgeStarts[i].getEnd().id in edgeEndpoints) {
        // remove duplicated edge
        this.edgeStarts[i].remove();
      } else {
        edgeEndpoints[this.edgeStarts[i].getEnd().id] = true;
      }
    }
    for (i = this.edgeEnds.length - 1; i >= 0; i--) {
      if (this.edgeEnds[i].getStart() === this) {
        // removed zero length edge
        this.edgeEnds[i].remove();
      } else if (this.edgeEnds[i].getStart().id in edgeStartpoints) {
        // removed duplicated edge
        this.edgeEnds[i].remove();
      } else {
        edgeStartpoints[this.edgeEnds[i].getStart().id] = true;
      }
    }
  }
}
