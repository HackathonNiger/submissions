'use client';

import { useState, useEffect } from 'react';
import {  AnimatePresence } from 'framer-motion';
import CelebrationWrapper from './CelebrationWrapper';

export function DiamondCelebration({ onClose }: { onClose?: () => void }) {
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
          shape={<planeGeometry args={[1, 1]} />}
          color="#B9F2FF"
          emissive="#40E0D0"
          confettiColors={['#B9F2FF', '#00CED1', '#40E0D0']}
          title="Radiance Unmatched!"
          highlight="Diamond League"
          subtitle="A true gem shines brightest 💎"
          onClose={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
        />
      )}
    </AnimatePresence>
  );
}