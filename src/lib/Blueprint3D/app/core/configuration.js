import { dimMeter } from "./dimensioning";
import Core from ".";

export const configDimUnit = "dimUnit";
export const configDefaultPathPrefix = "defaultPathPrefix";
export const configWallHeight = "wallHeight";
export const configWallThickness = "wallThickness";
export const configWallThicknessDirection = "wallThicknessDirection";
export const configWallIsOutside = "wallIsOutside";
export const configFloorThickness = "floorThickness";
export const configSceneLocked = "scene-locked";
export const configXRayMode = "xRay";
export const configSnapMode = "snap";
export const configDimensionVisible = "dimensionVisible";
export const configDimensionLabelVisible = "dimensionLabelVisible";
export const configShellMode = "shellMode";
export const configSnapTolernance = "snapTolerance";
export const configCompassVisible = "compassVisible";
export const configObstacleVisible = "obstacleVisible";

const { REACT_APP_BLUEPRINT_ASSETS_PREFIX } = process.env;

const prefix = REACT_APP_BLUEPRINT_ASSETS_PREFIX || "";

export class Configuration {
  static data = {
    defaultPathPrefix: `${prefix}Blueprint3D-assets/`,
    dimUnit: dimMeter,
    wallHeight: 2.5,
    wallThickness: 0.2,
    wallThicknessDirection: 0,
    wallIsOutside: true,
    floorThickness: 0.1,
    sceneLocked: false,
    xRay: false,
    snap: true,
    snapTolerance: 0.2,
    dimensionVisible: false,
    dimensionLabelVisible: true,
    shellMode: false,
    autoMergeVertices: true,
    compassVisible: true,
    obstacleVisible: true,
  };

  static setValue(key, value) {
    this.data[key] = value;
    // console.log(key, value);
    document.dispatchEvent(
      new CustomEvent(Core.BP3D_EVENT_CONFIG_CHANGED, {
        detail: { [key]: value },
      })
    );
  }

  static getStringValue(key) {
    switch (key) {
      case configDimUnit:
      case configDefaultPathPrefix:
        return this.data[key];
      default:
        throw new Error("Invalid string configuration parameter: " + key);
    }
  }

  static getBooleanValue(key) {
    switch (key) {
      case configSceneLocked:
      case configXRayMode:
      case configSnapMode:
      case configDimensionVisible:
      case configDimensionLabelVisible:
      case configShellMode:
      case configWallIsOutside:
      case configCompassVisible:
      case configObstacleVisible:
        return this.data[key];
      default:
        throw new Error("Invalid boolean configuration parameter: " + key);
    }
  }

  static getNumericValue(key) {
    switch (key) {
      case configWallHeight:
      case configWallThickness:
      case configWallThicknessDirection:
      case configFloorThickness:
      case configSnapTolernance:
        return this.data[key];
      default:
        throw new Error("Invalid numeric configuration parameter: " + key);
    }
  }
}
