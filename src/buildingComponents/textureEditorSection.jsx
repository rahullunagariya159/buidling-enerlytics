import React from "react";
import {  toast } from "react-toastify";
import CustomTitle from "./customTitle";
import {
  floorTextures,
  outsideWallTextures,
  insideWallTextures,
} from "../3dassets/textures";

export default class TextureEditorSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wallMode: 0,
      selectedFloorTexture: null,
      selectedEdgeTexture: null,
    };
  }
  handleFloorTextureClicked = () => {
    const { floor } = this.props;
    const { selectedFloorTexture } = this.state;
    if (!floor || !selectedFloorTexture) {
      toast.error("Please select texture");
      return;
    }
    this.props.onFloorTextureChanged(
      floor,
      selectedFloorTexture.url,
      selectedFloorTexture.conduction
    );
  };

  handleEdgeTextureClicked = () => {
    const { edge, isOutsideWall } = this.props;
    const { wall } = edge;
    const { wallMode, selectedEdgeTexture } = this.state;
    if (!edge || !selectedEdgeTexture) {
      toast.error("Please select texture");
      return;
    }
    this.props.onEdgeTextureChanged(
      edge,
      selectedEdgeTexture.url,
      selectedEdgeTexture.conduction,
      wallMode,
      isOutsideWall && wall.isOutsideWall
    );
  };

  _renderFloorTexturePanel = () => {
    const { mode, floor } = this.props;
    const { selectedFloorTexture } = this.state;
    if (mode !== "floor" || !floor) return;
    const style = {
      display: "inline-block",
      width: 50,
      height: 50,
      margin: 10,
      cursor: "pointer",
    };

    return (
      <div>
        <p>Select Floor Texture</p>
        <div>
          {floorTextures.map((texture, index) => (
            <div
              key={index}
              style={{ ...style }}
              onClick={() => {
                this.setState({ selectedFloorTexture: texture });
              }}
            >
              <img
                src={texture.url}
                alt="texture"
                style={{
                  width: "100%",
                  height: "100%",
                  border: `3px solid ${
                    texture === selectedFloorTexture ? "black" : "transparent"
                  }`,
                }}
              />
            </div>
          ))}
        </div>
        <div className="button building-btn" onClick={this.handleFloorTextureClicked}>
          Apply
        </div>
      </div>
    );
  };

  _renderEdgeTexturePanel = () => {
    const { mode, edge, isOutsideWall } = this.props;
    if (!edge) return;
    const { wall } = edge;
    if (mode !== "wall" || !edge) return;
    const { wallMode, selectedEdgeTexture } = this.state;
    const wallOptions = [
      "1. Apply only to selected wall",
      "2. Apply to all walls on same floor",
      "3. Apply to all walls facing the same direction",
      "4. Apply to all walls of the building",
    ];

    const style = {
      display: "inline-block",
      width: 50,
      height: 50,
      margin: 10,
      cursor: "pointer",
    };

    return (
      <div>
        <p>{`Select ${
          isOutsideWall && wall.isOutsideWall ? "Outside" : "Inside"
        } Wall Texture`}</p>
        <div>
          {(isOutsideWall && wall.isOutsideWall
            ? outsideWallTextures
            : insideWallTextures
          ).map((texture, index) => (
            <div
              key={index}
              style={{ ...style }}
              onClick={() => this.setState({ selectedEdgeTexture: texture })}
            >
              <img
                src={texture.url}
                alt="texture"
                style={{
                  width: "100%",
                  height: "100%",
                  border: `3px solid ${
                    texture === selectedEdgeTexture ? "black" : "transparent"
                  }`,
                }}
              />
            </div>
          ))}
        </div>
        <div>
          {wallOptions.map((item, index) => (
            <div key={index} onClick={() => this.setState({ wallMode: index })}>
              <input
                type="radio"
                id={`wall-mode-${index}`}
                checked={index === wallMode}
                onChange={() => {}}
              />
              <label className="label-option-walls" htmlFor={`wall-mode-${index}`}>{item}</label>
            </div>
          ))}
        </div>
        <div className="button building-btn" onClick={this.handleEdgeTextureClicked}>
          Apply
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="property-section">
        <CustomTitle title="Texture Editor" onClose={this.props.onClose} />
        {this._renderFloorTexturePanel()}
        {this._renderEdgeTexturePanel()}
      </div>
    );
  }
}
