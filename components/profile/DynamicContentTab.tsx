"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, Coffee, Hotel, PenTool, Wrench, Newspaper, Video,
  Plus, X, Image as ImgIcon, Trash2, ChevronLeft, ChevronRight
} from 'lucide-react';

type Props = { profileId?: string; limit?: number; offset?: number; hideIfEmpty?: boolean };
type OfferingType = 'retail' | 'cafe' | 'hotel' | 'architect' | 'service' | 'media' | 'vlogger';

const TYPE_CONFIG = {
  retail:    { label: 'Products',  icon: ShoppingBag, btn: 'Buy Now',      priceLabel: 'Our Price', showPrice: true },
  cafe:      { label: 'Menu',      icon: Coffee,      btn: 'Order Now',    priceLabel: 'Price', showPrice: true },
  hotel:     { label: 'Rooms',     icon: Hotel,       btn: 'Book Room',    priceLabel: '/ night', showPrice: true },
  architect: { label: 'Projects',  icon: PenTool,     btn: 'View Project', priceLabel: '', showPrice: false },
  service:   { label: 'Our Expertise',  icon: Wrench,      btn: 'Book now', priceLabel: 'Starting', showPrice: true },
  media:     { label: 'News',      icon: Newspaper,   btn: 'Read More',    priceLabel: '', showPrice: false },
  vlogger:   { label: 'Vlogs',     icon: Video,       btn: 'Watch Now',    priceLabel: '', showPrice: false },
} as const;

