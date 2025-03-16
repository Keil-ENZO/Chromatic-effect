import { createBackground } from "@/meshes/background";
import { createDiamond } from "@/meshes/diamond";
import { addText } from "@/meshes/text";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    camera.position.z = 5;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const orbits = new OrbitControls(camera, renderer.domElement);

    const background = createBackground();
    scene.add(background);

    addText("Hello world !", scene);

    const diamond = createDiamond();
    scene.add(diamond.mesh);

    const renderTargetSize = 1024;
    const renderTarget = new THREE.WebGLRenderTarget(
      renderTargetSize,
      renderTargetSize
    );

    function map(
      value: number,
      inMin: number,
      inMax: number,
      outMin: number,
      outMax: number
    ): number {
      return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    const mouse = { x: 0, y: 0 };

    document.addEventListener("mousemove", function (event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
      requestAnimationFrame(animate);

      diamond.mesh.visible = false;

      renderer.setRenderTarget(renderTarget);
      renderer.render(scene, camera);

      renderer.setRenderTarget(null);
      diamond.mesh.visible = true;

      diamond.update(renderTarget.texture, camera);
      updateDiamondRotation();
      renderer.render(scene, camera);
    }

    animate();

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(2);
    }

    window.addEventListener("resize", onWindowResize);

    function updateDiamondRotation() {
      const maxRotationDegres = 80;
      const targetRotationX = map(
        mouse.y,
        -1,
        1,
        (-maxRotationDegres * Math.PI) / 180,
        (maxRotationDegres * Math.PI) / 180
      );
      const targetRotationY = map(
        mouse.x,
        -1,
        1,
        (maxRotationDegres * Math.PI) / 180,
        (-maxRotationDegres * Math.PI) / 180
      );

      const lerpFactor = 0.1;
      diamond.mesh.rotation.x +=
        (targetRotationX - diamond.mesh.rotation.x) * lerpFactor;
      diamond.mesh.rotation.y +=
        (targetRotationY - diamond.mesh.rotation.y) * lerpFactor;
    }

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", onWindowResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <div ref={mountRef} style={{ width: "100%", height: "100vh" }}></div>
    </div>
  );
}
