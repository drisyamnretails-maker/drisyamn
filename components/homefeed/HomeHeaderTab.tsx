"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

type TabType = 'retail' | 'hotel' | 'cafe' | 'architech' | 'architect' | 'service' | 'media' | 'vlogger';

const TABS = [
  { id: 'retail' as TabType, label: 'Retail', route: '/homefeed/retail' },
  { id: 'hotel' as TabType, label: 'Hotel', route: '/homefeed/hotel' },
  { id: 'cafe' as TabType, label: 'Cafe', route: '/homefeed/cafe' },
  { id: 'architech' as TabType, label: 'Architech / Interiors', route: '/homefeed/architech' },
  { id: 'service' as TabType, label: 'Services', route: '/homefeed/service' },
  { id: 'media' as TabType, label: 'Media', route: '/homefeed/media' },
  { id: 'vlogger' as TabType, label: 'Vlogger', route: '/homefeed/vlogger' },
];

type Props = {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
};

export default function HomeHeaderTab({ activeTab: propActiveTab, onTabChange }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [avatar, setAvatar] = useState("");
  const [clickingId, setClickingId] = useState<string | null>(null);
  
  const activeTab = propActiveTab || (pathname.split('/').pop() as TabType) || 'retail';

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single();
      if (data?.avatar_url) setAvatar(data.avatar_url);
    })();
  }, []);

  const handleTabClick = (tab: typeof TABS[0]) => {
    // 1. Click animation start
    setClickingId(tab.id);
    
    // 2. Thoda slow smooth feel - 180ms baad route
    setTimeout(() => {
      if (onTabChange) {
        onTabChange(tab.id);
      }
      router.push(tab.route);
      setClickingId(null);
    }, 180);
  };

  return (
    <div style={{ width: '100%', background: '#F6F1E8', display: 'flex', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ width: '100%', maxWidth: '720px', padding: '0 16px' }}>
        <style>{`
          .hh-top { display: flex; justify-content: space-between; align-items: center; padding: 14px 4px 12px; }
          .hh-logo { font-family: Georgia, serif; font-size: 32px; font-weight:700; color: #2D2415; cursor: pointer; }
          .hh-right { display: flex; align-items: center; gap: 12px; }
          .hh-icon { width: 36px; height: 36px; border-radius: 50%; background: #FFFEFB; border: 1px solid #E8DCC3; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s ease; }
          .hh-icon:active { transform: scale(0.88); background: #E8DCC3; }
          .hh-icon svg { width: 18px; height: 18px; stroke: #2D2415; }
          .hh-profile { width: 36px; height: 36px; border-radius: 50%; background: #fff; overflow: hidden; cursor:pointer; border: 1px solid #E8DCC3; }
          .hh-profile img { width:100%; height:100%; object-fit:cover; }
          .hh-tabs { display: flex; gap: 10px; overflow-x: auto; padding: 4px 2px 14px; scrollbar-width:none; }
          .hh-tabs::-webkit-scrollbar{ display:none; }
          .hh-tab { height: 36px; padding: 0 16px; border-radius: 12px; background: #FFFEFB; font-size: 13px; font-weight: 500; color: #6B5A3F; white-space: nowrap; cursor: pointer; display: flex; align-items: center; border: 1px solid transparent; transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); transform: scale(1); }
          .hh-tab.active { color: #2D2415; border: 1px solid #E8DCC3; background: #fff; font-weight:600; }
          .hh-tab.clicking { transform: scale(0.92); background: #E8DCC3; opacity: 0.8; }
          .hh-tab:active { transform: scale(0.92); }
        `}</style>

        <div className="hh-top">
          <div className="hh-logo" onClick={() => router.push('/homefeed')}>Tasomi</div>
          <div className="hh-right">
            <div className="hh-icon" onClick={() => router.push('/messages')}><svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M8 8h8M8 16h5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
            <div className="hh-icon" onClick={() => router.push('/notifications')}><svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg></div>
            <div className="hh-icon" onClick={() => router.push('/bookings')}><svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg></div>
            <div className="hh-profile" onClick={() => router.push('/profilesettings')}>{avatar ? <img src={avatar} alt="" /> : null}</div>
          </div>
        </div>

        <div className="hh-tabs">
          {TABS.map(tab => (
            <div 
              key={tab.id} 
              className={`hh-tab ${activeTab === tab.id ? 'active' : ''} ${clickingId === tab.id ? 'clicking' : ''}`} 
              onClick={() => handleTabClick(tab)}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
