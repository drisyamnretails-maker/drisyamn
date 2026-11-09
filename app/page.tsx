"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function WelcomePage() {
  const router = useRouter();
  const [press, setPress] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isOldUser, setIsOldUser] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsOldUser(true);
      } else {
        const hasAccount = localStorage.getItem('Tasomi_has_account');
        if (hasAccount === 'true') {
          setIsOldUser(true);
        }
      }
      setChecking(false);
    };
    checkUser();
  }, []);

  const handleGetStarted = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.push('/homefeed');
      return;
    }
    if (isOldUser) {
      router.push('/login');
    } else {
      router.push('/signup');
    }
  };

  const navLinks = [
    { label: 'Explore', path: '/homefeed' },
    { label: 'Community', path: '/homefeed' },
    { label: 'Businesses', path: '/homefeed' },
    { label: 'About', path: '/homefeed' },
  ];

  return (
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <style>{`
        @media (min-width: 768px) {
          .nav-desktop { display: flex !important; }
          .nav-hamburger { display: none !important; }
          .header-inner { max-width: 1100px !important; }
        }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>

      {/* ===== HEADER NAV ===== */}
      <header style={{
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #F2ECE3',
      }}>
        <div className="header-inner" style={{
          width: '100%',
          maxWidth: '440px',
          margin: '0 auto',
          padding: '14px 20px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo - Left - APNA GREEN */}
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '28px',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              color: '#5A7A6A',
              padding: 0,
            }}
          >
            Tasomi
          </button>

          {/* Desktop Links */}
          <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => router.push(link.path)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333333',
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => router.push('/login')}
              style={{
                backgroundColor: '#5A7A6A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '999px',
                padding: '9px 20px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Login
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#111',
              padding: '4px 8px',
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div style={{
            width: '100%',
            maxWidth: '440px',
            margin: '0 auto',
            padding: '8px 20px 18px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            backgroundColor: '#fff',
            borderTop: '1px solid #F2ECE3',
          }}>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => { setMenuOpen(false); router.push(link.path); }}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: '12px 8px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#222',
                  cursor: 'pointer',
                  borderBottom: '1px solid #F2ECE3',
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { setMenuOpen(false); router.push('/login'); }}
              style={{
                marginTop: '10px',
                backgroundColor: '#5A7A6A',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Login
            </button>
          </div>
        )}
      </header>

      {/* ===== MAIN CONTENT - Same as before ===== */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 32px',
        boxSizing: 'border-box',
        alignItems: 'center',
      }}>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: '40px', paddingBottom: '120px', width: '100%' }}>
          
          <h2 style={{
            fontFamily: 'Georgia, Times New Roman, serif',
            fontSize: 'clamp(48px, 12.5vw, 66px)',
            fontWeight: '500',
            lineHeight: '0.88',
            letterSpacing: '-0.03em',
            color: '#0A0A0A',
            margin: '0',
            textAlign: 'center',
          }}>
            Discover<br />
            everything<br />
            around you
          </h2>

          <div style={{ height: '22px' }} />

          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(15px, 4vw, 17px)',
            lineHeight: '1.6',
            color: '#5C5C5C',
            maxWidth: '310px',
            margin: '0 auto',
            fontWeight: '400',
            textAlign: 'center',
          }}>
            Where your local community connects — People, Places & Businesses around you
          </p>

          <div style={{ height: '38px' }} />

          {/* Divider Line - APNA GREEN + BEIGE */}
          <div style={{
            width: '190px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, #E8DCC3 20%, #5A7A6A 50%, #E8DCC3 80%, transparent 100%)',
          }} />

        </div>

        <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '0 32px 44px 32px', boxSizing: 'border-box' }}>
          <button
            onMouseDown={() => setPress(true)}
            onMouseUp={() => setPress(false)}
            onMouseLeave={() => setPress(false)}
            onTouchStart={() => setPress(true)}
            onTouchEnd={() => setPress(false)}
            onClick={handleGetStarted}
            disabled={checking}
            style={{
              width: '100%',
              height: '60px',
              borderRadius: '14px',
              border: 'none',
              backgroundColor: press ? '#4A6554' : '#5A7A6A',
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transform: press ? 'scale(0.97)' : 'scale(1)',
              transition: 'all 0.18s ease-out',
              boxShadow: '0 10px 30px rgba(90,122,106,0.30), 0 2px 8px rgba(0,0,0,0.07)',
              opacity: checking ? 0.6 : 1
            }}
          >
            {checking ? 'Loading...' : 'Get Started'}
          </button>
        </div>

      </div>
    </div>
  );
}