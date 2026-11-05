"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type RetailProfile = {
  id: string;
  business_name: string;
  deals_with: string | null;
  address: string | null;
  phone: string | null;
  cover_url: string | null;
  created_at: string;
};

type Ad = { id:string; title:string; desc:string; image:string; cta_text:string; cta_link:string; };

const DUMMY_RETAIL: RetailProfile[] = [
  { id: 'r1', business_name: 'City Mart Retail', deals_with: 'Groceries, Daily Needs, Snacks', address: 'HSR Layout, Bangalore', phone: '919876543210', cover_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', created_at: '' },
  { id: 'r2', business_name: 'Fashion Hub', deals_with: 'T-Shirts, Jeans, Footwear', address: 'Indiranagar, Bangalore', phone: '919876543211', cover_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', created_at: '' },
];

const DUMMY_ADS: Ad[] = [
  { id: 'ad1', title: 'Retail Offers Live Today', desc: 'Best deals from Drisyamn stores', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', cta_text: 'Shop Now', cta_link: '/offers' },
  { id: 'ad2', title: 'List Your Store Here', desc: 'Reach 10k+ customers daily', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', cta_text: 'Advertise', cta_link: '/advertise' },
];

export default function RetailPage() {
  const router = useRouter();
  const [data, setData] = useState<RetailProfile[]>(DUMMY_RETAIL);
  const [ads, setAds] = useState<Ad[]>(DUMMY_ADS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, business_name, deals_with, address, phone, cover_url, created_at')
        .eq('business_type', 'retail')
        .not('business_name', 'is', null)
        .order('created_at', { ascending: false });

      if (!error && profiles && profiles.length > 0) {
        const real = profiles as RetailProfile[];
        setData([...real, ...DUMMY_RETAIL]);
      }
      const { data: adData } = await supabase.from('ads').select('*').eq('active', true).eq('page','retail').order('created_at', { ascending: false });
      if (adData && adData.length > 0) {
        setAds(adData.map((a:any)=>({ id:a.id, title:a.title, desc:a.desc, image:a.image, cta_text:a.cta_text, cta_link:a.cta_link })));
      }
      setLoading(false);
    };

    fetchProfiles();

    const channel = supabase
      .channel('retail-profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchProfiles())
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

  return (
    <div style={{ width: '100%', background: '#F6F1E8', minHeight: '100dvh', overflowX: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', padding: '0 12px', boxSizing: 'border-box' }}>
        <style>{`
          *{ box-sizing:border-box; margin:0; padding:0; }
          html,body{ overflow-x:hidden; }
          .hh-top { display:flex; justify-content:space-between; align-items:center; background:#FFFEFB; border:1px solid #E8DCC3; border-radius:12px; padding:10px 10px; margin:10px 0 12px; box-shadow:0 2px 8px rgba(45,36,21,0.06); position:sticky; top:8px; z-index:20; gap:8px; width:100%; min-width:0; overflow:hidden; }
          .hh-logo { font-family:Georgia; font-size:22px; color:#2D2415; flex-shrink:0; white-space:nowrap; cursor:pointer; }
          .hh-nav{ display:flex; gap:14px; flex-shrink:1; min-width:0; justify-content:flex-end; }
          .nav-item{ display:flex; flex-direction:column; align-items:center; font-size:7.5px; color:#6B5A3F; gap:2px; cursor:pointer; min-width:0; flex-shrink:1; }
          .nav-item svg{ width:16px; height:16px; flex-shrink:0; }
          @media (max-width:380px){ .hh-nav{ gap:10px; } .hh-logo{ font-size:20px; } .nav-item{ font-size:7px; } .nav-item svg{ width:14px; height:14px; } .hh-top{ padding:8px 8px; } }
          @media (min-width:600px){ .hh-nav{ gap:32px; } .hh-logo{ font-size:30px; } .nav-item{ font-size:8px; } }
          .hh-title{ padding:2px 0 12px; font-size:20px; font-weight:700; color:#1A1205; font-family:Georgia, serif; display:flex; gap:8px; align-items:center; }
          .subtabs{ display:flex; gap:8px; margin-bottom:4px; }
          .subtab{ padding:6px 14px; border-radius:8px; font-size:12px; font-weight:500; cursor:pointer; background:#E8E0D1; color:#8B7D65; }
          .subtab.active{ background:#fff; color:#2D2415; border:1px solid #E8DCC3; border-bottom:2px solid #C8A86A; }
          .grid{ display:grid; grid-template-columns:1fr; gap:10px; padding:8px 0 30px; width:100%; }
          @media (min-width:600px){ .grid{ grid-template-columns:repeat(2, 1fr); } }
          .card{ background:#FFFEFB; border-radius:12px; padding:10px 10px 12px; border:1px solid #E8DCC3; width:100%; min-width:0; cursor:pointer; }
          .cover{ width:100%; height:160px; object-fit:cover; border-radius:10px; display:block; background:#EDE6D3; }
          .info{ padding:10px 2px 0; min-width:0; }
          .name{ font-size:14px; font-weight:600; color:#2D2415; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
          .row{ display:flex; gap:6px; margin-top:6px; font-size:12px; color:#4A3E2F; min-width:0; }
          .row span:last-child{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0; }
          .label{ color:#8B7D65; min-width:60px; font-size:11px; flex-shrink:0; }
          .btn-row{ display:flex; gap:10px; margin-top:10px; }
          .btn{ flex:1; height:38px; border-radius:12px; background:#fff; border:1px solid #E8DCC3; color:#6B5A3F; font-size:13px; font-weight:500; display:flex; align-items:center; justify-content:center; cursor:pointer; text-decoration:none; }
          .ad-card{ grid-column:1 / -1; background:#fff; border:1px dashed #E8DCC3; border-radius:12px; padding:10px; display:flex; gap:12px; align-items:center; min-width:0; }
          .ad-img{ width:80px; height:80px; border-radius:10px; object-fit:cover; flex-shrink:0; }
          .ad-info{ flex:1; min-width:0; }
          .ad-badge{ font-size:8px; background:#2D2415; color:#fff; padding:2px 6px; border-radius:4px; display:inline-block; margin-bottom:4px; }
          .ad-title{ font-size:14px; font-weight:700; color:#1A1205; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
          .ad-desc{ font-size:11px; color:#6B5A3F; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
          .ad-cta{ background:#E53935; color:#fff; border:none; border-radius:8px; padding:10px 16px; font-size:12px; font-weight:700; cursor:pointer; flex-shrink:0; }
        `}</style>

        <div className="hh-top">
          <div className="hh-logo" onClick={() => router.push('/homefeed')}>Drisyamn</div>
          <div className="hh-nav">
            <div className="nav-item" onClick={() => router.push('/homefeed')}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3z"/></svg>Home</div>
            <div className="nav-item" onClick={() => router.push('/homefeed/messages')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 10h8M8 14h4M21 12c0 4-3.5 7-9 7-1 0-2 0-3-.4L3 20l1.5-4.5C3.5 13.9 3 13 3 12c0-5 4-9 9-9s9 4 9 9z"/></svg>Message</div>
            <div className="nav-item" onClick={() => router.push('/homefeed/notifications')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 17h5l-1.5-1.5A6 6 0 0118 12V8a6 6 0 00-12 0v4a6 6 0 01-.5 2.5L4 16h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>Notifications</div>
            <div className="nav-item" onClick={() => router.push('/homefeed/bookings')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>Bookings</div>
          </div>
        </div>

        <div className="hh-title">
          Retail
          <div className="subtabs">
            <div className="subtab active">Retail</div>
            <div className="subtab" onClick={() => router.push('/homefeed/wholesale')}>Wholesale</div>
          </div>
        </div>

        {loading ? <div style={{padding:40, textAlign:'center', color:'#8B7D65'}}>Loading...</div> : (
          <div className="grid">
            {feed.map((item) => 
              item.type === 'ad' ? (
                <div key={item.data.id} className="ad-card">
                  <img src={item.data.image} className="ad-img" alt="" />
                  <div className="ad-info">
                    <div className="ad-badge">AD • Sponsored</div>
                    <div className="ad-title">{item.data.title}</div>
                    <div className="ad-desc">{item.data.desc}</div>
                  </div>
                  <button className="ad-cta" onClick={() => router.push(item.data.cta_link)}>{item.data.cta_text}</button>
                </div>
              ) : (
                <div key={item.data.id} className="card" onClick={() => router.push(`/profile/${item.data.id}`)}>
                  <img src={item.data.cover_url || `https://picsum.photos/seed/${item.data.id}/600/400`} alt={item.data.business_name} className="cover" />
                  <div className="info">
                    <div className="name">{item.data.business_name}</div>
                    <div className="row"><span className="label">Deals —</span><span>{item.data.deals_with || 'No deals added'}</span></div>
                    <div className="row"><span className="label">Address -</span><span>{item.data.address || 'Address not added'}</span></div>
                    <div className="btn-row">
                      <a href={`tel:${item.data.phone}`} onClick={e=>e.stopPropagation()} className="btn">Call</a>
                      <a href={`https://wa.me/${item.data.phone?.replace(/\D/g,'')}`} target="_blank" onClick={e=>e.stopPropagation()} className="btn">WhatsApp</a>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}