import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

export const HeroBackground3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || !checkWebGLSupport()) return;

    // Skip on small mobile screens to prevent GPU/context exhaustion
    if (window.innerWidth < 768) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;

    try {
      // Scene setup
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog('#050c14', 10, 25);

      // Camera setup
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.z = 15;

      // Renderer setup
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: false,
        powerPreference: 'low-power'
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      
      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);

      // Particles helper function
      const createParticleRing = (count: number, radius: number, colorStr: string) => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() * 2) - 1);
          const r = radius + (Math.random() - 0.5) * 1.5;

          positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = r * Math.cos(phi);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
          color: new THREE.Color(colorStr),
          size: 0.05,
          transparent: true,
          opacity: 0.6,
          depthWrite: false,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending
        });

        return new THREE.Points(geometry, material);
      };

      const ring1 = createParticleRing(400, 5, '#00f0ff');
      const ring2 = createParticleRing(250, 6, '#ffffff');
      const ring3 = createParticleRing(150, 7.5, '#00f0ff');

      scene.add(ring1);
      scene.add(ring2);
      scene.add(ring3);

      const handleResize = () => {
        if (!mountRef.current || !renderer) return;
        const width = document.documentElement.clientWidth;
        const height = window.innerHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize, { passive: true });

      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();

        ring1.rotation.x -= delta * 0.05;
        ring1.rotation.y -= delta * 0.075;

        ring2.rotation.x -= delta * 0.05 * -0.5;
        ring2.rotation.y -= delta * 0.075 * -0.5;

        ring3.rotation.x -= delta * 0.05 * 0.25;
        ring3.rotation.y -= delta * 0.075 * 0.25;

        if (renderer) {
          renderer.render(scene, camera);
        }
      };

      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        
        ring1.geometry.dispose();
        (ring1.material as THREE.PointsMaterial).dispose();
        ring2.geometry.dispose();
        (ring2.material as THREE.PointsMaterial).dispose();
        ring3.geometry.dispose();
        (ring3.material as THREE.PointsMaterial).dispose();

        if (renderer) {
          if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
            mountRef.current.removeChild(renderer.domElement);
          }
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn("HeroBackground3D initialization failed safely:", err);
      return;
    }
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 z-0 h-full w-full opacity-60 pointer-events-none mix-blend-screen overflow-hidden" 
    />
  );
};
