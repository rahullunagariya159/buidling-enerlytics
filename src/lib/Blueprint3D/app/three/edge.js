import * as THREE from "three";
import Core from "../core";

export var Edge = function (
  scene,
  edge,
  controls,
  offset,
  layer,
  roofData = {
    clipPlanes: [],
    roofFaces: [],
    roofLines: [],
  },
  visible = true
) {
  const { clipPlanes, roofFaces, roofLines } = roofData;
  const scope = this;
  this.isHighlight = false;
  this.layer = layer;

  const { wall, front } = edge;

  let startHeight = wall.height;
  let endHeight = wall.height;
  let interiorStartHeight = wall.height;
  let interiorEndHeight = wall.height;
  let exteriorStartHeight = wall.height;
  let exteriorEndHeight = wall.height;

  let validClipPlanes = [];

  let planes = [];
  let basePlanes = [];

  let interiorTexture = null;
  let exteriorTexture = null;

  let interiorMaterial = null;
  let exteriorMaterial = null;
  let fillerMaterial = null;

  const mainColor = 0xffffff;
  const obstacleColor = 0x888888;
  const highlightColor = 0xffdddd;

  this.visible = false;

  document.addEventListener(Core.BP3D_EVENT_CONFIG_CHANGED, (e) => {
    const { detail } = e;
    if (!detail) return;
    if (detail.hasOwnProperty(Core.configShellMode)) updateVisibility();
  });

  this.setHighlight = (highlight) => {
    scope.isHighlight = highlight;
    interiorMaterial.color.setHex(highlight ? highlightColor : mainColor);
    exteriorMaterial.color.setHex(highlight ? highlightColor : mainColor);
  };

  this.setClipPlanes = () => {
    [fillerMaterial].forEach((mat) => {
      mat.clippingPlanes = validClipPlanes;
    });
  };

  function getValidClipPlanes(planes) {
    wall.hasRoofInteraction = checkWallIsInsideRoofArea();
    validClipPlanes = wall.hasRoofInteraction ? planes : [];
  }

  function getCornerHeights() {
    const faces = clipPlanes.map((plane) => plane.roofFace);

    // interior/exterior start heights
    interiorStartHeight = getIntersectioHeight(edge.interiorStart(), faces);
    exteriorStartHeight = getIntersectioHeight(edge.exteriorStart(), faces);
    if (interiorStartHeight >= wall.height) {
      if (exteriorStartHeight >= wall.height) {
        interiorStartHeight = wall.height;
        exteriorStartHeight = wall.height;
      } else {
        interiorStartHeight = exteriorStartHeight;
      }
    } else {
      if (exteriorStartHeight >= wall.height) {
        exteriorStartHeight = interiorStartHeight;
      }
    }

    // interior/exterior end heights
    interiorEndHeight = getIntersectioHeight(edge.interiorEnd(), faces);
    exteriorEndHeight = getIntersectioHeight(edge.exteriorEnd(), faces);
    if (interiorEndHeight >= wall.height) {
      if (exteriorEndHeight >= wall.height) {
        interiorEndHeight = wall.height;
        exteriorEndHeight = wall.height;
      } else {
        interiorEndHeight = exteriorEndHeight;
      }
    } else {
      if (exteriorEndHeight >= wall.height) {
        exteriorEndHeight = interiorEndHeight;
      }
    }
  }

  function getClipPoints(v1, v2, v3, v4) {
    const geometry = new THREE.Geometry();
    const tmp = new THREE.Vector3(0, offset, 0);
    const p1 = v1.clone().add(tmp);
    const p2 = v2.clone().add(tmp);
    const p3 = v3.clone().add(tmp);
    const p4 = v4.clone().add(tmp);

    const points = [];
    // by roof lines
    (() => {
      [p1, p2, p3, p4].forEach((p) => geometry.vertices.push(p));
      geometry.faces.push(new THREE.Face3(0, 1, 2));
      geometry.faces.push(new THREE.Face3(0, 2, 3));

      const filler = new THREE.Mesh(geometry, fillerMaterial);
      filler.updateMatrix();
      roofLines.forEach((l) => {
        const p1 = l[0];
        const p2 = l[1];
        const dir = p2.clone().sub(p1).normalize();
        const dist = p2.distanceTo(p1);
        const ray = new THREE.Raycaster(p1, dir);
        const intersections = ray.intersectObject(filler);
        if (intersections.length) {
          let o = intersections[0];
          if (o.distance > dist) return;
          let exist = false;
          for (const p of points) {
            if (p.distanceTo(o.point) < 0.001) {
              exist = true;
              break;
            }
          }
          !exist && points.push(o.point);
        }
      });
    })();

    // by ceiling line
    (() => {
      const dir = p4.clone().sub(p3).normalize();
      const ray = new THREE.Raycaster(p3, dir);
      const dist = p4.distanceTo(p3);
      const intersections = ray.intersectObjects(roofFaces, true);
      for (const o of intersections) {
        if (o.distance > dist) return;
        let exist = false;
        for (const p of points) {
          if (p.distanceTo(o.point) < 0.001) {
            exist = true;
            break;
          }
        }
        !exist && points.push(o.point);
      }
    })();

    // by floor line
    (() => {
      const dir = p2.clone().sub(p1).normalize();
      const ray = new THREE.Raycaster(p1, dir);
      const dist = p2.distanceTo(p1);
      const intersections = ray.intersectObjects(roofFaces, true);
      for (const o of intersections) {
        if (o.distance > dist) return;
        let exist = false;
        for (const p of points) {
          if (p.distanceTo(o.point) < 0.001) {
            exist = true;
            break;
          }
        }
        !exist && points.push(o.point);
      }
    })();

    points.forEach((p) => {
      p.y -= offset;
      if (p.y < 0) p.y = 0;
    });

    const res = points.sort((a, b) => {
      const vA = a.clone();
      const vB = b.clone();
      let d1 = vA.distanceTo(v2);
      let d2 = vB.distanceTo(v2);
      return d1 - d2;
    });
    return res;
  }

  function checkWallIsInsideRoofArea() {
    const { height } = wall;

    // interior/exterior start heights
    const iSH = interiorStartHeight;
    const eSH = exteriorStartHeight;

    // interior/exterior end heights
    const iEH = interiorEndHeight;
    const eEH = exteriorEndHeight;

    let startIsValid = false;
    let endIsValid = false;
    if (iSH <= height || eSH <= height) startIsValid = true;
    if (iEH <= height || eEH <= height) endIsValid = true;
    if (startIsValid || endIsValid) return true;

    return false;
  }

  const getIntersectioHeight = (vec2, faces) => {
    // const log = vec2.x === 0 && vec2.y === 6 && offset === 2.5;

    const delta = 100;
    const p1 = new THREE.Vector3(vec2.x, offset - delta, vec2.y);
    const p2 = new THREE.Vector3(vec2.x, offset + wall.height, vec2.y);
    const d = p2.clone().sub(p1).normalize();
    const ray = new THREE.Raycaster(p1, d);
    const intersections = ray.intersectObjects(faces, true);
    let height = 10000;
    if (intersections.length > 0) height = intersections[0].distance - delta;
    height < 0 && (height = 0);
    // height > wall.height && (height = wall.height);
    return height;
  };

  this.remove = function () {
    let index = null;
    index = edge.redrawCallbacks.indexOf(redraw);
    edge.redrawCallbacks.splice(index, 1);
    index = controls.cameraMovedCallbacks.indexOf(updateVisibility);
    controls.cameraMovedCallbacks.splice(index, 1);
    removeFromScene();
  };

  function init() {
    redraw();

    edge.redrawCallbacks.push(redraw);
    controls.cameraMovedCallbacks.push(updateVisibility);
  }

  function redraw() {
    getCornerHeights();
    getValidClipPlanes(clipPlanes);
    removeFromScene();
    updateTexture();
    updatePlanes();
    addToScene();
    updateVisibility();
    updateHelperVisibility();
    scope.setClipPlanes();
    scope.setHighlight(scope.isHighlight);
  }

  this.getPlanes = () => {
    const res = [];
    planes[0].visible && res.push(planes[0]);
    planes[1].visible && res.push(planes[1]);
    return res;
  };

  function removeFromScene() {
    planes.forEach((plane) => scene.remove(plane));
    basePlanes.forEach((plane) => scene.remove(plane));
    planes = [];
    basePlanes = [];
  }

  function addToScene() {
    planes.forEach((plane) => scene.add(plane));
    basePlanes.forEach((plane) => scene.add(plane));
  }

  function updateVisibility() {
    const { wall } = edge;
    // setup camera
    const position = controls.object.position.clone();
    const wallCenter = wall.getWallCenter();
    const focus = new THREE.Vector3(wallCenter.x, 0, wallCenter.y);

    // update visible
    if (Core.Configuration.getBooleanValue(Core.configShellMode))
      scope.visible = true;
    else {
      if (!wall.checkIsOutsideWall()) scope.visible = true;
      else {
        const point = wall.findInsideRoomPoint();
        // console.log(point, wallCenter);
        if (point && position) {
          const l1 = position.distanceTo(focus);
          const l2 = position.distanceTo(
            new THREE.Vector3(point.x, 0, point.y)
          );
          if (l1 < l2) scope.visible = false;
          else scope.visible = true;
        } else {
          scope.visible = true;
        }
      }
    }

    const opacity = wall.isObstacleWall ? 0.6 : visible ? 1 : 0.3;

    const transparent = opacity === 1 ? false : true;
    // show or hide planes
    [...basePlanes, ...planes].forEach((p) => {
      p.visible = scope.visible;
      p.material.opacity = opacity;
      p.material.transparent = transparent;
      p.material.depthWrite = !transparent;
      wall.items.forEach((item) => (item.forceVisible = !transparent));
    });

    updateObjectVisibility();
  }

  function updateObjectVisibility() {
    wall.items.forEach((item) => {
      item.updateEdgeVisibility(scope.visible, front);
    });
    wall.onItems.forEach((item) => {
      item.updateEdgeVisibility(scope.visible, front);
    });
  }

  function updateHelperVisibility() {
    // const visible = Core.Configuration.getBooleanValue(
    //   Core.configDimensionVisible
    // );
  }

  function updateTexture(callback) {
    // callback is fired when texture loads
    callback =
      callback ||
      function () {
        scene.needsUpdate = true;
      };
    (() => {
      const interiorTextureData = edge.getTexture(true);
      const { url, width, height } = interiorTextureData;

      interiorTexture = new THREE.TextureLoader().load(url);
      interiorTexture.wrapS = THREE.RepeatWrapping;
      interiorTexture.wrapT = THREE.RepeatWrapping;

      const textureWidth = width || 1;
      const textureHeight = height || 1;
      interiorTexture.repeat.set(1 / textureWidth, 1 / textureHeight);
    })();

    (() => {
      const exteriorTextureData = edge.getTexture(false);
      const { url, width, height } = exteriorTextureData;

      exteriorTexture = new THREE.TextureLoader().load(url);
      exteriorTexture.wrapS = THREE.RepeatWrapping;
      exteriorTexture.wrapT = THREE.RepeatWrapping;

      const textureWidth = width || 1;
      const textureHeight = height || 1;
      exteriorTexture.repeat.set(1 / textureWidth, 1 / textureHeight);
    })();
  }

  function updatePlanes() {
    if (wall.hasRoofInteraction) {
      // interior/exterior start heights
      const iSH = interiorStartHeight;
      const eSH = exteriorStartHeight;

      // interior/exterior end heights
      const iEH = interiorEndHeight;
      const eEH = exteriorEndHeight;

      startHeight = Math.min(Math.min(iSH, eSH), wall.height);
      endHeight = Math.min(Math.min(iEH, eEH), wall.height);
    }

    fillerMaterial = new THREE.MeshBasicMaterial({
      color: mainColor,
      side: THREE.DoubleSide,
      transparent: true,
      clippingPlanes: [],
      clipShadows: true,
    });

    interiorMaterial = new THREE.MeshPhongMaterial({
      color: wall.isObstacleWall ? obstacleColor : mainColor,
      side: THREE.BackSide,
      clippingPlanes: [],
      clipShadows: true,
      transparent: true,
      opacity: wall.isObstacleWall ? 0.6 : 1,
    });

    // interior plane
    let res = makeWall(
      edge.interiorStart(),
      edge.interiorEnd(),
      edge.interiorTransform,
      edge.invInteriorTransform,
      interiorMaterial,
      [interiorStartHeight, interiorEndHeight]
    );
    edge.setInteriorWallPoints(res.points.map((p) => p.clone()));

    const interiorPlane = res.mesh;
    interiorPlane.isInterior = true;
    interiorPlane.isExterior = false;
    interiorPlane.material.map = interiorTexture;

    exteriorMaterial = interiorMaterial.clone();
    exteriorMaterial.side = THREE.FrontSide;

    // exterior plane
    res = makeWall(
      edge.exteriorStart(),
      edge.exteriorEnd(),
      edge.exteriorTransform,
      edge.invExteriorTransform,
      exteriorMaterial,
      [exteriorStartHeight, exteriorEndHeight]
    );
    edge.setExteriorWallPoints(res.points.map((p) => p.clone()));

    edge.adjustWallPoints();

    const exteriorPlane = res.mesh;
    exteriorPlane.isInterior = false;
    exteriorPlane.isExterior = true;
    exteriorPlane.material.map = exteriorTexture;

    planes.push(exteriorPlane, interiorPlane);

    // bottom
    basePlanes.push(buildFiller(edge, 0));

    // top
    planes.push(buildFiller(edge, wall.height));

    // sides
    [
      [edge.interiorStart(), edge.midStart(), startHeight],
      [edge.midStart(), edge.exteriorStart(), startHeight],
      [edge.interiorEnd(), edge.midEnd(), endHeight],
      [edge.midEnd(), edge.exteriorEnd(), endHeight],
    ].forEach((sides) =>
      planes.push(buildSideFillter(sides[0], sides[1], sides[2]))
    );
  }

  function getHoles(transform, v1, v2, v3, v4) {
    const holes = [];
    wall.items.forEach((item) => {
      const boundingBox = item.getBounding();

      // var pos = item.position.clone();
      const pos = new THREE.Vector3(
        (boundingBox.max.x + boundingBox.min.x) / 2,
        (boundingBox.max.y + boundingBox.min.y) / 2,
        (boundingBox.max.z + boundingBox.min.z) / 2
      );

      pos.applyMatrix4(transform);
      const halfSize = item.halfSize.clone();
      const delta = 0.01;
      halfSize.x -= delta;
      halfSize.y -= delta;
      const min = halfSize.clone().multiplyScalar(-1);
      const max = halfSize.clone();
      min.add(pos);
      max.add(pos);

      const holePoints = [
        new THREE.Vector2(min.x, min.y - offset),
        new THREE.Vector2(max.x, min.y - offset),
        new THREE.Vector2(max.x, max.y - offset),
        new THREE.Vector2(min.x, max.y - offset),
      ];

      holes.push(new THREE.Path(holePoints));
    });
    return holes;
  }

  function reducePoints(points) {
    // const log = wall.start.x === -6 && wall.start.y === -6;
    const tolerance = 1e-3;
    const length = points.length;
    if (points[length - 1].y === 0 && points[length - 2].y === 0) {
      points[0].x = points[length - 1].x = points[length - 2].x;
      points[0].z = points[length - 1].z = points[length - 2].z;
    }
    if (points[2].y === 0 && points[3].y === 0) {
      points[1].x = points[2].x = points[3].x;
      points[1].z = points[2].z = points[3].z;
    }

    function removeDuplicates(points) {
      const newPoints = [];
      points.forEach((p) => {
        let exist = false;
        for (const c of newPoints) {
          if (p.distanceTo(c) < tolerance) {
            exist = true;
            break;
          }
        }
        !exist && newPoints.push(p.clone());
      });
      return newPoints;
    }

    const res = removeDuplicates(points);
    return res;
  }

  // start, end have x and y attributes (i.e. corners)
  function makeWall(start, end, transform, invTransform, material, heights) {
    // const log = wall.start.x === -6 && wall.start.y === -6;
    const v1 = toVec3(start);
    const v2 = toVec3(end);
    const v3 = v2.clone();
    const v4 = v1.clone();
    v3.y = wall.height;
    v4.y = wall.height;

    const position = v1.clone().add(v3).multiplyScalar(0.5);
    position.y = offset;

    const clipPoints = getClipPoints(v1, v2, v3, v4);
    v3.y = heights[1];
    v4.y = heights[0];
    const points = reducePoints([v1, v2, v3, ...clipPoints, v4]);

    const resPoints = points.map((p) => p.clone());

    points.forEach((p) => p.applyMatrix4(transform));

    const shapePoints = points.map((p) => new THREE.Vector2(p.x, p.y));
    const shape = new THREE.Shape(shapePoints);

    // add holes for each wall item
    shape.holes.push(...getHoles(transform, v1, v2, v3, v4));

    const geometry = new THREE.ShapeGeometry(shape);

    const matrix = new THREE.Matrix4();
    matrix.makeTranslation(-position.x, 0, -position.z);
    geometry.vertices.forEach((v) => {
      v.applyMatrix4(invTransform);
      v.applyMatrix4(matrix);
    });

    // make UVs
    geometry.faceVertexUvs[0] = [];

    function vertexToUv(v) {
      const pos = position;
      const x = Core.Utils.distance(v1.x - pos.x, v1.z - pos.z, v.x, v.z);
      const y = v.y;
      return new THREE.Vector2(x, y);
    }

    geometry.faces.forEach((face) => {
      const vertA = geometry.vertices[face.a];
      const vertB = geometry.vertices[face.b];
      const vertC = geometry.vertices[face.c];
      geometry.faceVertexUvs[0].push([
        vertexToUv(vertA),
        vertexToUv(vertB),
        vertexToUv(vertC),
      ]);
    });

    geometry.faceVertexUvs[1] = geometry.faceVertexUvs[0];

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.updateMatrixWorld();

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    // mesh.renderOrder = 10;

    mesh.edge = edge;
    mesh.threeEdge = scope;
    return { mesh, points: resPoints };
  }

  function buildSideFillter(p1, p2, height) {
    const points = [
      toVec3(p1),
      toVec3(p2),
      toVec3(p2, height),
      toVec3(p1, height),
    ];

    const position = points[0].clone().add(points[2]).multiplyScalar(0.5);

    position.y += offset;

    const geometry = new THREE.Geometry();

    const matrix = new THREE.Matrix4();
    matrix.makeTranslation(-position.x, -height / 2, -position.z);
    points.forEach((p) => {
      p.applyMatrix4(matrix);
      geometry.vertices.push(p);
    });
    geometry.faces.push(new THREE.Face3(0, 1, 2));
    geometry.faces.push(new THREE.Face3(0, 2, 3));

    const filler = new THREE.Mesh(geometry, fillerMaterial);
    filler.castShadow = true;
    filler.receiveShadow = true;
    filler.position.copy(position);
    return filler;
  }

  function buildFiller(edge, height) {
    const points = [
      toVec2(edge.exteriorStart()),
      toVec2(edge.exteriorEnd()),
      toVec2(edge.midEnd()),
      toVec2(edge.interiorEnd()),
      toVec2(edge.interiorStart()),
      toVec2(edge.midStart()),
    ];

    const pos = new THREE.Vector2();
    points.forEach((p) => {
      pos.x += p.x;
      pos.y += p.y;
    });
    pos.multiplyScalar(1 / points.length);

    const position = new THREE.Vector3(pos.x, height + offset, pos.y);

    for (const p of points) {
      p.x -= pos.x;
      p.y -= pos.y;
    }

    const shape = new THREE.Shape(points);
    const geometry = new THREE.ShapeGeometry(shape);

    const filler = new THREE.Mesh(geometry, fillerMaterial);
    filler.castShadow = true;
    filler.receiveShadow = true;
    filler.rotation.set(Math.PI / 2, 0, 0);
    filler.position.copy(position);
    return filler;
  }

  function toVec2(pos) {
    return new THREE.Vector2(pos.x, pos.y);
  }

  function toVec3(pos, height) {
    height = height || 0;
    return new THREE.Vector3(pos.x, height, pos.y);
  }

  init();
};
