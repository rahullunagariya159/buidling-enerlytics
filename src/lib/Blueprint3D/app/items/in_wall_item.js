import { MORPH_ALIGN_CENTER } from "./item";
import WallItem from "./wall_item";

export default class InWallItem extends WallItem {
  constructor(model, metadata, meshList, position, rotation, options) {
    super(model, metadata, meshList, position, rotation, options);
    this.addToWall = true;
    this.morphAlign = MORPH_ALIGN_CENTER;
    this.flippable = true;
    this.flipped = false;
  }

  /** */
  getWallOffset() {
    // fudge factor so it saves to the right wall
    try {
      // return this.currentWallEdge.wall.thickness / 2;
      return this.currentWallEdge.offset + 0.03;
    } catch (_) {}
    return 0;
  }

  flipHorizontal = () => {
    this.flipped = !this.flipped;
    this.rotation.y = (this.rotation.y + Math.PI) % (Math.PI * 2);
  };
}
