import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFluidProps {
  count?: number;
  spreadY?: number;
  startY?: number;
  mouseForce?: number;
  pointSize?: number;
  clusterDist?: boolean;
  isLight?: boolean;
}

const ParticleFluid: React.FC<ParticleFluidProps> = ({
  count = 18000,
  spreadY = 60,
  startY = 0,
  mouseForce = 2.0,
  pointSize = 45.0,
  clusterDist = true,
  isLight = false
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uMouseForce: { value: mouseForce },
    uPointSize: { value: pointSize },
    uIsLight: { value: isLight ? 1.0 : 0.0 }
  }), [mouseForce, pointSize]);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    
    // Viewport dimensions at z=0 with fov=60 and z=12
    const vHeight = 2.0 * 12.0 * Math.tan((60 * Math.PI / 180) / 2.0); // ~13.85
    // Assuming aspect ratio max ~2.5 for generous width
    const vWidth = vHeight * 2.5; // ~34.6

    for (let i = 0; i < count; i++) {
      if (clusterDist) {
        let r = 0;
        const u = Math.random();
        // Constrain cluster to be mostly visible (within r=15)
        if (u < 0.3) {
          r = Math.random() * 4; // Tight core
        } else if (u < 0.7) {
          r = Math.random() * 10; // Mid
        } else {
          r = Math.random() * 18; // Edges (visible on most monitors)
        }
        
        const theta = Math.random() * 2 * Math.PI;
        
        // Stretch horizontally a bit for wide screens
        pos[i * 3] = r * Math.cos(theta) * 1.5;
        pos[i * 3 + 1] = r * Math.sin(theta) + startY + (Math.random() - 0.5) * (spreadY * 0.5);
      } else {
        // Constrain linear spread to canvas bounds
        pos[i * 3] = (Math.random() - 0.5) * (vWidth * 1.5); 
        pos[i * 3 + 1] = startY + (Math.random() - 0.5) * spreadY;
      }
      
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      scl[i] = Math.pow(Math.random(), 3.0) * 1.5 + 0.2; 
    }
    return [pos, scl];
  }, [count, clusterDist, startY, spreadY]);

  useFrame((state) => {
    if (pointsRef.current) {
      (pointsRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime;
      
      // Smoothly interpolate the light mode uniform
      const targetLight = isLight ? 1.0 : 0.0;
      (pointsRef.current.material as THREE.ShaderMaterial).uniforms.uIsLight.value = THREE.MathUtils.lerp(
        (pointsRef.current.material as THREE.ShaderMaterial).uniforms.uIsLight.value,
        targetLight,
        0.05
      );
      
      // Smoothly interpolate mouse position
      uniforms.uMouse.value.x = THREE.MathUtils.lerp(uniforms.uMouse.value.x, mousePos.x * viewport.width / 2, 0.05);
      
      // Compensate for the system's translation to keep mouse interaction aligned with screen
      const mappedMouseY = mousePos.y * viewport.height / 2 - (scrollY * 0.015);
      uniforms.uMouse.value.y = THREE.MathUtils.lerp(uniforms.uMouse.value.y, mappedMouseY, 0.05);
      
      // Move the particle system based on scroll position!
      pointsRef.current.position.y = scrollY * 0.015;
    }
  });

  const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uMouseForce;
    uniform float uPointSize;
    uniform float uIsLight;
    attribute float aScale;
    varying vec3 vColor;
    varying float vAlpha;
    
    // Simplex noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g; g.x  = a0.x  * x0.x  + h.x  * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec3 pos = position;
      
      // Base fluid flow based on time and noise
      float speed = uTime * 0.15;
      vec2 noiseCoord = pos.xy * 0.2 + speed;
      
      float dx = snoise(noiseCoord);
      float dy = snoise(noiseCoord + vec2(100.0));
      float dz = snoise(noiseCoord + vec2(200.0));
      
      pos.x += dx * 1.5;
      pos.y += dy * 1.5;
      pos.z += dz * 1.5;

      // Ensure the mouse interaction accounts for particle relative space
      // Since the system is translated up when scrolling, but the mouse position remains in view space
      // For absolute exact mapping, uMouse should probably receive world coordinates 
      // but keeping it simple for the fluid displacement.
      
      vec2 mouseDist = pos.xy - uMouse;
      float dist = length(mouseDist);
      if (dist < 8.0) {
         float force = (8.0 - dist) / 8.0; 
         // push away horizontally and vertically
         pos.xy += normalize(mouseDist) * force * uMouseForce * 2.0;
         // push outwards on Z to give a 3D bubble effect
         pos.z += force * uMouseForce * 3.0; 
      }

      // Simple collision/boundary-clamping logic
      pos.x = clamp(pos.x, -35.0, 35.0);
      pos.y = clamp(pos.y, -400.0, 100.0);
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Scaling relative to viewport distance
      gl_PointSize = (uPointSize * aScale) * (1.0 / -mvPosition.z);
      
      // Interpolate colors based on mode
      vec3 darkCyan = vec3(0.0, 0.76, 1.0); // #00C2FF
      vec3 lightCyan = vec3(0.0, 0.53, 0.70); // #0088B3
      vColor = mix(darkCyan, lightCyan, uIsLight);
      
      vAlpha = aScale;
    }
  `;

  const fragmentShader = `
    uniform float uIsLight;
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      // Soft circle particle
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float alpha = (0.5 - dist) * 2.0 * vAlpha;
      
      // Black particles on white need more opacity to be visible than glowing cyan on black
      // Actually, lowering alpha helps dense clumps look voluminous instead of flat black.
      float finalAlpha = mix(alpha * 3.5, alpha * 2.0, uIsLight);
      finalAlpha = min(1.0, finalAlpha);
      
      gl_FragColor = vec4(vColor, finalAlpha);
    }
  `;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aScale"
          count={scales.length}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
};

export const TechBackground = () => {
  const [isLight, setIsLight] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check light mode
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsLight(document.documentElement.classList.contains('light'));
        }
      });
    });

    setIsLight(document.documentElement.classList.contains('light'));
    observer.observe(document.documentElement, { attributes: true });
    
    // Check mobile
    const mql = window.matchMedia('(max-width: 768px)');
    setIsMobile(mql.matches);
    const handleMql = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handleMql);

    return () => {
      observer.disconnect();
      mql.removeEventListener('change', handleMql);
    };
  }, []);

  // Total 300k on desktop, 100k on mobile
  const coreParticles = isMobile ? 30000 : 100000;
  const spreadParticles = isMobile ? 70000 : 200000;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {/* Deep dark gradient with minimal overlay */}
      <div className="absolute inset-0 bg-tasc-bg tech-bg-base" />
      <div className="absolute inset-0 bg-tasc-cyan opacity-[0.03] mix-blend-screen" />
      <div
        className="absolute inset-0 opacity-80 tech-bg-overlay bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-tasc-bg/60 to-tasc-bg"
      />
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }} gl={{ alpha: true, antialias: true }}>
        <fog attach="fog" args={[isLight ? '#FFFFFF' : '#070A0F', 5, 25]} />
        {/* Dense, highly interactive clump for the hero section */}
        <ParticleFluid 
          count={coreParticles} 
          spreadY={60} 
          startY={0} 
          mouseForce={2.0} 
          pointSize={18.0} 
          clusterDist={true} 
          isLight={isLight}
        />
        {/* Sparse, less interactive particles spread downwards for the rest of the site */}
        <ParticleFluid 
          count={spreadParticles} 
          spreadY={800} 
          startY={-350} 
          mouseForce={1.8} 
          pointSize={20.0} 
          clusterDist={false} 
          isLight={isLight}
        />
      </Canvas>
    </div>
  );
};
