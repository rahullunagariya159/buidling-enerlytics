import * as THREE from "three";
import Core from "../core";

import DimensionHelper from "./dimensionHelper";

import {
  getBounding,
  getRealMorphValue,
  IgnorableMeshNames,
  colorPresets,
  strVerticalBlockExtended,
  strHorizontalBlockExtended,
} from "./utils";

import * as Utils from "./utils";

export const MORPH_ALIGN_CENTER = 0;
export const MORPH_ALIGN_RIGHT = 1;
export const MORPH_ALIGN_RIGHT_BACK = 2;
export const MORPH_ALIGN_BACK = 3;
export const MORPH_ALIGN_LEFT_BACK = 4;
export const MORPH_ALIGN_LEFT = 5;
export const MORPH_ALIGN_LEFT_FRONT = 6;
export const MORPH_ALIGN_FRONT = 7;
export const MORPH_ALIGN_RIGHT_FRONT = 8;

export default class Item extends THREE.Mesh {
  cloneData = {};
  scene;
  errorGlow = new THREE.Mesh();
  hover = false;
  selected = false;
  highlighted = false;
  error = false;
  resizable = true;
  fixed = false;

  stackable = false;
  stackontop = false;
  overlappable = false;

  allowRotate = true;
  obstructFloorMoves = true;

  /** */
  emissiveColor = 0x222222;
  errorColor = 0xff0000;

  /** */
  position_set;

  flippable = false;
  flipped = false;

  /** dragging */
  dragOffset = new THREE.Vector3();

  /** */
  halfSize;

  childMeshes = [];

  morphAlign = MORPH_ALIGN_CENTER;

  hullPointsCollection = [];
  boundingGizmo = null;

  // cache to enhance performance of calculate bounding & hull
  prevPosition = { x: null, y: null, z: null };
  prevRotation = null;
  prevMorph = {};

  /** Constructs an item.
   * @param model TODO
   * @param metadata TODO
   * @param meshList TODO
   * @param position TODO
   * @param rotation TODO
   * @param scale TODO
   */
  constructor(model, metadata, meshList, position, rotation, options) {
    super();
    this.model = model;
    this.scene = this.model.scene;
    this.metadata = metadata;
    this.cloneData = {
      metadata,
      meshList,
      position,
      rotation,
      options,
    };

    Array.isArray(meshList) &&
      meshList.forEach((item) => {
        this.add(item);
      });

    this.centerOffset = new THREE.Vector3();

    // modifications
    this.morph = {};
    this.textures = {};
    this.styles = {};
    this.blockCount = 1;

    this.errorColor = 0xff0000;

    this.resizable = metadata.resizable;

    this.castShadow = true;
    this.receiveShadow = false;

    this.calculatedPosition = new THREE.Vector3();
  }

  /** */
  initObject = function (meshList, position, rotation, options) {
    this.halfSize = this.objectHalfSize();
    this.prepareMeshes(meshList);
    this.configDimensionLabels();

    // load stored configuration
    if (position) {
      this.setPosition(position);
      this.position_set = true;
    } else {
      this.position.set(0, 0, 0);
      this.position_set = false;
    }

    this.dimensionHelper.position.copy(this.position);

    if (rotation) {
      this.rotation.y = rotation;
      this.dimensionHelper.rotation.y = rotation;
    }

    this.castShadow = true;
    this.receiveShadow = true;

    this.setOptions(options);
    this.placeInRoom();
  };

  getOptions = () => {
    return {
      morph: this.morph,
      textures: this.textures,
      styles: this.styles,
      fixed: this.fixed,
      stackable: this.stackable,
      stackontop: this.stackontop,
      overlappable: this.overlappable,
      calculatedPosition: {
        x: this.calculatedPosition.x,
        y: this.calculatedPosition.y,
        z: this.calculatedPosition.z,
      },
    };
  };

