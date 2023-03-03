import hull from "hull.js";
import Core from "../core";
import Edge3D from "./edge3d";
import Vertex3D from "./vertex3d";
import Face3D from "./face3d";

const vertexTolerance = Core.Configuration.getNumericValue(
  Core.configSnapTolernance
);

export default class Roof {
  vertices = [];
  edges = [];
  faces = [];
  items = [];

  offset = 0;
  enabled = false;

  /**
   *
   * @param {Floorplan} floorplan
   */
  constructor(floorplan) {
    this.floorplan = floorplan;
  }

  getVertices = () => {
    this.vertices.forEach((vertex) => (vertex.enabled = this.enabled));
    return this.vertices;
  };

  getEdges = () => {
    this.edges.forEach((edge) => (edge.enabled = this.enabled));
    return this.edges;
  };

  reset = () => {
    this.vertices = [];
    this.edges = [];
    this.faces = [];
  };

  update = () => {
    this.floorplan.update(false);
  };

  /**
   * Create new vertex
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   * @param {String} id
   * @returns
   */
  newVertex = (x, y, z, id) => {
    let vertex = null;
    let exist = false;
    for (const v of this.vertices) {
      if (v.distanceFrom(x, y, z) < vertexTolerance) {
        exist = true;
        vertex = v;
        break;
      }
    }
    if (!exist) {
      vertex = new Vertex3D(this, x, y, z, id);
      vertex.fireOnMove(this.update);
      vertex.fireOnDelete(this.removeVertex);
      this.vertices.push(vertex);
    }
    return vertex;
  };

  removeVertex = (vertex) => {
    Core.Utils.removeValue(this.vertices, vertex);
    // this.update();
  };

  autoSplitEdges = (start, end) => {
    let hasCrossEdge = false;
    // console.log(start.toVec3(), end.toVec3());
    const edges = this.getEdges();
    const count = edges.length;
    let points = [start, end];
    const newPoints = [];
    for (let i = 0; i < count; i++) {
      const edge = edges[i];
      if (!points.includes(edge.start) && !points.includes(edge.end)) {
        const p = Core.Utils3D.findLineLineCrossPoint(
          start,
          end,
          edge.start,
          edge.end
        );
        if (p) {
          if (
            start.distanceFrom(p.x, p.y, p.z) < vertexTolerance ||
            end.distanceFrom(p.x, p.y, p.z) < vertexTolerance
          ) {
            continue;
          }
          hasCrossEdge = true;
          const vertex = this.newVertex(p.x, p.y, p.z);
          newPoints.push(vertex);
          // split exist edge
          this.newEdge(vertex, edge.end);
          edge.setEnd(vertex);
        }
      }
    }
    if (hasCrossEdge) {
      newPoints.sort((a, b) => {
        const dA = start.distanceFromVertex(a);
        const dB = start.distanceFromVertex(b);
        return dA - dB;
      });
      points = [start, ...newPoints, end];
      for (let i = 0; i < points.length - 1; i++) {
        let s = points[i];
        let e = points[i + 1];
        this.newEdge(s, e, false);
      }
    }
    return hasCrossEdge;
  };

  checkEdgeIsExist = (start, end) => {
    let exist = false;
    this.getEdges().forEach((edge) => {
      if (
        (start.distanceFromVertex(edge.start) < vertexTolerance &&
          end.distanceFromVertex(edge.end) < vertexTolerance) ||
        (start.distanceFromVertex(edge.end) < vertexTolerance &&
          end.distanceFromVertex(edge.start) < vertexTolerance)
      ) {
        exist = true;
      }
    });
    return exist;
  };

  /**
   * Create new edge
   * @param {Vertex3D} start
   * @param {Vertex3D} end
   */
  newEdge = (start, end, autoSplit = false) => {
    if (!start || !end) return;
    if (this.checkEdgeIsExist(start, end)) return;
    let hasCrossEdge = false;
    autoSplit && (hasCrossEdge = this.autoSplitEdges(start, end));
    if (!hasCrossEdge) {
      const edge = new Edge3D(start, end);
      edge.fireOnMove(this.update);
      edge.fireOnDelete(this.removeEdge);
      this.edges.push(edge);
      return edge;
    }
  };

  removeEdge = (edge) => {
    Core.Utils.removeValue(this.edges, edge);
    // this.update();
  };

  /**
   * Regenerate roof from corners of top-layer floor plan
   * @param {Array} corners array of corner(corners of top-layer floor plan)
   */
  regenerate = (corners) => {
    this.reset();
    if (!Array.isArray(corners)) return;

    const findVertice = (p) => {
      return this.newVertex(p.x, 0, p.y);
    };

    let points = [];
    for (let i = 0; i < corners.length - 1; i++) {
      const p1 = corners[i];
      const p2 = corners[i + 1];
      const L = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      for (let d = 0; d < L; d += 0.5) {
        points.push({
          x: p1.x + (dx * d) / L,
          y: p1.y + (dy * d) / L,
        });
      }
    }

    points = hull(points.map((p) => [p.x, p.y])).map((p) => ({
      x: p[0],
      y: p[1],
    }));
    points.splice(points.length - 1, 1);

    for (let i = 0; i < points.length; i++) {
      let start = points[i];
      let end = points[(i + 1) % points.length];
      const startVertex = findVertice(start);
      const endVertex = findVertice(end);
      this.newEdge(startVertex, endVertex);
    }
  };

