import WallItem from './wall_item';

export default class WallFloorItem extends WallItem {
  constructor(model, metadata, meshList, position, rotation, options) {
    super(model, metadata, meshList, position, rotation, options);
    this.boundToFloor = true;
  }
}
