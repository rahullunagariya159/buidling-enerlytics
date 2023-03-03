import * as THREE from "three";
import Core from "../core";
const delta = 0;

export var RoofEdge = function (scene, edge, offset) {
  const scope = this;
  this.mesh = null;
  let lineMaterial = null;

  // document.addEventListener(Core.BP3D_EVENT_CONFIG_CHANGED, (e) => {
  //   const { detail } = e;
  //   if (!detail) return;
  //   if (detail.hasOwnProperty(Core.configDimensionVisible)) {
  //     updateVisibility();
  //   }
  // });

  const updateVisibility = () => {
    if (
      !edge.enabled
      // && !Core.Configuration.getBooleanValue(Core.configDimensionVisible)
    )
      scope.mesh.visible = false;
    else {
      scope.mesh.visible = true;
    }
  };

  this.remove = function () {
    removeFromScene();
  };

  function removeFromScene() {
    scope.mesh && scene.remove(scope.mesh);
  }

  function init() {
    removeFromScene();
    redraw();
    updateVisibility();
  }

  function redraw() {
    scope.mesh = makeLine();
    scene.add(scope.mesh);
  }

  const setHighlight = (highlight) => {};

  const mouseOver = () => {
    setHighlight(true);
  };
  const mouseOff = () => {
    setHighlight(false);
  };
  const setSelected = () => {};
  const setUnselected = () => {};
  const customIntersectionPlanes = () => {};
  const clickPressed = () => {};
  const clickReleased = () => {};
  const clickDragged = () => {};

  function makeLine() {
    const { start, end } = edge;
    const startVector = new THREE.Vector3(
      start.x,
      start.y - 0 + offset + delta,
      start.z
    );
    const endVector = new THREE.Vector3(
      end.x,
      end.y - 0 + offset + delta,
      end.z
    );

    lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const geo = new THREE.BufferGeometry().setFromPoints([
      startVector,
      endVector,
    ]);

    const mesh = new THREE.Line(geo, lineMaterial);
    mesh.forRoof = true;

    mesh.mouseOver = mouseOver;
    mesh.mouseOff = mouseOff;
    mesh.setSelected = setSelected;
    mesh.setUnselected = setUnselected;
    mesh.customIntersectionPlanes = customIntersectionPlanes;
    mesh.clickPressed = clickPressed;
    mesh.clickReleased = clickReleased;
    mesh.clickDragged = clickDragged;
    mesh.roofEdge = edge;
    return mesh;
  }

  init();
};
