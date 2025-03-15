import * as THREE from "three";
import { Mesh } from "three";
import fragment from "../shaders/glass/fragment.glsl";
import vertex from "../shaders/glass/vertex.glsl";

export function createDiamond(): {
  mesh: Mesh;
  update: (texture: THREE.Texture, camera: THREE.Camera) => void;
} {
  // set up the sphere
  const geometry = new THREE.OctahedronGeometry(2.5);

  // const material = new THREE.MeshPhysicalMaterial({
  //   roughness: 1.3,
  //   reflectivity: 0.1,
  //   transmission: 1,
  //   thickness: 10,
  //   color: 0xffffff,
  // });

  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      iChannel0: { value: null },
      uCameraPosition: { value: new THREE.Vector3() },
    },
  });

  const mesh = new THREE.Mesh(geometry, material);

  const update = (texture: THREE.Texture, camera: THREE.Camera) => {
    // mesh.rotation.x += 0.01 / 2;
    // mesh.rotation.y += 0.01 / 2;
    material.uniforms.iChannel0.value = texture;
    material.uniforms.uCameraPosition.value.copy(camera.position);
  };

  return { mesh, update };
}
