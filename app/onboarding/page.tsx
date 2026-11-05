"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, Building2, Sparkles, Check } from 'lucide-react';

type AccountType = 'personal' | 'business' | 'creator';

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<AccountType>('creator');
  const [press, setPress] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setPress(true);
    // Feeling - vibration
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ account_type: selected }).eq('id', user.id);
      }
      localStorage.setItem('drisyamn_has_account', 'true');
      localStorage.setItem('drisyamn_account_type', selected);
      router.push('/profile/create');
    } catch {
      router.push('/profile/create');
    } finally {
      setTimeout(() => {
        setPress(false);
        setLoading(false);
      }, 300);
    }
  };

  const options = [
    { id: 'personal' as const, title: 'Personal Account', desc: 'Discover stories around you', Icon: User },
    { id: 'business' as const, title: 'Business Account', desc: 'Cafes, Hotels, Shops, Doctors', Icon: Building2 },
    { id: 'creator' as const, title: 'Creator Account', desc: 'Share your local expertise', Icon: Sparkles },
  ];

  return (
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      backgroundColor: '#F6F1E8',
      backgroundImage: `radial-gradient(ellipse at top, rgba(200,168,106,0.08) 0%, transparent 60%), radial-gradient(ellipse at bottom, rgba(200,168,106,0.12) 0%, transparent 60%)`,
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 28px 32px 28px',
        boxSizing: 'border-box',
        alignItems: 'center'
      }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '52px' }}>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '38px',
            fontWeight: '400',
            background: 'linear-gradient(90deg, #2D2415 0%, #5A4A32 40%, #8C6F3A 75%, #B89B5E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0',
          }}>
            Drisyamn
          </h1>
        </div>

        <div style={{ height: '42px' }} />

        {/* CENTER ME */}
        <div style={{ width: '100%', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'Georgia, Times New Roman, serif',
            fontSize: 'clamp(30px, 7.5vw, 36px)',
            fontWeight: '500',
            lineHeight: '1.1',
            letterSpacing: '-0.03em',
            color: '#0A0A0A',
            margin: '0',
            textAlign: 'center',
          }}>
            How will you use<br />Drisyamn?
          </h2>
          <div style={{ height: '14px' }} />
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '15.5px',
            lineHeight: '1.55',
            color: '#6B5D4B',
            margin: '0 auto',
            textAlign: 'center',
            maxWidth: '310px'
          }}>
            Choose your path. Whether you discover, sell, or create — Drisyamn adapts to you.
          </p>
        </div>

        <div style={{ height: '32px' }} />

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {options.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
                  setSelected(opt.id);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '20px 18px',
                  borderRadius: '16px',
                  border: `1px solid ${isSelected ? '#C8A86A' : '#D9C9A8'}`,
                  backgroundColor: isSelected ? '#FFFFFF' : '#F3EBD9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.22s ease',
                  boxShadow: isSelected ? '0 8px 24px rgba(200,168,106,0.18)' : '0 2px 8px rgba(0,0,0,0.04)',
                  transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                  position: 'relative',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: `1px solid ${isSelected ? '#C8A86A' : '#D9C9A8'}`,
                  backgroundColor: isSelected ? '#F6F1E8' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <opt.Icon size={20} color={isSelected ? '#2D2415' : '#8A7D6B'} strokeWidth={1.7} />
                </div>
                <div style={{ flex: 1, paddingRight: '28px' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '17.5px', fontWeight: '600', color: '#121212', margin: '0 0 2px 0' }}>{opt.title}</p>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '13.5px', color: '#7A6E5D', margin: '0' }}>{opt.desc}</p>
                </div>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  border: `1.5px solid ${isSelected ? '#C8A86A' : '#CFC2A8'}`,
                  backgroundColor: isSelected ? '#C8A86A' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}>
                  {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, minHeight: '24px' }} />

        {/* CONTINUE WITH FEELINGS */}
        <button
          onMouseDown={() => setPress(true)}
          onMouseUp={() => setPress(false)}
          onMouseLeave={() => setPress(false)}
          onTouchStart={() => setPress(true)}
          onTouchEnd={() => setPress(false)}
          onClick={handleContinue}
          disabled={loading}
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
            // Feeling animation
            transform: press ? 'scale(0.96)' : loading ? 'scale(0.98)' : 'scale(1)',
            transition: 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: press 
              ? 'inset 0 2px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(200,168,106,0.15)' 
              : '0 10px 30px rgba(200,168,106,0.25), 0 4px 12px rgba(0,0,0,0.08)',
            opacity: loading ? 0.8 : 1,
            letterSpacing: press ? '0.03em' : '0em'
          }}
        >
          {loading ? '✨ Creating your space...' : press ? '🤎 Let\'s go...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}