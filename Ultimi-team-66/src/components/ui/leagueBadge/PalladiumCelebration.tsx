'use client';

import { useState, useEffect } from 'react';
import {  AnimatePresence } from 'framer-motion';
import CelebrationWrapper from './CelebrationWrapper';

export function PalladiumCelebration({ onClose }: { onClose?: () => void }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 6000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <CelebrationWrapper
          shape={<circleGeometry args={[1, 8]} />}
          color="#CED0DD"
          emissive="#A9A9B3"
          confettiColors={['#CED0DD', '#D3D3E0', '#B0B0C0']}
          title="Rare Prestige!"
          highlight="Palladium League"
          subtitle="Durability meets uniqueness 🔷"
          onClose={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
        />
      )}
    </AnimatePresence>
  );
}