import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen" style={{ fontFamily: 'var(--font-primary)', backgroundColor: 'var(--color-bg)' }}>
      {/* Simple Header for Auth Pages */}
      <header className="glass" style={{
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', flexShrink: 0, boxShadow: 'var(--shadow-md)'
            }}>
              <Shield size={20} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-heading)' }}>
              DISHA
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
