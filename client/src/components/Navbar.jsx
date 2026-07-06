import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Sun, Moon, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Initialize Dark Mode state based on body class or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.body.classList.add('dark-mode');
      setIsDarkMode(true);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Programs', path: '/programs' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: 'var(--navbar-height)',
      display: 'flex',
      alignItems: 'center',
      transition: 'all 300ms ease',
      background: scrolled ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.88)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      boxShadow: scrolled ? '0 12px 40px rgba(0, 0, 0, 0.1)' : '0 8px 30px rgba(0, 0, 0, 0.08)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem' }}>
          <span style={{
            display: 'flex',
            padding: '0.45rem',
            borderRadius: '8px',
            background: 'var(--gradient-primary)',
            color: '#ffffff',
            boxShadow: 'var(--gradient-glow)'
          }}>
            <Shield size={20} />
          </span>
          <span style={{ color: '#12233D', opacity: 1, mixBlendMode: 'normal' }}>DISHA</span>
          <span style={{ color: '#F26B2D', opacity: 1, mixBlendMode: 'normal' }}>FOR INDIA</span>
        </Link>

        {/* Desktop Links & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="nav-link-hover"
                style={{
                  fontWeight: 600,
                  fontSize: '0.925rem',
                  color: isActive(link.path) ? '#F26B2D' : '#12233D',
                  padding: '0.25rem 0',
                  borderBottom: isActive(link.path) ? '2px solid #F26B2D' : '2px solid transparent',
                  transition: 'color 300ms ease, border-color 300ms ease'
                }}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <Link
                to="/dashboard"
                className="nav-link-hover"
                style={{
                  fontWeight: 600,
                  fontSize: '0.925rem',
                  color: isActive('/dashboard') ? '#F26B2D' : '#12233D',
                  padding: '0.25rem 0',
                  borderBottom: isActive('/dashboard') ? '2px solid #F26B2D' : '2px solid transparent',
                  transition: 'color 300ms ease, border-color 300ms ease'
                }}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Vertical Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(0,0,0,0.1)' }}></div>

          {/* Theme Toggle & Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={toggleDarkMode}
              style={{
                padding: '0.5rem',
                borderRadius: '50%',
                color: '#12233D',
                backgroundColor: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition-fast)'
              }}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} style={{ color: '#F59E0B' }} /> : <Moon size={18} />}
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ display: 'flex', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
              >
                <LogOut size={14} /> Log Out
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderColor: 'rgba(0,0,0,0.1)', color: '#12233D' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', background: '#F26B2D', borderColor: '#F26B2D', color: '#ffffff' }}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <div style={{ display: 'none' }} className="mobile-toggle">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={toggleDarkMode}
              style={{
                padding: '0.4rem',
                borderRadius: '50%',
                color: '#12233D',
                backgroundColor: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(0,0,0,0.1)'
              }}
            >
              {isDarkMode ? <Sun size={16} style={{ color: '#F59E0B' }} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              style={{ color: '#12233D', padding: '0.25rem' }}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Drawer menu overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex' }}>
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}
          />
          
          {/* Menu Panel */}
          <div style={{
            position: 'relative',
            width: '280px',
            marginLeft: 'auto',
            backgroundColor: 'var(--color-card)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-xl)',
            padding: '1.5rem',
            animation: 'slideIn 0.3s ease-out forwards'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>DFI NAVIGATION</span>
              <button onClick={() => setMobileOpen(false)} style={{ color: 'var(--color-heading)' }}>
                <X size={24} />
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    color: isActive(link.path) ? '#F26B2D' : 'var(--color-heading)',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid var(--color-border)'
                  }}
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    color: isActive('/dashboard') ? '#F26B2D' : 'var(--color-heading)',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              )}
            </nav>

            <div style={{ marginTop: 'auto' }}>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="btn btn-danger"
                  style={{ width: '100%', display: 'flex', gap: '0.5rem' }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ width: '100%', background: '#F26B2D', borderColor: '#F26B2D', color: '#ffffff' }}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Responsive Inline Styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .nav-link-hover:hover {
          color: #F26B2D !important;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
