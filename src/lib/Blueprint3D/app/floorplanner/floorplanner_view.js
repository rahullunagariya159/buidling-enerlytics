import Core from "../core";

export const floorplannerModes = {
  MOVE: 0,
  DRAW: 1,
  DELETE: 2,
};

export const zoomLevel = 80;

// grid parameters
const gridWidth = 1;
const gridColor = "#f1f1f1";

// room config
const hoverRoomColor = "#ffe1e199";
const roomColor = "#f9f9f999";

// wall config
const wallWidthHover = 7;
const wallColorHover = "#008cba99";

const insideWallColor = "#6a8ed0";
const insideWallColorHover = "#81bdff";

const outsideWallColor = "#ba8c0099";
const outsideWallColorHover = "#ffff0099";

const obstacleWallColor = "#888888";
const obstacleWallColorHover = "#008cba";

const edgeWidth = 1;

const deleteColor = "#ff0000";

// corner config
const cornerRadius = 0;
const cornerRadiusHover = 7;
const cornerColor = "#cccccc99";
const cornerColorHover = "#00ff0099";

// item config
const itemBorderWidth = 1;
const itemBorderColor = "#444";
const itemFillColor = "#33333311";
const itemFillColorHover = "#0000ff22";
const itemLabelColor = "#000";

// ruler config
const rulerLengthTolerance = 0.01;

/**
 * The View to be used by a Floorplanner to render in/interact with.
 */
export default class FloorplannerView {
  /** The canvas element. */
  canvasElement;

  /** The 2D context. */
  context;

  /** */
  constructor(floorplan, viewmodel, canvas) {
    this.floorplan = floorplan;
    this.viewmodel = viewmodel;
    this.canvas = canvas;
    this.canvasElement = canvas;
    this.context = this.canvasElement.getContext("2d");

    this.bgImg = null;

    const scope = this;
    window.addEventListener("resize", () => {
      scope.handleWindowResize();
    });
    this.handleWindowResize();
    document.addEventListener(Core.BP3D_EVENT_CONFIG_CHANGED, (e) => {
      const { detail } = e;
      if (!detail) return;
      if (detail.hasOwnProperty(Core.configDimensionVisible)) {
        this.draw();
      }
    });
  }

  /** */
  handleWindowResize = () => {
    // console.log("resize");
    // this.viewmodel.resetOrigin();
    const canvasSel = this.canvas;
    const parent = canvasSel.parentNode;
    canvasSel.height = parent.clientHeight;
    canvasSel.width = parent.clientWidth;
    this.canvasElement.height = parent.clientHeight;
    this.canvasElement.width = parent.clientWidth;
    this.draw();
  };

  /** */
  draw = () => {
    const { obstacleEditMode } = this.viewmodel;
    this.context.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    this.drawGrid();
    this.drawGridSpacing();

    const rooms = this.floorplan.getRooms(this.floorplan.activeLayerIndex);
    const walls = this.floorplan.getWalls(this.floorplan.activeLayerIndex);
    const corners = this.floorplan.getCorners(this.floorplan.activeLayerIndex);

    if (obstacleEditMode) {
      walls.push(...this.floorplan.obstacleLayer.getWalls());
      corners.push(...this.floorplan.obstacleLayer.getCorners());
    }

    const angleCorners = [];
    const edgeLines = [];

    rooms.forEach((room) => {
      this.drawRoom(room);
    });

    walls.forEach((wall) => {
      const res = this.drawWall(wall);
      angleCorners.push(...res.corners);
      edgeLines.push(res.line);
    });

    corners.forEach((corner) => angleCorners.push(...this.drawCorner(corner)));

    if (this.viewmodel.mode === floorplannerModes.DRAW) {
      this.drawTarget(
        this.viewmodel.targetX,
        this.viewmodel.targetY,
        this.viewmodel.lastNode
      );
    }

    this.drawRulerData();
    // angleCorners.forEach((corner) => this.drawCornerAngles(corner));
    edgeLines.forEach(({ start, end, wall }) => {
      this.drawLine(
        this.viewmodel.convertX(start.x, start.y),
        this.viewmodel.convertY(start.y, start.x),
        this.viewmodel.convertX(end.x, end.y),
        this.viewmodel.convertY(end.y, end.x),
        1,
        "#000"
      );
      this.drawWallLabels(wall);
    });

    this.drawHints();
  };

