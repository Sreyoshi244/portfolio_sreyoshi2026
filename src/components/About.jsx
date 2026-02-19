import React, { useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ═══════════════════════ KEYFRAMES ═══════════════════════ */

const electricFlicker = keyframes`
  0%, 95%, 100% { opacity: 1; }
  96%            { opacity: 0.7; }
  97%            { opacity: 1; }
  98%            { opacity: 0.4; }
  99%            { opacity: 0.9; }
`;

const borderFlow = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const borderPulse = keyframes`
  0%, 100% { box-shadow: 0 0 12px rgba(178, 34, 34, 0.4), 0 0 30px rgba(178, 34, 34, 0.15), inset 0 0 20px rgba(178,34,34,0.04); }
  50%       { box-shadow: 0 0 25px rgba(178, 34, 34, 0.7), 0 0 60px rgba(178, 34, 34, 0.25), inset 0 0 30px rgba(178,34,34,0.08); }
`;

const borderPulseLight = keyframes`
  0%, 100% { box-shadow: 0 0 12px rgba(255,215,0,0.3), 0 0 30px rgba(255,215,0,0.12), inset 0 0 20px rgba(255,215,0,0.04); }
  50%       { box-shadow: 0 0 25px rgba(255,215,0,0.55), 0 0 55px rgba(255,215,0,0.2), inset 0 0 30px rgba(255,215,0,0.08); }
`;

const ambientDrift = keyframes`
  0%   { transform: translate(0, 0) scale(1); opacity: 0.18; }
  50%  { transform: translate(12%, 8%) scale(1.08); opacity: 0.3; }
  100% { transform: translate(0, 0) scale(1); opacity: 0.18; }
`;

/* ═══════════════════════ SECTION ═══════════════════════ */

const Section = styled.section`
  padding: clamp(4rem, 10vh, 7rem) 1.5rem;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const Mist = styled.div`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  background: radial-gradient(circle, ${p => p.$color} 0%, transparent 70%);
  filter: blur(90px);
  top: ${p => p.$top}%;
  left: ${p => p.$left}%;
  animation: ${ambientDrift} ${p => p.$dur}s infinite ease-in-out;
  pointer-events: none;
  z-index: 0;
  opacity: 0.22;
`;

/* ═══════════════════════ ELECTRIC CARD ═══════════════════════ */

const CardGlow = styled(motion.div)`
  position: relative;
  max-width: 980px;
  width: 100%;
  z-index: 10;
  border-radius: 6px;
  padding: 3px;
  cursor: default;

  background: ${p => p.$realm === 'dark'
    ? 'linear-gradient(135deg, #8B0000, #FF0000, #550000, #B22222, #FF3333, #3d0000, #FF0000)'
    : 'linear-gradient(135deg, #FFD700, #FFF0A0, #E6A817, #FFFBE0, #FFD700, #C8901A, #FFF0A0)'};
  background-size: 300% 300%;
  animation:
    ${borderFlow} 4s ease infinite,
    ${p => p.$realm === 'dark' ? css`${electricFlicker} 7s ease-in-out infinite` : 'none'};

  ${p => p.$realm === 'dark'
    ? css`animation: ${borderFlow} 4s ease infinite, ${electricFlicker} 7s ease-in-out infinite, ${borderPulse} 3s ease-in-out infinite;`
    : css`animation: ${borderFlow} 4s ease infinite, ${borderPulseLight} 3s ease-in-out infinite;`}

  transition: all 0.8s ease;

  &:hover {
    ${p => p.$realm === 'dark'
    ? 'box-shadow: 0 0 40px rgba(255,0,0,0.6), 0 0 80px rgba(178,34,34,0.3);'
    : 'box-shadow: 0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(255,200,0,0.2);'}
  }
`;

const CardInner = styled.div`
  background: ${p => p.$realm === 'dark'
    ? 'rgba(4, 2, 2, 0.96)'
    : 'linear-gradient(145deg, rgba(255,253,245,0.98) 0%, rgba(255,248,220,0.97) 100%)'};
  border-radius: 4px;
  padding: clamp(1.8rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4.5rem);
  transition: background 0.8s ease;
`;

/* ═══════════════════════ TYPOGRAPHY ═══════════════════════ */

const SectionLabel = styled(motion.p)`
  font-family: ${p => p.theme.fonts.body};
  font-size: 0.7rem;
  letter-spacing: 7px;
  text-transform: uppercase;
  color: ${p => p.$realm === 'dark' ? 'rgba(178,34,34,0.7)' : 'rgba(180,140,0,0.8)'};
  margin-bottom: 0.6rem;
`;

const Title = styled(motion.h2)`
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: clamp(2.2rem, 6vw, 3.8rem);
  color: ${p => p.$realm === 'dark' ? '#D3D3D3' : '#2c2416'};
  margin-bottom: 2.8rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: ${p => p.$realm === 'dark' ? '0.05rem' : '0.1rem'};
  transition: all 0.8s ease;
  text-shadow: ${p => p.$realm === 'dark'
    ? '0 0 40px rgba(178,34,34,0.35)'
    : '0 0 30px rgba(255,200,50,0.3)'};
`;

const BodyText = styled(motion.p)`
  font-family: ${p => p.theme.fonts.body};
  font-size: clamp(0.95rem, 2vw, 1.08rem);
  color: ${p => p.$realm === 'dark' ? 'rgba(211,211,211,0.85)' : 'rgba(44,36,22,0.82)'};
  line-height: ${p => p.$realm === 'dark' ? '1.85' : '1.95'};
  font-weight: 300;
  margin-bottom: 1.4rem;
  transition: all 0.8s ease;

  &:last-child { margin-bottom: 0; }
`;

const Divider = styled(motion.hr)`
  border: none;
  height: 1px;
  background: ${p => p.$realm === 'dark'
    ? 'linear-gradient(90deg, transparent, rgba(178,34,34,0.4), transparent)'
    : 'linear-gradient(90deg, transparent, rgba(200,160,0,0.4), transparent)'};
  margin: 3rem 0;
  transition: all 0.8s ease;
`;

/* ═══════════════════════ TECH STACK ═══════════════════════ */

const StackTitle = styled(motion.h3)`
  font-family: 'Playfair Display', 'Georgia', serif;
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  color: ${p => p.$realm === 'dark' ? '#D3D3D3' : '#2c2416'};
  margin-bottom: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.06rem;
  text-shadow: ${p => p.$realm === 'dark'
    ? '0 0 30px rgba(178,34,34,0.3)'
    : '0 0 25px rgba(255,200,50,0.3)'};
`;

const CategoryLabel = styled.p`
  font-family: ${p => p.theme.fonts.body};
  font-size: 0.65rem;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: ${p => p.$realm === 'dark' ? 'rgba(178,34,34,0.65)' : 'rgba(180,140,0,0.7)'};
  margin: 1.8rem 0 0.8rem;
`;

const ChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
`;

const Chip = styled(motion.span)`
  display: inline-block;
  padding: 0.45rem 1.1rem;
  font-family: ${p => p.theme.fonts.body};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  border-radius: 3px;
  cursor: default;
  transition: all 0.35s ease;

  color: ${p => p.$realm === 'dark' ? 'rgba(200,80,80,0.9)' : 'rgba(160,110,0,0.9)'};
  background: ${p => p.$realm === 'dark' ? 'rgba(139,0,0,0.12)' : 'rgba(255,215,0,0.1)'};
  border: 1px solid ${p => p.$realm === 'dark' ? 'rgba(178,34,34,0.25)' : 'rgba(200,160,0,0.3)'};
  box-shadow: ${p => p.$realm === 'dark'
    ? '0 0 8px rgba(139,0,0,0.2)'
    : '0 0 8px rgba(255,215,0,0.15)'};

  &:hover {
    background: ${p => p.$realm === 'dark' ? 'rgba(178,34,34,0.22)' : 'rgba(255,215,0,0.2)'};
    box-shadow: ${p => p.$realm === 'dark'
    ? '0 0 18px rgba(178,34,34,0.45)'
    : '0 0 18px rgba(255,215,0,0.4)'};
    transform: translateY(-2px) scale(1.04);
    color: ${p => p.$realm === 'dark' ? '#FF5555' : '#C8900A'};
    border-color: ${p => p.$realm === 'dark' ? 'rgba(255,50,50,0.5)' : 'rgba(220,170,0,0.5)'};
  }
`;

/* ═══════════════════════ DATA ═══════════════════════ */

const BIO_COPY = [
  `I am an Electronics and Communication Engineering student focused on building high-performance, scalable software systems. My work spans full-stack development, real-time platforms, and analytics-driven applications.`,
  `With experience in React, Next.js, FastAPI, Django, and Python, I design solutions that balance clean architecture, usability, and efficiency. I actively participate in hackathons and independent projects to solve practical problems and strengthen my engineering depth.`,
  `I am particularly interested in the intersection of software systems, embedded technologies, and intelligent computation — aiming to build solutions that are robust, efficient, and impact-driven.`
];

const STACK = {
  Frontend: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'TailwindCSS'],
  Backend: ['Node.js', 'Express.js', 'Flask', 'JWT', 'REST API'],
  Database: ['MongoDB', 'PostgreSQL', 'SQLite'],
  'AI / ML': ['Python', 'NumPy', 'Pandas', 'scikit-learn', 'Machine Learning'],
  'IoT / Embedded': ['ESP32', 'Arduino', 'Embedded C', 'IoT'],
  Tools: ['Git', 'GitHub', 'GitHub Desktop', 'VS Code', 'Vercel', 'Render']
};

