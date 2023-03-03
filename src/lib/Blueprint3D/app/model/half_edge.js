import * as THREE from "three";
import Core from "../core";

export default class HalfEdge {
  /** */
  offset;

  /** */
  height;

  layerOffset = 0;

  /** used for intersection testing... not convinced this belongs here */
  plane = null;

  interiorWallPoints = [];
  validInteriorWallPoints = [];

  exteriorWallPoints = [];
  validExteriorWallPoints = [];

  interiorTransform = new THREE.Matrix4();
  invInteriorTransform = new THREE.Matrix4();
  exteriorTransform = new THREE.Matrix4();
  invExteriorTransform = new THREE.Matrix4();

  /** */
  redrawCallbacks = [];

  /**
   * Constructs a half edge.
   * @param layer The associated layer.
   * @param wall The corresponding wall.
   */
  constructor(layer, wall, layerOffset) {
    this.layer = layer;
    this.wall = wall;

    this.offset = wall.thickness / 2;
    this.height = wall.height;
    this.layerOffset = layerOffset;

    this.wall.edge = this;
  }

  getPolygon = (points) => {
    const polygon = [];
    if (Array.isArray(points) && points.length > 2) {
      const s = points[0];
      for (const p of points) {
        const x = Math.sqrt((p.x - s.x) ** 2 + (p.z - s.z) ** 2);
        const y = p.y;
        polygon.push({ x, y });
      }
    }
    return polygon;
  };

  adjustWallItems = (points) => {
    const polygon = this.getPolygon(points);
    if (polygon.length > 2) {
      const s = points[0];
      const offset = this.wall.layer.offset;
      const delta = 5e-2;
      this.wall.items.forEach((item) => {
        const { halfSize } = item;
        const position = item.calculatedPosition || item.position;
        const { x, y, z } = position;

        const width = halfSize.x * 2 - delta;
        const height = halfSize.y * 2 - delta;

        const x2d = Math.sqrt((x - s.x) ** 2 + (z - s.z) ** 2);

        const itemPolygon = [
          { x: x2d - width / 2, y: y - offset },
          { x: x2d + width / 2, y: y - offset },
          { x: x2d + width / 2, y: y - offset + height },
          { x: x2d - width / 2, y: y - offset + height },
        ];
        if (!Core.Utils.polygonInsidePolygon(itemPolygon, polygon)) {
          this.wall.removeItem(item);
        }
      });
    }
  };

  setInteriorWallPoints = (points) => {
    let newPoints = [];
    for (const p of points) {
      p.x = Math.round(p.x * 100) / 100;
      p.y = Math.round(p.y * 100) / 100;
      p.z = Math.round(p.z * 100) / 100;
      newPoints.push(p);
    }
    this.interiorWallPoints = newPoints.map((p) => p.clone());
    this.validInteriorWallPoints = newPoints.map((p) => p.clone());
  };

  setExteriorWallPoints = (points) => {
    let newPoints = [];
    for (const p of points) {
      p.x = Math.round(p.x * 100) / 100;
      p.y = Math.round(p.y * 100) / 100;
      p.z = Math.round(p.z * 100) / 100;
      newPoints.push(p);
    }
    this.exteriorWallPoints = newPoints.map((p) => p.clone());
    this.validExteriorWallPoints = newPoints.map((p) => p.clone());
  };

  adjustWallPoints = () => {
    // const log =
    //   this.wall.start.x === -9 &&
    //   this.wall.start.y === 6 &&
    //   this.wall.layer.offset === 2.5;
    const { thickness } = this.wall;
    const tolerance = thickness * 3;
    for (const p of this.validExteriorWallPoints) {
      if (p.y > 0) {
        let nearest = null;
        let dist = +Infinity;
        for (const c of this.validInteriorWallPoints) {
          if (c.y > 0) {
            if (p.distanceTo(c) < dist) {
              nearest = c;
              dist = p.distanceTo(c);
            }
          }
        }
        if (!nearest) continue;
        if (dist < tolerance && p.y > nearest.y) {
          p.y = nearest.y;
        }
      }
    }
    for (const p of this.validInteriorWallPoints) {
      if (p.y > 0) {
        let nearest = null;
        let dist = +Infinity;
        for (const c of this.validExteriorWallPoints) {
          if (c.y > 0) {
            if (p.distanceTo(c) < dist) {
              nearest = c;
              dist = p.distanceTo(c);
            }
          }
        }
        if (!nearest) continue;
        if (dist < tolerance && p.y > nearest.y) {
          p.y = nearest.y;
        }
      }
    }
    this.adjustWallItems(this.validInteriorWallPoints);
    this.adjustWallItems(this.validExteriorWallPoints);
  };

