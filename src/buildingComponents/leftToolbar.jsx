import React from "react";

export default class LeftToolbar extends React.Component {
  handleToggleLock = () => {
    this.props.onLockSceneToggled(!this.state.locked);
    this.setState({ locked: !this.state.locked });
  };

  handleToggleDimensions = () => {
    this.props.onShowDimensionsToggled(!this.state.showDimension);
    this.setState({ showDimension: !this.state.showDimension });
  };

  handleToggleSnap = () => {
    this.props.onSnapToggled(!this.state.snap);
    this.setState({ snap: !this.state.snap });
  };

  handleToggleXRay = () => {
    this.props.onXRayToggled(!this.state.xRay);
    this.setState({ xRay: !this.state.xRay });
  };

  getButtons = () => {
    const {
      viewMode,
      obstacleMode,
      showLayers,
      showRoofEditor,
      showWindowEditor,
      shellMode,
      showSettings,
    } = this.props;
    const buttons = [
      {
        font: "fa fa-solar-panel",
        toggled: viewMode === "2d" && !obstacleMode,
        tooltip: "2D View",
        callback: this.props.onShow2DPlanner,
      },
      {
        font: "fa fa-cube",
        tooltip: "3D x-ray",
        toggled:
          viewMode === "3d" &&
          !shellMode &&
          !showRoofEditor &&
          !showWindowEditor,
        callback: this.props.onShow3DViewClicked,
      },
      {
        font: `fa fa-building`,
        toggled:
          viewMode === "3d" &&
          shellMode &&
          !showRoofEditor &&
          !showWindowEditor,
        tooltip: "3D Shell",
        callback: this.props.onShellModePressed,
      },
      null,
      {
        font: "fa fa-exclamation-triangle",
        toggled: viewMode === "2d" && obstacleMode,
        tooltip: "Obstacle Editor",
        callback: this.props.onShowObstacleMode,
      },
      {
        font: `fa fa-campground`,
        toggled: showRoofEditor,
        tooltip: "Roof Editor",
        callback: this.props.onRoofPressed,
      },
      {
        font: `fa fa-border-all`,
        toggled: showWindowEditor,
        tooltip: "Window Editor",
        callback: this.props.onWindowPressed,
      },
      null,
      {
        font: `fa fa-layer-group`,
        toggled: showLayers,
        tooltip: "Show Layers",
        callback: this.props.onLayerPressed,
      },
      // {
      //   toggled: showDimension,
      //   font: `fa fa-ruler-combined`,
      //   tooltip: `${showDimension ? "Show" : "Hide"} Dimensions`,
      //   callback: this.handleToggleDimensions,
      // },
      // {
      //   toggled: snap,
      //   font: "fas fa-magnet",
      //   tooltip: "Snap Objects",
      //   callback: this.handleToggleSnap,
      // },
      null,
      {
        font: "fa fa-undo",
        tooltip: "Undo",
        callback: this.props.onUndo,
      },
      {
        font: "fa fa-redo",
        tooltip: "Redo",
        callback: this.props.onRedo,
      },
      // {
      //   font: "fa fa-save",
      //   tooltip: "Save",
      //   callback: this.props.onSaveClicked,
      // },
      // {
      //   font: "fas fa-upload",
      //   tooltip: "Load",
      //   callback: this.props.onLoadClicked,
      // },
      // {
      //   font: "fa fa-file-export",
      //   tooltip: "Collect metadata",
      //   callback: this.props.onCollectMetadataClicked,
      // },
      // {
      //   toggled: xRay,
      //   font: "far fa-square",
      //   tooltip: "X-Ray Wall",
      //   callback: this.handleToggleXRay,
      // },
      null,
      {
        font: "fa fa-gear",
        toggled: showSettings,
        tooltip: "Settings",
        callback: this.props.onSettingsClicked,
      },
    ];
    return buttons;
  };

  render() {
    const buttons = this.getButtons();
    return (
      <div className="left-toolbar">
        {buttons.map((b, index) => {
          if (!b) return <div key={index} className="hr"></div>;
          return (
            // data-tip={b.tooltip}
            <div
              key={index}
              className={`left-toolbar-button ${b.toggled ? "toggled" : ""}`}
              onClick={b.callback}
            >
              <span className={b.font} style={b.fontStyle}>
                {b.label}
              </span>
            </div>
          );
        })}
        
      </div>
    );
  }
}
