import { Mesh, MeshBasicMaterial, Scene } from "three";
import {
  TextGeometry,
  TextGeometryParameters,
} from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

export function addText(text: string, scene: Scene): void {
  const fontLoader = new FontLoader();
  let mesh: Mesh;

  // Utiliser une URL de police par défaut de Three.js
  fontLoader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    (font) => {
      // Create text geometry
      const params: TextGeometryParameters = {
        font,
        size: 1,
        depth: 0.001,
        curveSegments: 12,
        bevelEnabled: false,
      };

      const textGeometry = new TextGeometry(text, params);

      textGeometry.computeBoundingBox();

      // Create a material for the text
      const textMaterial = new MeshBasicMaterial({ color: 0x000000 });

      // Create a mesh with the geometry and material
      mesh = new Mesh(textGeometry, textMaterial);

      // Utiliser une valeur par défaut pour la largeur de la fenêtre
      // ou récupérer la largeur actuelle si disponible
      const windowWidth =
        typeof window !== "undefined" ? window.innerWidth : 1920;
      const scale = (0.8 * windowWidth) / 951;

      // Scale and position the text mesh
      mesh.scale.set(scale, scale, scale);

      // Vérifier si boundingBox existe avant d'y accéder
      if (textGeometry.boundingBox) {
        mesh.position.set(
          (-textGeometry.boundingBox.max.x / 2) * scale,
          (-textGeometry.boundingBox.max.y / 2) * scale,
          -6
        );
      } else {
        mesh.position.set(0, 0, -6);
      }

      // Add the text mesh to the scene
      scene.add(mesh);
    }
  );
}