  /**
   *
   */
  getTexture(interior = true) {
    return interior ? this.wall.interiorTexture : this.wall.exteriorTexture;
  }

  /**
   *
   */
  setTexture(textureUrl, conduction = 0) {
    const texture = {
      url: textureUrl,
      stretch: 1,
      scale: 1,
      width: 1,
      height: 1,
    };
    const { isInterior, isExterior } = this;
    if (isInterior) this.wall.setInteriorTexture(texture, conduction);
    if (isExterior) this.wall.setExteriorTexture(texture, conduction);
    // this.redrawCallbacks.forEach((cb) => typeof cb === "function" && cb());
  }

  /**
   * this feels hacky, but need wall items
   */
  generatePlane = function () {
    const scope = this;
    function transformCorner(corner) {
      return new THREE.Vector3(corner.x, scope.layerOffset, corner.y);
    }

    const v1 = transformCorner(this.interiorStart());
    const v2 = transformCorner(this.interiorEnd());
    const v3 = v2.clone();
    v3.y += this.wall.height;
    const v4 = v1.clone();
    v4.y += this.wall.height;

    const geometry = new THREE.Geometry();
    geometry.vertices = [v1, v2, v3, v4];

    geometry.faces.push(new THREE.Face3(0, 1, 2));
    geometry.faces.push(new THREE.Face3(0, 2, 3));
    geometry.computeFaceNormals();
    geometry.computeBoundingBox();

    this.plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
    this.plane.visible = false;
    this.plane.edge = this; // js monkey patch

    this.computeTransforms(
      this.interiorTransform,
      this.invInteriorTransform,
      this.interiorStart(),
      this.interiorEnd()
    );
    this.computeTransforms(
      this.exteriorTransform,
      this.invExteriorTransform,
      this.exteriorStart(),
      this.exteriorEnd()
    );
  };

  interiorArea() {
    const points = this.interiorWallPoints;
    if (points.length === 0) return 0;
    const polygon = [];
    polygon.push({ x: 0, y: 0 });
    for (let i = 1; i < points.length; i++) {
      let x = Math.sqrt(
        (points[i].x - points[0].x) ** 2 + (points[i].z - points[0].z) ** 2
      );
      let y = points[i].y - points[0].y;
      polygon.push({ x, y });
    }
    return Core.Utils.area(polygon);
  }

  exteriorArea() {
    const points = this.exteriorWallPoints;
    if (points.length === 0) return 0;
    const polygon = [];
    polygon.push({ x: 0, y: 0 });
    for (let i = 1; i < points.length; i++) {
      let x = Math.sqrt(
        (points[i].x - points[0].x) ** 2 + (points[i].z - points[0].z) ** 2
      );
      let y = points[i].y - points[0].y;
      polygon.push({ x, y });
    }
    return Core.Utils.area(polygon);
  }

  interiorDistance() {
    let s = this.interiorStart();
    let e = this.interiorEnd();
    return Core.Utils.distance(s.x, s.y, e.x, e.y);
  }

  exteriorDistance() {
    let s = this.exteriorStart();
    let e = this.exteriorEnd();
    return Core.Utils.distance(s.x, s.y, e.x, e.y);
  }

  computeTransforms(transform, invTransform, start, end) {
    const v1 = start;
    const v2 = end;

    const angle = Core.Utils.angle(1, 0, v2.x - v1.x, v2.y - v1.y);

    const tt = new THREE.Matrix4();
    tt.makeTranslation(-v1.x, 0, -v1.y);
    const tr = new THREE.Matrix4();
    tr.makeRotationY(-angle);
    transform.multiplyMatrices(tr, tt);
    invTransform.copy(transform).invert();
  }

  /** Gets the distance from specified point.
   * @param x X coordinate of the point.
   * @param y Y coordinate of the point.
   * @returns The distance.
   */
  distanceTo(x, y) {
    // x, y, x1, y1, x2, y2
    return Core.Utils.pointDistanceFromLine(
      x,
      y,
      this.interiorStart().x,
      this.interiorStart().y,
      this.interiorEnd().x,
      this.interiorEnd().y
    );
  }

  getStart() {
    return this.wall.getStart();
  }

  getEnd() {
    return this.wall.getEnd();
  }

