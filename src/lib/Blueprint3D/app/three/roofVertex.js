import * as THREE from "three";
import Core from "../core";

const { drawVertexSpriteLabel, makeVertexDimensionHelper } = Core.Utils3D;

const delta = 0;
export var RoofVertexHelper = function (scene, vertex, offset) {
  const scope = this;
  let material = null;
  let size = 0.3;
  let color = 0x0000ff;
  scope.mesh = null;
  scope.helper = null;

  document.addEventListener(Core.BP3D_EVENT_CONFIG_CHANGED, (e) => {
    const { detail } = e;
    if (!detail) return;
    if (detail.dimUnit) {
      const h = scope.helper;
      if (h instanceof THREE.Sprite) {
        const label = getVertexDimensionLabel(h.vertex);
        drawVertexSpriteLabel(h, label);
      }
    }
    if (detail.hasOwnProperty(Core.configDimensionVisible)) {
      updateHelperVisibility();
    }
  });

  this.remove = function () {
    removeFromScene();
  };

  function removeFromScene() {
    scope.mesh && scene.remove(scope.mesh);
    scope.helper && scene.remove(scope.helper);
  }

  function init() {
    removeFromScene();
    redraw();
    if (vertex.selected) setSelected();
  }

  function redraw() {
    scope.mesh = makeVertex();
    scene.add(scope.mesh);
    scene.add(scope.helper);
    updateHelperVisibility();
  }

  const updateHelperVisibility = () => {
    const visible = Core.Configuration.getBooleanValue(
      Core.configDimensionVisible
    );
    scope.helper && (scope.helper.visible = visible);
  };

  const setHighlight = (highlight) => {
    material && (material.opacity = highlight ? 1 : 0.5);
  };

  const mouseOver = () => {
    setHighlight(true);
  };
  const mouseOff = () => {
    setHighlight(false);
  };
  const setSelected = () => {
    this.mesh.roofVertex.selected = true;
    material.color.setHex(0xffff00);
  };
  const setUnselected = () => {
    this.mesh.roofVertex.selected = false;
    material.color.setHex(color);
  };
  const customIntersectionPlanes = () => {};
  const clickPressed = () => {};
  const clickReleased = () => {};
  const clickDragged = () => {};

  const moved_callback = () => {
    const { x, y, z } = scope.mesh.position;
    vertex.move(
      x,
      y - vertex.offset - delta - vertex.parent.floorplan.buildingOffset,
      z
    );
  };

  function makeVertex() {
    const { x, y, z } = vertex;
    material = new THREE.MeshPhongMaterial({
      color,
      transparent: true,
      opacity: 0.5,
    });
    const geo = new THREE.BoxGeometry(size, size, size);
    const mesh = new THREE.Mesh(geo, material);

    const position = new THREE.Vector3(x, y + offset + delta - 0, z);
    mesh.position.copy(position);
    mesh.forRoof = true;
    mesh.roofVertex = vertex;

    mesh.mouseOver = mouseOver;
    mesh.mouseOff = mouseOff;
    mesh.setSelected = setSelected;
    mesh.setUnselected = setUnselected;
    mesh.customIntersectionPlanes = customIntersectionPlanes;
    mesh.clickPressed = clickPressed;
    mesh.clickReleased = clickReleased;
    mesh.clickDragged = clickDragged;
    mesh.moved_callback = moved_callback;

    if (!vertex.enabled) mesh.visible = false;

    const sprite = makeVertexDimensionHelper(position);
    const label = getVertexDimensionLabel(position);
    drawVertexSpriteLabel(sprite, label);
    scope.helper = sprite;
    return mesh;
  }

  function getVertexDimensionLabel(vertex = new THREE.Vector3()) {
    let label = "x: " + Core.Dimensioning.cmToMeasure(vertex.x * 100) + ", \n";
    label += "y: " + Core.Dimensioning.cmToMeasure(vertex.z * 100) + ", \n";
    label += "z: " + Core.Dimensioning.cmToMeasure(vertex.y * 100);
    return label;
  }

  init();
};
