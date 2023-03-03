import React from "react";
import Core from "./app/core";

const angles = [0, 90, 180, 270, 360];
export default class FloorPlanViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editGrid: false,
    };
  }
  handleCompassClicked = () => {
    const { orientation } = this.props;
    let newAngle = 0;
    if (!angles.includes(orientation)) {
      newAngle = [...angles].sort(
        (a, b) => Math.abs(a - orientation) - Math.abs(b - orientation)
      )[0];
      console.log(newAngle);
    } else {
      const index = angles.indexOf(orientation);
      newAngle = angles[(index + 1) % angles.length];
    }
    newAngle %= 360;
    this.props.onOrientationChanged(newAngle);
  };

  handleGridSpacingChanged = (e) => {
    const rawValue = parseFloat(e.target.value, 10);
    const value = Core.Dimensioning.measureToCm(rawValue) / 100;
    this.props.onGridSpacingChanged(value);
  };

  _renderCompass = () => {
    const { orientation } = this.props;
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 150,
            height: 150,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            onClick={this.handleCompassClicked}
            style={{
              width: "70%",
              height: "70%",
              transform: `rotate(${orientation ? orientation : 0}deg)`,
              cursor: "pointer",
            }}
            src="/Blueprint3D-assets/textures/compass.png"
            alt="compass"
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <input
            type={"number"}
            style={{ textAlign: "right", width: 50 }}
            step={1}
            min={0}
            max={360}
            value={orientation}
            onChange={(e) => {
              let newOrientation = parseInt(e.target.value, 10);
              if (!e.target.value) newOrientation = 0;
              if (newOrientation < 0) newOrientation = 0;
              if (newOrientation > 360) newOrientation = 0;
              this.props.onOrientationChanged(newOrientation);
            }}
          />
          <label> °</label>
        </div>
      </div>
    );
  };

  _renderGridSpacing = () => {
    const { gridSpacing, gridSpacingInCanvas } = this.props;
    false && console.log(gridSpacingInCanvas);
    let unit = Core.Dimensioning.getUnit();
    let rawSpacingNumber = Core.Dimensioning.cmToMeasureWithoutUnit(
      gridSpacing * 100
    );
    let gridSize = 50;
    return (
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <div>Grid Size</div>
        <div
          className="grid-size-indicator"
          style={{
            width: gridSize,
            height: gridSize,
          }}
        >
          <div className="main-line"></div>
          <div className="arrow-top"></div>
          <div className="arrow-bottom"></div>
        </div>
        <div>
          <input
            type="number"
            style={{ width: 60 }}
            step={0.1}
            value={rawSpacingNumber}
            onChange={this.handleGridSpacingChanged}
          />
          <label>{unit}</label>
        </div>
      </div>
    );
  };

  render() {
    const { hidden } = this.props;
    return (
      <div className="2d-container"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          opacity: hidden ? 0 : 100,
          pointerEvents: hidden ? "none" : "inherit",
        }}
      >
        <canvas
          className="canvas-floor-plan"
          ref={(ref) =>
            typeof this.props.onDomLoaded === "function" &&
            this.props.onDomLoaded(ref)
          }
        >
          Floor plan viewer
        </canvas>
        {this._renderCompass()}
        {this._renderGridSpacing()}
        {/* <ReactTooltip /> */}
      </div>
    );
  }
}
