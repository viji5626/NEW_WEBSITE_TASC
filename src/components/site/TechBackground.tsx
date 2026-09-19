import React, { useRef, useMemo, useEffect, useState, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Safe WebGL Detection
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

// Inner Canvas Error Boundary
interface CanvasErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}
interface CanvasErrorBoundaryState {
  hasError: boolean;
}
class CanvasErrorBoundary extends Component<CanvasErrorBoundaryProps, CanvasErrorBoundaryState> {
  state: CanvasErrorBoundaryState = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("Canvas WebGL error suppressed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

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
  const scrollYRef = useRef(0);
  const mousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
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
    const safeCount = Math.min(count, 40000); // Guard max memory per system
    const pos = new Float32Array(safeCount * 3);
    const scl = new Float32Array(safeCount);
    
    const vHeight = 2.0 * 12.0 * Math.tan((60 * Math.PI / 180) / 2.0); // ~13.85
    const vWidth = vHeight * 2.5; // ~34.6

    for (let i = 0; i < safeCount; i++) {
      if (clusterDist) {
        let r = 0;
        const u = Math.random();
        if (u < 0.3) {
          r = Math.random() * 4;
        } else if (u < 0.7) {
          r = Math.random() * 10;
        } else {
          r = Math.random() * 18;
        }
        
        const theta = Math.random() * 2 * Math.PI;
        pos[i * 3] = r * Math.cos(theta) * 1.5;
        pos[i * 3 + 1] = r * Math.sin(theta) + startY + (Math.random() - 0.5) * (spreadY * 0.5);
      } else {
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
      const mat = pointsRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = state.clock.elapsedTime;
      
      const targetLight = isLight ? 1.0 : 0.0;
      mat.uniforms.uIsLight.value = THREE.MathUtils.lerp(
        mat.uniforms.uIsLight.value,
        targetLight,
        0.05
      );
      
      const mouse = mousePosRef.current;
      const scrollY = scrollYRef.current;
      const { viewport } = state;
      
      uniforms.uMouse.value.x = THREE.MathUtils.lerp(uniforms.uMouse.value.x, mouse.x * viewport.width / 2, 0.05);
      const mappedMouseY = mouse.y * viewport.height / 2 - (scrollY * 0.015);
      uniforms.uMouse.value.y = THREE.MathUtils.lerp(uniforms.uMouse.value.y, mappedMouseY, 0.05);
      
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
      float speed = uTime * 0.15;
      vec2 noiseCoord = pos.xy * 0.2 + speed;
      
      float dx = snoise(noiseCoord);
      float dy = snoise(noiseCoord + vec2(100.0));
      float dz = snoise(noiseCoord + vec2(200.0));
      
      pos.x += dx * 1.5;
      pos.y += dy * 1.5;
      pos.z += dz * 1.5;

      vec2 mouseDist = pos.xy - uMouse;
      float dist = length(mouseDist);
      if (dist < 8.0) {
         float force = (8.0 - dist) / 8.0; 
         pos.xy += normalize(mouseDist) * force * uMouseForce * 2.0;
         pos.z += force * uMouseForce * 3.0; 
      }

      pos.x = clamp(pos.x, -35.0, 35.0);
      pos.y = clamp(pos.y, -400.0, 100.0);
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      gl_PointSize = (uPointSize * aScale) * (1.0 / max(0.1, -mvPosition.z));
      
      vec3 darkCyan = vec3(0.0, 0.76, 1.0);
      vec3 lightCyan = vec3(0.0, 0.53, 0.70);
      vColor = mix(darkCyan, lightCyan, uIsLight);
      vAlpha = aScale;
    }
  `;

  const fragmentShader = `
    precision highp float;
    uniform float uIsLight;
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float alpha = (0.5 - dist) * 2.0 * vAlpha;
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

export const TechBackground: React.FC = () => {
  const [isLight, setIsLight] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    return false;
  });

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsLight(document.documentElement.classList.contains('light'));
        }
      });
    });

    setIsLight(document.documentElement.classList.contains('light'));
    observer.observe(document.documentElement, { attributes: true });
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };

    window.addEventListener('resize', checkMobile, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {/* Deep dark gradient with minimal overlay */}
      <div className="absolute inset-0 bg-tasc-bg tech-bg-base" />
      <div className="absolute inset-0 bg-tasc-cyan opacity-[0.03] mix-blend-screen" />
      <div
        className="absolute inset-0 opacity-80 tech-bg-overlay bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-tasc-bg/60 to-tasc-bg"
      />

      {/* Industrial blueprint grid lines */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#00f0ff_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Render 3D Canvas only on desktop when WebGL is available, with error suppression */}
      {!isMobile && hasWebGL && (
        <CanvasErrorBoundary fallback={null}>
          <Canvas 
            camera={{ position: [0, 0, 12], fov: 60 }} 
            gl={{ alpha: true, antialias: true, powerPreference: 'default' }}
            dpr={[1, 1.5]}
          >
            <fog attach="fog" args={[isLight ? '#FFFFFF' : '#070A0F', 5, 25]} />
            <ParticleFluid 
              count={18000} 
              spreadY={60} 
              startY={0} 
              mouseForce={2.0} 
              pointSize={18.0} 
              clusterDist={true} 
              isLight={isLight}
            />
            <ParticleFluid 
              count={25000} 
              spreadY={800} 
              startY={-350} 
              mouseForce={1.8} 
              pointSize={20.0} 
              clusterDist={false} 
              isLight={isLight}
            />
          </Canvas>
        </CanvasErrorBoundary>
      )}
    </div>
  );
};