  setOptions = (options) => {
    if (options) {
      // console.log(options);
      options.hasOwnProperty("fixed") && (this.fixed = options.fixed);
      options.hasOwnProperty("stackable") &&
        (this.stackable = options.stackable);
      options.hasOwnProperty("stackontop") &&
        (this.stackontop = options.stackontop);
      options.hasOwnProperty("overlappable") &&
        (this.overlappable = options.overlappable);

      // load morph
      if (options.morph) {
        for (var i in options.morph) {
          this.setMorph(i, options.morph[i]);
        }
      }
      if (options.textures) {
        for (i in options.textures)
          this.updateMaterial(
            i,
            options.textures[i].material,
            options.textures[i].size
          );
      }
      if (options.styles) {
        for (i in options.styles) this.updateStyle(i, options.styles[i]);
      }
      if (options.calculatedPosition) {
        for (const axis in options.calculatedPosition)
          this.calculatedPosition[axis] = options.calculatedPosition[axis];
      }
    }
  };

  prepareMeshes(meshList) {
    if (!Array.isArray(meshList)) return;
    for (const mesh of meshList) {
      try {
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const prevMat = mesh.material;
        mesh.material = new THREE.MeshPhongMaterial();
        THREE.MeshStandardMaterial.prototype.copy.call(mesh.material, prevMat);

        const bufferGeoBackup = new THREE.BufferGeometry().copy(mesh.geometry);
        mesh.geometryBackup = bufferGeoBackup;

        // pre-process
        (() => {
          // opacity
          const minStrRegex = /\(opacity(\d+)\)/g;
          const matches = minStrRegex.exec(mesh.name);
          if (matches && matches[1]) {
            const value = parseInt(matches[1]);
            mesh.material.transparent = true;
            mesh.material.opacity = value / 100;
          }
        })();

        // handle
        (() => {
          if (mesh.name.includes("handle")) {
            for (var preset in colorPresets) {
              if (mesh.name.includes(preset)) {
                const material = mesh.material.clone();
                mesh.material = material;
                mesh.material.color.setHex(colorPresets[preset]);
              }
            }
          }
        })();

        // lock
        (() => {
          if (mesh.name.includes("lock") && !mesh.name.includes("block")) {
            const material = mesh.material.clone();
            mesh.material = material;
            mesh.material.color.setHex(0x121212);
          }
        })();
      } catch (_) {
        console.log(_);
      }
    }
  }

  getCollidableMeshList = () => {
    let meshes = [];
    for (var mesh of this.children) {
      let skippable = false;
      for (const str of IgnorableMeshNames) {
        if (mesh.name.toLowerCase().includes(str)) skippable = true;
      }
      if (!skippable) meshes.push(mesh);
    }
    return meshes;
  };

  /**
   * Config dimension labels
   */
  configDimensionLabels() {
    this.dimensionHelper = new DimensionHelper(this.model, this);
    // this.dimensionHelper.visible = false;
    this.scene.add(this.dimensionHelper);
  }

  showDimensionHelper() {
    this.dimensionHelper.visible = true;
  }

  hideDimensionHelper() {
    this.dimensionHelper.visible = false;
  }

  /**
   * calculate bounding data according to morphing
   */
  getBounding(force = false, mesh = this, meshList = []) {
    try {
      const newPosition = {
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z,
      };
      const newRotation = mesh.rotation.y;
      const newMorph = JSON.parse(JSON.stringify(this.morph));
      if (
        force ||
        JSON.stringify(newPosition) !== JSON.stringify(this.prevPosition) ||
        JSON.stringify(newMorph) !== JSON.stringify(this.morph) ||
        newRotation !== this.prevRotation
      ) {
        this.boundingGizmo = getBounding(mesh, meshList);

        this.prevPosition = newPosition;
        this.prevRotation = newRotation;
        this.prevMorph = newMorph;
      }
      return this.boundingGizmo;
    } catch (_) {
      return null;
    }
  }

  /** */
  remove() {
    for (var mesh of this.childMeshes) {
      this.scene.remove(mesh);
    }
    this.scene.remove(this.dimensionHelper);
    this.scene.removeItem(this);
  }

  /** */
  resize(height, width, depth) {}

  getMorph(index) {
    return this.morph[index] ? this.morph[index] : 0;
  }

