import React, { useState, Suspense, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import Header from './components/Header';
import About from './components/About';
import Education from './components/Education';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Hero from './components/Hero';
import HolyCrossCursor from './components/HolyCrossCursor';
import Scene3D from './scenes/Atmosphere';
import ColorBends from './components/ColorBends';
import Aurora from './components/Aurora';
import RealmTransition from './components/RealmTransition';
import CelestialParticles from './components/CelestialParticles';
import AudioPlayer from './components/AudioPlayer';
import DownloadCV from './components/DownloadCV';

const Main = styled.main`
  flex-grow: 1;
  background-color: transparent;
  min-height: 100vh;
  position: relative;
  z-index: 2;
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  background: ${props => props.$realm === 'dark' ? '#000' : 'radial-gradient(circle at center, #fcfaff, #f0f4f8)'};
  transition: background 1.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Footer = styled.footer`
  padding: 3rem;
  text-align: center;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textSecondary};
  border-top: 1px solid ${props => props.theme.colors.secondary};
  font-family: 'Inter', sans-serif;
  letter-spacing: 2px;
  position: relative;
  z-index: 2;
  transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

function App() {
  const [realm, setRealm] = useState('dark');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleRealm = () => {
    console.log('toggleRealm called. Current realm:', realm);
    setIsTransitioning(true);

    // Switch state when the expansion is at its peak (approx 850ms)
    setTimeout(() => {
      console.log('Switching realm state...');
      setRealm(prev => prev === 'dark' ? 'light' : 'dark');
    }, 850);

    // End transition after the expansion has fully covered and stay for a moment
    setTimeout(() => {
      console.log('Transition complete.');
      setIsTransitioning(false);
    }, 1800);
  };

  return (
    <ThemeProvider theme={theme(realm)}>
      <GlobalStyles />
      <AudioPlayer realm={realm} />
      <HolyCrossCursor realm={realm} />
      <Header realm={realm} />

      <RealmTransition isTransitioning={isTransitioning} realm={realm} />

      <BackgroundContainer $realm={realm}>
        <Aurora
          colorStops={realm === 'dark'
            ? ["#000000", "#550000", "#ff0000"]
            : ["#e8f0ff", "#c0d4ff", "#a0c8ff"]}
          speed={0.5}
        />
        {realm === 'light' && <CelestialParticles />}

        <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            {realm === 'dark' ? (
              <ColorBends
                colors={["#440000", "#110000", "#000000"]}
                rotation={45}
                speed={0.12}
                scale={1.2}
                frequency={0.4}
                warpStrength={1.5}
                mouseInfluence={0.4}
                parallax={0.15}
                noise={0.05}
                transparent
              />
            ) : (
              <ColorBends
                colors={["#F0F8FF", "#FDFCF0", "#87CEFA"]}
                rotation={-45}
                speed={0.06}
                scale={1.5}
                frequency={0.3}
                warpStrength={0.4}
                mouseInfluence={0.1}
                parallax={0.05}
                noise={0.005}
                transparent
              />
            )}
            <Scene3D realm={realm} />
          </Suspense>
        </Canvas>
      </BackgroundContainer>

      <Main>
        <Suspense fallback={<div style={{ color: '#8b0000', textAlign: 'center', paddingTop: '45vh' }}>Summoning the Abyss...</div>}>
          <Hero realm={realm} toggleRealm={toggleRealm} isTransitioning={isTransitioning} />
        </Suspense>
        <About realm={realm} />
        <DownloadCV realm={realm} />
        <Education realm={realm} />
        <Projects realm={realm} />
        <Contact realm={realm} />
      </Main>
      <Footer>
        <p>© {new Date().getFullYear()} Pixie • {realm === 'dark' ? 'Created in the Abyss' : 'Forged in Starlight'}</p>
      </Footer>
    </ThemeProvider>
  );
}

export default App;
