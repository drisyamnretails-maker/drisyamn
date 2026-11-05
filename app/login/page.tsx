"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [f1, setF1] = useState(false);
  const [f2, setF2] = useState(false);
  const [press, setPress] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!loginId || !password) {
      setError('Please enter email/phone and password');
      return;
    }
    setLoading(true);
    try {
      let emailToLogin = loginId.trim();
      if (!emailToLogin.includes('@')) {
        let phone = emailToLogin.replace(/\s/g, '').replace(/[^0-9+]/g, '');
        if (!phone.startsWith('+')) phone = phone.startsWith('91') ? `+${phone}` : `+91${phone}`;
        const { data: profile } = await supabase.from('profiles').select('email').eq('phone', phone).maybeSingle();
        if (profile?.email) {
          emailToLogin = profile.email;
        } else {
          emailToLogin = `${phone.replace(/\+/g, '')}@drisyamn.com`;
        }
      }
      const { error } = await supabase.auth.signInWithPassword({ email: emailToLogin.toLowerCase(), password });
      if (error) throw error;
      router.push('/homefeed');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        @media (min-width: 768px) { .drisyamn-top { padding-top: 48px !important; } }
        @media (max-width: 767px) { .drisyamn-top { padding-top: 56px !important; } }
        input::placeholder { color: #8A7D6B; }
      `}</style>

      <div style={{
        width: '100%',
        maxWidth: '440px',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 32px 40px 32px',
        boxSizing: 'border-box',
      }}>

        <div className="drisyamn-top" style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '48px' }}>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(42px, 11vw, 56px)',
            fontWeight: '400',
            background: 'linear-gradient(90deg, #2D2415 0%, #5A4A32 30%, #8C6F3A 65%, #B89B5E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0',
          }}>
            Drisyamn
          </h1>
        </div>

        <div style={{ height: 'clamp(36px, 6vh, 52px)' } as any} />

        <h2 style={{
          fontFamily: 'Georgia, Times New Roman, serif',
          fontSize: 'clamp(46px, 11vw, 62px)',
          fontWeight: '500',
          lineHeight: '0.88',
          letterSpacing: '-0.03em',
          color: '#0A0A0A',
          margin: '0',
          textAlign: 'center',
        }}>
          Welcome<br />Back
        </h2>

        <div style={{ height: '18px' }} />
        <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(15px, 4vw, 16px)', lineHeight: '1.6', color: '#5C4A32', maxWidth: '320px', margin: '0 auto', textAlign: 'center' }}>
          Log in to continue your story. Connect with your customers, manage your space, and let your city discover you.
        </p>

        <div style={{ height: 'clamp(40px, 6vh, 56px)' } as any} />

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            width: '100%', height: '62px', borderRadius: '14px',
            border: `1px solid ${f1 ? '#C8A86A' : '#D9C9A8'}`,
            backgroundColor: f1 ? '#FFFFFF' : '#F3EBD9',
            display: 'flex', alignItems: 'center', padding: '0 20px',
            transition: 'all 0.2s ease',
            boxShadow: f1 ? '0 8px 24px rgba(200,168,106,0.18)' : '0 2px 8px rgba(0,0,0,0.04)',
            transform: f1 ? 'scale(1.01)' : 'scale(1)',
            boxSizing: 'border-box'
          }}>
            <input value={loginId} onChange={(e) => setLoginId(e.target.value)} onFocus={() => setF1(true)} onBlur={() => setF1(false)} placeholder="Email or Phone" style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '17px', fontFamily: 'Georgia, serif', color: '#2D2415' }} />
          </div>

          <div style={{
            width: '100%', height: '62px', borderRadius: '14px',
            border: `1px solid ${f2 ? '#C8A86A' : '#D9C9A8'}`,
            backgroundColor: f2 ? '#FFFFFF' : '#F3EBD9',
            display: 'flex', alignItems: 'center', padding: '0 12px 0 20px',
            transition: 'all 0.2s ease',
            boxShadow: f2 ? '0 8px 24px rgba(200,168,106,0.18)' : '0 2px 8px rgba(0,0,0,0.04)',
            transform: f2 ? 'scale(1.01)' : 'scale(1)',
            boxSizing: 'border-box'
          }}>
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setF2(true)} onBlur={() => setF2(false)} placeholder="Password" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '17px', fontFamily: 'Georgia, serif', color: '#2D2415' }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '8px', transition: 'all 0.15s' }}>
              {showPassword ? <EyeOff size={20} color="#8A7D6B" strokeWidth={1.6} /> : <Eye size={20} color="#8A7D6B" strokeWidth={1.6} />}
            </button>
          </div>
        </div>

        {error && <p style={{ color: '#8C3A2A', fontSize: '14px', marginTop: '14px', textAlign: 'center', fontFamily: 'Georgia, serif' }}>{error}</p>}

        <div style={{ height: '14px' }} />
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => router.push('/forgot-password')} style={{ background: 'none', border: 'none', fontSize: '15px', fontFamily: 'Georgia, serif', color: '#5C4A32', cursor: 'pointer' }}>Forgot Password?</button>
        </div>

        <div style={{ height: '32px' }} />

        <button
          onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)} onMouseLeave={() => setPress(false)}
          onTouchStart={() => setPress(true)} onTouchEnd={() => setPress(false)}
          onClick={handleLogin} disabled={loading}
          style={{
            width: '100%', height: '60px', borderRadius: '14px',
            border: '1px solid #C8A86A',
            backgroundColor: press ? '#FFFFFF' : '#F3EBD9',
            color: '#2D2415',
            fontFamily: 'Georgia, serif',
            fontSize: '18px', fontWeight: '500',
            cursor: 'pointer',
            transform: press ? 'scale(0.97)' : 'scale(1)',
            transition: 'all 0.18s ease-out',
            boxShadow: press ? 'inset 0 1px 4px rgba(0,0,0,0.08)' : '0 10px 30px rgba(200,168,106,0.22), 0 2px 8px rgba(0,0,0,0.07)',
            opacity: loading ? 0.7 : 1
          }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div style={{ height: '24px' }} />
        <p style={{ fontSize: '15px', fontFamily: 'Georgia, serif', color: '#5C4A32' }}>
          Don't have an account? <span onClick={() => router.push('/signup')} style={{ fontWeight: '700', color: '#2D2415', textDecoration: 'underline', cursor: 'pointer' }}>Sign Up</span>
        </p>

      </div>
    </div>
  );
}