  setMorph(index, value) {
    this.morph[index] = value;
    try {
      let prevBoundingBox = getBounding(this);
      prevBoundingBox = prevBoundingBox.max.sub(prevBoundingBox.min);
      for (const child of this.children) {
        try {
          if (
            Array.isArray(child.morphTargetInfluences) &&
            child.morphTargetInfluences.length > index
          ) {
            child.morphTargetInfluences[index] = getRealMorphValue(
              child,
              index,
              value
            );
          }
        } catch (_) {
          console.log(_);
        }
      }

      for (const child of this.childMeshes) {
        try {
          if (
            Array.isArray(child.morphTargetInfluences) &&
            child.morphTargetInfluences.length > index
          ) {
            child.morphTargetInfluences[index] = getRealMorphValue(
              child,
              index,
              value
            );
          }
        } catch (_) {
          console.log(_);
        }
      }

      this.updateUV();
      this.halfSize = this.objectHalfSize();
      this.dimensionHelper.update();

      // update centeroffset
      const bbox = getBounding(this);
      const center = new THREE.Vector3(
        (bbox.min.x + bbox.max.x) / 2,
        0,
        (bbox.min.z + bbox.max.z) / 2
      );
      this.centerOffset = center.sub(this.position);
      this.centerOffset.y = 0;

      if (parseInt(index, 10) === parseInt(this.metadata.blockMorphIndex, 10)) {
        this.updateBlocksByHeight(((5 + (300 - 5) * value) * 2.54) / 100);
      }

      if (
        parseInt(index, 10) ===
        parseInt(this.metadata.horizontalBlockMorphIndex, 10)
      ) {
        this.updateBlocksByWidth(((5 + (300 - 5) * value) * 2.54) / 100);
      }
      let currentBoundingBox = getBounding(this);
      currentBoundingBox = currentBoundingBox.max.sub(currentBoundingBox.min);
      this.morphAlignModel(
        index,
        prevBoundingBox,
        currentBoundingBox,
        this.morphAlign
      );

      this.resized();
      this.changed();
    } catch (_) {
      console.log(_);
    }
  }

  morphAlignModel(index, prev, current, align = this.morphAlign) {
    const offsetVector = new THREE.Vector3().copy(current).sub(prev);
    let position = new THREE.Vector3().copy(this.position);
    let alignVector = new THREE.Vector3();

    index = parseInt(index, 10);
    if (index === 0) return;
    else if (index === 1 && offsetVector.x !== 0) {
      if (
        align === MORPH_ALIGN_LEFT ||
        align === MORPH_ALIGN_LEFT_BACK ||
        align === MORPH_ALIGN_LEFT_FRONT
      ) {
        alignVector.x = offsetVector.x / 2;
      } else if (
        align === MORPH_ALIGN_RIGHT ||
        align === MORPH_ALIGN_RIGHT_BACK ||
        align === MORPH_ALIGN_RIGHT_FRONT
      ) {
        alignVector.x = -offsetVector.x / 2;
      }
    } else if (index === 2 && offsetVector.z !== 0) {
      if (
        align === MORPH_ALIGN_BACK ||
        align === MORPH_ALIGN_LEFT_BACK ||
        align === MORPH_ALIGN_RIGHT_BACK
      ) {
        alignVector.z = offsetVector.z / 2;
      } else if (
        align === MORPH_ALIGN_FRONT ||
        align === MORPH_ALIGN_LEFT_FRONT ||
        align === MORPH_ALIGN_RIGHT_FRONT
      ) {
        alignVector.z = -offsetVector.z / 2;
      }
    }

    const transform = new THREE.Matrix4();
    transform.makeRotationY(this.rotation.y);
    alignVector.applyMatrix4(transform);

    position = position.add(alignVector);
    this.position.copy(position);
    this.dimensionHelper.position.copy(position);
    this.moveChildMeshes();
  }

  /**
   * update uv according to morph target uv data
   */
  updateUV() {
    try {
      const { morphUVs } = this.metadata;
      if (!Array.isArray(this.metadata.morphUVs)) return;

      Utils.updateUV(this.morph, this.children, morphUVs);
    } catch (_) {
      console.log("failed updating uv", _);
    }
  }

  /** */
  setScale(x, y, z) {}

  /** */
  setFixed(fixed) {
    this.fixed = fixed;
  }

  setStackable = (stackable) => (this.stackable = stackable);

