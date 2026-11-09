"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, Phone, Mail, Clock, Pencil, X, Search } from 'lucide-react';

export default function FooterTab({ profileId }: { profileId: string }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [businessName, setBusinessName] = useState('TASOMI HOTEL');
  const [tagline, setTagline] = useState('Serenity. Luxury. Timeless Calm.');
  const [address, setAddress] = useState('123 Coastal Ridge, Bali, Indonesia');
  const [phone, setPhone] = useState('+62 361 234 5678');
  const [email, setEmail] = useState('hello@tasomihotel.com');
  const [hours, setHours] = useState('Reception: 24/7');
  const [mapUrl, setMapUrl] = useState('https://maps.google.com/maps?q=Siliguri&t=&z=13&ie=UTF8&iwloc=&output=embed');
  const [mapLabel, setMapLabel] = useState('TASOMI HOTEL • Bali, Indonesia');

  const [checkIn, setCheckIn] = useState('2024-11-15');
  const [checkOut, setCheckOut] = useState('2024-11-20');
  const [rooms, setRooms] = useState('1 Room');
  const [newsEmail, setNewsEmail] = useState('');

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
      setBusinessName(prof.business_name || prof.name || 'TASOMI HOTEL');
      setTagline(prof.tagline || 'Serenity. Luxury. Timeless Calm.');
      if (prof.footer_data) {
        setAddress(prof.footer_data.address || address);
        setPhone(prof.footer_data.phone || prof.phone || phone);
        setEmail(prof.footer_data.email || prof.email || email);
        setHours(prof.footer_data.hours || hours);
        setMapUrl(prof.footer_data.mapUrl || mapUrl);
        setMapLabel(prof.footer_data.mapLabel || `${prof.business_name || 'TASOMI HOTEL'} • ${prof.location || 'Bali, Indonesia'}`);
      } else {
        setPhone(prof.phone || phone);
        setEmail(prof.email || email);
        setAddress(prof.location || prof.address || address);
      }
    };
    load();
  }, [profileId]);

  const isOwner = currentUserId && profileId && currentUserId === profileId;

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { address, phone, email, hours, mapUrl, mapLabel };
      if (profile) await supabase.from('profiles').update({ footer_data: payload, business_name: businessName, tagline }).eq('id', profile.id);
      setIsEditOpen(false);
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  };

  const handleSearch = () => {
    const msg = `Hi ${businessName}! I want to book:\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nRooms: ${rooms}`;
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSubscribe = async () => {
    if (!newsEmail.includes('@')) { alert('Sahi email daalo'); return; }
    try { await supabase.from('newsletter_subscribers').insert({ email: newsEmail, profile_id: profile?.id }); } catch (e) { }
    alert('Subscribed! Exclusive offers milenge.');
    setNewsEmail('');
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ===== CONTACT + MAP + BOOKING - Beige ===== */}
      <div className="footer-top" style={{ width: '100%', background: '#F2ECE3', padding: isDesktop ? '24px 0 20px 0' : '20px 0 18px 0', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', overflow: 'hidden' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
          @media (min-width: 900px) { .footer-top, .footer-bottom { width: 100vw !important; margin-left: calc(-50vw + 50%) !important; } }
        `}</style>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isDesktop ? '0 40px' : '0 16px', display: 'flex', flexDirection: isDesktop ? 'row' : 'column', gap: isDesktop ? '40px' : '20px', boxSizing: 'border-box', position: 'relative' }}>
          {isOwner && <button onClick={() => setIsEditOpen(true)} style={{ position: 'absolute', top: '-4px', right: isDesktop ? '40px' : '16px', background: '#fff', border: '1px solid #E5DDCF', borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 5 }}><Pencil size={12} /> Edit</button>}

          {/* LEFT - Contact - NO SOCIAL ICONS */}
          <div style={{ flex: isDesktop ? '0 0 32%' : '1' }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: isDesktop ? '32px' : '26px', fontWeight: 600, color: '#111', margin: 0 }}>Contact Us</h2>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#111', margin: '4px 0 16px 0' }}>We're here to help with your stay.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}><MapPin size={17} style={{ marginTop: '2px', flexShrink: 0 }} /><span style={{ fontSize: '13.5px', fontWeight: 500 }}>{address}</span></div>
              <a href={`tel:${phone}`} style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#111', textDecoration: 'none' }}><Phone size={17} /><span style={{ fontSize: '13.5px', fontWeight: 500 }}>{phone}</span></a>
              <a href={`mailto:${email}`} style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#111', textDecoration: 'none' }}><Mail size={17} /><span style={{ fontSize: '13.5px', fontWeight: 500 }}>{email}</span></a>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><Clock size={17} /><span style={{ fontSize: '13.5px', fontWeight: 500 }}>{hours}</span></div>
            </div>
          </div>

          {/* RIGHT - Map + Booking */}
          <div style={{ flex: 1 }}>
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: isDesktop ? '180px' : '170px', background: '#E8E0D0' }}>
              <iframe src={mapUrl} style={{ width: '100%', height: '100%', border: 0 }} loading="lazy" />
              <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' }}>{mapLabel}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '110px' }}><label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '5px' }}>Check-in</label><input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid #D9C9A8', background: '#fff', padding: '0 10px', boxSizing: 'border-box', fontSize: '13px' }} /></div>
              <div style={{ flex: 1, minWidth: '110px' }}><label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '5px' }}>Check-out</label><input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid #D9C9A8', background: '#fff', padding: '0 10px', boxSizing: 'border-box', fontSize: '13px' }} /></div>
              <div style={{ flex: 1, minWidth: '90px' }}><label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '5px' }}>Rooms</label><select value={rooms} onChange={e => setRooms(e.target.value)} style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid #D9C9A8', background: '#fff', padding: '0 10px', boxSizing: 'border-box', fontSize: '13px' }}><option>1 Room</option><option>2 Rooms</option><option>3 Rooms</option><option>4+ Rooms</option></select></div>
            </div>
            <button onClick={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px auto 0', background: '#5A7A6A', color: '#fff', border: 'none', borderRadius: '8px', padding: '11px 22px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}><Search size={16} /> Search Availability</button>
            <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, margin: '10px 0 0 0' }}>Secure booking &nbsp;•&nbsp; No booking fees &nbsp;•&nbsp; Free cancellation up to 48h</p>
          </div>
        </div>
      </div>

      {/* ===== GREEN FOOTER ===== */}
      <div className="footer-bottom" style={{ width: '100%', background: '#5A7A6A', color: '#fff', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isDesktop ? '28px 40px 0' : '24px 16px 0', display: 'flex', flexDirection: isDesktop ? 'row' : 'column', gap: isDesktop ? '0' : '20px', boxSizing: 'border-box' }}>
          <div style={{ flex: 1, textAlign: isDesktop ? 'left' : 'center' }}>
            <div style={{ fontSize: '28px' }}>🌿</div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px', fontWeight: 600, letterSpacing: '1px', margin: '6px 0 0 0', textTransform: 'uppercase' }}>{businessName}</h3>
            <p style={{ fontSize: '12.5px', opacity: 0.9, margin: '4px 0 0 0' }}>{tagline}</p>
          </div>
          <div style={{ flex: 1, borderLeft: isDesktop ? '1px solid rgba(255,255,255,0.2)' : 'none', paddingLeft: isDesktop ? '28px' : '0', textAlign: isDesktop ? 'left' : 'center' }}>
            <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '19px', fontWeight: 500, margin: '0 0 10px 0' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 8px', fontSize: '14px', justifyContent: isDesktop ? 'flex-start' : 'center' }}>
              <button onClick={() => scrollTo('top')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', padding: 0 }}>Home</button><span>|</span>
              <button onClick={() => scrollTo('products')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', padding: 0 }}>Rooms</button><span>|</span>
              <button onClick={() => scrollTo('products')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', padding: 0 }}>Offers</button><span>|</span>
              <button onClick={() => scrollTo('gallery')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', padding: 0 }}>Gallery</button><span>|</span>
              <button onClick={() => scrollTo('contact')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', padding: 0 }}>Contact</button>
            </div>
          </div>
          <div style={{ flex: 1, borderLeft: isDesktop ? '1px solid rgba(255,255,255,0.2)' : 'none', paddingLeft: isDesktop ? '28px' : '0', textAlign: isDesktop ? 'left' : 'center' }}>
            <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '19px', fontWeight: 500, margin: '0 0 6px 0' }}>Newsletter</h4>
            <p style={{ fontSize: '13.5px', opacity: 0.9, margin: '0 0 10px 0' }}>Join for exclusive offers & updates</p>
            <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', maxWidth: '320px', margin: isDesktop ? '0' : '0 auto' }}>
              <input value={newsEmail} onChange={e => setNewsEmail(e.target.value)} placeholder="Your email" style={{ flex: 1, height: '40px', border: 'none', padding: '0 12px', fontSize: '13px', outline: 'none', background: '#F2ECE3', color: '#111' }} />
              <button onClick={handleSubscribe} style={{ background: '#E8DCC3', border: 'none', padding: '0 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#111' }}>Subscribe</button>
            </div>
          </div>
        </div>
        <div style={{ background: '#4A6554', marginTop: '20px', padding: isDesktop ? '14px 40px' : '14px 16px', display: 'flex', flexDirection: isDesktop ? 'row' : 'column', justifyContent: 'space-between', alignItems: 'center', gap: '6px', maxWidth: '1400px', margin: '20px auto 0' }}>
          <p style={{ fontSize: '12.5px', margin: 0 }}>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
          <p style={{ fontSize: '12.5px', margin: 0 }}>Privacy Policy &nbsp;•&nbsp; Terms &nbsp;•&nbsp; Cookies</p>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '480px', background: '#fff', borderRadius: '20px 20px 0 0', padding: '20px', boxSizing: 'border-box', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}><h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>Edit Footer / Contact</h3><button onClick={() => setIsEditOpen(false)} style={{ background: '#F2F2F2', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} /></button></div>
            {[
              { l: 'Business Name', v: businessName, s: setBusinessName },
              { l: 'Tagline', v: tagline, s: setTagline },
              { l: 'Address', v: address, s: setAddress },
              { l: 'Phone (WhatsApp)', v: phone, s: setPhone },
              { l: 'Email', v: email, s: setEmail },
              { l: 'Hours', v: hours, s: setHours },
              { l: 'Map Label', v: mapLabel, s: setMapLabel },
              { l: 'Map Embed URL', v: mapUrl, s: setMapUrl },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: '12px' }}><label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>{f.l}</label><input value={f.v} onChange={e => f.s(e.target.value)} style={{ width: '100%', height: '46px', borderRadius: '10px', border: '1px solid #E5E5E5', padding: '0 12px', boxSizing: 'border-box', fontSize: '14px' }} /></div>
            ))}
            <button onClick={handleSave} disabled={saving} style={{ width: '100%', height: '50px', borderRadius: '12px', border: 'none', background: '#5A7A6A', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      )}
    </>
  );
}