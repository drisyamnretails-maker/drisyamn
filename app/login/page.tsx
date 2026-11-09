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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    if (!loginId.trim() || !password) {
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
          emailToLogin = `${phone.replace(/\+/g, '')}@tasomi.com`;
        }
      }
      const { error } = await supabase.auth.signInWithPassword({ email: emailToLogin.toLowerCase(), password });
      if (error) throw error;
      localStorage.setItem('Tasomi_has_account', 'true');
      router.push('/homefeed');
    } catch (err: any) {
      if (err.message?.includes('rate limit')) {
        setError('Bahut baar try kar liya. Thoda wait karo phir try karo.');
      } else if (err.message?.includes('Invalid login')) {
        setError('Wrong Email/Phone ya Password. Dobara try karo.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { label: 'Explore', path: '/homefeed' },
    { label: 'Community', path: '/homefeed' },
    { label: 'Businesses', path: '/homefeed' },
    { label: 'About', path: '/' },
  ];

  return (
    <div style={{ minHeight: '100dvh', width: '100%', maxWidth: '100vw', overflowX: 'hidden', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
      <style>{`
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden !important; max-width: 100vw !important; }
        @media (min-width: 768px) {
          .nav-desktop { display: flex !important; }
          .nav-hamburger { display: none !important; }
          .header-inner { max-width: 1100px !important; }
          .desktop-wrap { max-width: 1100px !important; flex-direction: row !important; align-items: stretch !important; gap: 0 !important; padding: 0 20px !important; }
          .desktop-left { display: flex !important; }
          .desktop-form { max-width: 520px !important; padding: 60px 40px !important; justify-content: center !important; }
        }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .desktop-wrap { width: 100% !important; max-width: 100% !important; padding: 0 !important; }
          .desktop-form { width: 100% !important; max-width: 100% !important; padding: 0 20px 40px 20px !important; }
        }
        input::placeholder { color: #9A9A9A; }
      `}</style>

      <header style={{ width: '100%', maxWidth: '100vw', position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #F2ECE3', boxSizing: 'border-box' }}>
        <div className="header-inner" style={{ width: '100%', maxWidth: '440px', margin: '0 auto', padding: '14px 20px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em', color: '#5A7A6A', padding: 0 }}>Tasomi</button>
          <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {navLinks.map((link) => (
              <button key={link.label} onClick={() => router.push(link.path)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '500', color: '#333333' }}>{link.label}</button>
            ))}
            <button onClick={() => router.push('/signup')} style={{ backgroundColor: '#5A7A6A', color: '#FFFFFF', border: 'none', borderRadius: '999px', padding: '9px 20px', fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Sign Up</button>
          </nav>
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#111', padding: '4px 8px' }}>{menuOpen ? '✕' : '☰'}</button>
        </div>
        {menuOpen && (
          <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto', padding: '8px 20px 18px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: '#fff', borderTop: '1px solid #F2ECE3' }}>
            {navLinks.map((link) => (
              <button key={link.label} onClick={() => { setMenuOpen(false); router.push(link.path); }} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px 8px', fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: '500', color: '#222', cursor: 'pointer', borderBottom: '1px solid #F2ECE3' }}>{link.label}</button>
            ))}
            <button onClick={() => { setMenuOpen(false); router.push('/signup'); }} style={{ marginTop: '10px', backgroundColor: '#5A7A6A', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Sign Up</button>
          </div>
        )}
      </header>

      <div className="desktop-wrap" style={{ width: '100%', maxWidth: '440px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
        <div className="desktop-left" style={{ display: 'none', flex: 1, flexDirection: 'column', justifyContent: 'center', padding: '60px 40px 60px 0', boxSizing: 'border-box' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '64px', lineHeight: '0.95', letterSpacing: '-0.03em', color: '#0A0A0A', margin: 0 }}>Welcome<br /><span style={{ color: '#5A7A6A' }}>Back.</span></h1>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '18px', lineHeight: '1.6', color: '#5C5C5C', maxWidth: '420px', marginTop: '20px' }}>Log in to continue your story. Connect with your customers, manage your space, and let your city discover you.</p>
          <div style={{ width: '190px', height: '1px', marginTop: '24px', background: 'linear-gradient(90deg, transparent 0%, #E8DCC3 20%, #5A7A6A 50%, #E8DCC3 80%, transparent 100%)' }} />
        </div>

        <form onSubmit={handleLogin} className="desktop-form" style={{ width: '100%', maxWidth: '440px', minHeight: 'calc(100dvh - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px 40px 20px', boxSizing: 'border-box' }}>
          <div style={{ height: 'clamp(36px, 6vh, 52px)' } as any} />
          <h2 style={{ fontFamily: 'Georgia, Times New Roman, serif', fontSize: 'clamp(46px, 11vw, 62px)', fontWeight: '500', lineHeight: '0.88', letterSpacing: '-0.03em', color: '#0A0A0A', margin: '0', textAlign: 'center' }}>Welcome<br />Back</h2>
          <div style={{ height: '18px' }} />
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(15px, 4vw, 16px)', lineHeight: '1.6', color: '#5C5C5C', maxWidth: '320px', margin: '0 auto', textAlign: 'center' }}>Log in to continue your story. Connect with your customers, manage your space, and let your city discover you.</p>
          <div style={{ height: 'clamp(40px, 6vh, 56px)' } as any} />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', height: '62px', borderRadius: '14px', border: `1px solid ${f1 ? '#5A7A6A' : '#E5E5E5'}`, backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', padding: '0 20px', transition: 'all 0.2s ease', boxShadow: f1 ? '0 8px 24px rgba(90,122,106,0.12)' : '0 2px 8px rgba(0,0,0,0.04)', transform: f1 ? 'scale(1.01)' : 'scale(1)', boxSizing: 'border-box' }}>
              <input value={loginId} onChange={(e) => setLoginId(e.target.value)} onFocus={() => setF1(true)} onBlur={() => setF1(false)} placeholder="Email or Phone" style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '17px', fontFamily: 'Inter, sans-serif', color: '#111' }} />
            </div>
            <div style={{ width: '100%', height: '62px', borderRadius: '14px', border: `1px solid ${f2 ? '#5A7A6A' : '#E5E5E5'}`, backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', padding: '0 12px 0 20px', transition: 'all 0.2s ease', boxShadow: f2 ? '0 8px 24px rgba(90,122,106,0.12)' : '0 2px 8px rgba(0,0,0,0.04)', transform: f2 ? 'scale(1.01)' : 'scale(1)', boxSizing: 'border-box' }}>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setF2(true)} onBlur={() => setF2(false)} placeholder="Password" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', fontSize: '17px', fontFamily: 'Inter, sans-serif', color: '#111' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '8px', flexShrink: 0 }}>
                {showPassword ? <EyeOff size={20} color="#9A9A9A" strokeWidth={1.6} /> : <Eye size={20} color="#9A9A9A" strokeWidth={1.6} />}
              </button>
            </div>
          </div>
          {error && <p style={{ color: '#D64545', fontSize: '14px', marginTop: '14px', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 600, width: '100%' }}>{error}</p>}
          <div style={{ height: '14px' }} />
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.push('/forgot-password')} style={{ background: 'none', border: 'none', fontSize: '15px', fontFamily: 'Inter, sans-serif', color: '#5A7A6A', fontWeight: '600', cursor: 'pointer' }}>Forgot Password?</button>
          </div>
          <div style={{ height: '32px' }} />
          <button type="submit" onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)} onMouseLeave={() => setPress(false)} onTouchStart={() => setPress(true)} onTouchEnd={() => setPress(false)} disabled={loading} style={{ width: '100%', height: '60px', borderRadius: '14px', border: 'none', backgroundColor: press ? '#4A6554' : '#5A7A6A', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: '600', cursor: 'pointer', transform: press ? 'scale(0.97)' : 'scale(1)', transition: 'all 0.18s ease-out', boxShadow: '0 10px 30px rgba(90,122,106,0.30), 0 2px 8px rgba(0,0,0,0.07)', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div style={{ height: '24px' }} />
          <p style={{ fontSize: '15px', fontFamily: 'Inter, sans-serif', color: '#5C5C5C', textAlign: 'center' }}>Don&apos;t have an account? <span onClick={() => router.push('/signup')} style={{ fontWeight: '700', color: '#5A7A6A', textDecoration: 'underline', cursor: 'pointer' }}>Sign Up</span></p>
        </form>
      </div>
    </div>
  );
}