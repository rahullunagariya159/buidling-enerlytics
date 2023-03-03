import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import Core from "../core";
import { getConvexHullPoints } from "../items/utils";
import { EXPOSED_SIDE } from "../model/wall";
// import { unitScale } from '../core/dimensioning';

const { drawVertexSpriteLabel, makeVertexDimensionHelper } = Core.Utils3D;

const tolerance = 1e-2;
export const Floor = function (
  scene,
  room,
  offset = 0,
  height,
  layer,
  roofData = {
    roofFaces: [],
    roofLines: [],
  },
  visible = true
) {
  const { roofFaces, roofLines } = roofData;
  const scope = this;
  this.layer = layer;

  this.room = room;

  height = height || Core.Configuration.getNumericValue(Core.configWallHeight);

  this.isHighlight = false;
  this.ceilingPlane = null;

  let floorPlane = null;
  let ceilingPlane = null;

  let sidePlanes = [];

  // helpers
  let helpers = [];
  let elevationHelpers = [];

  const mainColor = 0xffffff;
  const highlightColor = 0xffdddd;

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

  const calculateHull = () => {
    const {
      ceilingCorners,
      floorCorners,
      walls,
      inclinedWalls,
      floorThickness,
    } = scope.room;

    const corners = [];
    ceilingCorners.length > 2 &&
      ceilingCorners.forEach((p) => {
        corners.push(new THREE.Vector3(p.x, height, p.y));
      });
    floorCorners.length > 2 &&
      floorCorners.forEach((p) => {
        corners.push(new THREE.Vector3(p.x, floorThickness, p.y));
      });

    const offsetVector = new THREE.Vector3(0, offset, 0);

    walls.forEach((wall) => {
      const { edge } = wall;
      const side = wall.getRoomInteractionSide(scope.room);
      let points = [];
      if (side === EXPOSED_SIDE.inside) {
        points = edge.interiorWallPoints;
      } else if (side === EXPOSED_SIDE.outside) {
        points = edge.exteriorWallPoints;
      }

      points.forEach((p) => {
        if (p.y >= floorThickness) {
          corners.push(p.clone());
        }
      });
    });

    inclinedWalls.forEach((w) =>
      w.corners.forEach((p) => {
        if (p.y - offset >= floorThickness) corners.push(p.clone().sub(offsetVector));
      })
    );


    const hullCorners = [];
    for (const c of corners) {
      let exist = false;
      if (c.y < floorThickness) continue;
      for (const h of hullCorners) {
        if (h.distanceTo(c) < tolerance) {
          exist = true;
          break;
        }
      }
      !exist && hullCorners.push(c);

    }

    try {
      const geo = new THREE.BufferGeometry().fromGeometry(
        new ConvexGeometry(hullCorners)
      );
      scope.room.hull = geo;
    } catch (_) { }
  };

  const calculateRoofIntersectionPoints = (mesh, height = 0) => {
    const { walls } = scope.room;
    const corners = [];
    // const log = scope.room.name === "Room 001" && height === 0;

    const lines = [];
    roofLines.forEach((l) => {
      lines.push([l[0], l[1]]);
    });
    // by roof lines
    (() => {
      for (const wall of walls) {
        const { edge } = wall;
        const side = wall.getRoomInteractionSide(scope.room);
        let points = [];
        let area = 0;
        if (side === EXPOSED_SIDE.inside) {
          points = edge.interiorWallPoints;
          area = edge.interiorArea();
        } else if (side === EXPOSED_SIDE.outside) {
          points = edge.exteriorWallPoints;
          area = edge.exteriorArea();
        }

        if (area < tolerance) continue;
        for (let i = 0; i < points.length; i++) {
          let p1 = points[i];
          let p2 = points[(i + 1) % points.length];
          const tmp = new THREE.Vector3(0, offset, 0);
          let v1 = p1.clone().add(tmp);
          let v2 = p2.clone().add(tmp);
          if (v1.distanceTo(v2) < tolerance) continue;
          lines.push([v1, v2]);
          // for ceiling
          if (height !== 0) {
            if (Math.abs(p1.y - height) < tolerance) {
              corners.push(p1);
            }
            if (Math.abs(p2.y - height) < tolerance) {
              corners.push(p2);
            }
          }
        }
      }
    })();
    // log && console.log(lines);
    (() => {
      lines.forEach((l) => {
        const p1 = l[0];
        const p2 = l[1];
        const dir = p2.clone().sub(p1).normalize();
        const dist = p2.distanceTo(p1);
        const ray = new THREE.Raycaster(p1, dir);
        // const asdf = p1.x === 9 && p1.z === 6 && p2.x === 9 && p2.z === 6;

        const intersections = ray.intersectObject(mesh);
        // log && asdf && console.log(intersections.length);
        if (intersections.length) {
          let o = intersections[0];
          if (o.distance > dist) return;
          let exist = false;
          o.point.y -= offset;
          for (const p of corners) {
            if (p.distanceTo(o.point) < tolerance) {
              exist = true;
              break;
            }
          }
          !exist && corners.push(o.point);
        }
      });
    })();

    let points = [];
    try {
      points = getConvexHullPoints(
        corners.map((p) => [p.x, p.z]),
        20
      ).map((p) => new THREE.Vector2(p[0], p[1]));
      points.splice(points.length - 1, 1);
    } catch (_) { }
    // log && console.log(corners, points);
    return points;
  };

  const getInclinedWalls = () => {
    const { ceilingCorners, floorCorners, walls, floorThickness } = scope.room;
    let candidates = [];
    const cornersCollection = [];
    const planeCollection = [];
    const inclinedWalls = [];

    // roofLines.forEach((l) =>
    //   [l[0], l[1]].forEach((p) => p.y > offset && candidates.push(l[0]))
    // );

    const reduceCorners = (points) => {
      const newPoints = [];
      points.forEach((p) => {
        if (p.y > (offset + height)) return;
        let exist = false;
        for (const c of newPoints) {
          if (c.distanceTo(p) < tolerance) {
            exist = true;
            break;
          }
        }
        !exist && newPoints.push(p);
      });
      return newPoints;
    };

    ceilingCorners.forEach((p) => {
      candidates.push(new THREE.Vector3(p.x, offset + height, p.y));
    });
    floorCorners.forEach((p) => {
      candidates.push(new THREE.Vector3(p.x, offset + floorThickness, p.y));
    });
    walls.forEach((wall) => {
      const { edge } = wall;
      const side = wall.getRoomInteractionSide(scope.room);
      let points = [];
      const offsetVector = new THREE.Vector3(0, offset, 0);
      if (side === EXPOSED_SIDE.inside) {
        points = edge.interiorWallPoints;
        // points = edge.exteriorWallPoints;
      } else if (side === EXPOSED_SIDE.outside) {
        points = edge.exteriorWallPoints;
        // points = edge.interiorWallPoints;
      }
      points.forEach((p) => {
        if (p.y > 0) {
          candidates.push(p.clone().add(offsetVector));
        }
      });
    });

    candidates = reduceCorners(candidates);

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
      const points = getConvexHullPoints(
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

    scope.room.clearInclinedWalls();
    for (let i in inclinedWalls) {
      const corners = inclinedWalls[i];
      const plane = planeCollection[i];
      scope.room.addInclinedWall(corners, plane);
    }
  };

  const updateVisibility = () => {
    floorPlane.visible = true;
    sidePlanes.forEach((p) => (p.visible = true));
    ceilingPlane.visible = Core.Configuration.getBooleanValue(
      Core.configShellMode
    );
    const opacity = visible ? 1 : 0.1;
    const transparent = opacity === 1 ? false : true;

    [floorPlane, ceilingPlane, ...sidePlanes].forEach((p) => {
      p.material.opacity = opacity;
      p.material.transparent = transparent;
      p.material.depthWrite = !transparent;
    });

    // for test
    const helperVisible = Core.Configuration.getBooleanValue(
      Core.configDimensionVisible
    );
    helpers.forEach((h) => (h.visible = helperVisible));
  };

  const buildFloor = () => {
    const centroid = scope.room.updateArea().areaCenter;
    const position = new THREE.Vector3(
      centroid.x,
      offset + 0.01 + room.floorThickness,
      centroid.y
    );

    const textureSettings = scope.room.getTexture();
    // setup texture
    const floorTexture = new THREE.TextureLoader().load(textureSettings.url);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;

    const textureWidth = textureSettings.width || 1;
    const textureHeight = textureSettings.height || 1;
    floorTexture.repeat.set(1 / textureWidth, 1 / textureHeight);

    const floorMaterialTop = new THREE.MeshPhongMaterial({
      map: floorTexture,
      side: THREE.DoubleSide,
      color: mainColor,
      transparent: true,
      specular: 0x0a0a0a,
    });

    function getMesh(points) {
      const shape = new THREE.Shape(points);
      const geometry = new THREE.ShapeGeometry(shape);
      const floor = new THREE.Mesh(geometry, floorMaterialTop);

      floor.rotation.set(Math.PI / 2, 0, 0);
      floor.position.copy(position);
      floor.receiveShadow = true;
      floor.castShadow = true;
      floor.room = room;
      floor.threeFloor = scope;
      floor.updateMatrixWorld();
      return floor;
    }

    const points = [];
    scope.room.baseCorners.forEach((corner) => {
      points.push(
        new THREE.Vector2(corner.x - centroid.x, corner.y - centroid.y)
      );
    });

    const mesh = getMesh(points);
    let clipPoints = calculateRoofIntersectionPoints(mesh);
    if (clipPoints.length < 3)
      clipPoints = [0, 0].map(() => new THREE.Vector2(centroid.x, centroid.y));

    let newPoints = clipPoints.map(
      (p) => new THREE.Vector2(p.x - centroid.x, p.y - centroid.y)
    );
    const floor = getMesh(newPoints);

    scope.room.floorCorners = clipPoints.map(
      (p) => new THREE.Vector2(p.x, p.y)
    );

    sidePlanes = [];
    const thickness = room.floorThickness ? room.floorThickness : 0;
    for (let i = 0; i < newPoints.length; i++) {
      let p1 = newPoints[i];
      let p2 = newPoints[(i + 1) % newPoints.length];

      const vertices = [
        new THREE.Vector3(p1.x, 0, p1.y),
        new THREE.Vector3(p2.x, 0, p2.y),
        new THREE.Vector3(p2.x, thickness, p2.y),
        new THREE.Vector3(p1.x, thickness, p1.y),
      ];

      const geometry = new THREE.Geometry();
      vertices.forEach((p) => {
        geometry.vertices.push(p);
      });
      geometry.faces.push(new THREE.Face3(0, 1, 2));
      geometry.faces.push(new THREE.Face3(0, 2, 3));

      const fillerMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
      });

      geometry.computeVertexNormals();
      const filler = new THREE.Mesh(geometry, fillerMaterial);
      const fillerPosition = position.clone();
      fillerPosition.y -= thickness;
      filler.position.copy(fillerPosition);
      sidePlanes.push(filler);
    }
    return floor;
  };

  const buildCeiling = () => {
    const centroid = scope.room.areaCenter;
    const position = new THREE.Vector3(centroid.x, offset + height, centroid.y);
    // setup texture
    var ceilingMaterial = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      color: 0xffffff,
    });

    function getMesh(points) {
      var shape = new THREE.Shape(points);
      var geometry = new THREE.ShapeGeometry(shape);
      var ceiling = new THREE.Mesh(geometry, ceilingMaterial);

      ceiling.rotation.set(Math.PI / 2, 0, 0);
      ceiling.position.copy(position);
      ceiling.threeFloor = scope;
      ceiling.castShadow = true;
      ceiling.receiveShadow = true;
      ceiling.updateMatrixWorld();
      return ceiling;
    }

    var points = scope.room.baseCorners.map(
      (corner) =>
        new THREE.Vector2(corner.x - centroid.x, corner.y - centroid.y)
    );

    let mesh = getMesh(points);
    let clipPoints = calculateRoofIntersectionPoints(mesh, height);
    if (clipPoints.length < 3)
      clipPoints = [0, 0].map(() => new THREE.Vector2(centroid.x, centroid.y));
    let newPoints = clipPoints.map(
      (p) => new THREE.Vector2(p.x - centroid.x, p.y - centroid.y)
    );

    const ceiling = getMesh(newPoints);
    scope.room.ceilingCorners = clipPoints.map(
      (p) => new THREE.Vector2(p.x, p.y)
    );
    scope.ceilingPlane = ceiling;
    return ceiling;
  };

  const buildHelpers = () => {
    helpers = [];
    const { floorCorners, inclinedWalls, walls, layer } = scope.room;
    // walls
    for (const wall of walls) {
      const { edge } = wall;
      let corners = [];
      const tmp = new THREE.Vector3(0, offset, 0);
      // if (wall.checkIsOutsideWall()) {
      const side = wall.getRoomInteractionSide(scope.room);
      if (side === EXPOSED_SIDE.inside) {
        if (edge.interiorArea() > tolerance)
          corners = edge.interiorWallPoints.map((p) => p.clone().add(tmp));
      } else if (side === EXPOSED_SIDE.outside) {
        if (edge.exteriorArea() > tolerance)
          corners = edge.exteriorWallPoints.map((p) => p.clone().add(tmp));
      }
      // } else {
      //   if (edge.interiorWallPoints.length === edge.exteriorWallPoints.length) {
      //     for (let i = 0; i < edge.interiorWallPoints.length; i++) {
      //       const p1 = edge.interiorWallPoints[i];
      //       const p2 = edge.exteriorWallPoints[i];
      //       corners.push(p1.clone().add(p2).multiplyScalar(0.5).add(tmp));
      //     }
      //   }
      // }

      if (corners.length === 0) continue;

      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0000ff,
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
    }

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
    }

    // elevation helpers
    (() => {
      const corners = floorCorners.map(
        (c) => new THREE.Vector3(c.x, offset, c.y)
      );
      const lineMaterial = new THREE.LineDashedMaterial({
        color: 0x000000,
        depthTest: false,
        transparent: true,
        opacity: 0.5,
        dashSize: 0.1,
        gapSize: 0.1,
      });

      const collection = [];
      for (let i = 0; i < corners.length; i++) {
        let p1 = corners[i];
        let p2 = corners[(i + 1) % corners.length];
        collection.push([p1, p2]);
        if (layer.layerIndex === 100) {
          let bp1 = p1.clone();
          let bp2 = p2.clone();
          bp1.y = bp2.y = 0;
          collection.push([bp1, bp2]);
          collection.push([p1, bp1]);
        }
      }
      collection.forEach((points) => {
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mesh = new THREE.Line(geo, lineMaterial);
        mesh.computeLineDistances();
        mesh.renderOrder = 100;
        elevationHelpers.push(mesh);
      });
    })();
  };

  function getVertexDimensionLabel(vertex = new THREE.Vector3()) {
    let label = "x: " + Core.Dimensioning.cmToMeasure(vertex.x * 100) + ", \n";
    label += "y: " + Core.Dimensioning.cmToMeasure(vertex.z * 100) + ", \n";
    label += "z: " + Core.Dimensioning.cmToMeasure(vertex.y * 100);
    return label;
  }

  this.getPlane = () => floorPlane;

  this.setHighlight = (highlight) => {
    scope.isHighlight = highlight;
    floorPlane.material.color.setHex(highlight ? highlightColor : mainColor);
  };

  this.addToScene = function () {
    scene.add(floorPlane);
    scene.add(ceilingPlane);
    sidePlanes.forEach((side) => scene.add(side));
    helpers.forEach((m) => scene.add(m));
    elevationHelpers.forEach((m) => scene.add(m));
  };

  this.removeFromScene = function () {
    scene.remove(floorPlane);
    scene.remove(ceilingPlane);
    sidePlanes.forEach((side) => scene.remove(side));
    helpers.forEach((m) => scene.remove(m));
    elevationHelpers.forEach((m) => scene.remove(m));
    sidePlanes = [];
    helpers = [];
    elevationHelpers = [];
  };

  const init = () => {
    scope.room.fireOnFloorChange(redraw);
    redraw();
  };

  const redraw = () => {
    scope.removeFromScene();
    floorPlane = buildFloor();
    ceilingPlane = buildCeiling();
    getInclinedWalls();
    buildHelpers();
    updateVisibility();
    calculateHull();
    scope.addToScene();
  };

  init();
};
