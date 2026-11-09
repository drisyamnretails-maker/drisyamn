"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, Play, Volume2, VolumeX, Music2, Plus, Check, MoreHorizontal, X } from 'lucide-react';

type Reel = {
  id: string;
  video: string;
  thumbnail: string;
  username: string;
  name: string;
  avatar: string;
  caption: string;
  music: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isFollowing: boolean;
};

const SAMPLE: Reel[] = [
  { id: '1', video: 'https://cdn.coverr.co/videos/coverr-swimming-in-a-pool-1567/1080p.mp4', thumbnail: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80', username: 'tasomi_hotel', name: 'Tasomi Hotel', avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80', caption: 'Infinity Pool Vibes 🌊 #Tasomi #Siliguri #PoolDay', music: 'Original Audio - tasomi_hotel', likes: 1240, comments: 89, shares: 45, isLiked: false, isFollowing: false },
  { id: '2', video: 'https://cdn.coverr.co/videos/coverr-cooking-a-delicious-meal-1580/1080p.mp4', thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', username: 'tasomi_hotel', name: 'Tasomi Hotel', avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80', caption: 'Fine Dining Experience 🍽️ Chef Special Today!', music: 'Soft Jazz - Cafe Vibes', likes: 980, comments: 64, shares: 32, isLiked: true, isFollowing: true },
  { id: '3', video: 'https://cdn.coverr.co/videos/coverr-a-spa-treatment-1575/1080p.mp4', thumbnail: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', username: 'tasomi_hotel', name: 'Tasomi Hotel', avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80', caption: 'Spa & Wellness Day ✨ Relax, Refresh, Rejuvenate', music: 'Calm Piano - Relax', likes: 2100, comments: 156, shares: 98, isLiked: false, isFollowing: false },
  { id: '4', video: 'https://cdn.coverr.co/videos/coverr-walking-in-a-garden-1585/1080p.mp4', thumbnail: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80', username: 'tasomi_hotel', name: 'Tasomi Hotel', avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80', caption: 'Morning Walk in Our Garden 🌿 Peaceful Start', music: 'Nature Sounds - Morning', likes: 760, comments: 42, shares: 18, isLiked: false, isFollowing: false },
  { id: '5', video: 'https://cdn.coverr.co/videos/coverr-hotel-room-tour-1590/1080p.mp4', thumbnail: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80', username: 'tasomi_hotel', name: 'Tasomi Hotel', avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80', caption: 'Luxury Room Tour 🏨 Which Room is Your Fav?', music: 'Trending - Luxury Vibes', likes: 1890, comments: 210, shares: 76, isLiked: false, isFollowing: true },
];