export default function DynamicContentTab({ profileId = "", limit, offset = 0, hideIfEmpty = false }: Props) {
  const router = useRouter();
  const [realId, setRealId] = useState<string>(profileId);
  const [isOwner, setIsOwner] = useState(false);
  const [offeringsType, setOfferingsType] = useState<OfferingType>('retail');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', mrp: '', discount: '', description: '', extra: '' });
  const [images, setImages] = useState<(File | null)[]>([null, null, null]);
  const [previews, setPreviews] = useState<string[]>(['', '', '']);
  const [saving, setSaving] = useState(false);
  const fileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Gallery modal
  const [galleryItem, setGalleryItem] = useState<any>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && !profileId) return;
      const id = profileId || user!.id;
      setRealId(id);
      setIsOwner(user?.id === id);

      const { data: profile } = await supabase.from('profiles').select('offerings_type').eq('id', id).single();
      const type = (profile?.offerings_type as OfferingType) || 'retail';
      setOfferingsType(type);

      // Dynamic fetch with limit/offset for infinite logic
      let query = supabase.from('offerings').select('*').eq('user_id', id).eq('type', type).order('created_at', { ascending: false });
      if (typeof limit === 'number') {
        query = query.range(offset, offset + limit - 1);
      }
      const { data: offerings } = await query;
      if (offerings) setItems(offerings);
      setLoading(false);
    })();
  }, [profileId, limit, offset]);

  const calcPrice = (mrp: number, disc: number) => Math.round(mrp - (mrp * disc / 100));
  const handleFile = (idx: number, e: any) => {
    const file = e.target.files?.[0]; if (!file) return;
    const ni = [...images]; ni[idx] = file; setImages(ni);
    const np = [...previews]; np[idx] = URL.createObjectURL(file); setPreviews(np);
  };
  const uploadImage = async (file: File) => {
    const name = `${realId}/${Date.now()}_${Math.random().toString(36).slice(2)}_${file.name}`;
    const { error } = await supabase.storage.from('offerings').upload(name, file);
    if (error) {
      await supabase.storage.from('products').upload(name, file);
      const { data } = supabase.storage.from('products').getPublicUrl(name);
      return data.publicUrl;
    }
    const { data } = supabase.storage.from('offerings').getPublicUrl(name);
    return data.publicUrl;
  };
  const handleSave = async () => {
    if (!form.title) return alert('Title required');
    if (!images[0]) return alert('At least 1 image required');
    setSaving(true);
    try {
      const urls = ['', '', '']; for (let i = 0; i < 3; i++) if (images[i]) urls[i] = await uploadImage(images[i] as File);
      const mrp = Number(form.mrp || 0); const disc = Number(form.discount || 0);
      const { error } = await supabase.from('offerings').insert({
        user_id: realId,
        type: offeringsType,
        title: form.title,
        description: form.description,
        mrp, discount: disc, price: calcPrice(mrp, disc),
        image_url: urls[0], image_url_2: urls[1], image_url_3: urls[2],
        metadata: { extra: form.extra, type: offeringsType }
      });
      if (error) throw error;
      setForm({ title: '', mrp: '', discount: '', description: '', extra: '' });
      setImages([null, null, null]); setPreviews(['', '', '']); setShowAdd(false);
      let q = supabase.from('offerings').select('*').eq('user_id', realId).eq('type', offeringsType).order('created_at', { ascending: false });
      if (typeof limit === 'number') q = q.range(offset, offset + limit - 1);
      const { data } = await q;
      if (data) setItems(data);
    } catch (e: any) { alert(e.message); } finally { setSaving(false); }
  };

  const cfg = TYPE_CONFIG[offeringsType];
  const Icon = cfg.icon;

  if (loading) return <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}><div style={{ width: '100%', maxWidth: '720px', padding: '0 22px', fontFamily: 'Georgia', color: '#8A7D6B', boxSizing: 'border-box' }}>Loading {cfg.label}...</div></div>;

  if (hideIfEmpty && items.length === 0) return null;

  return (
    <div style={{ width: '100%', background: '#F6F1E8', display: 'flex', justifyContent: 'center' }}>
    <div className="dc-wrap">
      <style>{`
        .dc-wrap { width: 100%; max-width: 720px; margin: 14px 0 0; padding: 0 22px 24px 22px; background:#F6F1E8; box-sizing:border-box; overflow:hidden; }
        .dc-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; gap:10px; }
        .dc-title { font-family:Georgia; font-weight:600; font-size:16px; color:#0A0A0A; display:flex; gap:6px; align-items:center; }
        .dc-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; width:100%; box-sizing:border-box; }
        .dc-card { background:#FFF; border:1px solid #E8DCC3; border-radius:14px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05); min-width:0; }
        .dc-img-box { display:grid; grid-template-columns:1.3fr 0.7fr; gap:6px; padding:8px; background:#FFF; cursor:pointer; }
        .dc-img-main { height:148px; border-radius:10px; background-size:cover; background-position:center; background-color:#F6F1E8; }
        .dc-img-side { display:grid; grid-template-rows:1fr 1fr; gap:6px; }
        .dc-img-small { border-radius:10px; background-size:cover; background-position:center; background-color:#F6F1E8; min-height:71px; }
        .dc-info { padding:10px 12px 12px; min-width:0; }
        @media (max-width:480px){ .dc-grid{gap:8px} .dc-img-main{height:132px} }
        @media (max-width:360px){ .dc-grid{grid-template-columns:1fr} .dc-img-main{height:180px} }
        @media (min-width:768px){ .dc-grid{grid-template-columns:repeat(2,1fr); gap:16px} .dc-img-main{height:190px} }
        @media (min-width:1100px){ .dc-grid{grid-template-columns:repeat(3,1fr)} }
        .gallery-overlay{position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9999; display:flex; align-items:center; justify-content:center; padding:16px}
        .gallery-box{width:100%; max-width:600px; background:#F6F1E8; border-radius:16px; overflow:hidden; position:relative}
        .gallery-main{width:100%; height:70vh; max-height:500px; background-size:contain; background-position:center; background-repeat:no-repeat; background-color:#000}
        .gallery-thumbs{display:flex; gap:8px; padding:12px; justify-content:center; background:#FFF}
        .gallery-thumb{width:60px; height:60px; border-radius:8px; background-size:cover; border:2px solid transparent; cursor:pointer}
        .gallery-thumb.active{border-color:#C8A86A}
      `}</style>

      <div className="dc-header">
        <div className="dc-title"><Icon size={18} /> {cfg.label} {typeof limit === 'number' ? <span style={{ fontSize:11, color:'#8A7D6B', fontWeight:400 }}>({offset+1}-{offset+items.length})</span> : null}</div>
        {isOwner && <button onClick={() => setShowAdd(!showAdd)} style={{ height:38, padding:'0 16px', borderRadius:10, border:'1px solid #D9C9A8', background:'#F3EBD9', fontFamily:'Georgia', fontWeight:700, fontSize:13, display:'flex', gap:6, alignItems:'center' }}>{showAdd ? <><X size={14}/> Close</> : <><Plus size={14}/> Add {cfg.label.slice(0,-1)}</>}</button>}
      </div>

      {showAdd && (
        <div style={{ background:'#FFF', border:'1.5px solid #D9C9A8', borderRadius:14, padding:16, marginBottom:16, width:'100%', boxSizing:'border-box' }}>
          <h4 style={{ fontFamily:'Georgia', fontWeight:700, fontSize:14, margin:'0 0 12px' }}>Add {cfg.label.slice(0,-1)} - {offeringsType}</h4>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Title" style={{ height:44, borderRadius:10, border:'1px solid #D9C9A8', padding:'0 14px', width:'100%', boxSizing:'border-box', fontFamily:'Georgia' }} />
            {cfg.showPrice && <div style={{ display:'flex', gap:8 }}><input value={form.mrp} onChange={e=>setForm({...form, mrp:e.target.value})} type="number" placeholder="MRP" style={{ flex:1, height:44, borderRadius:10, border:'1px solid #D9C9A8', padding:'0 14px' }} /><input value={form.discount} onChange={e=>setForm({...form, discount:e.target.value})} type="number" placeholder="Discount %" style={{ flex:1, height:44, borderRadius:10, border:'1px solid #D9C9A8', padding:'0 14px' }} /></div>}
            {form.mrp && form.discount && <div style={{ fontFamily:'Georgia', fontSize:12, fontWeight:700, background:'#F3EBD9', padding:'6px 10px', borderRadius:8 }}>{cfg.priceLabel}: ₹{calcPrice(Number(form.mrp), Number(form.discount))}</div>}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {[0,1,2].map(i=><div key={i} onClick={()=>fileRefs[i].current?.click()} style={{ height:90, borderRadius:10, border:'1.5px dashed #D9C9A8', background: previews[i]?`url(${previews[i]}) center/cover`:'#F6F1E8', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative' }}>{!previews[i]&&<div style={{ textAlign:'center' }}><ImgIcon size={18} color="#8A7D6B"/><div style={{ fontSize:10, fontFamily:'Georgia', color:'#8A7D6B' }}>Angle {i+1}</div></div>}{previews[i]&&<button onClick={e=>{e.stopPropagation(); const ni=[...images]; ni[i]=null; setImages(ni); const np=[...previews]; np[i]=''; setPreviews(np);}} style={{ position:'absolute', top:4, right:4, width:20, height:20, borderRadius:'50%', background:'#2D2415', color:'#FFF', border:'none', display:'flex', alignItems:'center', justifyContent:'center' }}><Trash2 size={10}/></button>}<input ref={fileRefs[i]} type="file" accept="image/*" hidden onChange={e=>handleFile(i,e)} /></div>)}
            </div>
            <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Details" style={{ height:70, borderRadius:10, border:'1px solid #D9C9A8', padding:'10px 12px', width:'100%', boxSizing:'border-box', fontFamily:'Georgia' }} />
            <button onClick={handleSave} disabled={saving} style={{ height:38, width:'100%', borderRadius:10, border:'1px solid #D9C9A8', background:'#F3EBD9', fontWeight:700, fontFamily:'Georgia' }}>{saving?'Saving...':`Save ${cfg.label.slice(0,-1)}`}</button>
          </div>
        </div>
      )}

      <div className="dc-grid">
        {items.map(it => {
          const imgs = [it.image_url, it.image_url_2, it.image_url_3].filter(Boolean);
          return (
            <div key={it.id} className="dc-card">
              <div className="dc-img-box" onClick={() => { setGalleryItem(it); setGalleryIdx(0); }}>
                <div className="dc-img-main" style={{ backgroundImage:`url(${imgs[0]})` }} />
                <div className="dc-img-side">
                  <div className="dc-img-small" style={{ backgroundImage:`url(${imgs[1]||imgs[0]})` }} onClick={e=>{ e.stopPropagation(); setGalleryItem(it); setGalleryIdx(1); }} />
                  <div className="dc-img-small" style={{ backgroundImage:`url(${imgs[2]||imgs[0]})` }} onClick={e=>{ e.stopPropagation(); setGalleryItem(it); setGalleryIdx(2); }} />
                </div>
              </div>
              <div className="dc-info">
                <div style={{ fontFamily:'Georgia', fontWeight:600, fontSize:14, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.title}</div>
                {cfg.showPrice && <div style={{ fontWeight:700, fontSize:14, marginTop:6, fontFamily:'Georgia' }}>{offeringsType==='hotel'?`₹${it.price} ${cfg.priceLabel}`:`${cfg.priceLabel} ₹${it.price}`}</div>}
                <div style={{ fontSize:11, color:'#5A4A35', marginTop:6, lineHeight:1.4, fontFamily:'Georgia', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{it.description}</div>
                <button onClick={()=>{
                  if (offeringsType==='retail' || offeringsType==='cafe' || offeringsType==='hotel' || offeringsType==='service') router.push(`/bookings?type=${offeringsType}&id=${it.id}&owner=${realId}`);
                  else router.push(`/${offeringsType}/${it.id}`);
                }} style={{ marginTop:10, height:36, width:'100%', borderRadius:10, border:'1px solid #D9C9A8', background:'#F3EBD9', fontFamily:'Georgia', fontWeight:700, fontSize:13 }}>{cfg.btn}</button>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && !loading && !hideIfEmpty && (
        <div style={{ textAlign:'center', padding:20, fontFamily:'Georgia', fontSize:12, color:'#8A7D6B' }}>No {cfg.label} in this range</div>
      )}

      {galleryItem && (
        <div className="gallery-overlay" onClick={()=>setGalleryItem(null)}>
          <div className="gallery-box" onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setGalleryItem(null)} style={{ position:'absolute', top:10, right:10, zIndex:2, width:32, height:32, borderRadius:'50%', background:'#FFF', border:'1px solid #D9C9A8', display:'flex', alignItems:'center', justifyContent:'center' }}><X size={16}/></button>
            <div style={{ position:'absolute', top:'50%', left:8, right:8, display:'flex', justifyContent:'space-between', zIndex:2 }}><button onClick={()=>setGalleryIdx(i=>(i-1+3)%3)} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.9)', border:'none', display:'flex', alignItems:'center', justifyContent:'center' }}><ChevronLeft size={20}/></button><button onClick={()=>setGalleryIdx(i=>(i+1)%3)} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.9)', border:'none', display:'flex', alignItems:'center', justifyContent:'center' }}><ChevronRight size={20}/></button></div>
            <div className="gallery-main" style={{ backgroundImage:`url(${[galleryItem.image_url, galleryItem.image_url_2, galleryItem.image_url_3][galleryIdx] || galleryItem.image_url})` }} />
            <div className="gallery-thumbs">{[galleryItem.image_url, galleryItem.image_url_2, galleryItem.image_url_3].filter(Boolean).map((img:string, idx:number)=><div key={idx} className={`gallery-thumb ${galleryIdx===idx?'active':''}`} style={{ backgroundImage:`url(${img})` }} onClick={()=>setGalleryIdx(idx)} />)}</div>
            <div style={{ padding:'12px 16px', background:'#FFF', fontFamily:'Georgia' }}><div style={{ fontWeight:700, fontSize:14 }}>{galleryItem.title} - Angle {galleryIdx+1}</div><div style={{ fontSize:12, color:'#8A7D6B' }}>{cfg.label} • ₹{galleryItem.price}</div></div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}