import FloorItem from './floor_item';

export default class OnFloorItem extends FloorItem {
  constructor(model, metadata, meshList, position, rotation, options) {
    super(model, metadata, meshList, position, rotation, options);
    this.obstructFloorMoves = false;
    this.receiveShadow = true;
  }
}
