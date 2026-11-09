"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react';

const COLLECTIONS = [
  { key: 'rooms', label: 'Our Rooms', subtitle: 'Thoughtfully designed rooms for comfort and calm', itemLabel: 'Room Name', detailPlaceholder: 'King bed • 32 m² • City View', priceLabel: 'Price - 520', priceSuffix: ' / night', buttonLabel: 'Book Now', addLabel: '+ Add' },
  { key: 'services', label: 'Our Services', subtitle: 'Professional services, trusted by hundreds', itemLabel: 'Service Name', detailPlaceholder: 'Duration • 1 Hour • Home Visit Available', priceLabel: 'Price - 99', priceSuffix: ' / session', buttonLabel: 'Book Now', addLabel: '+ Add' },
  { key: 'menu', label: 'Our Menu', subtitle: 'Freshly brewed, freshly baked, made with love', itemLabel: 'Dish Name', detailPlaceholder: 'Espresso • Hot • 250ml • With Love', priceLabel: 'Price - 120', priceSuffix: '', buttonLabel: 'Order Now', addLabel: '+ Add' },
  { key: 'products', label: 'Our Products', subtitle: 'Handpicked products, best quality, best price', itemLabel: 'Product Name', detailPlaceholder: 'Size • Color • Material • In Stock', priceLabel: 'Price - 520', priceSuffix: '', buttonLabel: 'Buy Now', addLabel: '+ Add' },
  { key: 'portfolio', label: 'Our Portfolio', subtitle: 'Work we are proud of, made with heart', itemLabel: 'Project Name', detailPlaceholder: '3BHK • 1800 sqft • Modern • Pune', priceLabel: 'Budget - 25 Lakh', priceSuffix: '', buttonLabel: 'View Project', addLabel: '+ Add' },
];

type Item = { id: string; title: string; details: string; price: string; image: string };

