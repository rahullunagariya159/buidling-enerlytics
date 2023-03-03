import InWallItem from "./in_wall_item";

export default class InWallFloorItem extends InWallItem {
  constructor(model, metadata, meshList, position, rotation, options) {
    super(model, metadata, meshList, position, rotation, options);
    this.boundToFloor = true;
  }
}
