"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Home, MessageCircle, Bell, Users, CalendarCheck, ChevronLeft, ChevronRight, Pencil, X, Check, Plus, Trash2, Heart } from 'lucide-react';

export default function HeaderTab({ profileId }: { profileId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [editForm, setEditForm] = useState({
    hotelName: '',
    tagline: '',
    rating: '4.9/5',
    suites: 'Oceanview & Garden Suites',
    cancellation: 'Free Cancellation',
    address: '',
    contact: '',
  });
  const [editCovers, setEditCovers] = useState<string[]>([]);
  const [newCoverFiles, setNewCoverFiles] = useState<File[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      const targetId = profileId || user?.id;
      if (!targetId) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', targetId).single();
      if (data) {
        setProfile(data);
        setEditForm({
          hotelName: data.business_name || data.name || 'TASOMI HOTEL',
          tagline: data.about_us || 'Serenity. Luxury. Timeless Calm.',
          rating: data.rating || '4.9/5',
          suites: data.suites || 'Oceanview & Garden Suites',
          cancellation: data.cancellation || 'Free Cancellation',
          address: data.address || '',
          contact: data.contact || '',
        });
        setEditCovers(data.cover_urls || (data.cover_url ? [data.cover_url] : []));
      }
      if (user && targetId && user.id !== targetId) {
        const { data: follow } = await supabase.from('follows').select('id').eq('follower_id', user.id).eq('following_id', targetId).single();
        setIsFollowing(!!follow);
      }
    };
    load();
  }, [profileId]);

  const isOwner = currentUserId && profile && currentUserId === profile.id;

  const hotelName = profile?.business_name || profile?.name || 'TASOMI HOTEL';
  const tagline = profile?.about_us || 'Serenity. Luxury. Timeless Calm.';
  const rating = profile?.rating || '4.9/5';
  const suites = profile?.suites || 'Oceanview & Garden Suites';
  const cancellation = profile?.cancellation || 'Free Cancellation';

  const slides = (profile?.cover_urls?.length > 0 ? profile.cover_urls : profile?.cover_url ? [profile.cover_url] : []).slice(0, 5);
  const images = slides.length > 0 ? slides : [
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=2000&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=2000&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=2000&q=80',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=2000&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=2000&q=80',
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % images.length), 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const next = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  // ✅ ROUTE - Sabka route pakka
  const links = [
    { label: 'Home', Icon: Home, path: '/homefeed' },
    { label: 'Message', Icon: MessageCircle, path: '/message' },
    { label: 'Notification', Icon: Bell, path: '/notifications' },
    { label: 'Contacts', Icon: Users, path: '/contacts' },
    { label: 'Bookings', Icon: CalendarCheck, path: '/bookings' },
  ];

  // Active link URL se pata chalega - refresh pe bhi sahi rahega
  const activeLink = links.find(l => pathname?.startsWith(l.path))?.label || 'Home';

  const goTo = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  const handleFollow = async () => {
    if (!currentUserId || !profile) return;
    if (isFollowing) {
      await supabase.from('follows').delete().eq('follower_id', currentUserId).eq('following_id', profile.id);
      setIsFollowing(false);
    } else {
      await supabase.from('follows').insert({ follower_id: currentUserId, following_id: profile.id });
      setIsFollowing(true);
    }
  };

  const uploadFile = async (file: File, userId: string) => {
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from('covers').upload(fileName, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('covers').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSaveEdit = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      let coverUrls = [...editCovers];
      if (newCoverFiles.length > 0) {
        setUploading(true);
        for (const f of newCoverFiles) {
          const url = await uploadFile(f, profile.id);
          coverUrls.push(url);
        }
        coverUrls = coverUrls.slice(0, 5);
        setUploading(false);
      }
      const { error } = await supabase.from('profiles').update({
        business_name: editForm.hotelName,
        name: editForm.hotelName,
        about_us: editForm.tagline,
        rating: editForm.rating,
        suites: editForm.suites,
        cancellation: editForm.cancellation,
        address: editForm.address,
        contact: editForm.contact,
        cover_urls: coverUrls,
        cover_url: coverUrls[0] || null,
        updated_at: new Date().toISOString(),
      }).eq('id', profile.id);
      if (error) throw error;
      setProfile((p: any) => ({ ...p, business_name: editForm.hotelName, name: editForm.hotelName, about_us: editForm.tagline, rating: editForm.rating, suites: editForm.suites, cancellation: editForm.cancellation, address: editForm.address, contact: editForm.contact, cover_urls: coverUrls, cover_url: coverUrls[0] }));
      setNewCoverFiles([]);
      setIsEditOpen(false);
      alert('Saved!');
    } catch (e: any) { alert('Error: ' + e.message); }
    finally { setSaving(false); setUploading(false); }
  };

  const handleRemoveCover = (idx: number) => {
    setEditCovers(editCovers.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ width: '100%', fontFamily: "'Playfair Display', Georgia, serif", background: '#fff', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        @media (min-width: 900px) {
          .nav-desktop { display: flex !important; }
          .nav-hamburger { display: none !important; }
          .hero-box { height: 560px !important; }
          .header-inner { padding: 12px 32px 12px 16px !important; max-width: 1200px !important; }
        }
        @media (max-width: 899px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .hero-box { height: 340px !important; }
          .header-inner { padding: 12px 16px !important; }
        }
      `}</style>

      {/* ===== TOP HEADER - TASOMI LEFT ===== */}
      <header style={{ width: '100%', background: '#F7F2E9', borderBottom: '1px solid #D9CFC0', boxSizing: 'border-box' }}>
        <div className="header-inner" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '12px 20px 12px 16px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '16px' }}>
          {/* ✅ TASOMI - Ekdum Left, click pe Homefeed */}
          <div onClick={() => router.push('/homefeed')} style={{ flexShrink: 0, cursor: 'pointer', lineHeight: 1, marginRight: 'auto', textAlign: 'left' }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22px', fontWeight: 600, letterSpacing: '0.12em', color: '#5A6B5A', textAlign: 'left' }}>TASOMI</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '11px', letterSpacing: '0.42em', color: '#5A6B5A', textAlign: 'left', marginTop: '2px' }}>HOTEL</div>
          </div>

          <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '24px', marginLeft: 'auto' }}>
            {links.map(({ label, Icon, path }) => (
              <button key={label} onClick={() => goTo(path)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '13.5px', fontWeight: activeLink === label ? 700 : 500, color: '#111', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon size={16} color={activeLink === label ? '#5A7A6A' : '#111'} />
                {label}
                {label === 'Notification' && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E92A2A', marginLeft: '-2px', marginTop: '-8px' }} />}
              </button>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#111', padding: '4px' }}>{menuOpen ? '✕' : '☰'}</button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ padding: '8px 20px 16px 20px', display: 'flex', flexDirection: 'column', gap: '2px', borderTop: '1px solid #E5DDCF', background: '#F7F2E9' }}>
            {links.map(({ label, Icon, path }) => (
              <button key={label} onClick={() => goTo(path)} style={{ background: 'none', border: 'none', textAlign: 'left', padding: '11px 4px', fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: activeLink === label ? 700 : 500, color: '#111', cursor: 'pointer', borderBottom: '1px solid #EDE6D6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon size={17} color="#5A7A6A" /> {label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ===== HERO COVER ===== */}
      <div className="hero-box" style={{ position: 'relative', width: '100%', height: '340px', overflow: 'hidden', background: '#000' }}>
        {images.map((img, i) => (
          <img key={i} src={img} alt={`slide-${i}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: currentSlide === i ? 1 : 0, transition: 'opacity 0.8s ease' }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55))' }} />
        <button onClick={prev} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 5, width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.45)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={22} /></button>
        <button onClick={next} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 5, width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.45)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={22} /></button>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center', padding: '0 16px 32px 16px', boxSizing: 'border-box', zIndex: 2 }}>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(24px, 5vw, 44px)', color: '#fff', margin: 0, fontWeight: 500, lineHeight: 1.1, textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>Welcome to</p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 7vw, 68px)', color: '#fff', margin: '4px 0 0 0', fontWeight: 600, letterSpacing: '0.01em', lineHeight: 1.05, textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>{hotelName.toUpperCase()}</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(13px, 3vw, 19px)', color: '#fff', margin: '10px 0 0 0', fontWeight: 500, letterSpacing: '0.02em', textShadow: '0 1px 10px rgba(0,0,0,0.6)' }}>{tagline}</p>
          <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', fontFamily: "'Inter', sans-serif", fontSize: '12.5px', color: '#fff', fontWeight: 500, textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ letterSpacing: '2px', fontSize: '11px' }}>★★★★★</span><span>{rating} Guest Rating</span></span>
            <span style={{ opacity: 0.7 }}>|</span>
            <span>🛏️ {suites}</span>
            <span style={{ opacity: 0.7 }}>|</span>
            <span>🔄 {cancellation}</span>
          </div>
        </div>
        <div style={{ position: 'absolute', right: '16px', bottom: '16px', zIndex: 6, display: 'flex', gap: '8px' }}>
          {isOwner ? (
            <button onClick={() => setIsEditOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', color: '#111', border: 'none', borderRadius: '999px', padding: '9px 16px', fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
              <Pencil size={14} /> Modify
            </button>
          ) : (
            <button onClick={handleFollow} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: isFollowing ? '#fff' : '#5A7A6A', color: isFollowing ? '#5A7A6A' : '#fff', border: isFollowing ? '1px solid #5A7A6A' : 'none', borderRadius: '999px', padding: '9px 18px', fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
              <Heart size={14} fill={isFollowing ? '#5A7A6A' : '#fff'} /> {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 5 }}>
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} style={{ width: currentSlide === i ? '22px' : '8px', height: '8px', borderRadius: '999px', border: 'none', background: currentSlide === i ? '#fff' : 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
          ))}
        </div>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {isEditOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '520px', maxHeight: '92vh', overflowY: 'auto', background: '#fff', borderRadius: '20px 20px 0 0', padding: '20px', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>Modify Header</h2>
              <button onClick={() => setIsEditOpen(false)} style={{ background: '#F2F2F2', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Hotel Name</label>
            <input value={editForm.hotelName} onChange={e => setEditForm({ ...editForm, hotelName: e.target.value })} style={{ width: '100%', height: '46px', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 12px', boxSizing: 'border-box', fontSize: '14px', outline: 'none', marginBottom: '12px' }} />
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Tagline - Serenity. Luxury...</label>
            <input value={editForm.tagline} onChange={e => setEditForm({ ...editForm, tagline: e.target.value })} style={{ width: '100%', height: '46px', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 12px', boxSizing: 'border-box', fontSize: '14px', outline: 'none', marginBottom: '12px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Rating - 4.9/5</label>
                <input value={editForm.rating} onChange={e => setEditForm({ ...editForm, rating: e.target.value })} style={{ width: '100%', height: '46px', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 12px', boxSizing: 'border-box', fontSize: '14px', outline: 'none', marginBottom: '12px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Contact</label>
                <input value={editForm.contact} onChange={e => setEditForm({ ...editForm, contact: e.target.value })} style={{ width: '100%', height: '46px', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 12px', boxSizing: 'border-box', fontSize: '14px', outline: 'none', marginBottom: '12px' }} />
              </div>
            </div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Suites Text</label>
            <input value={editForm.suites} onChange={e => setEditForm({ ...editForm, suites: e.target.value })} style={{ width: '100%', height: '46px', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 12px', boxSizing: 'border-box', fontSize: '14px', outline: 'none', marginBottom: '12px' }} />
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Cancellation Text</label>
            <input value={editForm.cancellation} onChange={e => setEditForm({ ...editForm, cancellation: e.target.value })} style={{ width: '100%', height: '46px', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 12px', boxSizing: 'border-box', fontSize: '14px', outline: 'none', marginBottom: '12px' }} />
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Address</label>
            <input value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} style={{ width: '100%', height: '46px', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 12px', boxSizing: 'border-box', fontSize: '14px', outline: 'none', marginBottom: '14px' }} />
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '8px' }}>Cover Photos - 5 tak ({editCovers.length + newCoverFiles.length}/5)</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {editCovers.map((url, idx) => (
                <div key={idx} style={{ position: 'relative', width: '78px', height: '58px', borderRadius: '10px', overflow: 'hidden' }}>
                  <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => handleRemoveCover(idx)} style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><Trash2 size={11} /></button>
                </div>
              ))}
              {newCoverFiles.map((f, idx) => (
                <div key={`new-${idx}`} style={{ position: 'relative', width: '78px', height: '58px', borderRadius: '10px', overflow: 'hidden', border: '1px dashed #5A7A6A' }}>
                  <img src={URL.createObjectURL(f)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', bottom: '2px', left: '4px', fontSize: '9px', background: '#5A7A6A', color: '#fff', padding: '1px 5px', borderRadius: '999px' }}>NEW</span>
                </div>
              ))}
              {(editCovers.length + newCoverFiles.length) < 5 && (
                <label style={{ width: '78px', height: '58px', borderRadius: '10px', border: '1px dashed #5A7A6A', background: '#F7F2E9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Plus size={18} color="#5A7A6A" /><span style={{ fontSize: '10px', color: '#5A7A6A' }}>Add</span>
                  <input type="file" accept="image/*" hidden multiple onChange={e => { const files = Array.from(e.target.files || []); if (editCovers.length + newCoverFiles.length + files.length > 5) { alert('Sirf 5 tak'); return; } setNewCoverFiles([...newCoverFiles, ...files]); }} />
                </label>
              )}
            </div>
            <button onClick={handleSaveEdit} disabled={saving} style={{ width: '100%', height: '50px', borderRadius: '12px', border: 'none', background: '#5A7A6A', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              {saving ? 'Saving...' : <><Check size={16} /> Save Changes</>}
            </button>
            {uploading && <p style={{ fontSize: '12px', textAlign: 'center', color: '#888', marginTop: '8px' }}>Uploading photos...</p>}
          </div>
        </div>
      )}
    </div>
  );
}