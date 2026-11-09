"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';

type AboutData = {
  aboutTitle: string;
  aboutSubtitle: string;
  aboutText: string;
  aboutImage: string;
  storyTitle: string;
  storyText: string;
  storyImage: string;
  whyTitle: string;
  whyText: string;
  whyImage: string;
};

const DEFAULT_DATA: AboutData = {
  aboutTitle: 'About Us',
  aboutSubtitle: 'Our Story',
  aboutText: 'Founded in 2018, TASOMI HOTEL was born from a vision to create a sanctuary where modern luxury meets natural calm. Nestled among lush gardens and tranquil waters, we blend thoughtful design with warm hospitality to offer guests a peaceful retreat. Every detail — from the handpicked linens to the locally sourced cuisine — is crafted to restore, relax, and inspire.',
  aboutImage: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1000&q=80',
  storyTitle: 'Our Story',
  storyText: 'What started as a small family dream is today a place where hundreds of guests find peace. Every corner of our space tells a story — of local artisans, of nature, and of people who believe that true luxury is in simplicity, warmth and care.',
  storyImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&q=80',
  whyTitle: 'Why Customers Choose Us',
  whyText: 'Because we don\'t just offer rooms, food or services — we offer an experience. Clean spaces, honest pricing, warm staff and attention to every small detail. That is why our guests come back again and again, and bring their loved ones with them.',
  whyImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&q=80',
};

