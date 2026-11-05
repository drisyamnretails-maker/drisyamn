"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Profile = {
  id: string;
  business_name: string;
  facility: string;
  cover_url: string;
  business_type: string;
};

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
];

export default function FriendsSlidder() {
  const router = useRouter();
  const [list, setList] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [myId, setMyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. LOAD LOGIC
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        setMyId(user.id);

        // 2. FOLLOWED LOGIC
        const { data: followedData } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id);

        const followedIds = followedData?.map(f => f.following_id) || [];
        setFollowing(new Set(followedIds));

        // 3. SAFE EXCLUDE LOGIC
        let query = supabase
          .from('profiles')
          .select('id, business_name, facility, deals_with, cover_url, business_type')
          .limit(15);

        if (followedIds.length > 0) {
          query = query.filter('id', 'not.in', `(${followedIds.join(',')})`);
        }
        query = query.neq('id', user.id);

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.error("Slidder fetch error:", error.message);
        } else if (data) {
          const mapped: Profile[] = data.map((d: any) => ({
            id: d.id,
            business_name: d.business_name || d.full_name || d.username || 'User',
            facility: d.facility || d.deals_with || 'General',
            cover_url: d.cover_url || d.avatar_url || '',
            business_type: d.business_type || 'personal',
          }));
          setList(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // 4. FOLLOW / UNFOLLOW LOGIC
  const handleFollow = async (e: React.MouseEvent, targetId: string) => {
    e.stopPropagation();
    if (!myId) return;

    const isFollowing = following.has(targetId);

    // Optimistic update
    setFollowing(prev => {
      const next = new Set(prev);
      if (isFollowing) next.delete(targetId);
      else next.add(targetId);
      return next;
    });

    try {
      if (isFollowing) {
        const { error } = await supabase.from('follows').delete().eq('follower_id', myId).eq('following_id', targetId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('follows').insert({ follower_id: myId, following_id: targetId });
        if (error) throw error;
      }
    } catch (err) {
      // rollback on fail
      setFollowing(prev => {
        const next = new Set(prev);
        if (isFollowing) next.add(targetId);
        else next.delete(targetId);
        return next;
      });
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ width: '100%', background: '#F6F1E8', padding: '10px 0' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 14px', display: 'flex', gap: 10 }}>
          {[1,2,3].map(i => <div key={i} style={{ minWidth:148, height:190, background:'#E8DCC3', borderRadius:14 }} />)}
        </div>
      </div>
    );
  }

  if (list.length === 0) return null;

  return (
    <div style={{ width: '100%', background: '#F6F1E8' }}>
      <style>{`
        .fs-wrap{ width:100%; max-width:720px; margin:0 auto; padding:10px 0 16px; }
        .fs-title{ font-size:16px; font-weight:600; color:#2D2415; padding:0 14px 10px; display:flex; justify-content:space-between; align-items:center; }
        .fs-seeall{ font-size:12px; color:#6B5A3F; cursor:pointer; font-weight:500; }
        .fs-slider{ display:flex; gap:10px; overflow-x:auto; padding:0 14px 6px; scrollbar-width:none; }
        .fs-slider::-webkit-scrollbar{ display:none; }
        .fs-card{ min-width:148px; max-width:148px; background:#FFFEFB; border:1px solid #E8DCC3; border-radius:14px; padding:8px; flex-shrink:0; cursor:pointer; }
        .fs-img-wrap{ width:100%; height:132px; border-radius:10px; background:#E8DCC3; display:flex; align-items:center; justify-content:center; overflow:hidden; }
        .fs-img{ width:100%; height:100%; object-fit:cover; display:block; }
        .fs-initial{ font-size:32px; font-weight:800; color:#8B7D65; }
        .fs-name{ font-size:14px; font-weight:600; color:#2D2415; margin-top:8px; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .fs-spec{ font-size:11px; color:#8B7D65; margin-top:2px; text-align:center; text-transform:capitalize; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .fs-btn{ margin-top:10px; height:34px; border:none; border-radius:8px; font-size:13px; font-weight:600; width:100%; cursor:pointer; transition:0.2s; }
        .fs-btn.follow{ background:#E8DCC3; color:#2D2415; }
        .fs-btn.following{ background:#2D2415; color:#F6F1E8; }
      `}</style>

      <div className="fs-wrap">
        <div className="fs-title">
          Suggested for you
          <span className="fs-seeall" onClick={() => router.push('/people')}>See all</span>
        </div>
        <div className="fs-slider">
          {list.map((p, idx) => {
            const isFollowing = following.has(p.id);
            return (
              <div key={p.id} className="fs-card" onClick={() => router.push(`/profile/${p.id}`)}>
                <div className="fs-img-wrap">
                  {p.cover_url ? (
                    <img src={p.cover_url} className="fs-img" alt={p.business_name} onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_IMGS[idx % FALLBACK_IMGS.length];
                    }} />
                  ) : (
                    <span className="fs-initial">{p.business_name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="fs-name">{p.business_name}</div>
                <div className="fs-spec">{p.business_type} • {p.facility.slice(0, 14)}</div>
                <button className={`fs-btn ${isFollowing ? 'following' : 'follow'}`} onClick={(e) => handleFollow(e, p.id)}>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}