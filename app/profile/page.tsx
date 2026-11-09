"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import HeaderTab from '@/components/profile/HeaderTab';
import DynamicContentTab from '@/components/profile/DynamicContentTab';
import AboutTab from '@/components/profile/AboutTab';
import AmenitiesTab from '@/components/profile/AmenitiesTab';
import FamilyFriendsTab from '@/components/profile/FamilyFriendsTab';
import ReelTab from '@/components/profile/ReelTab';
import FooterTab from '@/components/profile/FooterTab';
import { supabase } from '@/lib/supabase';

type AllType = 'personal' | 'retail' | 'cafe' | 'hotel' | 'architect' | 'service' | 'media' | 'vlogger';

export default function ProfilePage() {
  const router = useRouter();
  const [realId, setRealId] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [offeringsType, setOfferingsType] = useState<AllType | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // 1. Login check
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login');
        return;
      }
      const uid = user.id;
      setRealId(uid);

      // 2. Profile fetch - profile_role + offerings_type dono
      const { data: prof, error } = await supabase
        .from('profiles')
        .select('profile_role, offerings_type')
        .eq('id', uid)
        .single();

      // 3. Profile bana hi nahi hai -> create pe bhejo
      if (error || !prof) {
        router.replace('/profile/create');
        return;
      }

      const type = (prof.offerings_type || prof.profile_role) as AllType;

      // 4. ✅ MAIN GUARD - Personal wala yaha nahi reh sakta
      if (type === 'personal' || prof.profile_role === 'personal') {
        router.replace('/personalprofile');
        return;
      }

      setRole(prof?.profile_role || null);
      setOfferingsType((prof?.offerings_type as AllType) || null);

      const { count } = await supabase.from('products').select('id', { count: 'exact', head: true }).eq('user_id', uid);
      setProductCount(count || 0);
      setLoading(false);
    })();
  }, [router]);

  // 5. Realtime - Agar create page se type Personal kar diya to auto /personalprofile pe chala jayega
  useEffect(() => {
    if (!realId) return;
    const channel = supabase
      .channel(`profile-${realId}`)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${realId}` },
        (payload) => {
          const updated = payload.new as any;
          setRole(updated.profile_role);
          setOfferingsType(updated.offerings_type);
          const type = updated.offerings_type || updated.profile_role;
          if (type === 'personal') {
            router.replace('/personalprofile');
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [realId, router]);

  // ===== TYPE SE LOGIC - Jo create me select kiya, wahi yaha dikhega =====
  // Yaha Personal kabhi nahi ayega, wo /personalprofile pe chala jayega
  const isCreator = offeringsType === 'media' || offeringsType === 'vlogger' || role === 'creator';
  const isBusiness = !isCreator;
  // Business = retail / cafe / hotel / architect / service
  // Creator = media / vlogger

  if (loading) {
    return (
      <div style={{ background: '#FFFFFF', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700 }}>Tasomi</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 8 }}>Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100dvh', width: '100%', overflowX: 'hidden' }}>

      {/* ===== HEADER + COVER - FULL WIDTH - Sabko dikhega ===== */}
      <HeaderTab />

      {/* ===== BAAKI CONTENT - 800px ME RAHEGA ===== */}
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: '0 16px' }}>

        {/* 1. Our Rooms / Products / Posts - Business + Creator dono ko dikhega */}
        <DynamicContentTab profileId={realId} limit={8} offset={0} />

        {/* 2. About Us / Our Story / Why Choose Us - Sabko dikhega */}
        <AboutTab profileId={realId} />

        {/* 3. Amenities - SIRF Business ko dikhega (Cafe / Hotel / Retail / Architect / Service) */}
        {/* Media/Vlogger ko Amenities ka koi matlab nahi */}
        {isBusiness && (
          <AmenitiesTab profileId={realId} />
        )}

        {/* 4. Family & Friends - Sabko dikhega */}
        <FamilyFriendsTab profileId={realId} />

        {/* 5. Reels - Sabko dikhega - Vlogger/Media ke liye sabse important */}
        <Suspense fallback={<div style={{ padding: 12, fontFamily: 'Inter, sans-serif' }}>Loading...</div>}>
          <ReelTab profileId={realId} />
        </Suspense>

        {/* 6. Footer - Contact + Map + Booking + Green Footer */}
        {/* SIRF Business ko dikhega - Creator ko nahi */}
        {isBusiness && <FooterTab profileId={realId} />}

      </div>
    </div>
  );
}