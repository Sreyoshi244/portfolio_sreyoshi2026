import React, { useMemo, useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import DecryptedText from './DecryptedText';
import Orb from './Orb';

/* ═══════════════════════ KEYFRAMES ═══════════════════════ */

const floatUp = keyframes`
  0%   { transform: translateY(0) scale(1); opacity: 0; }
  15%  { opacity: 0.6; }
  85%  { opacity: 0.4; }
  100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
`;

const streakPass = keyframes`
  from { transform: translateX(-120%); opacity: 0; }
  20%  { opacity: 0.3; }
  80%  { opacity: 0.3; }
  to   { transform: translateX(220%); opacity: 0; }
`;

const orbitSpin = keyframes`
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
`;

const textPulse = keyframes`
  0%, 100% { opacity: 0.55; }
  50%       { opacity: 0.9; }
`;

const ambientPulse = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%       { opacity: 0.8; transform: scale(1.04); }
`;

const rippleExpand = keyframes`
  0%   { transform: translate(-50%, -50%) scale(0.3); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0; }
`;

const chromaFlash = keyframes`
  0%   { filter: none; }
  20%  { filter: drop-shadow(4px 0 0 rgba(255,0,0,0.6)) drop-shadow(-4px 0 0 rgba(0,200,255,0.6)); }
  40%  { filter: drop-shadow(-3px 0 0 rgba(255,0,0,0.4)) drop-shadow(3px 0 0 rgba(0,200,255,0.4)); }
  60%  { filter: drop-shadow(2px 0 0 rgba(255,0,0,0.2)) drop-shadow(-2px 0 0 rgba(0,200,255,0.2)); }
  100% { filter: none; }
`;

const orbitPulseDark = keyframes`
  0%, 100% { text-shadow: 0 0 8px rgba(255,80,80,0.4); }
  50%       { text-shadow: 0 0 20px rgba(255,80,80,0.9), 0 0 40px rgba(255,30,30,0.5); }
`;

const orbitPulseLight = keyframes`
  0%, 100% { text-shadow: 0 0 8px rgba(80,120,255,0.4); }
  50%       { text-shadow: 0 0 20px rgba(80,120,255,0.9), 0 0 40px rgba(60,100,255,0.5); }
`;

const helperBlink = keyframes`
  0%, 100% { opacity: 0.45; }
  50%       { opacity: 0.8; }
`;

/* ═══════════════════════ SCENE ELEMENTS ═══════════════════════ */

const Streak = styled.div`
  position: absolute;
  width: 260px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(180,0,0,0.5), transparent);
  top: ${p => p.$top}%;
  left: -140px;
  animation: ${streakPass} ${p => p.$dur}s infinite linear;
  animation-delay: ${p => p.$delay}s;
  z-index: 2;
  pointer-events: none;
`;

const Ember = styled.div`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  background: ${p => p.$color};
  border-radius: 50%;
  top: 100%;
  left: ${p => p.$left}%;
  filter: blur(0.8px);
  animation: ${floatUp} ${p => p.$dur}s infinite linear;
  animation-delay: ${p => p.$delay}s;
  opacity: 0;
  z-index: 2;
  pointer-events: none;
`;

const AmbientGlow = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: ${p => p.$realm === 'dark'
    ? 'radial-gradient(circle, rgba(100,0,0,0.28) 0%, rgba(60,0,0,0.12) 45%, transparent 70%)'
    : 'radial-gradient(circle, rgba(80,120,255,0.18) 0%, rgba(120,160,255,0.08) 45%, transparent 70%)'};
  filter: blur(30px);
  animation: ${ambientPulse} 5s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
  transition: background 0.8s ease;
`;

/* ═══════════════════════ ORB SCENE ═══════════════════════ */

const OrbScene = styled.div`
  position: relative;
  z-index: 10;
  width: clamp(320px, min(88vw, 88vh), 900px);
  height: clamp(320px, min(88vw, 88vh), 900px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* Click ripple rings */
const RippleRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  border-radius: 50%;
  border: 2px solid ${p => p.$color};
  animation: ${rippleExpand} ${p => p.$dur}s cubic-bezier(0.2, 0.6, 0.4, 1) forwards;
  animation-delay: ${p => p.$delay}s;
  pointer-events: none;
  z-index: 30;
  opacity: 0;
`;

/* Chromatic aberration wrapper on click */
const OrbCanvasWrap = styled.div`
  position: absolute;
  inset: 0;
  z-index: 5;
  animation: ${p => p.$clicked ? css`${chromaFlash} 0.8s ease forwards` : 'none'};
`;

/* ═══════════════════════ CIRCULAR TEXT RING ═══════════════════════ */

const TextRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  /* diameter = orb + 20px margin either side — hug the orb  */
  width: calc(100% + 40px);
  height: calc(100% + 40px);
  animation: ${orbitSpin} 20s linear infinite;
  pointer-events: none;
  z-index: 25;

  svg text {
    animation: ${textPulse} 3s ease-in-out infinite,
      ${p => p.$realm === 'dark' ? orbitPulseDark : orbitPulseLight} 3s ease-in-out infinite;
  }
