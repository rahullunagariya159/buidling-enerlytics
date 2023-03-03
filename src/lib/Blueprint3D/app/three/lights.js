import * as THREE from "three";

export function Lights(scene, floorplan) {
  const height = 50;

  let dirLight;

  this.getDirLight = () => {
    return dirLight;
  };

  this.updateSunPosition = (azimuth, altitude) => {
    const y = height * Math.sin(altitude);
    const x = -height * Math.cos(altitude) * Math.sin(azimuth);
    const z = height * Math.cos(altitude) * Math.cos(azimuth);
    if (altitude < 0) dirLight.visible = false;
    else dirLight.visible = true;
    dirLight.position.set(x, y, z);
    // helper.update();
  };

  function init() {
    const light = new THREE.HemisphereLight(0xffffff, 0x888888, 1);
    scene.add(light);

    dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(0, height, 0);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.left = 50;
    dirLight.shadow.camera.right = -50;
    dirLight.shadow.camera.bottom = -50;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.radius = 1.4;
    dirLight.shadow.bias = -0.005;
    dirLight.visible = true;
    dirLight.shadowCameraVisible = false;
    dirLight.castShadow = true;

    let t = new THREE.Object3D();
    dirLight.target = t;

    scene.add(dirLight);
    scene.add(dirLight.target);
  }

  init();
}
