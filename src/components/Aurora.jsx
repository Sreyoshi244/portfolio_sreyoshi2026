import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';
import './Aurora.css';

const vertex = `
// Vertex Shader
attribute vec2 uv;
attribute vec3 position;
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`;

const fragment = `
// Fragment Shader
precision highp float;

uniform float uTime;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uSpeed;
uniform float uAmplitude;

varying vec2 vUv;

// Simplex noise function
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = vUv;
    
    // Create flow effect
    float noiseValue = snoise(vec2(uv.x * 2.0, uv.y * 0.5 - uTime * uSpeed));
    
    // Vertical distortion
    float distortion = snoise(vec2(uv.x * 3.0, uv.y * 2.0 + uTime * 0.5)) * uAmplitude;
    
    // Combine for a pillar-like shape
    float mask = 1.0 - abs(uv.x - 0.5) * 2.0; // Gradient from center
    mask = pow(mask, 2.0); // Sharpen the pillar
    
    // Add some turbulence to the mask
    float turbulence = snoise(vec2(uv.x * 10.0, uv.y * 10.0 + uTime)) * 0.1;
    mask += turbulence * mask;
    
    // Smoothstep for softer edges
    mask = smoothstep(0.1, 0.9, mask);

    // Color mixing
    vec3 color = mix(uColorStops[0], uColorStops[1], uv.y + distortion);
    color = mix(color, uColorStops[2], mask * (0.5 + 0.5 * noiseValue));

    // Final alpha blending for "ethereal" look
    float alpha = mask;

    gl_FragColor = vec4(color, alpha);
}
`;

export default function Aurora({
    colorStops = ["#000000", "#330000", "#FF0000"], // Black -> Dark Red -> Bright Red
    speed = 0.5,
    amplitude = 1.0
}) {
    const ctnDom = useRef(null);

    useEffect(() => {
        if (!ctnDom.current) return;
        const ctn = ctnDom.current;
        const renderer = new Renderer({ alpha: true });
        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);

        let program;

        function resize() {
            renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
            if (program) {
                program.uniforms.uResolution.value = [ctn.offsetWidth, ctn.offsetHeight];
            }
        }
        window.addEventListener('resize', resize);
        resize();

        const geometry = new Triangle(gl);

        // Parse hex colors to vec3
        const parsedColors = colorStops.map(hex => {
            const c = new Color(hex);
            return [c.r, c.g, c.b];
        });

        program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uColorStops: { value: parsedColors.flat() },
                uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
                uSpeed: { value: speed },
                uAmplitude: { value: amplitude }
            }
        });

        const mesh = new Mesh(gl, { geometry, program });
        let animationId;

        function update(t) {
            animationId = requestAnimationFrame(update);
            program.uniforms.uTime.value = t * 0.001;
            renderer.render({ scene: mesh });
        }
        animationId = requestAnimationFrame(update);
        ctn.appendChild(gl.canvas);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
            if (ctn.contains(gl.canvas)) {
                ctn.removeChild(gl.canvas);
            }
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        };
    }, [speed, amplitude]); // Re-init if props change significantly, or use refs for uniforms in a real app to avoid re-init

    return <div ref={ctnDom} className="aurora-container" />;
}
