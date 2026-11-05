"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Play, X, Trash2 } from 'lucide-react';

export default function ReelTab({ profileId = "" }: { profileId?: string }) {
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [realId, setRealId] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [activeReel, setActiveReel] = useState<any>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const fetchReels = async (uid: string) => {
    if (!uid) return;
    const { data } = await supabase
      .from('reels')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    if (data) setReels(data);
  };

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const uid = profileId || user?.id || "";
      setRealId(uid);
      setIsOwner(user?.id === uid);
      if (!uid) { setLoading(false); return; }
      
      await fetchReels(uid);
      setLoading(false);

      // Realtime - homefeed pe upload karte hi yaha aa jayega
      const channel = supabase.channel(`reels-${uid}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reels', filter: `user_id=eq.${uid}` }, () => fetchReels(uid))
        .subscribe();
      
      return () => { supabase.removeChannel(channel); };
    })();
  }, [profileId]);

  const scroll = (dir: 'left' | 'right') => {
    sliderRef.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Delete this reel?')) return;
    // storage se bhi delete
    const path = url.split('/reels/')[1];
    if (path) await supabase.storage.from('reels').remove([path]);
    await supabase.from('reels').delete().eq('id', id);
    setReels(r => r.filter(x => x.id !== id));
    setActiveReel(null);
  };

  if (loading) return null;
  // agar kisi aur ka profile hai aur reel nahi hai to tab hide
  if (!isOwner && reels.length === 0) return null;

  return (
    <div style={{ width: '100%', background: '#F6F1E8', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '720px', paddingBottom: 16, position: 'relative', boxSizing: 'border-box' }}>
        <style>{`
          .reel-slider-fix { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding: 0 22px 8px 22px; box-sizing: border-box; }
          .reel-slider-fix::-webkit-scrollbar { display: none; }
          .reel-card-fix { min-width: 155px; max-width: 155px; height: 275px; background: #000; border-radius: 14px; overflow: hidden; position: relative; scroll-snap-align: start; flex-shrink: 0; border: 1px solid #E8DCC3; cursor: pointer; }
          .reel-card-fix video { width: 100%; height: 100%; object-fit: cover; }
          .reel-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%); pointer-events: none; }
          .reel-caption { position: absolute; bottom: 0; left: 0; right: 0; padding: 8px 10px; font-family: Georgia; font-size: 12px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 16px; }
          .modal-box { width: 100%; max-width: 420px; aspect-ratio: 9/16; background: #000; border-radius: 16px; overflow: hidden; position: relative; }
          .modal-box video { width: 100%; height: 100%; object-fit: contain; }
        `}</style>

        <h3 style={{ fontFamily: 'Georgia', fontSize: 16, fontWeight: 600, margin: '14px 0 8px 22px', color: '#0A0A0A' }}>Reels</h3>

        {reels.length === 0 ? (
          <div style={{ fontFamily: 'Georgia', fontSize: 13, color: '#8A7D6B', padding: '0 22px' }}>
            No reels yet. Homefeed se pehla reel upload karo, yaha dikhega.
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%' }}>
            <div onClick={() => scroll('left')} style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: '50%', background: '#fff', border: '1px solid #D9C9A8', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}><ChevronLeft size={16} /></div>
            <div onClick={() => scroll('right')} style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: '50%', background: '#fff', border: '1px solid #D9C9A8', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}><ChevronRight size={16} /></div>
            
            <div ref={sliderRef} className="reel-slider-fix">
              {reels.map((reel: any) => (
                <div key={reel.id} className="reel-card-fix" onClick={() => setActiveReel(reel)}>
                  <video src={reel.video_url} muted loop playsInline preload="metadata" />
                  <div className="reel-overlay" />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}><Play size={24} fill="#fff" color="#fff" /></div>
                  <div className="reel-caption">{reel.caption || reel.title || 'Reel'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fullscreen Viewer */}
        {activeReel && (
          <div className="modal-bg" onClick={() => setActiveReel(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <button onClick={() => setActiveReel(null)} style={{ position: 'absolute', top: 12, right: 12, zIndex: 3, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
              {isOwner && (
                <button onClick={() => handleDelete(activeReel.id, activeReel.video_url)} style={{ position: 'absolute', top: 12, left: 12, zIndex: 3, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,0,0,0.8)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={16} color="#fff" /></button>
              )}
              <video src={activeReel.video_url} controls autoPlay loop playsInline style={{ width: '100%', height: '100%' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', color: '#fff', fontFamily: 'Georgia', fontSize: 14 }}>{activeReel.caption}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}