export default function ReelTab({ profileId }: { profileId: string }) {
  const [reels, setReels] = useState<Reel[]>(SAMPLE);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [fullscreenId, setFullscreenId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fullVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 900);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!profileId) return;
      try {
        const { data } = await supabase.from('reels').select('*').eq('user_id', profileId).order('created_at', { ascending: false }).limit(20);
        if (data && data.length > 0) {
          const { data: prof } = await supabase.from('profiles').select('*').eq('id', profileId).single();
          setReels(data.map((r: any) => ({
            id: r.id, video: r.video_url || r.media_url, thumbnail: r.thumbnail_url || r.cover_url || SAMPLE[0].thumbnail,
            username: prof?.username || 'tasomi_hotel', name: prof?.business_name || prof?.name || 'Tasomi',
            avatar: prof?.avatar_url || SAMPLE[0].avatar, caption: r.caption || r.title || '',
            music: r.music || 'Original Audio', likes: r.likes_count || 0, comments: r.comments_count || 0, shares: r.shares_count || 0,
            isLiked: false, isFollowing: false,
          })));
        }
      } catch (e) { console.log(e); }
    };
    load();
  }, [profileId]);

  // Fullscreen khulte hi body scroll lock
  useEffect(() => {
    if (fullscreenId) { document.body.style.overflow = 'hidden'; setIsPaused(false); }
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [fullscreenId]);

  const visibleCount = isDesktop ? 3 : 1;
  const maxSlide = Math.max(0, reels.length - visibleCount);
  const scrollToSlide = (idx: number) => {
    const el = scrollRef.current; if (!el) return;
    const clamped = Math.max(0, Math.min(idx, maxSlide));
    setCurrentSlide(clamped);
    const card = el.querySelector('[data-reel]') as HTMLElement;
    const w = card ? card.offsetWidth + 18 : el.clientWidth;
    el.scrollTo({ left: clamped * w, behavior: 'smooth' });
  };
  const handleScroll = () => {
    const el = scrollRef.current; if (!el) return;
    const card = el.querySelector('[data-reel]') as HTMLElement;
    const w = card ? card.offsetWidth + 18 : el.clientWidth;
    const idx = Math.round(el.scrollLeft / w);
    if (idx !== currentSlide && idx >= 0 && idx <= maxSlide) setCurrentSlide(idx);
  };

  const toggleLike = (id: string) => setReels(prev => prev.map(r => r.id === id ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 } : r));
  const toggleFollow = (id: string) => setReels(prev => prev.map(r => r.id === id ? { ...r, isFollowing: !r.isFollowing } : r));
  const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'K' : `${n}`;

  const openFullscreen = (id: string) => setFullscreenId(id);
  const closeFullscreen = () => { setFullscreenId(null); fullVideoRef.current?.pause(); };
  const fullReel = reels.find(r => r.id === fullscreenId);

  const toggleFullPlay = () => {
    const v = fullVideoRef.current; if (!v) return;
    if (v.paused) { v.play(); setIsPaused(false); } else { v.pause(); setIsPaused(true); }
  };

  if (reels.length === 0) return null;

  return (
    <>
    <div className="reel-full" style={{ width: '100%', background: '#fff', padding: '28px 0 28px 0', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        @media (min-width: 900px) { .reel-full { width: 100vw !important; margin-left: calc(-50vw + 50%) !important; padding: 36px 0 32px 0 !important; } }
        @media (max-width: 899px) { .reel-full { width: 100% !important; margin-left: 0 !important; } }
      `}</style>

      <div style={{ textAlign: 'center', padding: '0 16px 18px 16px', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box' }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 6vw, 36px)', fontWeight: 600, color: '#5A6B5A', margin: 0 }}>Reels</h2>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111', margin: '8px 0 0 0' }}>Tap karke Full Screen me dekho</p>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box', padding: '0 16px' }}>
        {reels.length > visibleCount && <button onClick={() => scrollToSlide(currentSlide <= 0 ? maxSlide : currentSlide - 1)} style={{ position: 'absolute', left: '20px', top: '45%', transform: 'translateY(-50%)', zIndex: 20, width: '42px', height: '42px', borderRadius: '50%', border: 'none', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={22} /></button>}
        {reels.length > visibleCount && <button onClick={() => scrollToSlide(currentSlide >= maxSlide ? 0 : currentSlide + 1)} style={{ position: 'absolute', right: '20px', top: '45%', transform: 'translateY(-50%)', zIndex: 20, width: '42px', height: '42px', borderRadius: '50%', border: 'none', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={22} /></button>}

        <div ref={scrollRef} onScroll={handleScroll} style={{ display: 'flex', gap: '18px', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', scrollbarWidth: 'none', padding: '2px 2px 6px 2px' }}>
          {reels.map((r) => (
            <div data-reel key={r.id} onClick={() => openFullscreen(r.id)} style={{ minWidth: isDesktop ? 'calc((100% - 36px) / 3)' : '100%', width: isDesktop ? 'calc((100% - 36px) / 3)' : '100%', flexShrink: 0, scrollSnapAlign: 'start', position: 'relative', height: isDesktop ? '320px' : '360px', borderRadius: '16px', overflow: 'hidden', background: '#000', boxShadow: '0 4px 14px rgba(0,0,0,0.12)', cursor: 'pointer' }}>

              {/* Thumbnail - Card me video nahi chalega, sirf photo + Play button */}
              <img src={r.thumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.15) 100%)', pointerEvents: 'none' }} />

              {/* TOP - User + Follow */}
              <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 5 }} onClick={e => e.stopPropagation()}>
                <img src={r.avatar} style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#fff', fontSize: '13px', fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', margin: '1px 0 0 0' }}>@{r.username}</p>
                </div>
                <button onClick={() => toggleFollow(r.id)} style={{ background: r.isFollowing ? '#fff' : '#5A7A6A', color: r.isFollowing ? '#111' : '#fff', border: 'none', borderRadius: '999px', padding: '6px 12px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>{r.isFollowing ? <><Check size={12} /> Following</> : <><Plus size={12} /> Follow</>}</button>
              </div>

              {/* CENTER - Play */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, pointerEvents: 'none' }}><Play size={26} color="#fff" fill="#fff" style={{ marginLeft: '4px' }} /></div>

              {/* RIGHT - Like / Comment / Share */}
              <div style={{ position: 'absolute', right: '10px', bottom: '70px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 5 }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <button onClick={() => toggleLike(r.id)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: r.isLiked ? '#FF2E63' : 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Heart size={19} color="#fff" fill={r.isLiked ? '#fff' : 'none'} /></button>
                  <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>{fmt(r.likes)}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><MessageCircle size={19} color="#fff" /></button>
                  <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>{fmt(r.comments)}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <button onClick={() => { if (navigator.share) navigator.share({ title: r.caption, url: window.location.href }); else { navigator.clipboard.writeText(window.location.href); alert('Link Copied!'); } }} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Share2 size={19} color="#fff" /></button>
                  <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>{fmt(r.shares)}</span>
                </div>
              </div>

              {/* BOTTOM - Caption + Music */}
              <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '10px 60px 10px 10px', zIndex: 5 }}>
                <p style={{ color: '#fff', fontSize: '12.5px', fontWeight: 500, margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.caption}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}><Music2 size={12} color="#fff" /><span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.music}</span></div>
              </div>
            </div>
          ))}
        </div>

        {reels.length > visibleCount && <div style={{ display: 'flex', justifyContent: 'center', gap: '7px', marginTop: '14px' }}>{Array.from({ length: maxSlide + 1 }).map((_, i) => <button key={i} onClick={() => scrollToSlide(i)} style={{ width: currentSlide === i ? '26px' : '9px', height: '9px', borderRadius: '999px', border: 'none', background: currentSlide === i ? '#5A7A6A' : '#E5DDCF', cursor: 'pointer', padding: 0 }} />)}</div>}
        <p style={{ textAlign: 'center', fontSize: '11.5px', color: '#999', margin: '8px 0 0 0' }}>← Swipe karke Reels dekho → • Tap karke Full Screen</p>
      </div>
    </div>

    {/* ===== FULL SCREEN PLAYER - Play pe khulega ===== */}
    {fullReel && (
      <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video ref={fullVideoRef} src={fullReel.video} poster={fullReel.thumbnail} autoPlay loop muted={isMuted} playsInline onClick={toggleFullPlay} style={{ width: '100%', height: '100%', maxWidth: '480px', objectFit: 'contain', background: '#000' }} />

        {/* Top Bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '14px 14px', display: 'flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)', zIndex: 10 }}>
          <button onClick={closeFullscreen} style={{ width: '38px', height: '38px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={20} color="#fff" /></button>
          <img src={fullReel.avatar} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }} />
          <div style={{ flex: 1, minWidth: 0 }}><p style={{ color: '#fff', fontSize: '14px', fontWeight: 700, margin: 0 }}>{fullReel.name}</p><p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11.5px', margin: '1px 0 0 0' }}>@{fullReel.username}</p></div>
          <button onClick={() => toggleFollow(fullReel.id)} style={{ background: fullReel.isFollowing ? '#fff' : '#5A7A6A', color: fullReel.isFollowing ? '#111' : '#fff', border: 'none', borderRadius: '999px', padding: '7px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>{fullReel.isFollowing ? 'Following' : '+ Follow'}</button>
          <button style={{ width: '38px', height: '38px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><MoreHorizontal size={18} color="#fff" /></button>
        </div>

        {/* Center Pause */}
        {isPaused && <div onClick={toggleFullPlay} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '76px', height: '76px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}><Play size={34} color="#fff" fill="#fff" style={{ marginLeft: '4px' }} /></div>}

        {/* Right Actions - Full Screen me */}
        <div style={{ position: 'absolute', right: '14px', bottom: '120px', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}><button onClick={() => toggleLike(fullReel.id)} style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: fullReel.isLiked ? '#FF2E63' : 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Heart size={24} color="#fff" fill={fullReel.isLiked ? '#fff' : 'none'} /></button><span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>{fmt(fullReel.likes)}</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}><button style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><MessageCircle size={24} color="#fff" /></button><span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>{fmt(fullReel.comments)}</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}><button onClick={() => { if (navigator.share) navigator.share({ title: fullReel.caption, url: window.location.href }); else { navigator.clipboard.writeText(window.location.href); alert('Link Copied!'); } }} style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Share2 size={24} color="#fff" /></button><span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>{fmt(fullReel.shares)}</span></div>
        </div>

        {/* Bottom - Caption + Sound */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 70px 18px 14px', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', zIndex: 10 }}>
          <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{fullReel.caption}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}><Music2 size={14} color="#fff" /><span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>{fullReel.music}</span></div>
        </div>
        <button onClick={() => setIsMuted(!isMuted)} style={{ position: 'absolute', bottom: '18px', right: '14px', width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 11 }}>{isMuted ? <VolumeX size={19} color="#fff" /> : <Volume2 size={19} color="#fff" />}</button>

        {/* Prev / Next - Full Screen me bhi swipe / arrow */}
        <button onClick={() => { const idx = reels.findIndex(r => r.id === fullscreenId); const prev = reels[(idx - 1 + reels.length) % reels.length]; setFullscreenId(prev.id); setIsPaused(false); }} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '38px', height: '38px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}><ChevronLeft size={20} color="#fff" /></button>
        <button onClick={() => { const idx = reels.findIndex(r => r.id === fullscreenId); const next = reels[(idx + 1) % reels.length]; setFullscreenId(next.id); setIsPaused(false); }} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '38px', height: '38px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}><ChevronRight size={20} color="#fff" /></button>
      </div>
    )}
    </>
  );
}