/* ═══════════════════════ COMPONENT ═══════════════════════ */

const StackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2.5rem 1.5rem;
  margin-top: 1rem;
`;

const CategoryContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

const About = ({ realm }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const fadeY = useTransform(scrollYProgress, [0, 0.15], [40, 0]);

  const isDark = realm === 'dark';
  const copy = BIO_COPY;

  const mists = isDark ? [
    { size: 700, top: 5, left: -12, color: '#8B0000', dur: 18 },
    { size: 550, top: 55, left: 65, color: '#440000', dur: 14 },
    { size: 600, top: 70, left: -5, color: '#600000', dur: 20 },
  ] : [
    { size: 700, top: 5, left: -12, color: 'rgba(255,215,0,0.6)', dur: 18 },
    { size: 500, top: 60, left: 65, color: 'rgba(255,248,200,0.5)', dur: 13 },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
  };

  return (
    <Section id="about" ref={containerRef}>
      {mists.map((m, i) => <Mist key={i} $size={m.size} $top={m.top} $left={m.left} $color={m.color} $dur={m.dur} />)}

      <motion.div
        style={{ width: '100%', maxWidth: '980px', y: fadeY }}
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <CardGlow $realm={realm} whileHover={{ scale: 1.002 }} transition={{ duration: 0.4 }}>
          <CardInner $realm={realm}>

            {/* ── About Me ── */}
            <SectionLabel $realm={realm} variants={fadeIn}>
              Digital Relic · About
            </SectionLabel>

            <Title $realm={realm} variants={fadeIn}>
              Who is Pixie
            </Title>

            <motion.div variants={stagger}>
              {copy.map((para, i) => (
                <BodyText key={i} $realm={realm} variants={fadeIn}>
                  {para}
                </BodyText>
              ))}
            </motion.div>

            <Divider $realm={realm} variants={fadeIn} />

            {/* ── Tech Stack ── */}
            <SectionLabel $realm={realm} variants={fadeIn}>
              Arcane Mastery · Tech Stack
            </SectionLabel>

            <StackTitle $realm={realm} variants={fadeIn}>
              {isDark ? 'Forbidden Knowledge' : 'Sacred Arts'}
            </StackTitle>

            <StackGrid>
              {Object.entries(STACK).map(([category, chips]) => (
                <CategoryContainer key={category} variants={fadeIn}>
                  <CategoryLabel $realm={realm}>{category}</CategoryLabel>
                  <ChipGrid>
                    {chips.map(chip => (
                      <Chip key={chip} $realm={realm} whileHover={{ y: -3 }}>
                        {chip}
                      </Chip>
                    ))}
                  </ChipGrid>
                </CategoryContainer>
              ))}
            </StackGrid>

          </CardInner>
        </CardGlow>
      </motion.div>
    </Section>
  );
};

export default About;
