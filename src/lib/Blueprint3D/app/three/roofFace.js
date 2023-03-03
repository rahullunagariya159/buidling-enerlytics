import * as THREE from "three";
import { CSG } from "three-csg-ts";
import Core from "../core";
import RoofItem from "../items/roof_item";

const delta = 0;
export var RoofFace = function (scene, face, controls) {
  const { vertices } = face;
  const scope = this;
  let color = face.color || 0x3f89cd;

  const material = new THREE.MeshPhongMaterial({
    color,
    side: THREE.DoubleSide,
  });

  let vecV = null;
  scope.mesh = null;
  scope.realMesh = null;

  scope.plane = null;
  scope.planeHelper = null;
  scope.interactionLines = [];

  this.remove = function () {
    removeFromScene();
    let index = controls.cameraMovedCallbacks.indexOf(updateVisibility);
    controls.cameraMovedCallbacks.splice(index, 1);
  };

  function updateVisibility() {
    let visible = true;
    if (Core.Configuration.getBooleanValue(Core.configShellMode)) {
      visible = true;
    } else {
      const position = controls.object.position.clone();
      const focus = new THREE.Vector3(
        vertices[0].x,
        vertices[0].y,
        vertices[0].z
      );
      const direction = position.sub(focus).normalize();

      // find dot
      const dot = vecV.dot(direction);
      visible = dot >= 0;
    }
    scope.mesh.visible = false;
    scope.realMesh.visible = visible;
    try {
      face.items.forEach((item) => {
        item.updateRoofVisibility(visible, true);
      });
    } catch (_) {}
  }

  function removeFromScene() {
    scene.remove(scope.mesh);
    scene.remove(scope.realMesh);
  }

  function init() {
    document.addEventListener(Core.BP3D_EVENT_CONFIG_CHANGED, (e) => {
      const { detail } = e;
      if (!detail) return;
      if (detail.hasOwnProperty(Core.configShellMode)) updateVisibility();
    });

    document.addEventListener(Core.BP3D_REQUEST_REDRAW_ROOF, () => {
      makeCsgFace();
      updateVisibility();
    });

    controls.cameraMovedCallbacks.push(updateVisibility);
    redraw();
  }

  function redraw() {
    removeFromScene();
    makeFace();
    makePlane();
    makeCsgFace();
    updateVisibility();
  }

  function makeCsgFace() {
    var geometry = new THREE.BufferGeometry().copy(scope.mesh.geometry);

    let mesh = new THREE.Mesh(geometry);
    mesh.updateMatrix();

    const tolerance = 1e-3;
    const items = scene.items.filter((item) => {
      if (!(item instanceof RoofItem)) return false;
      if (Math.abs(scope.plane.distanceToPoint(item.position)) > tolerance)
        return false;
      return true;
    });

    items.forEach((item) => {
      const { halfSize } = item;
      const box = new THREE.Mesh(
        new THREE.BufferGeometry().fromGeometry(
          new THREE.BoxGeometry(halfSize.x * 2, halfSize.y * 2, 0.1)
        ),
        new THREE.MeshStandardMaterial()
      );
      const corners = item.projectionBounding();
      const position = corners[0].clone().add(corners[2]).multiplyScalar(0.5);
      box.position.copy(position);
      box.rotation.copy(item.rotation);

      box.updateMatrix();
      mesh = CSG.subtract(mesh, box);
    });

    const geo = new THREE.Geometry().fromBufferGeometry(mesh.geometry);
    const { faces, vertices } = geo;
    for (let i = faces.length - 1; i >= 0; i--) {
      const face = faces[i];
      const a = vertices[face.a];
      const b = vertices[face.b];
      const c = vertices[face.c];
      if (
        Math.abs(scope.plane.distanceToPoint(a)) > tolerance ||
        Math.abs(scope.plane.distanceToPoint(b)) > tolerance ||
        Math.abs(scope.plane.distanceToPoint(c)) > tolerance
      ) {
        faces.splice(i, 1);
      }
    }

    scope.realMesh.geometry.vertices = geo.vertices;
    scope.realMesh.geometry.faces = geo.faces;
    scope.realMesh.geometry.elementsNeedUpdate = true;
  }

  function makePlane() {
    const points = [];
    vertices.forEach((vertex) => {
      points.push(
        new THREE.Vector3(
          vertex.x,
          vertex.y + vertex.offset + delta - 0 + face.offset,
          vertex.z
        )
      );
    });
    // generate common clip planes
    const vecA = new THREE.Vector3(
      points[1].x - points[0].x,
      points[1].y - points[0].y,
      points[1].z - points[0].z
    );

    const vecB = new THREE.Vector3(
      points[2].x - points[0].x,
      points[2].y - points[0].y,
      points[2].z - points[0].z
    );

    vecV = vecA.cross(vecB).normalize();
    if (vecV.y > 0) vecV = vecV.multiplyScalar(-1);
    scope.mesh.vecV = vecV;

    const plane = new THREE.Plane();
    let lowest = +Infinity;
    points.forEach((vertex) => {
      if (vertex.y < lowest) lowest = vertex.y;
    });
    const center = new THREE.Vector3(points[0].x, points[0].y, points[0].z);
    plane.setFromNormalAndCoplanarPoint(vecV, center).normalize();
    plane.corners = points;
    plane.roofFace = scope.mesh;
    scope.mesh.plane = plane;
    plane.lowest = lowest;
    plane.conduction = color;
    scope.plane = plane;
  }

  function makeFace() {
    if (!Array.isArray(vertices)) return;

    const points = [];
    vertices.forEach((vertex) => {
      points.push(
        new THREE.Vector3(
          vertex.x,
          vertex.y + vertex.offset + delta - 0 + face.offset,
          vertex.z
        )
      );
    });

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshPhongMaterial({ side: THREE.DoubleSide })
    );
    mesh.castShadow = true;
    mesh.forRoof = true;
    mesh.face = face;

    // generate vertical clip planes
    scope.interactionLines = [
      [points[0], points[1]],
      [points[1], points[2]],
      [points[0], points[2]],
    ];

    scope.interactionLines.forEach((l) => {
      const dist = l[0].distanceTo(l[1]);
      const r = 0.01;
      const dir = l[1].clone().sub(l[0]).normalize();
      const helper = new THREE.ArrowHelper(dir, l[0], dist);
      const pos = l[0].clone().add(l[1]).multiplyScalar(0.5);
      const cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(r, r, dist),
        new THREE.MeshPhongMaterial({ color: 0xff0000 })
      );
      cylinder.visible = false;
      cylinder.position.copy(pos);
      cylinder.rotation.copy(helper.rotation);
      cylinder.updateMatrixWorld();
      mesh.add(cylinder);
    });

    scope.mesh = mesh;
    scene.add(mesh);

    scope.realMesh = new THREE.Mesh(
      new THREE.Geometry().fromBufferGeometry(geo),
      material
    );
    scene.add(scope.realMesh);
  }

  init();
};
