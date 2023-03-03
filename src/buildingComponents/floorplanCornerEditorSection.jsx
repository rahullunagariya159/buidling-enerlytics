import React from "react";
import CustomTitle from "./customTitle";
import InputWithUnit from "./inputWithUnit";

export default class FloorPlanCornerEditor extends React.Component {
  update = () => {
    this.forceUpdate();
    this.props.onUpdate();
  };
  _renderDimensions = () => {
    const { corner } = this.props;
    const data = [
      {
        label: "Position X",
        value: corner.x,
        callback: (value) => {
          corner.x = value;
          this.update();
        },
      },
      {
        label: "Position Y",
        value: -corner.y,
        callback: (value) => {
          corner.y = -value;
          this.update();
        },
      },
    ];
    return (
      <div>
        {data.map((item, index) => (
          <div className="input-container" key={index}>
            <label>{item.label}</label>
            <div>
              <InputWithUnit
                rawValue={item.value}
                step={0.1}
                onChange={item.callback}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };
  render() {
    return (
      <div className="property-section">
        <CustomTitle
          title="Edit Corner Properties"
          onClose={this.props.onClose}
        />
        {this._renderDimensions()}
      </div>
    );
  }
}
