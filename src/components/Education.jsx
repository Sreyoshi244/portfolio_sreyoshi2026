import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

const Section = styled.section`
  padding: clamp(4rem, 12vh, 8rem) 1.5rem;
  background: transparent;
  position: relative;
  overflow: hidden;
  z-index: 5;
`;

const Container = styled(motion.div)`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(motion.h2)`
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  text-align: center;
  margin-bottom: 4rem;
  font-family: ${props => props.theme.fonts.heading};
  color: ${props => props.theme.colors.text};
  letter-spacing: 2px;
  transition: all 0.8s ease-in-out;
  
  ${props => props.$realm === 'dark' && css`
    text-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
  `}
`;

const TimelineContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(2.5rem, 8vw, 4rem);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: ${props => props.$realm === 'dark'
    ? 'linear-gradient(to bottom, transparent, #ff0000, transparent)'
    : 'linear-gradient(to bottom, transparent, #d4af37, transparent)'};
    box-shadow: ${props => props.$realm === 'dark' ? '0 0 15px #ff000088' : '0 0 15px #d4af3788'};
    transition: all 0.8s ease-in-out;
  }

  @media (max-width: 768px) {
    &::before {
      left: 0;
      transform: none;
    }
  }
`;

const TimelineItem = styled(motion.div)`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: ${props => props.$index % 2 === 0 ? 'flex-start' : 'flex-end'};
  padding-left: ${props => props.$index % 2 === 0 ? '0' : '50%'};
  padding-right: ${props => props.$index % 2 === 0 ? '50%' : '0'};

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 30px;
    padding-right: 0;
  }
`;

const ContentBox = styled.div`
  max-width: 450px;
  padding: clamp(0.5rem, 2vw, 1rem);
  position: relative;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Node = styled.div`
  position: absolute;
  top: 1.5rem;
  left: ${props => props.$index % 2 === 0 ? 'calc(100% + 44px)' : 'calc(-53px)'};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.$realm === 'dark' ? '#ff0000' : '#d4af37'};
  box-shadow: ${props => props.$realm === 'dark' ? '0 0 15px #ff0000' : '0 0 15px #d4af37'};
  z-index: 2;
  transition: all 0.8s ease-in-out;
  border: 3px solid ${props => props.$realm === 'dark' ? '#0a0a0a' : '#fff'};

  @media (max-width: 768px) {
    left: -42px;
  }
`;

const DateCapsule = styled.div`
  display: inline-block;
  padding: 0.2rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
  font-family: ${props => props.theme.fonts.body};
  border: 1px solid ${props => props.$realm === 'dark' ? '#ff3333' : '#d4af37'};
  color: ${props => props.$realm === 'dark' ? '#ff3333' : '#b8860b'};
  background: ${props => props.$realm === 'dark' ? 'rgba(255, 0, 0, 0.05)' : 'rgba(212, 175, 55, 0.05)'};
  transition: all 0.8s ease-in-out;

  &:hover {
    box-shadow: ${props => props.$realm === 'dark' ? '0 0 10px rgba(255, 0, 0, 0.3)' : '0 0 10px rgba(212, 175, 55, 0.3)'};
    background: ${props => props.$realm === 'dark' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(212, 175, 55, 0.1)'};
  }
`;

const Degree = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  transition: color 0.8s ease-in-out;
`;

const Institution = styled.h4`
  font-family: ${props => props.theme.fonts.subheading};
  font-size: 1.1rem;
  color: ${props => props.$realm === 'dark' ? '#ff3333' : '#d4af37'};
  margin-bottom: 1rem;
  opacity: 0.9;
  transition: color 0.8s ease-in-out;
`;

const Description = styled.p`
  font-family: ${props => props.theme.fonts.body};
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  transition: color 0.8s ease-in-out;
`;

const Education = ({ realm }) => {
  const educationData = [
    {
      degree: "B.Tech — Electronics & Communication Engineering",
      institution: "Kalyani Government Engineering College",
      date: "2024 – 2028",
      description: "Engineering systems at the intersection of hardware, signals, and intelligent computation."
    },
    {
      degree: "Higher Secondary (CBSE)",
      institution: "DAV School, KGP IIT",
      date: "CBSE 12th (2024) — 95% | CBSE 10th (2022) — 93.8%",
      description: "Built foundations in mathematics, physics, and computational thinking."
    }
  ];

  return (
    <Section id="education">
      <Container
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <Title $realm={realm}>
          {realm === 'dark' ? "The Formation of the Architect" : "Academic Foundation"}
        </Title>

        <TimelineContainer $realm={realm}>
          {educationData.map((item, index) => (
            <TimelineItem
              key={index}
              $index={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Node $realm={realm} $index={index} />
              <ContentBox>
                <DateCapsule $realm={realm}>{item.date}</DateCapsule>
                <Degree>{item.degree}</Degree>
                <Institution $realm={realm}>{item.institution}</Institution>
                <Description>{item.description}</Description>
              </ContentBox>
            </TimelineItem>
          ))}
        </TimelineContainer>
      </Container>
    </Section>
  );
};

export default Education;
