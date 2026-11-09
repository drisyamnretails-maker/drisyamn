"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Pencil, Plus, Trash2, Wifi, Dumbbell, UtensilsCrossed, Waves, Sparkles, Car, Coffee, Tv, Wind, PawPrint, Music, ShoppingBag, Scissors, Heart, Star } from 'lucide-react';

type Amenity = { id: string; label: string; icon: string };

const ICONS: Record<string, any> = {
  pool: Waves, spa: Sparkles, dining: UtensilsCrossed, wifi: Wifi, gym: Dumbbell,
  parking: Car, coffee: Coffee, tv: Tv, ac: Wind, pet: PawPrint, music: Music,
  shop: ShoppingBag, salon: Scissors, heart: Heart, star: Star,
};

// Sab business ke liye Presets
const PRESETS: Record<string, Amenity[]> = {
  hotel: [
    { id: '1', label: 'Infinity Pool', icon: 'pool' },
    { id: '2', label: 'Spa & Wellness', icon: 'spa' },
    { id: '3', label: 'Fine Dining', icon: 'dining' },
    { id: '4', label: 'Free Wi-Fi', icon: 'wifi' },
    { id: '5', label: 'Fitness Center', icon: 'gym' },
    { id: '6', label: 'Pet Friendly', icon: 'pet' },
    { id: '7', label: 'Free Parking', icon: 'parking' },
    { id: '8', label: 'Room Service', icon: 'coffee' },
    { id: '9', label: 'Smart TV', icon: 'tv' },
    { id: '10', label: 'AC Rooms', icon: 'ac' },
    { id: '11', label: 'Live Music', icon: 'music' },
    { id: '12', label: 'Premium Stay', icon: 'star' },
  ],
  restaurant: [
    { id: '1', label: 'Fine Dining', icon: 'dining' },
    { id: '2', label: 'Free Wi-Fi', icon: 'wifi' },
    { id: '3', label: 'Live Music', icon: 'music' },
    { id: '4', label: 'Free Parking', icon: 'parking' },
    { id: '5', label: 'Pet Friendly', icon: 'pet' },
    { id: '6', label: 'Outdoor Seating', icon: 'coffee' },
    { id: '7', label: 'Veg / Non-Veg', icon: 'heart' },
    { id: '8', label: 'Takeaway', icon: 'shop' },
  ],
  shop: [
    { id: '1', label: 'Free Wi-Fi', icon: 'wifi' },
    { id: '2', label: 'Free Parking', icon: 'parking' },
    { id: '3', label: 'Home Delivery', icon: 'shop' },
    { id: '4', label: 'Easy Return', icon: 'heart' },
    { id: '5', label: 'Best Price', icon: 'star' },
    { id: '6', label: 'AC Store', icon: 'ac' },
  ],
  salon: [
    { id: '1', label: 'Hair Spa', icon: 'salon' },
    { id: '2', label: 'Free Wi-Fi', icon: 'wifi' },
    { id: '3', label: 'AC Salon', icon: 'ac' },
    { id: '4', label: 'Free Parking', icon: 'parking' },
    { id: '5', label: 'Pet Friendly', icon: 'pet' },
    { id: '6', label: 'Premium Products', icon: 'star' },
  ],
};

