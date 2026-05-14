"use client";

import { useEffect, useRef, useState } from "react";
import * as CANNON from "cannon-es";
import * as THREE from "three";

type BallRecord = {
  body: CANNON.Body;
  mesh: THREE.Mesh;
};

const BALL_COLORS = ["#60F0E4", "#FF5E75", "#A776FF", "#6CF6B8", "#FFD166", "#48B8FF"];

function makeWall(size: [number, number, number], position: [number, number, number]) {
  const wall = new CANNON.Body({ mass: 0 });
  wall.addShape(new CANNON.Box(new CANNON.Vec3(size[0] / 2, size[1] / 2, size[2] / 2)));
  wall.position.set(position[0], position[1], position[2]);
  return wall;
}

type GravityCollisionSandboxProps = {
  eyebrow?: string;
  title?: string;
};

export function GravityCollisionSandbox({
  eyebrow = "ver2 sandbox",
  title = "Gravity collision test",
}: GravityCollisionSandboxProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const spawnRef = useRef<(amount?: number) => void>(() => undefined);
  const resetRef = useRef<() => void>(() => undefined);
  const shakeRef = useRef<() => void>(() => undefined);
  const gravityRef = useRef(-9.82);
  const [ballCount, setBallCount] = useState(0);
  const [gravity, setGravity] = useState(-9.82);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#05070B");
    scene.fog = new THREE.Fog("#05070B", 12, 30);

    const camera = new THREE.PerspectiveCamera(42, stage.clientWidth / stage.clientHeight, 0.1, 100);
    camera.position.set(0, 4.2, 12);
    camera.lookAt(0, 0.3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    stage.appendChild(renderer.domElement);

    const world = new CANNON.World({
      allowSleep: true,
      gravity: new CANNON.Vec3(0, gravityRef.current, 0),
    });
    world.broadphase = new CANNON.SAPBroadphase(world);
    (world.solver as CANNON.GSSolver).iterations = 10;

    const ballPhysics = new CANNON.Material("ball");
    const wallPhysics = new CANNON.Material("wall");
    world.addContactMaterial(
      new CANNON.ContactMaterial(ballPhysics, wallPhysics, {
        friction: 0.18,
        restitution: 0.72,
      }),
    );
    world.addContactMaterial(
      new CANNON.ContactMaterial(ballPhysics, ballPhysics, {
        friction: 0.08,
        restitution: 0.86,
      }),
    );

    scene.add(new THREE.HemisphereLight("#DFFFFF", "#140A2E", 2.8));

    const keyLight = new THREE.DirectionalLight("#FFFFFF", 4);
    keyLight.position.set(-4, 8, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight("#60F0E4", 42, 14, 1.8);
    cyanLight.position.set(0, 1.4, 4);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight("#A776FF", 30, 12, 2);
    violetLight.position.set(4, 3, 1);
    scene.add(violetLight);

    const floorMaterial = new THREE.MeshPhysicalMaterial({
      color: "#10242B",
      metalness: 0.15,
      roughness: 0.38,
      clearcoat: 0.35,
    });
    const wallMaterial = new THREE.MeshPhysicalMaterial({
      color: "#DFFFFA",
      transparent: true,
      opacity: 0.13,
      roughness: 0.08,
      side: THREE.DoubleSide,
    });
    const edgeMaterial = new THREE.LineBasicMaterial({ color: "#9DFFF3", transparent: true, opacity: 0.42 });

    const floor = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.16, 4.8), floorMaterial);
    floor.position.set(0, -2.75, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    const back = new THREE.Mesh(new THREE.PlaneGeometry(8.8, 5.8), wallMaterial);
    back.position.set(0, 0.1, -2.4);
    scene.add(back);

    const left = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 5.8), wallMaterial);
    left.rotation.y = Math.PI / 2;
    left.position.set(-4.4, 0.1, 0);
    scene.add(left);

    const right = left.clone();
    right.position.set(4.4, 0.1, 0);
    scene.add(right);

    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(8.8, 5.8, 4.8)), edgeMaterial);
    edges.position.set(0, 0.1, 0);
    scene.add(edges);

    [
      makeWall([8.8, 0.28, 4.8], [0, -2.88, 0]),
      makeWall([0.28, 5.8, 4.8], [-4.54, 0.1, 0]),
      makeWall([0.28, 5.8, 4.8], [4.54, 0.1, 0]),
      makeWall([8.8, 5.8, 0.28], [0, 0.1, -2.54]),
      makeWall([8.8, 5.8, 0.28], [0, 0.1, 2.54]),
    ].forEach((wall) => {
      wall.material = wallPhysics;
      world.addBody(wall);
    });

    const balls: BallRecord[] = [];
    const ballGeometry = new THREE.SphereGeometry(1, 48, 48);

    const updateCount = () => setBallCount(balls.length);

    const spawnBalls = (amount = 8) => {
      const startIndex = balls.length;
      for (let index = 0; index < amount; index += 1) {
        const ballIndex = startIndex + index;
        const radius = 0.22 + (ballIndex % 4) * 0.035;
        const color = BALL_COLORS[ballIndex % BALL_COLORS.length];

        const material = new THREE.MeshPhysicalMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.12,
          metalness: 0,
          roughness: 0.18,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
        });
        const mesh = new THREE.Mesh(ballGeometry, material);
        mesh.scale.setScalar(radius);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const body = new CANNON.Body({
          angularDamping: 0.12,
          linearDamping: 0.015,
          mass: Math.max(0.45, radius * 3),
          material: ballPhysics,
          shape: new CANNON.Sphere(radius),
        });
        body.position.set((Math.random() - 0.5) * 5.8, 2.2 + Math.random() * 3.6, (Math.random() - 0.5) * 1.8);
        body.velocity.set((Math.random() - 0.5) * 0.8, Math.random() * 0.25, (Math.random() - 0.5) * 0.45);
        body.angularVelocity.set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3);

        world.addBody(body);
        scene.add(mesh);
        balls.push({ body, mesh });
      }
      updateCount();
    };

    const clearBalls = () => {
      while (balls.length) {
        const ball = balls.pop();
        if (ball) {
          world.removeBody(ball.body);
          scene.remove(ball.mesh);
          (ball.mesh.material as THREE.Material).dispose();
        }
      }
      updateCount();
    };

    const reset = () => {
      clearBalls();
      spawnBalls(28);
    };

    const shake = () => {
      for (const ball of balls) {
        ball.body.applyImpulse(
          new CANNON.Vec3((Math.random() - 0.5) * 1.8, 1.3 + Math.random() * 0.9, (Math.random() - 0.5) * 1.1),
          ball.body.position,
        );
      }
    };

    spawnRef.current = spawnBalls;
    resetRef.current = reset;
    shakeRef.current = shake;
    reset();

    const clock = new THREE.Clock();
    let animationId = 0;
    let frame = 0;

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.033);
      world.gravity.set(0, gravityRef.current, 0);
      world.step(1 / 60, delta, 5);

      for (const ball of balls) {
        ball.mesh.position.copy(ball.body.position as unknown as THREE.Vector3);
        ball.mesh.quaternion.copy(ball.body.quaternion as unknown as THREE.Quaternion);
      }

      edges.rotation.y = Math.sin(frame * 0.004) * 0.018;
      cyanLight.intensity = 38 + Math.sin(frame * 0.02) * 6;
      renderer.render(scene, camera);
      frame += 1;
      animationId = window.requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      camera.aspect = stage.clientWidth / stage.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(stage.clientWidth, stage.clientHeight);
    };

    const disturb = () => shakeRef.current();
    renderer.domElement.addEventListener("pointerdown", disturb);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("pointerdown", disturb);
      spawnRef.current = () => undefined;
      resetRef.current = () => undefined;
      shakeRef.current = () => undefined;
      clearBalls();
      ballGeometry.dispose();
      floorMaterial.dispose();
      wallMaterial.dispose();
      edgeMaterial.dispose();
      renderer.dispose();
      stage.removeChild(renderer.domElement);
    };
  }, []);

  const handleGravityChange = (value: number) => {
    gravityRef.current = value;
    setGravity(value);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070B] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(96,240,228,0.18),transparent_32rem),radial-gradient(circle_at_80%_70%,rgba(255,94,117,0.16),transparent_30rem)]" />
      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-7 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-cyan-200/75">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-6xl">{title}</h1>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-full border border-white/15 bg-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/82 transition hover:bg-white/16"
              onClick={() => spawnRef.current(8)}
              type="button"
            >
              Drop
            </button>
            <button
              className="rounded-full border border-white/15 bg-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/82 transition hover:bg-white/16"
              onClick={() => shakeRef.current()}
              type="button"
            >
              Shake
            </button>
            <button
              className="rounded-full border border-white/15 bg-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/82 transition hover:bg-white/16"
              onClick={() => resetRef.current()}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-7 grid flex-1 gap-5 lg:grid-cols-[1fr_18rem]">
          <div className="glass-border relative min-h-[34rem] overflow-hidden rounded-[2rem] bg-white/[0.04]">
            <div ref={stageRef} className="absolute inset-0" />
            <div className="pointer-events-none absolute inset-x-8 bottom-8 h-20 rounded-[50%] bg-cyan-300/20 blur-3xl" />
          </div>

          <aside className="glass-border flex flex-col justify-between rounded-[2rem] bg-white/[0.055] p-6 backdrop-blur-2xl">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.34em] text-cyan-200/70">Physics</p>
              <p className="mt-4 text-6xl font-semibold tabular-nums">{ballCount}</p>
              <p className="mt-3 text-sm leading-6 text-white/58">active balls</p>
            </div>

            <div className="mt-8 space-y-5">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-white/46">Gravity</span>
                <input
                  className="mt-4 h-2 w-full accent-cyan-300"
                  max={-1}
                  min={-22}
                  onChange={(event) => handleGravityChange(Number(event.target.value))}
                  step={0.1}
                  type="range"
                  value={gravity}
                />
                <span className="mt-3 block text-sm font-semibold tabular-nums text-white/70">
                  {gravity.toFixed(1)} m/s²
                </span>
              </label>
              <div className="space-y-3 text-sm leading-6 text-white/62">
                <p>Three.js renders the chamber and balls.</p>
                <p>Cannon computes gravity, wall contacts, and sphere-to-sphere collision.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
