"use client";
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Image as ImageIcon } from 'lucide-react';

type Filter = 'natural' | 'softGlow' | 'fresh' | 'golden' | 'minimal' | 'cinematic';

export default function CreatePostBox({ activeTab, onPostCreated }: { activeTab: string, onPostCreated?: () => void }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [smooth, setSmooth] = useState(65);
  const [bright, setBright] = useState(62);
  const [filter, setFilter] = useState<Filter>('natural');
  const [beforePos, setBeforePos] = useState(50);
  const [isOriginal, setIsOriginal] = useState(false);
  const [avatar, setAvatar] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if(data.user){
        const { data: prof } = await supabase.from('profiles').select('avatar_url').eq('id', data.user.id).single();
        if(prof?.avatar_url) setAvatar(prof.avatar_url);
      }
    });
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setImage(f); setPreview(URL.createObjectURL(f)); setShowEditor(true); }
  };

  const getBeautyStyle = (forThumb?: Filter) => {
    const af = forThumb || filter;
    const s = smooth/100;
    const b = bright/100;
    const i = isOriginal ? 0 : 0.78;
    let base = `brightness(${1 + b*0.12}) contrast(${1 - s*0.05})`;
    if(af==='softGlow') base+=` sepia(${0.12*i}) blur(${s*0.5}px)`;
    if(af==='golden') base+=` sepia(${0.22*i}) saturate(${1+0.18*i})`;
    if(af==='fresh') base+=` saturate(${1+0.15*i})`;
    if(af==='minimal') base+=` grayscale(${0.18*i})`;
    if(af==='cinematic') base+=` contrast(${1+0.12*i})`;
    return base;
  };

  // Filter ko actual image pe lagake naya file banao
  const getFilteredFile = async (): Promise<File> => {
    if(isOriginal || !image) return image!;
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = preview;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.filter = getBeautyStyle();
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if(blob) resolve(new File([blob], image.name, { type: 'image/jpeg' }));
          else resolve(image);
        }, 'image/jpeg', 0.92);
      };
    });
  };

  const handlePost = async () => {
    if (!content.trim() && !image) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if(!user) throw new Error("Not logged in");

      let url: string | null = null;
      if(image){
        const finalFile = await getFilteredFile();
        const name = `${user.id}/${Date.now()}_${finalFile.name}`;
        const { data: up, error: upErr } = await supabase.storage.from('post-images').upload(name, finalFile);
        if(upErr) throw upErr;
        if(up){
          const { data: pub } = supabase.storage.from('post-images').getPublicUrl(name);
          url = pub.publicUrl;
        }
      }

      // 1. POST INSERT -> homefeed + profile dono me same user_id se ayega
      const { data: newPost, error: postErr } = await supabase.from('posts').insert({
        user_id: user.id,
        content: content.trim(),
        image_url: url,
        category: activeTab, // motivation, dream, etc
      }).select().single();
      
      if(postErr) throw postErr;

      // 2. NOTIFICATIONS LOGIC - Motivation wala
      if(newPost){
        if(activeTab === 'motivation'){
          // motivation feed ke liye notification
          await supabase.from('notifications').insert({
            user_id: user.id, // self notification bhi, taki notification page pe dikhe
            actor_id: user.id,
            post_id: newPost.id,
            type: 'motivation_post',
            message: `You posted a motivation: "${content.slice(0,40)}"`,
          });

          // Followers ko bhi (agar follows table hai)
          const { data: followers } = await supabase.from('follows').select('follower_id').eq('following_id', user.id);
          if(followers && followers.length > 0){
            const bulk = followers.map(f => ({
              user_id: f.follower_id,
              actor_id: user.id,
              post_id: newPost.id,
              type: 'motivation_post',
              message: 'posted new motivation',
            }));
            await supabase.from('notifications').insert(bulk);
          }
        } else {
          // normal post notification
          await supabase.from('notifications').insert({
            user_id: user.id,
            actor_id: user.id,
            post_id: newPost.id,
            type: 'new_post',
            message: `You posted in ${activeTab}`,
          });
        }
      }

      setContent(""); setImage(null); setPreview(""); setShowEditor(false);
      if(onPostCreated) onPostCreated();

    } catch (err) {
      console.error(err);
      alert("Post failed: " + (err as any).message);
    } finally {
      setLoading(false);
    }
  };

  const WhiteToRedSlider = ({ value, onChange }: { value:number, onChange:(v:number)=>void }) => (
    <div style={{ position:'relative', flex:1, height:24, display:'flex', alignItems:'center' }}>
      <div style={{ position:'absolute', width:'100%', height:6, borderRadius:10, background:'#F0E6D3' }} />
      <div style={{ position:'absolute', width:`${value}%`, height:6, borderRadius:10, background:`linear-gradient(90deg, #FFFFFF 0%, #FFE5E5 40%, #FF9A9A 70%, #D9361E 100%)` }} />
      <input type="range" min={0} max={100} value={value} onChange={e=>onChange(Number(e.target.value))}
        style={{ width:'100%', appearance:'none', background:'transparent', position:'relative', zIndex:2, height:24 }} />
      <style>{`input[type=range]::-webkit-slider-thumb{ -webkit-appearance:none; width:20px; height:20px; border-radius:50%; background:#fff; border:2px solid #2D2415; cursor:pointer; }`}</style>
    </div>
  );

  if(!showEditor){
    return (
      <div style={{ width:'100%', display:'flex', justifyContent:'center', background:'#F6F1E8', padding:'10px 0 6px' }}>
        <div style={{ width:'100%', maxWidth:720, margin:'0 16px', background:'#FFFEFB', borderRadius:18, padding:'12px', border:'1px solid #EFE5D2', display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'#EDE6D3', overflow:'hidden', flexShrink:0 }}>
              {avatar && <img src={avatar} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />}
            </div>
            <input value={content} onChange={e=>setContent(e.target.value)} placeholder="Post your feelings" 
              style={{ flex:1, height:40, background:'#F8F2E6', border:'1px solid #EDE2CD', borderRadius:12, padding:'0 14px', fontSize:13, outline:'none' }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:8, borderTop:'1px solid #F0E6D3' }}>
            <button onClick={()=>fileInputRef.current?.click()}
              style={{ display:'flex', alignItems:'center', gap:6, height:36, padding:'0 14px', borderRadius:12, border:'1px solid #EDE2CD', background:'#FFFEFB', color:'#2D2415', fontSize:13, fontWeight:600, cursor:'pointer' }}>
              <ImageIcon size={18} strokeWidth={1.8} />
              Photo
            </button>
            <button onClick={handlePost} disabled={loading || (!content.trim() && !image)}
              style={{ height:36, padding:'0 20px', borderRadius:12, border:'none', background: (content.trim() || image) ? '#2D2415' : '#D8CFC0', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' }}>
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFile} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:99, background:'#F8F3EB', display:'flex', flexDirection:'column' }}>
      <div style={{ height:56, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px' }}>
        <div onClick={()=>setShowEditor(false)} style={{ fontSize:24, cursor:'pointer' }}>‹</div>
        <div style={{ fontFamily:'serif', fontSize:26, fontWeight:700 }}>Tasomi</div>
        <div onClick={()=>setShowEditor(false)} style={{ width:32, height:32, borderRadius:'50%', border:'1px solid #2D2415', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>✕</div>
      </div>
      <div ref={containerRef} style={{ position:'relative', margin:'0 12px', borderRadius:18, overflow:'hidden', height:340, background:'#E89A3A' }}
        onTouchMove={e=>{ const r=containerRef.current?.getBoundingClientRect(); if(!r) return; const x=e.touches[0].clientX - r.left; setBeforePos(Math.max(5,Math.min(95,(x/r.width)*100))); }}>
        <img src={preview} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', filter:isOriginal?'':getBeautyStyle() }} alt="" />
        <div style={{ position:'absolute', inset:0, width:`${beforePos}%`, overflow:'hidden', borderRight:'2px solid #333' }}>
          <img src={preview} style={{ width:`${100*100/beforePos}%`, height:'100%', objectFit:'cover' }} alt="" />
        </div>
        <div style={{ position:'absolute', left:`${beforePos}%`, top:'50%', transform:'translate(-50%,-50%)', width:30, height:30, borderRadius:'50%', background:'#fff', border:'2px solid #333' }} />
      </div>
      <div style={{ background:'#FFFEFB', borderTopLeftRadius:24, borderTopRightRadius:24, marginTop:12, padding:'12px 16px 16px', flex:1, overflowY:'auto' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}><span style={{ fontSize:12, fontWeight:700, width:58 }}>Smooth</span><WhiteToRedSlider value={smooth} onChange={setSmooth} /></div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}><span style={{ fontSize:12, fontWeight:700, width:58 }}>☀️ Bright</span><WhiteToRedSlider value={bright} onChange={setBright} /></div>
        </div>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Filters</div>
        <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:8 }}>
          {(['natural','softGlow','fresh','golden','minimal','cinematic'] as Filter[]).map(f=>(
            <div key={f} onClick={()=>setFilter(f)} style={{ minWidth:68, cursor:'pointer' }}>
              <div style={{ width:68, height:68, borderRadius:12, overflow:'hidden', border:filter===f?'2px solid #D9361E':'1px solid #EDE2CD' }}>
                <img src={preview} style={{ width:'100%', height:'100%', objectFit:'cover', filter:getBeautyStyle(f) }} alt="" />
              </div>
              <div style={{ fontSize:11, textAlign:'center', marginTop:5 }}>{f}</div>
            </div>
          ))}
        </div>
        <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Post your feelings..." style={{ marginTop:16, width:'100%', minHeight:70, background:'#F8F2E6', border:'1px solid #EDE2CD', borderRadius:14, padding:'12px 14px', fontSize:13, outline:'none' }} />
        <div style={{ display:'flex', gap:10, marginTop:14 }}>
          <button onClick={()=>{ setImage(null); setPreview(""); setShowEditor(false); }} style={{ flex:1, height:44, borderRadius:12, border:'1px solid #EDE2CD', background:'#FFFEFB' }}>↻ Retake</button>
          <button onClick={handlePost} style={{ flex:1, height:44, borderRadius:12, border:'none', background:'#eee0c7', color:'rgb(16, 15, 15)', fontWeight:700 }}>{loading?'Posting...':'Upload'}</button>
        </div>
      </div>
    </div>
  );
}