export default function AmenitiesTab({ profileId }: { profileId: string }) {
  const [amenities, setAmenities] = useState<Amenity[]>(PRESETS.hotel);
  const [title, setTitle] = useState('Hotel Amenities');
  const [subtitle, setSubtitle] = useState('Everything you need for a relaxing stay');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('star');
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 900);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      const targetId = profileId || user?.id;
      if (!targetId) return;
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', targetId).single();
      if (!prof) return;
      setProfile(prof);
      if (prof.amenities_data?.items) {
        setAmenities(prof.amenities_data.items);
        setTitle(prof.amenities_data.title || 'Hotel Amenities');
        setSubtitle(prof.amenities_data.subtitle || 'Everything you need for a relaxing stay');
      } else {
        // Business type ke hisaab se auto preset - Sabke liye Dynamic
        const role = (prof.profile_role || '').toLowerCase();
        const biz = (prof.business_type || prof.category || '').toLowerCase();
        if (biz.includes('rest') || biz.includes('cafe') || biz.includes('food')) { setAmenities(PRESETS.restaurant); setTitle('Restaurant Amenities'); setSubtitle('Everything you need for a perfect meal'); }
        else if (biz.includes('shop') || biz.includes('store') || biz.includes('retail')) { setAmenities(PRESETS.shop); setTitle('Store Facilities'); setSubtitle('Everything you need for easy shopping'); }
        else if (biz.includes('salon') || biz.includes('beauty') || biz.includes('spa')) { setAmenities(PRESETS.salon); setTitle('Salon Amenities'); setSubtitle('Everything you need to feel beautiful'); }
        else { setAmenities(PRESETS.hotel); setTitle(prof.business_name ? `${prof.business_name} Amenities` : 'Hotel Amenities'); }
      }
    };
    load();
  }, [profileId]);

  const isOwner = currentUserId && profileId && currentUserId === profileId;

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { title, subtitle, items: amenities };
      if (profile) await supabase.from('profiles').update({ amenities_data: payload }).eq('id', profile.id);
      setIsEditOpen(false);
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  };

  const addAmenity = () => {
    if (!newLabel.trim()) return;
    setAmenities([...amenities, { id: Date.now().toString(), label: newLabel.trim(), icon: newIcon }]);
    setNewLabel('');
  };

  return (
    <div className="amenities-full" style={{ width: '100%', background: '#DDE3D3', padding: isDesktop ? '36px 0 36px 0' : '28px 0 28px 0', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        @media (min-width: 900px) { .amenities-full { width: 100vw !important; margin-left: calc(-50vw + 50%) !important; } }
        @media (max-width: 899px) { .amenities-full { width: 100% !important; margin-left: 0 !important; } }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isDesktop ? '0 40px' : '0 16px', boxSizing: 'border-box', position: 'relative' }}>
        {isOwner && <button onClick={() => setIsEditOpen(true)} style={{ position: 'absolute', top: '0', right: isDesktop ? '40px' : '16px', background: '#fff', border: '1px solid #E5DDCF', borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', zIndex: 5 }}><Pencil size={12} /> Edit</button>}

        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: isDesktop ? '36px' : '28px', fontWeight: 600, color: '#111', textAlign: 'center', margin: 0 }}>{title}</h2>
        <p style={{ fontSize: isDesktop ? '17px' : '15px', fontWeight: 700, color: '#111', textAlign: 'center', margin: '6px 0 24px 0' }}>{subtitle}</p>

        {/* GRID - Desktop 4, Mobile 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)', gap: isDesktop ? '20px 32px' : '16px 12px' }}>
          {amenities.map((a) => {
            const Icon = ICONS[a.icon] || Star;
            return (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', minWidth: '38px', borderRadius: '50%', background: '#EDE5D6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                  <Icon size={18} color="#2D3A2E" strokeWidth={1.8} />
                </div>
                <span style={{ fontSize: isDesktop ? '15px' : '13.5px', fontWeight: 700, color: '#111', lineHeight: 1.2 }}>{a.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '480px', background: '#fff', borderRadius: '20px 20px 0 0', padding: '20px', boxSizing: 'border-box', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>Edit Amenities</h3>
              <button onClick={() => setIsEditOpen(false)} style={{ background: '#F2F2F2', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} /></button>
            </div>

            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', height: '46px', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 12px', boxSizing: 'border-box', fontSize: '14px', marginBottom: '12px' }} />
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Subtitle</label>
            <input value={subtitle} onChange={e => setSubtitle(e.target.value)} style={{ width: '100%', height: '46px', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 12px', boxSizing: 'border-box', fontSize: '14px', marginBottom: '16px' }} />

            {/* Preset Buttons - 1 Click me poora set badlo */}
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#555', margin: '0 0 8px 0' }}>Quick Preset - Sabke liye:</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {Object.keys(PRESETS).map(k => <button key={k} onClick={() => { setAmenities(PRESETS[k]); setTitle(k === 'hotel' ? 'Hotel Amenities' : k === 'restaurant' ? 'Restaurant Amenities' : k === 'shop' ? 'Store Facilities' : 'Salon Amenities'); }} style={{ padding: '7px 12px', borderRadius: '999px', border: '1px solid #E5DDCF', background: '#F7F2E9', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>{k}</button>)}
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {amenities.map((a) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F7F2E9', borderRadius: '10px', padding: '8px 10px' }}>
                  <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EDE5D6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{(() => { const I = ICONS[a.icon] || Star; return <I size={16} />; })()}</span>
                  <input value={a.label} onChange={e => setAmenities(prev => prev.map(x => x.id === a.id ? { ...x, label: e.target.value } : x))} style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '13.5px', fontWeight: 600, outline: 'none' }} />
                  <select value={a.icon} onChange={e => setAmenities(prev => prev.map(x => x.id === a.id ? { ...x, icon: e.target.value } : x))} style={{ border: '1px solid #E5DDCF', borderRadius: '8px', padding: '4px', fontSize: '12px' }}>
                    {Object.keys(ICONS).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <button onClick={() => setAmenities(prev => prev.filter(x => x.id !== a.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D00' }}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>

            {/* Add New */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Nayi Amenity likho - jaise Rooftop..." style={{ flex: 1, height: '44px', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 12px', fontSize: '13px' }} />
              <select value={newIcon} onChange={e => setNewIcon(e.target.value)} style={{ borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 8px', fontSize: '12px' }}>{Object.keys(ICONS).map(k => <option key={k} value={k}>{k}</option>)}</select>
              <button onClick={addAmenity} style={{ width: '44px', height: '44px', borderRadius: '10px', border: 'none', background: '#5A7A6A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}><Plus size={18} /></button>
            </div>

            <button onClick={handleSave} disabled={saving} style={{ width: '100%', height: '50px', borderRadius: '12px', border: 'none', background: '#5A7A6A', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      )}
    </div>
  );
}