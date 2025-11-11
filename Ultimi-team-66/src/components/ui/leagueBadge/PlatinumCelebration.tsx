'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import CelebrationWrapper from './CelebrationWrapper';

export function PlatinumCelebration({ onClose }: { onClose?: () => void }) {
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
          shape={<circleGeometry args={[1, 6]} />}
          color="#E5E4E2"
          emissive="#BEBEBE"
          confettiColors={['#E5E4E2', '#C0C0C0', '#D9D9D9']}
          title="Elite Status!"
          highlight="Platinum League"
          subtitle="Strength in rarity ⚙️"
          onClose={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
        />
      )}
    </AnimatePresence>
  );
}