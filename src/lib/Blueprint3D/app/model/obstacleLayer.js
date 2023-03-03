import Core from "../core";
import Layer from "./layer";
import Wall from "./wall";

// const texture = `${Core.Configuration.getStringValue(
//   "defaultPathPrefix"
// )}/rooms/textures/blank-dark.png`;

const texture = 'https://deploy-building-app.s3.eu-central-1.amazonaws.com/Blueprint3D-assets/rooms/textures/blank-dark.png';

export default class ObstacleLayer extends Layer {
  height = 0;
  newWall(start, end, height = this.height) {
    const wall = new Wall(start, end, height);
    wall.layer = this;
    wall.isObstacleWall = true;
    wall.interiorTexture.url = texture;
    wall.exteriorTexture.url = texture;
    // wall.height = this.height;
    wall.fireOnDelete(this.removeWall);

    const { floorplan } = this;
    const rooms = floorplan.getRooms();

    let hasBuildingIntersection = false;
    for (const room of rooms) {
      if (
        Core.Utils.linePolygonIntersect(
          start.x,
          start.y,
          end.x,
          end.y,
          room.corners
        )
      ) {
        hasBuildingIntersection = true;
        break;
      }
    }
    if (!hasBuildingIntersection) this.walls.push(wall);
    // this.update();
  }

  reset = () => {
    this.corners = [];
    this.walls = [];
  };

  getLayerMetadata = () => {
    const res = [];
    this.walls.forEach((wall) => {
      const { start, end, height } = wall;
      res.push([
        [end.x, end.y, height],
        [start.x, start.y, height],
      ]);
    });
    return res;
  };
}
