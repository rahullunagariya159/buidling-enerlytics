import React from "react";
import * as THREE from "three";
import sunCalc from "suncalc";

import SceneViewer from "./sceneViewer";
import FloorPlanViewer from "./floorPlanViewer";

import BP3D from "./app";

import { DefaultFloorPlan } from "./defaultFloorPlan.js";
import "./styles.css";
import Core from "./app/core";
import { EXPOSED_SIDE } from "./app/model/wall";

export const COVER_BY_RATE = 0;
export const COVER_BY_COUNT = 1;

class Blueprint3D extends React.Component {
  state = {
    selectedItem: null,
    showSwapDialog: false,
    newProduct: null,
    orientation: 0,
    gridSpacing: 1,
    gridSpacingInCanvas: 0,
  };

  initializeBP3D = () => {
    const {
      defaultJson,
      onLayersUpdated,
      onBuildingOffsetUpdated,
      onRoofVertexSelected,
      roofEditorModeChanged,
      onWallClicked,
      onRoofClicked,
      onFloorClicked,
      onNothingClicked,
      floorPlannerModeChanged,
      onWall2DClicked,
      onRoom2DClicked,
      onCorner2DClicked,
    } = this.props;

    const bp3d = new BP3D({
      floorplannerElement: this.elFloorPlannerElement,
      threeElement: this.elThreeElemContainer,
      textureDir: "models/textures/",
      widget: false,
    });

    const floorplan = bp3d.model.floorplan;
    const three = bp3d.three;
    const floorplanner = bp3d.floorplanner;

    floorplan.layerUpdatedCallbacks.push(onLayersUpdated);
    floorplan.buildingOffsetUpdatedCallbacks.push(onBuildingOffsetUpdated);

    three.itemSelectedCallbacks.push(this.handleItemSelected);
    three.roofVertexSelectedCallbacks.push(onRoofVertexSelected);
    three.roofEditorModeChangedCallbacks.push(roofEditorModeChanged);

    three.wallClicked.push(onWallClicked);
    three.roofClicked.push(onRoofClicked);
    three.floorClicked.push(onFloorClicked);
    three.nothingClicked.push(onNothingClicked);

    floorplanner.modeResetCallbacks.push(floorPlannerModeChanged);
    floorplanner.orientationChangedCallbacks.push(
      this.handleOrientationChanged
    );
    floorplanner.gridSpacingChangedCallbacks.push(
      this.handleGridSpacingChanged
    );

    floorplanner.wallSelectedCallbacks.push(onWall2DClicked);
    floorplanner.roomSelectedCallbacks.push(onRoom2DClicked);
    floorplanner.cornerSelectedCallbacks.push(onCorner2DClicked);
    floorplanner.nothingSelectedCallbacks.push(() => {
      onWall2DClicked(null);
      onRoom2DClicked(null);
      onCorner2DClicked(null);
    });

    const json = defaultJson ? defaultJson : JSON.stringify(DefaultFloorPlan);
    bp3d.model.loadSerialized(json);
    bp3d.model.roomLoadingCallbacks.push(this.props.isLoading);
    bp3d.model.roomLoadedCallbacks.push(this.props.isLoaded);

    this.bp3d = bp3d;
  };

  componentDidMount = () => this.initializeBP3D();

  UNSAFE_componentWillReceiveProps = (props) => {
    if (props.measureUnit !== this.props.measureUnit) {
      this.bp3d.changeUnit(props.measureUnit);
    }
    if (props.viewMode !== this.props.viewMode) {
      setTimeout(() => {
        this.bp3d.model.floorplan.update();
        window.dispatchEvent(new Event("resize"));
      }, 10);
    }
  };

  takeSnapshot = () => this.bp3d.three.dataUrl();
  setJSON = (json) => this.bp3d.model.loadSerialized(json);
  getJSON = () => this.bp3d.model.exportSerialized();

  undo = () => this.bp3d.model.undo();
  redo = () => this.bp3d.model.redo();
  collectMetadata = () => this.bp3d.model.collectMetadata();

