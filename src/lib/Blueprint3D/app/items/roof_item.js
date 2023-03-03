import * as THREE from "three";
import Core from "../core";
import Item, { MORPH_ALIGN_BACK } from "./item";
import { POSITION_TYPES } from "./position";

export default class RoofItem extends Item {
  currentRoofFace = null;
  currentInclinedWall = null;

  /** used for finding rotations */
  refVec = new THREE.Vector2(0, 1);

  /** */
  sizeX = 0;

  /** */
  sizeY = 0;

  forceVisible = true;

  roof = null;

  isRoofItem = true;

  constructor(model, metadata, meshList, position, rotation, options) {
    super(model, metadata, meshList, position, rotation, options);

    this.allowRotate = false;
    this.morphAlign = MORPH_ALIGN_BACK;

    this.roof = this.model.floorplan.roof;
    this.roof.items.push(this);
  }

  /** */
  removed() {
    Core.Utils.removeValue(this.roof.items, this);
  }

  changeRoofFace = (mesh, vec3 = this.position) => {
    if (!mesh) return;
    if (this.currentRoofFace != null) {
      Core.Utils.removeValue(this.currentRoofFace.face.items, this);
    }
    mesh.face.items.push(this);

    const inclinedWalls = [];

    [
      ...this.model.floorplan.getRooms(),
      ...this.model.floorplan.roofLayer.rooms,
    ].forEach((room) => inclinedWalls.push(...room.inclinedWalls));

    let activeInclinedWall = null;
    for (const wall of inclinedWalls) {
      if (Core.Utils3D.checkIsSamePlane(wall.plane, mesh.plane)) {
        const { corners } = wall;
        const roofPolygon = [];
        for (const p of corners) {
          roofPolygon.push({ x: p.x, y: p.z });
        }
        if (Core.Utils.pointInPolygon(vec3.x, vec3.z, roofPolygon)) {
          activeInclinedWall = wall;
          break;
        }
      }
    }

    this.currentRoofFace = mesh;
    this.currentInclinedWall = activeInclinedWall;
    window.currentRoofFace = this.currentRoofFace;
    window.currentInclinedWall = this.currentInclinedWall;
  };

  redrawRoof = () => {
    this.castShadow = false;
    this.children.forEach(_m => _m.castShadow = false)
    document.dispatchEvent(new CustomEvent(Core.BP3D_REQUEST_REDRAW_ROOF));
  }

  /** */
  updateRoofVisibility(visible, front) {
    this.visible = visible;
    this.dimensionHelper.visible = visible;
  }

  /** */
  updateSize() { }

  /** */
  resized() {
    this.updateSize();
    // this.redrawWall();
  }

  /** */
  placeInRoom() { }

  closestRoofFace = (position = this.position) => {
    const { roofFaces } = this.model.three.floorplan;
    const faces = roofFaces.map((face) => face.mesh);
    const tolerance = 1e-3;
    for (const face of faces) {
      const d = Math.abs(face.plane.distanceToPoint(position));
      if (d < tolerance) return face;
    }
    return null;
  };

  setPosition = (vec3) => {
    const newPos = new THREE.Vector3().copy(vec3);
    const face = this.closestRoofFace(vec3);
    this.boundMove(newPos, { object: face });
    this.position.copy(newPos);
    this.dimensionHelper.position.copy(newPos);
    this.changed();
    setTimeout(this.redrawRoof, 10);
  };

  /** */
  moveToPosition(vec3, intersection) {
    if (isNaN(vec3.x) || isNaN(vec3.y) || isNaN(vec3.z)) {
      console.log("nan detected");
      return;
    }
    this.boundMove(vec3, intersection);
    const validPosition = this.isValidPosition(vec3);
    if (validPosition === POSITION_TYPES.inRoof) {
      this.hideError();
      this.position.copy(vec3);
      const tmp = new THREE.Vector3().copy(vec3);
      this.dimensionHelper.position.copy(tmp);
      this.changed();
      this.redrawRoof();
    } else if (
      validPosition === POSITION_TYPES.outofroof ||
      validPosition === POSITION_TYPES.overlapped
    ) {
      this.showError(vec3);
    }
  }

  /** Returns an array of planes to use other than the ground plane
   * for passing intersection to clickPressed and clickDragged */
  customIntersectionPlanes() {
    try {
      const { roofFaces } = this.model.three.floorplan;
      return roofFaces.map((face) => face.mesh);
    } catch (_) {
      return [];
    }
  }

  /** takes the move vec3, and makes sure object stays bounded on plane */
  boundMove(vec3, intersection) {
    try {
      const mesh = intersection.object;
      const { vecV } = mesh;
      const target = this.position.clone().sub(vecV);
      this.lookAt(target);
      this.dimensionHelper.lookAt(target);
      this.changeRoofFace(intersection.object, vec3);
    } catch (_) { }
  }

  projectionBounding = (vec3 = this.position) => {
    const box = [];
    const delta = vec3.clone().sub(this.dimensionHelper.position);
    const names = ["top-left", "top-right", "bottom-right", "bottom-left"];
    this.dimensionHelper.traverse((mesh) => {
      if (names.includes(mesh.name)) {
        let target = new THREE.Vector3();
        mesh.getWorldPosition(target);
        target.add(delta);
        box.push(target);
      }
    });
    return box;
  };

  isValidPosition = (vec3) => {
    if (!this.currentInclinedWall) return POSITION_TYPES.outofroof;

    const bounding = this.projectionBounding(vec3);
    if (!bounding) return POSITION_TYPES.outofroof;

    const roofPolygon = [];
    const itemPolygon = [];
    (() => {
      const { corners } = this.currentInclinedWall;
      const cornerPoints = corners.map((c) => c.clone());
      const boundingPoints = bounding.map((b) => b.clone());
      cornerPoints.forEach((p) => {
        roofPolygon.push({ x: p.x, y: p.z });
      });
      boundingPoints.forEach((p) => {
        itemPolygon.push({ x: p.x, y: p.z });
      });
    })();

    if (!Core.Utils.polygonInsidePolygon(itemPolygon, roofPolygon)) {
      return POSITION_TYPES.outofroof;
    }
    const items = this.currentInclinedWall.getItems();
    for (const item of items) {
      if (item === this) continue;
      const polygon = item.projectionBounding().map((p) => {
        return { x: p.x, y: p.z };
      });
      if (Core.Utils.polygonPolygonIntersect(itemPolygon, polygon))
        return POSITION_TYPES.overlapped;
    }
    return POSITION_TYPES.inRoof;
  };
}
