export const theme = (mode) => ({
  colors: {
    background: mode === 'dark' ? 'rgba(5, 5, 5, 0.8)' : '#F9FBFF',
    surface: mode === 'dark' ? 'rgba(10, 10, 10, 0.8)' : '#FFFFFF',
    primary: mode === 'dark' ? '#B22222' : '#87CEFA', // Firebrick vs LightSkyBlue
    secondary: mode === 'dark' ? '#1a1a1a' : '#E6F0FF',
    text: mode === 'dark' ? '#D3D3D3' : '#2F4F4F',
    textSecondary: mode === 'dark' ? '#888' : '#778899',
    accent: mode === 'dark' ? '#FF0000' : '#FFD700', // Crimson vs Gold
    glitch: mode === 'dark' ? 'rgba(178, 34, 34, 0.2)' : 'rgba(135, 206, 250, 0.1)'
  },
  fonts: {
    heading: mode === 'dark' ? "'Cinzel', serif" : "'Space Grotesk', sans-serif",
    subheading: mode === 'dark' ? "'Cormorant Garamond', serif" : "'Inter', sans-serif",
    body: "'Space Grotesk', sans-serif"
  }
});
