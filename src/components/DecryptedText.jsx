import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const glitch = keyframes`
  0% { text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.5), -0.025em -0.05em 0 rgba(0, 255, 255, 0.2), 0.025em 0.05em 0 rgba(139, 0, 0, 0.5); }
  14% { text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.5), -0.025em -0.05em 0 rgba(0, 255, 255, 0.2), 0.025em 0.05em 0 rgba(139, 0, 0, 0.5); }
  15% { text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.5), 0.025em 0.025em 0 rgba(0, 255, 255, 0.2), -0.05em -0.05em 0 rgba(139, 0, 0, 0.5); }
  49% { text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.5), 0.025em 0.025em 0 rgba(0, 255, 255, 0.2), -0.05em -0.05em 0 rgba(139, 0, 0, 0.5); }
  50% { text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.5), 0.05em 0 0 rgba(0, 255, 255, 0.2), 0 -0.05em 0 rgba(139, 0, 0, 0.5); }
  99% { text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.5), 0.05em 0 0 rgba(0, 255, 255, 0.2), 0 -0.05em 0 rgba(139, 0, 0, 0.5); }
  100% { text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.5), -0.025em -0.025em 0 rgba(0, 255, 255, 0.2), -0.025em -0.05em 0 rgba(139, 0, 0, 0.5); }
`;

const TextWrapper = styled.span`
  display: inline-block;
  font-family: ${props => props.fontFamily || 'inherit'};
  animation: ${props => props.$useGlitch ? glitch : 'none'} 2s infinite linear alternate-reverse;
`;

const DecryptedText = ({
    text,
    speed = 50,
    maxIterations = 10,
    className,
    fontFamily,
    useGlitch = false
}) => {
    const [displayText, setDisplayText] = useState('');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    const iterations = useRef(0);
    const interval = useRef(null);

    useEffect(() => {
        let iteration = 0;

        interval.current = setInterval(() => {
            setDisplayText(
                text
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('')
            );

            if (iteration >= text.length) {
                clearInterval(interval.current);
            }

            iteration += 1 / maxIterations;
        }, speed);

        return () => clearInterval(interval.current);
    }, [text, speed, maxIterations]);

    return <TextWrapper className={className} fontFamily={fontFamily} $useGlitch={useGlitch}>{displayText}</TextWrapper>;
};

export default DecryptedText;