export default function DynamicContentTab({ profileId, limit = 8, offset = 0 }: { profileId: string; limit?: number; offset?: number }) {
  const [items, setItems] = useState<Item[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [collectionKey, setCollectionKey] = useState('rooms');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const [form, setForm] = useState({ title: '', details: '', price: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const config = COLLECTIONS.find(c => c.key === collectionKey) || COLLECTIONS[0];

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      const targetId = profileId || user?.id;
      if (!targetId) return;
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', targetId).single();
      if (prof) {
        setProfile(prof);
        if (prof.collection_type) setCollectionKey(prof.collection_type);
        else if (prof.business_type) {
          const map: Record<string, string> = { hotel: 'rooms', cafe: 'menu', retail: 'products', shop: 'products', service: 'services', architect: 'portfolio', interior: 'portfolio', media: 'portfolio', vlogger: 'portfolio' };
          setCollectionKey(map[prof.business_type?.toLowerCase()] || 'rooms');
        }
      }
      const { data } = await supabase.from('products').select('*').eq('user_id', targetId).order('created_at', { ascending: true }).range(offset, offset + limit - 1);
      if (data && data.length > 0) {
        setItems(data.map((p: any) => ({ id: p.id, title: p.name || p.title, details: p.details || p.description || '', price: p.price ? `${p.price}` : '', image: p.image_url || p.image || p.images?.[0] || '' })));
      } else if (offset === 0) {
        setItems([
          { id: '1', title: 'Deluxe Room', details: 'King bed • 32 m² • City View', price: '520', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80' },
          { id: '2', title: 'Suite Oasis', details: 'One Bedroom Suite • 55 m² • Pool View', price: '340', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=900&q=80' },
          { id: '3', title: 'Garden Villa', details: '2 Bed Villa • 85 m² • Private Garden', price: '450', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&q=80' },
          { id: '4', title: 'Ocean View', details: 'King bed • 45 m² • Ocean View', price: '520', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80' },
          { id: '5', title: 'Family Suite', details: '2 Bed • 68 m² • Garden View', price: '380', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80' },
          { id: '6', title: 'Royal Suite', details: 'King bed • 90 m² • Pool + City View', price: '650', image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=900&q=80' },
        ]);
      }
    };
    load();
  }, [profileId, limit, offset]);

  const isOwner = currentUserId && profileId && currentUserId === profileId;
  const visibleCount = isDesktop ? 4 : 1;
  const maxSlide = Math.max(0, items.length - visibleCount);

  const scrollToSlide = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(index, maxSlide));
    setCurrentSlide(clamped);
    const card = el.querySelector('[data-card]') as HTMLElement;
    const cardWidth = card ? card.offsetWidth + 20 : el.clientWidth;
    el.scrollTo({ left: clamped * cardWidth, behavior: 'smooth' });
  };
  const nextSlide = () => scrollToSlide(currentSlide >= maxSlide ? 0 : currentSlide + 1);
  const prevSlide = () => scrollToSlide(currentSlide <= 0 ? maxSlide : currentSlide - 1);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]') as HTMLElement;
    const cardWidth = card ? card.offsetWidth + 20 : el.clientWidth;
    const idx = Math.round(el.scrollLeft / cardWidth);
    if (idx !== currentSlide && idx >= 0 && idx <= maxSlide) setCurrentSlide(idx);
  };

  useEffect(() => {
    if (items.length <= visibleCount) return;
    const t = setInterval(() => { scrollToSlide(currentSlide >= maxSlide ? 0 : currentSlide + 1); }, 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, maxSlide, visibleCount, currentSlide]);

  const handleCollectionChange = async (key: string) => {
    setCollectionKey(key);
    setDropdownOpen(false);
    setCurrentSlide(0);
    if (scrollRef.current) scrollRef.current.scrollTo({ left: 0 });
    if (isOwner && profile) await supabase.from('profiles').update({ collection_type: key }).eq('id', profile.id);
  };

  const openAdd = () => { setEditingItem(null); setForm({ title: '', details: '', price: '', image: '' }); setImageFile(null); setImagePreview(''); setIsEditOpen(true); };
  const openEdit = (item: Item) => { setEditingItem(item); setForm({ title: item.title, details: item.details, price: item.price, image: item.image }); setImagePreview(item.image); setImageFile(null); setIsEditOpen(true); };

  const handleSave = async () => {
    if (!form.title) { alert('Name bharo'); return; }
    setSaving(true);
    try {
      let imageUrl = form.image;
      if (imageFile && currentUserId) {
        const ext = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `${currentUserId}/${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from('covers').upload(fileName, imageFile, { upsert: true });
        if (error) throw error;
        const { data } = supabase.storage.from('covers').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }
      if (editingItem && editingItem.id.length > 10) {
        await supabase.from('products').update({ name: form.title, description: form.details, price: form.price, image_url: imageUrl }).eq('id', editingItem.id);
        setItems(items.map(r => r.id === editingItem.id ? { ...r, title: form.title, details: form.details, price: form.price, image: imageUrl } : r));
      } else if (editingItem) {
        setItems(items.map(r => r.id === editingItem.id ? { ...r, title: form.title, details: form.details, price: form.price, image: imageUrl || r.image } : r));
      } else {
        const { data, error } = await supabase.from('products').insert({ user_id: currentUserId, name: form.title, description: form.details, price: form.price, image_url: imageUrl }).select().single();
        if (error) throw error;
        setItems([...items, { id: data.id, title: form.title, details: form.details, price: form.price, image: imageUrl }]);
      }
      setIsEditOpen(false);
    } catch (e: any) { alert('Error: ' + e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    if (id.length > 10) await supabase.from('products').delete().eq('id', id);
    setItems(items.filter(r => r.id !== id));
  };

  const handleBookNow = (item: Item) => {
    const phone = profile?.contact || profile?.phone || '+919876543210';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = `Hi ${profile?.business_name || profile?.name || ''}, I want to book ${item.title} (View ₹${item.price}${config.priceSuffix})`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const displayPrice = (p: string) => {
    const clean = p.replace(/₹|\$|,/g, '').trim();
    if (!clean) return 'View Details';
    if (clean.toLowerCase().includes('lakh')) return `View ${clean}`;
    return `View ₹${clean}${config.priceSuffix}`;
  };

  return (
    <div className="collection-full" style={{ width: '100%', background: '#F7F2E9', padding: '28px 0 28px 0', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        /* DESKTOP - FULL WIDTH, 800px BOX SE BAHAR */
        @media (min-width: 900px) {
          .collection-full {
            width: 100vw !important;
            margin-left: calc(-50vw + 50%) !important;
            padding: 36px 0 32px 0 !important;
          }
        }
        /* MOBILE - 100% FIT, SIDE PATTI NAHI AAYEGI */
        @media (max-width: 899px) {
          .collection-full {
            width: 100% !important;
            margin-left: 0 !important;
          }
        }
      `}</style>

      <div style={{ textAlign: 'center', padding: '0 16px 20px 16px', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'inline-block', position: 'relative' }}>
          <button onClick={() => isOwner && setDropdownOpen(!dropdownOpen)} style={{ background: 'none', border: 'none', cursor: isOwner ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 6vw, 36px)', fontWeight: 600, color: '#5A6B5A', margin: '0 auto', whiteSpace: 'nowrap' }}>
            {config.label}
            {isOwner && <ChevronDown size={22} color="#5A6B5A" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s', flexShrink: 0 }} />}
          </button>
          {dropdownOpen && isOwner && (
            <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '10px', background: '#fff', borderRadius: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', padding: '8px', minWidth: '220px', zIndex: 20, textAlign: 'left' }}>
              {COLLECTIONS.map((c) => (
                <button key={c.key} onClick={() => handleCollectionChange(c.key)} style={{ width: '100%', background: collectionKey === c.key ? '#F7F2E9' : '#fff', border: 'none', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '14px', fontWeight: collectionKey === c.key ? 700 : 500, color: '#111' }}>
                  {c.label}
                  {collectionKey === c.key && <Check size={16} color="#5A7A6A" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111', margin: '8px 0 0 0', lineHeight: '1.4', padding: '0 8px' }}>{config.subtitle}</p>
        {isOwner && <button onClick={openAdd} style={{ marginTop: '14px', background: '#5A7A6A', color: '#fff', border: 'none', borderRadius: '999px', padding: '8px 18px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>+ Add</button>}
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box', padding: '0 16px' }}>
        {items.length > visibleCount && <button onClick={prevSlide} style={{ position: 'absolute', left: '20px', top: '38%', transform: 'translateY(-50%)', zIndex: 10, width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={20} /></button>}
        {items.length > visibleCount && <button onClick={nextSlide} style={{ position: 'absolute', right: '20px', top: '38%', transform: 'translateY(-50%)', zIndex: 10, width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={20} /></button>}

        <div ref={scrollRef} onScroll={handleScroll} style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', scrollbarWidth: 'none', padding: '2px 2px 4px 2px', boxSizing: 'border-box' }}>
          {items.map((item) => (
            <div data-card key={item.id} style={{ minWidth: isDesktop ? 'calc((100% - 60px) / 4)' : '100%', width: isDesktop ? 'calc((100% - 60px) / 4)' : '100%', flexShrink: 0, scrollSnapAlign: 'start', background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', position: 'relative', boxSizing: 'border-box' }}>
              <div style={{ position: 'relative', width: '100%', height: isDesktop ? '270px' : '240px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setSelectedItem(item)}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                {isOwner && <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px' }}>
                  <button onClick={(e) => { e.stopPropagation(); openEdit(item); }} style={{ width: '34px', height: '34px', borderRadius: '50%', border: 'none', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}><Pencil size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} style={{ width: '34px', height: '34px', borderRadius: '50%', border: 'none', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}><Trash2 size={14} color="#E92A2A" /></button>
                </div>}
              </div>
              <div style={{ padding: '18px 14px 20px 14px', textAlign: 'center', boxSizing: 'border-box' }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px', fontWeight: 700, margin: 0, lineHeight: '1.2' }}>{item.title}</h3>
                <p style={{ fontSize: '13.5px', color: '#333', margin: '8px 0 0 0', fontWeight: 500, lineHeight: '1.4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.details}</p>
                <button onClick={() => setSelectedItem(item)} style={{ marginTop: '14px', background: '#fff', border: '1.2px solid #333', borderRadius: '7px', padding: '10px 22px', fontSize: '14.5px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{displayPrice(item.price)}</button>
              </div>
            </div>
          ))}
        </div>
        {items.length > visibleCount && <div style={{ display: 'flex', justifyContent: 'center', gap: '7px', marginTop: '16px' }}>{Array.from({ length: maxSlide + 1 }).map((_, i) => <button key={i} onClick={() => scrollToSlide(i)} style={{ width: currentSlide === i ? '26px' : '9px', height: '9px', borderRadius: '999px', border: 'none', background: currentSlide === i ? '#5A7A6A' : '#D9CFC0', cursor: 'pointer', padding: 0 }} />)}</div>}
      </div>

      {isEditOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '480px', background: '#fff', borderRadius: '20px 20px 0 0', padding: '20px', boxSizing: 'border-box', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>{editingItem ? 'Edit' : 'Add'} {config.itemLabel}</h3>
              <button onClick={() => setIsEditOpen(false)} style={{ background: '#F2F2F2', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Photo</label>
            <label style={{ width: '100%', height: '140px', borderRadius: '12px', border: '1px dashed #5A7A6A', background: imagePreview ? `url(${imagePreview}) center/cover` : '#F7F2E9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '12px', flexDirection: 'column', gap: '4px' }}>
              {!imagePreview && <><span style={{ fontSize: '22px', color: '#5A7A6A' }}>+</span><span style={{ fontSize: '12px', color: '#5A7A6A' }}>Upload Photo</span></>}
              <input type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} />
            </label>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>{config.itemLabel}</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder={config.itemLabel} style={{ width: '100%', height: '46px', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 12px', boxSizing: 'border-box', fontSize: '14px', marginBottom: '12px' }} />
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Details</label>
            <input value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} placeholder={config.detailPlaceholder} style={{ width: '100%', height: '46px', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 12px', boxSizing: 'border-box', fontSize: '14px', marginBottom: '12px' }} />
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>{config.priceLabel}</label>
            <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="520" inputMode="numeric" style={{ width: '100%', height: '46px', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 12px', boxSizing: 'border-box', fontSize: '14px', marginBottom: '16px' }} />
            <button onClick={handleSave} disabled={saving} style={{ width: '100%', height: '50px', borderRadius: '12px', border: 'none', background: '#5A7A6A', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      )}

      {selectedItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box' }} onClick={() => setSelectedItem(null)}>
          <div style={{ width: '100%', maxWidth: '420px', background: '#fff', borderRadius: '16px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'relative' }}>
              <img src={selectedItem.image} style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }} />
              <button onClick={() => setSelectedItem(null)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', margin: 0 }}>{selectedItem.title}</h3>
              <p style={{ fontSize: '14px', color: '#555', margin: '10px 0' }}>{selectedItem.details}</p>
              <p style={{ fontSize: '22px', fontWeight: 700, color: '#5A7A6A', margin: '12px 0' }}>{displayPrice(selectedItem.price)}</p>
              <button onClick={() => handleBookNow(selectedItem)} style={{ width: '100%', height: '50px', borderRadius: '12px', border: 'none', background: '#5A7A6A', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginBottom: '10px' }}>{config.buttonLabel} - Book Now</button>
              <button onClick={() => setSelectedItem(null)} style={{ width: '100%', height: '44px', borderRadius: '10px', border: '1px solid #E5E5E5', background: '#fff', color: '#111', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}