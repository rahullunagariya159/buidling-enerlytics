import Core from "../core";
import { Floor } from "./floor";
import { Edge } from "./edge";
import { RoofEdge } from "./roofEdge";
import { RoofVertexHelper } from "./roofVertex";
import { RoofFace } from "./roofFace";
import { DeadSpace } from "./deadSpace";

export var Floorplan = function (scene, floorplan, controls) {
  const scope = this;

  this.ground = null;
  this.compass = null;

  this.scene = scene;
  this.floorplan = floorplan;
  this.controls = controls;

  this.floors = [];
  this.edges = [];
  this.obstacleEdges = [];

  this.roofEdges = [];
  this.roofVertices = [];
  this.roofFaces = [];

  this.deadSpace = null;

  function init() {
    floorplan.fireOnUpdatedRooms(redraw);
    floorplan.fireOnActiveLayerChanged(highlightActiveLayer);
  }

  function highlightActiveLayer(index) {
    scope.floors.forEach((floor) => {
      let highlight = false;
      if (floor.layer.layerIndex === index) {
        highlight = true;
      }
      floor.setHighlight(highlight);
    });
    scope.edges.forEach((edge) => {
      let highlight = false;
      if (edge.layer.layerIndex === index) {
        highlight = true;
      }
      edge.setHighlight(highlight);
    });
  }

  function clear() {
    if (scope.controller) scope.controller.resetTransformControl();
    // clear scene
    scope.floors.forEach((floor) => floor.removeFromScene());
    [...scope.edges, ...scope.obstacleEdges].forEach((edge) => edge.remove());

    scope.roofEdges.forEach((roofEdge) => roofEdge.remove());
    scope.roofVertices.forEach((vertex) => vertex.remove());
    scope.roofFaces.forEach((face) => face.remove());

    scope.floors = [];
    scope.edges = [];
    scope.roofEdges = [];
    scope.roofVertices = [];
    scope.roofFaces = [];

    scope.deadSpace && scope.deadSpace.remove();
    scope.deadSpace = null;
  }

  function redraw() {
    clear();
    const { buildingOffset } = floorplan;

    // draw roof edges
    scope.floorplan.roofEdges().forEach((roofEdge) => {
      const threeRoofEdge = new RoofEdge(
        scene,
        roofEdge,
        roofEdge.offset + buildingOffset
      );
      scope.roofEdges.push(threeRoofEdge);
    });
    scene.roofEdges = scope.roofEdges;

    // draw roof vertices
    scope.floorplan.roofVertices().forEach((vertex) => {
      const threeRoofVertex = new RoofVertexHelper(
        scene,
        vertex,
        vertex.offset + buildingOffset
      );
      scope.roofVertices.push(threeRoofVertex);
    });
    scene.roofVertices = scope.roofVertices;

    // draw roof faces
    scope.floorplan.roofFaces().forEach((face) => {
      face.offset = buildingOffset;
      const threeRoofFace = new RoofFace(scene, face, scope.controls);
      scope.roofFaces.push(threeRoofFace);
    });

    const clipPlanes = [];
    const roofLines = [];
    const roofFaces = [];
    scope.roofFaces.forEach((face) => {
      face.plane && clipPlanes.push(face.plane);
      roofFaces.push(face.mesh);
      roofLines.push(...face.interactionLines);
    });

    const roofData = {
      clipPlanes,
      roofFaces,
      roofLines,
    };

    let higestLayerOffset = 0;

    // draw edges
    scope.floorplan.wallEdges().forEach((edge) => {
      const { layer } = edge.wall;
      let visible = false;
      layer.getRooms().forEach((room) => {
        if (room.visible && room.walls.includes(edge.wall)) {
          visible = true;
        }
      });
      const threeEdge = new Edge(
        scene,
        edge,
        scope.controls,
        edge.layerOffset + buildingOffset,
        layer,
        roofData,
        visible
      );
      scope.edges.push(threeEdge);
    });

    // draw floors
    scope.floorplan.getRooms().forEach((room) => {
      const tmp = room.offset + buildingOffset + room.height;
      if (tmp > higestLayerOffset) higestLayerOffset = tmp;

      const threeFloor = new Floor(
        scene,
        room,
        room.offset + buildingOffset,
        room.height,
        room.layer,
        roofData,
        room.visible
      );
      scope.floors.push(threeFloor);
      threeFloor.addToScene();
    });

    // draw dead space
    scope.deadSpace = new DeadSpace(
      scene,
      scope.floorplan.roofLayer,
      higestLayerOffset,
      roofFaces,
      scope.floorplan.getRooms()
    );

    // draw obstacle edges
    Core.Configuration.getBooleanValue(Core.configObstacleVisible) &&
      scope.floorplan.obstacleWallEdges().forEach((edge) => {
        const { layer } = edge.wall;
        const threeEdge = new Edge(scene, edge, scope.controls, 0, layer);
        scope.obstacleEdges.push(threeEdge);
      });

    highlightActiveLayer(floorplan.activeLayerIndex);
  }

  init();
};
