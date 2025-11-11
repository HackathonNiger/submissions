'use client'

import { LeagueBadgeMesh } from "@/features/dashboard/components/league-badge-mesh";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export function LeagueBadge3D({ league }: { league: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.2], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 5]} intensity={1.2} />
      <LeagueBadgeMesh league={league} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </Canvas>
  );
}
