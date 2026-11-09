"use client";
import { useState, useEffect, Suspense } from 'react';
import HeaderTab from '@/components/profile/HeaderTab';
import DynamicContentTab from '@/components/profile/DynamicContentTab';
import AboutTab from '@/components/profile/AboutTab';
import FamilyFriendsTab from '@/components/profile/FamilyFriendsTab';
import ReelTab from '@/components/profile/ReelTab';
import { supabase } from '@/lib/supabase';

export default function PersonalProfilePage() {
  const [realId, setRealId] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const uid = user?.id || "";
      setRealId(uid);
      if (!uid) return;

      // Agar galti se koi Business wala is page pe aa gaya, to usko /profile pe bhej do
      const { data: prof } = await supabase
        .from('profiles')
        .select('offerings_type, profile_role')
        .eq('id', uid)
        .single();

      const type = prof?.offerings_type || prof?.profile_role;
      if (type && type !== 'personal') {
        window.location.href = '/profile';
      }
    })();
  }, []);

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100dvh', width: '100%', overflowX: 'hidden' }}>

      {/* Header + Cover - Same */}
      <HeaderTab />

      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '0 16px' }}>

        {/* 1. Posts - Personal ke posts */}
        <DynamicContentTab profileId={realId} limit={8} offset={0} />

        {/* 2. About / Story - Same */}
        <AboutTab profileId={realId} />

        {/* 3. Family & Friends - Same */}
        <FamilyFriendsTab profileId={realId} />

        {/* 4. Reels - Same */}
        <Suspense fallback={<div style={{ padding: 12 }}>Loading...</div>}>
          <ReelTab profileId={realId} />
        </Suspense>

        {/* ❌ HATA DIYA - Personal me ye nahi chahiye */}
        {/* <AmenitiesTab /> */}
        {/* <FooterTab /> - Booking / Map / Contact wala footer */}

      </div>
    </div>
  );
}