  drawImg(img) {
    if (img) {
      this.bgImg = img;
    }
  }

  drawGridSpacing() {
    const length =
      this.viewmodel.calculateGridSpacing() * this.viewmodel.pixelsPerCm * 100;

    this.viewmodel.gridSpacingChangedCallbacks.forEach((cb) =>
      cb(null, length)
    );

    // const { width, height } = this.canvasElement;

    // const start = { x: width - 10 - length, y: height - 50 };
    // const end = { x: start.x + length, y: start.y };
    // const xArr = [start.x, end.x, end.x, start.x];
    // const yArr = [start.y - length, start.y - length, end.y, end.y];
    // this.context.setLineDash([]);
    // this.drawPolygon(xArr, yArr, true, "#fff", true, "#000000", 1);
  }

  drawRulerData() {
    if (!Core.Configuration.getBooleanValue(Core.configDimensionVisible))
      return;
    const offset = 30;
    const minX = offset;
    const minY = offset;
    const rulerData = this.floorplan.calculateRulerData();
    rulerData.x.forEach((ruler) => {
      this.drawRuler(ruler.start, ruler.end, ruler.length, "x", minY);
    });
    rulerData.y.forEach((ruler) => {
      this.drawRuler(ruler.start, ruler.end, ruler.length, "y", minX);
    });
  }

  drawRuler(start, end, length, direction, offset) {
    if (length < rulerLengthTolerance) return;
    start = {
      x: this.viewmodel.convertX(start.x, start.y),
      y: this.viewmodel.convertY(start.y, start.x),
    };

    end = {
      x: this.viewmodel.convertX(end.x, end.y),
      y: this.viewmodel.convertY(end.y, end.x),
    };

    const rStart = { ...start };
    const rEnd = { ...end };
    if (direction === "x") {
      rStart.y = offset;
      rEnd.y = offset;
    } else if (direction === "y") {
      rStart.x = offset;
      rEnd.x = offset;
    }
    // render ruler lines
    (() => {
      [
        {
          p: [rStart, rEnd],
          dashed: false,
        },
        {
          p: [rStart, start],
          dashed: true,
        },
        {
          p: [end, rEnd],
          dashed: true,
        },
      ].forEach((l) => {
        const c = direction === "x" ? "#ff000088" : "#0000ff88";
        this.drawLine(l.p[0].x, l.p[0].y, l.p[1].x, l.p[1].y, 1, c, l.dashed);
      });
    })();
    // render arrows
    (() => {
      const arrowSize = 15;
      const r = 4;
      let color = direction === "x" ? "#f00" : "#00f";

      const sPoints = [];
      sPoints.push(rStart);
      sPoints.push({
        x: direction === "x" ? rStart.x + arrowSize : rStart.x - arrowSize / r,
        y: direction === "x" ? rStart.y - arrowSize / r : rStart.y + arrowSize,
      });
      sPoints.push({
        x: direction === "x" ? rStart.x + arrowSize : rStart.x + arrowSize / r,
        y: direction === "x" ? rStart.y + arrowSize / r : rStart.y + arrowSize,
      });

      const ePoints = [];
      ePoints.push(rEnd);
      ePoints.push({
        x: direction === "x" ? rEnd.x - arrowSize : rEnd.x - arrowSize / r,
        y: direction === "x" ? rEnd.y - arrowSize / r : rEnd.y - arrowSize,
      });
      ePoints.push({
        x: direction === "x" ? rEnd.x - arrowSize : rEnd.x + arrowSize / r,
        y: direction === "x" ? rEnd.y + arrowSize / r : rEnd.y - arrowSize,
      });

      [sPoints, ePoints].forEach((points) => {
        let xArr = points.map((p) => p.x);
        let yArr = points.map((p) => p.y);
        this.drawPolygon(xArr, yArr, true, color, true, color, 1);
      });
    })();

    this.drawTextLabel(
      {
        x: (rStart.x + rEnd.x) / 2 + (direction === "y" ? -10 : 0),
        y: (rStart.y + rEnd.y) / 2 + (direction === "x" ? -10 : 0),
      },
      Core.Dimensioning.cmToMeasure(length * 100),
      16,
      direction === "y" ? -Math.PI / 2 : 0,
      true
    );
  }

