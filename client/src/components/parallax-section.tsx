import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export function ParallaxSection({ children, offset = 50, className = "" }: ParallaxSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

export function ParallaxBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <ParallaxSection offset={20} className="w-full h-full">
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-5" viewBox="0 0 100 100">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </ParallaxSection>
      
      <ParallaxSection offset={40} className="w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 rounded-full bg-primary/5 blur-3xl transform -translate-x-1/4" />
          <div className="w-96 h-96 rounded-full bg-purple-500/5 blur-3xl transform translate-x-1/4" />
        </div>
      </ParallaxSection>
    </div>
  );
}
