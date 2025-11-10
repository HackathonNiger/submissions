// 'use client';

// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Confetti from 'react-confetti';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, Float } from '@react-three/drei';

// /* -----------------------------
//    🪙 Celebration Wrapper
// -------------------------------- */
// export default function CelebrationWrapper({
//   shape,
//   color,
//   emissive,
//   confettiColors,
//   title,
//   highlight,
//   subtitle,
//   onClose,
// }: {
//   shape: React.ReactNode;
//   // shape: THREE.BufferGeometry;
//   color: string;
//   emissive: string;
//   confettiColors: string[];
//   title: string;
//   highlight: string;
//   subtitle: string;
//   onClose: () => void;
// }) {
//   return (
//     <motion.div
//       className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md z-[9999] overflow-hidden"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       {/* 🎉 Confetti */}
//       <Confetti
//         width={typeof window !== 'undefined' ? window.innerWidth : 0}
//         height={typeof window !== 'undefined' ? window.innerHeight : 0}
//         recycle={false}
//         numberOfPieces={600}
//         gravity={0.2}
//         colors={confettiColors}
//       />

//       {/* 🪙 Medal Shape */}
//       <div className="w-[300px] h-[300px]">
//         <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
//           <ambientLight intensity={0.6} />
//           <directionalLight position={[2, 2, 5]} intensity={1.5} />
//           <Float speed={2} rotationIntensity={2} floatIntensity={2}>
//             <mesh>
//               {shape}
//               <meshStandardMaterial
//                 color={color}
//                 emissive={emissive}
//                 emissiveIntensity={0.6}
//                 metalness={1}
//                 roughness={0.3}
//               />
//             </mesh>
//           </Float>
//           <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
//         </Canvas>
//       </div>

//       {/* ✨ Messages */}
//       <motion.div
//         className="mt-10 text-center px-6"
//         initial={{ y: 30, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.8, duration: 0.8 }}
//       >
//         <h1 className="text-4xl md:text-5xl font-extrabold text-white animate-pulse drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]">
//           {title}
//         </h1>
//         <p className="mt-4 text-xl md:text-2xl font-semibold text-gray-200 drop-shadow-lg">
//           You’ve reached the <span className="font-extrabold">{highlight}</span>!
//         </p>
//         <p className="mt-3 text-lg md:text-xl text-gray-300 italic">{subtitle}</p>
//       </motion.div>

//       {/* ✅ Continue Button */}
//       <motion.button
//         className="mt-12 px-12 py-4 cursor-pointer bg-gradient-to-r from-green-500 to-green-700 text-white text-xl md:text-2xl font-semibold rounded-2xl shadow-[0_0_25px_rgba(34,197,94,0.6)] hover:scale-105 transition-all duration-300"
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 1.5, duration: 0.8 }}
//         onClick={onClose}
//       >
//         Continue
//       </motion.button>
//     </motion.div>
//   );
// }

// /* -----------------------------
//    🎉 League Components
// -------------------------------- */

// // 🥇 GOLD → Star (five-pointed illusion with two rotated tetrahedrons)
// export  function GoldCelebration({ onClose }: { onClose?: () => void }) {
//   const [visible, setVisible] = useState(true);
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setVisible(false);
//       if (onClose) onClose();
//     }, 6000);
//     return () => clearTimeout(t);
//   }, [onClose]);

//   return (
//     <AnimatePresence>
//       {visible && (
//         <CelebrationWrapper
//           shape={<icosahedronGeometry args={[1, 0]} />}
//   // shape={new THREE.IcosahedronGeometry(1, 0)}
//           color="#FFD700"
//           emissive="#FFA500"
//           confettiColors={['#FFD700', '#FFF700', '#FFA500']}
//           title="Excellence Achieved!"
//           highlight="Gold League"
//           subtitle="A shining star of success 🌟"
//           onClose={() => {
//             setVisible(false);
//             if (onClose) onClose();
//           }}
//         />
//       )}
//     </AnimatePresence>
//   );
// }

// // 🥈 SILVER → Crescent Moon (ring, inner cutout rotated)
// export  function SilverCelebration({ onClose }: { onClose?: () => void }) {
//   const [visible, setVisible] = useState(true);
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setVisible(false);
//       if (onClose) onClose();
//     }, 6000);
//     return () => clearTimeout(t);
//   }, [onClose]);

//   return (
//     <AnimatePresence>
//       {visible && (
//         <CelebrationWrapper
//           shape={<ringGeometry args={[0.5, 1, 64, 1, 0, Math.PI * 1.5]} />}
//           color="#C0C0C0"
//           emissive="#A9A9A9"
//           confettiColors={['#C0C0C0', '#E5E5E5', '#D9D9D9']}
//           title="Shining Bright!"
//           highlight="Silver League"
//           subtitle="Elegance carved by the moonlight 🌙"
//           onClose={() => {
//             setVisible(false);
//             if (onClose) onClose();
//           }}
//         />
//       )}
//     </AnimatePresence>
//   );
// }

// // 🏆 PLATINUM → Hexagon
// export  function PlatinumCelebration({ onClose }: { onClose?: () => void }) {
//   const [visible, setVisible] = useState(true);
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setVisible(false);
//       if (onClose) onClose();
//     }, 6000);
//     return () => clearTimeout(t);
//   }, [onClose]);

