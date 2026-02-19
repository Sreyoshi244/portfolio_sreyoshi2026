import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';

const FloatingOrb = () => {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.position.y = Math.sin(time) * 0.2;
            meshRef.current.rotation.x = time * 0.5;
            meshRef.current.rotation.y = time * 0.3;
        }
    });

    return (
        <Sphere ref={meshRef} args={[1, 100, 100]} scale={1.5}>
            <MeshDistortMaterial
                color="#8B0000"
                attach="material"
                distort={0.4}
                speed={2}
                roughness={0}
            />
        </Sphere>
    );
};

export default FloatingOrb;