  update = (updatePlan = true, addtoUndoStack = true) => {
    try {
      updatePlan && this.bp3d.model.floorplan.update(false);
      this.bp3d.floorplanner.update(addtoUndoStack);
    } catch (_) {}
  };

  regenerateRoof = (force) => this.bp3d.model.floorplan.regenerateRoof(force);

  handleItemSelected = (item) => {};
  handleOrientationChanged = (orientation) => this.setState({ orientation });

  handleGridSpacingChanged = (gridSpacing, gridSpacingInCanvas) => {
    if (gridSpacing) {
      this.setState({ gridSpacing });
    }
    if (gridSpacingInCanvas) {
      this.setState({ gridSpacingInCanvas });
    }
  };

  getDefaultOption = (item) => {
    const defaultMorph = {};
    if (Array.isArray(item.morph)) {
      for (var morph of item.morph) {
        defaultMorph[morph.index] = (morph.min - 5) / (300 - 5);
      }
    }

    const defaultStyles = {};
    if (Array.isArray(item.styles)) {
      for (var style of item.styles) {
        defaultStyles[style.name_in_model] = style.types[0].name_in_model;
      }
    }
    const metadata = {
      ...item,
      itemName: item.name,
      modelUrl: item.model,
      itemType: item.type,
    };
    return { defaultMorph, defaultStyles, metadata };
  };

  addItem = async (item, autoSelect = true) => {
    try {
      const { defaultMorph, defaultStyles, metadata } =
        this.getDefaultOption(item);

      const model = await this.bp3d.model.scene.addItem(
        item.type,
        item.model,
        metadata,
        null,
        null,
        {
          styles: defaultStyles,
          morph: defaultMorph,
          stackable: item.stackable,
          stackontop: item.stackontop,
          overlappable: item.overlappable,
        },
        autoSelect
      );
      return model;
    } catch (_) {
      return null;
    }
  };

  setFloorTexture = (floor, texture, conduction) => {
    floor.setTexture(texture, conduction);
  };

  setEdgeTexture = (edge, texture, conduction, wallMode, forOutsideWall) => {
    let edges = [];
    const { wall, isInterior, isExterior } = edge;
    const { floorplan } = this.bp3d.model;
    switch (wallMode) {
      case 0:
        edges.push(edge);
        break;
      case 1:
        edges = floorplan.getSameLayerWalls(wall).map((w) => {
          const { isOutsideWall } = w;
          const side = w.getExposedSide();
          if (!forOutsideWall) {
            if (!isOutsideWall) {
              w.edge.isInterior = true;
              w.edge.isExterior = true;
            } else {
              if (side === EXPOSED_SIDE.outside) {
                w.edge.isInterior = true;
                w.edge.isExterior = false;
              } else {
                w.edge.isInterior = false;
                w.edge.isExterior = true;
              }
            }
          } else {
            if (!isOutsideWall) {
              w.edge.isInterior = false;
              w.edge.isExterior = false;
            } else {
              if (side === EXPOSED_SIDE.outside) {
                w.edge.isInterior = false;
                w.edge.isExterior = true;
              } else {
                w.edge.isInterior = true;
                w.edge.isExterior = false;
              }
            }
          }
          return w.edge;
        });
        break;
      case 2:
        edges = floorplan.getSameFaceWalls(wall).map((w) => {
          w.edge.isInterior = isInterior;
          w.edge.isExterior = isExterior;
          return w.edge;
        });
        break;
      case 3:
        edges = floorplan.getAllWalls().map((w) => {
          const { isOutsideWall } = w;
          const side = w.getExposedSide();
          if (!forOutsideWall) {
            if (!isOutsideWall) {
              w.edge.isInterior = true;
              w.edge.isExterior = true;
            } else {
              if (side === EXPOSED_SIDE.outside) {
                w.edge.isInterior = true;
                w.edge.isExterior = false;
              } else {
                w.edge.isInterior = false;
                w.edge.isExterior = true;
              }
            }
          } else {
            if (!isOutsideWall) {
              w.edge.isInterior = false;
              w.edge.isExterior = false;
            } else {
              if (side === EXPOSED_SIDE.outside) {
                w.edge.isInterior = false;
                w.edge.isExterior = true;
              } else {
                w.edge.isInterior = true;
                w.edge.isExterior = false;
              }
            }
          }
          return w.edge;
        });
        break;
      default:
        break;
    }
    edges.forEach((edge) => edge.setTexture(texture, conduction));
    this.update();
  };

