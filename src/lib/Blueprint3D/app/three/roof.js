export const RoofEditorMode = {
  MOVE: 0,
  ADD_VERTEX: 1,
  CREATE_EDGE: 2,
  DELETE: 3,
};

export class Roof {
  mode = RoofEditorMode.MOVE;
  enabled = false;
  three = null;
  floorplan = null;
  roofModel = null;

  constructor(three, floorplan) {
    this.three = three;
    this.floorplan = floorplan;
    this.roofModel = floorplan.roof;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    this.roofModel.enabled = enabled;
    this.roofModel.update();
  }

  setMode(mode) {
    this.mode = mode;
    this.three.roofEditorModeChangedCallbacks.forEach((cb) => cb(mode));
  }

  addVertex(x, y, z, edge) {
    const offset = this.roofModel.offset;
    y -= offset;
    if (edge) {
      const { start, end } = edge;
      const l = start.distanceFrom(x, y, z);
      const L = start.distanceFrom(end.x, end.y, end.z);
      x = start.x + ((end.x - start.x) * l) / L;
      y = start.y + ((end.y - start.y) * l) / L;
      z = start.z + ((end.z - start.z) * l) / L;
    }
    const newVertex = this.roofModel.newVertex(x, y, z);

    if (edge) {
      this.roofModel.newEdge(newVertex, edge.getEnd());
      edge.setEnd(newVertex);
    }
    this.roofModel.update();
  }

  addEdge(start, end) {
    if (start.roofVertex && end.roofVertex) {
      this.roofModel.newEdge(start.roofVertex, end.roofVertex, true);
      this.roofModel.update();
    }
  }
}
