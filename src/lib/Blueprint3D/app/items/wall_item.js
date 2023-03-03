import * as THREE from "three";
import Item, { MORPH_ALIGN_BACK } from "./item";
import Core from "../core";

export default class WallItem extends Item {
  /** The currently applied wall edge. */
  currentWallEdge = null;
  /* TODO:
     This caused a huge headache.
     HalfEdges get destroyed/created every time floorplan is edited.
     This item should store a reference to a wall and front/back,
     and grab its edge reference dynamically whenever it needs it.
   */

  /** used for finding rotations */
  refVec = new THREE.Vector2(0, 1);

  /** */
  wallOffsetScalar = 0;

  /** */
  sizeX = 0;

  /** */
  sizeY = 0;

  /** */
  addToWall = false;

  /** */
  boundToFloor = false;

  /** */
  frontVisible = false;

  /** */
  backVisible = false;

  forceVisible = true;

  constructor(model, metadata, meshList, position, rotation, options) {
    super(model, metadata, meshList, position, rotation, options);

    this.allowRotate = false;
    this.morphAlign = MORPH_ALIGN_BACK;
  }

  /** Get the closet wall edge.
   * @returns The wall edge.
   */
  closestWallEdge(position = this.position) {
    const { buildingOffset } = this.model.floorplan;
    const wallEdges = this.model.floorplan.wallEdges();
    let wallEdge = null;
    let minDistance = +Infinity;

    const itemX = position.x;
    const itemY = position.y;
    const itemZ = position.z;

    wallEdges.forEach((edge) => {
      const distance2d = edge.distanceTo(itemX, itemZ);
      const distance = Math.sqrt(
        distance2d ** 2 + (itemY - edge.layerOffset - buildingOffset) ** 2
      );
      if (distance < minDistance) {
        minDistance = distance;
        wallEdge = edge;
      }
    });

    return wallEdge;
  }

  /** */
  removed() {
    if (this.currentWallEdge != null && this.addToWall) {
      Core.Utils.removeValue(this.currentWallEdge.wall.items, this);
      this.redrawWall();
    }
  }

  /** */
  redrawWall() {
    if (this.addToWall) {
      this.currentWallEdge &&
        this.currentWallEdge.wall &&
        this.currentWallEdge.wall.fireRedraw();
    }
  }

  /** */
  updateEdgeVisibility(visible, front) {
    if (front) {
      this.frontVisible = visible;
    } else {
      this.backVisible = visible;
    }
    if (!this.forceVisible) {
      this.visible = false;
    } else {
      this.visible = this.frontVisible || this.backVisible;
    }
  }

  /** */
  updateSize() {
    const boundingBox = this.getBounding();
    this.wallOffsetScalar =
      ((boundingBox.max.z - boundingBox.min.z) * this.scale.z) / 2;
    this.sizeX = (boundingBox.max.x - boundingBox.min.x) * this.scale.x;
    this.sizeY = (boundingBox.max.y - boundingBox.min.y) * this.scale.y;
  }

  /** */
  resized() {
    if (this.boundToFloor) {
      // let boundingBox = this.getBounding();
      // this.position.y = 0.5 * (boundingBox.max.y - boundingBox.min.y) * this.scale.y + 0.01;
    }

    this.updateSize();
    this.redrawWall();
  }

  /** */
  placeInRoom() {
    const closestWallEdge = this.closestWallEdge();
    this.changeWallEdge(closestWallEdge);
    this.updateSize();

    if (!this.position_set) {
      // position not set
      const center = closestWallEdge.interiorCenter();
      const newPos = new THREE.Vector3(
        center.x,
        closestWallEdge.wall.height / 2,
        center.y
      );
      this.boundMove(newPos);
      this.position.copy(newPos);
      this.redrawWall();
    }

    this.changed();
  }

  setPosition = (vec3) => {
    const closestWallEdge = this.closestWallEdge(vec3);
    this.changeWallEdge(closestWallEdge);

    const newPos = new THREE.Vector3().copy(vec3);
    this.boundMove(newPos);
    this.position.copy(newPos);
    this.dimensionHelper.position.copy(newPos);
    this.redrawWall();

    this.changed();
  };

  /** */
  moveToPosition(vec3, intersection) {
    if (isNaN(vec3.x) || isNaN(vec3.y) || isNaN(vec3.z)) {
      console.log("nan detected");
      return;
    }
    // console.log(intersection.object.edge);
    this.changeWallEdge(intersection.object.edge);
    this.boundMove(vec3);
    this.position.copy(vec3);
    const tmp = new THREE.Vector3().copy(vec3);
    const boundingBox = this.getBounding();
    tmp.y = (boundingBox.max.y + boundingBox.min.y) / 2;
    this.dimensionHelper.position.copy(tmp);
    this.redrawWall();
    this.changed();
  }

  /** */
  getWallOffset() {
    return this.wallOffsetScalar;
  }

  /** */
  changeWallEdge(wallEdge) {
    if (this.currentWallEdge != null) {
      if (this.addToWall) {
        Core.Utils.removeValue(this.currentWallEdge.wall.items, this);
        this.redrawWall();
      } else {
        Core.Utils.removeValue(this.currentWallEdge.wall.onItems, this);
      }
    }

    // handle subscription to wall being removed
    if (this.currentWallEdge != null) {
      this.currentWallEdge.wall.dontFireOnDelete(this.remove.bind(this));
    }
    wallEdge.wall.fireOnDelete(this.remove.bind(this));

    // find angle between wall normals
    const normal2 = new THREE.Vector2();
    const normal3 = wallEdge.plane.geometry.faces[0].normal;
    normal2.x = normal3.x;
    normal2.y = normal3.z;

    let angle = Core.Utils.angle(
      this.refVec.x,
      this.refVec.y,
      normal2.x,
      normal2.y
    );

    if (this.flipped) {
      angle = (angle + Math.PI) % (Math.PI * 2);
    }
    this.rotation.y = angle;
    this.dimensionHelper.rotation.y = angle;

    // update currentWall
    this.currentWallEdge = wallEdge;
    if (this.addToWall) {
      wallEdge.wall.items.push(this);
      this.redrawWall();
    } else {
      wallEdge.wall.onItems.push(this);
    }
  }

  /** Returns an array of planes to use other than the ground plane
   * for passing intersection to clickPressed and clickDragged */
  customIntersectionPlanes() {
    return this.model.floorplan.wallEdgePlanes();
  }

  /** takes the move vec3, and makes sure object stays bounded on plane */
  boundMove(vec3) {
    const edge = this.currentWallEdge;
    const tolerance = 0.002;
    const layerOffset = edge.layerOffset + this.model.floorplan.buildingOffset;
    vec3.applyMatrix4(edge.interiorTransform);

    if (vec3.x < this.sizeX / 2 + tolerance) {
      vec3.x = this.sizeX / 2 + tolerance;
    } else if (vec3.x > edge.interiorDistance() - this.sizeX / 2 - tolerance) {
      vec3.x = edge.interiorDistance() - this.sizeX / 2 - tolerance;
    }

    if (this.boundToFloor) {
      vec3.y = 0 * this.scale.y + 0.01 + layerOffset;
    } else if (vec3.y < tolerance + layerOffset) {
      vec3.y = tolerance + layerOffset;
    } else if (vec3.y > edge.height - this.sizeY - tolerance + layerOffset) {
      vec3.y = edge.height - this.sizeY - tolerance + layerOffset;
    } else {
    }

    vec3.z = this.getWallOffset();

    vec3.applyMatrix4(edge.invInteriorTransform);
  }
}