  drawItem(item) {
    const rawPointsCollection = item.getSnapPoints();
    rawPointsCollection.forEach((hullPoints) => {
      ((points) => {
        const xArr = [];
        const yArr = [];
        points.forEach((point) => {
          xArr.push(this.viewmodel.convertX(point.x, point.y));
          yArr.push(this.viewmodel.convertY(point.y, point.x));
        });
        this.drawPolygon(
          xArr,
          yArr,
          true,
          item === this.viewmodel.activeItem
            ? itemFillColorHover
            : itemFillColor,
          true,
          itemBorderColor,
          itemBorderWidth
        );
      })(hullPoints);
    });
  }

  /** */
  drawTextLabel(pos, label, fontSize = 12, rotation = 0, stroke = false) {
    this.context.textBaseline = "middle";
    this.context.textAlign = "center";
    this.context.lineWidth = 1;

    const x = pos.needConvert ? this.viewmodel.convertX(pos.x, pos.y) : pos.x;
    const y = pos.needConvert ? this.viewmodel.convertY(pos.y, pos.x) : pos.y;
    if (!rotation) {
      if (stroke) {
        this.context.font = `700 ${fontSize}px Arial`;
        this.context.fillStyle = "#fff";
        this.context.fillText(label, x, y);
      }
      this.context.font = `normal ${fontSize}px Arial`;
      this.context.fillStyle = itemLabelColor;
      this.context.fillText(label, x, y);
    } else {
      this.context.save();
      this.context.translate(x, y);
      this.context.rotate(rotation);

      if (stroke) {
        this.context.font = `700 ${fontSize}px Arial`;
        this.context.fillStyle = "#fff";
        this.context.fillText(label, 0, 0);
      }

      this.context.font = `normal ${fontSize}px Arial`;
      this.context.fillStyle = itemLabelColor;
      this.context.fillText(label, 0, 0);
      this.context.restore();
    }
  }

