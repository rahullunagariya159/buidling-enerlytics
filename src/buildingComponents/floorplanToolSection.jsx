import React from "react";
import ReactTooltip from "react-tooltip";
import { floorplannerModes } from "../lib/Blueprint3D/app/floorplanner/floorplanner_view";

export default class FloorplanToolSection extends React.Component {
  parseLayerData = () => {
    const { layers } = this.props;
    if (!Array.isArray(layers)) return [];
    const data = [{ label: "Select Floor To Edit", value: "", disabled: true }];
    const sorted = JSON.parse(JSON.stringify(layers));
    sorted.sort((a, b) => b.index - a.index);
    sorted.forEach((item) => {
      data.push({
        label: `Floor ${item.index}`,
        value: item.index,
      });
    });

    return data;
  };
  _renderDrawTools = () => {
    const { selectedLayerIndex, obstacleMode, mode } = this.props;
    const visible = Number.isInteger(selectedLayerIndex) || obstacleMode;
    if (!visible) return;
    const buttons = [
      {
        label: "Edit",
        active: mode === floorplannerModes.MOVE,
        callback: this.props.onModeChanged,
        value: floorplannerModes.MOVE,
      },
      {
        label: "Draw",
        active: mode === floorplannerModes.DRAW,
        callback: this.props.onModeChanged,
        value: floorplannerModes.DRAW,
      },
      {
        label: "Delete",
        active: mode === floorplannerModes.DELETE,
        callback: this.props.onModeChanged,
        value: floorplannerModes.DELETE,
      },
    ];
    return (
      <div style={{ padding: "0 10px" }}>
        {buttons.map((button, index) => (
          <div
            className={`button inline auto-width edit-btns ${button.active ? "active" : ""
              }`}
            // style={{ background: button.active ? "#3575a5" : "#fff" }}
            key={index}
            onClick={() => button.callback(button.value)}
          >
            {button.label}
          </div>
        ))}
      </div>
    );
  };

  _renderZoomButtons = () => {
    const { autoMerge, autoSplit } = this.props;
    false && console.log(autoMerge, autoSplit);
    const buttons = [
      {
        font: "fa fa-search-minus",
        id: "zoomOut",
        tooltip: "Zoom Out",
        callback: this.props.onZoomOut,
      },
      {
        font: "fa fa-home",
        id: "zoomReset",
        tooltip: "Reset Zoom",
        callback: this.props.onResetZoom,
      },
      {
        font: "fa fa-search-plus",
        id: "zoomIn",
        tooltip: "Zoom In",
        callback: this.props.onZoomIn,
      },
      {
        font: "fa fa-image",
        id: "uploadBg",
        tooltip: "Upload Background"
      },
    ];
    return (
      <div style={{ padding: "0 10px" }}>
        {buttons.map((button, index) => {
          if (!button) return <div key={index} className="hr"></div>;
          if (button.id === "uploadBg") {
            return (
              <label htmlFor="fileToUpload" key={index}>
                <div
                  className={`button inline auto-width ${button.toggled ? "active" : ""}`}
                  data-tip={button.tooltip}
                >
                  <span className={button.font} style={button.fontStyle}>
                    {button.label}
                  </span>
                  <input type="file" name="fileToUpload" id="fileToUpload" accept="image/jpeg, image/png, image/jpg" onChange={(event) => this.props.onBackgroundUpload(event)}></input>
                </div>
              </label>
            );
          } else {
            return (
              <div
                key={index}
                className={`button inline auto-width ${button.toggled ? "active" : ""
                  }`}
                data-tip={button.tooltip}
                onClick={() => {
                  typeof button.callback === "function" && button.callback();
                }}
              >
                <span className={button.font} style={button.fontStyle}>
                  {button.label}
                </span>
              </div>
            );
          }
        })}
      </div>
    );
  };

  _renderPhotoAdjustment = () => {
    return (
      <div id="bgSize" hidden>
        <span style={{ margin: "8px 0 8px 20px" }}>Background:</span>
        <select
          style={{ margin: "8px 20px", padding: 5, fontSize: 16 }}
          onChange={(event) => this.props.onBackgroundAdjust(event)}
        >
          <option value="cover">Fill</option>
          <option value="contain">Medium</option>
          <option value="auto">Small</option>
        </select>
      </div>
    );
  };

  _renderLayers = () => {
    const { selectedLayerIndex } = this.props;
    const data = this.parseLayerData();
    let value = Number.isInteger(selectedLayerIndex) ? selectedLayerIndex : "";
    return (
      <div>
        <select
          style={{ margin: "0 20px", padding: 5, fontSize: 16 }}
          value={value}
          onChange={(e) => {
            let value = null;
            if (Number.isInteger(parseInt(e.target.value)))
              value = parseInt(e.target.value);
            this.props.onLayerSelected({ value });
          }}
        >
          {data.map((item, index) => (
            <option key={index} value={item.value} disabled={item.disabled}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  _renderGraphicLayerIndicators = () => {
    const { selectedLayerIndex } = this.props;
    const data = this.parseLayerData();
    return data.map((item, index) => {
      if (item.disabled) return null;
      if (item.value === 0) {
        return (
          <React.Fragment key={index}>
            <div
              className={`item ${selectedLayerIndex === item.value ? "active" : ""
                }`}
            />
            <div className="ground-line" />
          </React.Fragment>
        );
      }
      return (
        <div
          key={index}
          className={`item ${selectedLayerIndex === item.value ? "active" : ""
            }`}
        />
      );
    });
  };

  render() {
    const { obstacleMode } = this.props;
    return (
      <div className="floorplan-tool-section">
        <div>
          {this._renderZoomButtons()}
          {this._renderPhotoAdjustment()}
          {!obstacleMode && this._renderLayers()}
          {this._renderDrawTools()}
        </div>
        {!obstacleMode && (
          <div className="graphic-layer-indicator">
            {this._renderGraphicLayerIndicators()}
          </div>
        )}
        <ReactTooltip />
      </div>
    );
  }
}