`;

/* ═══════════════════════ INNER CONTENT ═══════════════════════ */

const OrbContent = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 20;
  padding: 10%;
  pointer-events: none;
  gap: 0;
  text-align: center;
`;

const IntroLine = styled(motion.p)`
  font-family: ${p => p.theme.fonts.body};
  font-size: clamp(0.5rem, 2vw, 0.72rem);
  font-weight: 300;
  color: ${p => p.theme.colors.textSecondary};
  letter-spacing: clamp(2px, 1vw, 4px);
  text-transform: uppercase;
  margin: 0 0 0.5rem;
  text-align: center;
  opacity: 0.8;
`;

const NameTitle = styled(motion.h1)`
  font-family: ${p => p.theme.fonts.heading};
  font-size: clamp(2.5rem, 12vw, 6.5rem);
  color: ${p => p.theme.colors.primary};
  margin: 0;
  line-height: 1;
  letter-spacing: clamp(0.1rem, 2vw, 0.35rem);
  font-weight: 400;
  text-align: center;
  text-shadow:
    0 0 20px ${p => p.theme.colors.primary}99,
    0 0 40px ${p => p.theme.colors.primary}44;
  transition: all 1.2s ease;
`;

const Tagline = styled(motion.p)`
  font-family: ${p => p.theme.fonts.body};
  font-size: clamp(0.6rem, 2.5vw, 0.85rem);
  color: ${p => p.theme.colors.textSecondary};
  max-width: clamp(220px, 60%, 280px);
  line-height: 1.6;
  font-weight: 300;
  letter-spacing: 0.2px;
  text-align: center;
  margin: 0.8rem 0 0;
  opacity: 0.85;
`;

const CTAButton = styled(motion.button)`
  margin-top: 1.6rem;
  padding: 0.7rem 2.2rem;
  background: transparent;
  border: 1px solid ${p => p.theme.colors.primary}44;
  color: ${p => p.theme.colors.primary};
  font-family: ${p => p.theme.fonts.subheading};
  font-size: clamp(0.65rem, 1.2vw, 0.82rem);
  letter-spacing: 5px;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.35s ease;
  pointer-events: all;
  backdrop-filter: blur(4px);

  &:hover {
    background: ${p => p.theme.colors.primary}0d;
    box-shadow: 0 0 24px ${p => p.theme.colors.primary}33;
    border-color: ${p => p.theme.colors.primary}77;
  }
`;

/* Helper text below orb */
const HelperText = styled(motion.p)`
  position: absolute;
  bottom: -3rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: ${p => p.theme.fonts.body};
  font-size: 0.68rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: ${p => p.theme.colors.primary};
  white-space: nowrap;
  pointer-events: none;
  animation: ${helperBlink} 2.5s ease-in-out infinite;
  z-index: 30;
`;

/* ═══════════════════════ CIRCULAR TEXT ═══════════════════════ */

