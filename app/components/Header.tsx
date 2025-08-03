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

  // Function to update underline position
  const updateUnderlinePosition = (activeKey: string) => {
    const activeElement = navLinksRef.current[activeKey];
    const tabLinksContainer = document.querySelector('.tab-links');
    
    if (activeElement && tabLinksContainer) {
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
    // Handle exact matches first
    if (currentPath === '/') return 'home';
    
    // Handle nested routes (e.g., /blog/post-title should highlight blog)
    const activeLink = navLinks.find(link => {
      if (link.href === '/') return currentPath === '/';
      return currentPath.startsWith(link.href);
    });
    
    return activeLink?.key || 'home';
  };

  // Update underline when pathname changes
  useEffect(() => {
    const activeKey = getActiveKey(pathname);
    updateUnderlinePosition(activeKey);
  }, [pathname]);

  // Update underline on window resize
  useEffect(() => {
    const handleResize = () => {
      const activeKey = getActiveKey(pathname);
      updateUnderlinePosition(activeKey);
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

  return (
    <header className="nav-header">
      <div className="nav-inner">
        {/* Enhanced Logo with aesthetic styling */}
        <Link href="/" className="logo-minimal-border">
          TJ
        </Link>
        
        <nav className="tab-links">
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
      </div>
    </header>
  );
};

export default Header;