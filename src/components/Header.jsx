import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, Ghost, Zap, Mail, Menu, X, Sun, FileText, GraduationCap } from 'lucide-react';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  background: ${props => props.$isScrolled ? (props.$realm === 'dark' ? 'rgba(5, 5, 5, 0.9)' : 'rgba(255, 255, 255, 0.9)') : 'transparent'};
  backdrop-filter: ${props => props.$isScrolled ? 'blur(10px)' : 'none'};
  transition: all 0.3s ease;
  border-bottom: ${props => props.$isScrolled ? `1px solid ${props.theme.colors.primary}` : 'none'};
`;

const Logo = styled.div`
  font-family: ${props => props.theme.fonts.heading};
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 1.2s ease-in-out;
  
  &:hover {
    text-shadow: 0 0 15px ${props => props.theme.colors.accent};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${props => props.theme.fonts.subheading};
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const MobileToggle = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  z-index: 1001;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: ${props => props.$realm === 'dark' ? 'rgba(5, 5, 5, 0.98)' : 'rgba(255, 255, 255, 0.98)'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  z-index: 1000;
`;

const Header = ({ realm }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: realm === 'dark' ? 'Dark Legend' : 'Celestial Story', icon: <Ghost size={18} />, href: '#about' },
    { name: realm === 'dark' ? 'Sacred Scroll' : 'Digital Archive', icon: <FileText size={18} />, href: '#cv' },
    { name: realm === 'dark' ? 'The Initiation' : 'Scholarly Path', icon: <GraduationCap size={18} />, href: '#education' },
    { name: realm === 'dark' ? 'Forbidden Works' : 'Radiant Projects', icon: <Zap size={18} />, href: '#projects' },
    { name: realm === 'dark' ? 'Summon Me' : 'Reach Out', icon: <Mail size={18} />, href: '#contact' },
  ];

  return (
    <>
      <Nav
        $isScrolled={isScrolled}
        $realm={realm}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          {realm === 'dark' ? <Skull size={24} /> : <Sun size={24} />} Pixie
        </Logo>

        <NavLinks>
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              href={item.href}
              whileHover={{ scale: 1.1, x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {item.icon} {item.name}
            </NavItem>
          ))}
        </NavLinks>

        <MobileToggle onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </MobileToggle>
      </Nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            $realm={realm}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {navItems.map((item, index) => (
              <NavItem
                key={index}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                style={{ fontSize: '1.8rem', gap: '1rem' }}
              >
                {item.icon} {item.name}
              </NavItem>
            ))}
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
