"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Hotel = { id:string; business_name:string; facility:string; address:string; phone:string; cover_url:string; };
type Ad = { id:string; title:string; desc:string; image:string; cta_text:string; cta_link:string; };

const DUMMY_HOTELS: Hotel[] = [
  { id: 'h1', business_name: 'The Grand Palace Hotel', facility: 'AC, Wifi, Pool, Restaurant, Parking', address: 'MG Road, Bangalore', phone: '919876543210', cover_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
  { id: 'h2', business_name: 'Royal Stay Inn', facility: 'Deluxe Rooms, Breakfast, Gym, Bar', address: 'Koramangala, Bangalore', phone: '919876543211', cover_url: 'https://images.unsplash.com/photo-1551882547-b79c4677e858?w=800' },
  { id: 'h3', business_name: 'City Comfort Hotel', facility: 'AC, Wifi, Room Service, Lift', address: 'Indiranagar, Bangalore', phone: '919876543212', cover_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800' },
  { id: 'h4', business_name: 'Lake View Residency', facility: 'Lake View, Family Rooms, AC, Restaurant', address: 'HSR Layout, Bangalore', phone: '919876543213', cover_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800' },
];

const DUMMY_ADS: Ad[] = [
  { id: 'ad1', title: 'Book Hotel @ 30% OFF Today', desc: 'Best deals on Drisyamn hotels', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', cta_text: 'Book Now', cta_link: '/offers' },
  { id: 'ad2', title: 'List Your Hotel Here', desc: 'Get 10k+ bookings monthly', image: 'https://images.unsplash.com/photo-1551882547-b79c4677e858?w=800', cta_text: 'Advertise', cta_link: '/advertise' },
];

export default function HotelPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>(DUMMY_HOTELS);
  const [ads, setAds] = useState<Ad[]>(DUMMY_ADS);

  useEffect(() => {
    (async () => {
      const { data: hotelData } = await supabase.from('profiles').select('id, business_name, facility, deals_with, address, phone, cover_url').eq('business_type', 'hotel').order('created_at', { ascending: false });
      if (hotelData && hotelData.length > 0) {
        const real = hotelData.map((d:any)=>({ id:d.id, business_name:d.business_name, facility:d.facility||d.deals_with||'AC, Wifi, Restaurant', address:d.address||'No address', phone:d.phone||'', cover_url:d.cover_url||'' }));
        setHotels([...real, ...DUMMY_HOTELS]);
      }
      const { data: adData } = await supabase.from('ads').select('*').eq('active', true).eq('page','hotel').order('created_at', { ascending: false });
      if (adData && adData.length > 0) {
        setAds(adData.map((a:any)=>({ id:a.id, title:a.title, desc:a.desc, image:a.image, cta_text:a.cta_text, cta_link:a.cta_link })));
      }
    })();
  }, []);

  const feed: any[] = [];
  let adIdx = 0;
  hotels.forEach((c, i) => {
    feed.push({ type: 'hotel', data: c });
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
          .hh-title{ padding:2px 0 12px; font-size:20px; font-weight:700; color:#1A1205; font-family:Georgia, serif; }
          .grid{ display:grid; grid-template-columns:1fr; gap:10px; padding:2px 0 30px; width:100%; }
          @media (min-width:600px){ .grid{ grid-template-columns:repeat(2, 1fr); } }
          .card{ background:#FFFEFB; border-radius:12px; padding:10px 10px 12px; border:1px solid #E8DCC3; width:100%; min-width:0; }
          .cover{ width:100%; height:160px; object-fit:cover; border-radius:10px; display:block; }
          .info{ padding:10px 2px 0; min-width:0; }
          .name{ font-size:14px; font-weight:600; color:#2D2415; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
          .row{ display:flex; gap:6px; margin-top:6px; font-size:12px; color:#4A3E2F; min-width:0; }
          .row span:last-child{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0; }
          .label{ color:#8B7D65; min-width:60px; font-size:11px; flex-shrink:0; }
          .btn-row{ display:flex; gap:10px; margin-top:10px; }
          .btn{ flex:1; height:38px; border-radius:12px; background:#fff; border:1px solid #E8DCC3; color:#6B5A3F; font-size:13px; font-weight:500; display:flex; align-items:center; justify-content:center; cursor:pointer; }
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

        <div className="hh-title">Hotels</div>

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
              <div key={item.data.id} className="card">
                <img src={item.data.cover_url} alt="" className="cover" />
                <div className="info">
                  <div className="name">{item.data.business_name}</div>
                  <div className="row"><span className="label">Facility -</span><span>{item.data.facility}</span></div>
                  <div className="row"><span className="label">Address -</span><span>{item.data.address}</span></div>
                  <div className="btn-row">
                    <div className="btn" onClick={() => window.location.href = `tel:${item.data.phone}`}>Call</div>
                    <div className="btn" onClick={() => window.open(`https://wa.me/${item.data.phone.replace(/\D/g,'')}`, '_blank')}>WhatsApp</div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}