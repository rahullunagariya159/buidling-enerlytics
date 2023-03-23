import * as THREE from "three";
import Core from "../core";
import FloorplannerView, {
  floorplannerModes,
  zoomLevel,
} from "./floorplanner_view";

const snapTolerance = Core.Configuration.getNumericValue(
  Core.configSnapTolernance,
);

const cmPerFoot = 30.48;
const pixelsPerFoot = 30;

const zoomStep = 2;

/**
 * The Floorplanner implements an interactive tool for creation of floorplans.
 */
export default class Floorplanner {
  /** */
  parent = null;
  /** */
  mode = 0;

  obstacleEditMode = false;

  /** */
  activeWall = null;
  selectedWall = null;
  wallMoveDirection = { x: 0, y: 0 };

  /** */
  activeCorner = null;
  selectedCorner = null;

  /** */
  activeRoom = null;
  selectedRoom = null;

  /** */
  originX = 0;
  originY = 0;

  /** */
  orientation = 0;

  /** drawing state */
  targetX = 0;
  targetY = 0;

  /** drawing state */
  lastNode = null;

  /** */
  wallWidth;

  /** */
  modeResetCallbacks = [];
  orientationChangedCallbacks = [];

  /** */
  canvasElement;

  /** */
  view;

  /** */
  mouseDown = false;
  mouseMoved = false;

  mouseButton = 0;

  /** in ThreeJS coords */
  mouseX = 0;
  mouseY = 0;

  /** in ThreeJS coords */
  rawMouseX = 0;
  rawMouseY = 0;

  /** mouse position at last click */
  lastX = 0;

  /** mouse position at last click */
  lastY = 0;

  isDragging = false;

  itemSelectedCallbacks = [];
  wallSelectedCallbacks = [];
  roomSelectedCallbacks = [];
  cornerSelectedCallbacks = [];
  nothingSelectedCallbacks = [];
  gridSpacingChangedCallbacks = [];

  /** */
  cmPerPixel;
  pixelsPerCm;

  gridX = [];
  gridY = [];

  staticGridSpacing = null;

