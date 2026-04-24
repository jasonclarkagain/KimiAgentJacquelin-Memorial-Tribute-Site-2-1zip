import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 a0 = x - floor(x + 0.5);
    vec3 g = a0 * vec3(x0.x, x12.xz) + h * vec3(x0.y, x12.yw);
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    vec2 mouseDist = uv - uMouse;
    float dist = length(mouseDist);

    float swirl = snoise(uv * 2.5 + uTime * 0.1);
    vec2 distortedUv = uv + vec2(swirl * 0.05);

    float mouseForce = smoothstep(0.4, 0.0, dist);
    distortedUv += (mouseDist * mouseForce * 0.2);

    // Dan Rice palette: warm gold, coral, sky blue
    vec3 color1 = vec3(1.0, 0.91, 0.48);   // warm yellow/gold
    vec3 color2 = vec3(0.97, 0.44, 0.29);  // coral/orange
    vec3 color3 = vec3(0.49, 0.78, 0.89);  // sky blue

    float colorMix = snoise(distortedUv * 3.0 + uTime * 0.05);
    vec3 finalColor = mix(color1, color2, smoothstep(-1.0, 1.0, colorMix));
    finalColor = mix(finalColor, color3, smoothstep(0.5, 1.0, swirl));

    float sparkleNoise = fract(sin(dot(distortedUv, vec2(12.9898, 78.233))) * 43758.5453);
    float sparkles = pow(sparkleNoise, 100.0) * mouseForce * 5.0;

    float shimmer = smoothstep(0.7, 1.0, snoise(distortedUv * 10.0 + uTime));
    finalColor += vec3(sparkles + shimmer * 0.3);

    float alpha = smoothstep(0.38, 0.0, dist) * 0.88;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export default function MousePaintEffect() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    } catch {
      return;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-2, -2) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animId: number;
    function animate(t: number) {
      uniforms.uTime.value = t * 0.001;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    }
    animId = requestAnimationFrame(animate);

    const onMove = (e: MouseEvent) => {
      uniforms.uMouse.value.x = e.clientX / window.innerWidth;
      uniforms.uMouse.value.y = 1.0 - e.clientY / window.innerHeight;
    };
    const onLeave = () => {
      uniforms.uMouse.value.set(-2, -2);
    };
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9998,
        mixBlendMode: 'screen',
      }}
    />
  );
}
