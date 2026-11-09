"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [f1, setF1] = useState(false);
  const [f2, setF2] = useState(false);
  const [f3, setF3] = useState(false);
  const [f4, setF4] = useState(false);
  const [press, setPress] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSignup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    if (!fullName.trim() || !loginId.trim() || !password) {
      setError('Please fill all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password kam se kam 6 character ka hona chahiye');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (!agreed) {
      setError('Please accept Terms & Conditions to continue');
      return;
    }
    setLoading(true);
    try {
      let email = loginId.trim().toLowerCase();
      let phone: string | null = null;
      if (!email.includes('@')) {
        let p = email.replace(/\s/g, '');
        if (!p.startsWith('+')) p = p.startsWith('91') ? `+${p}` : `+91${p}`;
        phone = p;
        email = `${p.replace(/\+/g, '')}@tasomi.com`;
      }
      const { data, error: signError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: fullName, full_name: fullName, phone: phone || loginId } }
      });
      if (signError) throw signError;
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          name: fullName,
          username: email.split('@')[0],
          email: email,
          phone: phone,
        }, { onConflict: 'id' });
      }
      localStorage.setItem('Tasomi_has_account', 'true');
      router.push('/profile/create');
    } catch (err: any) {
      if (err.message?.includes('rate limit')) {
        setError('Bahut baar try kar liya. 1 ghanta wait karo ya naya number try karo.');
      } else if (err.message?.includes('already registered') || err.message?.includes('already exists')) {
        setError('Ye Email / Phone pehle se registered hai. Login karo.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (focused: boolean) => ({
    width: '100%',
    height: '60px',
    borderRadius: '14px',
    border: `1px solid ${focused ? '#5A7A6A' : '#E5E5E5'}`,
    backgroundColor: '#FFFFFF',
    display: 'flex' as const,
    alignItems: 'center' as const,
    padding: '0 20px',
    transition: 'all 0.2s ease',
    boxShadow: focused ? '0 8px 24px rgba(90,122,106,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
    transform: focused ? 'scale(1.01)' : 'scale(1)',
    boxSizing: 'border-box' as const
  });

  const inputPassStyle = (focused: boolean) => ({
    width: '100%',
    height: '60px',
    borderRadius: '14px',
    border: `1px solid ${focused ? '#5A7A6A' : '#E5E5E5'}`,
    backgroundColor: '#FFFFFF',
    display: 'flex' as const,
    alignItems: 'center' as const,
    padding: '0 12px 0 20px',
    transition: 'all 0.2s ease',
    boxShadow: focused ? '0 8px 24px rgba(90,122,106,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
    transform: focused ? 'scale(1.01)' : 'scale(1)',
    boxSizing: 'border-box' as const
  });

  const navLinks = [
    { label: 'Explore', path: '/homefeed' },
    { label: 'Community', path: '/homefeed' },
    { label: 'Businesses', path: '/homefeed' },
    { label: 'About', path: '/' },
  ];

  return (
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      maxWidth: '100vw', // ✅ FIX 1 - Mobile pe katna band
      overflowX: 'hidden', // ✅ FIX 2 - Side scroll band
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
    }}>
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

      {/* ===== HEADER ===== */}
      <header style={{
        width: '100%',
        maxWidth: '100vw',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #F2ECE3',
        boxSizing: 'border-box',
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
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em', color: '#5A7A6A', padding: 0 }}>
            Tasomi
          </button>
          <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {navLinks.map((link) => (
              <button key={link.label} onClick={() => router.push(link.path)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '500', color: '#333333' }}>
                {link.label}
              </button>
            ))}
            <button onClick={() => router.push('/login')} style={{ backgroundColor: '#5A7A6A', color: '#FFFFFF', border: 'none', borderRadius: '999px', padding: '9px 20px', fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              Login
            </button>
          </nav>
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#111', padding: '4px 8px' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        {menuOpen && (
          <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto', padding: '8px 20px 18px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: '#fff', borderTop: '1px solid #F2ECE3' }}>
            {navLinks.map((link) => (
              <button key={link.label} onClick={() => { setMenuOpen(false); router.push(link.path); }} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px 8px', fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: '500', color: '#222', cursor: 'pointer', borderBottom: '1px solid #F2ECE3' }}>
                {link.label}
              </button>
            ))}
            <button onClick={() => { setMenuOpen(false); router.push('/login'); }} style={{ marginTop: '10px', backgroundColor: '#5A7A6A', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Login
            </button>
          </div>
        )}
      </header>

      {/* ===== DESKTOP WRAP ===== */}
      <div className="desktop-wrap" style={{
        width: '100%',
        maxWidth: '440px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}>

        <div className="desktop-left" style={{ display: 'none', flex: 1, flexDirection: 'column', justifyContent: 'center', padding: '60px 40px 60px 0', boxSizing: 'border-box' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '64px', lineHeight: '0.95', letterSpacing: '-0.03em', color: '#0A0A0A', margin: 0 }}>
            Apna Business,<br />
            <span style={{ color: '#5A7A6A' }}>Apni Pehchan.</span>
          </h1>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '18px', lineHeight: '1.6', color: '#5C5C5C', maxWidth: '420px', marginTop: '20px' }}>
            Join your local community. Let your city discover you.
          </p>
          <div style={{ width: '190px', height: '1px', marginTop: '24px', background: 'linear-gradient(90deg, transparent 0%, #E8DCC3 20%, #5A7A6A 50%, #E8DCC3 80%, transparent 100%)' }} />
        </div>

        {/* ===== SIGNUP FORM ===== */}
        <form onSubmit={handleSignup} className="desktop-form" style={{
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 20px 40px 20px',
          boxSizing: 'border-box',
        }}>
          <div style={{ height: '36px' }} />
          <h2 style={{ fontFamily: 'Georgia, Times New Roman, serif', fontSize: 'clamp(42px, 10vw, 58px)', fontWeight: '500', lineHeight: '0.88', letterSpacing: '-0.03em', color: '#0A0A0A', margin: '0', textAlign: 'center' }}>
            Create<br />Account
          </h2>
          <div style={{ height: '16px' }} />
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '15px', lineHeight: '1.6', color: '#5C5C5C', maxWidth: '320px', margin: '0 auto', textAlign: 'center' }}>
            Join your local community. Let your city discover you.
          </p>
          <div style={{ height: '40px' }} />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}>
            <div style={inputStyle(f1)}>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} onFocus={() => setF1(true)} onBlur={() => setF1(false)} placeholder="Full Name" style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '17px', fontFamily: 'Inter, sans-serif', color: '#111' }} />
            </div>
            <div style={inputStyle(f2)}>
              <input value={loginId} onChange={(e) => setLoginId(e.target.value)} onFocus={() => setF2(true)} onBlur={() => setF2(false)} placeholder="Email or Phone" style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '17px', fontFamily: 'Inter, sans-serif', color: '#111' }} />
            </div>
            <div style={inputPassStyle(f3)}>
              <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setF3(true)} onBlur={() => setF3(false)} placeholder="Password" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', fontSize: '17px', fontFamily: 'Inter, sans-serif', color: '#111' }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '6px', flexShrink: 0 }}>
                {showPass ? <EyeOff size={20} color="#9A9A9A" strokeWidth={1.6} /> : <Eye size={20} color="#9A9A9A" strokeWidth={1.6} />}
              </button>
            </div>
            <div style={inputPassStyle(f4)}>
              <input type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} onFocus={() => setF4(true)} onBlur={() => setF4(false)} placeholder="Confirm Password" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', fontSize: '17px', fontFamily: 'Inter, sans-serif', color: '#111' }} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '6px', flexShrink: 0 }}>
                {showConfirm ? <EyeOff size={20} color="#9A9A9A" strokeWidth={1.6} /> : <Eye size={20} color="#9A9A9A" strokeWidth={1.6} />}
              </button>
            </div>
          </div>

          {error && <p style={{ color: '#D64545', fontSize: '14px', marginTop: '14px', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 600, width: '100%' }}>{error}</p>}

          <label style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: '24px', cursor: 'pointer', userSelect: 'none', boxSizing: 'border-box' }}>
            <span onClick={() => setAgreed(!agreed)} style={{ minWidth: '24px', width: '24px', height: '24px', borderRadius: '7px', border: `2px solid ${agreed ? '#5A7A6A' : '#D1D1D1'}`, backgroundColor: agreed ? '#5A7A6A' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 800, marginTop: '1px', transition: 'all 0.15s ease', flexShrink: 0 }}>
              {agreed ? '✓' : ''}
            </span>
            <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#5C5C5C', fontFamily: 'Inter, sans-serif', flex: 1, minWidth: 0 }}>
              I agree to Tasomi&apos;s{' '}
              <span onClick={(e) => { e.stopPropagation(); router.push('/terms'); }} style={{ color: '#5A7A6A', fontWeight: 700, textDecoration: 'underline' }}>Terms & Conditions</span>
              {' '}and{' '}
              <span onClick={(e) => { e.stopPropagation(); router.push('/privacy'); }} style={{ color: '#5A7A6A', fontWeight: 700, textDecoration: 'underline' }}>Privacy Policy</span>
            </span>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ display: 'none' }} />
          </label>

          <div style={{ height: '20px' }} />
          <button type="submit" onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)} onMouseLeave={() => setPress(false)} onTouchStart={() => setPress(true)} onTouchEnd={() => setPress(false)} disabled={loading} style={{ width: '100%', height: '60px', borderRadius: '14px', border: 'none', backgroundColor: press ? '#4A6554' : '#5A7A6A', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: '600', cursor: 'pointer', transform: press ? 'scale(0.97)' : 'scale(1)', transition: 'all 0.18s ease-out', boxShadow: '0 10px 30px rgba(90,122,106,0.30), 0 2px 8px rgba(0,0,0,0.07)', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
          <div style={{ height: '24px' }} />
          <p style={{ fontSize: '15px', fontFamily: 'Inter, sans-serif', color: '#5C5C5C', textAlign: 'center' }}>
            Already have an account? <span onClick={() => router.push('/login')} style={{ fontWeight: '700', color: '#5A7A6A', textDecoration: 'underline', cursor: 'pointer' }}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}