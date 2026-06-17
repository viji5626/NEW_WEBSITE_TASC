import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Fullscreen WebGL plasma-grain backdrop.
 *
 * - Flowing fractal noise field tinted with the brand cyan (#00C2FF / #1F8FFF)
 *   over the deep industrial black (#0D1117).
 * - Subtle film-grain layer for tactile texture.
 * - Reacts gently to mouse position.
 *
 * Designed to feel like a "command-center" ambient layer, never overpowering.
 */
export default function ShaderBg() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x0d1117, 1);
    mount.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(mount.clientWidth, mount.clientHeight),
      },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
    };

    const vertexShader = /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Plasma + fbm noise + grain
    const fragmentShader = /* glsl */ `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform float uScroll;

      // Hash & noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;
        vec2 p = (uv - 0.5);
        p.x *= aspect;

        float t = uTime * 0.06;

        // Two layers of slow fbm flowing in different directions
        float n1 = fbm(p * 1.8 + vec2(t, -t * 0.7));
        float n2 = fbm(p * 3.5 - vec2(t * 0.5, t));
        float flow = mix(n1, n2, 0.5);

        // Radial highlight that tracks mouse + drifts
        vec2 m = uMouse - 0.5;
        m.x *= aspect;
        float md = length(p - m * 0.7);
        float glow = smoothstep(0.9, 0.0, md) * 0.35;

        // Scanline / grid faint signature (command-center feel)
        float scan = sin(uv.y * uResolution.y * 0.5 + uTime * 1.2) * 0.5 + 0.5;
        scan = pow(scan, 30.0) * 0.06;

        // Palette
        vec3 base = vec3(0.051, 0.067, 0.090); // #0D1117
        vec3 cyan = vec3(0.000, 0.760, 1.000); // #00C2FF
        vec3 blue = vec3(0.121, 0.560, 1.000); // #1F8FFF

        float intensity = flow * 0.18 + glow;
        vec3 col = base + cyan * intensity * 0.45 + blue * pow(flow, 3.0) * 0.25;
        col += scan;

        // Film grain
        float g = hash(uv * uResolution + uTime * 60.0) * 0.045;
        col += g - 0.022;

        // Vignette
        float vig = smoothstep(1.2, 0.3, length(uv - 0.5));
        col *= mix(0.7, 1.0, vig);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", onResize);

    const onMouse = (e) => {
      const rect = mount.getBoundingClientRect();
      uniforms.uMouse.value.set(
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height,
      );
    };
    window.addEventListener("pointermove", onMouse);

    const onScroll = () => {
      uniforms.uScroll.value = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let rafId;
    const start = performance.now();
    const animate = (now) => {
      uniforms.uTime.value = (now - start) / 1000;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMouse);
      window.removeEventListener("scroll", onScroll);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      data-testid="webgl-bg"
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.55]"
    />
  );
}
