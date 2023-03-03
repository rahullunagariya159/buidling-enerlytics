import Core from "../core";

export default class Face3D {
  vertices = [];
  items = [];
  color = 0;
  /** */

  constructor(vertices) {
    this.vertices = vertices;
  }

  setColor(color) {
    if (Number.isInteger(color)) this.color = color;
    else if (typeof color === "string" && color[0] === "#") {
      color = color.replace("#", "");
      this.color = parseInt(color, 16);
    }
  }

  static getUuidByCorners = (corners = []) => {
    return Core.Utils.map(corners, (c) => c.id)
      .sort()
      .join();
  };

  getUuid() {
    return this.constructor.getUuidByCorners(this.vertices);
  }
}
