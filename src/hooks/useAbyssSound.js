import React, { useState, useEffect, useRef } from 'react';

// This hook handles the synthesized "Abyss Rumble" using Web Audio API
const useAbyssSound = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContext = useRef(null);
    const oscillator = useRef(null);
    const gainNode = useRef(null);
    const filter = useRef(null);

    const initAudio = () => {
        if (audioContext.current) return;

        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();

        // Low frequency oscillator for the rumble
        oscillator.current = audioContext.current.createOscillator();
        oscillator.current.type = 'sine';
        oscillator.current.frequency.setValueAtTime(40, audioContext.current.currentTime);

        // Filter to make it "darker"
        filter.current = audioContext.current.createBiquadFilter();
        filter.current.type = 'lowpass';
        filter.current.frequency.setValueAtTime(100, audioContext.current.currentTime);

        // Gain for volume control and fade-in
        gainNode.current = audioContext.current.createGain();
        gainNode.current.gain.setValueAtTime(0, audioContext.current.currentTime);

        oscillator.current.connect(filter.current);
        filter.current.connect(gainNode.current);
        gainNode.current.connect(audioContext.current.destination);

        oscillator.current.start();
    };

    const toggleSound = () => {
        if (!audioContext.current) initAudio();

        if (isPlaying) {
            gainNode.current.gain.exponentialRampToValueAtTime(0.0001, audioContext.current.currentTime + 1.5);
            setIsPlaying(false);
        } else {
            if (audioContext.current.state === 'suspended') {
                audioContext.current.resume();
            }
            gainNode.current.gain.exponentialRampToValueAtTime(0.2, audioContext.current.currentTime + 2);
            setIsPlaying(true);
        }
    };

    return { isPlaying, toggleSound };
};

export default useAbyssSound;
