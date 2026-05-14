"use client";

import { useEffect, useRef, useState } from "react";
import * as CANNON from "cannon-es";
import * as THREE from "three";

const COLORS = ["#60F0E4", "#48B8FF", "#6CF6B8", "#A776FF", "#FF5E75"];

function createWall(size: [number, number, number], position: [number, number, number]) {
  const body = new CANNON.Body({ mass: 0 });
  body.addShape(new CANNON.Box(new CANNON.Vec3(size[0] / 2, size[1] / 2, size[2] / 2)));
  body.position.set(position[0], position[1], position[2]);
  return body;
}

function createFaceTexture(index: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;

  const context = canvas.getContext("2d");
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(2, 8, 14, 0.62)";
    context.beginPath();
    context.arc(44, 50, 6, 0, Math.PI * 2);
    context.arc(84, 50, 6, 0, Math.PI * 2);
    context.fill();

    const isSmile = index % 3 !== 0;
    context.strokeStyle = "rgba(2, 8, 14, 0.58)";
    context.lineWidth = 7;
    context.lineCap = "round";
    context.beginPath();
    context.arc(
      64,
      isSmile ? 66 : 82,
      23,
      isSmile ? 0.18 * Math.PI : 1.12 * Math.PI,
      isSmile ? 0.82 * Math.PI : 1.88 * Math.PI,
    );
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function PhysicsSphereLab() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const resetRef = useRef<() => void>(() => undefined);
  const [sphereCount, setSphereCount] = useState(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#020306", 0.045);

    const camera = new THREE.PerspectiveCamera(36, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.75, 8.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x020306, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const world = new CANNON.World({
      allowSleep: true,
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });
    world.broadphase = new CANNON.SAPBroadphase(world);

    const sphereMaterial = new CANNON.Material("soft-glass");
    const contactMaterial = new CANNON.ContactMaterial(sphereMaterial, sphereMaterial, {
      contactEquationRelaxation: 4,
      friction: 0.22,
      restitution: 0.38,
    });
    world.defaultContactMaterial = contactMaterial;
    world.addContactMaterial(contactMaterial);

    const ambient = new THREE.HemisphereLight("#C8FFFF", "#110319", 2.4);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight("#FFFFFF", 3.2);
    keyLight.position.set(-4, 6, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight("#60F0E4", 40, 10, 1.8);
    cyanLight.position.set(0, -1.8, 3.5);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight("#7A5CFF", 22, 9, 2);
    violetLight.position.set(3.2, 2.4, 2.2);
    scene.add(violetLight);

    const chamber = new THREE.Group();
    scene.add(chamber);

    const floorMaterial = new THREE.MeshPhysicalMaterial({
      color: "#102923",
      metalness: 0.1,
      roughness: 0.28,
      transmission: 0.15,
      transparent: true,
      opacity: 0.55,
    });
    const wallMaterial = new THREE.MeshPhysicalMaterial({
      color: "#CFFFF8",
      metalness: 0,
      roughness: 0.12,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });

    const floor = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.08, 3.2), floorMaterial);
    floor.position.set(0, -2.55, 0);
    floor.receiveShadow = true;
    chamber.add(floor);

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 5.2), wallMaterial);
    backWall.position.set(0, 0.05, -1.65);
    chamber.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 5.2), wallMaterial);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-3.2, 0.05, 0);
    chamber.add(leftWall);

    const rightWall = leftWall.clone();
    rightWall.position.set(3.2, 0.05, 0);
    chamber.add(rightWall);

    const outline = new THREE.BoxHelper(
      new THREE.Mesh(new THREE.BoxGeometry(6.4, 5.2, 3.2)),
      "#9DFFF3",
    );
    outline.position.set(0, 0.05, 0);
    (outline.material as THREE.Material).transparent = true;
    (outline.material as THREE.Material).opacity = 0.22;
    chamber.add(outline);

    [
      createWall([6.4, 0.28, 3.2], [0, -2.72, 0]),
      createWall([0.28, 5.3, 3.2], [-3.34, 0.05, 0]),
      createWall([0.28, 5.3, 3.2], [3.34, 0.05, 0]),
      createWall([6.4, 5.3, 0.28], [0, 0.05, -1.78]),
      createWall([6.4, 5.3, 0.28], [0, 0.05, 1.78]),
    ].forEach((wall) => {
      wall.material = sphereMaterial;
      world.addBody(wall);
    });

    const sphereGeometry = new THREE.SphereGeometry(1, 42, 42);
    const faceGeometry = new THREE.CircleGeometry(0.58, 40);
    const spheres: Array<{ body: CANNON.Body; group: THREE.Group }> = [];

    const addSphere = (index: number) => {
      const radius = 0.22 + (index % 4) * 0.025;
      const color = COLORS[index % COLORS.length];
      const group = new THREE.Group();
      group.scale.setScalar(radius);

      const sphere = new THREE.Mesh(
        sphereGeometry,
        new THREE.MeshPhysicalMaterial({
          color,
          clearcoat: 1,
          clearcoatRoughness: 0.08,
          emissive: color,
          emissiveIntensity: 0.18,
          metalness: 0,
          roughness: 0.16,
          transmission: 0.18,
          transparent: true,
          opacity: 0.9,
        }),
      );
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      group.add(sphere);

      const highlight = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 24, 24),
        new THREE.MeshBasicMaterial({ color: "#FFFFFF", transparent: true, opacity: 0.34 }),
      );
      highlight.position.set(-0.32, 0.42, 0.62);
      highlight.scale.set(1.2, 0.62, 0.22);
      group.add(highlight);

      const face = new THREE.Mesh(
        faceGeometry,
        new THREE.MeshBasicMaterial({
          map: createFaceTexture(index),
          transparent: true,
          depthWrite: false,
        }),
      );
      face.position.set(0, -0.05, 0.88);
      group.add(face);

      const body = new CANNON.Body({
        angularDamping: 0.28,
        linearDamping: 0.06,
        mass: 1,
        material: sphereMaterial,
        shape: new CANNON.Sphere(radius),
      });
      body.position.set((Math.random() - 0.5) * 4.5, 2.9 + 3.8 * Math.random(), (Math.random() - 0.5) * 1.5);
      body.angularVelocity.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);

      world.addBody(body);
      scene.add(group);
      spheres.push({ body, group });
      setSphereCount(spheres.length);
    };

    const clearSpheres = () => {
      while (spheres.length) {
        const sphere = spheres.pop();
        if (sphere) {
          world.removeBody(sphere.body);
          scene.remove(sphere.group);
        }
      }
      setSphereCount(0);
    };

    const reset = () => {
      clearSpheres();
      for (let index = 0; index < 34; index += 1) {
        window.setTimeout(() => addSphere(index), 58 * index);
      }
    };

    resetRef.current = reset;
    reset();

    const clock = new THREE.Clock();
    let frame = 0;
    let animationId = 0;

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.033);
      world.step(1 / 60, delta, 4);

      for (const sphere of spheres) {
        sphere.group.position.copy(sphere.body.position as unknown as THREE.Vector3);
        sphere.group.quaternion.copy(sphere.body.quaternion as unknown as THREE.Quaternion);
      }

      cyanLight.intensity = 36 + 8 * Math.sin(0.018 * frame);
      violetLight.position.x = 3 + 0.7 * Math.sin(0.012 * frame);
      chamber.rotation.y = 0.035 * Math.sin(0.004 * frame);
      renderer.render(scene, camera);
      frame += 1;
      animationId = window.requestAnimationFrame(animate);
    };
    animate();

    const disturb = () => {
      for (const sphere of spheres) {
        sphere.body.applyImpulse(
          new CANNON.Vec3((Math.random() - 0.5) * 1.2, 0.75 + 0.35 * Math.random(), (Math.random() - 0.5) * 0.6),
          sphere.body.position,
        );
      }
    };

    renderer.domElement.addEventListener("pointerdown", disturb);

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("pointerdown", disturb);
      resetRef.current = () => undefined;
      clearSpheres();
      renderer.dispose();
      sphereGeometry.dispose();
      faceGeometry.dispose();
      floorMaterial.dispose();
      wallMaterial.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020306] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(96,240,228,0.2),transparent_34rem),radial-gradient(circle_at_76%_72%,rgba(122,92,255,0.2),transparent_32rem)]" />
      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.42em] text-cyan-200/80">FearGrid ver2</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-6xl">Gravity chamber</h1>
          </div>
          <button
            className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white/80 backdrop-blur-xl transition hover:bg-white/16"
            onClick={() => resetRef.current()}
            type="button"
          >
            Reset
          </button>
        </div>

        <div className="mt-8 grid flex-1 gap-5 lg:grid-cols-[1fr_16rem]">
          <div className="glass-border relative min-h-[34rem] overflow-hidden rounded-[2.25rem] bg-white/[0.045]">
            <div ref={mountRef} className="absolute inset-0" />
            <div className="pointer-events-none absolute inset-x-8 bottom-8 h-20 rounded-[50%] bg-cyan-300/25 blur-3xl" />
          </div>

          <aside className="glass-border flex flex-col justify-between rounded-[2rem] bg-white/[0.055] p-6 backdrop-blur-2xl">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.34em] text-cyan-200/70">Physics</p>
              <p className="mt-4 text-6xl font-semibold tabular-nums">{sphereCount}</p>
              <p className="mt-3 text-sm leading-6 text-white/58">spheres</p>
            </div>
            <div className="mt-8 space-y-4 text-sm leading-6 text-white/62">
              <p>Gravity, wall bounds, sphere collisions, rolling and stacking are running in real time.</p>
              <p className="text-white/42">Tap the chamber to disturb the pile.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
