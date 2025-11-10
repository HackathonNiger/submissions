'use client';

import { useState, useEffect } from 'react';
import {  AnimatePresence } from 'framer-motion';
import CelebrationWrapper from '@/components/ui/leagueBadge/CelebrationWrapper';

export function GoldCelebration({ onClose }: { onClose?: () => void }) {
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
          shape={<icosahedronGeometry args={[1, 0]} />}
          color="#FFD700"
          emissive="#FFA500"
          confettiColors={['#FFD700', '#FFF700', '#FFA500']}
          title="Excellence Achieved!"
          highlight="Gold League"
          subtitle="A shining star of success 🌟"
          onClose={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
        />
      )}
    </AnimatePresence>
  );
}