import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Zap } from 'lucide-react';

const flicker = keyframes`
  0%, 100% { opacity: 1; filter: drop-shadow(0 0 5px #ff0000); }
  50% { opacity: 0.8; filter: drop-shadow(0 0 12px #ff3333); }
  10%, 30%, 70%, 90% { opacity: 0.95; }
`;

const electricMove = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const ribbonFlow = keyframes`
  0% { border-image-source: linear-gradient(90deg, #d4af37, #ffffff, #d4af37); }
  50% { border-image-source: linear-gradient(180deg, #d4af37, #ffffff, #d4af37); }
  100% { border-image-source: linear-gradient(270deg, #d4af37, #ffffff, #d4af37); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const Section = styled.section`
  padding: clamp(4rem, 12vh, 10rem) 1.5rem;
  background: ${props => props.$realm === 'dark' ? '#050505' : 'linear-gradient(to bottom, #fdfcf0, #fffcf5)'};
  position: relative;
  overflow: hidden;
  transition: background 0.8s ease-in-out;
  z-index: 10;
`;

const Container = styled(motion.div)`
  max-width: 1300px;
  margin: 0 auto;
  position: relative;
`;

const Title = styled(motion.h2)`
  font-size: clamp(3rem, 10vw, 5rem);
  text-align: center;
  margin-bottom: 6rem;
  font-family: ${props => props.theme.fonts.heading};
  letter-spacing: 4px;
  text-transform: uppercase;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  
  background: ${props => props.$realm === 'dark'
    ? 'linear-gradient(90deg, #550000 0%, #ff0000 30%, #fff 50%, #ff0000 70%, #550000 100%)'
    : 'linear-gradient(90deg, #1a1a1a 0%, #d4af37 30%, #fff 50%, #d4af37 70%, #1a1a1a 100%)'};
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 4s linear infinite;

  ${props => props.$realm === 'dark' && css`
    filter: drop-shadow(0 0 15px rgba(255, 0, 0, 0.4));
    font-weight: 700;
  `}
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(280px, 100%, 360px), 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
  perspective: 1000px;
`;

const CardWrapper = styled(motion.div)`
  position: relative;
  padding: 2px;
  border-radius: 12px;
  background: ${props => props.$realm === 'dark'
    ? 'linear-gradient(90deg, #ff0000, #330000, #ff0000)'
    : 'linear-gradient(90deg, #d4af37, #ffffff, #d4af37)'};
  background-size: 200% 100%;
  animation: ${electricMove} 3s linear infinite;
  
  ${props => props.$realm === 'dark' && css`
    animation: ${flicker} 2s infinite, ${electricMove} 3s linear infinite;
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.2);
  `}

  ${props => props.$realm === 'light' && css`
    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.1);
  `}
`;

const Card = styled(motion.div)`
  background: ${props => props.$realm === 'dark' ? '#0a0a0a' : '#fff'};
  border-radius: 10px;
  padding: clamp(1.5rem, 5vw, 2.5rem);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-12px);
  }
`;

const Subtitle = styled.h4`
  font-family: ${props => props.theme.fonts.subheading};
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  color: ${props => props.$realm === 'dark' ? '#ff3333' : '#d4af37'};
  opacity: 0.8;
`;

const ProjectTitle = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  
  background: ${props => props.$realm === 'dark'
    ? 'linear-gradient(90deg, #eee 0%, #fff 40%, #ff3333 50%, #fff 60%, #eee 100%)'
    : 'linear-gradient(90deg, #1a1a1a 0%, #444 40%, #d4af37 50%, #444 60%, #1a1a1a 100%)'};
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 3s linear infinite;
`;

const ProjectDesc = styled.p`
  font-family: ${props => props.theme.fonts.body};
  font-size: 1.1rem;
  color: ${props => props.$realm === 'dark' ? '#aaa' : '#444'};
  margin-bottom: 2rem;
  line-height: 1.7;
  flex-grow: 1;
`;