  setOverlappable = (overlappable) => (this.overlappable = overlappable);

  setMorphAlign = (align) => (this.morphAlign = align);

  flipHorizontal = () => {};

  changed = () => {
    this.calculateHullPointsCollection();
  };
  /** Subclass can define to take action after a resize. */
  resized() {}

  /** */
  getHeight = () => this.halfSize.y * 2;

  /** */
  getWidth = () => this.halfSize.x * 2;

  /** */
  getDepth = () => this.halfSize.z * 2;

  /** */
  placeInRoom() {
    if (!this.position_set) {
      // let center;
      // try {
      //   center = this.model.floorplan.getCenter();
      // } catch (_) {
      //   center = new THREE.Vector3();
      // }
      // this.position.x = center.x;
      // this.position.z = center.z;
      // this.position.y = 0;
      // if (this.metadata.defaultHeightFromFloor) {
      //   this.position.y = (this.metadata.defaultHeightFromFloor * 2.54) / 100;
      // }
      // this.dimensionHelper.update();
      // // this.changed();
    }
  }

  /** */
  removed() {}

  /** on is a bool */
  updateHighlight() {
    const on = this.hover || this.selected;
    const meshes = [];
    const childMeshes = [];
    childMeshes.push(...this.childMeshes);

    childMeshes.forEach((item) => {
      let skippable = false;
      IgnorableMeshNames.forEach((str) => {
        if (item.name.toLowerCase().includes(str)) skippable = true;
      });
      if (!skippable) meshes.push(item);
    });

    if (on)
      document.dispatchEvent(
        new CustomEvent(Core.BP3D_EVENT_HIGHLIGHT_CHANGED, {
          detail: {
            objects: meshes,
          },
        })
      );
    else
      document.dispatchEvent(
        new CustomEvent(Core.BP3D_EVENT_HIGHLIGHT_CHANGED, {
          detail: {
            objects: [],
          },
        })
      );
  }

  /** */
  mouseOver() {
    this.hover = true;
    this.updateHighlight();
  }

  /** */
  mouseOff() {
    this.hover = false;
    this.updateHighlight();
  }

  /** */
  setSelected() {
    this.selected = true;
    this.updateHighlight();
  }

  /** */
  setUnselected() {
    this.selected = false;
    this.updateHighlight();
  }

  /** intersection has attributes point (vec3) and object (THREE.Mesh) */
  clickPressed(intersection) {
    this.dragOffset.copy(intersection.point).sub(this.position);
  }

  /** */
  clickDragged(intersection) {
    if (intersection) {
      this.moveToPosition(intersection.point, intersection);
    }
  }

  rotateChildMeshes() {
    // let quat = new THREE.Quaternion();
    // this.getWorldQuaternion(quat);
    // const rotation = new THREE.Euler().setFromQuaternion(quat);
    for (var i in this.childMeshes) {
      // const child = this.children[i];
      // let quat = new THREE.Quaternion();
      // child.getWorldQuaternion(quat);
      // const rotation = new THREE.Euler().setFromQuaternion(quat);
      // this.childMeshes[i].rotation.copy(rotation);
      this.childMeshes[i].rotation.y = this.rotation.y;
    }
  }

  /** */
  rotate(intersection, angle) {
    if (intersection) {
      const center = this.position;
      const prevAngle = this.rotation.y;
      if (isNaN(angle)) {
        angle = Core.Utils.angle(
          0,
          1,
          intersection.point.x - center.x,
          intersection.point.z - center.z
        );
      }

      const snapTolerance = Math.PI / 16;

      // snap to intervals near Math.PI/2
      for (let i = -4; i <= 4; i++) {
        if (Math.abs(angle - i * (Math.PI / 2)) < snapTolerance) {
          angle = i * (Math.PI / 2);
          break;
        }
      }

      const dAngle = angle - prevAngle;

      this.rotation.y = angle;
      this.dimensionHelper.setRotation(angle);

      const transform = new THREE.Matrix4();
      transform.makeRotationY(dAngle);

      const direction = new THREE.Vector3().copy(this.position).sub(center);
      let offset = new THREE.Vector3().copy(direction);
      direction.applyMatrix4(transform);
      offset = direction.sub(offset);
      this.relativeMove(offset.x, offset.z);

      this.changed();

      this.groupParent && this.groupParent.isSet && this.groupParent.update();
    }
  }

