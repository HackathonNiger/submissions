'use client'

import { LEAGUE_THRESHOLDS } from '@/schema/dashboard/leagues';
import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function LeagueBadgeMesh({ league }: { league: string }) {
  const meshRef =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>>(null);
  const leagueData =
    LEAGUE_THRESHOLDS.find(l => l.league === league) || LEAGUE_THRESHOLDS[0];
  const { color, emissive } = leagueData;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.75;
      meshRef.current.rotation.x += delta * 0.3;
    }
  });

  return (
    <Float speed={1.3} rotationIntensity={1} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          metalness={0.9}
          roughness={0.25}
          color={color}
          emissive={emissive}
          emissiveIntensity={0.35}
        />
      </mesh>
    </Float>
  );
}