  interiorLine() {
    const { wall } = this;
    const { start, end, thickness, thicknessDirection } = wall;
    const c = new THREE.Vector2();
    const length = wall.getWallLength();

    const vector = wall.toVec2().rotateAround(c, -Math.PI / 2);

    let multiple = 1;
    if (thicknessDirection > 0) multiple = 0;
    else if (thicknessDirection < 0) multiple = 2;
    multiple *= 0.5;

    const delta = vector.multiplyScalar((thickness / length) * multiple);
    return {
      start: {
        x: start.x + delta.x,
        y: start.y + delta.y,
      },
      end: {
        x: end.x + delta.x,
        y: end.y + delta.y,
      },
    };
  }

  exteriorLine() {
    const { wall } = this;
    const { start, end, thickness, thicknessDirection } = wall;
    const c = new THREE.Vector2();
    const length = wall.getWallLength();

    const vector = wall.toVec2().rotateAround(c, Math.PI / 2);

    let multiple = 1;
    if (thicknessDirection > 0) multiple = 2;
    else if (thicknessDirection < 0) multiple = 0;
    multiple *= 0.5;

    const delta = vector.multiplyScalar((thickness / length) * multiple);

    return {
      start: {
        x: start.x + delta.x,
        y: start.y + delta.y,
      },
      end: {
        x: end.x + delta.x,
        y: end.y + delta.y,
      },
    };
  }

  getEdgeCrossPoints(line, edge, angle) {
    const crossPoints = [];
    const tolerance = 0.1;

    [edge.interiorLine(), edge.exteriorLine()].forEach((l) => {
      if (
        (angle > Math.PI * (1 - tolerance) &&
          angle < Math.PI * (1 + tolerance)) ||
        angle < Math.PI * tolerance ||
        angle > Math.PI * (2 - tolerance)
      ) {
        return;
      }
      const point = Core.Utils.findLineLineCrossPoint(
        line.start.x,
        line.start.y,
        line.end.x,
        line.end.y,
        l.start.x,
        l.start.y,
        l.end.x,
        l.end.y
      );
      point && crossPoints.push(point);
    });
    return crossPoints;
  }

  calculateAngle(v, v1) {
    let angle = v.angleTo(v1);
    const n = v.clone().cross(v1);
    if (n.y < 0) angle = Math.PI * 2 - angle;
    return angle;
  }

  sortWalls(walls, corner, isClockWise, log) {
    try {
      const opp = this.wall.oppositeCorner(corner);
      const v = new THREE.Vector3(opp.x - corner.x, 0, opp.y - corner.y);
      return walls
        .filter((wall) => wall !== this.wall)
        .sort((wa, wb) => {
          try {
            const end1 = wa.oppositeCorner(corner);
            const end2 = wb.oppositeCorner(corner);
            const v1 = new THREE.Vector3(
              end1.x - corner.x,
              0,
              end1.y - corner.y
            );
            const v2 = new THREE.Vector3(
              end2.x - corner.x,
              0,
              end2.y - corner.y
            );
            const a1 = this.calculateAngle(v, v1);
            const a2 = this.calculateAngle(v, v2);
            return (a1 - a2) * isClockWise;
          } catch (_) {
            return 0;
          }
        });
    } catch (_) {
      return walls;
    }
  }

  findBestCandidate(candidates, crossPoints, isClockWise, start, end, corner) {
    const closestWall = candidates[0];
    const v = new THREE.Vector3(start.x - end.x, 0, start.y - end.y);
    try {
      const oppo = closestWall.oppositeCorner(corner);
      const v1 = new THREE.Vector3(oppo.x - corner.x, 0, oppo.y - corner.y);

      let angle = this.calculateAngle(v, v1);
      if (isClockWise < 0) angle = Math.PI * 2 - angle;

      crossPoints.sort((a, b) => {
        let l1 = Math.sqrt((a.x - start.x) ** 2 + (a.y - start.y) ** 2);
        let l2 = Math.sqrt((b.x - start.x) ** 2 + (b.y - start.y) ** 2);
        return (l2 - l1) * (angle > Math.PI ? 1 : -1);
      });
    } catch (_) {}
    return crossPoints[0];
  }

  // these return an object with attributes x, y
  interiorEnd(checkDirection = false) {
    const { thicknessDirection } = this.wall;
    if (checkDirection && thicknessDirection > 0) return this.midEnd();
    const line = this.interiorLine();
    const { end } = this.wall;
    const points = [];
    const c = [];

    const walls = this.sortWalls([...end.wallStarts, ...end.wallEnds], end, -1);
    walls.length && c.push(walls[0]);

    const vec1 = new THREE.Vector3(
      line.start.x - line.end.x,
      0,
      line.start.y - line.end.y
    );

    c.forEach((wall) => {
      try {
        const oppo = wall.oppositeCorner(end);
        const vec2 = new THREE.Vector3(oppo.x - end.x, 0, oppo.y - end.y);
        const angle = this.calculateAngle(vec1, vec2, -1);
        const edge = wall.edge;
        edge && points.push(...this.getEdgeCrossPoints(line, edge, angle));
      } catch (_) {}
    });
    if (points.length === 0) return line.end;
    return this.findBestCandidate(c, points, -1, line.start, line.end, end);
  }

