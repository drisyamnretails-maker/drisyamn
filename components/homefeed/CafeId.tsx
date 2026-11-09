"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Cafe = {
  id: string;
  business_name: string | null;
  name: string | null;
  full_name: string | null;
  bio: string | null;
  facilities: string[] | null;
  amenities: string[] | null;
  address: string | null;
  phone: string | null;
  cover_url: string | null;
  avatar_url: string | null;
  is_verified: boolean | null;
};
type Ad = { id: string; title: string; desc: string; image: string; cta_text: string; cta_link: string; };

export default function CafeId({ onSelect }: { onSelect?: (id: string) => void }) {
  const router = useRouter();
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCafes = async () => {
      // ✅ FIX - offerings_type + facilities array
      const { data: cafeData, error } = await supabase
        .from('profiles')
        .select('id, business_name, name, full_name, bio, facilities, amenities, address, phone, cover_url, avatar_url, is_verified')
        .eq('offerings_type', 'cafe')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && cafeData) {
        setCafes(cafeData as Cafe[]);
      }

      // ✅ FIX - ads sahi columns
      const { data: adData } = await supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (adData && adData.length > 0) {
        setAds(adData.map((a: any) => ({
          id: a.id,
          title: a.title,
          desc: a.subtitle || '',
          image: a.image_url || '',
          cta_text: 'View Now',
          cta_link: a.link_url || '/homefeed/cafe'
        })));
      }
      setLoading(false);
    };

    fetchCafes();
    const channel = supabase
      .channel('cafe-profiles-slider')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: 'offerings_type=eq.cafe' }, () => fetchCafes())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const feed: any[] = [];
  let adIdx = 0;
  cafes.forEach((c, i) => {
    feed.push({ type: 'cafe', data: c });
    if ((i + 1) % 2 === 0 && adIdx < ads.length) {
      feed.push({ type: 'ad', data: ads[adIdx] });
      adIdx++;
    }
  });

  if (loading) {
    return (
      <div style={{ width: '100vw', maxWidth: '100vw', position: 'relative', left: '50%', transform: 'translateX(-50%)', background: '#F7F4EF', padding: '0 32px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: 16, overflow: 'hidden', padding: '12px 0' }}>
          {[1, 2, 3, 4].map(i => <div key={i} style={{ width: 300, height: 320, background: '#EDE9E1', borderRadius: 20, flexShrink: 0 }} />)}
        </div>
      </div>
    );
  }

  // ✅ 0 cafe hai to slider chhup jayega
  if (cafes.length === 0) return null;

  return (
    <div style={{ width: '100vw', maxWidth: '100vw', position: 'relative', left: '50%', transform: 'translateX(-50%)', background: '#F7F4EF', padding: '20px 0 16px 0', boxSizing: 'border-box' }}>
      <style>{`
        .cafe-slider { display: flex; gap: 16px; overflow-x: auto; scrollbar-width: none; padding: 6px 14px 14px 14px; scroll-snap-type: x mandatory; }
        .cafe-slider::-webkit-scrollbar { display: none; }
        .cafe-card { min-width: 288px; width: 288px; background: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06); flex-shrink: 0; cursor: pointer; scroll-snap-align: start; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .cafe-card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.08); }
        .cafe-cover-wrap { position: relative; width: 100%; height: 168px; overflow: hidden; background: #EDE9E1; }
        .cafe-cover { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cafe-verified { position: absolute; top: 12px; left: 12px; background: rgba(255,255,255,0.96); backdrop-filter: blur(8px); color: #111111; font-size: 11px; font-weight: 600; letter-spacing: 0.2px; padding: 5px 10px; border-radius: 999px; display: flex; align-items: center; gap: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .cafe-body { padding: 16px; }
        .cafe-name { font-size: 16px; font-weight: 700; color: #111111; letter-spacing: -0.2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .cafe-meta { margin-top: 10px; display: flex; flex-direction: column; gap: 7px; }
        .cafe-row { display: flex; gap: 8px; font-size: 13px; line-height: 1.4; color: #555555; }
        .cafe-row b { color: #9A9A9A; font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; min-width: 58px; padding-top: 1px; }
        .cafe-row span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
        .cafe-divider { height: 1px; background: #F0EDE8; margin: 14px 0 0 0; }
        .cafe-btn-row { display: flex; gap: 8px; margin-top: 14px; }
        .cafe-btn-view { flex: 1.3; height: 42px; border-radius: 999px; background: #5A7A6A; border: none; color: #fff; font-size: 13px; font-weight: 600; letter-spacing: 0.1px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .cafe-btn-call { flex: 1; height: 42px; border-radius: 999px; background: #EFF4F0; border: 1px solid #5A7A6A; color: #5A7A6A; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; text-decoration: none; }
        .cafe-ad { min-width: 288px; width: 288px; background: #111111; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; flex-shrink: 0; scroll-snap-align: start; }
        .cafe-ad-img { width: 100%; height: 168px; object-fit: cover; opacity: 0.92; }
        @media (min-width: 900px) {
          .cafe-slider { gap: 18px; padding: 6px 32px 16px 32px; }
          .cafe-card, .cafe-ad { min-width: 320px; width: 320px; }
          .cafe-cover-wrap, .cafe-ad-img { height: 184px; }
        }
      `}</style>

      <div style={{ padding: '0 14px 14px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase', color: '#A08C6A' }}>Curated For You</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#111111', letterSpacing: -0.6, marginTop: 6, lineHeight: 1.1, fontFamily: 'Georgia, serif' }}>Cafes</div>
          <div style={{ fontSize: 13, color: '#7A7A7A', marginTop: 6, lineHeight: 1.5, maxWidth: 520 }}>
            Discover cozy cafes nearby, explore their menu and connect directly.
          </div>
        </div>
        <div onClick={() => router.push('/homefeed/cafe')} style={{ fontSize: 13, fontWeight: 600, color: '#111111', cursor: 'pointer', whiteSpace: 'nowrap', paddingBottom: 4, borderBottom: '1px solid #111111' }}>View All</div>
      </div>

      <div className="cafe-slider">
        {feed.map((item) =>
          item.type === 'ad' ? (
            <div key={item.data.id} className="cafe-ad">
              <img src={item.data.image} className="cafe-ad-img" alt="" />
              <div style={{ padding: '18px' }}>
                <div style={{ fontSize: 10, letterSpacing: 1.8, fontWeight: 700, color: '#A08C6A', textTransform: 'uppercase' }}>Sponsored</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF', marginTop: 8, lineHeight: 1.3 }}>{item.data.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 6, lineHeight: 1.5 }}>{item.data.desc}</div>
                <button onClick={() => router.push(item.data.cta_link)} style={{ marginTop: 16, width: '100%', background: '#5A7A6A', color: '#FFFFFF', border: 'none', borderRadius: 999, padding: '12px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{item.data.cta_text}</button>
              </div>
            </div>
          ) : (
            <div key={item.data.id} className="cafe-card" onClick={() => { if (onSelect) onSelect(item.data.id); else router.push(`/profile/${item.data.id}`); }}>
              <div className="cafe-cover-wrap">
                <img src={item.data.cover_url || item.data.avatar_url || `https://picsum.photos/seed/${item.data.id}/600/400`} alt={item.data.business_name || item.data.name || 'Cafe'} className="cafe-cover" />
                {item.data.is_verified && (
                  <div className="cafe-verified">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5A7A6A', display: 'inline-block' }} />
                    Verified
                  </div>
                )}
              </div>
              <div className="cafe-body">
                <div className="cafe-name">{item.data.business_name || item.data.name || item.data.full_name || 'Cafe'}</div>
                <div className="cafe-meta">
                  <div className="cafe-row"><b>Facility</b><span>{item.data.facilities?.join(', ') || item.data.bio || '—'}</span></div>
                  <div className="cafe-row"><b>Location</b><span>{item.data.address || '—'}</span></div>
                </div>
                <div className="cafe-divider" />
                <div className="cafe-btn-row">
                  <button onClick={e => { e.stopPropagation(); if (onSelect) onSelect(item.data.id); else router.push(`/profile/${item.data.id}`); }} className="cafe-btn-view">View Profile</button>
                  <a href={`tel:${item.data.phone}`} onClick={e => e.stopPropagation()} className="cafe-btn-call">Call</a>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}