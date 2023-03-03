import * as THREE from "three";
import Item from "./item";
import Core from "../core";
import { POSITION_TYPES } from "./position";

const snapThreshold = 0.2;

const spacing = 0;

export default class FloorItem extends Item {
  // constructor(model, metadata, meshList, position, rotation, scale) {
  //   super(model, metadata, meshList, position, rotation, scale);
  // };

  /** */
  placeInRoom() {
    // this.position_set = true;
    // let center;
    // try {
    //   center = this.model.floorplan.getCenter();
    // } catch (_) {
    //   center = new THREE.Vector3();
    // }
    // this.position.x = center.x;
    // this.position.z = center.z;
    // this.position.y = 0;
    // if (this.metadata.defaultHeightFromFloor) {
    //   this.position.y = (this.metadata.defaultHeightFromFloor * 2.54) / 100;
    // }
    // this.dimensionHelper.position.copy(this.position);
    // this.dimensionHelper.update();
    // // this.changed();
  }

  /** Take action after a resize */
  resized() {
    // this.position.y = this.halfSize.y;
  }

  /** */
  moveToPosition(vec3, intersection) {
    if (isNaN(vec3.x) || isNaN(vec3.y) || isNaN(vec3.z)) {
      // console.log("nan detected");
      return;
    }

    // keeps the position in the room and on the floor
    const validPosition = this.isValidPosition(vec3);
    if (
      validPosition === POSITION_TYPES.inroom ||
      validPosition === POSITION_TYPES.overlapped
    ) {
      this.hideError();
      const pos = new THREE.Vector3().copy(vec3);

      let stackingPosY = 0;
      if (this.stackable) {
        const bottomObjects = this.getBottomObjectsForStack();
        if (bottomObjects.length === 0) {
          console.log("no bottom objects");
          this.showError();
          return;
        }
        const y = this.getStackingPosition(pos);
        if (y === 0) {
          this.showError();
          return;
        }
        stackingPosY = y;
      }

      pos.y = stackingPosY;

      if (validPosition === POSITION_TYPES.overlapped && !this.overlappable) {
        this.showError(vec3);
        return;
      }

      if (isNaN(pos.x) || isNaN(pos.y) || isNaN(pos.z)) {
        // console.log("nan detected");
        return;
      }
      this.position.copy(pos);
      this.dimensionHelper.position.copy(pos);

      this.changed();

      this.groupParent && this.groupParent.isSet && this.groupParent.update();
    } else {
      this.showError(vec3);
    }
  }

  getBottomObjectsForStack = () => {
    const res = [];
    const objects = this.model.scene.items;
    objects.forEach((obj) => {
      if (obj.stackontop) res.push(res);
    });
    return res;
  };

  /** */
  getStackingPosition = (vec3) => {
    let y = 0;
    const corners = this.getCorners("x", "z", vec3);
    const objects = this.model.scene.items;
    for (const element of objects) {
      if (element === this || !element.obstructFloorMoves) {
        continue;
      }
      if (!element.stackontop) continue;
      if (
        !Core.Utils.polygonOutsidePolygon(
          corners,
          element.getCorners("x", "z")
        ) ||
        Core.Utils.polygonPolygonIntersect(
          corners,
          element.getCorners("x", "z")
        )
      ) {
        const targetY = element.getBounding().max.y;
        if (targetY > y) y = targetY;
      }
    }
    return y + spacing;
  };

  getSnapPosition = (vec3) => {
    const corners = this.getCorners("x", "z", vec3);

    let offsetX = +Infinity;
    let offsetY = +Infinity;

    const minX = corners[0].x;
    const maxX = corners[1].x;
    const minY = corners[0].y;
    const maxY = corners[2].y;

    const objects = this.model.scene.items;
    for (let i = 0; i < objects.length; i++) {
      if (objects[i] === this || !objects[i].obstructFloorMoves) continue;

      const snapCorners = objects[i].getSnapPoints(true);
      for (const snapCorner of snapCorners) {
        if (
          Math.abs(minX - snapCorner.x) < snapThreshold &&
          Math.abs(minX - snapCorner.x) < Math.abs(offsetX)
        ) {
          offsetX = snapCorner.x - minX;
          offsetX -= (offsetX / Math.abs(offsetX)) * spacing;
        }
        if (
          Math.abs(maxX - snapCorner.x) < snapThreshold &&
          Math.abs(maxX - snapCorner.x) < Math.abs(offsetX)
        ) {
          offsetX = snapCorner.x - maxX;
          offsetX -= (offsetX / Math.abs(offsetX)) * spacing;
        }

        if (
          Math.abs(minY - snapCorner.y) < snapThreshold &&
          Math.abs(minY - snapCorner.y) < Math.abs(offsetY)
        ) {
          offsetY = snapCorner.y - minY;
          offsetY -= (offsetY / Math.abs(offsetY)) * spacing;
        }
        if (
          Math.abs(maxY - snapCorner.y) < snapThreshold &&
          Math.abs(maxY - snapCorner.y) < Math.abs(offsetY)
        ) {
          offsetY = snapCorner.y - maxY;
          offsetY -= (offsetY / Math.abs(offsetY)) * spacing;
        }
      }
    }

    offsetX !== +Infinity && (vec3.x += offsetX);
    offsetY !== +Infinity && (vec3.z += offsetY);
  };

  isOverlapped = (objects = [], corners = this.getCorners("x", "z")) => {
    const bounding_self = this.getBounding();

    /**
     * Manual calculation solution
     */
    for (let i = 0; i < objects.length; i++) {
      if (objects[i] === this || !objects[i].obstructFloorMoves) {
        continue;
      }
      if (objects[i].isSet === true) continue;

      const bounding = objects[i].getBounding();

      if (bounding.min.y >= bounding_self.max.y) continue;
      if (bounding_self.min.y >= bounding.max.y) continue;

      const childCorners = objects[i].getCorners("x", "z");
      if (
        // !Core.Utils.polygonOutsidePolygon(corners, childCorners) ||
        Core.Utils.polygonPolygonIntersect(corners, childCorners)
      ) {
        // console.log('object not outside other objects');
        return POSITION_TYPES.overlapped;
      }
    }
    return POSITION_TYPES.inroom;
  };

  /** */
  isValidPosition = (vec3) => {
    const corners = this.getCorners("x", "z", vec3);
    const objects = this.model.scene.items;
    // check if we are in a room
    const rooms = this.model.floorplan.getRooms();
    let isInARoom = false;
    for (let i = 0; i < rooms.length; i++) {
      if (
        Core.Utils.pointInPolygon(vec3.x, vec3.z, rooms[i].interiorCorners) &&
        !Core.Utils.polygonPolygonIntersect(corners, rooms[i].interiorCorners)
      ) {
        isInARoom = true;
      }
    }
    if (!isInARoom) {
      // console.log('object not in a room');
      return POSITION_TYPES.outofroom;
    }

    Core.Configuration.getBooleanValue(Core.configSnapMode) &&
      this.getSnapPosition(vec3);

    // check if we are outside all other objects

    if (!this.overlappable) {
      return this.isOverlapped(objects, corners);
    }

    return POSITION_TYPES.inroom;
  };
}
