import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999; /* ABOVE EVERYTHING EXCEPT CURSOR */
  pointer-events: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ExpansionLayer = styled(motion.div)`
  position: absolute;
  width: 100px;
  height: 100px;
  background: ${props => props.$color};
  border-radius: 50%;
  filter: blur(60px);
  will-change: transform;
`;

const Flash = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: #fff;
  filter: blur(120px);
  z-index: 100000;
  pointer-events: none;
`;

const RealmTransition = ({ isTransitioning, realm }) => {
    // expansionColor is what covers the screen.
    // Movement Dark -> Light should be White expansion.
    // Movement Light -> Dark should be Dark expansion.
    const expansionColor = useRef(realm === 'dark' ? '#fff' : '#050505');

    useEffect(() => {
        if (!isTransitioning) {
            // Update the color for the NEXT transition
            expansionColor.current = realm === 'dark' ? '#fff' : '#050505';
        }
    }, [isTransitioning, realm]);

    return (
        <AnimatePresence mode="wait">
            {isTransitioning && (
                <Overlay key="portal-transition">
                    <ExpansionLayer
                        $color={expansionColor.current}
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{
                            scale: 45,
                            opacity: 1
                        }}
                        exit={{
                            opacity: 0,
                            transition: { duration: 0.8, ease: "easeOut" }
                        }}
                        transition={{
                            scale: { duration: 0.85, ease: [0.4, 0, 0.2, 1] },
                        }}
                    />
                    <Flash
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.7, 0] }}
                        transition={{ duration: 1.2, times: [0, 0.4, 1], ease: "easeInOut" }}
                    />
                </Overlay>
            )}
        </AnimatePresence>
    );
};

export default RealmTransition;
