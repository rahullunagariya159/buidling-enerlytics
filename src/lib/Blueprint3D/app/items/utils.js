import * as THREE from "three";
import hull from "hull.js";
import concaveman from "concaveman";

export const strVerticalBlockExtended = "-ver-arr-ext-";
export const strHorizontalBlockExtended = "-hor-arr-ext-";

export const IgnorableMeshNames = ["grommet", "glide", "handle", "Box001"];
export const extendedIgnorableMeshNames = [
  "legs",
  "glass",
  strVerticalBlockExtended,
  strHorizontalBlockExtended,
];
export const colorPresets = {
  black: 0x121212,
  silver: 0xeeeeee,
  nickel: 0xeeee66,
};

export const getRealMorphValue = (object, index, value) => {
  const minStrRegex = /\(min(\d+)\)/g;
  const matches = minStrRegex.exec(object.name);
  if (matches && matches[1]) {
    const min = parseInt(matches[1]);
    const tmp = 5 + value * (300 - 5);
    value = (tmp - min) / (300 - min);
  }
  return value;
};

export const getCenterOfPolygon = (points) => {
  let center = new THREE.Vector3();
  points.forEach((point) => (center = center.add(point)));
  center = center.multiplyScalar(1 / points.length);
  return center;
};

export const checkLinkedFace = (face1, face2) => {
  let sameVertexCount = 0;
  for (const v1 of face1) {
    for (const v2 of face2) {
      if (checkSameVertex(v1, v2)) sameVertexCount++;
    }
  }
  return sameVertexCount > 0;
};

export const checkSameVertex = (v1, v2) => v1.distanceTo(v2) <= 0.001;

export const splitPolygon = (faces) => {
  let polygons = [];
  while (faces.length) {
    let connectedFaces = [];
    connectedFaces.push(faces[0]);
    faces.splice(0, 1);
    let linkedFaceId = -1;
    do {
      linkedFaceId = -1;
      for (let i = 0; i < faces.length; i++) {
        const face = faces[i];
        for (let j = 0; j < connectedFaces.length; j++) {
          const lastFace = connectedFaces[j];
          const isLinked = checkLinkedFace(lastFace, face);
          if (isLinked) {
            linkedFaceId = i;
            break;
          }
        }
        if (linkedFaceId >= 0) break;
      }
      if (linkedFaceId >= 0) {
        connectedFaces.push(faces[linkedFaceId]);
        faces.splice(linkedFaceId, 1);
      }
    } while (linkedFaceId >= 0);

    polygons.push(connectedFaces);
  }
  return polygons;
};

export const getVertexCollection = (
  mesh,
  meshList,
  ignoreDiffHeight = false,
  ignoreRotation = false,
  ignoreExtendedIgnorableMeshes = false
) => {
  const position = mesh.position;
  const corners = [];
  for (const item of meshList) {
    let skippable = false;
    const exclusiveMeshNames = [];
    exclusiveMeshNames.push(...IgnorableMeshNames);
    ignoreExtendedIgnorableMeshes &&
      exclusiveMeshNames.push(...extendedIgnorableMeshNames);

    exclusiveMeshNames.forEach((str) => {
      if (item.name.toLowerCase().includes(str)) skippable = true;
    });
    if (skippable) continue;
    const vector = [];
    item.geometry.attributes.position.array.forEach((item) =>
      vector.push(item)
    );
    try {
      if (Array.isArray(item.morphTargetInfluences)) {
        const morphingCount = item.morphTargetInfluences.length;
        for (var i = 0; i < morphingCount; i++) {
          const targetVector = item.geometry.morphAttributes.position[i].array;
          for (let j = 0; j < vector.length; j++) {
            vector[j] =
              vector[j] + targetVector[j] * item.morphTargetInfluences[i];
          }
        }
      }
    } catch (_) {}

    const points = [];
    for (i = 0; i < vector.length; i += 3) {
      const vec = new THREE.Vector3(vector[i], vector[i + 1], vector[i + 2]);

      const transform = new THREE.Matrix4();
      if (Math.abs(item.rotation.z) === Math.PI) vec.x *= -1;
      !ignoreRotation && transform.makeRotationY(mesh.rotation.y);

      vec.applyMatrix4(transform);
      vec.add(position);
      // vec.add(offset);

      points.push(vec);
    }
    const faces = [];
    for (i = 0; i < points.length; i += 3) {
      faces.push([points[i], points[i + 1], points[i + 2]]);
    }
    // auto split by polygon
    (() => {
      const polygons = splitPolygon(faces);
      polygons.forEach((polygon) => {
        const vertex = [];
        polygon.forEach((face) =>
          face.forEach((point) => {
            let exist = false;
            for (const p of vertex) {
              if (checkSameVertex(p, point)) {
                exist = true;
                break;
              }
              if (
                ignoreDiffHeight &&
                checkSameVertex(
                  new THREE.Vector3(p.x, 0, p.z),
                  new THREE.Vector3(point.x, 0, point.z)
                )
              ) {
                exist = true;
                break;
              }
            }
            !exist && vertex.push(point);
          })
        );
        corners.push(vertex);
      });
    })();
  }
  return corners;
};

