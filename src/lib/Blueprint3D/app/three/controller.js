import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import Core from "../core";
import { RoofEditorMode } from "./roof";
import RoofItem from "../items/roof_item";

const states = {
  UNSELECTED: 0, // no object selected
  SELECTED: 1, // selected but inactive
  DRAGGING: 2, // performing an action while mouse depressed
  ROTATING: 3, // rotating with mouse down
  ROTATING_FREE: 4, // rotating with mouse up
  PANNING: 5,
};

export var Controller = function (
  three,
  model,
  camera,
  element,
  controls,
  hud,
  roof
) {
  const scope = this;
  this.enabled = true;
  const { scene, floorplan } = model;

  let plane; // ground plane used for intersection testing

  let mouse;
  let intersectedObject;
  let intersected;
  let mouseoverObject;
  let selectedObject;

  let mouseDown = false;
  let mouseMoved = false; // has mouse moved since down click

  let rotateMouseOver = false;
  let isDragging = false;

  let transformControl = new TransformControls(camera, element);

  this.transformControl = transformControl;
  transformControl.addEventListener(
    "dragging-changed",
    (event) => (controls.enabled = !event.value)
  );
  transformControl.addEventListener("change", (event) => {
    if (isDragging && !transformControl.dragging && transformControl.object) {
      const object = transformControl.object;
      scope.resetTransformControl();
      object.moved_callback();
    }
    isDragging = transformControl.dragging;
  });
  scene.add(transformControl);

  let state = states.UNSELECTED;

  this.needsUpdate = true;

  function init() {
    element.addEventListener("mousedown", mouseDownEvent);
    element.addEventListener("mouseup", mouseUpEvent);
    element.addEventListener("mousemove", mouseMoveEvent);

    mouse = new THREE.Vector2();

    scene.itemRemovedCallbacks.push(itemRemoved);
    scene.itemLoadedCallbacks.push(itemLoaded);
  }

  this.resetTransformControl = function () {
    transformControl.object && transformControl.detach(transformControl.object);
  };

  // invoked via callback when item is loaded
  function itemLoaded(item) {
    try {
      if (!item.position_set) {
        scope.setSelectedObject(item);
        switchState(states.DRAGGING);
        const pos = item.position.clone();
        pos.y = 0;
        const vec = three.projectVector(pos);
        clickPressed(vec);
        if (item.dimensionHelper) {
          item.dimensionHelper.position.copy(item.position);
        }
      }
      item.position_set = true;
    } catch (_) {
      console.log(_);
    }
  }

  function clickPressed(vec2) {
    vec2 = vec2 || mouse;
    const intersection = scope.itemIntersection(mouse, selectedObject);
    if (intersection) {
      selectedObject.clickPressed(intersection);
    }
  }

  function clickDragged(vec2) {
    vec2 = vec2 || mouse;
    const intersection = scope.itemIntersection(mouse, selectedObject);
    if (intersection) {
      if (scope.isRotating()) {
        !Boolean(selectedObject.fixed) && selectedObject.rotate(intersection);
      } else {
        selectedObject.clickDragged(intersection);
      }
    }
  }

  function itemRemoved(item) {
    // invoked as a callback to event in Scene
    if (item === selectedObject) {
      selectedObject && selectedObject.setUnselected();
      selectedObject.mouseOff();
      scope.setSelectedObject(null);
    }
  }

  function checkWallsAndFloors(event) {
    if (event.buttons !== 1) return;

    // double click on a wall or floor brings up texture change modal
    if (state === states.UNSELECTED && !mouseoverObject) {
      // check floors
      const floors = [];
      const edges = [];
      const roofs = [];

      three.floorplan.floors.forEach((floor) => {
        floor.setHighlight(false);
        floors.push(floor.getPlane());
      });
      three.floorplan.edges.forEach((edge) => {
        edge.setHighlight(false);
        edges.push(...edge.getPlanes());
      });
      three.floorplan.roofFaces.forEach((roof) => {
        // roof.setHighlight(false);
        roofs.push(roof.mesh);
      });

      const intersects = scope.getIntersections(
        mouse,
        [...edges, ...floors, ...roofs],
        false
      );
      if (intersects.length > 0) {
        const { object } = intersects[0];
        const { room, edge } = object;
        if (room) {
          object.threeFloor.setHighlight(true);
          three.floorClicked.forEach((cb) => cb(room));
          return;
        } else if (edge) {
          object.threeEdge.setHighlight(true);
          const { isInterior, isExterior } = object;
          edge.isInterior = isInterior;
          edge.isExterior = isExterior;
          three.wallClicked.forEach((cb) => cb(edge));
          return;
        } else if (roof) {
          // console.log('IN_ROOF_');
          // object.threeEdge.setHighlight(true);
          three.roofClicked.forEach((cb) => cb(roof));
        }
      }

      // three.nothingClicked.fire();
      three.nothingClicked.forEach((cb) => typeof cb === "function" && cb());
    }
  }

  function checkRoof(event) {
    if (event.buttons !== 1) return;
    if (roof.mode === RoofEditorMode.ADD_VERTEX) {
      if (intersected && intersectedObject) {
        const delta = 0;
        let edge = null;
        if (intersectedObject.isLine) {
          edge = intersectedObject.roofEdge;
        }
        scope.resetTransformControl();
        // add roof vertex
        const { x, y, z } = intersected.point;
        roof.addVertex(x, y - delta, z, edge);
        floorplan.update(false);
        three.roof.setMode(RoofEditorMode.MOVE);
      }
    } else if (roof.mode === RoofEditorMode.CREATE_EDGE) {
      if (
        selectedObject &&
        intersectedObject &&
        selectedObject !== intersectedObject
      ) {
        scope.resetTransformControl();
        const tmp = selectedObject;
        scope.setSelectedObject(intersectedObject);
        roof.addEdge(tmp, selectedObject);
        // scope.resetTransformControl();
        floorplan.update(false);
      }
    } else if (roof.mode === RoofEditorMode.MOVE) {
      if (intersectedObject && intersectedObject.forRoof) {
        intersectedObject.isMesh && transformControl.attach(intersectedObject);
      }
    } else if (roof.mode === RoofEditorMode.DELETE) {
      if (intersectedObject && intersectedObject.forRoof) {
        scope.resetTransformControl();
        intersectedObject.roofVertex &&
          intersectedObject.roofVertex.removeAll();

        intersectedObject.roofEdge && intersectedObject.roofEdge.remove();
        intersectedObject = null;
        floorplan.update(false);
      }
    }
    scope.setSelectedObject(intersectedObject);
  }

  function mouseMoveEvent(event) {
    if (Core.Configuration.getBooleanValue(Core.configSceneLocked)) return;
    if (scope.enabled) {
      event.preventDefault();

      mouseMoved = true;

      mouse.x = event.offsetX;
      mouse.y = event.offsetY;

      if (!mouseDown) {
        updateIntersections();
      }

      switch (state) {
        case states.UNSELECTED:
          updateMouseover();
          break;
        case states.SELECTED:
          updateMouseover();
          break;
        case states.DRAGGING:
        case states.ROTATING:
        case states.ROTATING_FREE:
          clickDragged();
          hud.update();
          scope.needsUpdate = true;
          break;
        default:
          break;
      }
    }
  }

  function mouseDownEvent(event) {
    if (Core.Configuration.getBooleanValue(Core.configSceneLocked)) return;
    if (scope.enabled) {
      event.preventDefault();

      mouseMoved = false;
      mouseDown = true;

      if (roof.enabled) {
        checkRoof(event);
        return;
      }

      switch (state) {
        case states.SELECTED:
          if (rotateMouseOver) {
            switchState(states.ROTATING);
          } else if (intersectedObject != null) {
            scope.setSelectedObject(intersectedObject);
            if (!intersectedObject.fixed) {
              switchState(states.DRAGGING);
            }
          } else if (intersectedObject === null && !mouseMoved) {
            switchState(states.UNSELECTED);
            checkWallsAndFloors(event);
          }
          break;
        case states.UNSELECTED:
          if (intersectedObject != null) {
            scope.setSelectedObject(intersectedObject);
            if (!intersectedObject.fixed) {
              switchState(states.DRAGGING);
            }
          }
          if (!mouseMoved) {
            checkWallsAndFloors(event);
          }
          break;
        case states.DRAGGING:
          if (selectedObject && event.button !== 0) {
            // console.log('asdf')
            // cancel add object
            selectedObject.remove();
            selectedObject = null;
            switchState(states.SELECTED);
            floorplan.update(false);
          }
          break;
        case states.ROTATING:
          break;
        case states.ROTATING_FREE:
          switchState(states.SELECTED);
          break;
        default:
          break;
      }
    }
  }

  function mouseUpEvent(event) {
    if (Core.Configuration.getBooleanValue(Core.configSceneLocked)) return;
    if (scope.enabled) {
      mouseDown = false;

      switch (state) {
        case states.DRAGGING:
          selectedObject.clickReleased();
          switchState(states.SELECTED);
          floorplan.update(false);
          break;
        case states.ROTATING:
          if (!mouseMoved) {
            switchState(states.ROTATING_FREE);
          } else {
            switchState(states.SELECTED);
          }
          break;
        case states.UNSELECTED:
          // if (!mouseMoved) {
          //   checkWallsAndFloors(event);
          // }
          break;
        case states.SELECTED:
          // if (intersectedObject === null && !mouseMoved) {
          //   switchState(states.UNSELECTED);
          //   checkWallsAndFloors(event);
          // }
          break;
        case states.ROTATING_FREE:
          break;
        default:
          break;
      }
    }
  }

  function switchState(newState) {
    if (newState !== state) {
      onExit(state);
      onEntry(newState);
    }
    state = newState;
    hud.setRotating(scope.isRotating());
  }

  function onEntry(state) {
    switch (state) {
      case states.UNSELECTED:
        scope.setSelectedObject(null);
        break;
      case states.SELECTED:
        controls.enabled = true;
        break;
      case states.ROTATING:
      case states.ROTATING_FREE:
        controls.enabled = false;
        break;
      case states.DRAGGING:
        three.setCursorStyle("move");
        clickPressed();
        controls.enabled = false;
        break;
      default:
        break;
    }
  }

  function onExit(state) {
    switch (state) {
      case states.UNSELECTED:
      case states.SELECTED:
        break;
      case states.DRAGGING:
        if (mouseoverObject) {
          three.setCursorStyle("pointer");
        } else {
          three.setCursorStyle("auto");
        }
        break;
      case states.ROTATING:
      case states.ROTATING_FREE:
        break;
      default:
        break;
    }
  }

  this.selectedObject = function () {
    return selectedObject;
  };

  this.isRotating = function () {
    return state === states.ROTATING || state === states.ROTATING_FREE;
  };

  // updates the vector of the intersection with the plane of a given
  // mouse position, and the intersected object
  // both may be set to null if no intersection found
  function updateIntersections() {
    // roof editor mode
    if (roof.enabled) {
      const roofEdges = model.scene.roofEdges.map((edge) => edge.mesh);
      const roofVertices = model.scene.roofVertices.map(
        (vertex) => vertex.mesh
      );
      const roofCeilings = three.floorplan.floors
        .map((floor) => floor.ceilingPlane)
        .sort((a, b) => b.position.y - a.position.y);

      const meshes = [...roofEdges, ...roofVertices];
      if (!roofEdges.length && roofCeilings.length) {
        meshes.push(roofCeilings[0]);
      }
      const intersects = scope.getIntersections(mouse, meshes, false, false);
      if (intersects.length > 0) {
        intersectedObject = intersects[0].object;
        intersected = intersects[0];
      } else {
        intersectedObject = null;
        intersected = intersects[0];
      }
    } else {
      // check the rotate arrow
      const hudObject = hud.getObject();
      if (hudObject != null) {
        const hudIntersects = scope.getIntersections(
          mouse,
          hudObject,
          false,
          false,
          true
        );
        if (hudIntersects.length > 0) {
          rotateMouseOver = true;
          hud.setMouseover(true);
          intersectedObject = null;
          return;
        }
      }
      rotateMouseOver = false;
      hud.setMouseover(false);

      // check objects
      const items = model.scene
        .getItems()
        .filter((item) => item instanceof RoofItem);
      let intersects = scope.getIntersections(mouse, items, false, true);

      if (intersects.length > 0) {
        intersectedObject = intersects[0].object;
      } else {
        intersectedObject = null;
      }
    }
  }

  // sets coords to -1 to 1
  function normalizeVector2(vec2) {
    const retVec = new THREE.Vector2();
    const rect = element.getBoundingClientRect();
    retVec.x = (vec2.x / rect.width) * 2 - 1;
    retVec.y = -(vec2.y / rect.height) * 2 + 1;
    return retVec;
  }

  //
  function mouseToVec3(vec2) {
    const normVec2 = normalizeVector2(vec2);
    const vector = new THREE.Vector3(normVec2.x, normVec2.y, 0.5);
    vector.unproject(camera);
    return vector;
  }

  // returns the first intersection object
  this.itemIntersection = function (vec2, item) {
    const customIntersections =
      typeof item.customIntersectionPlanes === "function"
        ? item.customIntersectionPlanes()
        : null;
    let intersections = null;
    if (customIntersections && customIntersections.length > 0) {
      intersections = this.getIntersections(vec2, customIntersections);
    } else {
      intersections = this.getIntersections(vec2, plane);
    }
    if (intersections.length > 0) {
      return intersections[0];
    }
    return null;
  };

  // filter by normals will only return objects facing the camera
  // objects can be an array of objects or a single object
  this.getIntersections = function (
    vec2,
    objects,
    filterByNormals,
    onlyVisible,
    recursive,
    linePrecision
  ) {
    // console.log('get intersection', objects);
    const vector = mouseToVec3(vec2);
    onlyVisible = onlyVisible || false;
    filterByNormals = filterByNormals || false;
    recursive = recursive || false;
    linePrecision = linePrecision || 0.25;

    const direction = vector.sub(camera.position).normalize();
    const raycaster = new THREE.Raycaster(camera.position, direction);
    // raycaster.linePrecision = linePrecision;
    raycaster.params.Line.threshold = linePrecision;

    // scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 1000, 0xff0000));
    let intersections;
    if (Array.isArray(objects)) {
      const meshes = [];
      objects.forEach((obj) =>
        obj.traverse((m) => {
          (m.isMesh || m.isLine) && meshes.push(m);
        })
      );
      intersections = raycaster.intersectObjects(meshes, recursive);
      intersections.forEach((item) => {
        if (item.object.isMesh && item.object.parent) {
          if (item.object.parent instanceof THREE.Scene) return;
          item.object.parent && (item.object = item.object.parent);
        }
      });
    } else {
      intersections = raycaster.intersectObject(objects, recursive);
    }
    // filter by visible, if true
    if (onlyVisible) {
      intersections = Core.Utils.removeIf(intersections, (intersection) => {
        return !intersection.object.visible;
      });
    }

    // filter by normals, if true
    if (filterByNormals) {
      intersections = Core.Utils.removeIf(intersections, (intersection) => {
        const dot = intersection.face.normal.dot(direction);
        return dot > 0;
      });
    }
    return intersections;
  };

  // manage the selected object
  this.setSelectedObject = function (object) {
    if (state === states.UNSELECTED) {
      switchState(states.SELECTED);
    }
    if (object != null) {
      if (object === selectedObject) return;
      else {
        selectedObject &&
          typeof selectedObject.setUnselected === "function" &&
          selectedObject.setUnselected();
        model.scene.roofVertices
          .map((vertex) => vertex.mesh)
          .forEach((object) => object.setUnselected());

        selectedObject = object;
        selectedObject &&
          typeof selectedObject.setSelected === "function" &&
          selectedObject.setSelected();

        if (!object.forRoof) {
          three.itemSelectedCallbacks.forEach((cb) => cb(object));
        } else {
          if (object.roofVertex) {
            three.roofVertexSelectedCallbacks.forEach((cb) =>
              cb(object.roofVertex)
            );
          }
        }
      }
    } else {
      // scope.resetTransformControl();

      selectedObject &&
        typeof selectedObject.setUnselected === "function" &&
        selectedObject.setUnselected();
      selectedObject = null;

      three.itemSelectedCallbacks.forEach((cb) => cb());
      three.roofVertexSelectedCallbacks.forEach((cb) => cb());
    }
    this.needsUpdate = true;
  };

  // TODO: there MUST be simpler logic for expressing this
  function updateMouseover() {
    if (intersectedObject != null) {
      if (mouseoverObject != null) {
        if (mouseoverObject !== intersectedObject) {
          typeof mouseoverObject.mouseOff === "function" &&
            mouseoverObject.mouseOff();
          mouseoverObject = intersectedObject;
          typeof mouseoverObject.mouseOver === "function" &&
            mouseoverObject.mouseOver();
          scope.needsUpdate = true;
        } else {
          // do nothing, mouseover already set
        }
      } else {
        mouseoverObject = intersectedObject;
        typeof mouseoverObject.mouseOver === "function" &&
          mouseoverObject.mouseOver();
        three.setCursorStyle("pointer");
        scope.needsUpdate = true;
      }
    } else if (mouseoverObject != null) {
      typeof mouseoverObject.mouseOff === "function" &&
        mouseoverObject.mouseOff();
      three.setCursorStyle("auto");
      mouseoverObject = null;
      scope.needsUpdate = true;
    }
  }

  init();
};