//   return (
//     <AnimatePresence>
//       {visible && (
//         <CelebrationWrapper
//           shape={<circleGeometry args={[1, 6]} />}
//           color="#E5E4E2"
//           emissive="#BEBEBE"
//           confettiColors={['#E5E4E2', '#C0C0C0', '#D9D9D9']}
//           title="Elite Status!"
//           highlight="Platinum League"
//           subtitle="Strength in rarity ⚙️"
//           onClose={() => {
//             setVisible(false);
//             if (onClose) onClose();
//           }}
//         />
//       )}
//     </AnimatePresence>
//   );
// }

// // 🪙 PALLADIUM → Octagon
// export  function PalladiumCelebration({ onClose }: { onClose?: () => void }) {
//   const [visible, setVisible] = useState(true);
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setVisible(false);
//       if (onClose) onClose();
//     }, 6000);
//     return () => clearTimeout(t);
//   }, [onClose]);

//   return (
//     <AnimatePresence>
//       {visible && (
//         <CelebrationWrapper
//           shape={<circleGeometry args={[1, 8]} />}
//           color="#CED0DD"
//           emissive="#A9A9B3"
//           confettiColors={['#CED0DD', '#D3D3E0', '#B0B0C0']}
//           title="Rare Prestige!"
//           highlight="Palladium League"
//           subtitle="Durability meets uniqueness 🔷"
//           onClose={() => {
//             setVisible(false);
//             if (onClose) onClose();
//           }}
//         />
//       )}
//     </AnimatePresence>
//   );
// }

// // 💎 DIAMOND → Kite (diamond shape from plane scaled)
// export  function DiamondCelebration({ onClose }: { onClose?: () => void }) {
//   const [visible, setVisible] = useState(true);
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setVisible(false);
//       if (onClose) onClose();
//     }, 6000);
//     return () => clearTimeout(t);
//   }, [onClose]);

//   return (
//     <AnimatePresence>
//       {visible && (
//         <CelebrationWrapper
//           shape={<planeGeometry args={[1, 1]} />}
//           color="#B9F2FF"
//           emissive="#40E0D0"
//           confettiColors={['#B9F2FF', '#00CED1', '#40E0D0']}
//           title="Radiance Unmatched!"
//           highlight="Diamond League"
//           subtitle="A true gem shines brightest 💎"
//           onClose={() => {
//             setVisible(false);
//             if (onClose) onClose();
//           }}
//         />
//       )}
//     </AnimatePresence>
//   );
// }

// // 🥉 BRONZE → Triangle
// export  function BronzeCelebration({ onClose }: { onClose?: () => void }) {
//   const [visible, setVisible] = useState(true);
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setVisible(false);
//       if (onClose) onClose();
//     }, 6000);
//     return () => clearTimeout(t);
//   }, [onClose]);

//   return (
//     <AnimatePresence>
//       {visible && (
//         <CelebrationWrapper
//           shape={<circleGeometry args={[1, 3]} />}
//           color="#CD7F32"
//           emissive="#B87333"
//           confettiColors={['#CD7F32', '#DAA520', '#B87333']}
//           title="Strength Forged!"
//           highlight="Bronze League"
//           subtitle="A foundation for greatness 🛡️"
//           onClose={() => {
//             setVisible(false);
//             if (onClose) onClose();
//           }}
//         />
//       )}
//     </AnimatePresence>
//   );
// }



'use client';

import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';

export default function CelebrationWrapper({
  shape,
  color,
  emissive,
  confettiColors,
  title,
  highlight,
  subtitle,
  onClose,
}: {
  shape: React.ReactNode;
  color: string;
  emissive: string;
  confettiColors: string[];
  title: string;
  highlight: string;
  subtitle: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md z-[9999] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 🎉 Confetti */}
      <Confetti
        width={typeof window !== 'undefined' ? window.innerWidth : 0}
        height={typeof window !== 'undefined' ? window.innerHeight : 0}
        recycle={false}
        numberOfPieces={600}
        gravity={0.2}
        colors={confettiColors}
      />

      {/* 🪙 Medal Shape */}
      <div className="w-[300px] h-[300px]">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 2, 5]} intensity={1.5} />
          <Float speed={2} rotationIntensity={2} floatIntensity={2}>
            <mesh>
              {shape}
              <meshStandardMaterial
                color={color}
                emissive={emissive}
                emissiveIntensity={0.6}
                metalness={1}
                roughness={0.3}
              />
            </mesh>
          </Float>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
        </Canvas>
      </div>

      {/* ✨ Messages */}
      <motion.div
        className="mt-10 text-center px-6"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white animate-pulse drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]">
          {title}
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-semibold text-gray-200 drop-shadow-lg">
          You’ve reached the <span className="font-extrabold">{highlight}</span>!
        </p>
        <p className="mt-3 text-lg md:text-xl text-gray-300 italic">{subtitle}</p>
      </motion.div>

      {/* ✅ Continue Button */}
      <motion.button
        className="mt-12 px-12 py-4 cursor-pointer bg-gradient-to-r from-green-500 to-green-700 text-white text-xl md:text-2xl font-semibold rounded-2xl shadow-[0_0_25px_rgba(34,197,94,0.6)] hover:scale-105 transition-all duration-300"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        onClick={onClose}
      >
        Continue
      </motion.button>
    </motion.div>
  );
}