  rotateByAngle(angle) {
    this.rotation.y = angle;

    this.dimensionHelper.setRotation(angle);
  }

  setRotationY = (y) => {
    this.rotateByAngle(y);
    this.changed();
  };

  /** */
  moveChildMeshes() {
    for (var i in this.childMeshes) {
      let target = new THREE.Vector3();
      this.children[i].getWorldPosition(target);
      this.childMeshes[i].position.copy(target);
    }
  }

  /** */
  moveToPosition(vec3, intersection) {
    if (isNaN(vec3.x) || isNaN(vec3.y) || isNaN(vec3.z)) {
      console.log("nan detected");
      return;
    }
    this.setPosition(vec3);
    this.changed();
  }

  setPosition = (vec3) => {
    this.position.copy(vec3);
    this.dimensionHelper.position.copy(vec3);

    this.changed();
  };

  /**
   *
   */
  relativeMove(dx, dz) {
    if (this.fixed) return;
    let position = new THREE.Vector3().copy(this.position);
    position.x += dx;
    position.z += dz;

    this.position.copy(position);
    this.dimensionHelper.position.copy(position);
  }

  /** */
  clickReleased() {
    if (this.error) {
      this.hideError();
    }
  }

  /**
   * Returns an array of planes to use other than the ground plane
   * for passing intersection to clickPressed and clickDragged
   */
  customIntersectionPlanes() {
    return [];
  }

  /**
   * returns the 2d corners of the bounding polygon
   *
   * offset is Vector3 (used for getting corners of object at a new position)
   *
   * TODO: handle rotated objects better!
   */
  getCorners(xDim, yDim, position) {
    position = position || this.position;

    const halfSize = this.halfSize.clone();

    const c1 = new THREE.Vector3(-halfSize.x, 0, -halfSize.z);
    const c2 = new THREE.Vector3(halfSize.x, 0, -halfSize.z);
    const c3 = new THREE.Vector3(halfSize.x, 0, halfSize.z);
    const c4 = new THREE.Vector3(-halfSize.x, 0, halfSize.z);

    const transform = new THREE.Matrix4();
    // console.log(this.rotation.y);
    transform.makeRotationY(this.rotation.y); //  + Math.PI/2)

    c1.applyMatrix4(transform);
    c2.applyMatrix4(transform);
    c3.applyMatrix4(transform);
    c4.applyMatrix4(transform);

    c1.add(position);
    c2.add(position);
    c3.add(position);
    c4.add(position);

    const offset = this.centerOffset.clone();
    offset.applyMatrix4(transform);
    c1.add(offset);
    c2.add(offset);
    c3.add(offset);
    c4.add(offset);

    const corners = [
      { x: c1.x, y: c1.z },
      { x: c2.x, y: c2.z },
      { x: c3.x, y: c3.z },
      { x: c4.x, y: c4.z },
    ];

    return corners;
  }

  /**
   * @param {boolean} serialize
   */
  getSnapPoints = (serialize = false) => {
    if (serialize) {
      let res = [];
      this.hullPointsCollection.forEach(
        (points) => (res = [...res, ...points])
      );
      return res;
    }
    return this.hullPointsCollection;
  };

  /**
   * get special points of model
   * @param {THREE.Mesh} mesh
   * @param {boolean} serialize serialize multiple meshes
   * @returns {Array}
   */
  calculateHullPointsCollection(mesh = this, serialize = false) {
    this.hullPointsCollection = Utils.getSnapPoints(mesh, serialize);
  }

  /** */
  isValidPosition(vec3) {}

  /** */
  showError(vec3) {
    vec3 = vec3 || this.position;
    if (!this.error) {
      this.error = true;
      this.errorGlow = this.createGlow(this.errorColor, 0.8, true);
      this.scene.add(this.errorGlow);
    }
    this.errorGlow.position.copy(vec3);
  }

  /** */
  hideError() {
    if (this.error) {
      this.error = false;
      this.scene.remove(this.errorGlow);
    }
  }

