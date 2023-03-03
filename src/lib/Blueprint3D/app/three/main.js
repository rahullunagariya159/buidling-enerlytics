import * as THREE from "three";

import Core from "../core";

import { Skybox } from "./skybox";
import { Controls } from "./controls";
import { HUD } from "./hud";
import { Controller } from "./controller";
import { Lights } from "./lights";
import { Floorplan } from "./floorplan";
import { Roof } from "./roof";

const imgCompass = "/Blueprint3D-assets/textures/compass.png";

export default function Main(model, element, canvasElement, opts) {
  var scope = this;
  model.three = this;

  var options = {
    resize: true,
    pushHref: false,
    spin: true,
    spinSpeed: 0.00002,
    clickPan: true,
    canMoveFixedItems: false,
  };

  // override with manually set options
  for (var opt in options) {
    if (options.hasOwnProperty(opt) && opts.hasOwnProperty(opt)) {
      options[opt] = opts[opt];
    }
  }

  var scene = model.scene;
  this.scene = scene;

  this.element = element;
  var domElement;

  var camera;
  var renderer;

  this.ground = null;
  this.compass = null;

  this.controls = null;
  this.floorplan = null;

  // var canvas;
  var controller;
  var floorplan;

  var light;
  var skyBox;
  var hud;
  var roof;
  this.roof = null;

  this.heightMargin = 0;
  this.widthMargin = 0;
  this.elementHeight = 0;
  this.elementWidth = 0;

  this.itemSelectedCallbacks = []; // item
  this.roofVertexSelectedCallbacks = [];
  this.roofEditorModeChangedCallbacks = [];

  this.wallClicked = []; // wall
  this.roofClicked = []; // wall
  this.floorClicked = []; // floor
  this.nothingClicked = [];

  this.outlineManager = null;

  function addGround() {
    const plane = new THREE.PlaneGeometry(1000, 1000);
    const material = new THREE.MeshBasicMaterial({
      color: 0x406c4b,
      side: THREE.FrontSide,
      transparent: true,
      opacity: 0.4,
    });
    const mesh = new THREE.Mesh(plane, material);
    mesh.position.y = -0.01;
    mesh.rotation.x = -Math.PI / 2;
    mesh.renderOrder = 100;
    scope.ground = mesh;
    scope.scene.add(scope.ground);
  }

  function addCompass() {
    const group = new THREE.Group();
    const texture = new THREE.TextureLoader().load(imgCompass);
    texture.anisotropy = renderer.getMaxAnisotropy();

    const size = 5;
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshPhongMaterial({
        map: texture,
        depthTest: false,
        transparent: true,
      })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.renderOrder = 100;
    group.add(plane);
    scope.compass = group;
    scope.scene.add(group);
  }

  function updateCompass() {
    const { orientation } = model.floorplan;
    const visible = Core.Configuration.getBooleanValue(
      Core.configCompassVisible
    );
    const angle = (-orientation / 180) * Math.PI;
    scope.compass.rotation.y = angle;
    scope.compass.visible = visible;
  }

  this.updateSunPosition = (azimuth, altitude) => {
    const { orientation } = model.floorplan;
    light.updateSunPosition(azimuth - (orientation / 180) * Math.PI, altitude);
    skyBox.updateSunPosition(azimuth, altitude);
  };

  const init = () => {
    domElement = scope.element; // Container
    camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.autoClear = false;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    // renderer.toneMappingExposure = 0.5;

    skyBox = new Skybox(scene, renderer);

    scope.controls = new Controls(camera, domElement);

    addGround();
    addCompass();
    updateCompass();

    hud = new HUD(scope);
    roof = new Roof(scope, model.floorplan);
    this.roof = roof;

    controller = new Controller(
      scope,
      model,
      camera,
      renderer.domElement,
      scope.controls,
      hud,
      roof
    );

    domElement.appendChild(renderer.domElement);

    // handle window resizing
    scope.updateWindowSize();
    if (options.resize) {
      window.addEventListener("resize", scope.updateWindowSize);
    }

    // setup camera nicely
    scope.centerCamera();
    model.floorplan.fireOnUpdatedRooms(scope.centerCamera);
    model.floorplan.fireOnUpdatedRooms(updateCompass);

    light = new Lights(scene, model.floorplan);

    floorplan = new Floorplan(scene, model.floorplan, scope.controls);
    floorplan.controller = controller;
    scope.floorplan = floorplan;

    animate();

    document.addEventListener(
      Core.BP3D_EVENT_HIGHLIGHT_CHANGED,
      ({ detail }) => {
        if (!detail) return;
        if (detail.objects) {
          // this.updateOutline(detail.objects);
        }
      }
    );
    document.addEventListener(Core.BP3D_EVENT_CONFIG_CHANGED, ({ detail }) => {
      if (!detail) return;
      if (detail.hasOwnProperty(Core.configCompassVisible)) {
        updateCompass();
      }
    });
  };

  this.dataUrl = function () {
    var dataUrl = renderer.domElement.toDataURL("image/png");
    return dataUrl;
  };

  this.options = () => options;
  this.getModel = () => model;
  this.getScene = () => scene;
  this.getController = () => controller;
  this.getCamera = () => camera;
  this.needsUpdate = () => {};

  function shouldRender() {
    return true;
  }

  function render() {
    // spin();
    if (shouldRender()) {
      renderer.clear();
      renderer.render(scene.scene, camera);
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  this.rotatePressed = function () {
    controller.rotatePressed();
  };

  this.rotateReleased = function () {
    controller.rotateReleased();
  };

  this.setCursorStyle = function (cursorStyle) {
    domElement.style.cursor = cursorStyle;
  };

  this.updateWindowSize = function () {
    let rect = scope.element.getBoundingClientRect();
    scope.heightMargin = rect.top;
    scope.widthMargin = rect.left;

    scope.elementWidth = rect.width;
    scope.elementHeight = rect.height;

    camera.aspect = scope.elementWidth / scope.elementHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(scope.elementWidth, scope.elementHeight);
  };

  this.centerCamera = function (resetCamera) {
    var yOffset = 1.5;

    var pan = model.floorplan.getCenter();
    pan.y = yOffset;

    scope.controls.target = pan;

    var distance = model.floorplan.getSize().z * 2;

    var offset = pan.clone().add(new THREE.Vector3(0, distance / 3, distance));
    //scope.controls.setOffset(offset);
    resetCamera && camera.position.copy(offset);

    scope.controls.update();
  };

  // projects the object's center point into x,y screen coords
  // x,y are relative to top left corner of viewer
  this.projectVector = function (vec3, ignoreMargin) {
    ignoreMargin = ignoreMargin || false;

    var widthHalf = scope.elementWidth / 2;
    var heightHalf = scope.elementHeight / 2;

    var vector = new THREE.Vector3();
    vector.copy(vec3);
    vector.project(camera);

    var vec2 = new THREE.Vector2();

    vec2.x = vector.x * widthHalf + widthHalf;
    vec2.y = -(vector.y * heightHalf) + heightHalf;

    if (!ignoreMargin) {
      vec2.x += scope.widthMargin;
      vec2.y += scope.heightMargin;
    }

    return vec2;
  };

  this.setRoofEditorMode = (mode) => roof.setMode(mode);

  this.setRoofEditorEnabled = (enabled) => roof.setEnabled(enabled);

  this.setTransformControlAxis = (axis) => {
    const { transformControl } = controller;
    switch (axis) {
      case "X":
        transformControl.showX = true;
        transformControl.showY = false;
        transformControl.showZ = false;
        break;
      case "Z":
        transformControl.showX = false;
        transformControl.showY = true;
        transformControl.showZ = false;
        break;
      case "Y":
        transformControl.showX = false;
        transformControl.showY = false;
        transformControl.showZ = true;
        break;
      default:
        break;
    }
  };

  init();
}
