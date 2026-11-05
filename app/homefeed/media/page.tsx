"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Profile = { id:string; business_name:string; facility:string; address:string; phone:string; cover_url:string; business_type:string; };
type Ad = { id:string; title:string; desc:string; image:string; cta_text:string; cta_link:string; };

const DUMMY: Profile[] = [
  { id:'m1', business_name:'RK Photography Studio', facility:'Wedding, Pre-Wedding, Events', address:'HSR Layout', phone:'919876543210', cover_url:'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800', business_type:'photographer' },
  { id:'m2', business_name:'Visual Cuts Editor', facility:'Video Editing, Reels, Ads', address:'Koramangala', phone:'919876543211', cover_url:'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44a?w=800', business_type:'video editor' },
];

const ADS: Ad[] = [
  { id:'ad1', title:'Need Media Expert?', desc:'Photographers & Editors on Drisyamn', image:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800', cta_text:'Book Now', cta_link:'/offers' },
];

export default function MediaPage() {
  const router = useRouter();
  const [list, setList] = useState<Profile[]>(DUMMY);

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, business_name, facility, deals_with, address, phone, cover_url, business_type')
        .in('business_type', ['media','photographer','videographer','editor','studio','photography','videography','video editor','photo studio'])
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (data && data.length > 0) {
        const real = data.map((d:any)=>({
          id:d.id, 
          business_name:d.business_name||'No Name',
          facility:d.facility||d.deals_with||'Media Service',
          address:d.address||'No address', 
          phone:d.phone||'', 
          cover_url:d.cover_url||'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800', 
          business_type:d.business_type||'media'
        }));
        // Agar DB me media wale kam hai to dummy bhi dikhega, warna sirf real
        setList(data.length > 2 ? real : [...real, ...DUMMY]);
      }
    };

    fetchAll();

    // SAME REALTIME LOGIC
    const channel = supabase
      .channel('profiles-media')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'profiles' }, 
        (payload) => {
          const n = payload.new as any;
          const type = (n.business_type||'').toLowerCase();
          // Sirf media wale profiles ko yaha add karo
          if(['media','photo','video','editor','studio'].some(k => type.includes(k))){
            const formatted: Profile = {
              id: n.id,
              business_name: n.business_name || 'No Name',
              facility: n.facility || n.deals_with || 'Media Service',
              address: n.address || 'No address',
              phone: n.phone || '',
              cover_url: n.cover_url || '',
              business_type: n.business_type || 'media'
            };
            setList(prev => [formatted, ...prev]);
          }
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        (payload) => {
          const updated = payload.new as any;
          setList(prev => prev.map(p => p.id === updated.id ? {
            ...p,
            business_name: updated.business_name,
            facility: updated.facility || updated.deals_with,
            address: updated.address,
            phone: updated.phone,
            cover_url: updated.cover_url,
            business_type: updated.business_type
          } : p));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const feed:any[] = [];
  let adIdx = 0;
  list.forEach((c,i)=>{
    feed.push({ type:'profile', data:c });
    if((i+1)%2===0 && adIdx < ADS.length){
      feed.push({ type:'ad', data:ADS[adIdx] }); adIdx++;
    }
  });

  return (
    <div style={{ width:'100%', background:'#F6F1E8', minHeight:'100dvh', overflowX:'hidden' }}>
      <div style={{ width:'100%', maxWidth:'720px', margin:'0 auto', padding:'0 12px', boxSizing:'border-box' }}>
        <style>{`
          *{ box-sizing:border-box; margin:0; padding:0; }
          html,body{ overflow-x:hidden; }
          .hh-top { 
            display:flex; 
            justify-content:space-between; 
            align-items:center; 
            background:#FFFEFB; 
            border:1px solid #E8DCC3; 
            border-radius:12px; 
            padding:12px 16px; 
            margin:10px 0 12px; 
            box-shadow:0 2px 8px rgba(45,36,21,0.06); 
            position:sticky; 
            top:8px; 
            z-index:20; 
            gap:12px; 
            width:100%; 
          }
          .hh-logo { font-family:Georgia; font-size:22px; color:#2D2415; white-space:nowrap; cursor:pointer; padding-left:2px; }
          .hh-nav{ display:flex; gap:22px; align-items:center; padding-right:4px; }
          .nav-item{ display:flex; flex-direction:column; align-items:center; font-size:8px; color:#6B5A3F; gap:3px; cursor:pointer; min-width:36px; }
          .nav-item svg{ width:18px; height:18px; flex-shrink:0; }
          @media (max-width:380px){
            .hh-top{ padding:10px 12px; }
            .hh-nav{ gap:16px; padding-right:2px; }
            .hh-logo{ font-size:20px; }
            .nav-item{ min-width:30px; font-size:7px; }
            .nav-item svg{ width:16px; height:16px; }
          }
          @media (min-width:600px){
            .hh-top{ padding:14px 20px; }
            .hh-nav{ gap:30px; padding-right:6px; }
            .hh-logo{ font-size:28px; }
            .nav-item{ min-width:42px; font-size:8.5px; }
          }
          .hh-title{ padding:2px 0 12px; font-size:20px; font-weight:700; color:#1A1205; font-family:Georgia, serif; }
          .grid{ display:grid; grid-template-columns:1fr; gap:10px; padding:2px 0 30px; }
          @media (min-width:600px){ .grid{ grid-template-columns:repeat(2, 1fr); } }
          .card{ background:#FFFEFB; border-radius:12px; padding:10px 10px 12px; border:1px solid #E8DCC3; animation: fadeIn 0.3s; }
          @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
          .cover{ width:100%; height:160px; object-fit:cover; border-radius:10px; display:block; }
          .info{ padding:10px 2px 0; }
          .name{ font-size:14px; font-weight:600; color:#2D2415; display:flex; justify-content:space-between; gap:8px; }
          .name span:first-child{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
          .badge{ font-size:9px; background:#2D2415; color:#fff; padding:2px 6px; border-radius:6px; text-transform:capitalize; flex-shrink:0; }
          .row{ display:flex; gap:6px; margin-top:6px; font-size:12px; color:#4A3E2F; }
          .label{ color:#8B7D65; min-width:65px; font-size:11px; flex-shrink:0; }
          .btn-row{ display:flex; gap:10px; margin-top:10px; }
          .btn{ flex:1; height:38px; border-radius:12px; background:#fff; border:1px solid #E8DCC3; color:#6B5A3F; font-size:13px; font-weight:500; display:flex; align-items:center; justify-content:center; cursor:pointer; }
          .ad-card{ grid-column:1 / -1; background:#fff; border:1px dashed #E8DCC3; border-radius:12px; padding:10px; display:flex; gap:12px; align-items:center; }
          .ad-img{ width:80px; height:80px; border-radius:10px; object-fit:cover; }
          .ad-info{ flex:1; min-width:0; }
          .ad-badge{ font-size:8px; background:#2D2415; color:#fff; padding:2px 6px; border-radius:4px; display:inline-block; margin-bottom:4px; }
          .ad-title{ font-size:14px; font-weight:700; color:#1A1205; }
          .ad-desc{ font-size:11px; color:#6B5A3F; margin-top:2px; }
          .ad-cta{ background:#E53935; color:#fff; border:none; border-radius:8px; padding:10px 16px; font-size:12px; font-weight:700; cursor:pointer; }
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

        <div className="hh-title">Media Services</div>

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
                  <div className="name"><span>{item.data.business_name}</span><span className="badge">{item.data.business_type}</span></div>
                  <div className="row"><span className="label">Portfolio -</span><span>{item.data.facility}</span></div>
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