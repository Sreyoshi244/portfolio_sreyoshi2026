import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';

/* ═══════════════════════ KEYFRAMES ═══════════════════════ */

const flicker = keyframes`
  0%, 100% { border-color: rgba(139, 0, 0, 0.6); box-shadow: 0 0 15px rgba(139, 0, 0, 0.3); }
  50% { border-color: rgba(255, 0, 0, 0.9); box-shadow: 0 0 25px rgba(255, 0, 0, 0.5); }
  10%, 30%, 70%, 90% { border-color: rgba(139, 0, 0, 0.8); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(139, 0, 0, 0.4); }
  50% { box-shadow: 0 0 40px rgba(255, 0, 0, 0.7); }
`;

const pulseGlowLight = keyframes`
  0%, 100% { box-shadow: 0 0 15px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 35px rgba(212, 175, 55, 0.6); }
`;

const drift = keyframes`
  0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
  50% { opacity: 0.3; }
  100% { transform: translateY(-100px) translateX(20px) scale(0.5); opacity: 0; }
`;

/* ═══════════════════════ STYLED COMPONENTS ═══════════════════════ */

const Section = styled.section`
  padding: 3rem 2rem;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  z-index: 10;
`;

const Divider = styled(motion.div)`
  width: 120px;
  height: 1px;
  margin-bottom: 2rem;
  background: ${p => p.$realm === 'dark'
    ? 'linear-gradient(90deg, transparent, #ff0000, transparent)'
    : 'linear-gradient(90deg, transparent, #d4af37, transparent)'};
  box-shadow: ${p => p.$realm === 'dark' ? '0 0 10px #ff0000' : '0 0 10px #d4af37'};
  transition: all 0.8s ease;
`;

const Label = styled(motion.p)`
  font-family: ${p => p.theme.fonts.body};
  font-size: 0.7rem;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: ${p => p.$realm === 'dark' ? 'rgba(178,34,34,0.7)' : 'rgba(180,140,0,0.8)'};
  margin-bottom: 1rem;
`;

const Title = styled(motion.h2)`
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: clamp(2rem, 5vw, 3.2rem);
  color: ${p => p.$realm === 'dark' ? '#D3D3D3' : '#2c2416'};
  margin-bottom: 1rem;
  font-weight: 700;
  text-align: center;
  transition: all 0.8s ease;
  text-shadow: ${p => p.$realm === 'dark'
    ? '0 0 30px rgba(178,34,34,0.3)'
    : '0 0 25px rgba(255,200,50,0.3)'};
`;

const Description = styled(motion.p)`
  font-family: ${p => p.theme.fonts.body};
  font-size: 1rem;
  color: ${p => p.$realm === 'dark' ? 'rgba(211,211,211,0.7)' : 'rgba(44,36,22,0.7)'};
  max-width: 500px;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 2rem;
  transition: all 0.8s ease;
`;

const ButtonWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Particle = styled.div`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  background: ${p => p.$color};
  border-radius: 50%;
  pointer-events: none;
  animation: ${drift} ${p => p.$dur}s infinite linear;
  top: ${p => p.$top}px;
  left: ${p => p.$left}px;
  filter: blur(1px);
`;

const ArtifactButton = styled(motion.a)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem 3rem;
  text-decoration: none;
  font-family: ${p => p.theme.fonts.subheading};
  font-size: 1.2rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  border-radius: 4px;
  z-index: 5;
  
  /* Shared Base */
  border: 1px solid transparent;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;

  /* Dark Realm */
  ${p => p.$realm === 'dark' && css`
    background: #080202;
    color: #ff3333;
    border-color: rgba(139, 0, 0, 0.6);
    box-shadow: 0 0 15px rgba(139, 0, 0, 0.2);
    animation: ${p => p.$isPulsing ? css`${pulseGlow} 2s ease` : css`${flicker} 6s infinite ease-in-out`};

    &:hover {
      border-color: #ff0000;
      box-shadow: 0 0 35px rgba(255, 0, 0, 0.5);
      color: #ff6666;
    }
  `}

  /* Light Realm */
  ${p => p.$realm === 'light' && css`
    background: #fffdf5;
    color: #2c2416;
    border-color: rgba(212, 175, 55, 0.4);
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.15);
    animation: ${p => p.$isPulsing ? css`${pulseGlowLight} 2s ease` : 'none'};

    &:hover {
      border-color: #d4af37;
      box-shadow: 0 0 30px rgba(212, 175, 55, 0.35);
      background: #ffffff;
    }
  `}
`;

const RippleEffect = styled(motion.span)`
  position: absolute;
  background: ${p => p.$realm === 'dark' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(212, 175, 55, 0.15)'};
  border-radius: 50%;
  pointer-events: none;
  transform: scale(0);
`;

const MicroText = styled(motion.span)`
  margin-top: 1.2rem;
  font-family: ${p => p.theme.fonts.body};
  font-size: 0.65rem;
  letter-spacing: 2px;
  color: ${p => p.$realm === 'dark' ? 'rgba(211,211,211,0.4)' : 'rgba(44,36,22,0.4)'};
  text-transform: uppercase;
`;

/* ═══════════════════════ COMPONENT ═══════════════════════ */

const DownloadCV = ({ realm }) => {
  const [isPulsing, setIsPulsing] = useState(false);
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  // periodic pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 2000);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const handleRipple = (e) => {
    const rect = buttonRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };

    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  const particles = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    color: realm === 'dark' ? '#ff000044' : '#d4af3733',
    top: Math.random() * 40 - 20,
    left: Math.random() * 200 - 100,
    dur: Math.random() * 3 + 2
  }));

  const isDark = realm === 'dark';

  return (
    <Section id="cv">
      <Divider
        $realm={realm}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      <Label
        $realm={realm}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        DIGITAL ARCHIVE
      </Label>

      <Title
        $realm={realm}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        {isDark ? 'Retrieve My Codex' : 'Access My Portfolio'}
      </Title>

      <Description
        $realm={realm}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {isDark
          ? 'A detailed record of my engineering journey, projects, and technical mastery.'
          : 'A comprehensive overview of my academic foundation, technical skills, and engineering projects.'}
      </Description>

      <ButtonWrapper>
        {particles.map(p => (
          <Particle
            key={p.id}
            $size={p.size}
            $color={p.color}
            $top={p.top}
            $left={p.left}
            $dur={p.dur}
          />
        ))}

        <ArtifactButton
          ref={buttonRef}
          href="/Sreyoshi_Pal_CV.pdf"
          download="Sreyoshi_Pal_CV.pdf"
          $realm={realm}
          $isPulsing={isPulsing}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onMouseDown={handleRipple}
        >
          <AnimatePresence>
            {ripples.map(r => (
              <RippleEffect
                key={r.id}
                $realm={realm}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  top: r.y,
                  left: r.x,
                  width: r.size,
                  height: r.size
                }}
              />
            ))}
          </AnimatePresence>
          <Download size={20} />
          Download CV
        </ArtifactButton>

        <MicroText
          $realm={realm}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          PDF • Updated 2026
        </MicroText>
      </ButtonWrapper>
    </Section>
  );
};

export default DownloadCV;
