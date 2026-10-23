import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { faceOf, type Win } from "@/lib/studio/constants";
import { registerCapture } from "@/lib/studio/capture";
import { createCove } from "@/lib/studio/geometry";
import { useStudio } from "@/lib/studio/store";
import { Pouch } from "@/components/studio/Pouch";

type OrbitCtl = {
  target: THREE.Vector3;
  update: () => void;
  addEventListener: (type: string, fn: () => void) => void;
  removeEventListener: (type: string, fn: () => void) => void;
};

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const hitPoint = new THREE.Vector3();
const floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

function bagIdOf(obj: THREE.Object3D | null): string | null {
  let o = obj;
  while (o) {
    const id = o.userData?.bagId;
    if (typeof id === "string") return id;
    o = o.parent;
  }
  return null;
}

function ndc(ev: PointerEvent, el: HTMLCanvasElement) {
  const r = el.getBoundingClientRect();
  pointer.x = ((ev.clientX - r.left) / Math.max(1, r.width)) * 2 - 1;
  pointer.y = -((ev.clientY - r.top) / Math.max(1, r.height)) * 2 + 1;
}

function CameraBridge() {
  const controls = useThree((s) => s.controls) as unknown as OrbitCtl | null;
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const applied = useRef(-1);

  useFrame(() => {
    const cam = useStudio.getState().camera;
    if (!controls || applied.current === cam.applyToken) return;
    applied.current = cam.applyToken;
    controls.target.set(cam.targetX, cam.targetY, cam.targetZ);
    const polar = (cam.polar * Math.PI) / 180;
    const az = (cam.azimuth * Math.PI) / 180;
    const sinP = Math.sin(polar);
    camera.position.set(
      cam.targetX + cam.radius * sinP * Math.sin(az),
      cam.targetY + cam.radius * Math.cos(polar),
      cam.targetZ + cam.radius * sinP * Math.cos(az),
    );
    controls.update();
  });

  useEffect(() => {
    if (!controls) return;
    const onEnd = () => {
      const t = controls.target;
      const dx = camera.position.x - t.x;
      const dy = camera.position.y - t.y;
      const dz = camera.position.z - t.z;
      const radius = Math.hypot(dx, dy, dz) || 1;
      const polar = (Math.acos(Math.min(1, Math.max(-1, dy / radius))) * 180) / Math.PI;
      let azimuth = (Math.atan2(dx, dz) * 180) / Math.PI;
      if (azimuth > 180) azimuth -= 360;
      if (azimuth < -180) azimuth += 360;
      useStudio.getState().syncView({
        azimuth,
        polar,
        radius,
        targetX: t.x,
        targetY: t.y,
        targetZ: t.z,
      });
    };
    controls.addEventListener("end", onEnd);
    return () => controls.removeEventListener("end", onEnd);
  }, [controls, camera]);

  return null;
}

function Interaction() {
  const { camera, gl, scene } = useThree();
  const grab = useRef({ x: 0, z: 0, id: "" });

  useEffect(() => {
    const el = gl.domElement;
    const onDown = (ev: PointerEvent) => {
      if (ev.button !== 0) return;
      ndc(ev, el);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      let id: string | null = null;
      for (const h of hits) {
        if (h.object.userData?.helper) continue;
        id = bagIdOf(h.object);
        if (id) break;
      }
      if (!id) return;
      const bag = useStudio.getState().bags.find((b) => b.id === id);
      if (!bag) return;
      if (raycaster.ray.intersectPlane(floor, hitPoint)) {
        grab.current = { x: bag.x - hitPoint.x, z: bag.z - hitPoint.z, id };
      } else {
        grab.current = { x: 0, z: 0, id };
      }
      useStudio.getState().beginDrag(id);
      ev.stopPropagation();
    };
    const onMove = (ev: PointerEvent) => {
      const s = useStudio.getState();
      if (!s.draggingId) return;
      ndc(ev, el);
      raycaster.setFromCamera(pointer, camera);
      if (!raycaster.ray.intersectPlane(floor, hitPoint)) return;
      s.moveBag(s.draggingId, hitPoint.x + grab.current.x, hitPoint.z + grab.current.z);
    };
    const onUp = () => {
      if (useStudio.getState().draggingId) useStudio.getState().endDrag();
    };
    el.addEventListener("pointerdown", onDown, true);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [camera, gl, scene]);

  return null;
}

function KeyLight() {
  const ref = useRef<THREE.DirectionalLight>(null);
  const azimuth = useStudio((s) => s.lightAzimuth);
  const elevation = useStudio((s) => s.lightElevation);
  const intensity = useStudio((s) => s.lightKey);
  const position = useMemo(() => {
    const az = (azimuth * Math.PI) / 180;
    const el = (elevation * Math.PI) / 180;
    const dist = 140;
    return [
      dist * Math.cos(el) * Math.sin(az),
      Math.max(18, dist * Math.sin(el)),
      dist * Math.cos(el) * Math.cos(az),
    ] as [number, number, number];
  }, [azimuth, elevation]);

  useEffect(() => {
    const light = ref.current;
    if (!light) return;
    light.target.position.set(0, 14, 0);
    light.parent?.add(light.target);
    light.target.updateMatrixWorld();
  }, [position]);

  return (
    <directionalLight
      ref={ref}
      position={position}
      intensity={intensity}
      color="#fff3e2"
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-near={8}
      shadow-camera-far={320}
      shadow-camera-left={-90}
      shadow-camera-right={90}
      shadow-camera-top={90}
      shadow-camera-bottom={-90}
      shadow-bias={-0.0004}
      shadow-normalBias={0.035}
    />
  );
}

function CoveMesh() {
  const geo = useMemo(() => createCove(), []);
  const bg = useStudio((s) => s.bg);
  const ref = useRef<THREE.Mesh>(null);
  useEffect(() => {
    const mesh = ref.current;
    if (mesh) mesh.userData.cove = true;
  }, []);
  return (
    <mesh ref={ref} geometry={geo} receiveShadow userData={{ cove: true }}>
      <meshStandardMaterial color={bg} roughness={0.93} metalness={0} />
    </mesh>
  );
}

function Shotter() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  useEffect(() => {
    return registerCapture((shot) => {
      const size = new THREE.Vector2();
      gl.getSize(size);
      const pr = gl.getPixelRatio();
      const prevAspect = camera.aspect;
      const prevBg = scene.background;
      const prevAlpha = gl.getClearAlpha();
      const prevClear = gl.getClearColor(new THREE.Color());
      const hidden: THREE.Object3D[] = [];
      scene.traverse((obj) => {
        if (shot.transparent && obj.userData?.cove && obj.visible) {
          obj.visible = false;
          hidden.push(obj);
        }
        if (obj.userData?.helper && obj.visible) {
          obj.visible = false;
          hidden.push(obj);
        }
      });
      if (shot.transparent) {
        scene.background = null;
        gl.setClearColor(0x000000, 0);
      }
      gl.setPixelRatio(1);
      gl.setSize(shot.w, shot.h, false);
      camera.aspect = shot.w / shot.h;
      camera.updateProjectionMatrix();
      gl.render(scene, camera);
      const url = gl.domElement.toDataURL("image/png");
      for (const obj of hidden) obj.visible = true;
      scene.background = prevBg;
      gl.setClearColor(prevClear, prevAlpha);
      camera.aspect = prevAspect;
      camera.updateProjectionMatrix();
      gl.setPixelRatio(pr);
      gl.setSize(size.x, size.y, false);
      const a = document.createElement("a");
      a.href = url;
      a.download = `oshan-${Date.now()}.png`;
      a.click();
    });
  }, [gl, scene, camera]);

  return null;
}

