import * as THREE from "three";
import polyLabel from "polylabel";
import Core from ".";
export class Utils {
  /**
   * get absolute angle between x axis(1, 0)
   * @param {Number} x
   * @param {Number} y
   */
  static absoluteAngle(x, y) {
    if (x === 0 && y === 0) return 0;
    let angle = Math.atan(y / x);
    if (angle === 0) {
      if (x < 0) angle = Math.PI;
    } else if (angle === Math.PI) {
    } else if (angle === -Math.PI / 2) angle = (Math.PI * 3) / 2;
    else if (angle > 0) {
      if (x < 0 && y < 0) angle = Math.PI + angle;
    } else {
      if (x < 0 && y > 0) angle = Math.PI + angle;
      else if (x > 0 && y < 0) angle = Math.PI * 2 + angle;
    }
    return angle;
  }

  /**
   * Get Projection Point to Line
   * @param {Number} px Point X
   * @param {Number} py Point Y
   * @param {Number} x1 Line Start X
   * @param {Number} y1 Line Start Y
   * @param {Number} x2 Line End X
   * @param {Number} y2 Line End Y
   */
  static projectionPointToLine(px, py, x1, y1, x2, y2) {
    const getAngleBetweenVectors = (
      vector1,
      vector2 = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
      ]
    ) => {
      const v1 = JSON.parse(JSON.stringify(vector1));
      const v2 = JSON.parse(JSON.stringify(vector2));
      // adjust vectors(move to (0, 0))
      v1[1].x -= v1[0].x;
      v1[1].y -= v1[0].y;
      v1[0] = { x: 0, y: 0 };

      v2[1].x -= v2[0].x;
      v2[1].y -= v2[0].y;
      v2[0] = { x: 0, y: 0 };

      try {
        let v =
          (v1[1].x * v2[1].x + v1[1].y * v2[1].y) /
          (Math.sqrt(v1[1].x ** 2 + v1[1].y ** 2) *
            Math.sqrt(v2[1].x ** 2 + v2[1].y ** 2));
        if (v > 1) v = 1;
        else if (v < -1) v = -1;
        const angle = Math.acos(v);
        return angle;
      } catch (_) {
        return 0;
      }
    };

