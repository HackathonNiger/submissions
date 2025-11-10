'use client';

import { useState, useEffect } from 'react';
import {  AnimatePresence } from 'framer-motion';
import CelebrationWrapper from './CelebrationWrapper';

export function SilverCelebration({ onClose }: { onClose?: () => void }) {
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
          shape={<ringGeometry args={[0.5, 1, 64, 1, 0, Math.PI * 1.5]} />}
          color="#C0C0C0"
          emissive="#A9A9A9"
          confettiColors={['#C0C0C0', '#E5E5E5', '#D9D9D9']}
          title="Shining Bright!"
          highlight="Silver League"
          subtitle="Elegance carved by the moonlight 🌙"
          onClose={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
        />
      )}
    </AnimatePresence>
  );
}