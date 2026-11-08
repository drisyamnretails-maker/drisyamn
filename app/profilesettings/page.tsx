"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isBusiness, setIsBusiness] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setProfile(data);
        // business check
        if (data.business_type && data.business_type !== 'personal') setIsBusiness(true);
        if (data.account_type === 'business') setIsBusiness(true);
      }
      setLoading(false);
    })();
  }, [router]);

  const handleLogout = async () => {
    if (!confirm('Logout karna hai?')) return;
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleDelete = async () => {
    if (!confirm('Account delete karoge? Ye permanent hai!')) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    // profiles delete, auth will be deleted via function or manual
    await supabase.from('profiles').delete().eq('id', user.id);
    await supabase.auth.signOut();
    alert('Account deleted');
    router.push('/login');
  };

  if (loading) return <div style={{ background:'#F3F4F6', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#111827' }}>Loading...</div>;

  const items = [
    { id: 'account', label: 'Account Settings', icon: 'user', route: '/profilesettings/account' },
    { id: 'notifications', label: 'Notifications', icon: 'bell', route: '/notifications' },
    { id: 'bookings', label: 'Bookings', icon: 'calendar', route: '/bookings', badge: isBusiness ? 'BUSINESS' : null, show: isBusiness },
    { id: 'privacy', label: 'Privacy', icon: 'shield', route: '/profilesettings/privacy' },
    { id: 'terms', label: 'Terms & Conditions', icon: 'doc', route: '/profilesettings/terms' },
    { id: 'help', label: 'Help & Support', icon: 'help', route: '/profilesettings/help' },
    { id: 'logout', label: 'Logout', icon: 'logout', route: 'logout', danger: true },
  ];

  const renderIcon = (type: string) => {
    const s = { width: 20, height: 20, stroke: '#111827', fill: 'none', strokeWidth: 1.6 } as any;
    if (type === 'user') return <svg style={s} viewBox="0 0 24 24"><path d="M20 21a8 8 0 10-16 0"/><circle cx="12" cy="8" r="4"/></svg>;
    if (type === 'bell') return <svg style={s} viewBox="0 0 24 24"><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>;
    if (type === 'calendar') return <svg style={s} viewBox="0 0 24 24"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>;
    if (type === 'shield') return <svg style={s} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12a3 3 0 016 0v2H9v-2z"/></svg>;
    if (type === 'doc') return <svg style={s} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
    if (type === 'help') return <svg style={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    if (type === 'logout') return <svg style={{...s, stroke:'#C14545'}} viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
    return null;
  };

  return (
    <div style={{ minHeight:'100vh', background:'#F3F4F6', display:'flex', justifyContent:'center' }}>
      <div style={{ width:'100%', maxWidth:'720px', minHeight:'100vh', background:'#FFFFFF', paddingBottom:'40px' }}>
        <style>{`
          .ps-header { display:flex; align-items:center; gap:14px; padding:16px; background:#F3F4F6; position:sticky; top:0; z-index:10; border-bottom:1px solid #E5E7EB; }
          .ps-back { width:36px; height:36px; border-radius:50%; background:#FFFFFF; display:flex; align-items:center; justify-content:center; cursor:pointer; border:1px solid #E5E7EB; }
          .ps-title { font-size:22px; font-weight:700; color:#111827; }
          .ps-profile { display:flex; flex-direction:column; align-items:center; padding:28px 16px 16px; }
          .ps-avatar-wrap { position:relative; width:110px; height:110px; }
          .ps-avatar { width:110px; height:110px; border-radius:50%; object-fit:cover; border:3px solid #C9A86A; box-shadow:0 4px 12px rgba(0,0,0,0.08); }
          .ps-edit { position:absolute; bottom:0; right:0; width:34px; height:34px; background:#C9A86A; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; cursor:pointer; }
          .ps-name { margin-top:16px; font-size:22px; font-weight:700; color:#111827; }
          .ps-email { font-size:13px; color:#9CA3AF; margin-top:4px; }
          .ps-list { padding:12px 16px; display:flex; flex-direction:column; gap:12px; }
          .ps-item { height:56px; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:12px; display:flex; align-items:center; padding:0 14px; cursor:pointer; transition: all 0.18s ease; justify-content:space-between; }
          .ps-item:active { transform: scale(0.97); background:#F3F4F6; }
          .ps-item-left { display:flex; align-items:center; gap:12px; }
          .ps-icon-bg { width:36px; height:36px; background:#F3F4F6; border-radius:10px; display:flex; align-items:center; justify-content:center; }
          .ps-label { font-size:15px; font-weight:500; color:#111827; }
          .ps-label.danger { color:#C14545; font-weight:600; }
          .ps-badge { background:#C9A86A; color:#111827; font-size:10px; padding:4px 10px; border-radius:20px; font-weight:700; letter-spacing:0.5px; }
          .ps-arrow { color:#9CA3AF; }
          .ps-footer-links { display:flex; flex-direction:column; align-items:center; gap:12px; margin-top:16px; }
          .ps-delete { color:#C14545; font-size:14px; text-decoration:underline; cursor:pointer; font-weight:500; }
          .ps-version { color:#9CA3AF; font-size:12px; margin-top:8px; }
        `}</style>

        <div className="ps-header">
          <div className="ps-back" onClick={() => router.back()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </div>
          <div className="ps-title">Profile Settings</div>
        </div>

        <div className="ps-profile">
          <div className="ps-avatar-wrap">
            <img className="ps-avatar" src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.business_name || 'User'}&background=C9A86A&color=111827`} alt="" />
            <div className="ps-edit" onClick={() => router.push('/profilesettings/account')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </div>
          </div>
          <div className="ps-name">{profile?.business_name || profile?.full_name || 'Alex Chen'}</div>
          <div className="ps-email">{profile?.email || 'alex.chen@email.com'}</div>
        </div>

        <div className="ps-list">
          {items.map(item => {
            if (item.show === false) return null;
            return (
              <div key={item.id} className="ps-item" onClick={() => {
                if (item.route === 'logout') handleLogout();
                else router.push(item.route);
              }}>
                <div className="ps-item-left">
                  <div className="ps-icon-bg" style={item.danger ? { background:'#FCE8E8' } : {}}>{renderIcon(item.icon)}</div>
                  <div className={`ps-label ${item.danger ? 'danger' : ''}`}>{item.label}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  {item.badge && <span className="ps-badge">{item.badge}</span>}
                  <span className="ps-arrow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.danger ? '#C14545' : '#9CA3AF'} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="ps-footer-links">
          <div className="ps-delete" onClick={handleDelete}>Delete Account</div>
          <div className="ps-version">App Version v1.0.0 • About Tasomi</div>
        </div>
      </div>
    </div>
  );
}