const TechStack = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const Tag = styled.span`
  font-family: ${props => props.theme.fonts.body};
  font-size: 0.75rem;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  background: ${props => props.$realm === 'dark' ? 'rgba(255, 0, 0, 0.05)' : 'rgba(212, 175, 55, 0.05)'};
  color: ${props => props.$realm === 'dark' ? '#ff3333' : '#b8860b'};
  border: 1px solid ${props => props.$realm === 'dark' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(212, 175, 55, 0.2)'};
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const IconButton = styled(motion.a)`
  color: ${props => props.$realm === 'dark' ? '#eee' : '#1a1a1a'};
  opacity: 0.6;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 1;
    color: ${props => props.$realm === 'dark' ? '#ff3333' : '#d4af37'};
  }
`;

const ParticleBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: ${props => props.$realm === 'dark' ? 1 : 0};
  transition: opacity 0.8s ease;
  background-image: radial-gradient(circle, #ff000011 1px, transparent 1px);
  background-size: 40px 40px;
`;

const Projects = ({ realm }) => {
  const projectData = [
    {
      title: "Chemical Equipment Parameter Visualizer",
      subtitle: realm === 'dark' ? "The Alchemist’s Engine" : "Hybrid Analytics Platform",
      description: realm === 'dark'
        ? "A high-performance hybrid analytics system forged for chemical engineers. Built with a Django REST core, an interactive React dashboard, and a native PyQt5 desktop interface — this system transforms raw industrial parameters into living visual intelligence."
        : "A hybrid analytics platform built to help chemical engineers interpret equipment data with clarity. Combining Django REST APIs, a responsive React dashboard, and a PyQt desktop interface — it enables efficient data processing and meaningful visualization.",
      tech: ["Django", "React", "PyQt5", "REST API"],
      github: "#"
    },
    {
      title: "CareCast",
      subtitle: realm === 'dark' ? "The Guardian Protocol" : "Health Monitoring & Safety",
      description: realm === 'dark'
        ? "A real-time health and safety platform built to respond before danger strikes. Designed with Next.js and Firebase architecture, CareCast monitors vitals, predicts risks, and triggers emergency alerts when thresholds are crossed."
        : "A real-time health monitoring and safety platform designed to provide early alerts and emergency response features. Built with Next.js and Firebase to ensure reliability and scalability.",
      tech: ["Next.js", "Firebase", "HealthTech"],
      github: "#"
    },
    {
      title: "Jarvis — Voice Assistant",
      subtitle: realm === 'dark' ? "The Whispering Machine" : "Voice-Activated Assistant",
      description: realm === 'dark'
        ? "A Python-based voice assistant that listens, responds, and executes. From opening applications and fetching news to interacting with AI systems — Jarvis transforms speech into action."
        : "A voice-activated assistant built with Python that performs tasks, answers queries, and interacts with AI models through speech. Designed to make everyday digital interactions hands-free and intuitive.",
      tech: ["Python", "SpeechRecognition", "OpenAI API"],
      github: "#"
    }
  ];

  return (
    <Section $realm={realm} id="projects">
      <ParticleBackground $realm={realm} />
      <Container
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <Title $realm={realm}>
          {realm === 'dark' ? "Classified Projects" : "Selected Works"}
        </Title>

        <ProjectGrid>
          {projectData.map((project, index) => (
            <CardWrapper
              key={index}
              $realm={realm}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card $realm={realm}>
                <Subtitle $realm={realm}>{project.subtitle}</Subtitle>
                <ProjectTitle $realm={realm}>{project.title}</ProjectTitle>
                <ProjectDesc $realm={realm}>{project.description}</ProjectDesc>
                <TechStack>
                  {project.tech.map((tag, i) => (
                    <Tag key={i} $realm={realm}>{tag}</Tag>
                  ))}
                </TechStack>
                <ButtonGroup>
                  <IconButton
                    href={project.github}
                    $realm={realm}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Github size={24} />
                  </IconButton>
                  <IconButton
                    href="#"
                    $realm={realm}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ExternalLink size={24} />
                  </IconButton>
                </ButtonGroup>
              </Card>
            </CardWrapper>
          ))}
        </ProjectGrid>
      </Container>
    </Section>
  );
};

export default Projects;
