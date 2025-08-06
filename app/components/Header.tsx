"use client";
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavLink {
  href: string;
  label: string;
  key: string;
}

const Header: React.FC = () => {
  const pathname = usePathname();
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinksRef = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

  // Define your navigation links
  const navLinks: NavLink[] = [
    { href: '/', label: 'HOME', key: 'home' },
    { href: '/blog', label: 'BLOG', key: 'blog' },
    { href: '/portfolio', label: 'PORTFOLIO', key: 'portfolio' },
    { href: '/qa', label: 'Q+A', key: 'qa' },
    { href: '/resume', label: 'RESUME', key: 'resume' },
    { href: '/contact', label: 'CONTACT', key: 'contact' },
  ];

  // Function to update underline position (desktop only)
  const updateUnderlinePosition = (activeKey: string) => {
    const activeElement = navLinksRef.current[activeKey];
    const tabLinksContainer = document.querySelector('.tab-links');
   
    if (activeElement && tabLinksContainer && window.innerWidth > 768) {
      const activeRect = activeElement.getBoundingClientRect();
      const containerRect = tabLinksContainer.getBoundingClientRect();
     
      const leftOffset = activeRect.left - containerRect.left;
      const width = activeRect.width;
     
      setUnderlineStyle({
        left: leftOffset,
        width: width
      });
    }
  };

  // Get active link key based on current pathname
  const getActiveKey = (currentPath: string): string => {
    if (currentPath === '/') return 'home';
   
    const activeLink = navLinks.find(link => {
      if (link.href === '/') return currentPath === '/';
      return currentPath.startsWith(link.href);
    });
   
    return activeLink?.key || 'home';
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    const activeKey = getActiveKey(pathname);
    updateUnderlinePosition(activeKey);
  }, [pathname]);

  // Update underline on window resize
  useEffect(() => {
    const handleResize = () => {
      const activeKey = getActiveKey(pathname);
      updateUnderlinePosition(activeKey);
      // Close mobile menu on resize to desktop
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pathname]);

  // Initial positioning after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeKey = getActiveKey(pathname);
      updateUnderlinePosition(activeKey);
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="nav-header">
      <div className="nav-inner">
        {/* Logo */}
        <Link href="/" className="logo-minimal-border">
          TJ
        </Link>

        {/* Desktop Navigation */}
        <nav className="tab-links desktop-nav">
          {navLinks.map((link) => {
            const isActive = getActiveKey(pathname) === link.key;
           
            return (
              <Link
                key={link.key}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                ref={(el) => {
                  navLinksRef.current[link.key] = el;
                }}
              >
                <span className="nav-link-text">{link.label}</span>
              </Link>
            );
          })}
         
          <div
            className={`nav-underline ${isLoaded ? 'loaded' : ''}`}
            style={{
              left: `${underlineStyle.left}px`,
              width: `${underlineStyle.width}px`,
            }}
          />
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Mobile Navigation Menu */}
        <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-content">
            {navLinks.map((link) => {
              const isActive = getActiveKey(pathname) === link.key;
             
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && (
          <div 
            className="mobile-menu-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </header>
  );
};

export default Header;