export const getConcaveHullPoints = (points) => concaveman(points);
export const getConvexHullPoints = (points, index = 1) => hull(points, index);

export const getSnapPoints = (mesh, serialize) => {
  const corners = [];

  const vertexCollection = getVertexCollection(
    mesh,
    mesh.children,
    true,
    false,
    true
  );
  vertexCollection.forEach((points) => {
    let func = points.length < 16 ? getConvexHullPoints : getConcaveHullPoints;
    const hull = func(
      points.map((p) => {
        return [p.x, p.z];
      })
    );
    corners.push(hull.map((p) => ({ x: p[0], y: p[1] })));
  });

  if (serialize) {
    let res = [];
    corners.forEach((points) => (res = [...res, ...points]));
    return res;
  }

  return corners;
};

export const getBounding = (mesh, meshList = []) => {
  let minX = +Infinity;
  let minY = +Infinity;
  let minZ = +Infinity;

  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;

  meshList = meshList.length ? meshList : mesh.children;
  const vertexCollection = getVertexCollection(mesh, meshList, false, true);
  vertexCollection.forEach((points) => {
    points.forEach((vector) => {
      if (minX > vector.x) minX = vector.x;
      if (minY > vector.y) minY = vector.y;
      if (minZ > vector.z) minZ = vector.z;

      if (maxX < vector.x) maxX = vector.x;
      if (maxY < vector.y) maxY = vector.y;
      if (maxZ < vector.z) maxZ = vector.z;
    });
  });

  return {
    min: new THREE.Vector3(minX, minY, minZ),
    max: new THREE.Vector3(maxX, maxY, maxZ),
  };
};

export const updateUV = (morphData, meshList, morphUVs) => {
  for (const child of meshList) {
    child.geometry.attributes.uv.needsUpdate = true;
    const uv = child.geometry.attributes.uv.array;
    const originUV = child.geometryBackup.attributes.uv.array;

    for (var v = 0; v < originUV.length; v++) uv[v] = originUV[v];

    for (const morphIndex in morphData) {
      if (!morphUVs[morphIndex]) continue;
      let name = child.name;
      if (name.includes(strVerticalBlockExtended))
        name = name.split(strVerticalBlockExtended)[0];
      if (name.includes(strHorizontalBlockExtended))
        name = name.split(strHorizontalBlockExtended)[0];

      if (!Array.isArray(morphUVs[morphIndex][name])) continue;

      if (morphUVs[morphIndex][name].length === uv.length) {
        const morphValue = getRealMorphValue(
          child,
          morphIndex,
          morphData[morphIndex]
        );
        const targetUV = morphUVs[morphIndex][name];
        for (v in uv) {
          uv[v] += (targetUV[v] - originUV[v]) * morphValue;
        }
      }
    }
  }
};
