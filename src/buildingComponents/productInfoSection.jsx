import React from "react";
import InputWithUnit from "./inputWithUnit";

const PI2M = 0.0254;
export function MorphInput(props) {
  const { item, info, onChange } = props;
  let index = item.index;
  let value = 0;
  let min = parseInt(item.min || 0, 10);
  let max = parseInt(item.max || 100, 10);

  min *= PI2M;
  max *= PI2M;

  let morphValue = info.getMorph(index);
  value = Math.round(5 + morphValue * (300 - 5));

  const onValueChanged = (e) => {
    let value = e.target.value;
    if (value < min || value > max) return;
    let morphValue = (value / PI2M - 5) / (300 - 5);
    typeof onChange === "function" && onChange(index, morphValue);
  };

  return (
    <div className="input-container">
      <label>{item.label}</label>
      <div className="input">
        <input
          type="range"
          className="input-slider"
          min={min}
          max={max}
          value={value * PI2M}
          step={0.01}
          onChange={onValueChanged}
        />
        <div>
          <InputWithUnit
            rawValue={value * PI2M}
            style={{ width: 50 }}
            step={0.1}
            onChange={(value) => onValueChanged({ target: { value } })}
          />
        </div>
        {/* <input
          type="number"
          className="input-number"
          min={min}
          max={max}
          value={value}
          step={1}
          onChange={onValueChanged}
        /> */}
      </div>
      {/* <label>{parseInt(value / 2.54)}"</label> */}
    </div>
  );
}
export default class ProductInfoSection extends React.Component {
  renderMorphingSection = () => {
    const { info } = this.props;
    if (!info || !info.metadata || !Array.isArray(info.metadata.morph)) return;
    return info.metadata.morph.map((item, i) => (
      <MorphInput
        key={i}
        item={item}
        info={info}
        onChange={this.props.onMorphChanged}
      />
    ));
  };

  _renderGroupInfo = (info) => {
    return (
      <>
        {info.hasOwnProperty("opened") ? (
          <>
            <hr />
            <div className="input-container">
              <label>Group Opened</label>
              <input
                type="checkbox"
                checked={info.opened}
                onChange={() =>
                  typeof this.props.onOpenedChanged === "function" &&
                  this.props.onOpenedChanged(!info.opened)
                }
              />
            </div>
            <hr />
          </>
        ) : info.groupParent && info.groupParent.hasOwnProperty("opened") ? (
          <>
            <hr />
            <div className="input-container">
              <label>Group Opened</label>
              <input
                type="checkbox"
                checked={info.groupParent.opened}
                onChange={() =>
                  typeof this.props.onOpenedChanged === "function" &&
                  this.props.onOpenedChanged(!info.groupParent.opened)
                }
              />
            </div>
            <hr />
          </>
        ) : null}
      </>
    );
  };

  _renderInfo = (info) => {
    return (
      <div>
        <h3>{info && info.metadata ? info.metadata.itemName : ""}</h3>
        {this._renderGroupInfo(info)}
        {this.renderMorphingSection()}
      </div>
    );
  };

  render() {
    const { info } = this.props;
    return (
      <div className="property-section">
        {info && this._renderInfo(info)}
        {!info && <p>No item selected</p>}
      </div>
    );
  }
}
