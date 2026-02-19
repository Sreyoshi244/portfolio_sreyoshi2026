import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, Stars } from '@react-three/drei';

const Scene3D = ({ realm }) => {
    const sphereRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (sphereRef.current) {
            sphereRef.current.rotation.y = time * 0.05;
            sphereRef.current.rotation.x = time * 0.02;
        }
    });

    const isDark = realm === 'dark';

    return (
        <>
            <Stars
                radius={100}
                depth={50}
                count={isDark ? 2000 : 1200} // Slightly fewer stars in light mode for clarity
                factor={4}
                saturation={0}
                fade
                speed={isDark ? 0.2 : 0.1}
            />

            <Float
                speed={0.5}
                rotationIntensity={0.2}
                floatIntensity={0.2}
            >
                <Sphere ref={sphereRef} args={[1, 64, 64]} scale={1.4}>
                    <MeshDistortMaterial
                        color={isDark ? "#050505" : "#fdfcf5"}
                        attach="material"
                        distort={0.2}
                        speed={1}
                        roughness={isDark ? 0.4 : 0.1}
                        metalness={isDark ? 0.9 : 0.2}
                        emissive={isDark ? "#3d0000" : "#d4af37"}
                        emissiveIntensity={isDark ? 0.05 : 0.15}
                    />
                </Sphere>
            </Float>

            <pointLight position={[10, 5, 10]} color={isDark ? "#8b0000" : "#d4af37"} intensity={isDark ? 0.8 : 1.2} />
            <spotLight
                position={[-10, 10, 10]}
                angle={0.15}
                penumbra={1}
                intensity={isDark ? 1 : 0.6}
                color={isDark ? "#3d0000" : "#ffffff"}
            />
        </>
    );
};

export default Scene3D;
