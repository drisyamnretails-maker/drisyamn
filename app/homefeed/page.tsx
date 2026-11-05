"use client";
import { useState, useEffect } from 'react';
import HomeHeaderTab from '@/components/homefeed/HomeHeaderTab';
import ReelsSlider from '@/components/homefeed/ReelsSlider';
import FriendsSlidder from '@/components/homefeed/FriendsSlidder';
import CreatePostBox from '@/components/homefeed/CreatePostBox';
import PostCard from '@/components/homefeed/PostCard';
import AddSlider from '@/components/homefeed/AddSlider';
import BottomTab from '@/components/homefeed/BottomTab';
import { supabase } from '@/lib/supabase';

export default function HomeFeedPage() {
  const [activeTab, setActiveTab] = useState<any>('retail');
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(50);
    if (data) {
      const ids = [...new Set(data.map((p: any) => p.user_id))];
      if (ids.length > 0) {
        const { data: profs } = await supabase.from('profiles').select('id, username, full_name, avatar_url').in('id', ids);
        const merged = data.map((p: any) => ({ ...p, profiles: profs?.find((pr: any) => pr.id === p.user_id) }));
        setPosts(merged);
      } else setPosts(data);
    }
  };
  useEffect(() => { fetchPosts(); }, [refreshKey]);

  return (
    <div className="w-full min-h-screen bg-[#F6F1E8] overflow-x-hidden">
      {/* Header bhi same width me */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[680px]">
          <HomeHeaderTab activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Reels ko bhi same width me */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[680px]">
          <ReelsSlider />
        </div>
      </div>

      {/* YE HAI TERA GREEN - RED WALA MAIN CONTAINER */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[680px] px-3 sm:px-4">
          <CreatePostBox activeTab={activeTab} onPostCreated={() => setRefreshKey(k => k + 1)} />
          <FriendsSlidder />

          <div className="pb-[80px] w-full">
            {posts.length === 0 && (
              <div className="text-center py-6 text-[#9C8C73] text-sm">
                No posts yet
                <div className="mt-4">
                  <AddSlider />
                </div>
              </div>
            )}

            {posts.map((p: any, index: number) => (
              <div key={p.id} className="w-full">
                <PostCard post={p} onDeleted={fetchPosts} />
                {(index + 1) % 10 === 0 && <AddSlider />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR - LINK ADDED */}
      <BottomTab />
    </div>
  );
}