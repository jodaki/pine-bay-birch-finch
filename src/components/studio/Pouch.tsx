import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Cavity, Face, Win } from "@/lib/studio/constants";
import { beanCount } from "@/lib/studio/constants";
import { getPlasticNormal, getPouchGeos, getShadowTexture } from "@/lib/studio/geometry";
import {
  createBeans,
  getBeanGeo,
  getBeanMat,
  kickBeans,
  stepBeans,
  writeBeans,
  type Bean,
} from "@/lib/studio/beans";
import type { Bag, Skin } from "@/lib/studio/store";
import { useStudio } from "@/lib/studio/store";

const noopRaycast: THREE.Object3D["raycast"] = () => {};

function useTex(url?: string) {
  const ref = useRef<THREE.Texture | null>(null);
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!url) {
      ref.current?.dispose();
      ref.current = null;
      setTex(null);
      return;
    }
    let live = true;
    const loader = new THREE.TextureLoader();
    loader.load(url, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.needsUpdate = true;
      if (!live) {
        t.dispose();
        return;
      }
      ref.current?.dispose();
      ref.current = t;
      setTex(t);
    });
    return () => {
      live = false;
    };
  }, [url]);
  useEffect(
    () => () => {
      ref.current?.dispose();
      ref.current = null;
    },
    [],
  );
  return tex;
}

function plasticMat(opts: {
  map?: THREE.Texture | null;
  color: string;
  normal: THREE.Texture;
  alphaTest?: number;
  side?: THREE.Side;
}) {
  return new THREE.MeshPhysicalMaterial({
    map: opts.map ?? null,
    color: opts.map ? "#ffffff" : opts.color,
    roughness: 0.42,
    metalness: 0,
    clearcoat: 0.72,
    clearcoatRoughness: 0.24,
    sheen: 0.28,
    sheenColor: new THREE.Color("#ffffff"),
    sheenRoughness: 0.55,
    envMapIntensity: 0.72,
    normalMap: opts.normal,
    normalScale: new THREE.Vector2(0.28, 0.28),
    alphaTest: opts.alphaTest ?? 0,
    side: opts.side ?? THREE.FrontSide,
  });
}

function Beans({
  count,
  box,
  shakeToken,
}: {
  count: number;
  box: Cavity;
  shakeToken: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const beans = useRef<Bean[] | null>(null);
  const seen = useRef(shakeToken);
  const acc = useRef(0);
  const time = useRef(0);
  const boxRef = useRef(box);
  boxRef.current = box;
  const calm = useRef(false);
  if (!beans.current) beans.current = createBeans(count, box);

  useEffect(() => {
    calm.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    const list = beans.current;
    if (!mesh || !list) return;
    writeBeans(mesh, list);
    for (let i = 0; i < list.length; i += 1) {
      const color = list[i]?.color;
      if (color) mesh.setColorAt(i, color);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  useFrame((_, delta) => {
    const list = beans.current;
    const mesh = ref.current;
    if (!list || !mesh) return;
    if (shakeToken !== seen.current) {
      seen.current = shakeToken;
      kickBeans(list);
    }
    const dt = Math.min(delta, 0.05);
    acc.current += dt;
    let steps = 0;
    while (acc.current >= 1 / 60 && steps < 4) {
      stepBeans(list, 1 / 60, time.current, !calm.current, boxRef.current);
      acc.current -= 1 / 60;
      time.current += 1 / 60;
      steps += 1;
    }
    writeBeans(mesh, list);
  });

  return (
    <instancedMesh
      ref={ref}
      args={[getBeanGeo(), getBeanMat(), count]}
      dispose={null}
      castShadow={false}
      receiveShadow
      frustumCulled={false}
    />
  );
}

export function Pouch({
  bag,
  skin,
  face,
  win,
  selected,
  windowOpen,
  shakeToken,
}: {
  bag: Bag;
  skin?: Skin;
  face: Face;
  win: Win;
  selected: boolean;
  windowOpen: boolean;
  shakeToken: number;
}) {
  const geos = useMemo(() => getPouchGeos(face, win), [face, win]);
  const normal = useMemo(() => getPlasticNormal(), []);
  const shadow = useMemo(() => getShadowTexture(), []);
  const frontTex = useTex(skin?.front);
  const backTex = useTex(skin?.back);
  const side = skin?.side ?? "#5c8f14";
  const count = beanCount(face);
  const cavity = useMemo(() => {
    return {
      x0: -face.w * 0.42,
      x1: face.w * 0.42,
      y1: face.h * Math.min(0.52, win.v1 + 0.05),
      z0: -face.d * 0.28,
      z1: face.d * 0.55,
    };
  }, [face, win]);

  const frontMat = useMemo(
    () => plasticMat({ map: frontTex, color: side, normal, alphaTest: frontTex ? 0.4 : 0 }),
    [frontTex, side, normal],
  );
  const backMat = useMemo(
    () => plasticMat({ map: backTex, color: side, normal }),
    [backTex, side, normal],
  );
  const sideMat = useMemo(
    () => plasticMat({ color: side, normal, side: THREE.DoubleSide }),
    [side, normal],
  );
  useEffect(() => () => frontMat.dispose(), [frontMat]);
  useEffect(() => () => backMat.dispose(), [backMat]);
  useEffect(() => () => sideMat.dispose(), [sideMat]);

  const winW = (win.u1 - win.u0) * face.w;
  const winH = (win.v1 - win.v0) * face.h;
  const cx = ((win.u0 + win.u1) / 2 - 0.5) * face.w;
  const cy = ((win.v0 + win.v1) / 2) * face.h;

  return (
    <group
      userData={{ bagId: bag.id }}
      position={[bag.x, 0.02, bag.z]}
      rotation={[0, (bag.yaw * Math.PI) / 180, 0]}
    >
      <mesh geometry={geos.front} material={frontMat} castShadow dispose={null} />
      <mesh geometry={geos.back} material={backMat} castShadow dispose={null} />
      <mesh geometry={geos.left} material={sideMat} castShadow dispose={null} />
      <mesh geometry={geos.right} material={sideMat} castShadow dispose={null} />
      <mesh geometry={geos.bottom} material={sideMat} dispose={null} />
      {windowOpen ? (
        <mesh position={[cx, cy, -face.d * 0.18]} raycast={noopRaycast}>
          <planeGeometry args={[winW * 1.2, winH * 1.25]} />
          <meshStandardMaterial color="#141c12" roughness={1} />
        </mesh>
      ) : null}
      {windowOpen ? (
        <mesh geometry={geos.glass} dispose={null} renderOrder={2}>
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.16}
            roughness={0.08}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.15}
            envMapIntensity={1.3}
            depthWrite={false}
          />
        </mesh>
      ) : null}
      {windowOpen ? (
        <Beans key={`${bag.id}-${face.w}-${face.h}-${count}`} count={count} box={cavity} shakeToken={shakeToken} />
      ) : null}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0.3]}
        scale={[face.w * 0.78, face.d * 0.95, 1]}
        raycast={noopRaycast}
        userData={{ helper: true }}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      {selected ? (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.04, 0]}
          raycast={noopRaycast}
          userData={{ helper: true }}
        >
          <ringGeometry args={[face.w * 0.62, face.w * 0.7, 48]} />
          <meshBasicMaterial color="#c5de78" transparent opacity={0.95} depthWrite={false} toneMapped={false} />
        </mesh>
      ) : null}
    </group>
  );
}