    try {
      const angle = getAngleBetweenVectors(
        [
          { x: x1, y: y1 },
          { x: px, y: py },
        ],
        [
          { x: x1, y: y1 },
          { x: x2, y: y2 },
        ]
      );

      // get vector length
      const L1 = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

      // get distance from start of vector
      const l = Math.sqrt((x1 - px) ** 2 + (y1 - py) ** 2);

      // L2 = l * cos(angle);
      const L2 = l * Math.cos(angle);

      const x = x1 + ((x2 - x1) * L2) / L1;
      const y = y1 + ((y2 - y1) * L2) / L1;

      return { x, y };
    } catch (_) {
      return { x: 0, y: 0 };
    }
  }

  /** Determines the distance of a point from a line.
   * @param x Point's x coordinate.
   * @param y Point's y coordinate.
   * @param x1 Line-Point 1's x coordinate.
   * @param y1 Line-Point 1's y coordinate.
   * @param x2 Line-Point 2's x coordinate.
   * @param y2 Line-Point 2's y coordinate.
   * @returns The distance.
   */
  static pointDistanceFromLine(x, y, x1, y1, x2, y2) {
    const tPoint = Utils.closestPointOnLine(x, y, x1, y1, x2, y2);
    const tDx = x - tPoint.x;
    const tDy = y - tPoint.y;
    return Math.sqrt(tDx * tDx + tDy * tDy);
  }

  /** Gets the projection of a point onto a line.
   * @param x Point's x coordinate.
   * @param y Point's y coordinate.
   * @param x1 Line-Point 1's x coordinate.
   * @param y1 Line-Point 1's y coordinate.
   * @param x2 Line-Point 2's x coordinate.
   * @param y2 Line-Point 2's y coordinate.
   * @returns The point.
   */
  static closestPointOnLine(x, y, x1, y1, x2, y2) {
    // Inspired by: http://stackoverflow.com/a/6853926
    const tA = x - x1;
    const tB = y - y1;
    const tC = x2 - x1;
    const tD = y2 - y1;

    const tDot = tA * tC + tB * tD;
    const tLenSq = tC * tC + tD * tD;
    const tParam = tDot / tLenSq;

    let tXx;
    let tYy;

    if (tParam < 0 || (x1 === x2 && y1 === y2)) {
      tXx = x1;
      tYy = y1;
    } else if (tParam > 1) {
      tXx = x2;
      tYy = y2;
    } else {
      tXx = x1 + tParam * tC;
      tYy = y1 + tParam * tD;
    }

    return {
      x: tXx,
      y: tYy,
    };
  }

  /** Gets the distance of two points.
   * @param x1 X part of first point.
   * @param y1 Y part of first point.
   * @param x2 X part of second point.
   * @param y2 Y part of second point.
   * @returns The distance.
   */
  static distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  /**  Gets the angle between 0,0 -> x1,y1 and 0,0 -> x2,y2 (-pi to pi)
   * @returns The angle.
   */
  static angle(x1, y1, x2, y2) {
    const tDot = x1 * x2 + y1 * y2;
    const tDet = x1 * y2 - y1 * x2;
    const tAngle = -Math.atan2(tDet, tDot);
    return tAngle;
  }

  /** shifts angle to be 0 to 2pi */
  static angle2pi(x1, y1, x2, y2) {
    let tTheta = Utils.angle(x1, y1, x2, y2);
    if (tTheta < 0) {
      tTheta += 2 * Math.PI;
    }
    return tTheta;
  }

  /** Checks if an array of points is clockwise.
   * @param points Is array of points with x,y attributes
   * @returns True if clockwise.
   */
  static isClockwise(points) {
    // make positive
    const tSubX = Math.min(
      0,
      Math.min.apply(
        null,
        Utils.map(points, (p) => {
          return p.x;
        })
      )
    );
    const tSubY = Math.min(
      0,
      Math.min.apply(
        null,
        Utils.map(points, (p) => {
          return p.x;
        })
      )
    );

    const tNewPoints = Utils.map(points, (p) => {
      return {
        x: p.x - tSubX,
        y: p.y - tSubY,
      };
    });

    // determine CW/CCW, based on:
    // http://stackoverflow.com/questions/1165647
    let tSum = 0;
    for (let tI = 0; tI < tNewPoints.length; tI++) {
      const tC1 = tNewPoints[tI];
      var tC2;
      if (tI === tNewPoints.length - 1) {
        tC2 = tNewPoints[0];
      } else {
        tC2 = tNewPoints[tI + 1];
      }
      tSum += (tC2.x - tC1.x) * (tC2.y + tC1.y);
    }
    return tSum >= 0;
  }

  /** Creates a Guid.
   * @returns A new Guid.
   */
  static guid() {
    const tS4 = function () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .slice(1);
    };

    return `${tS4() + tS4()
      }-${tS4()}-${tS4()}-${tS4()}-${tS4()}${tS4()}${tS4()}`;
  }

  /** both arguments are arrays of corners with x,y attributes */
  static polygonPolygonIntersect(firstCorners, secondCorners) {
    for (let tI = 0; tI < firstCorners.length; tI++) {
      const tFirstCorner = firstCorners[tI];
      var tSecondCorner;

      if (tI === firstCorners.length - 1) {
        tSecondCorner = firstCorners[0];
      } else {
        tSecondCorner = firstCorners[tI + 1];
      }

      if (
        Utils.linePolygonIntersect(
          tFirstCorner.x,
          tFirstCorner.y,
          tSecondCorner.x,
          tSecondCorner.y,
          secondCorners
        )
      ) {
        return true;
      }
    }
    return false;
  }

  /** Corners is an array of points with x,y attributes */
  static linePolygonIntersect(x1, y1, x2, y2, corners) {
    for (let tI = 0; tI < corners.length; tI++) {
      const tFirstCorner = corners[tI];
      var tSecondCorner;
      if (tI === corners.length - 1) {
        tSecondCorner = corners[0];
      } else {
        tSecondCorner = corners[tI + 1];
      }

      if (
        Utils.lineLineIntersect(
          x1,
          y1,
          x2,
          y2,
          tFirstCorner.x,
          tFirstCorner.y,
          tSecondCorner.x,
          tSecondCorner.y
        )
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Find line / line cross point
   * L1: [[x1, y1], [x2, y2]]
   * L2: [[x3, y3], [x4, y4]]
   * @param {Number} x1
   * @param {Number} y1
   * @param {Number} x2
   * @param {Number} y2
   * @param {Number} x3
   * @param {Number} y3
   * @param {Number} x4
   * @param {Number} y4
   * @param {Boolean} i
   * @returns
   */
  static findLineLineCrossPoint(x1, y1, x2, y2, x3, y3, x4, y4, i = false) {
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
      return false;
    }

    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    // Lines are parallel
    if (denominator === 0) {
      return false;
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments
    if (i) {
      if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false;
      }
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);

    return { x, y };
  }

  /** */
  static lineLineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    function tCCW(p1, p2, p3) {
      const tA = p1.x;
      const tB = p1.y;
      const tC = p2.x;
      const tD = p2.y;
      const tE = p3.x;
      const tF = p3.y;
      return (tF - tB) * (tC - tA) > (tD - tB) * (tE - tA);
    }

    const tP1 = {
      x: x1,
      y: y1,
    };
    const tP2 = {
      x: x2,
      y: y2,
    };
    const tP3 = {
      x: x3,
      y: y3,
    };
    const tP4 = {
      x: x4,
      y: y4,
    };
    return (
      tCCW(tP1, tP3, tP4) !== tCCW(tP2, tP3, tP4) &&
      tCCW(tP1, tP2, tP3) !== tCCW(tP1, tP2, tP4)
    );
  }

  /**
    @param corners Is an array of points with x,y attributes
    @param startX X start coord for raycast
    @param startY Y start coord for raycast
  */
  static pointInPolygon(x, y, corners, startX, startY) {
    // startX = startX || 0;
    // startY = startY || 0;

    // ensure that point(startX, startY) is outside the polygon consists of corners
    let tMinX = 0;
    let tMinY = 0;

    if (startX === undefined || startY === undefined) {
      for (var tI = 0; tI < corners.length; tI++) {
        tMinX = Math.min(tMinX, corners[tI].x);
        tMinY = Math.min(tMinX, corners[tI].y);
      }
      startX = tMinX - 10;
      startY = tMinY - 10;
    }

    let tIntersects = 0;
    for (tI = 0; tI < corners.length; tI++) {
      const tFirstCorner = corners[tI];
      var tSecondCorner;
      if (tI === corners.length - 1) {
        tSecondCorner = corners[0];
      } else {
        tSecondCorner = corners[tI + 1];
      }

      if (
        Utils.lineLineIntersect(
          startX,
          startY,
          x,
          y,
          tFirstCorner.x,
          tFirstCorner.y,
          tSecondCorner.x,
          tSecondCorner.y
        )
      ) {
        tIntersects++;
      }
    }
    // odd intersections means the point is in the polygon
    return tIntersects % 2 === 1;
  }

  /** Checks if all corners of insideCorners are inside the polygon described by outsideCorners */
  static polygonInsidePolygon(insideCorners, outsideCorners, startX, startY) {
    // startX = startX || 0;
    // startY = startY || 0;

    for (const element of insideCorners) {
      if (
        !Utils.pointInPolygon(
          element.x,
          element.y,
          outsideCorners,
          startX,
          startY
        )
      ) {
        return false;
      }
    }
    return true;
  }

  /** Checks if any corners of firstCorners is inside the polygon described by secondCorners */
  static polygonOutsidePolygon(insideCorners, outsideCorners, startX, startY) {
    startX = startX || 0;
    startY = startY || 0;

    for (const element of insideCorners) {
      if (
        Utils.pointInPolygon(
          element.x,
          element.y,
          outsideCorners,
          startX,
          startY
        )
      ) {
        return false;
      }
    }
    return true;
  }

  // arrays

  static forEach(array, action) {
    for (const element of array) {
      action(element);
    }
  }

  static forEachIndexed(array, action) {
    for (const [tI, element] of array.entries()) {
      action(tI, element);
    }
  }

  static map(array, func) {
    const tResult = [];
    array.forEach((element) => {
      tResult.push(func(element));
    });
    return tResult;
  }

  /** Remove elements in array if func(element) returns true */
  static removeIf(array, func) {
    const tResult = [];
    array.forEach((element) => {
      if (!func(element)) {
        tResult.push(element);
      }
    });
    return tResult;
  }

  /** Shift the items in an array by shift (positive integer) */
  static cycle(arr, shift) {
    const tReturn = arr.slice(0);
    for (let tI = 0; tI < shift; tI++) {
      const tmp = tReturn.shift();
      tReturn.push(tmp);
    }
    return tReturn;
  }

  /** Returns in the unique elemnts in arr */
  static unique(arr, hashFunc) {
    const tResults = [];
    const tMap = {};
    for (const element of arr) {
      if (!tMap.hasOwnProperty(element)) {
        tResults.push(element);
        tMap[hashFunc(element)] = true;
      }
    }
    return tResults;
  }

  /** Remove value from array, if it is present */
  static removeValue(array, value) {
    for (let tI = array.length - 1; tI >= 0; tI--) {
      if (array[tI] === value) {
        array.splice(tI, 1);
      }
    }
  }

  /** Checks if value is in array */
  static hasValue = function (array, value) {
    for (const element of array) {
      if (element === value) {
        return true;
      }
    }
    return false;
  };

  /** Subtracts the elements in subArray from array */
  static subtract(array, subArray) {
    return Utils.removeIf(array, (el) => {
      return Utils.hasValue(subArray, el);
    });
  }

  static area(points = []) {
    if (!Array.isArray(points) || points.length === 0) return 0;
    const length = points.length;
    var square = 0,
      i,
      j,
      point1,
      point2;

    for (i = 0, j = length - 1; i < length; j = i, i += 1) {
      point1 = points[i];
      point2 = points[j];
      square += point1.x * point2.y;
      square -= point1.y * point2.x;
    }
    square *= 0.5;

    return Math.abs(square);
  }

  static centroid(points = []) {
    try {
      let p = polyLabel([points.map((p) => [p.x, p.y])]);
      return { x: p[0], y: p[1] };
    } catch {
      return { x: 0, y: 0 };
    }
  }

  static argsort(numericalValues, direction = 1) {
    var indices = Array.from(
      new Array(numericalValues.length),
      (val, index) => index
    );
    return indices
      .map((item, index) => [numericalValues[index], item])
      .sort(([count1], [count2]) => (count1 - count2) * direction)
      .map(([, item]) => item);
  }

  static getCyclicOrder(points, start = undefined) {
    if (!start) {
      start = new THREE.Vector2(0, 0);
    }
    var angles = [];
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      var vect = point.clone().sub(start);
      var radians = Math.atan2(vect.y, vect.x);
      var degrees = THREE.Math.radToDeg(radians);
      degrees = degrees > 0 ? degrees : (degrees + 360) % 360;
      angles.push(degrees);
    }
    var indices = Utils.argsort(angles);
    var sortedAngles = [];
    var sortedPoints = [];
    for (i = 0; i < indices.length; i++) {
      sortedAngles.push(angles[indices[i]]);
      sortedPoints.push(points[indices[i]]);
    }
    return { indices: indices, angles: sortedAngles, points: sortedPoints };
  }
}

