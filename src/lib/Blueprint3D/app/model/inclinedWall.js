import * as THREE from "three";
import RoofItem from "../items/roof_item";
import Core from "../core";
export default class InclinedWall {
  room = null;
  corners = [];
  plane = null;
  conduction = 0;
  constructor(room, corners, plane) {
    this.room = room;
    this.corners = corners;
    this.plane = plane;
    this.conduction = plane.conduction;
  }

  getItems = () => {
    const tolerance = 1e-2;
    const { floorplan } = this.room.layer;
    const { corners, plane } = this;
    const points = corners.map((c) => c.clone());

    const roofPolygon = points.map((p) => ({ x: p.x, y: p.z }));

    const items = floorplan.scene.items.filter((item) => {
      // filter non roof items
      if (!(item instanceof RoofItem)) return false;

      // filter by distance
      if (plane.distanceToPoint(item.position) > tolerance) return false;

      // filter by same inclined wall
      const p = item.position;
      if (!Core.Utils.pointInPolygon(p.x, p.z, roofPolygon)) return false;

      return true;
    });
    return items;
  };

  getMatrix = () => {
    const { normal } = this.plane;

    const center = this.getCenter();
    const arrowHelper = new THREE.ArrowHelper(normal, center, normal.length());

    // convert to 2d plane
    const tt = new THREE.Matrix4();
    tt.makeTranslation(-center.x, -center.y, -center.z);
    const tr = new THREE.Matrix4();
    tr.makeRotationFromEuler(arrowHelper.rotation).invert();

    const matrix = new THREE.Matrix4().multiplyMatrices(tt, tr);
    return matrix;
  };

  getArea = () => {
    const { corners } = this;
    if (corners.length < 3) return 0;
    const points = corners.map((c) => c.clone());

    const matrix = this.getMatrix();
    points.forEach((p) => p.applyMatrix4(matrix));
    const area = Core.Utils.area(points.map((p) => ({ x: p.x, y: p.z })));

    return area;
  };

  exposedArea = () => this.getArea();

  getDirection = (orientation) => {
    let direction = 0;
    if (this.plane instanceof THREE.Plane) {
      const { normal } = this.plane;
      const vec3 = new THREE.Vector3(-normal.x, 0, -normal.z);
      const target = new THREE.Vector3(0, 0, -1);
      let angle = vec3.angleTo(target);
      const yNormal = vec3.clone().cross(target);
      if (yNormal.y < 0) angle *= -1;
      direction = (angle / Math.PI) * 180 - orientation;
      if (direction < 0) direction += 360;
    }
    return direction;
  };

  checkIsOutsideWall = () => true;

  getInclination = () => {
    if (this.plane instanceof THREE.Plane) {
      const normal = this.plane.normal;
      const base = normal.clone();
      base.y = 0;
      let angle = base.angleTo(normal);
      return (angle / Math.PI) * 180;
    }
    return 90;
  };

  getCenter = () => {
    const { corners } = this;
    const center = new THREE.Vector3();
    corners.forEach((c) => center.add(c));
    center.multiplyScalar(1 / corners.length);
    return center;
  };

  getWallCentroid = () => {
    const center = this.getCenter();
    return [center.x, center.z, center.y];
  };

  getConduction = () => {
    return this.conduction;
  };

  getWindowShare = () => {
    const items = this.getItems();
    const area = this.getArea();
    let windowArea = 0;
    items.forEach((item) => {
      const { halfSize } = item;
      windowArea += halfSize.x * halfSize.y * 4;
    });
    return windowArea / area;
  };

  getWindowHeight = () => {
    return 0;
  };

  getWindowSillHeight = () => {
    return 0;
  };
}
