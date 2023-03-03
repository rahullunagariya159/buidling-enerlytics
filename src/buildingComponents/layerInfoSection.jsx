import React from "react";
import ReactTooltip from "react-tooltip";
import Core from "../lib/Blueprint3D/app/core";
import CustomTitle from "./customTitle";
import InputWithUnit from "./inputWithUnit";

export default class LayerInfoSection extends React.Component {
  state = {
    selectedTags: [],
  };
  handleHeightChanged = (index, e) => {
    const value = parseFloat(e.target.value);
    this.props.onHeightChanged(
      index,
      Core.Dimensioning.measureToCm(value) / 100
    );
  };

  handleCloneAbovePressed = (index) => {
    let nextIndex = this.props.onCloneAboveLayer(index);
    this.props.onLayerSelected({ value: nextIndex });
  };

  handleCloneBelowPressed = (index) => {
    let nextIndex = this.props.onCloneBelowLayer(index);
    this.props.onLayerSelected({ value: nextIndex });
  };

  handleMoveAbovePressed = (index) => {
    let nextIndex = this.props.onMoveAboveLayer(index);
    this.props.onLayerSelected({ value: nextIndex });
  };

  handleMoveBelowPressed = (index) => {
    let nextIndex = this.props.onMoveBelowLayer(index);
    this.props.onLayerSelected({ value: nextIndex });
  };

  handleRemovePressed = (index) => {
    this.props.onRemoveLayer(index);
    this.props.onLayerSelected({ value: null });
  };

  handleToggleSelectedTag = (tag) => {
    const selectedTags = [...this.state.selectedTags];
    if (selectedTags.includes(tag)) {
      const index = selectedTags.indexOf(tag);
      selectedTags.splice(index, 1);
    } else {
      selectedTags.push(tag);
    }
    const roomData = this.getRoomData();
    roomData.forEach((room) => {
      let exist = false;
      for (const tag of selectedTags) {
        if (room.tags.includes(tag)) {
          exist = true;
          break;
        }
      }
      if (exist) {
        this.props.onSetRoomVisible(room.uuid, true, false);
      } else {
        this.props.onSetRoomVisible(room.uuid, false, false);
      }
    });
    this.props.onUpdate();
    this.setState({ selectedTags });
  };

  getFloorData = () => {
    const { layers, activeIndex } = this.props;
    const data = [
      { label: "All Floors", isValid: false, value: null, height: 0 },
    ];
    let selectedLayer = null;

    if (Array.isArray(layers)) {
      const sorted = JSON.parse(JSON.stringify(layers));
      sorted.sort((a, b) => b.index - a.index);
      for (let i = 0; i < sorted.length; i++) {
        let item = sorted[i];
        data[0].height += item.height - 0;
        const info = {
          isValid: true,
          isTopLayer: i === 0 || item.index === -1,
          isBottomLayer: i === sorted.length - 1 || item.index === 0,
          isNotRemovable: sorted.length <= 1,
          isVisible: item.visible,
          label: `Floor ${
            item.index >= 0 ? item.index : "B" + Math.abs(item.index)
          }`,
          value: item.index,
          offset: item.offset,
          height: item.height,
          floorThickness: item.floorThickness,
        };
        info.value === activeIndex && (selectedLayer = info);
        data.push(info);
      }
    }
    return { data, selectedLayer };
  };

  getRoomData = () => {
    const { rooms } = this.props;
    const data = [];

    if (Array.isArray(rooms)) {
      const sorted = JSON.parse(JSON.stringify(rooms));
      sorted.sort((a, b) => b.layerIndex - a.layerIndex);
      for (let i = 0; i < sorted.length; i++) {
        let item = sorted[i];
        const info = {
          uuid: item.uuid,
          tags: item.tags,
          isValid: true,
          isVisible: item.visible,
          layerLabel: `Floor ${
            item.layerIndex >= 0
              ? item.layerIndex
              : "B" + Math.abs(item.layerIndex)
          }`,
          label: item.name,
        };
        data.push(info);
      }
    }
    return data;
  };

  _renderHeightInput = (item, isActive) => {
    let rawHeight = Core.Dimensioning.cmToMeasure(item.height * 100);
    if (!isActive) return <td style={{ textAlign: "right" }}>{rawHeight}</td>;
    return (
      <td style={{ textAlign: "right" }}>
        <InputWithUnit
          rawValue={item.height}
          style={{ width: 60, fontSize: 16 }}
          min={0}
          step={0.1}
          onChange={(value) => {
            this.props.onHeightChanged(item.value, value);
          }}
        />
      </td>
    );
  };

