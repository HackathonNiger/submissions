// 'use client'

// import * as React from 'react'
// import { cn } from '@/lib/utils'

// interface BoxProps extends React.HTMLAttributes<HTMLElement> {
//   as?: React.ElementType
//   className?: string
//   children?: React.ReactNode
// }

// const Box = React.forwardRef<HTMLElement, BoxProps>(({ as: Component = 'div', className, children, ...props }, ref) => {
//   return (
//     <Component ref={ref} className={cn(className)} {...props}>
//       {children}
//     </Component>
//   )
// })

// Box.displayName = 'Box'

// export default Box


import React, { ElementType, ComponentPropsWithoutRef, forwardRef } from 'react';

type BoxProps<C extends ElementType> = {
  as?: C;
  children?: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<C>, keyof { as?: C; children?: React.ReactNode }>;

const Box = forwardRef<HTMLElement, BoxProps<ElementType>>(
  ({ as: Component = 'div', children, ...props }, ref) => {
    return (
      <Component ref={ref} {...props}>
        {children}
      </Component>
    );
  }
);

Box.displayName = 'Box';
export default Box;
