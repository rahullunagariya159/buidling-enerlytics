import React from "react";
import CustomTitle from "./customTitle";

export default class ShellToolSection extends React.Component {
  handleShellModeChanged = () => {
    this.props.shellModeEnabled(!this.props.shellMode);
  };

  render() {
    const { shellMode } = this.props;
    return (
      <div className="shell-tool-section">
        <CustomTitle title="Shell Tools" onClose={this.props.onClose} />
        <div style={{ padding: "10px 0" }}>
          <div style={{ padding: "10px 0" }}>
            <input
              type="checkbox"
              checked={shellMode}
              onChange={this.handleShellModeChanged}
            />
            <label>Enable Shell Mode</label>
          </div>
          <div>
            <div
              onClick={this.props.onRoofEditModeClicked}
              className={`shell-tool-item`}
            >{`Roof`}</div>
          </div>
        </div>
      </div>
    );
  }
}
