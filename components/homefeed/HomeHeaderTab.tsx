"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Message', path: '/message', icon: '💬' },
  { label: 'Notifications', path: '/notifications', icon: '🔔' },
  { label: 'Bookings', path: '/bookings', icon: '📅' },
  { label: 'Profile', path: '/profile', icon: '' },
];

type Props = {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
};

export default function HomeHeaderTab({ activeTab, onTabChange }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [avatar, setAvatar] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single();
      if (data?.avatar_url) setAvatar(data.avatar_url);
    })();
  }, []);

  const goTo = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <div style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', background: '#FFFFFF', display: 'block', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #F2ECE3', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '100%', padding: '0 32px', boxSizing: 'border-box' }}>
        <style>{`
          .hh-top { display: flex; justify-content: space-between; align-items: center; padding: 14px 0 12px; }
          .hh-logo { font-family: Inter, sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: #5A7A6A; cursor: pointer; line-height: 1; }
          .hh-desktop-nav { display: flex; align-items: center; gap: 28px; }
          .hh-nav-link { background: none; border: none; cursor: pointer; font-family: Inter, sans-serif; font-size: 14px; font-weight: 500; color: #333; display: flex; align-items: center; gap: 7px; padding: 6px 2px; transition: all 0.15s ease; white-space: nowrap; }
          .hh-nav-link:hover { color: #5A7A6A; }
          .hh-nav-link.active { color: #5A7A6A; font-weight: 700; }
          .hh-profile-mini { width: 32px; height: 32px; border-radius: 50%; background: #EFF5F0; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; border: 1px solid #E5E5E5; }
          .hh-profile-mini img { width: 100%; height: 100%; object-fit: cover; }
          .hh-hamburger { display: none; background: none; border: none; font-size: 26px; cursor: pointer; color: #111; padding: 4px 8px; line-height: 1; }
          .hh-mobile-menu { display: none; flex-direction: column; gap: 2px; padding: 8px 0 12px 0; border-top: 1px solid #F2ECE3; }
          .hh-mobile-link { background: none; border: none; text-align: left; padding: 12px 4px; font-family: Inter, sans-serif; font-size: 15px; font-weight: 500; color: #222; cursor: pointer; border-bottom: 1px solid #F5F5F5; display: flex; align-items: center; gap: 10px; }
          @media (min-width: 900px) {
            .hh-desktop-nav { display: flex !important; }
            .hh-hamburger { display: none !important; }
            .hh-mobile-menu { display: none !important; }
            .hh-top { padding: 16px 12px 16px 12px; justify-content: space-between; }
            .hh-logo { font-size: 30px; }
          }
          @media (max-width: 899px) {
            .hh-desktop-nav { display: none !important; }
            .hh-hamburger { display: flex !important; }
            .hh-mobile-menu.open { display: flex !important; }
            .hh-top { padding: 10px 0 10px; justify-content: space-between; }
          }
        `}</style>

        {/* ===== TOP ROW - Sirf Ye Rahega ===== */}
        <div className="hh-top">
          <div className="hh-logo" onClick={() => router.push('/homefeed')}>Tasomi</div>

          <nav className="hh-desktop-nav">
            {NAV_LINKS.map((link) => {
              const isActive = pathname?.startsWith(link.path);
              return (
                <button
                  key={link.label}
                  onClick={() => goTo(link.path)}
                  className={`hh-nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.icon && <span style={{ fontSize: '17px' }}>{link.icon}</span>}
                  {link.label}
                  {link.label === 'Profile' && (
                    <span className="hh-profile-mini">
                      {avatar ? <img src={avatar} alt="" /> : '👤'}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <button className="hh-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* ✅ MOBILE MENU */}
        <div className={`hh-mobile-menu ${menuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <button key={link.label} onClick={() => goTo(link.path)} className="hh-mobile-link">
              {link.icon && <span style={{ fontSize: '18px' }}>{link.icon}</span>}
              {link.label}
              {link.label === 'Profile' && (
                <span className="hh-profile-mini" style={{ marginLeft: 'auto' }}>
                  {avatar ? <img src={avatar} alt="" /> : '👤'}
                </span>
              )}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}