  loadData = (data = { vertices: {}, edges: [], faces: {} }) => {
    const { offset, vertices, edges } = data;
    this.offset = offset;
    // console.log("load roof data", vertices, edges, faces);
    const tmp = {};
    for (let id in vertices) {
      const item = vertices[id];
      const vertex = this.newVertex(item.x, item.y, item.z, item.id);
      tmp[id] = vertex;
    }
    for (let edge of edges) {
      this.newEdge(tmp[edge.start], tmp[edge.end]);
    }
    this.calculateFaces(data.faces);
  };

  setFaceTexture = (activeFace = null, texture = "") => {
    if (!activeFace) {
      this.faces.forEach((face) => {
        face.setColor(texture);
      });
      this.update();
    }
  };

  getFaces = () => this.faces;

  calculateFaces = (initialData = {}) => {
    const faces = [];
    const faceCorners = this.findFaces(this.vertices);
    faceCorners.forEach((corners) => {
      const uuid = Face3D.getUuidByCorners(corners);

      const newFace = new Face3D(corners);
      if (initialData[uuid]) {
        newFace.setColor(initialData[uuid].color);
      } else {
        const tmp = this.faces.filter((room) => room.getUuid() === uuid);
        if (tmp.length) {
          // restore prev properties
          newFace.setColor(tmp[0].color);
          newFace.items = tmp[0].items;
        }
      }
      faces.push(newFace);
    });

    this.faces = faces;
  };

  findFaces = (vertices = this.vertices) => {
    function _calculateTheta(previousVertex, currentVertex, nextVertex) {
      return Core.Utils.angle2pi(
        previousVertex.x - currentVertex.x,
        previousVertex.z - currentVertex.z,
        nextVertex.x - currentVertex.x,
        nextVertex.z - currentVertex.z
      );
    }

    function _removeNonTriangles(faceArray) {
      const results = [];
      faceArray.forEach((face) => face.length === 3 && results.push(face));
      return results;
    }

    function _removeDuplicateFaces(faceArray) {
      const results = [];
      const lookup = {};
      const sep = "-";
      for (let i = 0; i < faceArray.length; i++) {
        // faces are cycles, shift it around to check uniqueness
        let add = true;
        const face = faceArray[i];
        const idList = face
          .map((vertex) => vertex.id)
          .sort((a, b) => a.localeCompare(b));

        const str = idList.join(sep);
        if (lookup.hasOwnProperty(str)) {
          add = false;
        }
        if (add) {
          results.push(faceArray[i]);
          lookup[str] = true;
        }
      }
      return results;
    }

    function _findTightestCycle(firstVertex, secondVertex) {
      const stack = [];

      let next = {
        vertex: secondVertex,
        previousVertices: [firstVertex],
      };
      const visited = {};
      visited[firstVertex.id] = true;

      while (next) {
        // update previous Vertexs, current Vertex, and visited Vertexs
        const currentVertex = next.vertex;
        visited[currentVertex.id] = true;

        // did we make it back to the startVertex?
        if (next.vertex === firstVertex && currentVertex !== secondVertex) {
          return next.previousVertices;
        }

        const addToStack = [];
        const adjacentVertices = next.vertex.adjacentVertices();
        for (let i = 0; i < adjacentVertices.length; i++) {
          const nextVertex = adjacentVertices[i];

          // is this where we came from?
          // give an exception if its the first Vertex and we aren't at the second Vertex
          if (
            nextVertex.id in visited &&
            !(nextVertex === firstVertex && currentVertex !== secondVertex)
          ) {
            continue;
          }

          // nope, throw it on the queue
          addToStack.push(nextVertex);
        }

        const previousVertices = next.previousVertices.slice(0);
        previousVertices.push(currentVertex);
        if (addToStack.length > 1) {
          // visit the ones with smallest theta first
          const previousVertex =
            next.previousVertices[next.previousVertices.length - 1];
          addToStack.sort(function (a, b) {
            return (
              _calculateTheta(previousVertex, currentVertex, b) -
              _calculateTheta(previousVertex, currentVertex, a)
            );
          });
        }

        if (addToStack.length > 0) {
          // add to the stack
          addToStack.forEach((vertex) => {
            stack.push({
              vertex,
              previousVertices,
            });
          });
        }

        // pop off the next one
        next = stack.pop();
      }
      return [];
    }

    // find tightest loops, for each Vertex, for each adjacent
    // TODO: optimize this, only check Vertexs with > 2 adjacents, or isolated cycles
    const loops = [];

    vertices.forEach((firstVertex) => {
      firstVertex.adjacentVertices().forEach((secondVertex) => {
        loops.push(_findTightestCycle(firstVertex, secondVertex));
      });
    });

    // remove duplicates
    const uniqueLoops = _removeDuplicateFaces(_removeNonTriangles(loops));
    return uniqueLoops;
  };
}
