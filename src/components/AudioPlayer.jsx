import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import horrorMusic from './horror music.mp3';
import angelicMusic from './angelic.mp3';

const AudioControl = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.realm === 'dark' ? 'rgba(139, 0, 0, 0.1)' : 'rgba(135, 206, 250, 0.1)'};
  border: 1px solid ${props => props.theme.colors.primary}44;
  color: ${props => props.theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1000;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}22;
    box-shadow: 0 0 20px ${props => props.theme.colors.primary}44;
    scale: 1.1;
  }
`;

// Section IDs to watch for scroll entry
const WATCHED_SECTIONS = ['about', 'projects', 'contact'];

const AudioPlayer = ({ realm }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const mutedRef = useRef(false);

    // Keep ref in sync with state so IntersectionObserver callback has latest value
    useEffect(() => { mutedRef.current = isMuted; }, [isMuted]);

    // Create audio instance once
    useEffect(() => {
        const audio = new Audio(realm === 'dark' ? horrorMusic : angelicMusic);
        audio.volume = 0.6;
        audio.loop = false;
        audio.addEventListener('ended', () => setIsPlaying(false));
        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.removeEventListener('ended', () => setIsPlaying(false));
        };
    }, []);

    // Update audio source when realm changes
    useEffect(() => {
        if (audioRef.current) {
            const wasPlaying = !audioRef.current.paused;
            audioRef.current.pause();
            audioRef.current.src = realm === 'dark' ? horrorMusic : angelicMusic;
            audioRef.current.load();
            if (wasPlaying) {
                audioRef.current.play().catch(() => { });
            }
        }
    }, [realm]);

    // Intersection Observer: play horror sting whenever a section scrolls into view
    useEffect(() => {
        const playStrike = () => {
            // ONLY play on scroll in DARK realm
            if (mutedRef.current || !audioRef.current || realm !== 'dark') return;
            const audio = audioRef.current;
            audio.currentTime = 0;
            audio.loop = false;
            audio.play()
                .then(() => setIsPlaying(true))
                .catch(() => { });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) playStrike();
                });
            },
            { threshold: 0.2 }
        );

        const attach = () => {
            WATCHED_SECTIONS.forEach(id => {
                const el = document.getElementById(id);
                if (el) observer.observe(el);
            });
        };

        attach();
        const timer = setTimeout(attach, 1500);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [realm]); // Re-bind observer if realm changes to ensure playStrike logic is fresh

    const toggleMute = (e) => {
        e.stopPropagation();
        setIsMuted(prev => {
            const nextMuted = !prev;
            if (audioRef.current) {
                if (nextMuted) {
                    // Muting — stop everything
                    audioRef.current.pause();
                    if (realm === 'dark') audioRef.current.currentTime = 0;
                    setIsPlaying(false);
                } else {
                    // Unmuting
                    if (realm === 'light') {
                        // In light mode, clicking unmuting STARTS the persistent loop
                        audioRef.current.loop = true;
                        audioRef.current.play()
                            .then(() => setIsPlaying(true))
                            .catch(() => { });
                    }
                }
            }
            return nextMuted;
        });
    };

    return (
        <AudioControl
            realm={realm}
            onClick={toggleMute}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.9 }}
            title={isMuted ? (realm === 'dark' ? 'Unmute Abyssal Echoes' : 'Unmute Celestial Harmony') : (realm === 'dark' ? 'Mute Abyssal Echoes' : 'Mute Celestial Harmony')}
        >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </AudioControl>
    );
};

export default AudioPlayer;