  // addRoofWindow = async (item, width, height) => {
  addRoofWindow = async (item, size, margin, coverData, wallData, cb) => {
    // Add Window - Roof
    const { baseWidth, baseHeight } = size;
    // const { wall, wallMode } = wallData;
    console.log("_ADDING_ROOF_WINDOWS");

    item.type = 10;
    const model = await this.addItem(item);
    let { currentRoofFace, currentInclinedWall } = model;
    if (!currentRoofFace) {
      currentRoofFace = window.currentRoofFace;
    }
    if (!currentInclinedWall) {
      currentInclinedWall = window.currentInclinedWall;
    }
    console.log("CURRENT_ROOF_FACE_", currentRoofFace);
    console.log("currentInclinedWall_", currentInclinedWall);
    const inchWidth = (baseWidth * 100) / 2.54;
    const inchHeight = (baseHeight * 100) / 2.54;
    const morph = [(inchHeight - 5) / (300 - 5), (inchWidth - 5) / (300 - 5)];
    for (const index in morph) {
      model.setMorph(parseInt(index), morph[index]);
    }
  };

  handleRemoveAllRoofWindows = () => {
    let items = [];
    this.bp3d.model.scene.items.forEach(
      (item) => item.isRoofItem && items.push(item)
    );
    for (let i = items.length - 1; i >= 0; i--) {
      items[i].remove();
    }
    this.bp3d.model.floorplan.update(false);
  };

