import React from "react";
import Core from "../lib/Blueprint3D/app/core";

export default class InputWithUnit extends React.Component {
  elInput = null;
  constructor(props) {
    super(props);
    const rawValue = props.rawValue || 0;
    this.state = {
      value: Core.Dimensioning.cmToMeasureWithoutUnit(rawValue * 100),
    };
  }

  handleChanged = (e) => {
    const { min, max, autoTrigger } = this.props;
    let value = e.target.value;
    if (Number.isInteger(min)) {
      if (value < min) value = min;
    }
    if (Number.isInteger(max)) {
      if (value > max) value = max;
    }
    this.setState(
      { value },
      () => (true || autoTrigger) && this.handleCompleted()
    );
  };

  handleArrowUp = () => this.elInput.stepUp();

  handleArrowDown = () => this.elInput.stepDown();

  handleCompleted = () => {
    const { value } = this.state;
    const rawValue = Core.Dimensioning.measureToCm(value) / 100;
    this.props.onChange(rawValue);
  };

  componentWillReceiveProps = (props) => {
    if (this.props.rawValue !== props.rawValue) {
      const rawValue = props.rawValue || 0;

      this.setState({
        value: Core.Dimensioning.cmToMeasureWithoutUnit(rawValue * 100),
      });
    }
  };

  render() {
    const { step, style } = this.props;
    const { value } = this.state;

    let unit = Core.Dimensioning.getUnit();
    return (
      <>
        <div className="input-with-unit">
          <input
            ref={(ref) => (this.elInput = ref)}
            style={style || {}}
            type="number"
            step={step || 0.1}
            value={value}
            min={-1000}
            max={1000}
            lang="en"
            onChange={this.handleChanged}
            onKeyDown={(e) => e.keyCode === 13 && this.handleCompleted()}
            onBlur={this.handleCompleted}
            name="input-with-unit"
          />
          {/* <div className="arrow arrow-up" onClick={this.handleArrowUp}>
            <span className="fas fa-chevron-up" />
          </div>
          <div className="arrow arrow-down" onClick={this.handleArrowDown}>
            <span className="fas fa-chevron-down" />
          </div> */}
        </div>
        <label htmlFor="input-with-unit"> {unit}</label>
      </>
    );
  }
}