export class Utils3D {
  static checkIf4PointsOnSamePlane(p1, p2, p3, p4) {
    const delta = 1e-12;
    const v1 = new THREE.Vector3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
    const v2 = new THREE.Vector3(p3.x - p1.x, p3.y - p1.y, p3.z - p1.z);
    const v3 = new THREE.Vector3(p4.x - p1.x, p4.y - p1.y, p4.z - p1.z);
    const c1 = v1.clone().cross(v2).normalize();
    const c1n = c1.clone().negate();
    const c2 = v2.clone().cross(v3).normalize();
    const dist1 = c1.distanceTo(c2);
    const dist2 = c1n.distanceTo(c2);
    return dist1 < delta || dist2 < delta;
  }

  static findLineLineCrossPoint(s1, e1, s2, e2) {
    const onSamePlane = this.checkIf4PointsOnSamePlane(s1, e1, s2, e2);
    if (!onSamePlane) return null;
    const tmpPoint = Utils.findLineLineCrossPoint(
      s1.x,
      s1.z,
      e1.x,
      e1.z,
      s2.x,
      s2.z,
      e2.x,
      e2.z,
      true
    );
    if (!tmpPoint) return null;
    const point = new THREE.Vector3(tmpPoint.x, 0, tmpPoint.y);
    const L = Math.sqrt((e1.x - s1.x) ** 2 + (e1.z - s1.z) ** 2);
    const l = Math.sqrt((point.x - s1.x) ** 2 + (point.z - s1.z) ** 2);
    point.y = s1.y + ((e1.y - s1.y) * l) / L;
    return point;
  }