  _renderFloorsTable = (data) => {
    if (!Array.isArray(data)) return;
    const { activeIndex } = this.props;
    return (
      <>
        <table className="table">
          <thead>
            <tr>
              <th>Label</th>
              <th>Below</th>
              <th>Height</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr
                  key={index}
                  className={activeIndex === item.value ? "active" : ""}
                >
                  <td
                    className="label"
                    onClick={() => this.props.onLayerSelected(item)}
                  >{`${item.label}`}</td>
                  <td>
                    {item.value !== null && (
                      <input
                        type="checkbox"
                        checked={item.value < 0}
                        onChange={() => {}}
                      />
                    )}
                  </td>
                  {this._renderHeightInput(
                    item,
                    item.isValid && activeIndex === item.value
                  )}
                  <td>
                    {item.value !== null && (
                      <span
                        className={`fa fa-eye${item.isVisible ? "" : "-slash"}`}
                        onClick={() =>
                          this.props.onSetLayerVisible(
                            item.value,
                            !item.isVisible
                          )
                        }
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  };

  _renderRoomsTable = (data) => {
    if (!Array.isArray(data)) return;
    const { selectedTags } = this.state;
    const tags = [];
    data.forEach((room) =>
      room.tags.forEach((tag) => {
        if (!tags.includes(tag)) tags.push(tag);
      })
    );
    return (
      <>
        <div style={{ paddingTop: 10 }}>
          {tags.map((tag, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #3575a5",
                borderRadius: 3,
                display: "inline-block",
                padding: 5,
                margin: 3,
                cursor: "pointer",
                background: selectedTags.includes(tag)
                  ? "#888888"
                  : "transparent",
              }}
              onClick={() => this.handleToggleSelectedTag(tag)}
            >
              <span>{tag}</span>
            </div>
          ))}
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Floor</th>
              <th>Name</th>
              <th>Visible</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="label">{item.layerLabel}</td>
                  <td>{item.label}</td>
                  <td>
                    {item.value !== null && (
                      <span
                        className={`fa fa-eye${item.isVisible ? "" : "-slash"}`}
                        onClick={() =>
                          this.props.onSetRoomVisible(
                            item.uuid,
                            !item.isVisible
                          )
                        }
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  };

  _renderButtons = (layerInfo) => {
    if (!layerInfo) return;
    const { value, isTopLayer, isBottomLayer, isNotRemovable } = layerInfo;
    const buttons = [
      {
        hidden: isTopLayer,
        label: "Move Above",
        callback: () => this.handleMoveAbovePressed(value),
      },
      {
        hidden: isBottomLayer,
        label: "Move Below",
        callback: () => this.handleMoveBelowPressed(value),
      },
      {
        label: "Clone Above",
        callback: () => this.handleCloneAbovePressed(value),
      },
      {
        label: "Clone Below",
        callback: () => this.handleCloneBelowPressed(value),
      },
      {
        hidden: isNotRemovable,
        label: "Remove Floor",
        callback: () => this.handleRemovePressed(value),
      },
    ];
    return (
      <div>
        <div className="input-container">
          <label>Floor Thickness</label>
          <div>
            <InputWithUnit
              step={0.1}
              min={0}
              rawValue={layerInfo.floorThickness}
              onChange={(newValue) =>
                this.props.onFloorThicknessChanged(value, newValue)
              }
            />
          </div>
        </div>
        {buttons.map((button, index) => (
          <div
            hidden={button.hidden}
            className={`button ${button.active ? "active" : ""}`}
            key={index}
            onClick={() => button.callback(button.value)}
          >
            {button.label}
          </div>
        ))}
      </div>
    );
  };

  _renderBuildingOffset = () => {
    const { buildingOffset } = this.props;
    return (
      <div className="input-container">
        <label>Building Offset</label>
        <div>
          <InputWithUnit
            step={0.1}
            style={{ width: 50 }}
            rawValue={buildingOffset}
            onChange={(newValue) => {
              this.props.onBuildingOffsetChanged(newValue);
            }}
          />
        </div>
      </div>
    );
  };

  render() {
    const { data, selectedLayer } = this.getFloorData();
    const roomData = this.getRoomData();
    return (
      <div className="property-section">
        <CustomTitle title="Edit Floors" onClose={this.props.onClose} />
        {this._renderBuildingOffset()}
        <div style={{ padding: 10 }}>{this._renderFloorsTable(data)}</div>
        {this._renderButtons(selectedLayer)}
        <h3 style={{ fontWeight: 500 }}>Rooms</h3>
        <div style={{ padding: 10 }}>{this._renderRoomsTable(roomData)}</div>
        <ReactTooltip />
      </div>
    );
  }
}
