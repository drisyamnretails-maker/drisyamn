"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type AllType = 'personal' | 'retail' | 'cafe' | 'hotel' | 'architect' | 'service' | 'media' | 'vlogger';

const ALL_TYPES: { id: AllType; title: string; subtitle: string }[] = [
  { id: 'personal', title: 'Personal', subtitle: 'you, profile' },
  { id: 'retail', title: 'Retail', subtitle: 'store, shops' },
  { id: 'cafe', title: 'Cafe', subtitle: 'restaurant, foods' },
  { id: 'hotel', title: 'Hotel', subtitle: 'rooms, stays' },
  { id: 'architect', title: 'Architect', subtitle: 'interior, exterior' },
  { id: 'service', title: 'Service', subtitle: 'teacher, doctor' },
  { id: 'media', title: 'Media', subtitle: 'news, media' },
  { id: 'vlogger', title: 'Vlogger', subtitle: 'vlogs, videos' },
];

// ✅ TYPE -> ROLE MAP - Jo select kiya, usi hisaab se role banega
const TYPE_TO_ROLE: Record<AllType, 'personal' | 'business' | 'creator'> = {
  personal: 'personal',
  retail: 'business',
  cafe: 'business',
  hotel: 'business',
  architect: 'business',
  service: 'business',
  media: 'creator',
  vlogger: 'creator',
};

// ✅ TYPE -> ROUTE MAP - Personal alag, baaki sab /profile
const TYPE_TO_ROUTE: Record<AllType, string> = {
  personal: '/personalprofile',
  retail: '/profile',
  cafe: '/profile',
  hotel: '/profile',
  architect: '/profile',
  service: '/profile',
  media: '/profile',
  vlogger: '/profile',
};