  addWindows = async (modelInfo, size, margin, coverData, wallData, cb) => {
    // Add Window - Wall
    const { coverMethod, coverRate, windowCount } = coverData;
    this.props.isLoading();
    const { floorplan, scene } = this.bp3d.model;
    const { buildingOffset } = this.bp3d.model.floorplan;
    const { baseWidth, baseHeight } = size;

    const mBase = 0.005;
    const mVer = margin.vertical;

    const res = { state: 0, msg: "" };

    if (!modelInfo || !size || !margin) return null;

    const baseWindowArea = baseWidth * baseHeight;
    let totalWallArea = 0;
    let totalWindowArea = 0;
    let totalWindowCount = 0;

    let wallCollection = [];
    const { wall, wallMode } = wallData;
    if (!wall && [0, 1, 2].includes(wallMode)) {
      this.props.isLoaded();
      return {
        state: 1,
        msg: "No wall Selected",
      };
    }
    switch (wallMode) {
      case 0:
        wallCollection.push(wall);
        break;
      case 1:
        wallCollection = floorplan
          .getSameLayerWalls(wall)
          .filter((wall) => wall.checkIsOutsideWall());
        break;
      case 2:
        wallCollection = floorplan
          .getSameFaceWalls(wall)
          .filter((wall) => wall.checkIsOutsideWall());
        break;
      case 3:
        wallCollection = floorplan
          .getAllWalls()
          .filter((wall) => wall.checkIsOutsideWall());
        break;
      default:
        break;
    }
    wallCollection.forEach((wall) => this.removeWindowByWall(wall));

    if (wallCollection.length === 0) return null;

    const item = await this.addItem(modelInfo, false);
    const windows = [];

    for (let w = 0; w < wallCollection.length; w++) {
      const wall = wallCollection[w];
      const { layer, edge } = wall;
      if (layer.layerIndex < 100) continue;

      // for normal walls
      if (!wall.hasRoofInteraction) {
        const exDist = edge.exteriorDistance();
        const inDist = edge.interiorDistance();

        const wallLength = Math.min(exDist, inDist) - mBase;
        const wallHeight = wall.height - mBase;

        const wallArea = wallHeight * wallLength;

        totalWallArea += wallArea;

        let count = 0;
        if (coverMethod === COVER_BY_RATE) {
          const roughCountByArea = Math.floor(
            (wallArea * coverRate) / baseWindowArea
          );
          const roughCountByLength = Math.floor(
            wallLength / (baseWidth + mBase)
          );
          count = Math.min(roughCountByArea, roughCountByLength);
        } else if (coverMethod === COVER_BY_COUNT) {
          count = windowCount;
        }

        totalWindowCount += count;

        const posY = layer.offset + mVer + buildingOffset;
        const { start, end } = wall;

        for (let i = 0; i < count; i++) {
          const rate = (i + 0.5) / count;
          const posX =
            Math.round((start.x + (end.x - start.x) * rate) * 100) / 100;
          const posZ =
            Math.round((start.y + (end.y - start.y) * rate) * 100) / 100;
          windows.push({
            wall,
            wallArea,
            wallLength,
            wallHeight,
            offset: layer.offset + buildingOffset,
            count,
            pos: { x: posX, y: posY, z: posZ },
          });
        }
      }
      // for clipped planes
      else {
        let edgeCorners = [];
        let wallArea = 0;
        const exposedSide = wall.getExposedSide();
        if (exposedSide === -1) {
          edgeCorners = edge.validExteriorWallPoints;
          wallArea = edge.exteriorArea();
        } else if (exposedSide === 1) {
          edgeCorners = edge.validInteriorWallPoints;
          wallArea = edge.interiorArea();
        }
        wallArea *= 0.99;

        totalWallArea += wallArea;

        const { findLargestInscribedRectOfWallCorners } = Core.Utils3D;
        const rect = findLargestInscribedRectOfWallCorners(edgeCorners);
        if (!rect) continue;
        const { area, length, height, corners } = rect;
        let count = 0;
        const posY = layer.offset + mVer + buildingOffset;

        const start = { x: corners[0].x, y: corners[0].z };
        const end = { x: corners[1].x, y: corners[1].z };

        if (coverMethod === COVER_BY_RATE) {
          if (area < wallArea * coverRate) {
            this.props.isLoaded();
            return {
              state: 1,
              msg: "Cannot fit cover rate",
            };
          }
          const roughCountByArea = Math.floor(
            (wallArea * coverRate) / baseWindowArea
          );
          const roughCountByLength = Math.floor(length / (baseWidth + mBase));
          count = Math.min(roughCountByArea, roughCountByLength);
        } else if (coverMethod === COVER_BY_COUNT) {
          count = windowCount;
        }
        totalWindowCount += count;

        for (let i = 0; i < count; i++) {
          const rate = (i + 0.5) / count;
          const posX =
            Math.round((start.x + (end.x - start.x) * rate) * 100) / 100;
          const posZ =
            Math.round((start.y + (end.y - start.y) * rate) * 100) / 100;
          windows.push({
            wall,
            wallArea,
            wallLength: length,
            wallHeight: height,
            offset: layer.offset + buildingOffset,
            count,
            pos: { x: posX, y: posY, z: posZ },
          });
        }
      }
    }

    totalWindowArea = totalWallArea * coverRate;
    const windowArea = totalWindowArea / totalWindowCount;
    let baseRealWidth = baseWidth;
    let baseRealHeight = baseHeight;
    if (coverMethod === COVER_BY_RATE)
      baseRealHeight = (baseHeight * windowArea) / baseWindowArea;

    for (let i in windows) {
      let realWidth = baseRealWidth;
      let realHeight = baseRealHeight;
      let y = mVer;
      const { wall, wallArea, wallLength, count, wallHeight, pos, offset } =
        windows[i];

      if (coverMethod === COVER_BY_RATE) {
        if (wallHeight <= realHeight + mVer) {
          if (wallHeight < realHeight) realHeight = wallHeight;
          realWidth = (wallArea * coverRate) / realHeight / count;
          y = (wallHeight - realHeight) / 2;
          windows[i].pos.y = offset + y;
        }
      } else if (coverMethod === COVER_BY_COUNT) {
        if (wallHeight <= realHeight + mVer) {
          if (wallHeight < realHeight) realHeight = wallHeight;
          y = (wallHeight - realHeight) / 2;
          windows[i].pos.y = offset + y;
        }
        if (realWidth > wallLength / count) {
          realWidth = wallLength / count;
        }
      }

      wall.windowInfo = {
        width: realWidth,
        height: realHeight,
        sillHeight: y,
        coverRate: coverRate * 100,
      };
      realWidth -= 0.001;
      realHeight -= 0.001;
      const inchWidth = (realWidth * 100) / 2.54;
      const inchHeight = (realHeight * 100) / 2.54;
      const morph = [(inchHeight - 5) / (300 - 5), (inchWidth - 5) / (300 - 5)];
      const model = await scene.cloneItem(item);
      // const model = await this.addItem(modelInfo, false);

      if (model) {
        const position = new THREE.Vector3(pos.x, pos.y, pos.z);
        model.calculatedPosition = position;
        model.setPosition(position);
        for (const index in morph) {
          model.setMorph(parseInt(index), morph[index]);
        }
      }
      typeof cb === "function" &&
        cb({
          finished: false,
          totalCount: windows.length,
          current: i - 0 + 1,
        });
    }

    item.remove();
    // res.state = 0;
    // res.msg = `${Math.round((totalWindowArea / totalWallArea) * 10000) / 100}% covered.`;
    this.bp3d.model.floorplan.update(false);
    this.props.onNothingClicked();
    this.props.isLoaded();
    typeof cb === "function" &&
      cb({
        finished: true,
      });
    return res;
  };

