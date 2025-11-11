

import Box from '@/components/ui/box';
import React from 'react';
import Head from "next/head";


interface ComingSoonProps {
  text?: string;
}

const ComingSoon = ({ text }: ComingSoonProps) => {
  return (
    <Box className="dark:bg-[#18181b] flex item-center justify-center h-screen">
       <Head>
        <title>Ultimi Ai | Ultimi</title>
      </Head>
      <Box>
        <Box as="p" className="mt-[70px] text-center mb-4 text-[60px]">
          🚧
        </Box>
        <Box as="p" className="text-center">
          {text || 'Under Construction'}
        </Box>
      </Box>
    </Box>
  );
}

export default ComingSoon
