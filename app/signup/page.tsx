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

  const handleSignup = async () => {
    setError('');
    if (!fullName || !loginId || !password) {
      setError('Please fill all fields');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      let email = loginId.trim();
      let phone: string | null = null;

      if (!email.includes('@')) {
        let p = email.replace(/\s/g, '');
        if (!p.startsWith('+')) p = p.startsWith('91') ? `+${p}` : `+91${p}`;
        phone = p;
        email = `${p.replace(/\+/g, '')}@drisyamn.com`;
      }

      const { data, error: signError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: { full_name: fullName, phone: phone || loginId }
        }
      });
      if (signError) throw signError;

      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          email: email.toLowerCase(),
          phone: phone,
          created_at: new Date().toISOString()
        });
      }

      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (focused: boolean) => ({
    width: '100%',
    height: '60px',
    borderRadius: '14px',
    border: `1px solid ${focused ? '#C8A86A' : '#D9C9A8'}`,
    backgroundColor: focused ? '#FFFFFF' : '#F3EBD9',
    display: 'flex' as const,
    alignItems: 'center' as const,
    padding: '0 20px',
    transition: 'all 0.2s ease',
    boxShadow: focused ? '0 8px 24px rgba(200,168,106,0.18)' : '0 2px 8px rgba(0,0,0,0.04)',
    transform: focused ? 'scale(1.01)' : 'scale(1)',
    boxSizing: 'border-box' as const
  });

  const inputPassStyle = (focused: boolean) => ({
    width: '100%',
    height: '60px',
    borderRadius: '14px',
    border: `1px solid ${focused ? '#C8A86A' : '#D9C9A8'}`,
    backgroundColor: focused ? '#FFFFFF' : '#F3EBD9',
    display: 'flex' as const,
    alignItems: 'center' as const,
    padding: '0 12px 0 20px',
    transition: 'all 0.2s ease',
    boxShadow: focused ? '0 8px 24px rgba(200,168,106,0.18)' : '0 2px 8px rgba(0,0,0,0.04)',
    transform: focused ? 'scale(1.01)' : 'scale(1)',
    boxSizing: 'border-box' as const
  });

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

        <div style={{ height: '36px' }} />

        <h2 style={{
          fontFamily: 'Georgia, Times New Roman, serif',
          fontSize: 'clamp(42px, 10vw, 58px)',
          fontWeight: '500',
          lineHeight: '0.88',
          letterSpacing: '-0.03em',
          color: '#0A0A0A',
          margin: '0',
          textAlign: 'center',
        }}>
          Create<br />Account
        </h2>

        <div style={{ height: '16px' }} />
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '15px', lineHeight: '1.6', color: '#5C4A32', maxWidth: '320px', margin: '0 auto', textAlign: 'center' }}>
          Join your local community. Let your city discover you.
        </p>

        <div style={{ height: '40px' }} />

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={inputStyle(f1)}>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} onFocus={() => setF1(true)} onBlur={() => setF1(false)} placeholder="Full Name" style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '17px', fontFamily: 'Georgia, serif', color: '#2D2415' }} />
          </div>

          <div style={inputStyle(f2)}>
            <input value={loginId} onChange={(e) => setLoginId(e.target.value)} onFocus={() => setF2(true)} onBlur={() => setF2(false)} placeholder="Email or Phone" style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '17px', fontFamily: 'Georgia, serif', color: '#2D2415' }} />
          </div>

          <div style={inputPassStyle(f3)}>
            <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setF3(true)} onBlur={() => setF3(false)} placeholder="Password" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '17px', fontFamily: 'Georgia, serif', color: '#2D2415' }} />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '6px' }}>
              {showPass ? <EyeOff size={20} color="#8A7D6B" strokeWidth={1.6} /> : <Eye size={20} color="#8A7D6B" strokeWidth={1.6} />}
            </button>
          </div>

          <div style={inputPassStyle(f4)}>
            <input type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} onFocus={() => setF4(true)} onBlur={() => setF4(false)} placeholder="Confirm Password" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '17px', fontFamily: 'Georgia, serif', color: '#2D2415' }} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '6px' }}>
              {showConfirm ? <EyeOff size={20} color="#8A7D6B" strokeWidth={1.6} /> : <Eye size={20} color="#8A7D6B" strokeWidth={1.6} />}
            </button>
          </div>
        </div>

        {error && <p style={{ color: '#8C3A2A', fontSize: '14px', marginTop: '14px', textAlign: 'center', fontFamily: 'Georgia, serif' }}>{error}</p>}

        <div style={{ height: '32px' }} />

        <button
          onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)} onMouseLeave={() => setPress(false)}
          onTouchStart={() => setPress(true)} onTouchEnd={() => setPress(false)}
          onClick={handleSignup} disabled={loading}
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
          {loading ? 'Creating...' : 'Create Account'}
        </button>

        <div style={{ height: '24px' }} />
        <p style={{ fontSize: '15px', fontFamily: 'Georgia, serif', color: '#5C4A32' }}>
          Already have an account? <span onClick={() => router.push('/login')} style={{ fontWeight: '700', color: '#2D2415', textDecoration: 'underline', cursor: 'pointer' }}>Login</span>
        </p>

      </div>
    </div>
  );
}