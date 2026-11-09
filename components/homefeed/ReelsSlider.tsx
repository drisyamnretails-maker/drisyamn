"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

type Reel = {
  id: string;
  user_id: string;
  thumbnail_url: string;
  video_url?: string;
  views: number;
  viral_score: number;
  category: string;
  created_at: string;
  profiles?: { username: string };
};

export default function ReelsSlider({ profileId }: { profileId?: string }) {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      let data, error;
      const q1 = supabase
        .from('reels')
        .select('*, profiles:user_id(username)')
        .order('viral_score', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .limit(30);

      const res1 = await (profileId ? q1.eq('user_id', profileId) : q1);
      data = res1.data;
      error = res1.error;

      if (error) {
        const q2 = supabase.from('reels').select('*, profiles:user_id(username)').order('created_at', { ascending: false }).limit(30);
        const res2 = await (profileId ? q2.eq('user_id', profileId) : q2);
        data = res2.data;
      }

      // ✅ FIX - Dummy nahi, real empty = empty hi rahega
      if (data && data.length > 0) setReels(data as any);
      else setReels([]);
      setLoading(false);
    };
    load();
  }, [profileId]);

  const sendNotification = useCallback(async (userId: string, reelId: string, message: string, type: string) => {
    const { data: last } = await supabase
      .from('notifications')
      .select('created_at')
      .eq('reel_id', reelId)
      .eq('type', type)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (last && new Date(last.created_at).getTime() > Date.now() - 2 * 60 * 60 * 1000) return;
    await supabase.from('notifications').insert({ user_id: userId, reel_id: reelId, message, type });
  }, []);

  const handleView = async (reel: Reel) => {
    setReels(prev => prev.map(r => r.id === reel.id ? { ...r, views: (r.views || 0) + 1 } : r));
    
    supabase.from('reel_events').insert({ reel_id: reel.id, event_type: 'started' }).then(()=>{});
    supabase.from('reels').update({ views: (reel.views || 0) + 1 }).eq('id', reel.id).then(()=>{});

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || reel.user_id !== user.id) return;

    const { data: userReels } = await supabase.from('reels').select('id, views, created_at').eq('user_id', user.id).order('created_at', { ascending: false });
    if (!userReels || userReels.length === 0) return;

    const { data: recentEvents } = await supabase.from('reel_events').select('event_type').eq('reel_id', reel.id).gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());
    const lastHourViews = recentEvents?.filter(e => e.event_type === 'started').length || 0;

    const maxViews = Math.max(...userReels.map(r => r.views || 0));
    if ((reel.views || 0) + 1 >= maxViews && (reel.views || 0) + 1 > 5) {
      await sendNotification(user.id, reel.id, `Your best performing reel so far, crossed your highest views`, 'personal_best');
      return;
    }
    const prevReelId = userReels[1]?.id;
    let prevHour = 1;
    if (prevReelId) {
      const { data: prevEvents } = await supabase.from('reel_events').select('id').eq('reel_id', prevReelId).gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());
      prevHour = prevEvents?.length || 1;
    }
    if (lastHourViews > prevHour * 3 && lastHourViews > 10) {
      await sendNotification(user.id, reel.id, `Whoa, ${Math.round(lastHourViews/prevHour)}x more people watching than usual`, 'traction');
      return;
    }
    if (lastHourViews >= 5) {
      await sendNotification(user.id, reel.id, `${lastHourViews} people watching your reel right now`, 'live');
      return;
    }
    if ((reel.viral_score || 0) > 1) {
      await sendNotification(user.id, reel.id, `Your reel is trending in ${reel.category || 'retail'} category`, 'trending');
      return;
    }
    if (lastHourViews > 10) {
      await sendNotification(user.id, reel.id, `Pushed to 300 more people, it's picking up`, 'pushed');
      return;
    }
    const lastReelDate = userReels[1]?.created_at;
    if (lastReelDate && Date.now() - new Date(lastReelDate).getTime() > 7*24*60*60*1000) {
      await sendNotification(user.id, reel.id, `After a while, and you came back stronger`, 'comeback');
      return;
    }
    const last3DaysCount = userReels.filter(r => new Date(r.created_at).getTime() > Date.now() - 3*24*60*60*1000).length;
    if (last3DaysCount >= 3) {
      await sendNotification(user.id, reel.id, `${last3DaysCount} reels in 3 days, your audience is growing`, 'streak');
    }
  };

  if (loading) {
    return (
      <div style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)', background: '#FFFFFF', padding: '12px 32px' }}>
        <div style={{ display: 'flex', gap: 12, overflow: 'hidden' }}>
          {[1,2,3,4,5,6].map(i => <div key={i} style={{ width: 140, height: 210, background: '#EFF5F0', borderRadius: 16, flexShrink: 0, border: '1px solid #E5E5E5' }} />)}
        </div>
      </div>
    );
  }

  // ✅ FIX - Koi real reel nahi hai to slider dikhao hi mat
  if (reels.length === 0) return null;

  return (
    <div style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', background: '#FFFFFF', padding: '12px 32px 0 32px', boxSizing: 'border-box' }}>
      <style>{`
        .rs-scroll { display: flex; gap: 14px; overflow-x: auto; scrollbar-width: none; padding: 4px 0 16px 0; }
        .rs-scroll::-webkit-scrollbar { display: none; }
        .rs-card { min-width: 132px; width: 132px; height: 198px; border-radius: 16px; position: relative; overflow: hidden; background: #000; flex-shrink: 0; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.10); border: 1px solid #E5E5E5; transition: transform 0.15s ease; }
        .rs-card:active { transform: scale(0.96); }
        .rs-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .rs-grad { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.78), transparent 58%); }
        @media (min-width: 900px) {
          .rs-card { min-width: 168px; width: 168px; height: 250px; }
          .rs-scroll { gap: 16px; padding: 4px 0 18px 0; }
        }
      `}</style>

      <div className="rs-scroll">
        {reels.map((reel) => (
          <div key={reel.id} className="rs-card" onClick={() => handleView(reel)}>
            <img src={reel.thumbnail_url} alt="" />
            <div className="rs-grad" />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 36, height: 36, borderRadius: '50%', background: '#5A7A6A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', boxShadow: '0 4px 12px rgba(90,122,106,0.5)', paddingLeft: '2px' }}>▶</div>
            {(reel.viral_score || 0) > 1 && (
              <span style={{ position: 'absolute', top: 8, left: 8, background: '#5A7A6A', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: '999px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.5px' }}>TRENDING</span>
            )}
            <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8 }}>
              <div style={{ color: '#fff', fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>@{reel.profiles?.username || 'user'}</div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 10, fontFamily: 'Inter, sans-serif', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#5A7A6A', display: 'inline-block', border: '1px solid #fff' }} />
                {(reel.views || 0).toLocaleString('en-IN')} views
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}