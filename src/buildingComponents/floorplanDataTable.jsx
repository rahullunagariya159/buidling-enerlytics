import React from "react";
import CustomTitle from "./customTitle";
import CustomAccordion from "./customAccordion";

export default class FloorplanDataTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
    };
  }

  _renderTableHeader = (labels) => {
    return (
      <thead>
        <tr>
          {labels.map((label, index) => (
            <th key={index}>{label}</th>
          ))}
        </tr>
      </thead>
    );
  };

  _renderTableRow = (data) => {
    return data.map((item, index) => {
      if (Array.isArray(item)) return <td key={index}>{item.join(", ")}</td>;
      if (typeof item === "string") return <td key={index}>{item}</td>;
      if (typeof item === "boolean")
        return (
          <td key={index}>
            <input type="checkbox" checked={item} onChange={() => {}} />
          </td>
        );
      return <td key={index}>{item}</td>;
    });
  };

  _renderLayerMetadata = (layer) => {
    const { metadata, walls, rooms } = layer;
    if (!metadata) return;
    const {
      height,
      distanceFromGround,
      floorThickness,
      area,
      isUndergroundLayer,
      hasExposedCeiling,
      hasExposedFloor,
    } = metadata;
    const data = [
      `${distanceFromGround.toFixed(2)}m`,
      `${height.toFixed(2)}m`,
      `${floorThickness.toFixed(2)}m`,
      `${area.toFixed(2)}m${String.fromCharCode(178)}`,
      isUndergroundLayer,
      hasExposedCeiling,
      hasExposedFloor,
      rooms.length,
      walls.length,
    ];
    return (
      <div className="metadata-container" style={{ paddingLeft: 20 }}>
        <table className="table">
          {this._renderTableHeader([
            "Distance from ground",
            "Height",
            "Floor Thickness",
            "Area",
            "Underground",
            "Lowest Layer(Attached to ground)",
            "Highest Layer(Attached to Roof)",
            "Rooms",
            "Walls",
          ])}
          <tbody>
            <tr>{this._renderTableRow(data)}</tr>
          </tbody>
        </table>
      </div>
    );
  };

  _renderWallMetadata = (metadata) => {
    const {
      index,
      height,
      start,
      end,
      thickness,
      isOutsideWall,
      isExposedWall,
      isUndergroundWall,
      exposedArea,
      direction,
      windows,
    } = metadata;
    const data = [
      index + 1,
      `${height.toFixed(2)}m`,
      `(${start.x.toFixed(2)}m, ${start.y.toFixed(2)}m, ${start.z.toFixed(
        2
      )}m)`,
      `(${end.x.toFixed(2)}m, ${end.y.toFixed(2)}m, ${end.z.toFixed(2)}m)`,
      `${thickness.toFixed(2)}m`,
      isExposedWall,
      `${exposedArea.toFixed(2)}m${String.fromCharCode(178)}`,
      direction,
      isOutsideWall,
      isUndergroundWall,
      windows,
    ];
    return this._renderTableRow(data);
  };

  _renderWindowMetadata = (metadata) => {
    const { index, wallIndex, type, size, direction, position } = metadata;
    const data = [
      index + 1,
      wallIndex,
      type,
      direction,
      `${size.width.toFixed(2)}m`,
      `${size.height.toFixed(2)}m`,
      `(${position.x.toFixed(2)}m, ${position.y.toFixed(
        2
      )}m, ${position.z.toFixed(2)}m)`,
    ];
    return this._renderTableRow(data);
  };

  _renderRoomMetadata = (metadata) => {
    const { index, label, area, corners } = metadata;
    const data = [
      index + 1,
      label,
      `${area.toFixed(2)}m${String.fromCharCode(178)}`,
      corners
        .map(
          (corner) =>
            `(${corner.position.x.toFixed(2)}m, ${corner.position.y.toFixed(
              2
            )}m, ${corner.position.z.toFixed(2)}m)`
        )
        .join("-"),
    ];
    return this._renderTableRow(data);
  };

  _renderLayerData = (layer) => {
    const { metadata, walls, rooms } = layer;
    const wallMetadataList = walls.map((wall) => ({
      ...wall.metadata,
      windows: wall.windows.length,
    }));
    const windows = [];
    for (let [i, wall] of walls.entries()) {
      wall.windows.forEach((window) => {
        windows.push({
          wallIndex: i + 1,
          ...window,
        });
      });
    }

    return (
      <CustomAccordion title={metadata.label}>
        <div style={{ paddingBottom: 20 }}>
          {this._renderLayerMetadata(layer)}
          <div style={{ paddingLeft: 20 }}>
            <CustomAccordion title="Rooms">
              <div style={{ paddingLeft: 20, paddingBottom: 10 }}>
                <table className="table">
                  {this._renderTableHeader(["No", "Name", "Area", "Corners"])}
                  <tbody>
                    {rooms.map((room, index) => (
                      <tr key={index}>
                        {this._renderRoomMetadata({
                          index,
                          ...room.metadata,
                          corners: room.corners,
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CustomAccordion>

            <CustomAccordion title="Walls">
              <div style={{ paddingLeft: 20 }}>
                <table className="table">
                  {this._renderTableHeader([
                    "No",
                    "Height",
                    "Start",
                    "End",
                    "Thickness",
                    "Exposed to outside",
                    "Exposed Area",
                    "Direction",
                    "Outside",
                    "Underground",
                    "Windows",
                  ])}
                  <tbody>
                    {wallMetadataList.map((item, index) => (
                      <tr key={index}>
                        {this._renderWallMetadata({ ...item, index })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CustomAccordion>
            <div style={{ paddingLeft: 20, paddingTop: 10 }}>
              <CustomAccordion title="Windows">
                <div style={{ paddingLeft: 20 }}>
                  <table className="table">
                    {this._renderTableHeader([
                      "No",
                      "Wall Index",
                      "Type",
                      "Orientation",
                      "Width",
                      "Height",
                      "Position",
                    ])}
                    <tbody>
                      {windows.map((item, index) => (
                        <tr key={index}>
                          {this._renderWindowMetadata({ ...item, index })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CustomAccordion>
            </div>
          </div>
        </div>
      </CustomAccordion>
    );
  };

  getParsedData = () => {
    const { raw } = this.props;
    console.log(raw);
    if (!raw) return [];
    const res = [];
    const length = raw.RoomName.length;
    for (let i = 0; i < length; i++) {
      const item = {
        No: i + 1,
        RoomName: raw.RoomName[i],
        RoomHeight: raw.RoomHeight[i],
        RoomVolume: raw.RoomVolume[i],
        WallArea: raw.WallArea[i],
        WallOutside: raw.WallOutside[i],
        WallConduction: raw.WallConduction[i],
        WallDirection: raw.WallDirection[i],
        WallInclination: raw.WallInclination[i],
        WallCentroid: raw.WallCentroid[i],
        WindowShare: raw.WindowShare[i],
        WindowHeight: raw.WindowHeight[i],
        WindowSillHeight: raw.WindowSillHeight[i],
        UsableFloorArea: raw.UsableFloorArea[i],
        RoomCentroid: raw.RoomCentroid[i],
        TotalFloorArea: raw.TotalFloorArea[i],
        FloorOutside: raw.FloorOutside[i],
        RoomAboveGround: raw.RoomAboveGround[i],
      };
      res.push(item);
    }
    return res;
  };

  _renderRoomTableRow = (data) => {
    const {
      No,
      RoomName,
      RoomHeight,
      RoomVolume,
      UsableFloorArea,
      RoomCentroid,
      TotalFloorArea,
      FloorOutside,
      RoomAboveGround,
      WallArea,
      WallOutside,
      WallConduction,
      WallDirection,
      WallInclination,
      WallCentroid,
      WindowShare,
      WindowHeight,
      WindowSillHeight,
    } = data;

    const res = [
      No,
      RoomName,
      RoomHeight.toFixed(2) + "m",
      RoomVolume.toFixed(2) + "m" + String.fromCharCode(179),
      UsableFloorArea.toFixed(2) + "m" + String.fromCharCode(178),
      RoomCentroid.map((c) => `${c.toFixed(2)}m`),
      TotalFloorArea.toFixed(2) + "m" + String.fromCharCode(178),
      FloorOutside ? "True" : "False",
      RoomAboveGround ? "True" : "False",
      WallArea.map((a) => `${a.toFixed(2)}m${String.fromCharCode(178)}`),
      WallOutside.map((b) => (b ? "True" : "False")),
      WallConduction,
      WallDirection.map((d) => `${d.toFixed(0)}°`),
      WallInclination.map((i) => `${i.toFixed(0)}°`),
      WallCentroid.map(
        (center) => `[${center.map((c) => `${c.toFixed(2)}m`).join(", ")}]`
      ),
      WindowShare.map((s) => `${(s * 100).toFixed(0)}%`),
      WindowHeight.map((h) => `${h.toFixed(2)}m`),
      WindowSillHeight.map((h) => `${h.toFixed(2)}m`),
    ];

    return this._renderTableRow(res);
  };

  _renderParsedData = () => {
    const { tabIndex } = this.state;
    if (tabIndex !== 0) return;
    const { raw } = this.props;
    if (!raw) return;
    const header = ["No"];
    const excludeColumns = ["ShadingObject"];
    for (let key in raw) !excludeColumns.includes(key) && header.push(key);
    const parsed = this.getParsedData();

    return (
      <div style={{ height: "calc(100% - 90px)", overflow: "auto" }}>
        <table className="table">
          {this._renderTableHeader(header)}
          <tbody>
            {parsed.map((item, index) => (
              <tr key={index}>{this._renderRoomTableRow(item)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  _renderRawData = () => {
    const { tabIndex } = this.state;
    const { raw } = this.props;
    if (tabIndex !== 1) return;

    return (
      <div style={{ height: "calc(100% - 90px)" }}>
        <textarea
          style={{
            width: "100%",
            height: "-webkit-fill-available",
            resize: "none",
          }}
          defaultValue={JSON.stringify(raw)}
        />
      </div>
    );
  };

  render() {
    const { tabIndex } = this.state;
    const { style } = this.props;
    return (
      <div className="modal-container">
        <div className="modal-dialog" style={{ ...style }}>
          <CustomTitle title="Floorplan Data" onClose={this.props.onClose} />
          <div style={{ padding: "25px 0" }}>
            {["Parsed", "Raw"].map((title, index) => (
              <span
                key={index}
                style={{
                  border: "1px solid gray",
                  cursor: "pointer",
                  padding: 10,
                  margin: "10px 0",
                  background: tabIndex === index ? "#ddd" : "transparent",
                }}
                onClick={() => this.setState({ tabIndex: index })}
              >
                {title}
              </span>
            ))}
          </div>
          {this._renderParsedData()}
          {this._renderRawData()}
        </div>
      </div>
    );
  }
}
