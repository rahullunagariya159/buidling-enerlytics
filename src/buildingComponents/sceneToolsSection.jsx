import React from "react";
import ReactTooltip from "react-tooltip";

export default class SceneToolSection extends React.Component {
  renderButtons = () => {
    const buttons = [
      {
        font: "fa fa-search-minus",
        tooltip: "Zoom Out",
        callback: this.props.onZoomOut,
      },
      {
        font: "fa fa-home",
        tooltip: "Reset Zoom",
        callback: this.props.onResetZoom,
      },
      {
        font: "fa fa-search-plus",
        tooltip: "Zoom In",
        callback: this.props.onZoomIn,
      },
    ];
    return (
      <div style={{ padding: "0 10px" }}>
        {buttons.map((button, index) => {
          if (!button) return <div key={index} className="hr"></div>;
          return (
            <div
              key={index}
              className={`button inline auto-width ${
                button.toggled ? "active" : ""
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
        })}
      </div>
    );
  };

  render() {
    return (
      <div className="floorplan-tool-section">
        {this.renderButtons()}
        <ReactTooltip />
      </div>
    );
  }
}
