import * as THREE from "three";

export var HUD = function (three) {
  const scope = this;
  const scene = three.scene;

  let selectedItem = null;

  let rotating = false;
  let mouseover = false;

  // var tolerance = 0.1;
  const height = 0.05;
  const distance = 0.2;
  const color = "#ffffff";
  const hoverColor = "#f1c40f";

  let activeObject = null;

  this.getScene = function () {
    return scene;
  };

  this.getObject = function () {
    return activeObject;
  };

  function init() {
    three.itemSelectedCallbacks.push(itemSelected);
  }

  function resetSelectedItem() {
    selectedItem = null;
    if (activeObject) {
      scene.remove(activeObject);
      activeObject = null;
    }
  }

  function itemSelected(item) {
    if (!item) {
      resetSelectedItem();
      return;
    }
    if (selectedItem !== item) {
      resetSelectedItem();
      if (item.allowRotate && !item.fixed) {
        selectedItem = item;
        activeObject = makeObject(selectedItem);
        scene.add(activeObject);
      }
    }
  }

  this.setRotating = function (isRotating) {
    rotating = isRotating;
    setColor();
  };

  this.setMouseover = function (isMousedOver) {
    mouseover = isMousedOver;
    setColor();
  };

  function setColor() {
    if (activeObject) {
      activeObject.children.forEach((obj) => {
        obj.material.color.set(getColor());
      });
    }
    three.needsUpdate();
  }

  function getColor() {
    return mouseover || rotating ? hoverColor : color;
  }

  this.update = function () {
    if (activeObject) {
      activeObject.rotation.y = selectedItem.rotation.y;

      const center = selectedItem.position;
      activeObject.position.x = center.x;
      activeObject.position.z = center.z;
    }
  };

  function makeLineGeometry(item) {
    const geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3(0, 0, 0), rotateVector(item));

    return geometry;
  }

  function rotateVector(item) {
    const vec = new THREE.Vector3(
      0,
      0,
      Math.max(item.halfSize.x, item.halfSize.z) + distance
    );
    return vec;
  }

  function makeLineMaterial(rotating) {
    const mat = new THREE.LineBasicMaterial({
      color: getColor(),
      linewidth: 3,
      depthTest: false,
      // alphaTest: false,
    });
    return mat;
  }

  function makeCone(item) {
    const coneGeo = new THREE.CylinderGeometry(0.05, 0, 0.1);
    const coneMat = new THREE.MeshBasicMaterial({
      color: getColor(),
    });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.copy(rotateVector(item));

    cone.rotation.x = -Math.PI / 2;

    return cone;
  }

  function makeSphere(item) {
    const geometry = new THREE.SphereGeometry(0.04, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: getColor(),
      depthTest: false,
    });
    const sphere = new THREE.Mesh(geometry, material);
    return sphere;
  }

  function makeObject(item) {
    const object = new THREE.Group();
    const line = new THREE.Line(
      makeLineGeometry(item),
      makeLineMaterial(scope.rotating),
      THREE.LinePieces
    );

    const cone = makeCone(item);
    const sphere = makeSphere(item);

    object.add(line);
    object.add(cone);
    object.add(sphere);

    object.rotation.y = item.rotation.y;
    object.position.x = item.position.x;
    object.position.z = item.position.z;
    object.position.y = height;

    return object;
  }

  init();
};