  static findLargestInscribedRectOfWallCorners(corners) {
    if (corners.length < 3) return null;
    const length = corners[0].distanceTo(corners[1]);

    // convert to 2d
    const points = corners.map((c) => {
      return new THREE.Vector2(
        Math.sqrt((c.x - corners[0].x) ** 2 + (c.z - corners[0].z) ** 2),
        c.y
      );
    });

    // set min/max x
    for (let i = 2; i < points.length; i++) {
      if (points[i].x > points[1].x) points[i].x = points[1].x;
      if (points[i].x < points[0].x) points[i].x = points[0].x;
    }

    let height = 0;
    let minX = +Infinity;
    let maxX = -Infinity;
    for (const p of points) {
      if (p.y > height) height = p.y;
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
    }
    minX -= 1;
    maxX += 1;
    const x1 = minX;
    const x2 = maxX;
    const step = 0.01;

    let maxArea = 0;
    let bestUpperPoints = null;
    let bestLength = 0;
    let bestHeight = 0;

    for (let dh = height - step; dh > 0; dh -= step) {
      let upperPoints = [];
      for (let i = 0; i < points.length; i++) {
        let p1 = points[i];
        let p2 = points[(i + 1) % points.length];
        let p = Utils.findLineLineCrossPoint(
          x1,
          dh,
          x2,
          dh,
          p1.x,
          p1.y,
          p2.x,
          p2.y,
          true
        );
        p && upperPoints.push(p);
      }
      if (upperPoints.length === 2) {
        let length = Math.abs(upperPoints[0].x - upperPoints[1].x);
        let area = length * dh;
        if (area > maxArea) {
          maxArea = area;
          bestUpperPoints = upperPoints;
          bestHeight = dh;
          bestLength = length;
        }
      }
    }
    if (!bestUpperPoints || bestUpperPoints.length !== 2) return null;

    const res = {
      area: maxArea,
      length: bestLength,
      height: bestHeight,
      corners: [],
    };
    const tmp = [
      { x: bestUpperPoints[0].x, y: 0 },
      { x: bestUpperPoints[1].x, y: 0 },
      { x: bestUpperPoints[1].x, y: bestHeight },
      { x: bestUpperPoints[0].x, y: bestHeight },
    ];
    for (const c of tmp) {
      const y = c.y;
      const x = ((corners[1].x - corners[0].x) * c.x) / length + corners[0].x;
      const z = ((corners[1].z - corners[0].z) * c.x) / length + corners[0].z;
      res.corners.push(new THREE.Vector3(x, y, z));
    }
    return res;
  }

