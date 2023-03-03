import React from "react";
import InputWithUnit from "./inputWithUnit";
import Core from "../lib/Blueprint3D/app/core";
import CustomTitle from "./customTitle";

export default class FloorPlanWallEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stretchDirection: 0,
    };
  }

  update = () => {
    this.props.onUpdate();
    this.forceUpdate();
  };

  handleLengthChange = (value) => {
    const { wall } = this.props;
    const { stretchDirection } = this.state;
    if (value > 0) {
      const rate = value / wall.getWallLength();
      let center = { x: 0, y: 0 };

      if (
        // (!this.wall.start.locked && !this.wall.end.locked)||
        stretchDirection === 0
      ) {
        center = wall.getWallCenter();
      } else if (
        // (this.wall.start.locked && !this.wall.end.locked)||
        stretchDirection === -1
      ) {
        center = {
          x: wall.getStartX(),
          y: wall.getStartY(),
        };
      } else if (
        // (!this.wall.start.locked && this.wall.end.locked)||
        stretchDirection === 1
      ) {
        center = {
          x: wall.getEndX(),
          y: wall.getEndY(),
        };
      } else {
        return;
      }
      /** Start */
      let newX = 0;
      let newY = 0;
      newX = center.x + (wall.getStartX() - center.x) * rate;
      newY = center.y + (wall.getStartY() - center.y) * rate;
      wall.start.move(newX, newY, false);

      /** End */
      newX = center.x + (wall.getEndX() - center.x) * rate;
      newY = center.y + (wall.getEndY() - center.y) * rate;
      wall.end.move(newX, newY, false);
      this.update();
    }
  };

  _renderDimensions = () => {
    const { wall, obstacleMode } = this.props;
    const length = wall ? wall.getWallLength() : 0;
    const height = wall
      ? wall.height
      : Core.Configuration.getNumericValue(Core.configWallHeight);
    const data = [];
    wall &&
      data.push({
        label: "Length",
        value: length,
        callback: this.handleLengthChange,
      });

    obstacleMode &&
      data.push({
        label: "Height",
        value: height,
        callback: (value) => {
          if (wall) {
            wall.height = value;
          } else {
            Core.Configuration.setValue(Core.configWallHeight, value);
          }
          this.update();
        },
      });

    !obstacleMode &&
      data.push({
        label: "Thickness",
        value: wall
          ? wall.thickness
          : Core.Configuration.getNumericValue(Core.configWallThickness),
        callback: (value) => {
          if (wall) {
            wall.thickness = value;
          } else {
            Core.Configuration.setValue(Core.configWallThickness, value);
          }
          this.update();
        },
      });
    return (
      <div>
        {data.map((item, index) => (
          <div className="input-container" key={index}>
            <label>{item.label}</label>
            <div>
              <InputWithUnit
                rawValue={item.value}
                min={0.1}
                step={0.1}
                onChange={item.callback}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  _renderStretchDirections = () => {
    const { stretchDirection } = this.state;
    const { wall } = this.props;
    if (!wall) return;
    const { start, end } = wall;

    const stretchDirections = [
      {
        label: "Start Corner",
        value: -1,
      },
      { label: "Both Sides", value: 0 },
      {
        label: "End Corner",
        value: 1,
      },
    ];

    if (Math.abs(start.x - end.x) > Math.abs(start.y - end.y)) {
      // horizontal
      if (start.x > end.x) {
        stretchDirections[0].label = "Left Side";
        stretchDirections[2].label = "Right Side";
      } else {
        stretchDirections[0].label = "Right Side";
        stretchDirections[2].label = "Left Side";
        const tmp = stretchDirections[0];
        stretchDirections[0] = stretchDirections[2];
        stretchDirections[2] = tmp;
      }
    } else {
      // vertical
      if (start.y > end.y) {
        stretchDirections[0].label = "Upper Side";
        stretchDirections[2].label = "Below Side";
      } else {
        stretchDirections[0].label = "Below Side";
        stretchDirections[2].label = "Upper Side";
        let tmp = stretchDirections[0];
        stretchDirections[0] = stretchDirections[2];
        stretchDirections[2] = tmp;
      }
    }

    return (
      <div>
        <p>Stretch Direction</p>
        {stretchDirections.map((item, index) => (
          <div key={index}>
            <input
              type="radio"
              id={`stretch-direction-${index}`}
              checked={item.value === stretchDirection}
              onChange={() => this.setState({ stretchDirection: item.value })}
            />
            <label htmlFor={`stretch-direction-${index}`}>{item.label}</label>
          </div>
        ))}
      </div>
    );
  };

  _renderRadioButtons = () => {
    const { wall, obstacleMode } = this.props;
    if (obstacleMode) return;
    const start = wall ? wall.start : null;
    const end = wall ? wall.end : null;

    const thicknessDirection = wall
      ? wall.thicknessDirection
      : Core.Configuration.getNumericValue(Core.configWallThicknessDirection);

    const isOutsideWall = wall
      ? wall.isOutsideWall
      : Core.Configuration.getBooleanValue(Core.configWallIsOutside);

    const sides = [
      {
        label: "Inside",
        value: false,
      },
      {
        label: "Outside",
        value: true,
      },
    ];

    const thicknessDirections = [
      {
        label: "Inside",
        value: -1,
      },
      { label: "Both Sides", value: 0 },
      {
        label: "Outside",
        value: 1,
      },
    ];

    if (start && end) {
      if (Math.abs(start.x - end.x) > Math.abs(start.y - end.y)) {
        // horizontal
        if (start.x > end.x) {
          thicknessDirections[0].label = "Below Side";
          thicknessDirections[2].label = "Upper Side";
          const tmp = thicknessDirections[0];
          thicknessDirections[0] = thicknessDirections[2];
          thicknessDirections[2] = tmp;
        } else {
          thicknessDirections[0].label = "Upper Side";
          thicknessDirections[2].label = "Below Side";
        }
      } else {
        // vertical
        if (start.y > end.y) {
          thicknessDirections[0].label = "Left Side";
          thicknessDirections[2].label = "Right Side";
        } else {
          thicknessDirections[0].label = "Right Side";
          thicknessDirections[2].label = "Left Side";
          const tmp = thicknessDirections[0];
          thicknessDirections[0] = thicknessDirections[2];
          thicknessDirections[2] = tmp;
        }
      }
    }

    return (
      <div>
        <p>Inside/Outside Wall</p>
        {wall && (
          <div>
            <input
              type="checkbox"
              id="keep-status-inside/outside"
              checked={!wall.keepOutsideWall}
              onChange={() => {
                if (wall) {
                  wall.keepOutsideWall = !wall.keepOutsideWall;
                  this.update();
                }
              }}
            />
            <label htmlFor="keep-status-inside/outside">Auto Detect</label>
          </div>
        )}
        {sides.map((item, index) => (
          <div key={index}>
            <input
              type="radio"
              id={`side-${index}`}
              checked={item.value === isOutsideWall}
              onChange={() => {
                if (wall) {
                  wall.prevIsOutsideWall = wall.isOutsideWall;
                  wall.isOutsideWall = item.value;
                } else {
                  Core.Configuration.setValue(
                    Core.configWallIsOutside,
                    item.value
                  );
                }
                this.update();
              }}
            />
            <label htmlFor={`side-${index}`}>{item.label}</label>
          </div>
        ))}

        <p>Thickness Direction</p>
        {thicknessDirections.map((item, index) => (
          <div key={index}>
            <input
              type="radio"
              id={`thickness-direction-${index}`}
              checked={item.value === thicknessDirection}
              onChange={() => {
                if (wall) {
                  wall.thicknessDirection = item.value;
                } else {
                  Core.Configuration.setValue(
                    Core.configWallThicknessDirection,
                    item.value
                  );
                }
                this.update();
              }}
            />
            <label htmlFor={`thickness-direction-${index}`}>{item.label}</label>
          </div>
        ))}
      </div>
    );
  };

  render() {
    return (
      <div className="property-section">
        <CustomTitle
          title="Edit Wall Properties"
          onClose={this.props.onClose}
        />
        {this._renderDimensions()}
        {this._renderStretchDirections()}
        {this._renderRadioButtons()}
      </div>
    );
  }
}
