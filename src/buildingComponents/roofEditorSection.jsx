import React from "react";
import { RoofEditorMode } from "../lib/Blueprint3D/app/three/roof";
import CustomTitle from "./customTitle";
import InputWithUnit from "./inputWithUnit";
import { roofColorPresets } from "../3dassets/textures";

export default class RoofEditorSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transformControlAxis: "X",
    };
  }

  componentDidMount = () => {
    const { isFirst } = this.props;
    isFirst && this.props.onRegenerateClicked(false);
    this.props.onTransformControlAxisChanged(this.state.transformControlAxis);
  };

  _renderModeButtons = () => {
    const { mode } = this.props;
    const buttons = [
      {
        label: "Move",
        active: mode === RoofEditorMode.MOVE,
        callback: this.props.onModeChanged,
        value: RoofEditorMode.MOVE,
      },
      {
        label: "Add Vertex",
        active: mode === RoofEditorMode.ADD_VERTEX,
        callback: this.props.onModeChanged,
        value: RoofEditorMode.ADD_VERTEX,
      },
      {
        label: "Connect Vertices",
        active: mode === RoofEditorMode.CREATE_EDGE,
        callback: this.props.onModeChanged,
        value: RoofEditorMode.CREATE_EDGE,
      },
      {
        label: "Delete",
        active: mode === RoofEditorMode.DELETE,
        callback: this.props.onModeChanged,
        value: RoofEditorMode.DELETE,
      },
    ];
    return (
      <div>
        <div>
          <h6>Mode</h6>
        </div>
        {buttons.map((button, index) => (
          <div
            className={`button building-btn ${button.active ? "active" : ""}`}
            key={index}
            onClick={() => button.callback(button.value)}
          >
            {button.label}
          </div>
        ))}
      </div>
    );
  };

  _renderAxisManagementPanel = () => {
    const { transformControlAxis } = this.state;

    return (
      <div>
        <p>Select axis of transform control</p>
        {["X", "Y", "Z"].map((axis, index) => (
          <span
            key={index}
            onClick={() => {
              this.setState({ transformControlAxis: axis });
              this.props.onTransformControlAxisChanged(axis);
            }}
          >
            <input
              type="radio"
              id={`enable-axis-${axis}`}
              checked={axis === transformControlAxis}
              onChange={() => { }}
            />
            <label htmlFor={`enable-axis-${axis}`}>{axis}</label>
          </span>
        ))}
      </div>
    );
  };

  _renderVertexEditPanel = () => {
    const { roofVertex } = this.props;
    if (!roofVertex) return;
    const data = [
      {
        label: "x",
        value: roofVertex.x,
        callback: (value) => {
          const func = () => roofVertex.setPosition("x", value);
          func();
          setTimeout(func, 1);
        },
      },
      {
        label: "y",
        value: roofVertex.z,
        callback: (value) => {
          const func = () => roofVertex.setPosition("y", value);
          func();
          setTimeout(func, 1);
        },
      },
      {
        label: "z (height)",
        value: roofVertex.y + roofVertex.parent.offset,
        callback: (value) => {
          const func = () => roofVertex.setPosition("z", value);
          func();
          setTimeout(func, 1);
        },
      },
    ];
    return (
      <div>
        <h4>Edit Vertex Position</h4>
        {data.map((item, index) => (
          <div key={index} className="input-container">
            <label>{item.label} </label>
            <div>
              <InputWithUnit
                rawValue={item.value}
                step={0.1}
                style={{ width: 60, fontSize: 16, textAlign: "right" }}
                onChange={item.callback}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  _renderTextureEditPanel = () => {
    const style = {
      display: "inline-block",
      width: 50,
      height: 50,
      borderRadius: 25,
      margin: 10,
      cursor: "pointer",
    };

    return (
      <div>
        <h5>Entire Color</h5>
        <div>
          {roofColorPresets.map((color, index) => (
            <div
              key={index}
              style={{ ...style, background: color }}
              onClick={() => this.props.onEntireTextureChanged(color)}
            />
          ))}
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="property-section">
        <CustomTitle title="Roof Editor" onClose={this.props.onClose} />
        <p style={{ color: "gray" }}>Tip: Roof faces should be triangle.<br />To make triangle, make lines by linking vertices</p>
        <div onClick={this.props.onRegenerateClicked} className="button building-btn">
          Reset Roof
        </div>
        {this._renderModeButtons()}
        {this._renderAxisManagementPanel()}
        {this._renderVertexEditPanel()}
        {this._renderTextureEditPanel()}
      </div>
    );
  }
}
