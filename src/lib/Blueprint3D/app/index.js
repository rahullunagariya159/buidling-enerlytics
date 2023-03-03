import Model from "./model/model";
import Main from "./three/main";
import Floorplanner from "./floorplanner/floorplanner";
import Core from "./core";
import { dimInch, dimFeet, dimCentiMeter, dimMeter } from "./core/dimensioning";

export default class BP3D {
  constructor(options) {
    const { threeElement, threeCanvasElement, floorplannerElement } = options;
    this.model = new Model(options.textureDir);

    this.three = new Main(this.model, threeElement, threeCanvasElement, {});
    this.floorplanner = new Floorplanner(
      floorplannerElement,
      this.model.floorplan,
      this
    );
  }

  changeUnit = (unit) => {
    switch (unit) {
      case "cm":
        Core.Configuration.setValue("dimUnit", dimCentiMeter);
        break;
      case "in":
        Core.Configuration.setValue("dimUnit", dimInch);
        break;
      case "ft":
        Core.Configuration.setValue("dimUnit", dimFeet);
        break;
      case "m":
        Core.Configuration.setValue("dimUnit", dimMeter);
        break;
      default:
        break;
    }
  };

  setShellMode = (shellMode) =>
    Core.Configuration.setValue(Core.configShellMode, shellMode);
  setSceneLocked = (locked) =>
    Core.Configuration.setValue(Core.configSceneLocked, locked);
  setSnap = (enabled) =>
    Core.Configuration.setValue(Core.configSnapMode, enabled);
  setDimensionVisible = (visible) =>
    Core.Configuration.setValue(Core.configDimensionVisible, visible);
  setCompassVisible = (visible) =>
    Core.Configuration.setValue(Core.configCompassVisible, visible);
  setObstacleVisible = (visible) =>
    Core.Configuration.setValue(Core.configObstacleVisible, visible);
  toggleXRayMode = () => {
    const xRayMode = Core.Configuration.getBooleanValue(Core.configXRayMode);
    Core.Configuration.setValue(Core.configXRayMode, !xRayMode);
  };
}
