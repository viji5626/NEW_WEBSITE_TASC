import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from './TextReveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  as?: React.ElementType;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  className, 
  delay = 0,
  yOffset = 40,
  as: Component = 'div' as any
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <Component ref={ref as any} className={cn("", className)}>
      <motion.div
        initial={{ opacity: 0, y: yOffset, rotateX: -15 }}
        animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: yOffset, rotateX: -15 }}
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 100,
          delay: delay
        }}
        style={{ transformOrigin: "bottom center", willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </Component>
  );
};