export default function CreateProfilePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<AllType>('personal');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [press, setPress] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [f1, setF1] = useState(false);
  const [f2, setF2] = useState(false);

  const isPersonal = selectedType === 'personal';

  // ✅ FIX - Purana data offerings_type se load hoga, taaki wahi type selected dikhe
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (data) {
        if (data.offerings_type) {
          setSelectedType(data.offerings_type as AllType);
        } else if (data.profile_role === 'personal') {
          setSelectedType('personal');
        }
        setName(data.business_name || data.name || data.full_name || '');
        setContact(data.contact || data.phone || '');
      }
    };
    load();
  }, []);

  // ✅ FIX - ROUTE + SUPABASE - Jo select kiya, wahi save hoga + wahi route khulega
  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!contact.trim()) {
      setError('Please enter contact number');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const role = TYPE_TO_ROLE[selectedType];

      const payload: any = {
        id: user.id,
        profile_role: role,
        offerings_type: selectedType,
        name: name.trim(),
        full_name: name.trim(),
        contact: contact.trim(),
        phone: contact.trim(),
        updated_at: new Date().toISOString(),
      };

      if (isPersonal) {
        payload.business_name = null;
      } else {
        payload.business_name = name.trim();
      }

      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
      if (error) throw error;

      localStorage.setItem('Tasomi_has_account', 'true');
      localStorage.setItem('Tasomi_profile_type', selectedType);

      // ✅ YAHI MAIN LOGIC HAI - Personal -> /personalprofile, Baaki -> /profile
      router.push(TYPE_TO_ROUTE[selectedType]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Header ka Profile button bhi type ke hisaab se jaye
  const goToMyProfile = () => {
    router.push(TYPE_TO_ROUTE[selectedType]);
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
      maxWidth: '100vw',
      overflowX: 'hidden',
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
        .type-slider::-webkit-scrollbar { display: none; }
        .type-slider { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ===== HEADER - Signup jaisa ===== */}
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
            <button onClick={goToMyProfile} style={{ backgroundColor: '#5A7A6A', color: '#FFFFFF', border: 'none', borderRadius: '999px', padding: '9px 20px', fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              Profile
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
            <button onClick={() => { setMenuOpen(false); goToMyProfile(); }} style={{ marginTop: '10px', backgroundColor: '#5A7A6A', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Profile
            </button>
          </div>
        )}
      </header>

      {/* ===== DESKTOP WRAP - Signup jaisa ===== */}
      <div className="desktop-wrap" style={{
        width: '100%',
        maxWidth: '440px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}>

        {/* LEFT - Sirf Desktop */}
        <div className="desktop-left" style={{
          display: 'none',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 40px 60px 0',
          boxSizing: 'border-box',
        }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '64px', lineHeight: '0.95', letterSpacing: '-0.03em', color: '#0A0A0A', margin: 0 }}>
            Apna Business,<br />
            <span style={{ color: '#5A7A6A' }}>Apni Pehchan.</span>
          </h1>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '18px', lineHeight: '1.6', color: '#5C5C5C', maxWidth: '420px', marginTop: '20px' }}>
            Join your local community. Let your city discover you.
          </p>
          <div style={{ width: '190px', height: '1px', marginTop: '24px', background: 'linear-gradient(90deg, transparent 0%, #E8DCC3 20%, #5A7A6A 50%, #E8DCC3 80%, transparent 100%)' }} />
        </div>

        {/* ===== FORM ===== */}
        <form onSubmit={handleCreate} className="desktop-form" style={{
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 20px 40px 20px',
          boxSizing: 'border-box',
        }}>
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
            Create<br />Profile
          </h2>

          <div style={{ height: '16px' }} />
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '15px', lineHeight: '1.6', color: '#5C5C5C', maxWidth: '320px', margin: '0 auto', textAlign: 'center' }}>
            One profile, works everywhere.
          </p>

          <div style={{ height: '32px' }} />

          {/* ===== 1. SELECT YOUR ACCOUNT TYPE ===== */}
          <p style={{ width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 600, color: '#111', margin: '0 0 12px 0', textAlign: 'left' }}>
            Select your account type
          </p>

          <div className="type-slider" style={{
            width: '100%',
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            padding: '4px 2px 12px 2px',
            boxSizing: 'border-box',
          }}>
            {ALL_TYPES.map((t) => {
              const active = selectedType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id)}
                  style={{
                    minWidth: '112px',
                    width: '112px',
                    flexShrink: 0,
                    scrollSnapAlign: 'start',
                    padding: '14px 10px 12px 10px',
                    borderRadius: '12px',
                    border: `1px solid ${active ? '#5A7A6A' : '#E5E5E5'}`,
                    background: active ? '#EFF5F0' : '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                    boxShadow: active ? '0 6px 16px rgba(90,122,106,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                    position: 'relative',
                    boxSizing: 'border-box',
                  }}
                >
                  {active && (
                    <span style={{ position: 'absolute', top: '7px', right: '7px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#5A7A6A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>✓</span>
                  )}
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: active ? '#5A7A6A' : '#111' }}>{t.title}</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: active ? '#4A6554' : '#8A8A8A', textAlign: 'center', lineHeight: '1.2' }}>{t.subtitle}</span>
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: '11px', fontFamily: 'Inter, sans-serif', color: '#9A9A9A', textAlign: 'center', margin: '0 0 24px 0' }}>← Swipe karke apna type chuno →</p>

          {/* ===== 2. NAME ===== */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={inputStyle(f1)}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setF1(true)}
                onBlur={() => setF1(false)}
                placeholder={isPersonal ? 'Your Name' : 'Business / Establishment Name'}
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '17px', fontFamily: 'Inter, sans-serif', color: '#111' }}
              />
            </div>

            {/* ===== 3. CONTACTS ===== */}
            <div style={inputStyle(f2)}>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                onFocus={() => setF2(true)}
                onBlur={() => setF2(false)}
                placeholder="Contact - Phone / WhatsApp"
                inputMode="tel"
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '17px', fontFamily: 'Inter, sans-serif', color: '#111' }}
              />
            </div>
          </div>

          {error && <p style={{ color: '#D64545', fontSize: '14px', marginTop: '14px', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 600, width: '100%' }}>{error}</p>}

          <div style={{ height: '20px' }} />

          {/* ===== 4. CREATE ACCOUNT BUTTON ===== */}
          <button
            type="submit"
            onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)} onMouseLeave={() => setPress(false)}
            onTouchStart={() => setPress(true)} onTouchEnd={() => setPress(false)}
            disabled={loading}
            style={{
              width: '100%', height: '60px', borderRadius: '14px',
              border: 'none',
              backgroundColor: press ? '#4A6554' : '#5A7A6A',
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px', fontWeight: '600',
              cursor: 'pointer',
              transform: press ? 'scale(0.97)' : 'scale(1)',
              transition: 'all 0.18s ease-out',
              boxShadow: '0 10px 30px rgba(90,122,106,0.30), 0 2px 8px rgba(0,0,0,0.07)',
              opacity: loading ? 0.7 : 1
            }}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>

        </form>
      </div>
    </div>
  );
}