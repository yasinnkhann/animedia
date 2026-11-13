'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface MotionItemProps extends HTMLMotionProps<'div'> {
  itemId: string;
}

const MotionItem = forwardRef<HTMLDivElement, MotionItemProps>(
  ({ itemId: _itemId, ...props }, ref) => {
    return <motion.div ref={ref} {...props} />;
  }
);

MotionItem.displayName = 'MotionItem';

export default MotionItem;
