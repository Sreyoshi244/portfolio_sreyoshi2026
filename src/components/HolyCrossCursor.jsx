import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

const CursorWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 999999;
  overflow: hidden;
`;

const CrossContainer = styled(motion.div)`
  position: absolute;
  width: 30px;
  height: 45px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center center;
`;

const GlowRing = styled(motion.div)`
  position: absolute;
  width: 60px;
  height: 60px;
  background: radial-gradient(
    circle, 
    ${props => props.$color}44 0%, 
    transparent 70%
  );
  filter: blur(15px);
  pointer-events: none;
  z-index: -1;
`;

const LightMote = styled(motion.div)`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: ${props => props.$color};
  border-radius: 50%;
  pointer-events: none;
  z-index: -2;
  filter: blur(2px);
`;

const divinePulse = keyframes`
  0%, 100% { filter: drop-shadow(0 0 5px var(--glow-color)) brightness(1); }
  50% { filter: drop-shadow(0 0 15px var(--glow-color)) brightness(1.4); }
`;

const StyledSVG = styled.svg`
  width: 100%;
  height: 100%;
  --glow-color: ${props => props.$glowColor};
  animation: ${divinePulse} 3s infinite ease-in-out;
  filter: drop-shadow(0 0 5px ${props => props.$glowColor}66);
`;

const SVGCross = ({ realm, isHovering }) => {
    const glowColor = realm === 'dark' ? '#ff0000' : '#FFD700';
    const crossColor = realm === 'dark' ? '#1a1a1a' : '#ffffff';
    const strokeColor = realm === 'dark' ? '#ff0000' : '#FFD700';

    return (
        <StyledSVG
            viewBox="0 0 100 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            $glowColor={glowColor}
        >
            <defs>
                <filter id="cross-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="cross-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={crossColor} />
                    <stop offset="100%" stopColor={realm === 'dark' ? '#000' : '#f0f0f0'} />
                </linearGradient>
            </defs>

            {/* Main Vertical Beam */}
            <rect
                x="46" y="10" width="8" height="120"
                rx="1" fill="url(#cross-grad)"
                stroke={strokeColor} strokeWidth="0.8"
                style={{ filter: isHovering ? 'url(#cross-glow)' : 'none' }}
            />

            {/* Horizontal Beam */}
            <rect
                x="20" y="40" width="60" height="8"
                rx="1" fill="url(#cross-grad)"
                stroke={strokeColor} strokeWidth="0.8"
                style={{ filter: isHovering ? 'url(#cross-glow)' : 'none' }}
            />

            {/* Central Gem/Glow Point */}
            <circle
                cx="50" cy="44" r="2.5"
                fill={glowColor}
                style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
            />
        </StyledSVG>
    );
};

const HolyCrossCursor = ({ realm }) => {
    const mouseX = useMotionValue(-200);
    const mouseY = useMotionValue(-200);

    const springConfig = { damping: 40, stiffness: 250, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const [isHovering, setIsHovering] = useState(false);
    const [motes, setMotes] = useState([]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX - 15);
            mouseY.set(e.clientY - 22);

            if (Math.random() > 0.8) {
                setMotes(prev => [{
                    id: Math.random(),
                    x: e.clientX,
                    y: e.clientY,
                    size: Math.random() * 3 + 1
                }, ...prev].slice(0, 15));
            }
        };

        const handleMouseOver = (e) => {
            const isInteractive = e.target.closest('a, button, [role="button"], input, textarea, select');
            setIsHovering(!!isInteractive);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [mouseX, mouseY]);

    const color = realm === 'dark' ? '#ff0000' : '#FFD700';

    return (
        <CursorWrapper>
            <AnimatePresence>
                {motes.map((mote) => (
                    <LightMote
                        key={mote.id}
                        $size={mote.size}
                        $color={color}
                        initial={{ opacity: 0.8, y: 0, x: mote.x, scale: 1 }}
                        animate={{ opacity: 0, y: 50, x: mote.x + (Math.random() - 0.5) * 50, scale: 0.2 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{
                            left: 0,
                            top: mote.y,
                        }}
                    />
                ))}
            </AnimatePresence>

            <CrossContainer
                style={{
                    x: springX,
                    y: springY,
                }}
                animate={{
                    scale: isHovering ? 1.25 : 1,
                    translateY: [0, -10, 0],
                    rotate: isHovering ? [0, -5, 5, 0] : 0
                }}
                transition={{
                    translateY: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                    rotate: isHovering ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : { duration: 0.4 },
                    scale: { duration: 0.3 }
                }}
            >
                <GlowRing
                    $color={color}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                />
                <SVGCross realm={realm} isHovering={isHovering} />
            </CrossContainer>
        </CursorWrapper>
    );
};

export default HolyCrossCursor;