  /** */
  objectHalfSize() {
    const boundingBox = this.getBounding(true);
    return boundingBox.max.clone().sub(boundingBox.min).divideScalar(2);
  }

  /** */
  createGlow(color, opacity, ignoreDepth) {
    ignoreDepth = ignoreDepth || false;
    opacity = opacity || 0.2;
    const glowMaterial = new THREE.MeshBasicMaterial({
      color,
      blending: THREE.AdditiveBlending,
      opacity: 0.2,
      transparent: true,
      depthTest: !ignoreDepth,
    });

    const glow = new THREE.Mesh();
    for (const child of this.children) {
      const mesh = new THREE.Mesh().copy(child);
      mesh.geometry = new THREE.BufferGeometry().copy(child.geometry);
      mesh.material = new THREE.MeshBasicMaterial().copy(glowMaterial);
      glow.add(mesh);
    }

    glow.children.forEach((child) => {
      child.geometry.attributes.position.needsUpdate = true;
      const vector = child.geometry.attributes.position.array;

      try {
        if (this.morph) {
          for (const i in this.morph) {
            if (
              child.geometry.morphAttributes &&
              child.geometry.morphAttributes.position &&
              child.geometry.morphAttributes.position.length > i
            ) {
              const targetVector =
                child.geometry.morphAttributes.position[i].array;
              const morphValue = getRealMorphValue(child, i, this.morph[i]);
              for (let j = 0; j < vector.length; j++) {
                vector[j] += targetVector[j] * morphValue;
              }
            }
          }
        }
      } catch (_) {
        console.log(_);
      }
    });
    glow.material = glowMaterial;
    glow.position.copy(this.position);
    glow.rotation.copy(this.rotation);
    glow.scale.copy(this.scale);
    return glow;
  }

  /**
   * update material
   */
  updateMaterial = (target, material, size = { w: 0.5, h: 0.5 }, cb = null) => {
    this.textures[target] = {
      material,
      size,
    };
    this.traverse((obj) => {
      if (obj.name.toLowerCase().includes(target.toLowerCase())) {
        const mat = obj.material.clone();
        mat.color.setHex(material.color ? material.color : 0xffffff);
        mat.map = null;

        if (material.texture) {
          // let texture = THREE.ImageUtils.loadTexture(material.texture);
          const texture = new THREE.TextureLoader().load(material.texture);
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(1 / size.w, 1 / size.h);

          mat.map = texture;
          typeof cb === "function" && cb();
        }
        // obj.material.dispose();
        obj.material = mat;
      }
    });
  };

  /**
   * update style
   */
  updateStyle = (hide_name, show_name, cb) => {
    this.styles[hide_name] = show_name;

    this.traverse((obj) => {
      if (hide_name === "lock" && obj.name.includes("block")) return;
      try {
        hide_name.split(",").forEach((name) => {
          if (
            name.length &&
            obj.name.toLowerCase().includes(name.toLowerCase())
          )
            obj.visible = false;
        });
        show_name.split(",").forEach((name) => {
          if (
            name.length &&
            obj.name.toLowerCase().includes(name.toLowerCase())
          )
            obj.visible = true;
        });
      } catch (_) {
        console.log(_);
      }
    });
    typeof cb === "function" && cb();
  };

