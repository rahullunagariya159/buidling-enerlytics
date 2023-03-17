import React from "react";

import InputWithUnit from "./inputWithUnit";
import categories from "../products/category";
import CustomTitle from "./customTitle";
import { toast } from "react-toastify";

export default class WindowEditorSection extends React.Component {
  state = {
    tabIndex: 0, // 0: wall, 1: roof
    coverMethod: 0, // 0: by rate, 1: by count
    wallMode: 0, // 0: just selected, 1: same floor, 2: same direction, 3: entire

    baseWidth: 1,
    baseWidthByRate: 1,
    baseWidthByCount: 1,
    baseWidthForRoof: 1,

    baseHeight: 1.5,
    baseHeightByRate: 1.5,
    baseHeightByCount: 1.5,
    baseHeightForRoof: 1.5,

    marginVerticalByRate: 0.5,
    marginVerticalByCount: 0.5,

    coverRate: 50,
    windowCount: 5,
    selectedWindowType: 0,
    isAdding: false,
    loadingMessage: "",
  };

  _getWallData = () => {
    const { selectedEdge } = this.props;
    const { wallMode } = this.state;

    let wall = selectedEdge ? selectedEdge.wall : null;
    return { wall, wallMode };
  };

  _getRoofData = () => {
    let { selectedRoof } = this.props;
    const { wallMode } = this.state;

    let wall = selectedRoof ? selectedRoof : null;
    return { wall, wallMode };
  };

  UNSAFE_componentWillReceiveProps = (props) => {
    if (
      props.selectedEdge &&
      props.selectedEdge.wall &&
      this.state.coverMethod === 0 &&
      this.state.tabIndex === 0
    ) {
      const { wall } = props.selectedEdge;
      const { windowInfo } = wall;
      if (windowInfo) {
        this.setState({
          baseWidthByRate: windowInfo.width,
          baseHeightByRate: windowInfo.height,
          coverRate: windowInfo.coverRate,
          marginVerticalByRate: windowInfo.sillHeight,
        });
      }
    }
  };

  /* handleAddRoofWindow = () => {
    const { baseWidthForRoof, baseHeightForRoof, selectedWindowType } = this.state;
    const windowModel = JSON.parse(
      JSON.stringify(categories[0].styles[selectedWindowType])
    );
    this.props.onAddRoofWindow(windowModel, baseWidthForRoof, baseHeightForRoof);
  }; */

  handleAddRoofWindow = async () => {
    // Add Window - Roof
    const {
      coverMethod,
      baseWidthByRate,
      baseHeightByRate,
      marginVerticalByRate,
      baseWidthByCount,
      baseHeightByCount,
      marginVerticalByCount,
      coverRate,
      windowCount,
      selectedWindowType,
    } = this.state;
    const windowModel = categories[0].styles[selectedWindowType];

    const updateLoadingMessage = (state) => {
      if (state.finished) {
        // this.setState({ loadingMessage: "" });
      } else {
        this.setState({
          loadingMessage: `${state.current} / ${state.totalCount
            } windows added(${parseInt(
              (state.current / state.totalCount) * 100
            )}%).`,
        });
      }
    };

    this.setState({ isAdding: true });
    const res = await this.props.onAddRoofWindow(
      windowModel,
      coverMethod === 0 ? { baseWidth: baseWidthByRate, baseHeight: baseHeightByRate } : { baseWidth: baseWidthByCount, baseHeight: baseHeightByCount },
      { horizontal: 0, vertical: coverMethod === 0 ? marginVerticalByRate : marginVerticalByCount },
      {
        coverMethod,
        coverRate: coverRate / 100,
        windowCount,
      },
      this._getRoofData(),
      updateLoadingMessage
    );
    this.setState({ isAdding: false });
    if (res) {
      if (res.state === 1) {
        toast.error(res.msg);
      }
    }
  };

  handleRemoveAllRoofWindows = () => this.props.onRemoveAllRoofWindows();

  handleAddWallWindows = async () => {
    // Add Window - All
    const {
      coverMethod,
      baseWidthByRate,
      baseHeightByRate,
      marginVerticalByRate,
      baseWidthByCount,
      baseHeightByCount,
      marginVerticalByCount,
      coverRate,
      windowCount,
      selectedWindowType,
    } = this.state;
    const windowModel = categories[0].styles[selectedWindowType];

    const updateLoadingMessage = (state) => {
      if (state.finished) {
        // this.setState({ loadingMessage: "" });
      } else {
        this.setState({
          loadingMessage: `${state.current} / ${state.totalCount
            } windows added(${parseInt(
              (state.current / state.totalCount) * 100
            )}%).`,
        });
      }
    };

    this.setState({ isAdding: true });
    const res = await this.props.onAddWindows(
      windowModel,
      coverMethod === 0 ? { baseWidth: baseWidthByRate, baseHeight: baseHeightByRate } : { baseWidth: baseWidthByCount, baseHeight: baseHeightByCount },
      { horizontal: 0, vertical: coverMethod === 0 ? marginVerticalByRate : marginVerticalByCount },
      {
        coverMethod,
        coverRate: coverRate / 100,
        windowCount,
      },
      this._getWallData(),
      updateLoadingMessage
    );
    this.setState({ isAdding: false });
    if (res) {
      if (res.state === 1) {
        toast.error(res.msg);
      }
    }
  };

