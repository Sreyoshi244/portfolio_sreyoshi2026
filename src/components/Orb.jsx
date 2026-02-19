import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Vec2, Triangle } from 'ogl';
import './Orb.css';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uHover;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  // Center UV
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  // Orb distance
  float dist = length(uv);
  float radius = 0.6;

  // Smooth sphere mask
  float orb = smoothstep(radius, radius - 0.02, dist);
  if (orb < 0.001) discard;

  // Sphere normal
  float z = sqrt(max(0.0, 1.0 - (uv.x / radius) * (uv.x / radius) - (uv.y / radius) * (uv.y / radius)));
  vec3 normal = normalize(vec3(uv / radius, z));

  // Mouse light direction
  vec2 mouseDelta = uMouse - vec2(0.5);
  vec3 lightDir = normalize(vec3(mouseDelta * 2.0, 1.0));

  // Diffuse lighting
  float diffuse = max(dot(normal, lightDir), 0.0);

  // Fresnel rim
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  float fresnel = pow(1.0 - dot(normal, viewDir), 4.0);

  // Animated iridescent noise
  float noiseScale = 1.5;
  float n1 = snoise(vec2(normal.x * noiseScale + uTime * 0.3, normal.y * noiseScale + uTime * 0.2));
  float n2 = snoise(vec2(normal.y * noiseScale - uTime * 0.2, normal.z * noiseScale + uTime * 0.1));
  float n = (n1 + n2) * 0.5;

  // Color blend from noise and fresnel
  float t = n * 0.5 + 0.5;
  vec3 baseColor = mix(uColor1, uColor2, t);
  baseColor = mix(baseColor, uColor3, fresnel * (0.5 + 0.5 * uHover));

  // Dark sphere body with lit rim
  vec3 darkBody = baseColor * (diffuse * 0.3 + 0.05);
  vec3 rimGlow = baseColor * fresnel * (2.5 + 3.0 * uHover);

  vec3 color = darkBody + rimGlow;

  // Alpha with soft edge
  float alpha = orb * (0.9 + 0.1 * uHover);

  gl_FragColor = vec4(color, alpha);
}
`;

export default function Orb({
    hue = 0,
    hoverIntensity = 0.4,
    color1 = '#8B0000',
    color2 = '#FF3366',
    color3 = '#FFB347',
    size = 500
}) {
    const containerRef = useRef(null);
    const hoverRef = useRef(0);

    const parseColor = (hex) => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
    };

    useEffect(() => {
        const ctn = containerRef.current;
        if (!ctn) return;

        const renderer = new Renderer({ alpha: true, antialias: true });
        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        function resize() {
            const w = ctn.offsetWidth;
            const h = ctn.offsetHeight;
            renderer.setSize(w, h);
            if (program) program.uniforms.uResolution.value = [w, h];
        }
        window.addEventListener('resize', resize);

        const geometry = new Triangle(gl);
        let program;
        program = new Program(gl, {
            vertex: vertexShader,
            fragment: fragmentShader,
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
                uMouse: { value: [0.5, 0.5] },
                uHover: { value: 0 },
                uColor1: { value: parseColor(color1) },
                uColor2: { value: parseColor(color2) },
                uColor3: { value: parseColor(color3) }
            }
        });

        resize();
        const mesh = new Mesh(gl, { geometry, program });
        ctn.appendChild(gl.canvas);

        const handleMouseMove = (e) => {
            const rect = ctn.getBoundingClientRect();
            program.uniforms.uMouse.value = [
                (e.clientX - rect.left) / rect.width,
                1 - (e.clientY - rect.top) / rect.height
            ];
        };

        const handleMouseEnter = () => { hoverRef.current = 1; };
        const handleMouseLeave = () => { hoverRef.current = 0; };

        ctn.addEventListener('mousemove', handleMouseMove);
        ctn.addEventListener('mouseenter', handleMouseEnter);
        ctn.addEventListener('mouseleave', handleMouseLeave);

        let animId;
        function update(t) {
            animId = requestAnimationFrame(update);
            program.uniforms.uTime.value = t * 0.001;
            // Smooth hover transition
            const currentHover = program.uniforms.uHover.value;
            const targetHover = hoverRef.current * hoverIntensity;
            program.uniforms.uHover.value += (targetHover - currentHover) * 0.05;
            renderer.render({ scene: mesh });
        }
        animId = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
            ctn.removeEventListener('mousemove', handleMouseMove);
            ctn.removeEventListener('mouseenter', handleMouseEnter);
            ctn.removeEventListener('mouseleave', handleMouseLeave);
            if (ctn.contains(gl.canvas)) ctn.removeChild(gl.canvas);
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        };
    }, [color1, color2, color3, hoverIntensity]);

    return <div ref={containerRef} className="orb-container" />;
}
