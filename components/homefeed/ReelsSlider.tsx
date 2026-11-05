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
      // Pehle viral_score ke saath try karo, fail hua to simple query
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

      // Agar viral_score column nahi hai to fallback
      if (error) {
        const q2 = supabase.from('reels').select('*, profiles:user_id(username)').order('created_at', { ascending: false }).limit(30);
        const res2 = await (profileId ? q2.eq('user_id', profileId) : q2);
        data = res2.data;
      }

      if (data) setReels(data as any);
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

    // 1. Personal Best
    const maxViews = Math.max(...userReels.map(r => r.views || 0));
    if ((reel.views || 0) + 1 >= maxViews && (reel.views || 0) + 1 > 5) {
      await sendNotification(user.id, reel.id, `Your best performing reel so far, crossed your highest views`, 'personal_best');
      return;
    }
    // 2. Fastest Growing
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
    // 3. Live
    if (lastHourViews >= 5) {
      await sendNotification(user.id, reel.id, `${lastHourViews} people watching your reel right now`, 'live');
      return;
    }
    // 4. Trending
    if ((reel.viral_score || 0) > 1) {
      await sendNotification(user.id, reel.id, `Your reel is trending in ${reel.category || 'retail'} category`, 'trending');
      return;
    }
    // 5. Pushed
    if (lastHourViews > 10) {
      await sendNotification(user.id, reel.id, `Pushed to 300 more people, it's picking up`, 'pushed');
      return;
    }
    // 6. Comeback
    const lastReelDate = userReels[1]?.created_at;
    if (lastReelDate && Date.now() - new Date(lastReelDate).getTime() > 7*24*60*60*1000) {
      await sendNotification(user.id, reel.id, `After a while, and you came back stronger`, 'comeback');
      return;
    }
    // 7. Streak
    const last3DaysCount = userReels.filter(r => new Date(r.created_at).getTime() > Date.now() - 3*24*60*60*1000).length;
    if (last3DaysCount >= 3) {
      await sendNotification(user.id, reel.id, `${last3DaysCount} reels in 3 days, your audience is growing`, 'streak');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', gap: 10, padding: '12px 16px', background: '#F6F1E8' }}>
        {[1,2,3].map(i => <div key={i} style={{ width: 112, height: 168, background: '#E8DCC3', borderRadius: 16, flexShrink: 0 }} />)}
      </div>
    );
  }
  
  // FINAL FIX: null return hataya, empty state dikhega
  if (reels.length === 0) {
    return (
      <div style={{ width: '100%', background: '#F6F1E8', padding: '20px 16px', textAlign: 'center', fontFamily: 'Inter', color: '#8A7D6B', fontSize: 13 }}>
        No reels yet. Upload your first reel.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', background: '#F6F1E8' }}>
      <style>{`
        .rs-scroll { display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; padding: 4px 16px 12px 16px; }
        .rs-scroll::-webkit-scrollbar { display: none; }
        .rs-card { min-width: 112px; width: 112px; height: 168px; border-radius: 16px; position: relative; overflow: hidden; background: #000; flex-shrink: 0; cursor: pointer; box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
        .rs-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .rs-grad { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.75), transparent 60%); }
      `}</style>
      <div className="rs-scroll">
        {reels.map((reel) => (
          <div key={reel.id} className="rs-card" onClick={() => handleView(reel)}>
            <img src={reel.thumbnail_url || `https://picsum.photos/seed/${reel.id}/300/500`} alt="" />
            <div className="rs-grad" />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>▶</div>
            <div style={{ position: 'absolute', bottom: 6, left: 8, right: 8 }}>
              <div style={{ color: '#fff', fontSize: 11, fontWeight: 600, fontFamily: 'Inter' }}>@{reel.profiles?.username || 'user'}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10, fontFamily: 'Inter' }}>{reel.views || 0} views</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}