import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomTitle from "./customTitle";

const UnitList = [
  { label: "Meter", value: "m" },
  { label: "Centimeter", value: "cm" },
  { label: "Inch", value: "in" },
];

export default class SettingSection extends React.Component {
  handleUnitChanged = (e) => {
    const newUnit = e.target.value;
    this.props.onUnitChanged(newUnit);
  };

  handleGeolocationDataChanged = (data) => this.props.onSolarInfoChanged(data);

  _renderCheckboxes = () => {
    const { showCompass, showDimension, showObstacle, snap } = this.props;
    const data = [
      {
        label: "Show Compass",
        checked: showCompass,
        callback: () => this.props.onChangeCompassVisibility(!showCompass),
      },
      {
        label: "Show Dimension",
        checked: showDimension,
        callback: () => this.props.onChangeDimensionVisibility(!showDimension),
      },
      {
        label: "Show Obstacle",
        checked: showObstacle,
        callback: () => this.props.onChangeObstacleVisibility(!showObstacle),
      },
      {
        label: "Snap",
        checked: snap,
        callback: () => this.props.onChangeSnap(!snap),
      },
    ];
    return data.map((item, index) => (
      <div className="input-container" key={index}>
        <label htmlFor={item.label}>{item.label}</label>
        <input
          type="checkbox"
          id={item.label}
          checked={item.checked}
          onChange={item.callback}
        />
      </div>
    ));
  };

  _renderGeolocationData = () => {
    const { lat, long } = this.props.solarInfo;
    return (
      <div>
        <div className="input-container">
          <label>Lat: </label>
          <div>
            <input
              type="number"
              value={lat}
              min={-90}
              max={90}
              style={{ width: 100 }}
              onChange={(e) =>
                this.handleGeolocationDataChanged({
                  ...this.props.solarInfo,
                  lat: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="input-container">
          <label>Long: </label>
          <div>
            <input
              type="number"
              min={-180}
              max={180}
              value={long}
              style={{ width: 100 }}
              onChange={(e) =>
                this.handleGeolocationDataChanged({
                  ...this.props.solarInfo,
                  long: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
    );
  };

  _renderTimePicker = () => {
    const { time } = this.props.solarInfo;
    return (
      <div className="input-container">
        <label>Time: </label>
        <div>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            showTimeSelect
            selected={time}
            onChange={(date) =>
              this.handleGeolocationDataChanged({
                ...this.props.solarInfo,
                time: date,
              })
            }
          />
        </div>
      </div>
    );
  };

  render() {
    const { unit } = this.props;

    return (
      <div className="property-section">
        <CustomTitle title="Settings" onClose={this.props.onClose} />
        <div>
          <div className="input-container">
            <label>Unit</label>
            <select value={unit} onChange={this.handleUnitChanged}>
              {UnitList.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          {this._renderCheckboxes()}
          {/* <h3 style={{ fontWeight: 500 }}>Geolocation</h3>
          {this._renderGeolocationData()}
          {this._renderTimePicker()} */}
        </div>
      </div>
    );
  }
}
