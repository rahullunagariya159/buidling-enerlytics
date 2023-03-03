import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import hull from "hull.js";
import Room from "../model/room";
import Core from "../core";

const { drawVertexSpriteLabel, makeVertexDimensionHelper } = Core.Utils3D;
const tolerance = 1e-3;

export const DeadSpace = function (scene, layer, offset, roofFaces, rooms) {
  let vertices = [];
  let room = null;
  let helpers = [];
  function init() {
    room = new Room(layer, [], offset, 0);
    room.setName("Room Roof Surface");

    collectVertices();
    if (vertices.length) {
      layer.offset = offset;
      layer.rooms = [room];
      calculateFloor();
      calculateInclinedWall();
      calculateHull();
      buildHelpers();
      updateVisibility();
    }

    document.addEventListener(Core.BP3D_EVENT_CONFIG_CHANGED, (e) => {
      const { detail } = e;
      if (!detail) return;
      if (detail.dimUnit) {
        helpers.forEach((h) => {
          if (h instanceof THREE.Sprite) {
            const label = getVertexDimensionLabel(h.vertex);
            drawVertexSpriteLabel(h, label);
          }
        });
      }
      if (detail.hasOwnProperty(Core.configDimensionVisible)) {
        updateVisibility();
      }
      if (detail.hasOwnProperty(Core.configShellMode)) updateVisibility();
    });
  }

  this.remove = () => {
    helpers.forEach((h) => scene.remove(h));
  };

  const updateVisibility = () => {
    // for test
    const helperVisible = Core.Configuration.getBooleanValue(
      Core.configDimensionVisible
    );
    helpers.forEach((h) => (h.visible = helperVisible));
  }

  function getVertexDimensionLabel(vertex = new THREE.Vector3()) {
    let label =
      "x: " + Core.Dimensioning.cmToMeasure(vertex.x * 100) + ", \n";
    label += "y: " + Core.Dimensioning.cmToMeasure(vertex.z * 100) + ", \n";
    label += "z: " + Core.Dimensioning.cmToMeasure(vertex.y * 100);
    return label;
  }

  const buildHelpers = () => {
    this.remove();
    helpers = [];
    const { inclinedWalls } = room;
    // inclined walls
    for (const wall of inclinedWalls) {
      const { corners } = wall;
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00ff00,
        depthTest: false,
        transparent: true,
        opacity: 0.5,
      });
      const geo = new THREE.BufferGeometry().setFromPoints([
        ...corners,
        corners[0],
      ]);
      const mesh = new THREE.Line(geo, lineMaterial);
      helpers.push(mesh);
      for (const p of corners) {
        const sprite = makeVertexDimensionHelper(p);
        const label = getVertexDimensionLabel(p);
        drawVertexSpriteLabel(sprite, label);
        helpers.push(sprite);
      }
      // const helper = new THREE.PlaneHelper(wall.plane, 1, 0xffff00);
      // helpers.push(helper);
    }

    helpers.forEach((h) => scene.add(h));
  };

  function collectVertices() {
    vertices = [];
    const candidates = [];
    roofFaces.forEach((mesh) => {
      candidates.push(...mesh.plane.corners);
    });
    rooms.forEach((room) =>
      room.inclinedWalls.forEach((w) => {
        candidates.push(...w.corners);
      })
    );

    candidates.forEach((c) => {
      if (c.y < offset) return;
      let exist = false;
      for (const v of vertices) {
        if (v.distanceTo(c) < tolerance) {
          exist = true;
          break;
        }
      }
      !exist && vertices.push(c);
    });
  }

  function calculateFloor() {
    let height = 0;
    const candidates = [];
    vertices.forEach((v) => {
      if (Math.abs(v.y - offset) < tolerance) candidates.push(v);
      if (v.y > height) height = v.y;
    });
    if (!candidates.length) return;
    const points = hull(candidates.map((c) => [c.x, c.z]));
    points.splice(points.length - 1, 1);
    room.floorCorners = points.map((p) => ({ x: p[0], y: p[1] }));
    room.height = height - offset;
  }

  function calculateInclinedWall() {
    const planeCollection = [];
    const cornersCollection = [];
    const inclinedWalls = [];

    const candidates = vertices;

    const reducedRoofFaces = [];
    roofFaces.forEach((_f) => {
      let exist = false;
      for (const f of reducedRoofFaces) {
        if (Core.Utils3D.checkIsSamePlane(f.plane, _f.plane)) {
          exist = true;
          break;
        }
      }
      !exist && reducedRoofFaces.push(_f);
    });
    for (const _face of reducedRoofFaces) {
      const { plane } = _face;
      const corners = [];
      for (const c of candidates) {
        const _d = plane.distanceToPoint(c);
        if (Math.abs(_d) < tolerance) {
          corners.push(c);
        }
      }
      if (corners.length > 0) {
        planeCollection.push(plane);
        cornersCollection.push(corners);
      }
    }

    cornersCollection.forEach((corners) => {
      const points = hull(
        corners.map((p) => [p.x, p.z]),
        20
      ).map((p) => new THREE.Vector3(p[0], 0, p[1]));
      const tmp = [];
      points.splice(points.length - 1, 1);
      points.forEach((p) => {
        tmp.push(
          corners.sort((a, b) => {
            const vA = a.clone();
            const vB = b.clone();
            vA.y = vB.y = 0;
            const dA = vA.distanceTo(p);
            const dB = vB.distanceTo(p);
            return dA - dB;
          })[0]
        );
      });
      inclinedWalls.push(tmp);
    });

    room.clearInclinedWalls();
    for (let i in inclinedWalls) {
      const corners = inclinedWalls[i];
      const plane = planeCollection[i];
      room.addInclinedWall(corners, plane);
    }
  }

  function calculateHull() {
    if (!vertices.length) return;
    try {
      const geo = new THREE.BufferGeometry().fromGeometry(
        new ConvexGeometry(vertices)
      );
      room.hull = geo;
    } catch (_) { }
  }

  init();
};
