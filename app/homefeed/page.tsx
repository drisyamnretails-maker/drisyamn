"use client";
import { useState, useEffect } from 'react';
import HomeHeaderTab from '@/components/homefeed/HomeHeaderTab';
import ReelsSlider from '@/components/homefeed/ReelsSlider';
import ReatilsId from '@/components/homefeed/ReatilsId';
import CafeId from '@/components/homefeed/CafeId';
import HotelId from '@/components/homefeed/HotelId';
import ArchitectId from '@/components/homefeed/ArchitectId';
import MediaId from '@/components/homefeed/MediaId';
import ServiceId from '@/components/homefeed/ServiceId';
import FriendsSlidder from '@/components/homefeed/FriendsSlidder';
import CreatePostBox from '@/components/homefeed/CreatePostBox';
import PostCard from '@/components/homefeed/PostCard';
import { supabase } from '@/lib/supabase';

export default function HomeFeedPage() {
  const [activeTab, setActiveTab] = useState<any>('retail');
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.log('posts fetch error', error);
      setPosts([]);
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const ids = [...new Set(data.map((p: any) => p.user_id))];
    if (ids.length > 0) {
      const { data: profs } = await supabase
        .from('profiles')
        .select('id, username, full_name, name, business_name, avatar_url, offerings_type, profile_role')
        .in('id', ids);
      const merged = data.map((p: any) => ({
        ...p,
        profiles: profs?.find((pr: any) => pr.id === p.user_id)
      }));
      setPosts(merged);
    } else {
      setPosts(data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, [refreshKey]);

  // ✅ STEP 1 - Sirf REAL posts. Dummy se fill nahi karenge.
  const displayPosts = posts;

  // ✅ SPLIT LOGIC - 4 / 8 / 8 / 8 / 8 / 8 / 8 - Real posts pe
  const firstPosts = displayPosts.slice(0, 4);
  const afterRetailPosts = displayPosts.slice(4, 12);
  const afterCafePosts = displayPosts.slice(12, 20);
  const afterHotelPosts = displayPosts.slice(20, 28);
  const afterArchitectPosts = displayPosts.slice(28, 36);
  const afterMediaPosts = displayPosts.slice(36, 44);
  const afterServicePosts = displayPosts.slice(44, 52);
  const restPosts = displayPosts.slice(52);

  return (
    <div className="w-full min-h-screen overflow-x-hidden" style={{ background: '#F7F4EF', color: '#111111' }}>
      <style>{`
        html, body { margin: 0; padding: 0; overflow-x: hidden !important; max-width: 100vw !important; background: #F7F4EF !important; color: #111111 !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; -webkit-font-smoothing: antialiased; }
        .feed-grid { display: flex; flex-direction: column; width: 100%; }
        @media (min-width: 900px) {
          .feed-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
          .feed-full { grid-column: 1 / -1; width: 100%; }
        }
        .feed-section-label { font-size: 11px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase; color: #A08C6A; }
        .feed-section-title { font-size: 24px; font-weight: 800; color: #111111; letter-spacing: -0.6px; line-height: 1.1; font-family: Georgia, serif; }
        .feed-section-sub { font-size: 13px; color: #7A7A7A; line-height: 1.5; }
      `}</style>

      <HomeHeaderTab activeTab={activeTab} onTabChange={setActiveTab} />
      <ReelsSlider />

      <div className="w-full flex justify-center">
        <div className="w-full max-w-[680px] lg:max-w-[1280px] px-3 sm:px-4 lg:px-8">
          <CreatePostBox activeTab={activeTab} onPostCreated={() => setRefreshKey(k => k + 1)} />
          <FriendsSlidder />

          <div style={{ padding: '18px 2px 14px 2px' }}>
            <div className="feed-section-label">Community</div>
            <div className="feed-section-title" style={{ marginTop: 6 }}>Latest Posts</div>
            <div className="feed-section-sub" style={{ marginTop: 6 }}>Stories, updates and collections from stores and people you follow.</div>
          </div>

          {/* ✅ Agar loading hai to */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888', fontSize: 14 }}>
              Loading posts...
            </div>
          )}

          {/* ✅ Agar 0 post hai to dummy nahi, ye dikhega */}
          {!loading && displayPosts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 16px', background: '#fff', borderRadius: 16, border: '1px solid #eee' }}>
              <div style={{ fontSize: 32 }}>📝</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 10 }}>No post yet</div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>Be the first to post in Tasomi!</div>
            </div>
          )}

          <div className="pb-[20px] w-full">
            {/* 1️⃣ 4 POST */}
            {firstPosts.length > 0 && (
              <div className="feed-grid">
                {firstPosts.map((p: any) => (
                  <div key={p.id} className="w-full">
                    <PostCard post={p} onDeleted={fetchPosts} />
                  </div>
                ))}
              </div>
            )}

            {/* 2️⃣ RETAIL SLIDER */}
            <div className="feed-full w-full" style={{ margin: '6px 0 18px 0' }}>
              <ReatilsId />
            </div>

            {/* 3️⃣ 8 POST - Retail ke baad */}
            {afterRetailPosts.length > 0 && (
              <div className="feed-grid">
                {afterRetailPosts.map((p: any) => (
                  <div key={p.id} className="w-full">
                    <PostCard post={p} onDeleted={fetchPosts} />
                  </div>
                ))}
              </div>
            )}

            {/* 4️⃣ CAFE SLIDER */}
            <div className="feed-full w-full" style={{ margin: '6px 0 18px 0' }}>
              <CafeId />
            </div>

            {/* 5️⃣ 8 POST - Cafe ke baad */}
            {afterCafePosts.length > 0 && (
              <div className="feed-grid">
                {afterCafePosts.map((p: any) => (
                  <div key={p.id} className="w-full">
                    <PostCard post={p} onDeleted={fetchPosts} />
                  </div>
                ))}
              </div>
            )}

            {/* 6️⃣ HOTEL SLIDER */}
            <div className="feed-full w-full" style={{ margin: '6px 0 18px 0' }}>
              <HotelId />
            </div>

            {/* 7️⃣ 8 POST - Hotel ke baad */}
            {afterHotelPosts.length > 0 && (
              <div className="feed-grid">
                {afterHotelPosts.map((p: any) => (
                  <div key={p.id} className="w-full">
                    <PostCard post={p} onDeleted={fetchPosts} />
                  </div>
                ))}
              </div>
            )}

            {/* 8️⃣ ARCHITECT SLIDER */}
            <div className="feed-full w-full" style={{ margin: '6px 0 18px 0' }}>
              <ArchitectId />
            </div>

            {/* 9️⃣ 8 POST - Architect ke baad */}
            {afterArchitectPosts.length > 0 && (
              <div className="feed-grid">
                {afterArchitectPosts.map((p: any) => (
                  <div key={p.id} className="w-full">
                    <PostCard post={p} onDeleted={fetchPosts} />
                  </div>
                ))}
              </div>
            )}

            {/* 🔟 MEDIA SLIDER */}
            <div className="feed-full w-full" style={{ margin: '6px 0 18px 0' }}>
              <MediaId />
            </div>

            {/* 1️⃣1️⃣ 8 POST - Media ke baad */}
            {afterMediaPosts.length > 0 && (
              <div className="feed-grid">
                {afterMediaPosts.map((p: any) => (
                  <div key={p.id} className="w-full">
                    <PostCard post={p} onDeleted={fetchPosts} />
                  </div>
                ))}
              </div>
            )}

            {/* 1️⃣2️⃣ SERVICE SLIDER */}
            <div className="feed-full w-full" style={{ margin: '6px 0 18px 0' }}>
              <ServiceId />
            </div>

            {/* 1️⃣3️⃣ 8 POST - Service ke baad */}
            {afterServicePosts.length > 0 && (
              <div className="feed-grid">
                {afterServicePosts.map((p: any) => (
                  <div key={p.id} className="w-full">
                    <PostCard post={p} onDeleted={fetchPosts} />
                  </div>
                ))}
              </div>
            )}

            {/* 1️⃣4️⃣ Baaki Posts */}
            {restPosts.length > 0 && (
              <div className="feed-grid" style={{ marginTop: 10 }}>
                {restPosts.map((p: any) => (
                  <div key={p.id} className="w-full">
                    <PostCard post={p} onDeleted={fetchPosts} />
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}