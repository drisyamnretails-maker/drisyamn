"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type RetailProfile = {
  id: string;
  business_name: string | null;
  name: string | null;
  full_name: string | null;
  bio: string | null;
  address: string | null;
  phone: string | null;
  cover_url: string | null;
  avatar_url: string | null;
  is_verified: boolean | null;
  created_at: string;
};

type Ad = { id: string; title: string; desc: string; image: string; cta_text: string; cta_link: string; };

export default function ReatilsId({ onSelect }: { onSelect?: (id: string) => void }) {
  const router = useRouter();
  const [data, setData] = useState<RetailProfile[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      // ✅ FIX - offerings_type se fetch, business_type nahi hai ab
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, business_name, name, full_name, bio, address, phone, cover_url, avatar_url, is_verified, created_at')
        .eq('offerings_type', 'retail')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && profiles) {
        setData(profiles as RetailProfile[]);
      }

      // ✅ FIX - ads table ka sahi column: is_active, subtitle, image_url, link_url
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
          cta_link: a.link_url || '/homefeed/retail'
        })));
      }
      setLoading(false);
    };

    fetchProfiles();
    const channel = supabase
      .channel('retail-profiles-slider')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: 'offerings_type=eq.retail' }, () => fetchProfiles())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const feed: any[] = [];
  let adIdx = 0;
  data.forEach((c, i) => {
    feed.push({ type: 'retail', data: c });
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

  // ✅ Agar 0 retail hai to slider hi mat dikhao - khaali slider nahi chahiye
  if (data.length === 0) return null;

  return (
    <div style={{ width: '100vw', maxWidth: '100vw', position: 'relative', left: '50%', transform: 'translateX(-50%)', background: '#F7F4EF', padding: '20px 0 16px 0', boxSizing: 'border-box' }}>
      <style>{`
        .retail-slider { display: flex; gap: 16px; overflow-x: auto; scrollbar-width: none; padding: 6px 14px 14px 14px; scroll-snap-type: x mandatory; }
        .retail-slider::-webkit-scrollbar { display: none; }
        .retail-card { min-width: 288px; width: 288px; background: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06); flex-shrink: 0; cursor: pointer; scroll-snap-align: start; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .retail-card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.08); }
        .retail-cover-wrap { position: relative; width: 100%; height: 168px; overflow: hidden; background: #EDE9E1; }
        .retail-cover { width: 100%; height: 100%; object-fit: cover; display: block; }
        .retail-verified { position: absolute; top: 12px; left: 12px; background: rgba(255,255,255,0.96); backdrop-filter: blur(8px); color: #111111; font-size: 11px; font-weight: 600; letter-spacing: 0.2px; padding: 5px 10px; border-radius: 999px; display: flex; align-items: center; gap: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .retail-body { padding: 16px; }
        .retail-name { font-size: 16px; font-weight: 700; color: #111111; letter-spacing: -0.2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .retail-meta { margin-top: 10px; display: flex; flex-direction: column; gap: 7px; }
        .retail-row { display: flex; gap: 8px; font-size: 13px; line-height: 1.4; color: #555555; }
        .retail-row b { color: #9A9A9A; font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; min-width: 58px; padding-top: 1px; }
        .retail-row span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
        .retail-divider { height: 1px; background: #F0EDE8; margin: 14px 0 0 0; }
        .retail-btn-row { display: flex; gap: 8px; margin-top: 14px; }
        .retail-btn-view { flex: 1.3; height: 42px; border-radius: 999px; background: #5A7A6A; border: none; color: #fff; font-size: 13px; font-weight: 600; letter-spacing: 0.1px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .retail-btn-call { flex: 1; height: 42px; border-radius: 999px; background: #EFF4F0; border: 1px solid #5A7A6A; color: #5A7A6A; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; text-decoration: none; }
        .retail-ad { min-width: 288px; width: 288px; background: #111111; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; flex-shrink: 0; scroll-snap-align: start; }
        .retail-ad-img { width: 100%; height: 168px; object-fit: cover; opacity: 0.92; }
        @media (min-width: 900px) {
          .retail-slider { gap: 18px; padding: 6px 32px 16px 32px; }
          .retail-card, .retail-ad { min-width: 320px; width: 320px; }
          .retail-cover-wrap, .retail-ad-img { height: 184px; }
        }
      `}</style>

      {/* Premium Header */}
      <div style={{ padding: '0 14px 14px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase', color: '#A08C6A' }}>Curated For You</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#111111', letterSpacing: -0.6, marginTop: 6, lineHeight: 1.1, fontFamily: 'Georgia, serif' }}>Retail Stores</div>
          <div style={{ fontSize: 13, color: '#7A7A7A', marginTop: 6, lineHeight: 1.5, maxWidth: 520 }}>
            Discover trusted local stores, explore their collections and connect directly.
          </div>
        </div>
        <div onClick={() => router.push('/homefeed/retail')} style={{ fontSize: 13, fontWeight: 600, color: '#111111', cursor: 'pointer', whiteSpace: 'nowrap', paddingBottom: 4, borderBottom: '1px solid #111111' }}>View All</div>
      </div>

      <div className="retail-slider">
        {feed.map((item) =>
          item.type === 'ad' ? (
            <div key={item.data.id} className="retail-ad">
              <img src={item.data.image} className="retail-ad-img" alt="" />
              <div style={{ padding: '18px' }}>
                <div style={{ fontSize: 10, letterSpacing: 1.8, fontWeight: 700, color: '#A08C6A', textTransform: 'uppercase' }}>Sponsored</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF', marginTop: 8, lineHeight: 1.3 }}>{item.data.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 6, lineHeight: 1.5 }}>{item.data.desc}</div>
                <button onClick={() => router.push(item.data.cta_link)} style={{ marginTop: 16, width: '100%', background: '#5A7A6A', color: '#FFFFFF', border: 'none', borderRadius: 999, padding: '12px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{item.data.cta_text}</button>
              </div>
            </div>
          ) : (
            <div key={item.data.id} className="retail-card" onClick={() => { if (onSelect) onSelect(item.data.id); else router.push(`/profile/${item.data.id}`); }}>
              <div className="retail-cover-wrap">
                <img src={item.data.cover_url || item.data.avatar_url || `https://picsum.photos/seed/${item.data.id}/600/400`} alt={item.data.business_name || item.data.name || 'Store'} className="retail-cover" />
                {item.data.is_verified && (
                  <div className="retail-verified">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5A7A6A', display: 'inline-block' }} />
                    Verified
                  </div>
                )}
              </div>
              <div className="retail-body">
                <div className="retail-name">{item.data.business_name || item.data.name || item.data.full_name || 'Store'}</div>
                <div className="retail-meta">
                  <div className="retail-row"><b>About</b><span>{item.data.bio || '—'}</span></div>
                  <div className="retail-row"><b>Location</b><span>{item.data.address || '—'}</span></div>
                </div>
                <div className="retail-divider" />
                <div className="retail-btn-row">
                  <button onClick={e => { e.stopPropagation(); if (onSelect) onSelect(item.data.id); else router.push(`/profile/${item.data.id}`); }} className="retail-btn-view">View Profile</button>
                  <a href={`tel:${item.data.phone}`} onClick={e => e.stopPropagation()} className="retail-btn-call">Call</a>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}