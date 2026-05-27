import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

gsap.registerPlugin(ScrollTrigger);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}

export const TextReveal: React.FC<TextRevealProps> = ({ 
  text, 
  className, 
  delay = 0,
  as: Component = 'div' as any 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Use querySelectorAll to find characters for animation
    const chars = containerRef.current.querySelectorAll('.char');
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 90%', 
        toggleActions: 'play none none none',
      }
    });

    gsap.set(chars, { y: 60, opacity: 0, rotateX: -60, transformOrigin: 'bottom center' });

    tl.to(chars, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.8,
      stagger: 0.02,
      ease: 'power3.out',
      delay: delay
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [delay]);

  const words = text.split(" ");

  return (
    <Component ref={containerRef as any} className={cn("flex flex-wrap", className)} style={{ perspective: '1000px' }}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="word inline-block mr-[0.25em] whitespace-nowrap">
          {word.split('').map((char, charIndex) => (
             <span key={charIndex} className="char inline-block opacity-0" style={{ transform: 'translateY(60px) rotateX(-60deg)' }}>{char}</span>
          ))}
        </span>
      ))}
    </Component>
  );
};
