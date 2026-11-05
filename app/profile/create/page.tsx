"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, Briefcase, Sparkles, Camera, Plus, X, Loader2 } from 'lucide-react';
import ProfileTypeSelector from '@/components/ProfileTypeSelector';

type Role = 'personal' | 'business' | 'creator';
type OfferingType = 'retail' | 'cafe' | 'hotel' | 'architect' | 'service' | 'media' | 'vlogger';

const InputField = ({ label, placeholder, value, onChange, textarea = false }: any) => (
  <div style={{ width: '100%', marginBottom: '14px' }}>
    <label style={{ fontFamily: 'Georgia', fontSize: '13px', color: '#5C4A32', marginBottom: '6px', display: 'block', fontWeight: 500 }}>{label}</label>
    {textarea ? (
      <textarea placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', minHeight: '84px', padding: '14px', borderRadius: '12px', border: '1px solid #D9C9A8', background: '#FFFFFF', fontFamily: 'Georgia', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
    ) : (
      <input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', height: '48px', padding: '0 14px', borderRadius: '12px', border: '1px solid #D9C9A8', background: '#FFFFFF', fontFamily: 'Georgia', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
    )}
  </div>
);

const RoleCard = ({ id, title, Icon, active, onClick }: any) => (
  <button onClick={onClick} style={{ flex: 1, padding: '14px 10px', borderRadius: '12px', border: `1px solid ${active ? '#C8A86A' : '#D9C9A8'}`, background: active ? '#FFFFFF' : '#F3EBD9', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', boxShadow: active ? '0 6px 16px rgba(200,168,106,0.2)' : 'none' }}>
    <Icon size={20} color={active ? '#2D2415' : '#8A7D6B'} />
    <span style={{ fontFamily: 'Georgia', fontSize: '13px', fontWeight: 600, color: '#121212' }}>{title}</span>
  </button>
);

export default function CreateProfilePage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('personal');
  const [offeringsType, setOfferingsType] = useState<OfferingType>('retail');
  const [loading, setLoading] = useState(false);
  const [press, setPress] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const [personal, setPersonal] = useState({
    name: '', dob: '', address: '', bio: '', hobby: '',
    dpFile: null as File | null, dpPreview: '',
    coverFile: null as File | null, coverPreview: '',
  });

  const [business, setBusiness] = useState({
    businessName: '', address: '', contact: '', dealsIn: '', aboutUs: '', ourStories: '', whyChooseUs: '',
    coverFiles: [] as File[], coverPreviews: [] as string[],
  });

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        if (data.profile_role) setRole(data.profile_role);
        if (data.offerings_type) setOfferingsType(data.offerings_type);
        setPersonal(p => ({ ...p, name: data.name || '', dob: data.dob || '', address: data.address || '', bio: data.bio || '', hobby: data.hobby || '', dpPreview: data.avatar_url || '', coverPreview: data.cover_url || '' }));
        setBusiness(b => ({ ...b, businessName: data.business_name || '', address: data.address || '', contact: data.contact || '', dealsIn: data.deals_in || '', aboutUs: data.about_us || '', ourStories: data.our_stories || '', whyChooseUs: data.why_choose_us || '', coverPreviews: data.cover_urls || (data.cover_url ? [data.cover_url] : []) }));
      }
    };
    load();
  }, []);

  const uploadFile = async (file: File, bucket: 'avatars' | 'covers', userId: string) => {
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file, { cacheControl: '3600', upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      let avatarUrl = personal.dpPreview.startsWith('blob:') ? '' : personal.dpPreview;
      let coverUrl = personal.coverPreview.startsWith('blob:') ? '' : personal.coverPreview;
      let coverUrls: string[] = business.coverPreviews.filter(p => p.startsWith('http'));

      if (role === 'personal') {
        if (personal.dpFile) { setUploading('DP'); avatarUrl = await uploadFile(personal.dpFile, 'avatars', user.id); }
        if (personal.coverFile) { setUploading('cover'); coverUrl = await uploadFile(personal.coverFile, 'covers', user.id); }
      }
      if (role === 'business' || role === 'creator') {
        if (business.coverFiles.length > 0) {
          setUploading('covers');
          const uploaded: string[] = [];
          for (const file of business.coverFiles) { const url = await uploadFile(file, 'covers', user.id); uploaded.push(url); }
          coverUrls = [...business.coverPreviews.filter(p => p.startsWith('http')), ...uploaded].slice(0, 3);
        }
      }

      const payload: any = {
        id: user.id,
        profile_role: role,
        offerings_type: role === 'personal' ? 'retail' : offeringsType, // <-- YAHAN LINK ADD HUA
        address: role === 'personal' ? personal.address : business.address,
        updated_at: new Date().toISOString(),
      };

      if (role === 'personal') {
        payload.name = personal.name; payload.dob = personal.dob; payload.bio = personal.bio; payload.hobby = personal.hobby;
        payload.avatar_url = avatarUrl; payload.cover_url = coverUrl; payload.cover_urls = [];
      } else {
        payload.business_name = business.businessName; payload.name = business.businessName; payload.contact = business.contact;
        payload.deals_in = business.dealsIn; payload.about_us = business.aboutUs; payload.our_stories = business.ourStories;
        payload.why_choose_us = business.whyChooseUs; payload.cover_urls = coverUrls; payload.cover_url = coverUrls[0] || null;
      }

      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
      if (error) throw error;

      localStorage.setItem('drisyamn_has_account', 'true');
      router.push('/profile');
    } catch (err: any) { alert('Error: ' + err.message); } finally { setLoading(false); setUploading(null); }
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#F6F1E8', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '440px', padding: '24px 24px 32px', boxSizing: 'border-box' }}>
        <h1 style={{ fontFamily: 'Georgia', fontSize: '28px', fontWeight: 600, textAlign: 'center', margin: '12px 0 4px 0' }}>Create Profile</h1>
        <p style={{ fontFamily: 'Georgia', fontSize: '14px', color: '#6B5D4B', textAlign: 'center', marginBottom: '20px' }}>One profile, works everywhere</p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <RoleCard id="personal" title="Personal" Icon={User} active={role==='personal'} onClick={()=>setRole('personal')} />
          <RoleCard id="business" title="Business" Icon={Briefcase} active={role==='business'} onClick={()=>setRole('business')} />
          <RoleCard id="creator" title="Creator" Icon={Sparkles} active={role==='creator'} onClick={()=>setRole('creator')} />
        </div>

        {/* --- YAHAN NAYA COMPONENT ADD HUA --- */}
        {(role === 'business' || role === 'creator') && (
          <div style={{ marginBottom: '20px', marginLeft: '-12px', marginRight: '-12px' }}>
            <ProfileTypeSelector 
              currentType={offeringsType} 
              showSaveButton={false} 
              onSelected={(type) => setOfferingsType(type)} 
            />
          </div>
        )}

        {role === 'personal' && (
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <label style={{ flex: 1, height: '110px', borderRadius: '12px', border: '1px dashed #C8A86A', background: personal.coverPreview ? `url(${personal.coverPreview}) center/cover` : '#F3EBD9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
                {!personal.coverPreview && <><Camera size={20} color="#8A7D6B" /><span style={{ fontSize: '11px', fontFamily: 'Georgia', marginTop: '4px' }}>Cover</span></>}
                <input type="file" accept="image/*" hidden onChange={e=>{ const f=e.target.files?.[0]; if(f) setPersonal(s=>({...s, coverFile:f, coverPreview:URL.createObjectURL(f)}))}} />
              </label>
              <label style={{ width: '110px', height: '110px', borderRadius: '50%', border: '1px dashed #C8A86A', background: personal.dpPreview ? `url(${personal.dpPreview}) center/cover` : '#F3EBD9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
                {!personal.dpPreview && <><Camera size={20} color="#8A7D6B" /><span style={{ fontSize: '11px', fontFamily: 'Georgia', marginTop: '4px' }}>DP</span></>}
                <input type="file" accept="image/*" hidden onChange={e=>{ const f=e.target.files?.[0]; if(f) setPersonal(s=>({...s, dpFile:f, dpPreview:URL.createObjectURL(f)}))}} />
              </label>
            </div>
            <InputField label="Name" placeholder="Your full name" value={personal.name} onChange={(v:string)=>setPersonal(s=>({...s, name:v}))} />
            <InputField label="Date of birth" placeholder="DD/MM/YYYY" value={personal.dob} onChange={(v:string)=>setPersonal(s=>({...s, dob:v}))} />
            <InputField label="Address" placeholder="Your city, area" value={personal.address} onChange={(v:string)=>setPersonal(s=>({...s, address:v}))} />
            <InputField label="Bio" placeholder="Tell something about you" value={personal.bio} onChange={(v:string)=>setPersonal(s=>({...s, bio:v}))} textarea />
            <InputField label="Hobby" placeholder="Photography, Travel, Food..." value={personal.hobby} onChange={(v:string)=>setPersonal(s=>({...s, hobby:v}))} />
          </div>
        )}

        {(role === 'business' || role === 'creator') && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontFamily: 'Georgia', fontSize: '13px', color: '#5C4A32', marginBottom: '6px', display: 'block' }}>Cover - 3 images sliding {business.coverPreviews.length}/3</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[0,1,2].map(i=>{
                  const preview = business.coverPreviews[i];
                  return (
                    <div key={i} style={{ flex:1, height:'90px', borderRadius:'12px', border:'1px dashed #C8A86A', background: preview ? `url(${preview}) center/cover` : '#F3EBD9', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
                      {!preview ? (
                        <label style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                          <Plus size={18} color="#8A7D6B" /><span style={{ fontSize:'10px' }}>Image {i+1}</span>
                          <input type="file" accept="image/*" hidden onChange={e=>{ const files=Array.from(e.target.files||[]); if(business.coverPreviews.length+files.length>3){alert('Sirf 3'); return;} const urls=files.map(f=>URL.createObjectURL(f)); setBusiness(s=>({...s, coverFiles:[...s.coverFiles, ...files], coverPreviews:[...s.coverPreviews, ...urls]}))}} multiple />
                        </label>
                      ) : (
                        <button type="button" onClick={()=>setBusiness(s=>({...s, coverPreviews:s.coverPreviews.filter((_,idx)=>idx!==i), coverFiles:s.coverFiles.filter((_,idx)=>idx!==i)}))} style={{ position:'absolute', top:'4px', right:'4px', background:'rgba(0,0,0,0.6)', borderRadius:'50%', width:'20px', height:'20px', display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer' }}><X size={12} color="#fff" /></button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <InputField label="Establishments name/Service portfolio" placeholder=" Dr Sharma clinics " value={business.businessName} onChange={(v:string)=>setBusiness(s=>({...s, businessName:v}))} />
            <InputField label="Address" placeholder="Full address" value={business.address} onChange={(v:string)=>setBusiness(s=>({...s, address:v}))} />
            <InputField label="Contact" placeholder="Phone / WhatsApp" value={business.contact} onChange={(v:string)=>setBusiness(s=>({...s, contact:v}))} />
            <InputField label="Specializes in / Deals in" placeholder="Coffee, Bakery, Rooms..." value={business.dealsIn} onChange={(v:string)=>setBusiness(s=>({...s, dealsIn:v}))} />
            <InputField label="About us" placeholder="Your business story" value={business.aboutUs} onChange={(v:string)=>setBusiness(s=>({...s, aboutUs:v}))} textarea />
            <InputField label="Our stories" placeholder="Achievements, journey..." value={business.ourStories} onChange={(v:string)=>setBusiness(s=>({...s, ourStories:v}))} textarea />
            <InputField label="Why people choose us" placeholder="Quality, Service, Location..." value={business.whyChooseUs} onChange={(v:string)=>setBusiness(s=>({...s, whyChooseUs:v}))} textarea />
          </div>
        )}

        <div style={{ height: '20px' }} />
        <button onMouseDown={()=>setPress(true)} onMouseUp={()=>setPress(false)} onMouseLeave={()=>setPress(false)} onTouchStart={()=>setPress(true)} onTouchEnd={()=>setPress(false)} onClick={handleCreate} disabled={loading} style={{ width:'100%', height:'58px', borderRadius:'14px', border:'1px solid #C8A86A', backgroundColor: press ? '#FFFFFF' : '#F3EBD9', color:'#2D2415', fontFamily:'Georgia', fontSize:'17px', fontWeight:500, cursor:'pointer', transform: press ? 'scale(0.97)' : 'scale(1)', transition:'all 0.18s', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
          {loading ? <><Loader2 size={18} className="animate-spin" /> {uploading ? `Uploading ${uploading}...` : 'Creating...'}</> : 'Create Profile'}
        </button>
      </div>
    </div>
  );
}