import React from "react";
import Blueprint3D from "./lib/Blueprint3D";
import { ReactSession } from 'react-client-session';

import {
  LeftToolbar,
  FloorplanToolSection,
  LayerInfoSection,
  RoofEditorSection,
  SceneToolSection,
  WindowEditorSection,
  TextureEditorSection,
  FloorPlanWallEditor,
  FloorPlanRoomEditor,
  FloorPlanCornerEditor,
  FloorplanDataTable,
  SettingSection,
} from "./buildingComponents";

import "./BuildingApp.css";
import { floorplannerModes } from "./lib/Blueprint3D/app/floorplanner/floorplanner_view";

class BuildingApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewMode: "3d",

      buildingOffset: 0,
      layers: [],
      rooms: [],

      obstacleMode: false,
      shellMode: false,

      showObstacle: true,
      showCompass: true,
      showDimension: false,
      snap: true,
      solarInfo: {
        lat: 39.9042,
        long: 116.4074,
        time: new Date(),
      },

      subTool: null,
      propertyPanelTool: null,

      selectedLayerIndex: null,

      firstRoofEditMode: true,
      selectedRoofVertex: null,
      selectWall: null,
      selectedRoof: null,
      selectedFloor: null,

      selectedWall2D: null,
      selectedRoom2D: null,
      selectedCorner2D: null,

      measureUnit: "m",
      showLoadingScreen: false,

      floorPlannerMode: 0,
      roofEditorMode: 0,
      hideLeftToolBar: false,
      classContainer: ''
    };

    // console.log('building configurator: Last Update at 09/05/2022')
  }

  componentWillReceiveProps(nextProps) {
    // console.log('____PROPS__', nextProps);
    if (nextProps.loadCalled) {
      this.handleLoadJson();
    }
    if (nextProps.hideLeftToolBar) {
      this.setState({ hideLeftToolBar: true });
      this.setState({ classContainer: 'full-container-bemodel' });
    } else {
      this.setState({ hideLeftToolBar: false });
      this.setState({ classContainer: '' });
    }
  }

  setPropertyPanelTool = (tool) => {
    this.setState({ propertyPanelTool: tool });
    if (tool === "roof") {
      this.refBp3d.setRoofEditorEnabled(true);
    } else {
      this.refBp3d.setRoofEditorEnabled(false);
    }
  };

  handleShow2DPlannerClicked = () => {
    const { layers } = this.state;
    this.setPropertyPanelTool(null);
    this.setState({
      viewMode: "2d",
      obstacleMode: false,
      subTool: "floorplan",
    });
    if (layers && layers.length) {
      const value = Number.isInteger(this.state.selectedLayerIndex)
        ? this.state.selectedLayerIndex
        : layers[layers.length - 1].index;
      this.handleLayerSelected({ value });
    }
    this.refBp3d.setObstacleEditMode(false);
  };

  handleShowObstacleMode = () => {
    this.setPropertyPanelTool(null);
    this.setState({
      viewMode: "2d",
      obstacleMode: true,
      subTool: "floorplan",
    });
    this.handleLayerSelected(null);
    this.refBp3d.setObstacleEditMode(true);
  };

  handle2DItemClicked = (room, wall, corner) => {
    this.setState({
      selectedRoom2D: room,
      selectedWall2D: wall,
      selectedCorner2D: corner,
      propertyPanelTool: "floorplanner-2d",
    });
  };

  handleShow3DViewClicked = () => {
    this.setState({
      viewMode: "3d",
      subTool: null,
      shellMode: false,
    });
    this.setPropertyPanelTool(null);
    this.refBp3d.setShellMode(false);
  };

  handleShowShellModeClicked = () => {
    this.refBp3d.setShellMode(true);
    this.setState({
      viewMode: "3d",
      shellMode: true,
      subTool: null,
    });
    this.setPropertyPanelTool(null);
  };

  handleShowRoofEditorClicked = () => {
    // this.handleShowShellModeClicked();
    this.handleShow3DViewClicked();
    const mode = this.state.propertyPanelTool === "roof";
    this.refBp3d.setRoofEditorEnabled(!mode);
    this.setPropertyPanelTool(mode ? null : "roof");
    this.setState({
      viewMode: "3d",
    });
  };

  handleShowWindowEditorClicked = () => {
    const mode = this.state.propertyPanelTool === "window";
    this.handleShowShellModeClicked();
    // this.handleShow3DViewClicked();
    this.setState({
      viewMode: "3d",
      selectedEdge: null,
      propertyPanelTool: mode ? null : "window",
    });
  };

  handleShowLayerEditorClicked = () => {
    const mode = this.state.propertyPanelTool === "layer" ? null : "layer";
    this.setPropertyPanelTool(mode);
    this.setState({
      viewMode: "3d",
    });
  };

  handleSettingsClicked = () => {
    const mode = this.state.propertyPanelTool === "settings";
    this.setState({ propertyPanelTool: mode ? null : "settings" });
  };

  handleLayerUpdated = (layers, rooms) => {
    this.setState({ layers, rooms });
  };

  handleBuildingOffsetUpdated = (offset) => {
    this.setState({ buildingOffset: offset });
  };

  handleLayerSelected = (layer) => {
    console.log(layer, ">>>>>>>>>>>>>>");
    let activeLayerIndex = layer ? layer.value : null;
    this.setState({ selectedLayerIndex: activeLayerIndex, selectedEdge: null });
    this.refBp3d.setActiveLayerIndex(activeLayerIndex);
  };

  handleWallClicked = (wall) => {
    const { propertyPanelTool } = this.state;
    let newPropertyPanel = null;
    if (!propertyPanelTool) newPropertyPanel = "texture";
    else if (propertyPanelTool === "window") newPropertyPanel = "window";
    else newPropertyPanel = propertyPanelTool;

    this.setState({
      selectedEdge: wall,
      selectedFloor: null,
      propertyPanelTool: newPropertyPanel,
    });

    if (wall) {
      try {
        const index = wall.wall.layer.layerIndex - 100;
        this.setState({ selectedLayerIndex: index });
      } catch (_) { }
    }
  };

  handleFloorClicked = (floor) => {
    const { propertyPanelTool } = this.state;
    let newPropertyPanel = null;
    if (!propertyPanelTool) newPropertyPanel = "texture";
    else if (propertyPanelTool === "window") newPropertyPanel = "window";
    else newPropertyPanel = propertyPanelTool;
    this.setState({
      selectedEdge: null,
      selectedFloor: floor,
      propertyPanelTool: newPropertyPanel,
    });
  };

  handleRoofFaceClicked = (roofFace) => {
    console.log("roof face clicked", roofFace);

    this.setState({
      selectedEdge: null,
      selectedFloor: null,
      selectedRoof: roofFace.floorplan.roof,
    });
  };

  handleRoofVertexSelected = (roofVertex) => {
    this.setState({ selectedRoofVertex: roofVertex });
  };

  handleNothingClicked = () => {
    const propertyPanelTool =
      this.state.propertyPanelTool === "window" ? "window" : null;
    this.setState({
      selectedEdge: null,
      selectedFloor: null,
      propertyPanelTool,
    });
  };

  handleUndo = () => {
    this.refBp3d.undo();
    this.setState({
      selectedRoofVertex: null,
      selectedEdge: null,
      selectedFloor: null,
    });
  };

  handleRedo = () => this.refBp3d.redo();

  handleSaveJson = () => {
    let jsonStr = this.refBp3d.getJSON();
    ReactSession.set("bp3dJson", jsonStr);

    // const name = new URLSearchParams(this.search).get('name');
    // console.log('building____save___', name);

    this.props.parentCallback(jsonStr);
  };

  handleLoadJson = () => {
    let raw = ReactSession.get("bp3dJson");
    // console.log('RAW__', raw);
    if (raw && raw.length) {
      let data = raw;
      this.refBp3d.setJSON(data);
    }
  };

  handleCollectMetadataClicked = () => {
    this.setState({
      parsedPlanData: this.refBp3d.collectMetadata(),
      showMetadataTable: true,
    });
  };

  handleSnapshot = () => {
    const dataURI = this.refBp3d.takeSnapshot();
    console.log(dataURI);
  };

  _renderRightContainer = () => {
    return (
      <>
        {this._renderLayerInfoPanel()}
        {this._renderRoofEditorPanel()}
        {this._renderWindowEditorPanel()}
        {this._renderTextureEditorPanel()}
        {this._render2DWallEditorPanel()}
        {this._render2DRoomEditorPanel()}
        {this._render2DCornerEditorPanel()}
        {this._render2DWallPropertyPanel()}
        {this._renderSettingsPanel()}
      </>
    );
  };

  _renderSettingsPanel = () => {
    const {
      propertyPanelTool,
      measureUnit,
      showCompass,
      showDimension,
      showObstacle,
      snap,
      solarInfo,
    } = this.state;
    if (propertyPanelTool !== "settings") return;
    return (
      <div className={`right-container opened`}>
        <div className="product-info-container">
          <SettingSection
            unit={measureUnit}
            showCompass={showCompass}
            showDimension={showDimension}
            showObstacle={showObstacle}
            snap={snap}
            solarInfo={solarInfo}
            onUnitChanged={(unit) => this.setState({ measureUnit: unit })}
            onChangeCompassVisibility={(showCompass) => {
              this.setState({ showCompass });
              this.refBp3d.setCompassVisible(showCompass);
            }}
            onChangeDimensionVisibility={(visible) => {
              this.setState({ showDimension: visible });
              this.refBp3d.setDimensionVisible(visible);
            }}
            onChangeObstacleVisibility={(visible) => {
              this.setState({ showObstacle: visible });
              this.refBp3d.setObstacleVisible(visible);
            }}
            onChangeSnap={(snap) => {
              this.setState({ snap });
              this.refBp3d.setSnap(snap);
            }}
            onSolarInfoChanged={(solarInfo) => {
              this.setState({ solarInfo });
              const { lat, long, time } = solarInfo;
              this.refBp3d.updateGeolocationData(lat, long, time);
            }}
            onClose={() => {
              this.setPropertyPanelTool(null);
              this.setState({
                selectedEdge: null,
                selectedFloor: null,
                propertyPanelTool: null,
              });
            }}
          />
        </div>
      </div>
    );
  };

  _renderTextureEditorPanel = () => {
    const {
      viewMode,
      shellMode,
      selectedEdge,
      selectedFloor,
      propertyPanelTool,
    } = this.state;
    if (
      viewMode !== "3d" ||
      propertyPanelTool !== "texture" ||
      (!selectedEdge && !selectedFloor)
    )
      return;
    let mode = "";
    if (selectedEdge) mode = "wall";
    else if (selectedFloor) mode = "floor";
    return (
      <div className={`right-container opened`}>
        <div className="product-info-container">
          <TextureEditorSection
            mode={mode}
            edge={selectedEdge}
            isOutsideWall={shellMode}
            floor={selectedFloor}
            onFloorTextureChanged={this.refBp3d.setFloorTexture}
            onEdgeTextureChanged={this.refBp3d.setEdgeTexture}
            onClose={() => {
              this.setPropertyPanelTool(null);
              this.setState({
                selectedEdge: null,
                selectedFloor: null,
                propertyPanelTool: null,
              });
            }}
          />
        </div>
      </div>
    );
  };

  _renderRoofEditorPanel = () => {
    const {
      viewMode,
      propertyPanelTool,
      roofEditorMode,
      selectedRoofVertex,
      firstRoofEditMode,
    } = this.state;
    if (viewMode !== "3d" || propertyPanelTool !== "roof") return;
    return (
      <div className={`right-container opened`}>
        <div className="product-info-container">
          <RoofEditorSection
            isFirst={firstRoofEditMode}
            mode={roofEditorMode}
            roofVertex={selectedRoofVertex}
            onRegenerateClicked={(force) => {
              this.refBp3d.regenerateRoof(force);
              this.setState({ firstRoofEditMode: false });
            }}
            onModeChanged={(mode) => this.refBp3d.setRoofEditorMode(mode)}
            onTransformControlAxisChanged={(axis) =>
              this.refBp3d.setRoofEditorTransformControlAxis(axis)
            }
            onEntireTextureChanged={(texture) =>
              this.refBp3d.setRoofFaceTexture(null, texture)
            }
            onClose={() => {
              this.setPropertyPanelTool(null);
              this.refBp3d.setRoofEditorEnabled(false);
            }}
          />
        </div>
      </div>
    );
  };

  _renderWindowEditorPanel = () => {
    const { viewMode, propertyPanelTool, selectedEdge, selectedRoof } =
      this.state;
    if (viewMode !== "3d" || propertyPanelTool !== "window") return;
    return (
      <div className={`right-container opened`}>
        <div className="product-info-container">
          <WindowEditorSection
            selectedEdge={selectedEdge}
            selectedRoof={selectedRoof}
            onClose={() => {
              this.setPropertyPanelTool(null);
              this.refBp3d.setRoofEditorEnabled(false);
            }}
            onAddWindows={this.refBp3d.addWindows}
            onRemoveWindows={this.refBp3d.removeWindows}
            onAddRoofWindow={this.refBp3d.addRoofWindow}
            onRemoveAllRoofWindows={this.refBp3d.handleRemoveAllRoofWindows}
          />
        </div>
      </div>
    );
  };

  _renderLayerInfoPanel = () => {
    const {
      propertyPanelTool,
      layers,
      rooms,
      selectedLayerIndex,
      buildingOffset,
    } = this.state;
    if (propertyPanelTool !== "layer") return;
    return (
      <div className={`right-container opened`}>
        <LayerInfoSection
          activeIndex={selectedLayerIndex}
          buildingOffset={buildingOffset}
          layers={layers}
          rooms={rooms}
          onUpdate={() => this.refBp3d.update()}
          onClose={() => this.setPropertyPanelTool(null)}
          onBuildingOffsetChanged={this.refBp3d.setBuildingOffset}
          onLayerSelected={this.handleLayerSelected}
          onSetLayerVisible={this.refBp3d.setLayerVisible}
          onSetRoomVisible={this.refBp3d.setRoomVisible}
          onFloorThicknessChanged={this.refBp3d.setLayerFloorThickness}
          onHeightChanged={this.refBp3d.setLayerHeight}
          onCloneAboveLayer={this.refBp3d.cloneAboveLayer}
          onCloneBelowLayer={this.refBp3d.cloneBelowLayer}
          onMoveAboveLayer={this.refBp3d.moveAboveLayer}
          onMoveBelowLayer={this.refBp3d.moveBelowLayer}
          onRemoveLayer={this.refBp3d.removeLayer}
        />
      </div>
    );
  };

  _render2DWallEditorPanel = () => {
    const { viewMode, obstacleMode, propertyPanelTool, selectedWall2D } =
      this.state;
    if (
      viewMode !== "2d" ||
      propertyPanelTool !== "floorplanner-2d" ||
      !selectedWall2D
    )
      return;

    return (
      <div className={`right-container opened`}>
        <div className="product-info-container">
          <FloorPlanWallEditor
            obstacleMode={obstacleMode}
            wall={selectedWall2D}
            onUpdate={this.refBp3d.update}
            onClose={() => {
              this.setPropertyPanelTool(null);
            }}
          />
        </div>
      </div>
    );
  };

  _render2DWallPropertyPanel = () => {
    const { viewMode, obstacleMode, propertyPanelTool } = this.state;
    if (viewMode !== "2d" || propertyPanelTool !== "floorplanner-wall-property")
      return;
    return (
      <div className={`right-container opened`}>
        <div className="product-info-container">
          <FloorPlanWallEditor
            obstacleMode={obstacleMode}
            onUpdate={this.refBp3d.update}
            onClose={() => {
              this.setPropertyPanelTool(null);
            }}
          />
        </div>
      </div>
    );
  };

  _render2DRoomEditorPanel = () => {
    const { viewMode, propertyPanelTool, selectedRoom2D } = this.state;
    if (
      viewMode !== "2d" ||
      propertyPanelTool !== "floorplanner-2d" ||
      !selectedRoom2D
    )
      return;
    return (
      <div className={`right-container opened`}>
        <div className="product-info-container">
          <FloorPlanRoomEditor
            room={selectedRoom2D}
            onUpdate={() => this.refBp3d.update(false, false)}
            onClose={() => {
              this.setPropertyPanelTool(null);
            }}
          />
        </div>
      </div>
    );
  };

  _render2DCornerEditorPanel = () => {
    const { viewMode, propertyPanelTool, selectedCorner2D } = this.state;
    if (
      viewMode !== "2d" ||
      propertyPanelTool !== "floorplanner-2d" ||
      !selectedCorner2D
    )
      return;
    return (
      <div className={`right-container opened`}>
        <div className="product-info-container">
          <FloorPlanCornerEditor
            corner={selectedCorner2D}
            onUpdate={this.refBp3d.update}
            onClose={() => {
              this.setPropertyPanelTool(null);
            }}
          />
        </div>
      </div>
    );
  };

  _renderSubTools = () => {
    const {
      viewMode,
      obstacleMode,
      subTool,
      selectedLayerIndex,
      floorPlannerMode,
      layers,
    } = this.state;

    if (viewMode === "2d" && subTool === "floorplan") {
      return (
        <div className="sub-tools-section top transparent">
          <FloorplanToolSection
            mode={floorPlannerMode}
            layers={layers}
            obstacleMode={obstacleMode}
            selectedLayerIndex={selectedLayerIndex}
            onLayerSelected={this.handleLayerSelected}
            onModeChanged={(mode) => {
              this.refBp3d.setFloorplanMode(mode);
              this.setState({
                selectedCorner2D: null,
                selectedWall2D: null,
                selectedRoom2D: null,
                propertyPanelTool: null,
              });
              if (mode === floorplannerModes.DRAW) {
                this.setState({
                  propertyPanelTool: "floorplanner-wall-property",
                });
              }
            }}
            onZoomIn={() => this.refBp3d.zoomInFloorPlanner()}
            onZoomOut={() => this.refBp3d.zoomOutFloorPlanner()}
            onResetZoom={() => this.refBp3d.resetZoomFloorPlanner()}
            onBackgroundUpload={(event) =>
              this.refBp3d.backgroundUploadScene(event)
            }
            onBackgroundAdjust={(event) =>
              this.refBp3d.backgroundAdjustScene(event)
            }
          />
        </div>
      );
    }
    if (viewMode === "3d" && !subTool) {
      return (
        <div className="sub-tools-section top transparent">
          <SceneToolSection
            onZoomIn={() => this.refBp3d.zoomInScene()}
            onZoomOut={() => this.refBp3d.zoomOutScene()}
            onResetZoom={() => this.refBp3d.resetZoomScene()}
          />
        </div>
      );
    }
    return;
  };

  _renderFloorplanDataTable = () => {
    const { showMetadataTable, parsedPlanData } = this.state;
    if (!showMetadataTable) return;
    return (
      <FloorplanDataTable
        raw={parsedPlanData}
        style={{ width: "80%", height: "80%" }}
        onClose={() => this.setState({ showMetadataTable: false })}
      />
    );
  };

  _renderLoadingScreen = () => {
    const { showLoadingScreen } = this.state;
    return (
      <div
        className="loading-container"
        style={{ display: showLoadingScreen ? "flex" : "none" }}
      >
        <span>loading...</span>
      </div>
    );
  };

  render() {
    const { viewMode, obstacleMode, shellMode, propertyPanelTool, hideLeftToolBar, classContainer } = this.state;
    return (
      <div className="App">
        <div className="bp3d">
          <div className="container BEContainer">
            {hideLeftToolBar === true ? ('') : (
              <div className="left-container">
                <LeftToolbar
                  viewMode={viewMode}
                  shellMode={shellMode}
                  obstacleMode={obstacleMode}
                  showLayers={propertyPanelTool === "layer"}
                  showRoofEditor={propertyPanelTool === "roof"}
                  showWindowEditor={propertyPanelTool === "window"}
                  showSettings={propertyPanelTool === "settings"}
                  onShowObstacleMode={this.handleShowObstacleMode}
                  onShow3DViewClicked={this.handleShow3DViewClicked}
                  onShow2DPlanner={this.handleShow2DPlannerClicked}
                  onShellModePressed={this.handleShowShellModeClicked}
                  onRoofPressed={this.handleShowRoofEditorClicked}
                  onWindowPressed={this.handleShowWindowEditorClicked}
                  onLayerPressed={this.handleShowLayerEditorClicked}
                  onCollectMetadataClicked={this.handleCollectMetadataClicked}
                  onUndo={this.handleUndo}
                  onRedo={this.handleRedo}
                  onSaveClicked={this.handleSaveJson}
                  onLoadClicked={this.handleLoadJson}
                  onSnapshotClicked={this.handleSnapshot}
                  onSettingsClicked={this.handleSettingsClicked}
                />
              </div>
            )}
            <div className={`main-container ${classContainer}`}>
              <div className="scenes-container">
                <Blueprint3D
                  ref={(ref) => (this.refBp3d = ref)}
                  viewMode={viewMode}
                  measureUnit={this.state.measureUnit}
                  isLoading={() => this.setState({ showLoadingScreen: true })}
                  isLoaded={() => this.setState({ showLoadingScreen: false })}
                  onLayersUpdated={this.handleLayerUpdated}
                  onBuildingOffsetUpdated={this.handleBuildingOffsetUpdated}
                  onWallClicked={this.handleWallClicked}
                  onRoofClicked={this.handleRoofFaceClicked}
                  onFloorClicked={this.handleFloorClicked}
                  onRoofFaceClicked={this.handleRoofFaceClicked}
                  onRoofVertexSelected={this.handleRoofVertexSelected}
                  onNothingClicked={this.handleNothingClicked}
                  onWall2DClicked={(wall) =>
                    this.handle2DItemClicked(null, wall, null)
                  }
                  onRoom2DClicked={(room) =>
                    this.handle2DItemClicked(room, null, null)
                  }
                  onCorner2DClicked={(corner) =>
                    this.handle2DItemClicked(null, null, corner)
                  }
                  roofEditorModeChanged={(roofEditorMode) =>
                    this.setState({ roofEditorMode })
                  }
                  floorPlannerModeChanged={(floorPlannerMode) => {
                    this.setState({ floorPlannerMode });
                  }}
                />
              </div>
              {this._renderSubTools()}
              {this._renderLoadingScreen()}
            </div>
            {this._renderRightContainer()}
            {this._renderFloorplanDataTable()}
          </div>
        </div>
      </div>
    );
  }
}

export default BuildingApp;