  removeWindowByWall = (wall) => {
    if (!wall) return;
    wall.removeItems();
    this.bp3d.model.floorplan.update(false);
    this.props.onNothingClicked();
  };

  removeWindows = (wallData) => {
    const { wall, wallMode } = wallData;
    let wallCollection = [];

    if (!wall && [0, 1, 2].includes(wallMode)) {
      this.props.isLoaded();
      return {
        state: 1,
        msg: "No wall Selected",
      };
    }

    switch (wallMode) {
      case 0:
        wallCollection.push(wall);
        break;
      case 1:
        wallCollection = this.bp3d.model.floorplan
          .getSameLayerWalls(wall)
          .filter((wall) => wall.checkIsOutsideWall());
        break;
      case 2:
        wallCollection = this.bp3d.model.floorplan
          .getSameFaceWalls(wall)
          .filter((wall) => wall.checkIsOutsideWall());
        break;
      case 3:
        wallCollection = this.bp3d.model.floorplan
          .getAllWalls()
          .filter((wall) => wall.checkIsOutsideWall());
        break;
      default:
        break;
    }
    wallCollection.forEach((wall) => this.removeWindowByWall(wall));
    this.bp3d.model.floorplan.update(false);
    this.props.onNothingClicked();
  };

  updateMaterial = (target, material, size) => {
    this.state.selectedItem &&
      this.state.selectedItem.updateMaterial(target, material, size, () =>
        setTimeout(this.update, 100)
      );
  };

  updateStyle = (hide_name, show_name) => {
    this.state.selectedItem &&
      this.state.selectedItem.updateStyle(hide_name, show_name, () =>
        setTimeout(this.update, 100)
      );
  };

  setBuildingOffset = (offset) => {
    this.bp3d.model.floorplan.setBuildingOffset(offset);
  };

  setActiveLayerIndex = (index) => {
    this.bp3d.model.floorplan.setActiveLayerIndex(index);
    this.bp3d.floorplanner.update();
  };

  setLayerVisible = (index, visible) =>
    this.bp3d.model.floorplan.setLayerVisible(index, visible);

  setLayerHeight = (index, height) =>
    this.bp3d.model.floorplan.setLayerHeight(index, height);

  setLayerFloorThickness = (index, thickness) =>
    this.bp3d.model.floorplan.setLayerFloorThickness(index, thickness);

  setRoomVisible = (uuid, visible, autoUpdate = true) => {
    this.bp3d.model.floorplan.setRoomVisible(uuid, visible, autoUpdate);
  };

