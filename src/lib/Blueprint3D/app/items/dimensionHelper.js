import * as THREE from "three";
import Core from "../core";

export default class DimensionHelper extends THREE.Group {
  constructor(model, item) {
    super();
    // this.visible = false;
    this.scene = model.scene;
    this.item = item;

    this.frameMaterial = new THREE.MeshPhongMaterial({ color: 0xdddddd });

    this.offsetCenter = new THREE.Vector3();

    this.canvasDepth = document.createElement("canvas");
    this.canvasWidth = document.createElement("canvas");
    this.canvasHeight = document.createElement("canvas");

    this.sizeOrigin = JSON.parse(JSON.stringify(item.halfSize));

    this.configFrames();
    this.configLabels();
    this.drawLabels(this.item.halfSize);

    if (!Core.Configuration.getBooleanValue(Core.configDimensionVisible))
      this.visible = false;

    document.addEventListener(Core.BP3D_EVENT_CONFIG_CHANGED, (e) => {
      const { detail } = e;
      if (!detail) return;
      detail.dimUnit && this.update();
      if (detail.hasOwnProperty(Core.configDimensionVisible)) {
        if (detail[Core.configDimensionVisible]) {
          this.visible = true;
        } else {
          this.visible = false;
        }
      }
    });
  }

  update() {
    const size = this.item.halfSize;
    this.drawLabels(size);
    const bbox = this.item.getBounding();
    const center = new THREE.Vector3(
      (bbox.max.x + bbox.min.x) / 2,
      (bbox.max.y + bbox.min.y) / 2,
      (bbox.max.z + bbox.min.z) / 2
    );
    this.offsetCenter = center.sub(this.item.position);
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (i >= 0 && i < 4) {
        child.scale.z = size.z / this.sizeOrigin.z;
        i % 4 === 0 &&
          child.position.set(
            -size.x + this.offsetCenter.x,
            size.y + this.offsetCenter.y,
            this.offsetCenter.z
          );
        i % 4 === 1 &&
          child.position.set(
            size.x + this.offsetCenter.x,
            size.y + this.offsetCenter.y,
            this.offsetCenter.z
          );
        i % 4 === 2 &&
          child.position.set(
            size.x + this.offsetCenter.x,
            -size.y + this.offsetCenter.y,
            this.offsetCenter.z
          );
        i % 4 === 3 &&
          child.position.set(
            -size.x + this.offsetCenter.x,
            -size.y + this.offsetCenter.y,
            this.offsetCenter.z
          );
      } else if (i >= 4 && i < 8) {
        child.scale.x = size.x / this.sizeOrigin.x;
        i % 4 === 0 &&
          child.position.set(
            this.offsetCenter.x,
            -size.y + this.offsetCenter.y,
            size.z + this.offsetCenter.z
          );
        i % 4 === 1 &&
          child.position.set(
            this.offsetCenter.x,
            size.y + this.offsetCenter.y,
            size.z + this.offsetCenter.z
          );
        i % 4 === 2 &&
          child.position.set(
            this.offsetCenter.x,
            size.y + this.offsetCenter.y,
            -size.z + this.offsetCenter.z
          );
        i % 4 === 3 &&
          child.position.set(
            this.offsetCenter.x,
            -size.y + this.offsetCenter.y,
            -size.z + this.offsetCenter.z
          );
      } else if (i >= 8 && i < 12) {
        child.scale.y = size.y / this.sizeOrigin.y;

        i % 4 === 0 &&
          child.position.set(
            -size.x + this.offsetCenter.x,
            this.offsetCenter.y,
            size.z + this.offsetCenter.z
          );
        i % 4 === 1 &&
          child.position.set(
            size.x + this.offsetCenter.x,
            this.offsetCenter.y,
            size.z + this.offsetCenter.z
          );
        i % 4 === 2 &&
          child.position.set(
            size.x + this.offsetCenter.x,
            this.offsetCenter.y,
            -size.z + this.offsetCenter.z
          );
        i % 4 === 3 &&
          child.position.set(
            -size.x + this.offsetCenter.x,
            this.offsetCenter.y,
            -size.z + this.offsetCenter.z
          );
      } else if (i >= 12 && i < 16) {
        child.material.map.needsUpdate = true;
        i % 4 === 0 &&
          child.position.set(
            -size.x + this.offsetCenter.x,
            size.y + this.offsetCenter.y,
            this.offsetCenter.z
          );
        i % 4 === 1 &&
          child.position.set(
            size.x + this.offsetCenter.x,
            size.y + this.offsetCenter.y,
            this.offsetCenter.z
          );
        i % 4 === 2 &&
          child.position.set(
            size.x + this.offsetCenter.x,
            -size.y + this.offsetCenter.y,
            this.offsetCenter.z
          );
        i % 4 === 3 &&
          child.position.set(
            -size.x + this.offsetCenter.x,
            -size.y + this.offsetCenter.y,
            this.offsetCenter.z
          );
      } else if (i >= 16 && i < 20) {
        child.material.map.needsUpdate = true;
        i % 4 === 0 &&
          child.position.set(
            this.offsetCenter.x,
            size.y + this.offsetCenter.y,
            size.z + this.offsetCenter.z
          );
        i % 4 === 1 &&
          child.position.set(
            this.offsetCenter.x,
            -size.y + this.offsetCenter.y,
            size.z + this.offsetCenter.z
          );
        i % 4 === 2 &&
          child.position.set(
            this.offsetCenter.x,
            size.y + this.offsetCenter.y,
            -size.z + this.offsetCenter.z
          );
        i % 4 === 3 &&
          child.position.set(
            this.offsetCenter.x,
            -size.y + this.offsetCenter.y,
            -size.z + this.offsetCenter.z
          );
      } else if (i >= 20 && i < 24) {
        child.material.map.needsUpdate = true;
        i % 4 === 0 &&
          child.position.set(
            -size.x + this.offsetCenter.x,
            this.offsetCenter.y,
            size.z + this.offsetCenter.z
          );
        i % 4 === 1 &&
          child.position.set(
            size.x + this.offsetCenter.x,
            this.offsetCenter.y,
            size.z + this.offsetCenter.z
          );
        i % 4 === 2 &&
          child.position.set(
            size.x + this.offsetCenter.x,
            this.offsetCenter.y,
            -size.z + this.offsetCenter.z
          );
        i % 4 === 3 &&
          child.position.set(
            -size.x + this.offsetCenter.x,
            this.offsetCenter.y,
            -size.z + this.offsetCenter.z
          );
      }
    }
  }

  configFrames() {
    const size = this.item.halfSize;
    const thickness = 0.002;
    const d = new THREE.BoxGeometry(thickness, thickness, size.z * 2);
    const d1 = new THREE.Mesh(d, this.frameMaterial);
    const d2 = new THREE.Mesh().copy(d1);
    const d3 = new THREE.Mesh().copy(d1);
    const d4 = new THREE.Mesh().copy(d1);
    d1.position.set(-size.x, size.y, 0);
    d2.position.set(size.x, size.y, 0);
    d3.position.set(size.x, -size.y, 0);
    d4.position.set(-size.x, -size.y, 0);

    d1.name = "top-left";
    d2.name = "top-right";
    d3.name = "bottom-right";
    d4.name = "bottom-left";

    this.add(d1);
    this.add(d2);
    this.add(d3);
    this.add(d4);

    const w = new THREE.BoxGeometry(size.x * 2, thickness, thickness);
    const w1 = new THREE.Mesh(w, this.frameMaterial);
    const w2 = new THREE.Mesh().copy(w1);
    const w3 = new THREE.Mesh().copy(w1);
    const w4 = new THREE.Mesh().copy(w1);
    w1.position.set(0, -size.y, size.z);
    w2.position.set(0, size.y, size.z);
    w3.position.set(0, size.y, -size.z);
    w4.position.set(0, -size.y, -size.z);

    this.add(w1);
    this.add(w2);
    this.add(w3);
    this.add(w4);

    const h = new THREE.BoxGeometry(thickness, size.y * 2, thickness);
    const h1 = new THREE.Mesh(h, this.frameMaterial);
    const h2 = new THREE.Mesh().copy(h1);
    const h3 = new THREE.Mesh().copy(h1);
    const h4 = new THREE.Mesh().copy(h1);
    h1.position.set(-size.x, 0, size.z);
    h2.position.set(size.x, 0, size.z);
    h3.position.set(size.x, 0, -size.z);
    h4.position.set(-size.x, 0, -size.z);

    this.add(h1);
    this.add(h2);
    this.add(h3);
    this.add(h4);
  }

  configLabels() {
    const size = this.item.halfSize;
    const sp_d1 = this.makeTextSprite(this.canvasDepth);
    const sp_d2 = new THREE.Sprite().copy(sp_d1);
    const sp_d3 = new THREE.Sprite().copy(sp_d1);
    const sp_d4 = new THREE.Sprite().copy(sp_d1);
    sp_d1.position.set(-size.x, size.y, 0);
    sp_d2.position.set(size.x, size.y, 0);
    sp_d3.position.set(size.x, -size.y, 0);
    sp_d4.position.set(-size.x, -size.y, 0);
    sp_d2.visible = sp_d3.visible = sp_d4.visible = false;

    this.add(sp_d1);
    this.add(sp_d2);
    this.add(sp_d3);
    this.add(sp_d4);

    const sp_w1 = this.makeTextSprite(this.canvasWidth);
    const sp_w2 = new THREE.Sprite().copy(sp_w1);
    const sp_w3 = new THREE.Sprite().copy(sp_w1);
    const sp_w4 = new THREE.Sprite().copy(sp_w1);

    sp_w1.position.set(0, size.y, size.z);
    sp_w2.position.set(0, -size.y, size.z);
    sp_w3.position.set(0, size.y, -size.z);
    sp_w4.position.set(0, -size.y, -size.z);
    sp_w2.visible = sp_w3.visible = sp_w4.visible = false;

    this.add(sp_w1);
    this.add(sp_w2);
    this.add(sp_w3);
    this.add(sp_w4);

    const sp_h1 = this.makeTextSprite(this.canvasHeight);
    const sp_h2 = new THREE.Sprite().copy(sp_h1);
    const sp_h3 = new THREE.Sprite().copy(sp_h1);
    const sp_h4 = new THREE.Sprite().copy(sp_h1);
    sp_h1.position.set(-size.x, 0, size.z);
    sp_h2.position.set(size.x, 0, size.z);
    sp_h3.position.set(size.x, 0, -size.z);
    sp_h4.position.set(-size.x, 0, -size.z);
    sp_h2.visible = sp_h3.visible = sp_h4.visible = false;

    this.add(sp_h1);
    this.add(sp_h2);
    this.add(sp_h3);
    this.add(sp_h4);
  }

  setSelected() {
    this.frameMaterial.color.setHex(0xff0000);
  }

  setUnselected() {
    this.frameMaterial.color.setHex(0xdddddd);
  }

  drawLabels(size) {
    this.drawCanvas(
      this.canvasDepth,
      Core.Dimensioning.cmToMeasure(size.z * 2 * 100),
      { fontsize: 24, color: { r: 0, g: 0, b: 255, a: 1 } }
    );
    this.drawCanvas(
      this.canvasWidth,
      Core.Dimensioning.cmToMeasure(size.x * 2 * 100),
      { fontsize: 24, color: { r: 255, g: 0, b: 0, a: 1 } }
    );
    this.drawCanvas(
      this.canvasHeight,
      Core.Dimensioning.cmToMeasure(size.y * 2 * 100),
      { fontsize: 24, color: { r: 0, g: 255, b: 0, a: 1 } }
    );
  }

  drawCanvas(canvas, message, parameters) {
    if (parameters === undefined) parameters = {};

    const fontface = parameters.hasOwnProperty("fontface")
      ? parameters.fontface
      : "Arial";

    const fontsize = parameters.hasOwnProperty("fontsize")
      ? parameters.fontsize
      : 18;

    const color = parameters.hasOwnProperty("color")
      ? parameters.color
      : { r: 0, g: 0, b: 0, a: 1 };
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = `Bold ${fontsize}px ${fontface}`;

    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`;
    context.fillText(message, canvas.width / 2, canvas.height / 2);

    context.strokeStyle = "#ffffff";
    context.lineWidth = 0.1;
    context.strokeText(message, canvas.width / 2, canvas.height / 2);
  }

  makeTextSprite(canvas) {
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1, 0.75, 1);
    return sprite;
  }

  setPosition(vec3) {
    this.position.copy(vec3);
  }

  setRotation(angle) {
    this.rotation.y = angle;
  }
}
