'use client';

import { useState, useEffect } from 'react';
import {  AnimatePresence } from 'framer-motion';
import CelebrationWrapper from './CelebrationWrapper';

export function BronzeCelebration({ onClose }: { onClose?: () => void }) {
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
          shape={<circleGeometry args={[1, 3]} />}
          color="#CD7F32"
          emissive="#B87333"
          confettiColors={['#CD7F32', '#DAA520', '#B87333']}
          title="Strength Forged!"
          highlight="Bronze League"
          subtitle="A foundation for greatness 🛡️"
          onClose={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
        />
      )}
    </AnimatePresence>
  );
}