  /** */
  constructor(canvas, floorplan, parent) {
    const cmPerFoot = 30.48;
    const pixelsPerFoot = 15;
    this.scale = 50;

    this.parent = parent;
    this.canvasElement = canvas;
    this.zoomLevel = zoomLevel;

    this.floorplan = floorplan;

    this.bgImg = null;

    this.view = new FloorplannerView(this.floorplan, this, canvas);

    this.cmPerPixel = cmPerFoot * (1 / pixelsPerFoot);
    this.pixelsPerCm = 1 / this.cmPerPixel;

    this.wallWidth = 10 * this.pixelsPerCm;

    // Initialization:

    this.setMode(floorplannerModes.MOVE);

    const scope = this;

    this.updateGrid();

    this.canvasElement.addEventListener("wheel", (event) =>
      scope.mouseWheel(event),
    );

    this.canvasElement.addEventListener("mousedown", (event) => {
      scope.mousedown(event);
    });
    this.canvasElement.addEventListener("mousemove", (event) => {
      scope.mousemove(event);
    });
    this.canvasElement.addEventListener("mouseup", (event) => {
      scope.mouseup(event);
    });
    this.canvasElement.addEventListener("mouseleave", () => {
      scope.mouseleave();
    });

    document.addEventListener(Core.BP3D_EVENT_CONFIG_CHANGED, (e) => {
      const { detail } = e;
      if (!detail) return;
      detail.dimUnit && this.view.draw();
    });

    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        scope.cancelDraw();
      }
    });

    floorplan.roomLoadedCallbacks.push(() => {
      scope.reset();
    });
  }

  setObstacleEditMode = (mode) => (this.obstacleEditMode = mode);

  calculateGridSpacing() {
    if (this.staticGridSpacing) return this.staticGridSpacing;
    let scale = 100;
    const { pixelsPerCm } = this;
    if (pixelsPerCm < 0.15) scale = 400;
    else if (pixelsPerCm < 0.3) scale = 200;
    else if (pixelsPerCm < 0.5) scale = 100;
    else if (pixelsPerCm < 1) scale = 50;
    else if (pixelsPerCm < 2) scale = 25;
    else if (pixelsPerCm < 4) scale = 12.5;
    this.gridSpacingChangedCallbacks.forEach((cb) => cb(scale / 100));
    return scale / 100;
  }

  setGridSpacing(spacing) {
    this.staticGridSpacing = spacing;
    if (spacing) this.gridSpacingChangedCallbacks.forEach((cb) => cb(spacing));
    this.updateGrid();
    this.view.draw();
  }

  updateGrid() {
    this.gridX = [];
    this.gridY = [];
    const gridSpacing = this.calculateGridSpacing();
    const gCount = 100;
    for (let x = -gCount; x <= gCount; x++) {
      const start = { x: gridSpacing * x, y: -gCount * gridSpacing };
      const end = { x: gridSpacing * x, y: gCount * gridSpacing };
      this.gridX.push({ start, end });
    }
    for (let y = -gCount; y <= gCount; y++) {
      const start = { x: -gCount * gridSpacing, y: gridSpacing * y };
      const end = { x: gCount * gridSpacing, y: gridSpacing * y };
      this.gridY.push({ start, end });
    }
  }

  /** */
  cancelDraw() {
    const activeLayer = this.obstacleEditMode
      ? this.floorplan.obstacleLayer
      : this.floorplan.getActiveLayer();
    this.lastNode = null;
    activeLayer && activeLayer.reduceWalls();
    // this.setMode(floorplannerModes.MOVE);
  }

  getSnapByWalls = (pos) => {
    const activeLayer = this.obstacleEditMode
      ? this.floorplan.obstacleLayer
      : this.floorplan.getActiveLayer();
    const ratio = 1;
    const posX = pos ? pos.x : this.mouseX;
    const posY = pos ? pos.y : this.mouseY;
    let point = null;
    try {
      // get closest point from walls
      const walls = activeLayer.getWalls();
      const points = walls
        .map((wall) => wall.closestPoint(posX, posY))
        .sort((a, b) => a.distance - b.distance);
      point = points[0];
      if (point.distance >= snapTolerance * ratio) point = null;
      else point = point.point;
    } catch (_) {
      point = null;
    }
    return point;
  };

  getSnapByGrids = (pos) => {
    let point = null;
    const posX = pos ? pos.x : this.mouseX;
    const posY = pos ? pos.y : this.mouseY;
    // get closest point from grids
    try {
      const x = this.gridX
        .map((p) => p.start.x)
        .sort((a, b) => Math.abs(a - posX) - Math.abs(b - posX))[0];
      const y = this.gridY
        .map((p) => p.start.y)
        .sort((a, b) => Math.abs(a - posY) - Math.abs(b - posY))[0];

      const length = Math.abs((x - posX) ** 2 + (y - posY) ** 2);
      if (length < snapTolerance) {
        point = { x, y };
      }
    } catch (_) {
      point = null;
    }
    return point;
  };

  getSnapPoint = (snapWall = true, snapGrid = true, pos) => {
    if (!Core.Configuration.getBooleanValue(Core.configSnapMode)) return;
    pos = pos || { x: this.mouseX, y: this.mouseY };
    const pointByWalls = snapWall ? this.getSnapByWalls(pos) : null;
    const pointByGrids = snapGrid ? this.getSnapByGrids(pos) : null;

    const rawPoints = [];
    pointByWalls && rawPoints.push(pointByWalls);
    pointByGrids && rawPoints.push(pointByGrids);

    const points = rawPoints.sort((a, b) => {
      const distA = Math.sqrt((pos.x - a.x) ** 2 + (pos.y - a.y) ** 2);
      const distB = Math.sqrt((pos.x - b.x) ** 2 + (pos.y - b.y) ** 2);
      return distA - distB;
    });
    if (points.length) {
      return points[0];
    }
    return null;
  };

  /** */
  updateTarget() {
    if (this.mode === floorplannerModes.DRAW && this.lastNode) {
      let snapPoint = this.getSnapPoint();
      const distanceFromLastNode = Math.sqrt(
        (this.mouseX - this.lastNode.x) ** 2 +
          (this.mouseY - this.lastNode.y) ** 2,
      );
      if (distanceFromLastNode < snapTolerance) {
        this.targetX = this.lastNode.x;
        this.targetY = this.lastNode.y;
      } else {
        this.targetX = snapPoint ? snapPoint.x : this.mouseX;
        this.targetY = snapPoint ? snapPoint.y : this.mouseY;
      }
    } else {
      let snapPoint = this.getSnapPoint();
      this.targetX = snapPoint ? snapPoint.x : this.mouseX;
      this.targetY = snapPoint ? snapPoint.y : this.mouseY;
    }

    this.view.draw();
  }

  zoomIn() {
    let tmp = this.scale;
    tmp += zoomStep;
    this.scale = Math.min(1000, tmp);
    let value = (pixelsPerFoot * this.scale) / 100;
    this.cmPerPixel = cmPerFoot / value;
    this.pixelsPerCm = 1 / this.cmPerPixel;
    this.updateGrid();
    this.view.draw();
  }

  zoomOut() {
    let tmp = this.scale;
    tmp -= zoomStep;
    this.scale = Math.max(10, tmp);
    let value = (pixelsPerFoot * this.scale) / 100;
    this.cmPerPixel = cmPerFoot / value;
    this.pixelsPerCm = 1 / this.cmPerPixel;
    this.updateGrid();
    this.view.draw();
  }

  resetZoom() {
    this.scale = 50;
    let value = (pixelsPerFoot * this.scale) / 100;
    this.cmPerPixel = cmPerFoot / value;
    this.pixelsPerCm = 1 / this.cmPerPixel;
    this.updateGrid();
    this.view.draw();
  }

  mouseWheel(e) {
    let tmp = this.scale;
    if (e.deltaY > 0) {
      tmp -= zoomStep;
      this.scale = Math.max(10, tmp);
    } else {
      tmp += zoomStep;
      this.scale = Math.min(1000, tmp);
    }
    let value = (pixelsPerFoot * this.scale) / 100;
    this.cmPerPixel = cmPerFoot / value;
    this.pixelsPerCm = 1 / this.cmPerPixel;
    this.updateGrid();
    this.view.draw();
  }

  /** */
  mousedown(e) {
    this.mouseDown = true;
    this.mouseMoved = false;
    this.lastX = this.rawMouseX;
    this.lastY = this.rawMouseY;
    this.mouseButton = e.buttons;
    this.view.draw();
  }

  getCornerSnapPoint = (corner, x, y, referenceCorners = null) => {
    if (!corner) return null;
    const pointDefault = this.getSnapPoint(false, true, { x, y });
    const pointByAxis = corner.getSnapByAxis(snapTolerance, referenceCorners, {
      x,
      y,
    });
    const pointByAngles = corner.getSnapByAngles(2, x, y);

    const rawPoints = [];
    pointDefault && rawPoints.push(pointDefault);
    pointByAxis && rawPoints.push(pointByAxis);
    pointByAngles && rawPoints.push(pointByAngles);
    const points = rawPoints.sort((a, b) => {
      const dA = Math.sqrt((a.x - x) ** 2 + (a.y - y) ** 2);
      const dB = Math.sqrt((b.x - x) ** 2 + (b.y - y) ** 2);
      return dA - dB;
    });

    return points.length ? points[0] : null;
  };

  /** */
  mousemove(event) {
    this.mouseMoved = true;
    // update mouse
    this.rawMouseX = event.clientX;
    this.rawMouseY = event.clientY;

    this.mouseX =
      (event.clientX - this.canvasElement.getBoundingClientRect().left) *
        this.cmPerPixel +
      this.originX * this.cmPerPixel;
    this.mouseY =
      (event.clientY - this.canvasElement.getBoundingClientRect().top) *
        this.cmPerPixel +
      this.originY * this.cmPerPixel;
    this.mouseX /= this.zoomLevel;
    this.mouseY /= this.zoomLevel;

    const vector = new THREE.Vector2(this.mouseX, this.mouseY);
    // const orientation = -(this.orientation * Math.PI) / 180;
    const orientation = 0;
    vector.rotateAround(new THREE.Vector2(), orientation);
    this.mouseX = vector.x;
    this.mouseY = vector.y;

    // update target (snapped position of actual mouse)
    if (
      this.mode === floorplannerModes.DRAW ||
      (this.mode === floorplannerModes.MOVE && this.mouseDown)
    ) {
      this.updateTarget();
    }

    // update object target
    if (this.mode !== floorplannerModes.DRAW && !this.mouseDown) {
      const hoverCorner = this.floorplan.overlappedCorner(
        this.mouseX,
        this.mouseY,
        0,
        this.selectedWall,
      );
      const hoverWall = this.floorplan.overlappedWall(this.mouseX, this.mouseY);

      const hoverRoom = this.floorplan.overlappedRoom(this.mouseX, this.mouseY);

      let draw = false;
      if (hoverCorner !== this.activeCorner) {
        this.activeCorner = hoverCorner;
        draw = true;
      }
      if (hoverWall !== this.activeWall) {
        this.activeWall = hoverWall;
        draw = true;
      }
      if (hoverRoom !== this.activeRoom) {
        this.activeRoom = hoverRoom;
        draw = true;
      }
      draw && this.view.draw();
    }

    if (this.mouseDown && !this.activeCorner && !this.activeWall) {
      if (!event.ctrlKey) {
        // panning
        this.originX += this.lastX - this.rawMouseX;
        this.originY += this.lastY - this.rawMouseY;
      } else {
        // orientation
        let orientation =
          this.orientation + Math.round(this.lastX - this.rawMouseX);
        if (orientation < 0) orientation += 360;
        orientation %= 360;
        this.setOrientation(orientation);
      }
      this.lastX = this.rawMouseX;
      this.lastY = this.rawMouseY;
      this.view.draw();
    }

    // dragging
    if (this.mode === floorplannerModes.MOVE && this.mouseDown) {
      if (this.activeCorner) {
        if (this.selectedWall) {
          // auto split feature
          const walls = [
            ...this.activeCorner.wallStarts,
            ...this.activeCorner.wallEnds,
          ];
          if (walls.length > 1 && walls.includes(this.selectedWall)) {
            this.activeCorner = this.selectedWall.detachCorner(
              this.activeCorner,
            );
          }
        }
        const point = this.getCornerSnapPoint(
          this.activeCorner,
          this.mouseX,
          this.mouseY,
        );
        this.activeCorner.move(
          point ? point.x : this.mouseX,
          point ? point.y : this.mouseY,
          Core.Configuration.getBooleanValue(Core.configSnapMode),
          false,
        );
        this.isDragging = true;
      } else if (this.activeWall) {
        let dx =
          ((this.rawMouseX - this.lastX) * this.cmPerPixel) / this.zoomLevel;
        let dy =
          ((this.rawMouseY - this.lastY) * this.cmPerPixel) / this.zoomLevel;

        if (this.wallMoveDirection.x === 0 && this.wallMoveDirection.y === 0) {
          if (Math.abs(dx) > Math.abs(dy)) {
            this.wallMoveDirection.x = 1;
          } else {
            this.wallMoveDirection.y = 1;
          }
        }
        dx *= this.wallMoveDirection.x;
        dy *= this.wallMoveDirection.y;

        this.activeWall.relativeMove(dx, dy, true, false);
        // this.activeWall.snapToAxis(snapTolerance);
        this.isDragging = true;
      }
      this.view.draw();
    }
    this.lastX = this.rawMouseX;
    this.lastY = this.rawMouseY;
  }

  /** */
  mouseup(event) {
    this.mouseDown = false;
    const activeLayer = this.obstacleEditMode
      ? this.floorplan.obstacleLayer
      : this.floorplan.getActiveLayer();
    if (!activeLayer) return;

    // drawing
    if (this.mode === floorplannerModes.DRAW && !this.mouseMoved) {
      if (this.mouseButton === 1) {
        const corner = activeLayer.newCorner(this.targetX, this.targetY);
        if (this.lastNode != null) {
          activeLayer.newWall(this.lastNode, corner, activeLayer.height, true);
        }
        if (corner.mergeWithIntersected() && this.lastNode != null) {
          // this.setMode(floorplannerModes.MOVE);
        }
        this.lastNode = corner;
      } else {
        this.cancelDraw();
      }
      this.floorplan.update(false);
    }
    // dragging
    if (this.isDragging) {
      this.activeCorner && this.activeCorner.mergeWithIntersected();
      activeLayer.reduceWalls();
      this.floorplan.update(false);
      this.isDragging = false;
    }

    // delete
    if (this.mode === floorplannerModes.DELETE) {
      if (this.activeCorner) {
        this.activeCorner.removeAll();
        this.activeCorner = null;
      } else if (this.activeWall) {
        this.activeWall.remove();
        this.activeWall = null;
      }
      activeLayer.reduceWalls();
      this.floorplan.update(false);
    }

    if (!this.mouseMoved) {
      this.selectedCorner = this.activeCorner;
      this.selectedWall = this.activeWall;
      this.selectedRoom = this.activeRoom;
      if (this.selectedCorner) {
        this.cornerSelectedCallbacks.forEach((cb) => cb(this.selectedCorner));
      } else if (this.selectedWall) {
        this.wallSelectedCallbacks.forEach((cb) => cb(this.selectedWall));
      } else if (this.selectedRoom) {
        this.roomSelectedCallbacks.forEach((cb) => cb(this.selectedRoom));
      } else {
        this.nothingSelectedCallbacks.forEach((cb) => cb());
      }
    }
    this.wallMoveDirection = { x: 0, y: 0 };

    this.view.draw();
  }

  /** */
  mouseleave() {
    this.mouseDown = false;
    // scope.setMode(scope.modes.MOVE);
  }

  /** */
  reset() {
    this.resizeView();
    this.setMode(floorplannerModes.MOVE);
    this.resetOrigin();
    this.view.draw();
  }

  /** */
  resizeView() {
    this.view.handleWindowResize();
  }

  /** */
  setMode(mode) {
    this.lastNode = null;
    this.mode = mode;
    // this.modeResetCallbacks.fire(mode);
    this.modeResetCallbacks.forEach(
      (cb) => typeof cb === "function" && cb(mode),
    );
    this.selectedCorner = null;
    this.selectedWall = null;
    this.selectedRoom = null;
    this.updateTarget();
  }

  setOrientation(orientation) {
    this.orientation = orientation;
    this.floorplan.orientation = orientation;
    this.floorplan.update();
    this.view.draw();
    this.orientationChangedCallbacks.forEach((cb) => cb(this.orientation));
  }

  update(addToUndoStack = false) {
    addToUndoStack && this.floorplan.update(false);
    this.view.draw();
  }

  /** Sets the origin so that floorplan is centered */
  resetOrigin() {
    // console.log("reset origin");
    const parent = this.canvasElement.parentNode;
    const height = parent.clientHeight;
    const width = parent.clientWidth;

    const centerX = width / 2;
    const centerY = height / 2;
    const centerFloorplan = this.floorplan.getCenter();

    this.originX =
      centerFloorplan.x * this.zoomLevel * this.pixelsPerCm - centerX;
    this.originY =
      centerFloorplan.z * this.zoomLevel * this.pixelsPerCm - centerY;
  }

  /** Convert from THREEjs coords to canvas coords. */
  convertX(x, y = 0) {
    // const orientation = (this.orientation * Math.PI) / 180;
    const orientation = 0;
    const vector = new THREE.Vector2(x, y);
    vector.rotateAround(new THREE.Vector2(), orientation);
    let newX =
      (vector.x * this.zoomLevel - this.originX * this.cmPerPixel) *
      this.pixelsPerCm;
    return newX;
  }

  /** Convert from THREEjs coords to canvas coords. */
  convertY(y, x = 0) {
    // const orientation = (this.orientation * Math.PI) / 180;
    const orientation = 0;
    const vector = new THREE.Vector2(x, y);
    vector.rotateAround(new THREE.Vector2(), orientation);
    let newY =
      (vector.y * this.zoomLevel - this.originY * this.cmPerPixel) *
      this.pixelsPerCm;
    return newY;
  }
}
