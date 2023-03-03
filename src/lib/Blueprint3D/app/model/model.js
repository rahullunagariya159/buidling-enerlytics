import * as THREE from "three";
import Core from "../core";
import Floorplan from "./floorplan";
import Scene from "./scene";

const UndoRedoStack = window.UndoRedoStack || (() => { });

export default class Model {
  /** */
  floorplan;

  /** */
  scene;

  /** */
  undoHistory = null;

  /** */
  roomLoadingCallbacks = [];

  /** */
  roomLoadedCallbacks = [];

  /** name */
  roomSavedCallbacks = [];

  /** success (bool), copy (bool) */
  roomDeletedCallbacks = [];

  /** Constructs a new model.
   * @param textureDir The directory containing the textures.
   */
  constructor(textureDir) {
    this.floorplan = new Floorplan();
    this.scene = new Scene(this, textureDir);
    this.floorplan.scene = this.scene;

    this.undoHistory = UndoRedoStack();

    document.addEventListener("keypress", (e) => {
      e.keyCode === 26 && e.ctrlKey && this.undo();
    });

    document.addEventListener(Core.BP3D_EVENT_ADD_TO_UNDO_STACK, () => {
      this.addToUndoStack();
    });
  }

  loadSerialized = async (json, resetCamera = true, addToUndoStack = true) => {
    this.roomLoadingCallbacks.forEach((cb) => cb());

    const data = JSON.parse(json);
    // console.log('Loaded_data', data);
    await this.initializeFloorPlans(data, resetCamera, addToUndoStack);

    this.roomLoadedCallbacks.forEach((cb) => cb());
  };

  exportSerialized = () => JSON.stringify(this.floorplan.saveFloorplan());

  collectMetadata = () => {
    const { floorplan } = this;
    const { orientation } = floorplan;
    const res = {
      RoomName: [],
      RoomHeight: [],
      RoomVolume: [],
      UsableFloorArea: [],
      RoomCentroid: [],
      TotalFloorArea: [],
      FloorOutside: [],
      RoomAboveGround: [],
      WallArea: [],
      WallOutside: [],
      WallConduction: [],
      WallDirection: [],
      WallInclination: [],
      WallCentroid: [],
      WindowShare: [],
      WindowHeight: [],
      WindowSillHeight: [],
      ShadingObject: [],
    };

    const layers = [...floorplan.layers, floorplan.roofLayer];
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      if (!layer) continue;
      const data = layer.getLayerMetadata(orientation);
      res.RoomName.push(...data.RoomName);
      res.RoomHeight.push(...data.RoomHeight);
      res.RoomVolume.push(...data.RoomVolume);
      res.WallArea.push(...data.WallArea);
      res.WallOutside.push(...data.WallOutside);
      res.WallConduction.push(...data.WallConduction);
      res.WallDirection.push(...data.WallDirection);
      res.WallInclination.push(...data.WallInclination);
      res.WallCentroid.push(...data.WallCentroid);
      res.WindowShare.push(...data.WindowShare);
      res.WindowHeight.push(...data.WindowHeight);
      res.WindowSillHeight.push(...data.WindowSillHeight);
      res.UsableFloorArea.push(...data.UsableFloorArea);
      res.RoomCentroid.push(...data.RoomCentroid);
      res.TotalFloorArea.push(...data.TotalFloorArea);
      res.FloorOutside.push(...data.FloorOutside);
      res.RoomAboveGround.push(...data.RoomAboveGround);
    }

    res.ShadingObject = floorplan.obstacleLayer.getLayerMetadata();

    return res;
  };

  undo = () => {
    if (!this.undoHistory) return;
    this.undoHistory.undo();
    const plan = this.undoHistory.latest();
    if (plan) this.loadSerialized(plan, false, false);
  };

  redo = () => {
    if (!this.undoHistory) return;
    this.undoHistory.redo();
    const plan = this.undoHistory.latest();
    if (plan) this.loadSerialized(plan, false, false);
  };

  addToUndoStack = () => {
    if (!this.undoHistory) return;
    const plan = this.exportSerialized();
    const latest = this.undoHistory.latest();

    // console.log("add to stack");
    if (plan.localeCompare(latest) !== 0) {
      this.undoHistory.push(plan);
      // console.log("undo history", this.undoHistory.getValues().undo.length);
    }
  };

  initializeFloorPlans = async (
    data,
    resetCamera = true,
    addToUndoStack = false
  ) => {
    this.scene.clearItems();
    this.floorplan.loadFloorplan(data, resetCamera, addToUndoStack);

    const metadataList = [];
    const items = [];
    for (const item of data.items) {
      const { metadata } = item;
      let index = -1;

      // check duplicated
      for (let i in metadataList) {
        i -= 0;
        if (JSON.stringify(metadataList[i]).localeCompare(JSON.stringify(metadata)) === 0) {
          index = i;
          break;
        }
      }

      const position = new THREE.Vector3(item.xpos, item.ypos, item.zpos);
      if (index >= 0) {
        const model = await this.scene.cloneItem(items[index]);
        const { morph } = item.options;
        model.setPosition(position);
        for (const index in morph) {
          model.setMorph(parseInt(index), morph[index]);
        }
      } else {
        const model = await this.scene.addItem(
          item.item_type,
          item.model_url,
          metadata,
          position,
          item.rotation,
          item.options
        );
        metadataList.push(metadata);
        items.push(model);
      }
    }
  };
}