export default function AboutTab({ profileId }: { profileId: string }) {
  const [data, setData] = useState<AboutData>(DEFAULT_DATA);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<'about' | 'story' | 'why'>('about');
  const [saving, setSaving] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const [form, setForm] = useState({ title: '', subtitle: '', text: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      const targetId = profileId || user?.id;
      if (!targetId) return;
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', targetId).single();
      if (prof) {
        setProfile(prof);
        if (prof.about_data) setData({ ...DEFAULT_DATA, ...prof.about_data });
        else if (prof.business_name) {
          setData((prev) => ({ ...prev, aboutText: `Founded in 2018, ${prof.business_name} was born from a vision to create a sanctuary where modern luxury meets natural calm. Nestled among lush gardens and tranquil waters, we blend thoughtful design with warm hospitality to offer guests a peaceful retreat. Every detail — from the handpicked linens to the locally sourced cuisine — is crafted to restore, relax, and inspire.` }));
        }
      }
    };
    load();
  }, [profileId]);

  const isOwner = currentUserId && profileId && currentUserId === profileId;

  // ===== MOBILE SLIDER - MANUAL, NO AUTO =====
  const scrollToSlide = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(idx, 2));
    setCurrentSlide(clamped);
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
  };
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== currentSlide && idx >= 0 && idx <= 2) setCurrentSlide(idx);
  };
  // AUTO SLIDE HATA DIYA - koi setInterval nahi hai ab

  const openEdit = (section: 'about' | 'story' | 'why') => {
    setEditingSection(section);
    if (section === 'about') setForm({ title: data.aboutTitle, subtitle: data.aboutSubtitle, text: data.aboutText, image: data.aboutImage });
    if (section === 'story') setForm({ title: data.storyTitle, subtitle: '', text: data.storyText, image: data.storyImage });
    if (section === 'why') setForm({ title: data.whyTitle, subtitle: '', text: data.whyText, image: data.whyImage });
    setImagePreview(section === 'about' ? data.aboutImage : section === 'story' ? data.storyImage : data.whyImage);
    setImageFile(null);
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let imageUrl = form.image;
      if (imageFile && currentUserId) {
        const ext = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `${currentUserId}/about-${editingSection}-${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from('covers').upload(fileName, imageFile, { upsert: true });
        if (error) throw error;
        const { data } = supabase.storage.from('covers').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }
      let newData = { ...data };
      if (editingSection === 'about') newData = { ...newData, aboutTitle: form.title, aboutSubtitle: form.subtitle, aboutText: form.text, aboutImage: imageUrl };
      if (editingSection === 'story') newData = { ...newData, storyTitle: form.title, storyText: form.text, storyImage: imageUrl };
      if (editingSection === 'why') newData = { ...newData, whyTitle: form.title, whyText: form.text, whyImage: imageUrl };
      setData(newData);
      if (profile) await supabase.from('profiles').update({ about_data: newData }).eq('id', profile.id);
      setIsEditOpen(false);
    } catch (e: any) { alert('Error: ' + e.message); }
    finally { setSaving(false); }
  };

  const h2Style: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontSize: isDesktop ? '30px' : '26px', fontWeight: 500, color: '#111', margin: 0, lineHeight: 1.1 };
  const subStyle: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '19px', fontWeight: 600, color: '#111', margin: '6px 0 0 0' };
  const pStyle: React.CSSProperties = { fontSize: '14.5px', color: '#333', lineHeight: 1.6, margin: '10px 0 0 0', fontWeight: 500 };
  const imgStyle: React.CSSProperties = { width: '100%', height: isDesktop ? '230px' : '200px', objectFit: 'cover', borderRadius: '12px', display: 'block' };

  const editBtn = (section: 'about' | 'story' | 'why') => (
    <button onClick={() => openEdit(section)} style={{ position: 'absolute', top: '-6px', right: '0', background: '#fff', border: '1px solid #E5DDCF', borderRadius: '999px', padding: '5px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', zIndex: 5 }}><Pencil size={11} /> Edit</button>
  );

  // Ek section ka card - Desktop aur Mobile dono me same use hoga
  const renderSection = (type: 'about' | 'story' | 'why', bg: string, reverse: boolean) => {
    const title = type === 'about' ? data.aboutTitle : type === 'story' ? data.storyTitle : data.whyTitle;
    const text = type === 'about' ? data.aboutText : type === 'story' ? data.storyText : data.whyText;
    const img = type === 'about' ? data.aboutImage : type === 'story' ? data.storyImage : data.whyImage;
    return (
      <div style={{ width: '100%', background: bg, padding: isDesktop ? '24px 0' : '20px 0', boxSizing: 'border-box', flexShrink: 0, scrollSnapAlign: 'start' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isDesktop ? '0 40px' : '0 20px', display: 'flex', flexDirection: isDesktop ? (reverse ? 'row' : 'row') : 'column', alignItems: 'center', gap: isDesktop ? '36px' : '14px', boxSizing: 'border-box' }}>
          {/* Mobile me hamesha Text upar, Image neeche - Desktop me reverse ke hisaab se */}
          {isDesktop && reverse ? (
            <>
              <div style={{ flex: 1, width: '100%' }}><img src={img} style={imgStyle} /></div>
              <div style={{ flex: 1.1, width: '100%', position: 'relative' }}>
                {isOwner && editBtn(type)}
                <h2 style={h2Style}>{title}</h2>
                {type === 'about' && <h3 style={subStyle}>{data.aboutSubtitle}</h3>}
                <p style={pStyle}>{text}</p>
                {type === 'why' && <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>{['✓ Clean & Trusted Space', '✓ Honest Pricing, No Hidden Charges', '✓ Warm Hospitality & Quick Support'].map(t => <span key={t} style={{ fontSize: '13.5px', fontWeight: 600, color: '#5A7A6A' }}>{t}</span>)}</div>}
              </div>
            </>
          ) : (
            <>
              <div style={{ flex: 1.1, width: '100%', position: 'relative' }}>
                {isOwner && editBtn(type)}
                <h2 style={h2Style}>{title}</h2>
                {type === 'about' && <h3 style={subStyle}>{data.aboutSubtitle}</h3>}
                <p style={pStyle}>{text}</p>
                {type === 'why' && <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>{['✓ Clean & Trusted Space', '✓ Honest Pricing, No Hidden Charges', '✓ Warm Hospitality & Quick Support'].map(t => <span key={t} style={{ fontSize: '13.5px', fontWeight: 600, color: '#5A7A6A' }}>{t}</span>)}</div>}
              </div>
              <div style={{ flex: 1, width: '100%' }}><img src={img} style={imgStyle} /></div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="about-full" style={{ width: '100%', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        @media (min-width: 900px) { .about-full { width: 100vw !important; margin-left: calc(-50vw + 50%) !important; } }
        @media (max-width: 899px) { .about-full { width: 100% !important; margin-left: 0 !important; } }
      `}</style>

      {/* ===== DESKTOP - 3 SECTIONS EK KE NEECHE EK ===== */}
      {isDesktop && (
        <>
          {renderSection('about', '#F7F2E9', false)}
          {renderSection('story', '#fff', true)}
          {renderSection('why', '#F7F2E9', false)}
        </>
      )}

      {/* ===== MOBILE - SLIDER, MANUAL, NO AUTO ===== */}
      {!isDesktop && (
        <div style={{ position: 'relative', width: '100%' }}>
          {/* Arrow - Left / Right */}
          <button onClick={() => scrollToSlide(currentSlide <= 0 ? 2 : currentSlide - 1)} style={{ position: 'absolute', left: '10px', top: '40%', transform: 'translateY(-50%)', zIndex: 10, width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={18} /></button>
          <button onClick={() => scrollToSlide(currentSlide >= 2 ? 0 : currentSlide + 1)} style={{ position: 'absolute', right: '10px', top: '40%', transform: 'translateY(-50%)', zIndex: 10, width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={18} /></button>

          <div ref={scrollRef} onScroll={handleScroll} style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', scrollbarWidth: 'none', width: '100%' }}>
            <div style={{ minWidth: '100%', width: '100%', flexShrink: 0, scrollSnapAlign: 'start' }}>{renderSection('about', '#F7F2E9', false)}</div>
            <div style={{ minWidth: '100%', width: '100%', flexShrink: 0, scrollSnapAlign: 'start' }}>{renderSection('story', '#fff', true)}</div>
            <div style={{ minWidth: '100%', width: '100%', flexShrink: 0, scrollSnapAlign: 'start' }}>{renderSection('why', '#F7F2E9', false)}</div>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '7px', padding: '12px 0 16px 0', background: '#F7F2E9' }}>
            {[0, 1, 2].map(i => (
              <button key={i} onClick={() => scrollToSlide(i)} style={{ width: currentSlide === i ? '26px' : '9px', height: '9px', borderRadius: '999px', border: 'none', background: currentSlide === i ? '#5A7A6A' : '#D9CFC0', cursor: 'pointer', padding: 0 }} />
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '11px', color: '#999', margin: '-8px 0 10px 0', background: '#F7F2E9', paddingBottom: '10px' }}>Swipe karke dekho → About Us • Our Story • Why Choose Us</p>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '480px', background: '#fff', borderRadius: '20px 20px 0 0', padding: '20px', boxSizing: 'border-box', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>Edit {editingSection === 'about' ? 'About Us' : editingSection === 'story' ? 'Our Story' : 'Why Choose Us'}</h3>
              <button onClick={() => setIsEditOpen(false)} style={{ background: '#F2F2F2', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Photo</label>
            <label style={{ width: '100%', height: '140px', borderRadius: '12px', border: '1px dashed #5A7A6A', background: imagePreview ? `url(${imagePreview}) center/cover` : '#F7F2E9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '12px', flexDirection: 'column', gap: '4px' }}>
              {!imagePreview && <><span style={{ fontSize: '22px', color: '#5A7A6A' }}>+</span><span style={{ fontSize: '12px', color: '#5A7A6A' }}>Upload Photo</span></>}
              <input type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} />
            </label>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="About Us" style={{ width: '100%', height: '46px', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 12px', boxSizing: 'border-box', fontSize: '14px', marginBottom: '12px' }} />
            {editingSection === 'about' && (
              <>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Subtitle - Our Story</label>
                <input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} placeholder="Our Story" style={{ width: '100%', height: '46px', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 12px', boxSizing: 'border-box', fontSize: '14px', marginBottom: '12px' }} />
              </>
            )}
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Text / Description</label>
            <textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} rows={6} placeholder="Apni story likho..." style={{ width: '100%', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '12px', boxSizing: 'border-box', fontSize: '14px', marginBottom: '16px', resize: 'vertical', fontFamily: "'Inter', sans-serif" }} />
            <button onClick={handleSave} disabled={saving} style={{ width: '100%', height: '50px', borderRadius: '12px', border: 'none', background: '#5A7A6A', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      )}
    </div>
  );
}