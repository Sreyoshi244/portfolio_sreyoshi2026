import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ColorBends = ({
    colors = ["#1a0000", "#3d0000", "#000000"],
    rotation = 0,
    speed = 0.1,
    scale = 1,
    frequency = 1,
    warpStrength = 1,
    mouseInfluence = 1,
    parallax = 0.5,
    noise = 0.1,
    transparent = true,
    autoRotate = 0,
    color = ""
}) => {
    const meshRef = useRef();
    const { viewport, mouse } = useThree();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColors: { value: colors.map(c => new THREE.Color(c)) },
        uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uRotation: { value: rotation },
        uFrequency: { value: frequency },
        uWarpStrength: { value: warpStrength },
        uMouseInfluence: { value: mouseInfluence },
        uParallax: { value: parallax },
        uNoise: { value: noise },
        uOpacity: { value: transparent ? 0.8 : 1.0 }
    }), [colors, rotation, frequency, warpStrength, mouseInfluence, parallax, noise, transparent, viewport]);

    const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColors[3];
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform float uFrequency;
    uniform float uWarpStrength;
    uniform float uMouseInfluence;
    uniform float uNoise;
    uniform float uOpacity;
    varying vec2 vUv;

    // Simple noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      
      // Distort UVs based on time and noise
      float t = uTime * 0.2;
      vec2 p = uv * uFrequency;
      
      p.x += sin(p.y + t) * uWarpStrength * 0.5;
      p.y += cos(p.x + t) * uWarpStrength * 0.5;
      
      // Mouse influence
      vec2 mDist = uv - (uMouse * 0.5 + 0.5);
      float mouseFactor = length(mDist) * uMouseInfluence;
      p += mDist * (1.0 - smoothstep(0.0, 0.8, mouseFactor)) * 0.2;

      // Create flowy gradient
      float pattern = sin(p.x * 2.0 + p.y * 3.0 + t);
      pattern += cos(p.y * 2.5 - p.x * 1.5 + t * 1.2);
      
      // Mix colors
      float mix1 = clamp(pattern, 0.0, 1.0);
      float mix2 = clamp(pattern - 1.0, 0.0, 1.0);
      
      vec3 finalColor = mix(uColors[0], uColors[1], mix1);
      finalColor = mix(finalColor, uColors[2], mix2);
      
      // Add subtle noise
      finalColor += random(uv + uTime) * uNoise;

      gl_FragColor = vec4(finalColor, uOpacity);
    }
  `;

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime() * speed;
            meshRef.current.material.uniforms.uMouse.value.lerp(mouse, 0.05);
            if (autoRotate !== 0) {
                meshRef.current.rotation.z += autoRotate * 0.01;
            }
        }
    });

    return (
        <mesh ref={meshRef} scale={[viewport.width * scale, viewport.height * scale, 1]}>
            <planeGeometry args={[1, 1, 32, 32]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={transparent}
                depthWrite={false}
            />
        </mesh>
    );
};

export default ColorBends;
