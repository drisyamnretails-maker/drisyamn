"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Edit3, Plus, X, Trash2, Image as ImgIcon, ExternalLink, ChevronLeft, ChevronRight, Palette } from 'lucide-react';

type Banner = {
  id: string;
  user_id: string;
  image_url: string;
  h1?: string; h2?: string; h3?: string; about?: string; link?: string;
  h1_color?: string; h2_color?: string; h3_color?: string; about_color?: string;
};

export default function BannerTab({ profileId = "" }: { profileId?: string }) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [realId, setRealId] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState<Banner | null>(null);
  const [form, setForm] = useState({ h1: '', h2: '', h3: '', about: '', link: '', h1_color: '#F3EBD9', h2_color: '#FFFFFF', h3_color: '#F6F1E8', about_color: '#E8DCC3' });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchBanners = async (uid: string) => {
    const { data } = await supabase.from('banners').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(3);
    if (data) setBanners(data);
  };
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const uid = profileId || user?.id || "";
      setRealId(uid); setIsOwner(user?.id === uid);
      if (!uid) { setLoading(false); return; }
      const { data: profile } = await supabase.from('profiles').select('profile_role').eq('id', uid).single();
      setRole(profile?.profile_role || null);
      if (profile?.profile_role === 'business' || profile?.profile_role === 'creator') await fetchBanners(uid);
      setLoading(false);
    })();
  }, [profileId]);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const idx = Math.round(sliderRef.current.scrollLeft / sliderRef.current.clientWidth);
    setCurrent(idx);
  };
  const scroll = (dir: 'left' | 'right') => {
    const next = dir === 'left' ? Math.max(0, current - 1) : Math.min(banners.length - 1, current + 1);
    setCurrent(next);
    sliderRef.current?.scrollTo({ left: next * sliderRef.current.clientWidth, behavior: 'smooth' });
  };

  if (loading) return null;
  if (role === 'personal' || role === null) return null;

  const openAdd = () => {
    if (banners.length >= 3) return alert('Max 3 banners');
    setEditData(null);
    setForm({ h1: '', h2: '', h3: '', about: '', link: '', h1_color: '#F3EBD9', h2_color: '#FFFFFF', h3_color: '#F6F1E8', about_color: '#E8DCC3' });
    setFile(null); setPreview(""); setShowEdit(true);
  };
  const openEdit = (b: Banner) => {
    setEditData(b);
    setForm({ h1: b.h1 || '', h2: b.h2 || '', h3: b.h3 || '', about: b.about || '', link: b.link || '', h1_color: b.h1_color || '#F3EBD9', h2_color: b.h2_color || '#FFFFFF', h3_color: b.h3_color || '#F6F1E8', about_color: b.about_color || '#E8DCC3' });
    setPreview(b.image_url); setFile(null); setShowEdit(true);
  };
  const uploadImage = async (f: File) => {
    const name = `${realId}/${Date.now()}_${f.name}`;
    const { error } = await supabase.storage.from('banners').upload(name, f);
    if (error) {
      await supabase.storage.from('products').upload(name, f);
      const { data } = supabase.storage.from('products').getPublicUrl(name);
      return data.publicUrl;
    }
    const { data } = supabase.storage.from('banners').getPublicUrl(name);
    return data.publicUrl;
  };
  const handleSave = async () => {
    if (!editData && !file) return alert('Image required');
    if (!form.h2) return alert('H2 required');
    setSaving(true);
    try {
      let url = editData?.image_url || "";
      if (file) url = await uploadImage(file);
      const payload = { image_url: url, ...form };
      if (editData) await supabase.from('banners').update(payload).eq('id', editData.id);
      else await supabase.from('banners').insert({ user_id: realId, ...payload });
      setShowEdit(false); await fetchBanners(realId);
    } catch (e: any) { alert(e.message); } finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    await supabase.from('banners').delete().eq('id', id);
    setBanners(b => b.filter(x => x.id !== id));
  };

  return (
    <div style={{ width: '100%', background: '#F6F1E8', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '720px', boxSizing: 'border-box', paddingBottom: 6 }}>
        <style>{`
          .bn-header { display:flex; justify-content:space-between; align-items:center; margin: 12px 0 6px 0; padding: 0 22px; }
          .bn-title { font-family: Georgia; font-weight: 600; font-size: 16px; }
          .bn-outer { margin: 0 16px; border-radius: 14px; padding: 2px; background: linear-gradient(135deg, #C8A86A 0%, #F3EBD9 25%, #B89B5E 50%, #E8DCC3 75%, #C8A86A 100%); box-shadow: 0 4px 18px rgba(200,168,106,0.35), 0 0 12px rgba(200,168,106,0.25) inset; }
          .bn-slider { display:flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; width:100%; border-radius: 12px; background:#000; }
          .bn-slider::-webkit-scrollbar { display: none; }
          .bn-card { min-width: 100%; max-width: 100%; height: 165px; position: relative; scroll-snap-align: start; flex-shrink: 0; }
          @media (max-width: 480px){ .bn-card { height: 145px; } }
          .bn-bg { position: absolute; inset: 0; background-size: cover; background-position: center; }
          .bn-grad { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.38) 58%, rgba(0,0,0,0.05) 100%); }
          
          /* YAHAN GAP FIX HAI */
          .bn-content { position: absolute; inset: 0; padding: 16px 20px; display: flex; flex-direction: column; justify-content: center; z-index: 1; max-width: 70%; gap: 6px; }
          .bn-h1 { font-family: Georgia; font-size: 10px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; line-height: 1.2; margin-bottom: 2px; }
          .bn-h2 { font-family: Georgia; font-size: 20px; font-weight: 800; line-height: 1.15; margin-bottom: 2px; }
          .bn-h3 { font-family: Georgia; font-size: 12.5px; line-height: 1.3; font-weight: 400; margin-top: 2px; }
          .bn-about { font-family: Georgia; font-size: 11px; line-height: 1.4; margin-top: 6px; opacity: 0.95; }

          .color-row { display:flex; align-items:center; gap:8px; background:#fff; border:1px solid #D9C9A8; border-radius:10px; padding:6px 10px; }
          .color-input { width:30px; height:30px; border-radius:50%; border:2px solid #fff; box-shadow:0 0 0 1px #D9C9A8; cursor:pointer; padding:0; overflow:hidden; }
          .color-input::-webkit-color-swatch { border:none; border-radius:50%; }
          .color-input::-webkit-color-swatch-wrapper { padding:0; }
        `}</style>

        <div className="bn-header"><div className="bn-title">Store Banner</div><div style={{ display: 'flex', gap: 8 }}>{isOwner && banners.length < 3 && <button onClick={openAdd} style={{ height: 30, padding: '0 12px', borderRadius: 10, border: '1px solid #D9C9A8', background: '#F3EBD9', fontFamily: 'Georgia', fontWeight: 700, fontSize: 11, display: 'flex', gap: 5, alignItems: 'center' }}><Plus size={12} /> Add</button>}</div></div>

        {banners.length === 0 ? (
          <div style={{ margin: '0 16px', background: '#fff', border: '1px dashed #C8A86A', borderRadius: 14, padding: 16, textAlign: 'center', fontFamily: 'Georgia', fontSize: 12 }}>Add banner</div>
        ) : (
          <div className="bn-outer">
            <div style={{ position: 'relative' }}>
              <div ref={sliderRef} onScroll={handleScroll} className="bn-slider">
                {banners.map(b => (
                  <div key={b.id} className="bn-card">
                    <div className="bn-bg" style={{ backgroundImage: `url(${b.image_url})` }} />
                    <div className="bn-grad" />
                    <div className="bn-content">
                      {b.h1 && <div className="bn-h1" style={{ color: b.h1_color }}>{b.h1}</div>}
                      {b.h2 && <div className="bn-h2" style={{ color: b.h2_color }}>{b.h2}</div>}
                      {b.h3 && <div className="bn-h3" style={{ color: b.h3_color }}>{b.h3}</div>}
                      {b.about && <div className="bn-about" style={{ color: b.about_color }}>{b.about}</div>}
                    </div>
                    {isOwner && (
                      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(b)} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit3 size={12} /></button>
                        <button onClick={() => handleDelete(b.id)} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={12} color="#B42318" /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {banners.length > 1 && <>
                <div onClick={() => scroll('left')} style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: '1px solid #C8A86A', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={14} /></div>
                <div onClick={() => scroll('right')} style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: '1px solid #C8A86A', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={14} /></div>
              </>}
            </div>
          </div>
        )}

        {showEdit && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
            <div style={{ width: '100%', maxWidth: 440, background: '#F6F1E8', borderRadius: 16, border: '1px solid #C8A86A', overflow: 'hidden', maxHeight: '92vh', overflowY: 'auto' }}>
              <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid #E8DCC3' }}>
                <span style={{ fontFamily: 'Georgia', fontWeight: 700, fontSize: 14 }}>{editData ? 'Edit Banner' : 'Add Banner'}</span>
                <button onClick={() => setShowEdit(false)} style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #D9C9A8', background: '#fff' }}><X size={14} /></button>
              </div>
              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div onClick={() => fileRef.current?.click()} style={{ height: 120, borderRadius: 12, border: '1.5px dashed #C8A86A', background: preview ? `url(${preview}) center/cover` : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  {!preview ? <><ImgIcon size={18} /><span style={{ fontFamily: 'Georgia', fontSize: 11, marginLeft: 6 }}>Upload Banner</span></> : null}
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
                </div>
                <div className="color-row"><Palette size={12} /><input value={form.h1} onChange={e => setForm({ ...form, h1: e.target.value })} placeholder="H1 - MIRA STORE" style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'Georgia', fontSize: 11, background: 'transparent' }} /><input type="color" value={form.h1_color} onChange={e => setForm({ ...form, h1_color: e.target.value })} className="color-input" /></div>
                <div className="color-row"><Palette size={12} /><input value={form.h2} onChange={e => setForm({ ...form, h2: e.target.value })} placeholder="H2 - 50% off for you" style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'Georgia', fontSize: 12, fontWeight: 700, background: 'transparent' }} /><input type="color" value={form.h2_color} onChange={e => setForm({ ...form, h2_color: e.target.value })} className="color-input" /></div>
                <div className="color-row"><Palette size={12} /><input value={form.h3} onChange={e => setForm({ ...form, h3: e.target.value })} placeholder="H3 - on puja specials" style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'Georgia', fontSize: 11, background: 'transparent' }} /><input type="color" value={form.h3_color} onChange={e => setForm({ ...form, h3_color: e.target.value })} className="color-input" /></div>
                <div className="color-row"><Palette size={12} /><input value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} placeholder="About - visit us" style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'Georgia', fontSize: 10, background: 'transparent' }} /><input type="color" value={form.about_color} onChange={e => setForm({ ...form, about_color: e.target.value })} className="color-input" /></div>
                <button onClick={handleSave} disabled={saving} style={{ height: 42, borderRadius: 10, background: '#2D2415', color: '#F6F1E8', border: 'none', fontFamily: 'Georgia', fontWeight: 700 }}>{saving ? 'Saving...' : 'Save Banner'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}