  /** */
  drawWallLabels(wall) {
    const start = { x: wall.start.x, y: wall.start.y };
    const end = { x: wall.end.x, y: wall.end.y };
    const pos = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
    const length = Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2);
    this.drawEdgeLabel(pos, length);
  }

  /** */
  drawWall(wall) {
    const hover =
      wall === this.viewmodel.activeWall ||
      wall === this.viewmodel.selectedWall;
    if (wall.edge) {
      this.drawEdge(wall.edge, hover, wall.isOutsideWall, wall.isObstacleWall);
    }
    const { start, end } = wall;

    const corners = [];
    if (wall === this.viewmodel.activeWall) {
      try {
        wall.start.updateAngles();
        wall.end.updateAngles();
        corners.push(wall.start, wall.end);
      } catch (_) {}
    }

    // this.drawWallLabels(wall);
    return { corners, line: { start, end, wall } };
  }

  drawWallItem(item, wall) {
    const corners = item.getCorners();

    const xArr = [];
    const yArr = [];

    corners.forEach((corner) => {
      xArr.push(this.viewmodel.convertX(corner.x, corner.y));
      yArr.push(this.viewmodel.convertY(corner.y, corner.x));
    });
    this.drawPolygon(xArr, yArr, true, "#fff", true, "#888", 1);
  }

  /** */
  drawEdgeLabel(pos, length) {
    length *= zoomLevel;
    if (length < 60) {
      // dont draw labels on walls this short
      return;
    }
    this.context.font = "normal 12px Arial";
    this.context.fillStyle = "#000000";
    this.context.textBaseline = "middle";
    this.context.textAlign = "center";
    this.context.strokeStyle = "#ffffff";
    this.context.lineWidth = 4;

    this.context.strokeText(
      Core.Dimensioning.cmToMeasure(length),
      this.viewmodel.convertX(pos.x, pos.y),
      this.viewmodel.convertY(pos.y, pos.x)
    );
    this.context.fillText(
      Core.Dimensioning.cmToMeasure(length),
      this.viewmodel.convertX(pos.x, pos.y),
      this.viewmodel.convertY(pos.y, pos.x)
    );
  }

  /** */
  drawEdge(edge, hover, isOutside = false, isObstacleWall = false) {
    let color = isObstacleWall
      ? obstacleWallColor
      : isOutside
      ? outsideWallColor
      : insideWallColor;
    if (hover && this.viewmodel.mode === floorplannerModes.DELETE) {
      color = deleteColor;
    } else if (hover) {
      color = isObstacleWall
        ? obstacleWallColorHover
        : isOutside
        ? outsideWallColorHover
        : insideWallColorHover;
    }
    const corners = edge.corners();

    const scope = this;
    this.drawPolygon(
      Core.Utils.map(corners, (corner) => {
        return scope.viewmodel.convertX(corner.x, corner.y);
      }),
      Core.Utils.map(corners, (corner) => {
        return scope.viewmodel.convertY(corner.y, corner.x);
      }),
      true,
      color,
      true,
      color,
      edgeWidth
    );
  }

  /** */
  drawRoom(room) {
    const scope = this;
    const color =
      room === this.viewmodel.activeRoom ? hoverRoomColor : roomColor;
    this.drawPolygon(
      Core.Utils.map(room.corners, (corner) => {
        return scope.viewmodel.convertX(corner.x, corner.y);
      }),
      Core.Utils.map(room.corners, (corner) => {
        return scope.viewmodel.convertY(corner.y, corner.x);
      }),
      true,
      color,
      true
    );

    this.bgImg &&
      this.drawBackgroundImg({
        xArr: Core.Utils.map(room.corners, (corner) => {
          return scope.viewmodel.convertX(corner.x, corner.y);
        }),
        yArr: Core.Utils.map(room.corners, (corner) => {
          return scope.viewmodel.convertY(corner.y, corner.x);
        }),
      });
    // console.log(room.updateArea);
    room.updateArea();
    const { areaCenter } = room;
    const pos = {
      x: this.viewmodel.convertX(areaCenter.x, areaCenter.y),
      y: this.viewmodel.convertY(areaCenter.y, areaCenter.x),
    };
    const posName = JSON.parse(JSON.stringify(pos));
    posName.y -= 10;
    const posArea = JSON.parse(JSON.stringify(pos));
    posArea.y += 10;
    posName.needConvert = posArea.needConvert = false;
    const area =
      Core.Dimensioning.cmToMeasure(room.area * 10000, 2) +
      String.fromCharCode(178);

    this.drawTextLabel(posName, room.name, 18);
    this.drawTextLabel(posArea, area, 18);
  }

  /** */
  drawCorner(corner) {
    const hover =
      corner === this.viewmodel.activeCorner ||
      corner === this.viewmodel.selectedCorner;
    const isLastNode =
      corner === this.viewmodel.lastNode &&
      this.viewmodel.mode === floorplannerModes.DRAW;
    let color = cornerColor;
    if (hover && this.viewmodel.mode === floorplannerModes.DELETE) {
      color = deleteColor;
    } else if (hover) {
      color = cornerColorHover;
    }
    this.drawCircle(
      this.viewmodel.convertX(corner.x, corner.y),
      this.viewmodel.convertY(corner.y, corner.x),
      hover ? cornerRadiusHover : cornerRadius,
      color
    );

    const corners = [];
    if (hover) {
      this.drawTextLabel(
        { x: corner.x, y: corner.y + 0.5, needConvert: true },
        `${Core.Dimensioning.cmToMeasure(
          corner.x * 100
        )}, ${Core.Dimensioning.cmToMeasure(-corner.y * 100)}`
      );
      corner.updateAngles();
      corners.push(corner);
      corner.adjacentCorners().forEach((neighbour) => corners.push(neighbour));
    } else if (isLastNode) {
      corner.updateAngles({
        x: this.viewmodel.targetX,
        y: this.viewmodel.targetY,
      });
      corners.push(corner);
    }
    return corners;
  }

  drawCornerAngles(corner) {
    var ox = this.viewmodel.convertX(corner.x, corner.y);
    var oy = this.viewmodel.convertY(corner.y, corner.x);
    var offsetRatio = 2.0;
    for (var i = 0; i < corner.angles.length; i++) {
      var direction = corner.angleDirections[i];
      var location = direction
        .clone()
        .multiplyScalar(3)
        .add(corner.getLocation());
      var sAngle = (corner.startAngles[i] * Math.PI) / 180;
      var eAngle = (corner.endAngles[i] * Math.PI) / 180;
      var angle = corner.angles[i];

      var radius = direction.length() * offsetRatio * 50;
      if (angle === 0) {
        continue;
      }
      var ccwise = Math.abs(corner.startAngles[i] - corner.endAngles[i]) > 180;
      this.context.strokeStyle = "#000000";
      this.context.lineWidth = 4;
      this.context.beginPath();
      if (angle === 90) {
        var location2 = direction
          .clone()
          .multiplyScalar(offsetRatio)
          .add(corner.getLocation());
        var lxx = this.viewmodel.convertX(location2.x, location2.y);
        var lyy = this.viewmodel.convertY(location2.y, location2.x);

        var c = { x: lxx, y: lyy };
        const v = corner.getLocation().clone();
        let vB = v.clone().rotateAround(location2, Math.PI / 4);
        vB = vB.sub(
          vB
            .clone()
            .sub(location2)
            .multiplyScalar(1 - 1 / Math.sqrt(2))
        );
        const b = {
          x: this.viewmodel.convertX(vB.x, vB.y),
          y: this.viewmodel.convertY(vB.y, vB.x),
        };

        let vD = v.clone().rotateAround(location2, -Math.PI / 4);
        vD = vD.sub(
          vD
            .clone()
            .sub(location2)
            .multiplyScalar(1 - 1 / Math.sqrt(2))
        );
        const d = {
          x: this.viewmodel.convertX(vD.x, vD.y),
          y: this.viewmodel.convertY(vD.y, vD.x),
        };
        this.drawLine(b.x, b.y, c.x, c.y, this.context.strokeWidth, "#333");
        this.drawLine(c.x, c.y, d.x, d.y, this.context.strokeWidth, "#333");
      } else {
        // const orientation = (this.viewmodel.orientation * Math.PI) / 180;
        const orientation = 0;
        const startAngle = Math.min(sAngle, eAngle) + orientation;
        const endAngle = Math.max(sAngle, eAngle + orientation);
        this.context.arc(ox, oy, radius, startAngle, endAngle, ccwise);
      }

      this.context.stroke();
      location.needConvert = true;
      this.drawTextLabel(location, `${angle}°`);
    }
  }

  /** */
  drawTarget(x, y, lastNode) {
    this.drawCircle(
      this.viewmodel.convertX(x, y),
      this.viewmodel.convertY(y, x),
      cornerRadiusHover,
      cornerColorHover
    );
    this.drawTextLabel(
      { x, y: y + 0.5, needConvert: true },
      `${Core.Dimensioning.cmToMeasure(
        x * 100
      )}, ${Core.Dimensioning.cmToMeasure(-y * 100)}`
    );
    if (this.viewmodel.lastNode) {
      this.drawLine(
        this.viewmodel.convertX(lastNode.x, lastNode.y),
        this.viewmodel.convertY(lastNode.y, lastNode.x),
        this.viewmodel.convertX(x, y),
        this.viewmodel.convertY(y, x),
        wallWidthHover,
        wallColorHover
      );
    }
  }

  /** */
  drawLine(
    startX,
    startY,
    endX,
    endY,
    width = 1,
    color = "#000",
    dashed = false
  ) {
    // width is an integer
    // color is a hex string, i.e. #ff0000
    this.context.beginPath();
    this.context.setLineDash([]);
    if (dashed) this.context.setLineDash([3, 6]);
    this.context.moveTo(startX, startY);
    this.context.lineTo(endX, endY);
    this.context.lineWidth = width;
    this.context.strokeStyle = color;
    this.context.stroke();
  }

  drawBackgroundImg({ xArr, yArr }) {
    const minPoints = [Math.min(...xArr), Math.min(...yArr)];
    const maxPoints = [Math.max(...xArr), Math.max(...yArr)];

    const x = minPoints[0];
    const y = minPoints[1];

    const width = maxPoints[0] - x;
    const height = maxPoints[1] - y;

    // var hRatio = width / bgImg.width;
    // var vRatio = height / bgImg.height;
    // var ratio = Math.min(hRatio, vRatio);
    this.context.drawImage(
      this.bgImg,
      0,
      0,
      this.bgImg.width,
      this.bgImg.height,
      x,
      y,
      width,
      height
    );
  }

  /** */
  drawPolygon(xArr, yArr, fill, fillColor, stroke, strokeColor, strokeWidth) {
    // fillColor is a hex string, i.e. #ff0000
    // console.log(

    const img = (fill = fill || false);
    stroke = stroke || false;
    this.context.beginPath();
    this.context.moveTo(xArr[0], yArr[0]);
    for (let i = 1; i < xArr.length; i++) {
      this.context.lineTo(xArr[i], yArr[i]);
    }
    this.context.closePath();
    if (fill) {
      this.context.fillStyle = fillColor;
      this.context.fill();
    }
    if (stroke) {
      this.context.lineWidth = strokeWidth;
      this.context.strokeStyle = strokeColor;
      this.context.stroke();
    }
  }

  /** */
  drawCircle(centerX, centerY, radius, fillColor) {
    this.context.beginPath();
    this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    this.context.fillStyle = fillColor;
    this.context.fill();
  }

  /** */
  drawGrid() {
    const { gridX, gridY } = this.viewmodel;
    const { width } = this.canvasElement;
    for (let x = 0; x < gridX.length; x++) {
      const { start, end } = gridX[x];
      const center = x === Math.floor(gridX.length / 2);
      center &&
        this.drawTextLabel(
          {
            x: this.viewmodel.convertX(start.x, start.y) + 20,
            y: 20,
          },
          "Y",
          20
        );
      this.drawLine(
        this.viewmodel.convertX(start.x, start.y),
        this.viewmodel.convertY(start.y, start.x),
        this.viewmodel.convertX(end.x, end.y),
        this.viewmodel.convertY(end.y, end.x),
        center ? gridWidth * 3 : gridWidth,
        gridColor
      );
    }
    for (let y = 0; y < gridY.length; y++) {
      const { start, end } = gridY[y];
      const center = y === Math.floor(gridY.length / 2);
      center &&
        this.drawTextLabel(
          {
            x: width - 20,
            y: this.viewmodel.convertY(start.y, start.x) + 20,
          },
          "X",
          20
        );
      this.drawLine(
        this.viewmodel.convertX(start.x, start.y),
        this.viewmodel.convertY(start.y, start.x),
        this.viewmodel.convertX(end.x, end.y),
        this.viewmodel.convertY(end.y, end.x),
        center ? gridWidth * 3 : gridWidth,
        gridColor
      );
    }
  }

  drawHints() {
    const { height } = this.canvasElement;
    const { activeCorner, activeWall, activeRoom } = this.viewmodel;
    this.context.textBaseline = "middle";
    this.context.textAlign = "left";
    this.context.lineWidth = 1;
    this.context.font = `normal 16px Arial`;
    this.context.fillStyle = "#333";

    let label = "";
    if (activeCorner) {
      label = "Hint: You can click corner and edit position directly.";
    } else if (activeWall) {
      label = "Hint: You can click wall and edit properties directly.";
    } else if (activeRoom) {
      label = "Hint: You can click room and edit name directly.";
    }

    this.context.fillText(label, 30, height - 30);
  }
}
