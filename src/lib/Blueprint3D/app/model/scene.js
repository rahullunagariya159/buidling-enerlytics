import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Core from "../core";
import Items from "../items";

export default class Scene {
  /** The associated ThreeJS scene. */
  scene;

  /** */
  items = [];

  roofEdges = [];

  roofVertices = [];

  /** */
  needsUpdate = false;

  /** The Json loader. */
  loader;
  bgTexture;
  bgWidth;
  bgHeight;

  background = null;

  /** */
  itemLoadingCallbacks = [];
  itemLoadedCallbacks = [];
  itemRemovedCallbacks = [];

  /**
   * Constructs a scene.
   * @param model The associated model.
   * @param textureDir The directory from which to load the textures.
   */
  constructor(model, textureDir) {
    this.model = model;
    this.textureDir = textureDir;
    this.scene = new THREE.Scene();

    // var loader = new THREE.TextureLoader();
    // loader.setCrossOrigin("");
    // loader.load("https://raw.githubusercontent.com/Rabbid76/graphics-snippets/master/resource/texture/background.jpg", function (t) {
    // console.log('SCENE__', this.scene);  
    // if (this.scene) {
    //     this.scene.background = t;
    //   }
    // });

    this.GLTFLoader = new GLTFLoader();
    this.GLTFLoader.crossOrigin = "";
  }

  /** Adds a non-item, basically a mesh, to the scene.
   * @param mesh The mesh to be added.
   */
  add(mesh) {
    this.scene.add(mesh);
  }

  /** Removes a non-item, basically a mesh, from the scene.
   * @param mesh The mesh to be removed.
   */
  remove(mesh) {
    this.scene.remove(mesh);
    Core.Utils.removeValue(this.items, mesh);
  }

  /** Gets the scene.
   * @returns The scene.
   */
  getScene() {
    return this.scene;
  }

  /** Gets the items.
   * @returns The items.
   */
  getItems() {
    return this.items;
  }

  /** Gets the count of items.
   * @returns The count.
   */
  itemCount() {
    return this.items.length;
  }

  /** Removes all items. */
  clearItems() {
    // var items_copy = this.items;
    const scope = this;
    this.items.forEach((item) => {
      if (item.dimensionHelper) scope.remove(item.dimensionHelper);
      scope.removeItem(item, true);
    });
    this.items = [];
  }

  /**
   * Removes an item.
   * @param item The item to be removed.
   * @param dontRemove If not set, also remove the item from the items list.
   */
  removeItem(item, dontRemove) {
    dontRemove = dontRemove || false;
    // use this for item meshes
    // this.itemRemovedCallbacks.fire(item);
    this.itemRemovedCallbacks.forEach(
      (cb) => typeof cb === "function" && cb(item)
    );
    item.removed();
    this.scene.remove(item);
    if (!dontRemove) {
      Core.Utils.removeValue(this.items, item);
    }
  }

  async cloneItem(prevItem) {
    return new Promise((resolve) => {
      const scope = this;
      const { cloneData } = prevItem;
      if (!cloneData) return null;
      const { metadata, options, meshList, position, rotation } = cloneData;
      const { itemType } = metadata;
      const newMeshList = [];
      meshList.forEach((mesh) => {
        const newMesh = mesh.clone();
        const bufferGeoBackup = new THREE.BufferGeometry().copy(mesh.geometry);
        newMesh.geometryBackup = bufferGeoBackup;
        newMeshList.push(newMesh);
      });
      const item = new (Items.Factory.getClass(itemType))(
        scope.model,
        metadata,
        newMeshList,
        position,
        rotation,
        options
      );

      item.initObject(meshList, position, rotation, options);

      scope.items.push(item);
      scope.add(item);
      setTimeout(() => {
        resolve(item);
      }, 0);
    });
  }
  /**
   * Creates an item and adds it to the scene.
   * @param itemType The type of the item given by an enumerator.
   * @param fileName The name of the file to load.
   * @param metadata TODO
   * @param position The initial position.
   * @param rotation The initial rotation around the y axis.
   * @param options The initial options.
   */
  async addItem(
    itemType,
    fileName,
    metadata,
    position,
    rotation,
    options,
    autoSelect = true
  ) {
    return new Promise((resolve) => {
      itemType = itemType || 1;
      const scope = this;
      // this.itemLoadingCallbacks.fire();
      this.itemLoadingCallbacks.forEach(
        (cb) => typeof cb === "function" && cb()
      );
      this.GLTFLoader.load(
        fileName,
        (gltf) => {
          const meshList = [];

          const morphHeight = {};
          const morphWidth = {};
          const morphDepth = {};

          gltf.scene.traverse((node) => {
            if (node.isMesh) {
              if (!node.name.includes("morph-")) {
                meshList.push(node);
              }

              if (node.name.includes("morph-height")) {
                const name = node.name.replace("-morph-height", "");
                const tmp = [];
                node.geometry.attributes.uv.array.forEach((v) => tmp.push(v));
                morphHeight[name] = tmp;
              } else if (node.name.includes("morph-width")) {
                const name = node.name.replace("-morph-width", "");
                const tmp = [];
                node.geometry.attributes.uv.array.forEach((v) => tmp.push(v));
                morphWidth[name] = tmp;
              } else if (node.name.includes("morph-depth")) {
                const name = node.name.replace("-morph-depth", "");
                const tmp = [];
                node.geometry.attributes.uv.array.forEach((v) => tmp.push(v));
                morphDepth[name] = tmp;
              }
            }
          });
          const morphUVs = [morphHeight, morphWidth, morphDepth];
          const item = new (Items.Factory.getClass(itemType))(
            scope.model,
            { ...metadata, morphUVs },
            meshList,
            position,
            rotation,
            options
          );

          item.initObject(meshList, position, rotation, options);

          scope.items.push(item);
          scope.add(item);
          console.log(item);
          // scope.itemLoadedCallbacks.fire(item);
          autoSelect && scope.itemLoadedCallbacks.forEach((cb) => cb(item));
          resolve(item);
        },
        undefined,
        () => {
          resolve(null);
        }
      );
    });
  }
}
