"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function WelcomePage() {
  const router = useRouter();
  const [press, setPress] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check karo user old hai ya new
  const [isOldUser, setIsOldUser] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      // 1. Kya supabase me session hai?
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsOldUser(true);
      } else {
        // 2. Kya localStorage me flag hai ki pehle account bana tha?
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
    // Agar already logged in hai toh sidha homefeed
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.push('/homefeed');
      return;
    }

    if (isOldUser) {
      // Old user / Logout wala -> Login
      router.push('/login');
    } else {
      // New user -> Signup
      router.push('/signup');
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      backgroundColor: '#F6F1E8',
      backgroundImage: `radial-gradient(ellipse at top, rgba(200,168,106,0.08) 0%, transparent 60%), radial-gradient(ellipse at bottom, rgba(200,168,106,0.12) 0%, transparent 60%)`,
      display: 'flex',
      justifyContent: 'center',
    }}>
      <style>{`
        @media (min-width: 768px) {
          .Tasomi-top { padding-top: 48px !important; }
        }
        @media (max-width: 767px) {
          .Tasomi-top { padding-top: 72px !important; }
        }
      `}</style>

      <div style={{
        width: '100%',
        maxWidth: '440px',
        minHeight: '100dvh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 32px',
        boxSizing: 'border-box',
        alignItems: 'center',
      }}>

        <div className="Tasomi-top" style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '48px' }}>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(42px, 11vw, 56px)',
            fontWeight: '400',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(90deg, #2D2415 0%, #5A4A32 30%, #8C6F3A 65%, #B89B5E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0',
            textAlign: 'center',
          }}>
            Tasomi
          </h1>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: '120px', width: '100%' }}>
          
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
            color: '#5C4A32',
            maxWidth: '310px',
            margin: '0 auto',
            fontWeight: '400',
            textAlign: 'center',
          }}>
            Where your local community connects — People, Places & Businesses around you
          </p>

          <div style={{ height: '38px' }} />

          <div style={{
            width: '190px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, #D4B483 20%, #B89B5E 50%, #D4B483 80%, transparent 100%)',
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
              border: '1px solid #C8A86A',
              backgroundColor: press ? '#FFFFFF' : '#F3EBD9',
              color: '#2D2415',
              fontFamily: 'Georgia, serif',
              fontSize: '18px',
              fontWeight: '500',
              cursor: 'pointer',
              transform: press ? 'scale(0.97)' : 'scale(1)',
              transition: 'all 0.18s ease-out',
              boxShadow: press ? 'inset 0 1px 4px rgba(0,0,0,0.08)' : '0 10px 30px rgba(200,168,106,0.22), 0 2px 8px rgba(0,0,0,0.07)',
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