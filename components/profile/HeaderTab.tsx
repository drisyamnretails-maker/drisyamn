"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { MessageCircle, Bell, CalendarDays, MapPin, Phone, User, Info, Edit3, UserPlus, UserCheck, X } from 'lucide-react';

type Profile = {
  id: string;
  profile_role: 'personal' | 'business' | 'creator';
  name?: string; business_name?: string; address?: string; contact?: string;
  deals_in?: string; about_us?: string; bio?: string; our_stories?: string;
  why_choose_us?: string; hobby?: string; dob?: string;
  avatar_url?: string; cover_url?: string; cover_urls?: string[];
};

export default function HeaderTab({ profileId }: { profileId?: string }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [coverIndex, setCoverIndex] = useState(0);
  const [press, setPress] = useState<string | null>(null);
  const [showNotifBox, setShowNotifBox] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const aboutRef = useRef<HTMLDivElement>(null);
  const [aboutIndex, setAboutIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);
      let id = profileId || user.id;
      setIsOwner(user.id === id);
      const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (data) setProfile(data);
      if (user.id !== id) {
        const { data: follow } = await supabase.from('follows').select('*').eq('follower_id', user.id).eq('following_id', id).single();
        if (follow) setIsFollowing(true);
      }
      const { data: notifs } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5);
      if (notifs) setNotifications(notifs);
    })();
  }, [profileId]);

  useEffect(() => {
    if (profile?.cover_urls && profile.cover_urls.length > 1) {
      const t = setInterval(() => setCoverIndex(p => (p + 1) % profile.cover_urls!.length), 3500);
      return () => clearInterval(t);
    }
  }, [profile]);

  const handleFollow = async () => {
    if (!currentUserId || !profile) return;
    setPress('follow');
    try {
      if (isFollowing) {
        await supabase.from('follows').delete().eq('follower_id', currentUserId).eq('following_id', profile.id);
        setIsFollowing(false);
      } else {
        await supabase.from('follows').insert({ follower_id: currentUserId, following_id: profile.id });
        setIsFollowing(true);
        const { data: { user } } = await supabase.auth.getUser();
        const followerName = user?.user_metadata?.name || 'Someone';
        await supabase.from('notifications').insert({
          user_id: profile.id,
          from_id: currentUserId,
          type: 'follow',
          message: `${followerName} started following you`
        });
      }
    } catch (e) { console.log(e); }
    setTimeout(()=>setPress(null), 200);
  };

  if (!profile) return <div style={{ minHeight: '100dvh', background: '#F6F1E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia' }}>Loading...</div>;

  const isPersonal = profile.profile_role === 'personal';
  const covers = isPersonal ? (profile.cover_url ? [profile.cover_url] : []) : (profile.cover_urls?.length ? profile.cover_urls : profile.cover_url ? [profile.cover_url] : []);
  const deals = profile.deals_in?.split(',').map(s=>s.trim()).filter(Boolean) || [];
  const businessCards = [
    { title: 'About Us', desc: profile.about_us },
    { title: 'Our Stories', desc: profile.our_stories },
    { title: 'Why People Choose Us', desc: profile.why_choose_us },
  ].filter(c=>c.desc);

  return (
    // GAP FIX 1: minHeight 100dvh hata diya, sirf width rakha
    <div style={{ width: '100%', background: '#F6F1E8', display: 'flex', justifyContent: 'center' }}>
      {/* GAP FIX 2: minHeight 100dvh -> auto, paddingBottom 40 -> 8 */}
      <div style={{ width: '100%', maxWidth: '720px', paddingBottom: 8, position: 'relative' }}>

        {/* TOPBAR - kuch change nahi */}
        <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', position: 'sticky', top: 0, zIndex: 30, background: 'rgba(246,241,232,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #E8DCC3' }}>
          <h1 style={{
            fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '400', margin: 0,
            background: 'linear-gradient(90deg, #2D2415 0%, #5A4A32 30%, #8C6F3A 65%, #B89B5E 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Drisyamn.</h1>
          <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
            <div onClick={()=>router.push(profileId ? `/messages/${profileId}` : '/messages')} style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #D9C9A8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <MessageCircle size={18} color="#2D2415" />
            </div>
            <div onClick={()=>setShowNotifBox(!showNotifBox)} style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #D9C9A8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <Bell size={18} color="#2D2415" />
              {notifications.length > 0 && <div style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: '#C8A86A', border: '2px solid #FFF' }} />}
            </div>
            <div onClick={()=>router.push('/calendar')} style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #D9C9A8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <CalendarDays size={18} color="#2D2415" />
            </div>
            {showNotifBox && (
              <div style={{ position: 'absolute', top: 50, right: 0, width: 320, background: '#FFFFFF', border: '1px solid #D9C9A8', borderRadius: 14, boxShadow: '0 12px 30px rgba(0,0,0,0.12)', zIndex: 50, overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E8DCC3' }}>
                  <span style={{ fontFamily: 'Georgia', fontWeight: 700, fontSize: 14 }}>Notifications</span>
                  <X size={16} style={{ cursor: 'pointer' }} onClick={()=>setShowNotifBox(false)} />
                </div>
                <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                  {notifications.length === 0 ? <p style={{ fontFamily: 'Georgia', fontSize: 13, color: '#8A7D6B', padding: 20, textAlign: 'center' }}>No notifications</p> :
                    notifications.map((n,i)=><div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid #F3EBD9', fontFamily: 'Georgia', fontSize: 13, color: '#2D2415' }}>{n.message}<div style={{ fontSize: 11, color: '#8A7D6B', marginTop: 4 }}>{new Date(n.created_at).toLocaleDateString()}</div></div>)
                  }
                </div>
                <div onClick={()=>{ setShowNotifBox(false); router.push('/notifications'); }} style={{ padding: '12px', textAlign: 'center', fontFamily: 'Georgia', fontSize: 13, fontWeight: 600, color: '#8C6F3A', cursor: 'pointer', background: '#F6F1E8' }}>View All Notifications</div>
              </div>
            )}
          </div>
        </div>

        {/* COVER - GAP FIX 3: margin 10px -> 6px */}
        <div style={{ margin: '6px 16px 0', height: isPersonal ? 260 : 300, borderRadius: 14, overflow: 'hidden', position: 'relative', background: '#F3EBD9', border: '1px solid #C8A86A', boxShadow: '0 10px 30px rgba(200,168,106,0.22)' }}>
          {covers.length ? covers.map((url, i) => (
            <div key={i} style={{ position: 'absolute', inset: 0, backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: i===coverIndex?1:0, transition: 'opacity 0.8s ease' }} />
          )) : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia', color: '#5C4A32' }}>No Cover</div>}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(45,36,21,0.45) 0%, transparent 65%)' }} />
          {covers.length > 1 && (
            <div style={{ position: 'absolute', bottom: 14, left: 16, display: 'flex', gap: 6, background: 'rgba(255,255,255,0.9)', padding: '6px 10px', borderRadius: 20 }}>
              {covers.map((_, i) => <div key={i} onClick={()=>setCoverIndex(i)} style={{ width: i===coverIndex?20:6, height: 6, borderRadius: 10, background: i===coverIndex?'#2D2415':'#D9C9A8', cursor: 'pointer' }} />)}
            </div>
          )}
          {isPersonal && profile.avatar_url && <div style={{ position: 'absolute', bottom: 16, left: 16, width: 84, height: 84, borderRadius: '50%', border: '3px solid #FFF', background: `url(${profile.avatar_url}) center/cover` }} />}
          <div style={{ position: 'absolute', bottom: 14, right: 14 }}>
            {isOwner ? (
              <button
                onMouseDown={()=>setPress('edit')} onMouseUp={()=>setPress(null)}
                onClick={()=>router.push('/profile/create')}
                style={{
                  height: 36, padding: '0 16px', borderRadius: 20, border: '1px solid #C8A86A',
                  background: press==='edit' ? '#FFFFFF' : '#F3EBD9', color: '#2D2415',
                  fontFamily: 'Georgia', fontSize: 13, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer',
                  transform: press==='edit' ? 'scale(0.96)' : 'scale(1)', transition: 'all 0.18s', boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                }}
              ><Edit3 size={14} /> Edit</button>
            ) : (
              <button
                onMouseDown={()=>setPress('follow')} onMouseUp={()=>setPress(null)}
                onClick={handleFollow}
                style={{
                  height: 36, padding: '0 18px', borderRadius: 20, border: '1px solid #2D2415',
                  background: isFollowing ? '#FFFFFF' : (press==='follow' ? '#3A2F1F' : '#2D2415'),
                  color: isFollowing ? '#2D2415' : '#F6F1E8',
                  fontFamily: 'Georgia', fontSize: 13, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer',
                  transform: press==='follow' ? 'scale(0.96)' : 'scale(1)', transition: 'all 0.18s', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >{isFollowing ? <><UserCheck size={14} /> Following</> : <><UserPlus size={14} /> Follow</>}</button>
            )}
          </div>
        </div>

        {/* INFO - GAP FIX 4: padding 20px -> 10px */}
        <div style={{ padding: '10px 22px 0' }}>
          <h2 style={{ fontFamily: 'Georgia', fontSize: 28, fontWeight: 600, color: '#0A0A0A', margin: 0 }}>{isPersonal ? profile.name : profile.business_name || profile.name}</h2>
          {profile.address && <p style={{ fontFamily: 'Georgia', fontSize: 14, color: '#5C4A32', margin: '6px 0 0', display: 'flex', gap: 6 }}><MapPin size={14} /> {profile.address}</p>}
          {deals.length > 0 && <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>{deals.map((d,i)=><div key={i} style={{ background: '#FFFFFF', border: '1px solid #D9C9A8', borderRadius: 20, padding: '6px 14px', fontFamily: 'Georgia', fontSize: 12, fontWeight: 600 }}>{d}</div>)}</div>}
        </div>

        <div style={{ width: 190, height: 1, margin: '10px auto', background: 'linear-gradient(90deg, transparent, #D4B483, #B89B5E, #D4B483, transparent)' }} />

        {!isPersonal && businessCards.length > 0 && (
          <div>
            <h3 style={{ fontFamily: 'Georgia', fontSize: 16, fontWeight: 600, margin: '0 0 8px 22px' }}>About & More</h3>
            <div ref={aboutRef} onScroll={e=>setAboutIndex(Math.round(e.currentTarget.scrollLeft/292))} style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 22px 8px', scrollbarWidth: 'none' }}>
              {businessCards.map((c, i)=><div key={i} style={{ minWidth: 280, background: '#FFFFFF', border: '1px solid #D9C9A8', borderRadius: 14, padding: 16 }}><span style={{ fontFamily: 'Georgia', fontSize: 14, fontWeight: 600 }}>{c.title}</span><p style={{ fontFamily: 'Georgia', fontSize: 13, lineHeight: 1.6, color: '#5C4A32', margin: '8px 0 0' }}>{c.desc}</p></div>)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>{businessCards.map((_, i)=><div key={i} style={{ width: i===aboutIndex?20:6, height: 6, borderRadius: 10, background: i===aboutIndex?'#2D2415':'#D9C9A8' }} />)}</div>
          </div>
        )}
      </div>
    </div>
  );
}