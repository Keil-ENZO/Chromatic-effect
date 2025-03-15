import * as THREE from "three";
import fragment from "../shaders/grid/fragment.glsl";
import vertex from "../shaders/grid/vertex.glsl";

export function createBackground() {
  const geometry = new THREE.SphereGeometry(20, 20, 20);
  // const material = new THREE.MeshBasicMaterial({
  //   color: 0xff00ff,
  //   side: THREE.DoubleSide,
  //   wireframe: true,
  // });

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uGridSize: { value: 10.0 },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}
