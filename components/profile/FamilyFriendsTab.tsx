"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Check, UserPlus } from 'lucide-react';

type Follower = {
  id: string;
  username: string;
  name: string;
  details: string;
  avatar: string;
  isFollowing: boolean;
};

export default function FamilyFriendsTab({ profileId }: { profileId: string }) {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      const targetId = profileId || user?.id;
      if (!targetId) return;

      const { data: follows } = await supabase.from('follows').select('follower_id').eq('following_id', targetId);
      const followerIds = follows?.map(f => f.follower_id) || [];

      let list: Follower[] = [];
      if (followerIds.length > 0) {
        const { data: profs } = await supabase.from('profiles').select('*').in('id', followerIds);
        const { data: myFollows } = await supabase.from('follows').select('following_id').eq('follower_id', user?.id);
        const myFollowingIds = new Set(myFollows?.map(f => f.following_id) || []);
        list = (profs || [])
          .filter((p: any) => p.id !== targetId && p.id !== user?.id && (p.username || '').toLowerCase() !== 'tasomi_01' && (p.name || '').toLowerCase() !== 'tasomi sharma')
          .map((p: any) => ({
            id: p.id,
            username: p.username || p.business_name?.toLowerCase().replace(/\s+/g, '_') || `user_${p.id.slice(0, 6)}`,
            name: p.name || p.business_name || 'Guest',
            details: p.tagline || p.bio || `${p.city || 'India'} • ${p.profile_role || 'Member'}`,
            avatar: p.avatar_url || p.cover_url || `https://i.pravatar.cc/600?u=${p.id}`,
            isFollowing: myFollowingIds.has(p.id),
          }));
      }

      if (list.length === 0) {
        list = [
          { id: '2', username: 'rahul_vlogs', name: 'Rahul Verma', details: 'Delhi • Vlogger • 12K Followers', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', isFollowing: true },
          { id: '3', username: 'cafe_diaries', name: 'Ananya Cafe', details: 'Mumbai • Cafe • Foodie', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80', isFollowing: false },
          { id: '4', username: 'archi_raj', name: 'Raj Architect', details: 'Pune • Architect • Interior', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80', isFollowing: false },
          { id: '5', username: 'priya_travel', name: 'Priya Travels', details: 'Goa • Travel • Creator', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80', isFollowing: true },
          { id: '6', username: 'shop_siliguri', name: 'Siliguri Store', details: 'Siliguri • Retail Shop', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80', isFollowing: false },
          { id: '7', username: 'foodie_bhai', name: 'Amit Foodie', details: 'Kolkata • Food Blogger', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80', isFollowing: false },
          { id: '8', username: 'design_queen', name: 'Sneha Design', details: 'Bangalore • Interior Designer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80', isFollowing: false },
        ];
      }
      setFollowers(list.filter(f => f.username.toLowerCase() !== 'tasomi_01'));
    };
    load();
  }, [profileId]);

  const visibleCount = isDesktop ? 4 : 1;
  const maxSlide = Math.max(0, followers.length - visibleCount);

  const scrollToSlide = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(idx, maxSlide));
    setCurrentSlide(clamped);
    const card = el.querySelector('[data-card]') as HTMLElement;
    const w = card ? card.offsetWidth + 20 : el.clientWidth;
    el.scrollTo({ left: clamped * w, behavior: 'smooth' });
  };
  const nextSlide = () => scrollToSlide(currentSlide >= maxSlide ? 0 : currentSlide + 1);
  const prevSlide = () => scrollToSlide(currentSlide <= 0 ? maxSlide : currentSlide - 1);
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]') as HTMLElement;
    const w = card ? card.offsetWidth + 20 : el.clientWidth;
    const idx = Math.round(el.scrollLeft / w);
    if (idx !== currentSlide && idx >= 0 && idx <= maxSlide) setCurrentSlide(idx);
  };

  const toggleFollow = async (f: Follower) => {
    setFollowers(prev => prev.map(x => x.id === f.id ? { ...x, isFollowing: !x.isFollowing } : x));
    if (!currentUserId || f.id.length < 10) return;
    try {
      if (f.isFollowing) await supabase.from('follows').delete().eq('follower_id', currentUserId).eq('following_id', f.id);
      else await supabase.from('follows').insert({ follower_id: currentUserId, following_id: f.id });
    } catch (e) { console.log(e); }
  };

  if (followers.length === 0) return null;

  return (
    <div className="family-full" style={{ width: '100%', background: '#fff', padding: '28px 0 28px 0', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        @media (min-width: 900px) { .family-full { width: 100vw !important; margin-left: calc(-50vw + 50%) !important; padding: 36px 0 32px 0 !important; } }
        @media (max-width: 899px) { .family-full { width: 100% !important; margin-left: 0 !important; } }
      `}</style>

      <div style={{ textAlign: 'center', padding: '0 16px 20px 16px', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box' }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 6vw, 36px)', fontWeight: 600, color: '#5A6B5A', margin: 0 }}>Family & Friends</h2>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111', margin: '8px 0 0 0' }}>{followers.length} Followers • Our Community</p>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box', padding: '0 16px' }}>
        {followers.length > visibleCount && <button onClick={prevSlide} style={{ position: 'absolute', left: '20px', top: '32%', transform: 'translateY(-50%)', zIndex: 10, width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={20} /></button>}
        {followers.length > visibleCount && <button onClick={nextSlide} style={{ position: 'absolute', right: '20px', top: '32%', transform: 'translateY(-50%)', zIndex: 10, width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={20} /></button>}

        <div ref={scrollRef} onScroll={handleScroll} style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', scrollbarWidth: 'none', padding: '6px 2px 8px 2px', boxSizing: 'border-box' }}>
          {followers.map((f) => (
            <div data-card key={f.id} style={{ minWidth: isDesktop ? 'calc((100% - 60px) / 4)' : '100%', width: isDesktop ? 'calc((100% - 60px) / 4)' : '100%', flexShrink: 0, scrollSnapAlign: 'start', background: '#F7F2E9', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.08)', border: '1px solid #F0E9DA', position: 'relative', boxSizing: 'border-box' }}>

              {/* ===== IMAGE BOX - CHHOTA KAR DIYA ===== */}
              <div style={{ position: 'relative', width: '100%', height: isDesktop ? '180px' : '170px', overflow: 'hidden' }}>
                <img src={f.avatar} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <button onClick={() => toggleFollow(f)} style={{ position: 'absolute', top: '10px', right: '10px', background: f.isFollowing ? '#fff' : '#5A7A6A', color: f.isFollowing ? '#5A7A6A' : '#fff', border: f.isFollowing ? '1.2px solid #5A7A6A' : 'none', borderRadius: '999px', padding: '7px 14px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', whiteSpace: 'nowrap' }}>
                  {f.isFollowing ? <><Check size={13} /> Following</> : <><UserPlus size={13} /> Follow</>}
                </button>
              </div>

              <div style={{ padding: '14px 14px 16px 14px', display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box' }}>
                {/* ID BOX HATA DIYA - @tasomi_01 / ID:1 wala box ab nahi hai */}

                {/* NAME + DETAILS */}
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '19px', fontWeight: 700, color: '#111', margin: 0, lineHeight: 1.2 }}>{f.name}</h3>
                  <p style={{ fontSize: '12.5px', color: '#555', margin: '6px 0 0 0', fontWeight: 500, lineHeight: 1.4 }}>{f.details}</p>
                </div>

                {/* VIEW PROFILE - FOLLOW WALA GREEN BACKGROUND */}
                <button onClick={() => window.location.href = `/profile/${f.username}`} style={{ background: '#5A7A6A', color: '#fff', border: 'none', borderRadius: '8px', padding: '11px 12px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>View Profile</button>
              </div>
            </div>
          ))}
        </div>

        {followers.length > visibleCount && <div style={{ display: 'flex', justifyContent: 'center', gap: '7px', marginTop: '14px' }}>{Array.from({ length: maxSlide + 1 }).map((_, i) => <button key={i} onClick={() => scrollToSlide(i)} style={{ width: currentSlide === i ? '26px' : '9px', height: '9px', borderRadius: '999px', border: 'none', background: currentSlide === i ? '#5A7A6A' : '#E5DDCF', cursor: 'pointer', padding: 0 }} />)}</div>}
      </div>
    </div>
  );
}