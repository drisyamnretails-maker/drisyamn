"use client";
import { useState, useEffect, useRef, Suspense } from 'react';
import HeaderTab from '@/components/profile/HeaderTab';
import FriendsGalleryTab from '@/components/profile/FriendsGalleryTab';
import DynamicContentTab from '@/components/profile/DynamicContentTab';
import BannerTab from '@/components/profile/BannerTab';
import ReelTab from '@/components/profile/ReelTab';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const [realId, setRealId] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [visibleLoops, setVisibleLoops] = useState(2); // shuru me 2 loops
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const uid = user?.id || "";
      setRealId(uid);
      if (!uid) return;
      const { data: prof } = await supabase.from('profiles').select('profile_role').eq('id', uid).single();
      setRole(prof?.profile_role || null);
      
      const { count } = await supabase.from('products').select('id', { count: 'exact', head: true }).eq('user_id', uid);
      setProductCount(count || 0);
    })();
  }, []);

  // Infinite scroll - neeche aate hi aur load
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleLoops(v => v + 1);
      }
    }, { threshold: 0.1 });
    if (loaderRef.current) obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, []);

  // Pattern: products 8 -> reels -> products 8 -> banner -> repeat
  const pattern = ['products', 'reels', 'products', 'banner'];

  return (
    <div style={{ background: '#F6F1E8', minHeight: '100dvh', width: '100%', overflowX: 'hidden' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '0 16px' }}>
        <HeaderTab />
        
        <Suspense fallback={<div style={{ padding: 12, fontFamily: 'Georgia' }}>Loading...</div>}>
          <FriendsGalleryTab profileId="" />
        </Suspense>

        {/* INFINITE LOGIC SIRF YAHAN */}
        {Array.from({ length: visibleLoops }).map((_, i) => {
          const type = pattern[i % pattern.length];

          if (type === 'products') {
            // 8 image wala slice
            const offset = Math.floor(i / 2) * 8;
            if (offset >= productCount && productCount > 0) return null;
            return (
              <div key={`p-${i}`}>
                <DynamicContentTab profileId={realId} limit={8} offset={offset} />
              </div>
            );
          }

          if (type === 'reels') {
            return (
              <div key={`r-${i}`}>
                <ReelTab profileId={realId} />
              </div>
            );
          }

          if (type === 'banner') {
            if (role === 'personal') return null;
            return (
              <div key={`b-${i}`}>
                <BannerTab profileId={realId} />
              </div>
            );
          }
          return null;
        })}

        <div ref={loaderRef} style={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia', fontSize: 12, color: '#8A7D6B' }}>
          Scroll for more...
        </div>
      </div>
    </div>
  );
}