  /**
   * update blocks by height
   * @param {number} height product height by meter
   */
  updateBlocksByHeight = (height) => {
    let blockMesh = null;
    let blockTopMesh = null;

    const blockName = "(block)";
    for (var i = this.children.length - 1; i >= 0; i--) {
      const item = this.children[i];

      if (item.name.includes(blockName)) item.visible = true;
      if (item.name.includes(strVerticalBlockExtended)) {
        this.scene.remove(item);
        this.children.splice(i, 1);
      }
      if (
        item.name.includes(blockName) &&
        !item.name.includes(strVerticalBlockExtended)
      )
        blockMesh = item;
      if (item.name.includes("(block-top)")) blockTopMesh = item;
    }
    if (!blockMesh) return;
    let blockTopHeight = 0;
    if (blockTopMesh) {
      const blockTopBounding = getBounding(this, [blockTopMesh]);
      blockTopHeight = blockTopBounding.max.y - blockTopBounding.min.y;
    }

    let blockMeshes = [];
    blockMeshes.push(blockMesh);
    const blockBounding = getBounding(this, [blockMesh]);
    const blockHeight = blockBounding.max.y - blockBounding.min.y;
    let posY = blockMesh.position.y;

    const count =
      Math.floor((height - blockTopHeight - posY) / blockHeight) - 1;
    for (i = 0; i < count; i++) {
      const mesh = new THREE.Mesh().copy(blockMesh);
      mesh.geometryBackup = blockMesh.geometryBackup;
      mesh.name += `${strVerticalBlockExtended}${i}`;
      mesh.position.y = posY + blockHeight;
      this.add(mesh);
      posY = mesh.position.y;
      blockMeshes.push(mesh);
    }

    const lastMesh = blockMeshes[blockMeshes.length - 1];
    if (lastMesh.position.y > height - blockTopHeight - blockHeight * 2) {
      lastMesh.visible = false;
    }
  };

  /**
   * update blocks by width
   * @param {number} width product height by meter
   */
  updateBlocksByWidth = (width) => {
    // console.log('update horizontal blocks', width);
    const blockName = "(block-hor)";
    let blockMesh = null;
    for (var i = this.children.length - 1; i >= 0; i--) {
      const item = this.children[i];

      if (item.name.includes(blockName)) item.visible = true;
      if (item.name.includes(strHorizontalBlockExtended)) {
        this.scene.remove(item);
        this.children.splice(i, 1);
      }
      if (
        item.name.includes(blockName) &&
        !item.name.includes(strHorizontalBlockExtended)
      )
        blockMesh = item;
    }
    if (!blockMesh) return;

    let space = 0;
    let realSpace = 0;
    let count = 1;
    let marginLeft = 0;
    let marginRight = 0;

    // get space from mesh name
    const spaceStrRegex = /\(s(\d+,?\d+)\)/g;
    let matches = spaceStrRegex.exec(blockMesh.name);
    if (matches && matches[1]) {
      space = parseFloat(matches[1].replace(",", "."));
      space *= 2.54 / 100;
      count = Math.floor(width / space);
      realSpace = marginLeft = width / count;
    }

    // get left & right margin
    const horMarginStrRegex = /\(ml(\d+),mr(\d+)\)/g;
    matches = horMarginStrRegex.exec(blockMesh.name);
    if (matches && matches[1] && matches[2]) {
      marginLeft = (parseFloat(matches[1]) * 2.54) / 100;
      marginRight = (parseFloat(matches[2]) * 2.54) / 100;
    }

    // get space preset from mesh name
    const presetStrRegex = /\(a((?:\d+,)*\d+)\)/g;
    matches = presetStrRegex.exec(blockMesh.name);
    if (matches && matches[1]) {
      const presets = matches[1].split(",");
      for (i in presets) {
        i = parseInt(i);
        const division = (parseFloat(presets[i]) * 2.54) / 100;
        if (width < division && i === 0) {
          count = 0;
          break;
        }
        if (width >= division && i === presets.length - 1) {
          count = presets.length;
          break;
        }
        if (
          width >= division &&
          width < (parseFloat(presets[i - 0 + 1]) * 2.54) / 100
        ) {
          count = i + 1;
          break;
        }
      }
      space = realSpace = (width - marginLeft - marginRight) / count;
      count += 2;
    }

    if (space === 0 || count < 2) {
      blockMesh.visible = false;
      return;
    }

    blockMesh.visible = true;

    for (i = 0; i < count - 1; i++) {
      let mesh;
      if (i === 0) mesh = blockMesh;
      else {
        mesh = new THREE.Mesh().copy(blockMesh);
        mesh.geometryBackup = blockMesh.geometryBackup;
        mesh.name += `${strHorizontalBlockExtended}${i}`;
        this.add(mesh);
      }
      mesh.position.x = -width / 2 + marginLeft + i * realSpace;
    }

    // const lastMesh = blockMeshes[blockMeshes.length - 1];
    // if (this.getBounding(this, [lastMesh]).max.x > (this.getBounding(this).max.x - blockWidth * 2)) {
    //   lastMesh.visible = false;
    // }
  };
}