  cloneAboveLayer = (index) => this.bp3d.model.floorplan.cloneAboveLayer(index);
  cloneBelowLayer = (index) => this.bp3d.model.floorplan.cloneBelowLayer(index);
  moveAboveLayer = (index) => this.bp3d.model.floorplan.moveAboveLayer(index);
  moveBelowLayer = (index) => this.bp3d.model.floorplan.moveBelowLayer(index);
  removeLayer = (index) => this.bp3d.model.floorplan.removeLayer(index);

  setFloorplanMode = (m) => this.bp3d.floorplanner.setMode(m);
  setRoofEditorEnabled = (e) => this.bp3d.three.setRoofEditorEnabled(e);
  setRoofEditorMode = (m) => this.bp3d.three.setRoofEditorMode(m);
  setRoofEditorTransformControlAxis = (a) =>
    this.bp3d.three.setTransformControlAxis(a);
  setRoofFaceTexture = (activeFace = null, texture = "") =>
    this.bp3d.model.floorplan.roof.setFaceTexture(activeFace, texture);

  setMorph = (index, value) => this.state.selectedItem.setMorph(index, value);
  setLocked = (locked) => this.bp3d.setSceneLocked(locked);
  setShellMode = (mode) => this.bp3d.setShellMode(mode);
  setObstacleEditMode = (mode) => {
    this.bp3d.floorplanner.setObstacleEditMode(mode);
    this.bp3d.model.floorplan.obstacleEditMode = mode;
    this.update();
  };
  setToggleXRay = () => this.bp3d.toggleXRayMode();
  setSnap = (enabled) => this.bp3d.setSnap(enabled);
  setDimensionVisible = (visible) => this.bp3d.setDimensionVisible(visible);
  setCompassVisible = (visible) => this.bp3d.setCompassVisible(visible);
  setObstacleVisible = (visible) => {
    this.bp3d.setObstacleVisible(visible);
    this.update();
  };

  updateGeolocationData = (lat, long, time) => {
    let date = new Date(time);
    let pos = sunCalc.getPosition(date, lat, long);
    this.bp3d.three.updateSunPosition(pos.azimuth, pos.altitude);
  };

  zoomInFloorPlanner = () => this.bp3d.floorplanner.zoomIn();
  zoomOutFloorPlanner = () => this.bp3d.floorplanner.zoomOut();
  resetZoomFloorPlanner = () => this.bp3d.floorplanner.resetZoom();

  zoomInScene = () => this.bp3d.three.controls.dollyIn(1.1);
  zoomOutScene = () => this.bp3d.three.controls.dollyOut(1.1);
  resetZoomScene = () => this.bp3d.three.centerCamera(true);

  backgroundUploadScene = (e) => {
    // document.getElementById("bgSize").removeAttribute("hidden");

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const uploaded_image = reader.result;
      // document.querySelector(
      //   ".canvas-floor-plan"
      // ).style.backgroundImage = `url(${uploaded_image})`;
      const i = new Image();
      i.src = uploaded_image;
      this.bp3d.floorplanner.view.drawImg(i);
    });
    reader.readAsDataURL(e.target.files[0]);
  };

  backgroundAdjustScene = (e) => {
    document.querySelector(".canvas-floor-plan").style.backgroundSize =
      e.target.value;
  };

  render() {
    const { viewMode } = this.props;
    const { orientation, gridSpacing, gridSpacingInCanvas } = this.state;
    return (
      <div
        style={{ height: "100%" }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
      >
        <SceneViewer
          hidden={viewMode !== "3d"}
          onDomLoaded={(el) => (this.elThreeElemContainer = el)}
        />

        <FloorPlanViewer
          hidden={viewMode === "3d"}
          onDomLoaded={(el) => (this.elFloorPlannerElement = el)}
          orientation={orientation}
          gridSpacing={gridSpacing}
          gridSpacingInCanvas={gridSpacingInCanvas}
          onOrientationChanged={(orientation) =>
            this.bp3d.floorplanner.setOrientation(orientation)
          }
          onGridSpacingChanged={(spacing) =>
            this.bp3d.floorplanner.setGridSpacing(spacing)
          }
          onResetGridSpacing={() => this.bp3d.floorplanner.setGridSpacing(null)}
        />
      </div>
    );
  }
}

export default Blueprint3D;