  static drawVertexSpriteLabel(sprite, label) {
    if (!Core.Configuration.getBooleanValue(Core.configDimensionLabelVisible))
      return;
    const { canvas } = sprite;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = `Bold 16px Arial`;
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillStyle = `rgba(0, 0, 255, 1)`;
    context.fillText(label, canvas.width / 2, canvas.height / 2);
    context.strokeStyle = "#ffffff";
    context.lineWidth = 0.1;
    context.strokeText(label, canvas.width / 2, canvas.height / 2);
    // context.clearRect(0, 0, canvas.width, canvas.height);
  }

  static makeVertexDimensionHelper(vertex) {
    const position = vertex.clone();
    position.y += 0.2;
    const canvas = document.createElement("canvas");
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      depthTest: false,
      transparent: true,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 1.5, 2);
    sprite.position.copy(position);
    sprite.renderOrder = 100;

    sprite.vertex = vertex;
    sprite.canvas = canvas;
    return sprite;
  }

  static checkIsSamePlane(f, _f) {
    if (!f || !_f) return false;
    const tolerance = 1e-2;
    const n = f.normal;
    const _n = _f.normal;

    const c = f.constant;
    const _c = _f.constant;

    if (n.distanceTo(_n) < tolerance && Math.abs(c - _c) < tolerance) {
      return true;
    }
    return false;
  }
}
