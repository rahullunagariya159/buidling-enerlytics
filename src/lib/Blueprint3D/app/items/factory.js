import FloorItem from "./floor_item";
import WallItem from "./wall_item";
import InWallItem from "./in_wall_item";
import InWallFloorItem from "./in_wall_floor_item";
import OnFloorItem from "./on_floor_item";
import WallFloorItem from "./wall_floor_item";
import RoofItem from "./roof_item";

const item_types = {
  1: FloorItem,
  2: WallItem,
  3: InWallItem,
  7: InWallFloorItem,
  8: OnFloorItem,
  9: WallFloorItem,
  10: RoofItem,
};

/** Factory class to create items. */
export class Factory {
  /** Gets the class for the specified item. */
  static getClass(itemType) {
    return item_types[itemType];
  }
}