function World() {
  const bags = useStudio((s) => s.bags);
  const skins = useStudio((s) => s.skins);
  const selectedId = useStudio((s) => s.selectedId);
  const faceMode = useStudio((s) => s.faceMode);
  const windowOpen = useStudio((s) => s.windowOpen);
  const u0 = useStudio((s) => s.u0);
  const u1 = useStudio((s) => s.u1);
  const v0 = useStudio((s) => s.v0);
  const v1 = useStudio((s) => s.v1);
  const shakeToken = useStudio((s) => s.shakeToken);
  const autoRotate = useStudio((s) => s.autoRotate);
  const dragging = useStudio((s) => s.draggingId);
  const bg = useStudio((s) => s.bg);
  const fill = useStudio((s) => s.lightFill);
  const rim = useStudio((s) => s.lightRim);
  const face = faceOf(faceMode);
  const win: Win = { u0, u1, v0, v1 };

  return (
    <>
      <color attach="background" args={[bg]} />
      <CameraBridge />
      <Shotter />
      <ambientLight intensity={0.2} />
      <hemisphereLight color="#f7f4ec" groundColor="#6a655c" intensity={0.38} />
      <KeyLight />
      <directionalLight position={[-48, 28, 36]} intensity={fill} color="#e7eef8" />
      <directionalLight position={[12, 36, -70]} intensity={rim} color="#fff6e8" />
      <CoveMesh />
      {bags.map((bag) => (
        <Pouch
          key={bag.id}
          bag={bag}
          skin={skins[bag.id]}
          face={face}
          win={win}
          selected={bag.id === selectedId}
          windowOpen={windowOpen}
          shakeToken={shakeToken}
        />
      ))}
      <Suspense fallback={null}>
        <Environment frames={1} resolution={128} environmentIntensity={0.55}>
          <Lightformer form="rect" intensity={3.2} position={[0, 6, 2]} scale={[10, 4, 1]} color="#fffaf4" />
          <Lightformer form="rect" intensity={2.4} position={[5, 3, 4]} scale={[4, 6, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1.1} position={[-6, 2.5, 2]} scale={[3, 4, 1]} color="#e4ecff" />
        </Environment>
      </Suspense>
      <OrbitControls
        makeDefault
        enabled={!dragging}
        enableDamping
        dampingFactor={0.08}
        autoRotate={autoRotate && !dragging}
        autoRotateSpeed={0.7}
        minPolarAngle={0.18}
        maxPolarAngle={1.42}
        minDistance={42}
        maxDistance={220}
      />
      <Interaction />
    </>
  );
}

export function Stage() {
  const bg = useStudio((s) => s.bg);
  const dragging = useStudio((s) => s.draggingId);
  return (
    <div className={dragging ? "studio-view is-drag" : "studio-view"} style={{ background: bg }}>
      <Canvas
        shadows="soft"
        dpr={[1, 1.7]}
        camera={{ fov: 30, near: 0.4, far: 500, position: [42, 52, 96] }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.06;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <World />
      </Canvas>
      <div className="view-chip">بسته را بکشید تا جابه‌جا شود · زمینه را بکشید تا دوربین بچرخد</div>
    </div>
  );
}
