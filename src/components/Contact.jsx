import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Twitter, FileText, Send } from 'lucide-react';

/* ═══════════════════════ KEYFRAMES ═══════════════════════ */

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(255, 0, 0, 0.2); }
  50% { box-shadow: 0 0 15px rgba(255, 0, 0, 0.5); }
`;

const glowPulseLight = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); }
  50% { box-shadow: 0 0 15px rgba(212, 175, 55, 0.4); }
`;

/* ═══════════════════════ STYLED COMPONENTS ═══════════════════════ */

const Section = styled.section`
  padding: clamp(4rem, 12vh, 8rem) 1.5rem;
  background: transparent;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 10;
`;

const GridContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;
  max-width: 1100px;
  position: relative;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1px 1fr;
  }
`;

const VerticalDivider = styled(motion.div)`
  display: none;
  background: ${p => p.$realm === 'dark'
    ? 'linear-gradient(to bottom, transparent, rgba(255, 0, 0, 0.4), transparent)'
    : 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.4), transparent)'};
  width: 1px;
  height: 100%;

  @media (min-width: 992px) {
    display: block;
  }
`;

const Card = styled(motion.div)`
  padding: clamp(1.5rem, 5vw, 3rem);
  background: ${p => p.$realm === 'dark' ? 'rgba(5, 5, 5, 0.4)' : 'rgba(255, 255, 255, 0.3)'};
  backdrop-filter: blur(12px);
  border: 1px solid ${p => p.$realm === 'dark' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(212, 175, 55, 0.1)'};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`;

const CardTitle = styled.h3`
  font-family: 'Cinzel', serif;
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  color: ${p => p.$realm === 'dark' ? '#D3D3D3' : '#2c2416'};
  margin-bottom: 1.2rem;
  letter-spacing: 2px;
`;

const CardDescription = styled.p`
  font-family: ${p => p.theme.fonts.body};
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${p => p.$realm === 'dark' ? 'rgba(211,211,211,0.7)' : 'rgba(44,36,22,0.7)'};
  margin-bottom: 2.5rem;
  font-weight: 300;
`;

/* ── Left Column: Social Buttons ── */

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
  width: 100%;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SocialButton = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  background: ${p => p.$realm === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)'};
  border: 1px solid ${p => p.$realm === 'dark' ? 'rgba(255, 0, 0, 0.3)' : 'rgba(212, 175, 55, 0.3)'};
  color: ${p => p.$realm === 'dark' ? '#eee' : '#222'};
  text-decoration: none;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  letter-spacing: 1px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;

  svg {
    opacity: 0.6;
    transition: all 0.4s ease;
  }

  &:hover {
    border-color: ${p => p.$realm === 'dark' ? '#ff3333' : '#d4af37'};
    color: ${p => p.$realm === 'dark' ? '#fff' : '#000'};
    animation: ${p => p.$realm === 'dark' ? glowPulse : glowPulseLight} 2s infinite ease-in-out;
    
    svg {
      opacity: 1;
      transform: scale(1.1);
      color: ${p => p.$realm === 'dark' ? '#ff3333' : '#d4af37'};
    }
  }
`;

/* ── Right Column: Form ── */

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${p => p.$realm === 'dark' ? 'rgba(255, 50, 50, 0.7)' : 'rgba(180, 140, 0, 0.8)'};
`;

const Input = styled.input`
  background: ${p => p.$realm === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)'};
  border: 1px solid ${p => p.$realm === 'dark' ? 'rgba(255,0,0,0.2)' : 'rgba(212,175,55,0.2)'};
  padding: 1rem;
  color: ${p => p.$realm === 'dark' ? '#fff' : '#222'};
  font-family: inherit;
  transition: all 0.4s ease;

  &:focus {
    outline: none;
    border-color: ${p => p.$realm === 'dark' ? '#ff0000' : '#d4af37'};
    background: ${p => p.$realm === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)'};
    box-shadow: 0 0 15px ${p => p.$realm === 'dark' ? 'rgba(255,0,0,0.15)' : 'rgba(212,175,55,0.15)'};
  }
`;

const TextArea = styled.textarea`
  background: ${p => p.$realm === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)'};
  border: 1px solid ${p => p.$realm === 'dark' ? 'rgba(255,0,0,0.2)' : 'rgba(212,175,55,0.2)'};
  padding: 1rem;
  color: ${p => p.$realm === 'dark' ? '#fff' : '#222'};
  font-family: inherit;
  min-height: 120px;
  resize: vertical;
  transition: all 0.4s ease;

  &:focus {
    outline: none;
    border-color: ${p => p.$realm === 'dark' ? '#ff0000' : '#d4af37'};
    background: ${p => p.$realm === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)'};
    box-shadow: 0 0 15px ${p => p.$realm === 'dark' ? 'rgba(255,0,0,0.15)' : 'rgba(212,175,55,0.15)'};
  }
`;

const SubmitButton = styled(motion.button)`
  margin-top: 1rem;
  padding: 1.2rem;
  background: ${p => p.$realm === 'dark' ? 'rgba(139, 0, 0, 0.8)' : '#fdfaf0'};
  border: 1px solid ${p => p.$realm === 'dark' ? 'rgba(255, 0, 0, 0.4)' : '#d4af37'};
  color: ${p => p.$realm === 'dark' ? '#fff' : '#2c2416'};
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  transition: all 0.4s ease;
  box-shadow: ${p => p.$realm === 'dark' ? '0 0 15px rgba(255, 0, 0, 0.2)' : '0 0 15px rgba(212, 175, 55, 0.1)'};

  &:hover {
    background: ${p => p.$realm === 'dark' ? '#ff0000' : '#d4af37'};
    color: ${p => p.$realm === 'dark' ? '#fff' : '#fff'};
    box-shadow: 0 0 30px ${p => p.$realm === 'dark' ? 'rgba(255, 0, 0, 0.4)' : 'rgba(212, 175, 55, 0.4)'};
  }
`;

/* ═══════════════════════ COMPONENT ═══════════════════════ */

const Contact = ({ realm }) => {
  const isDark = realm === 'dark';

  const LINKS = [
    { name: 'GitHub', href: 'https://github.com/Sreyoshi244', icon: <Github size={18} /> },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/sreyoshi-pal', icon: <Linkedin size={18} /> },
    { name: 'X (Twitter)', href: 'https://x.com/Sreyoshi244', icon: <Twitter size={18} /> },
    { name: 'Email', href: 'mailto:sreyoshipal85@gmail.com', icon: <Mail size={18} /> },
    { name: 'Download CV', href: '/Sreyoshi_Pal_CV.pdf', icon: <FileText size={18} />, download: true },
  ];

  return (
    <Section id="contact">
      <GridContainer
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* ── LEFT CARD ── */}
        <Card $realm={realm}>
          <CardTitle $realm={realm}>
            {isDark ? 'Open a Channel' : 'Let’s Connect'}
          </CardTitle>
          <CardDescription $realm={realm}>
            {isDark
              ? 'Ready to build something immersive? Reach out and let’s create something that lingers beyond the screen.'
              : 'I’m always open to collaborations, research discussions, and innovative projects.'}
          </CardDescription>

          <ButtonGrid>
            {LINKS.map((link, i) => (
              <SocialButton
                key={i}
                href={link.href}
                target={link.download ? undefined : "_blank"}
                rel={link.download ? undefined : "noopener noreferrer"}
                download={link.download}
                $realm={realm}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {link.icon} {link.name}
              </SocialButton>
            ))}
          </ButtonGrid>
        </Card>

        <VerticalDivider $realm={realm} />

        {/* ── RIGHT CARD ── */}
        <Card $realm={realm}>
          <CardTitle $realm={realm}>
            {isDark ? 'Transmit a Message' : 'Send a Message'}
          </CardTitle>
          <CardDescription $realm={realm}>
            Send your transmission directly to my digital coordinates.
          </CardDescription>

          <Form onSubmit={(e) => e.preventDefault()}>
            <FormGroup>
              <Label $realm={realm}>Your Name</Label>
              <Input type="text" placeholder="Identity..." $realm={realm} />
            </FormGroup>
            <FormGroup>
              <Label $realm={realm}>Your Email</Label>
              <Input type="email" placeholder="Return coordinates..." $realm={realm} />
            </FormGroup>
            <FormGroup>
              <Label $realm={realm}>Your Message</Label>
              <TextArea placeholder="Broadcast your message..." $realm={realm} />
            </FormGroup>
            <SubmitButton
              $realm={realm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Send Transmission <Send size={18} />
            </SubmitButton>
          </Form>
        </Card>
      </GridContainer>
    </Section>
  );
};

export default Contact;
