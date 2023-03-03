import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky";
export function Skybox(scene, renderer) {
  let sky;
  let sun;

  const options = {
    turbidity: 1,
    rayleigh: 0.558,
    mieCoefficient: 0.001,
    mieDirectionalG: 0.1,
    elevation: 90,
    azimuth: 180,
    exposure: 0.5,
  };

  function update() {
    const uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = options.turbidity;
    uniforms["rayleigh"].value = options.rayleigh;
    uniforms["mieCoefficient"].value = options.mieCoefficient;
    uniforms["mieDirectionalG"].value = options.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - options.elevation);
    const theta = THREE.MathUtils.degToRad(options.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    uniforms["sunPosition"].value.copy(sun);
  }

  this.updateSunPosition = (azimuth = Math.PI / 2, altitude = Math.PI) => {
    options.azimuth = -(azimuth / Math.PI) * 180;
    options.elevation = (altitude / Math.PI) * 180;
    update();
  };

  function init() {
    sky = new Sky();
    sky.scale.setScalar(1000);
    sky.position.y = -1;
    scene.add(sky);

    sun = new THREE.Vector3();

    update();
  }

  init();
}
