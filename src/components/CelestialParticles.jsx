import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.3; filter: blur(10px); }
  50% { transform: scale(1.2); opacity: 0.6; filter: blur(15px); }
  100% { transform: scale(1); opacity: 0.3; filter: blur(10px); }
`;

const Orb = styled(motion.div)`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: radial-gradient(circle, ${props => props.color} 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  animation: ${pulse} ${props => props.duration}s infinite ease-in-out;
  filter: blur(8px);
`;

const Sparkle = styled(motion.div)`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px white;
  pointer-events: none;
  z-index: 2;
`;

const CelestialParticles = () => {
    const orbs = useMemo(() => {
        return Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            size: Math.random() * 200 + 100,
            x: Math.random() * 100,
            y: Math.random() * 100,
            color: Math.random() > 0.5 ? '#d4af37' : '#aec6cf',
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
        }));
    }, []);

    const sparkles = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 10,
        }));
    }, []);

    return (
        <>
            {orbs.map(orb => (
                <Orb
                    key={orb.id}
                    size={orb.size}
                    color={orb.color}
                    style={{ left: `${orb.x}%`, top: `${orb.y}%` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: orb.delay, duration: 2 }}
                />
            ))}
            {sparkles.map(sparkle => (
                <Sparkle
                    key={sparkle.id}
                    style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                    }}
                    transition={{
                        duration: sparkle.duration,
                        repeat: Infinity,
                        delay: sparkle.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </>
    );
};

export default CelestialParticles;