  interiorStart(checkDirection = false) {
    const { thicknessDirection } = this.wall;
    if (checkDirection && thicknessDirection > 0) return this.midStart();
    const line = this.interiorLine();
    const { start } = this.wall;
    const points = [];
    const c = [];

    const walls = this.sortWalls(
      [...start.wallStarts, ...start.wallEnds],
      start,
      1
    );
    walls.length && c.push(walls[0]);

    const vec1 = new THREE.Vector3(
      line.end.x - line.start.x,
      0,
      line.end.y - line.start.y
    );

    c.forEach((wall) => {
      try {
        const oppo = wall.oppositeCorner(start);
        const vec2 = new THREE.Vector3(oppo.x - start.x, 0, oppo.y - start.y);
        const angle = this.calculateAngle(vec1, vec2, 1);
        const edge = wall.edge;
        edge && points.push(...this.getEdgeCrossPoints(line, edge, angle));
      } catch (_) {}
    });
    if (points.length === 0) return line.start;

    return this.findBestCandidate(c, points, 1, line.end, line.start, start);
  }

  interiorCenter() {
    return {
      x: (this.interiorStart().x + this.interiorEnd().x) / 2,
      y: (this.interiorStart().y + this.interiorEnd().y) / 2,
    };
  }

  exteriorEnd(checkDirection = false) {
    const { thicknessDirection } = this.wall;
    if (checkDirection && thicknessDirection < 0) return this.midEnd();
    const line = this.exteriorLine();
    const { end } = this.wall;
    const points = [];
    const c = [];

    const walls = this.sortWalls([...end.wallStarts, ...end.wallEnds], end, 1);
    walls.length && c.push(walls[0]);

    const vec1 = new THREE.Vector3(
      line.start.x - line.end.x,
      0,
      line.start.y - line.end.y
    );

    c.forEach((wall) => {
      try {
        const oppo = wall.oppositeCorner(end);
        const vec2 = new THREE.Vector3(oppo.x - end.x, 0, oppo.y - end.y);
        const angle = this.calculateAngle(vec1, vec2, 1);
        const edge = wall.edge;
        edge && points.push(...this.getEdgeCrossPoints(line, edge, angle));
      } catch (_) {}
    });
    if (points.length === 0) return line.end;

    return this.findBestCandidate(c, points, 1, line.start, line.end, end);
  }

  exteriorStart(checkDirection = false) {
    const { thicknessDirection } = this.wall;
    if (checkDirection && thicknessDirection < 0) return this.midStart();
    const line = this.exteriorLine();
    const { start } = this.wall;
    const points = [];
    const c = [];

    const walls = this.sortWalls(
      [...start.wallStarts, ...start.wallEnds],
      start,
      -1
    );

    walls.length && c.push(walls[0]);

    const vec1 = new THREE.Vector3(
      line.end.x - line.start.x,
      0,
      line.end.y - line.start.y
    );

    c.forEach((wall) => {
      try {
        const oppo = wall.oppositeCorner(start);
        const vec2 = new THREE.Vector3(oppo.x - start.x, 0, oppo.y - start.y);
        const angle = this.calculateAngle(vec1, vec2, -1);
        const edge = wall.edge;
        edge && points.push(...this.getEdgeCrossPoints(line, edge, angle));
      } catch (_) {}
    });
    if (points.length === 0) return line.start;

    return this.findBestCandidate(c, points, -1, line.end, line.start, start);
  }

  midStart() {
    const { start } = this.wall;
    return {
      x: start.x,
      y: start.y,
    };
  }

  midEnd() {
    const { end } = this.wall;
    return {
      x: end.x,
      y: end.y,
    };
  }

  /** Get the corners of the half edge.
   * @returns An array of x,y pairs.
   */
  corners() {
    const { start } = this.wall;
    const log = start.x === -9 && start.y === 6;
    const data = [
      this.midStart(log),
      this.interiorStart(log),
      this.interiorEnd(log),
      this.midEnd(log),
      this.exteriorEnd(log),
      this.exteriorStart(log),
    ];
    // if (end.x === 5 && end.y === -6) {
    //   console.log("is end", [start.x, start.y], [end.x, end.y]);
    //   console.log(data);
    // }

    return data;
  }
}