function CircularLabel({ realm, containerSize }) {
  const totalSize = containerSize + 40;
  const r = totalSize / 2 - 14;
  const cx = totalSize / 2;
  const cy = totalSize / 2;

  // Repeat enough times to fill the full circumference with no gap
  const unit = '✦ Click to shift the realm  ';
  const unitL = '✦ Return to the Abyss  ';
  const label = realm === 'dark'
    ? unit.repeat(12)
    : unitL.repeat(14);

  const fillDark = 'rgba(255,80,80,0.75)';
  const fillLight = 'rgba(80,120,255,0.75)';

  return (
    <TextRing $realm={realm}>
      <svg
        viewBox={`0 0 ${totalSize} ${totalSize}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="text-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <path
            id="orbit-path"
            d={`M${cx},${cy} m-${r},0 a${r},${r} 0 1,1 ${r * 2},0 a${r},${r} 0 1,1 -${r * 2},0`}
          />
        </defs>
        <text
          fontFamily="'Inter', 'Helvetica Neue', sans-serif"
          fontSize="12"
          fontWeight="500"
          fill={realm === 'dark' ? fillDark : fillLight}
          letterSpacing="4"
          filter="url(#text-glow)"
        >
          <textPath href="#orbit-path" startOffset="0%">
            {label}
          </textPath>
        </text>
      </svg>
    </TextRing>
  );
}

/* ═══════════════════════ HERO ═══════════════════════ */

const RIPPLE_RINGS_DARK = [
  { size: 200, color: 'rgba(255,50,50,0.7)', dur: 0.9, delay: 0 },
  { size: 200, color: 'rgba(255,80,80,0.45)', dur: 1.1, delay: 0.12 },
  { size: 200, color: 'rgba(200,20,20,0.25)', dur: 1.4, delay: 0.25 },
];

const RIPPLE_RINGS_LIGHT = [
  { size: 200, color: 'rgba(80,120,255,0.7)', dur: 0.9, delay: 0 },
  { size: 200, color: 'rgba(100,150,255,0.45)', dur: 1.1, delay: 0.12 },
  { size: 200, color: 'rgba(60,100,220,0.25)', dur: 1.4, delay: 0.25 },
];

const Hero = ({ realm, toggleRealm }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [rippleKey, setRippleKey] = useState(0);

  const ease = [0.22, 1, 0.36, 1];

  const handleOrbClick = useCallback(() => {
    console.log('Orb clicked! Triggering transition sequence...');
    // Trigger distortion FX
    setClicked(true);
    setRippleKey(k => k + 1);
    setTimeout(() => setClicked(false), 900);
    // Trigger realm toggle after a brief visual pause
    setTimeout(() => toggleRealm(), 120);
  }, [toggleRealm]);

  const handleCTA = (e) => {
    e.stopPropagation();
    setIsExiting(true);
    setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 500);
    setTimeout(() => setIsExiting(false), 2000);
  };

  const embers = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2.5 + 0.8,
    left: Math.random() * 100,
    dur: Math.random() * 8 + 13,
    delay: Math.random() * 10,
    color: Math.random() > 0.5 ? 'rgba(120,0,0,0.6)' : 'rgba(60,0,0,0.5)'
  })), []);

  const lightEmbers = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 0.5,
    left: Math.random() * 100,
    dur: Math.random() * 10 + 15,
    delay: Math.random() * 12,
    color: Math.random() > 0.5 ? 'rgba(100,140,255,0.4)' : 'rgba(180,200,255,0.35)'
  })), []);

  const streaks = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    top: Math.random() * 80 + 10,
    dur: Math.random() * 5 + 4,
    delay: Math.random() * 12
  })), []);

  const rippleRings = realm === 'dark' ? RIPPLE_RINGS_DARK : RIPPLE_RINGS_LIGHT;

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
    exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 14, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease } },
    exit: { opacity: 0, y: -16, filter: 'blur(6px)', transition: { duration: 0.45 } }
  };

  // Approximate rendered orb size (matches OrbScene clamp)
  const approxOrbSize = 600;

  return (
    <section
      id="home"
      style={{
        height: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'transparent',
        overflow: 'hidden'
      }}
    >
      {/* Ambient glow */}
      <AmbientGlow $realm={realm} />

      {/* Streaks — dark realm only */}
      {realm === 'dark' && streaks.map(s => (
        <Streak key={s.id} $top={s.top} $dur={s.dur} $delay={s.delay} />
      ))}

      {/* Embers — dark realm */}
      {realm === 'dark' && embers.map(e => (
        <Ember key={e.id} $size={e.size} $left={e.left} $dur={e.dur} $delay={e.delay} $color={e.color} />
      ))}

      {/* Motes — light realm */}
      {realm === 'light' && lightEmbers.map(e => (
        <Ember key={e.id} $size={e.size} $left={e.left} $dur={e.dur} $delay={e.delay} $color={e.color} />
      ))}

      {/* ── Portal Orb Scene ── */}
      <OrbScene onClick={handleOrbClick}>

        {/* Ripple rings on click */}
        {rippleRings.map((r, i) => (
          <RippleRing
            key={`${rippleKey}-${i}`}
            $size={r.size}
            $color={r.color}
            $dur={r.dur}
            $delay={r.delay}
          />
        ))}

        {/* WebGL orb with chroma aberration on click — always rendered, colours swap */}
        <OrbCanvasWrap $clicked={clicked}>
          {realm === 'dark' ? (
            <Orb
              color1="#8B0000"
              color2="#FF1A1A"
              color3="#FF6600"
              hoverIntensity={0.7}
            />
          ) : (
            <Orb
              color1="#1a2a8B"
              color2="#4a80FF"
              color3="#A0C8FF"
              hoverIntensity={0.7}
            />
          )}
        </OrbCanvasWrap>

        {/* Circular orbiting text */}
        <CircularLabel realm={realm} containerSize={approxOrbSize} />

        {/* All hero text layered inside orb */}
        <OrbContent
          key={realm}
          variants={container}
          initial="hidden"
          animate={isExiting ? 'exit' : 'visible'}
        >
          <IntroLine variants={item}>
            {realm === 'dark' ? 'Inhabiting the Ghostly Domain of' : 'Surrounded by the Angelic Grace of'}
          </IntroLine>

          <NameTitle variants={item}>
            <DecryptedText
              text="Pixie"
              speed={55}
              maxIterations={14}
              $useGlitch={realm === 'dark'}
            />
          </NameTitle>

          <Tagline variants={item}>
            {realm === 'dark'
              ? 'Designing experiences for the souls between worlds. Shadow, depth, and the unknown.'
              : 'Elevating the human spirit through light, clarity, and ethereal motion.'}
          </Tagline>

          <CTAButton variants={item} onClick={handleCTA}>
            {realm === 'dark' ? 'Manifest Presence' : 'Ascend Higher'}
            <ChevronDown size={16} />
          </CTAButton>
        </OrbContent>

        {/* Helper text below orb */}
        <HelperText
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          Click the Orb to Shift the Realm
        </HelperText>
      </OrbScene>
    </section>
  );
};

export default Hero;
