import React from 'react';
import styled, { keyframes } from 'styled-components';

const glitchAnim = keyframes`
  0% {
    clip: rect(42px, 9999px, 44px, 0);
    transform: skew(0.5deg);
  }
  5% {
    clip: rect(12px, 9999px, 29px, 0);
    transform: skew(0.1deg);
  }
  10% {
    clip: rect(85px, 9999px, 73px, 0);
    transform: skew(0.5deg);
  }
  15% {
    clip: rect(24px, 9999px, 51px, 0);
    transform: skew(0.3deg);
  }
  20% {
    clip: rect(29px, 9999px, 85px, 0);
    transform: skew(0.2deg);
  }
  25% {
    clip: rect(100px, 9999px, 57px, 0);
    transform: skew(0.8deg);
  }
  30% {
    clip: rect(50px, 9999px, 12px, 0);
    transform: skew(0.1deg);
  }
  35% {
    clip: rect(10px, 9999px, 90px, 0);
    transform: skew(0.4deg);
  }
  40% {
    clip: rect(70px, 9999px, 70px, 0);
    transform: skew(0.6deg);
  }
  45% {
    clip: rect(5px, 9999px, 15px, 0);
    transform: skew(0.5deg);
  }
  50% {
    clip: rect(2px, 9999px, 80px, 0);
    transform: skew(0.3deg);
  }
  55% {
    clip: rect(40px, 9999px, 30px, 0);
    transform: skew(0.2deg);
  }
  60% {
    clip: rect(80px, 9999px, 60px, 0);
    transform: skew(0.7deg);
  }
  65% {
    clip: rect(15px, 9999px, 45px, 0);
    transform: skew(0.5deg);
  }
  70% {
    clip: rect(55px, 9999px, 10px, 0);
    transform: skew(0.4deg);
  }
  75% {
    clip: rect(95px, 9999px, 95px, 0);
    transform: skew(0.8deg);
  }
  80% {
    clip: rect(35px, 9999px, 35px, 0);
    transform: skew(0.1deg);
  }
  85% {
    clip: rect(65px, 9999px, 65px, 0);
    transform: skew(0.4deg);
  }
  90% {
    clip: rect(5px, 9999px, 55px, 0);
    transform: skew(0.3deg);
  }
  95% {
    clip: rect(25px, 9999px, 25px, 0);
    transform: skew(0.9deg);
  }
  100% {
    clip: rect(42px, 9999px, 44px, 0);
    transform: skew(0.5deg);
  }
`;

const GlitchContainer = styled.h1`
  position: relative;
  display: inline-block;
  color: ${props => props.theme.colors.text};
  
  &:before, &:after {
    content: '${props => props.text}';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
  }

  &:before {
    left: 2px;
    text-shadow: -2px 0 ${props => props.theme.colors.accent};
    clip: rect(44px, 450px, 56px, 0);
    animation: ${glitchAnim} 5s infinite linear alternate-reverse;
  }

  &:after {
    left: -2px;
    text-shadow: -2px 0 ${props => props.theme.colors.glitch};
    clip: rect(44px, 450px, 56px, 0);
    animation: ${glitchAnim} 5s infinite linear alternate-reverse;
  }
`;

const GlitchText = ({ text, className }) => {
    return (
        <GlitchContainer text={text} className={className}>
            {text}
        </GlitchContainer>
    );
};

export default GlitchText;