  handleRemoveWallWindows = () => this.props.onRemoveWindows(this._getWallData());

  _renderWindowTypes = () => {
    const { selectedWindowType } = this.state;
    const windows = categories[0];
    const style = {
      width: 80,
      height: 80,
      margin: 10,
      cursor: "pointer",
    };
    return (
      <div>
        <p>Select Window</p>
        {windows.styles.map((item, index) => (
          <img
            key={index}
            alt=""
            src={item.image}
            style={{
              ...style,
              border: `3px solid ${selectedWindowType === index ? "gray" : "transparent"
                }`,
            }}
            onClick={() => this.setState({ selectedWindowType: index })}
          />
        ))}
      </div>
    );
  };

  _renderWallWindowDimensioning = () => {
    const {
      coverMethod,
      baseWidthByRate,
      baseWidthByCount,
      baseHeightByRate,
      baseHeightByCount,
      marginVerticalByRate,
      marginVerticalByCount,
    } = this.state;
    const inputs = [
      {
        label: "Base Width:",
        value: coverMethod === 0 ? baseWidthByRate : baseWidthByCount,
        callback: (value) => this.setState(coverMethod === 0 ? { baseWidthByRate: value } : { baseWidthByCount: value }),
      },
      {
        label: "Base Height:",
        value: coverMethod === 0 ? baseHeightByRate : baseHeightByCount,
        callback: (value) => this.setState(coverMethod === 0 ? { baseHeightByRate: value } : { baseHeightByCount: value }),
      },
      {
        label: "Base Distance to Floor Level:",
        value: coverMethod === 0 ? marginVerticalByRate : marginVerticalByCount,
        min: 0.1,
        callback: (value) => this.setState(coverMethod === 0 ? { marginVerticalByRate: value } : { marginVerticalByCount: value }),
      },
    ];

    return (
      <div>
        {inputs.map((item, index) => (
          <div className="input-container" key={index}>
            <label className="label-option-walls">{item.label}</label>
            <div>
              <InputWithUnit
                rawValue={item.value}
                min={item.min || 0}
                step={0.1}
                style={{ width: 50 }}
                onChange={item.callback}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  _renderRoofWindowDimensioning = () => {
    const { baseWidthForRoof, baseHeightForRoof } = this.state;
    const inputs = [
      {
        label: "Width:",
        value: baseWidthForRoof,
        callback: (value) => this.setState({ baseWidthForRoof: value }),
      },
      {
        label: "Height:",
        value: baseHeightForRoof,
        callback: (value) => this.setState({ baseHeightForRoof: value }),
      },
    ];
    return (
      <div>
        {inputs.map((item, index) => (
          <div className="input-container" key={index}>
            <label className="label-option-walls">{item.label}</label>
            <div>
              <InputWithUnit
                rawValue={item.value}
                min={item.min || 0}
                step={0.1}
                style={{ width: 50 }}
                onChange={item.callback}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  _renderWallCoverMethods = () => {
    const { coverMethod, coverRate, windowCount } = this.state;
    return (
      <div>
        <div className="input-container">
          <div>
            <input
              type={"radio"}
              checked={coverMethod === 0}
              id="cover-by-rate"
              onChange={() => this.setState({ coverMethod: 0 })}
            />
            <label className="label-option-walls" htmlFor="cover-by-rate">Expected Cover Rate:</label>
          </div>
          <div>
            <input
              type="number"
              value={coverRate}
              min={0}
              max={100}
              style={{ width: 50 }}
              onChange={(e) => {
                let coverRate = parseFloat(e.target.value);
                if (coverRate < 0) coverRate = 0;
                if (coverRate > 100) coverRate = 100;
                this.setState({ coverRate });
              }}
            />
            <label className="label-option-walls"> %</label>
          </div>
        </div>
        <div className="input-container">
          <div>
            <input
              type={"radio"}
              checked={coverMethod === 1}
              id="cover-by-count"
              onChange={() => this.setState({ coverMethod: 1, wallMode: 0 })}
            />
            <label className="label-option-walls" htmlFor="cover-by-count">Count of Windows on wall</label>
          </div>
          <div>
            <input
              type="number"
              value={windowCount}
              min={0}
              max={100}
              style={{ width: 50 }}
              onChange={(e) => {
                let windowCount = parseInt(e.target.value);
                this.setState({ windowCount });
              }}
            />
            <label className="label-option-walls"></label>
          </div>
        </div>
      </div>
    );
  };

  _renderWallButtons = () => {
    const { isAdding, loadingMessage } = this.state;
    const buttons = [
      {
        label: "Add Windows",
        callback: this.handleAddWallWindows,
      },
      {
        label: "Remove Windows",
        callback: this.handleRemoveWallWindows,
      },
    ];
    return (
      <div>
        {buttons.map((button, index) => {
          if (!button) return <hr key={index} />;
          return (
            <div
              className={`button building-btn ${isAdding ? "disabled" : ""}`}
              key={index}
              onClick={() => !isAdding && button.callback()}
            >
              {button.label}
            </div>
          );
        })}
        <p>{loadingMessage}</p>
      </div>
    );
  };

  _renderRoofButtons = () => {
    const { isAdding, loadingMessage } = this.state;
    const buttons = [
      {
        label: "Add Roof Window",
        callback: this.handleAddRoofWindow,
      },
      {
        label: "Remove All Roof Windows",
        callback: this.handleRemoveAllRoofWindows,
      },
    ];
    return (
      <div>
        {buttons.map((button, index) => {
          if (!button) return <hr key={index} />;
          return (
            <div
              className={`button building-btn ${isAdding ? "disabled" : ""}`}
              key={index}
              onClick={() => !isAdding && button.callback()}
            >
              {button.label}
            </div>
          );
        })}
        <p>{loadingMessage}</p>
      </div>
    );
  };

  _renderWallManagementPanel = () => {
    const { wallMode, coverMethod } = this.state;
    const { selectedEdge } = this.props;
    const wallOptions = [
      { label: "1. Apply only to selected wall", disabled: !selectedEdge },
      {
        label: "2. Apply to all walls on same floor",
        disabled: coverMethod === 1 || !selectedEdge,
      },
      {
        label: "3. Apply to all walls facing the same direction",
        disabled: coverMethod === 1 || !selectedEdge,
      },
      {
        label: "4. Apply to all walls of the building",
        disabled: coverMethod === 1,
      },
    ];

    return (
      <div style={{ padding: "20px 0" }}>
        <div>
          {wallOptions.map((item, index) => (
            <div key={index}>
              <input
                id={`wall-mode-${index}`}
                type="radio"
                disabled={item.disabled}
                checked={index === wallMode}
                onChange={() => this.setState({ wallMode: index })}
              />
              <label className="label-option-walls" htmlFor={`wall-mode-${index}`}>{item.label}</label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  _renderRoofManagementPanel = () => {
    const { wallMode, coverMethod } = this.state;
    let { selectedRoof } = this.props;

    const wallOptions = [
      { label: "1. Apply only to selected roof", disabled: !selectedRoof },
      {
        label: "2. Apply to all roofs on same floor",
        disabled: coverMethod === 1 || !selectedRoof,
      },
      {
        label: "3. Apply to all roofs facing the same direction",
        disabled: coverMethod === 1 || !selectedRoof,
      },
      {
        label: "4. Apply to all roofs of the building",
        disabled: coverMethod === 1,
      },
    ];

    return (
      <div style={{ padding: "20px 0" }}>
        <div>
          {wallOptions.map((item, index) => (
            <div key={index}>
              <input
                id={`wall-mode-${index}`}
                type="radio"
                disabled={item.disabled}
                checked={index === wallMode}
                onChange={() => this.setState({ wallMode: index })}
              />
              <label className="label-option-walls" htmlFor={`wall-mode-${index}`}>{item.label}</label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  _renderTabs = () => {
    const { tabIndex } = this.state;
    return (
      <div style={{ padding: "20px 0" }}>
        {["Wall Windows", "Roof Windows"].map((t, i) => (
          <span
            className={`tab ${tabIndex === i ? "active" : ""}`}
            key={i}
            onClick={() => this.setState({ tabIndex: i })}
          >
            {t}
          </span>
        ))}
      </div>
    );
  };

  _renderWallWindowsPanel = () => {
    const { tabIndex } = this.state;
    if (tabIndex !== 0) return;
    return (
      <div>
        {this._renderWallWindowDimensioning()}
        {this._renderWallCoverMethods()}
        {this._renderWallManagementPanel()}
        {this._renderWallButtons()}
      </div>
    );
  };

  _renderRoofWindowsPanel = () => {
    const { tabIndex } = this.state;
    if (tabIndex !== 1) return;
    return (
      <div>
        {/* {this._renderRoofWindowDimensioning()} */}
        {this._renderWallWindowDimensioning()}
        {this._renderWallCoverMethods()}
        {this._renderRoofManagementPanel()}
        {this._renderRoofButtons()}
      </div>
    );
  };

  render() {
    return (
      <div className="property-section">
        <CustomTitle title="Window Editor" onClose={this.props.onClose} />
        {this._renderWindowTypes()}
        {this._renderTabs()}
        {this._renderWallWindowsPanel()}
        {this._renderRoofWindowsPanel()}
      </div>
    );
  }
}
