"use client";
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Image as ImageIcon, Video as VideoIcon, Smile, X, Camera, FolderOpen, Type, Sparkles, Play, Pause, SwitchCamera, Circle } from 'lucide-react';

type Filter = 'natural' | 'softGlow' | 'fresh' | 'golden' | 'minimal' | 'cinematic';
type MediaType = 'image' | 'video' | null;
type Step = 'box' | 'picker' | 'edit' | 'camera';
type TextStyle = 'classic' | 'neon' | 'pill' | 'bold';

export default function CreateBoxPost({ activeTab, onPostCreated }: { activeTab: string, onPostCreated?: () => void }) {
  const [content, setContent] = useState("");
  const [feeling, setFeeling] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('box');
  const [pickerFor, setPickerFor] = useState<MediaType>('image');
  const [showFeeling, setShowFeeling] = useState(false);

  // Edit - Simple
  const [smooth, setSmooth] = useState(65);
  const [bright, setBright] = useState(62);
  const [filter, setFilter] = useState<Filter>('natural');
  const [overlayText, setOverlayText] = useState("");
  const [overlayColor, setOverlayColor] = useState("#FFFFFF");
  const [overlayPos, setOverlayPos] = useState<'top' | 'center' | 'bottom'>('center');
  const [overlaySize, setOverlaySize] = useState(28);
  const [textStyle, setTextStyle] = useState<TextStyle>('classic');
  const [editTab, setEditTab] = useState<'beauty' | 'text'>('beauty');

  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");

  // Camera
  const [camFacing, setCamFacing] = useState<'user' | 'environment'>('environment');
  const [isRecording, setIsRecording] = useState(false);
  const [recTime, setRecTime] = useState(0);
  const camVideoRef = useRef<HTMLVideoElement>(null);
  const camStreamRef = useRef<MediaStream | null>(null);
  const camRecorderRef = useRef<MediaRecorder | null>(null);
  const camChunksRef = useRef<Blob[]>([]);
  const recTimerRef = useRef<any>(null);

  const galleryImageRef = useRef<HTMLInputElement>(null);
  const galleryVideoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const FEELINGS = ['😊 Happy', '😍 Loved', '😎 Cool', '🤩 Excited', '😌 Relaxed', '💪 Motivated', '🙏 Blessed', '🎉 Celebrating', '✨ Inspired', '❤️ Grateful'];
  const COLORS = ['#FFFFFF', '#FFD700', '#FF6B6B', '#4ECDC4', '#FF9FF3', '#000000'];
  const FILTERS: Filter[] = ['natural', 'softGlow', 'fresh', 'golden', 'minimal', 'cinematic'];
  const TEXT_STYLES: { id: TextStyle, label: string }[] = [
    { id: 'classic', label: 'Classic' },
    { id: 'neon', label: 'Neon' },
    { id: 'pill', label: 'Pill' },
    { id: 'bold', label: 'Bold' },
  ];

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: prof } = await supabase.from('profiles').select('avatar_url, full_name, username, business_name').eq('id', data.user.id).single();
        if (prof?.avatar_url) setAvatar(prof.avatar_url);
        setUserName(prof?.full_name || prof?.business_name || prof?.username || 'You');
      }
    });
    return () => stopCamera();
  }, []);

  // ===== LIVE CAMERA =====
  const startCamera = async (facing: 'user' | 'environment' = camFacing) => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: pickerFor === 'video',
      });
      camStreamRef.current = stream;
      setStep('camera');
      setTimeout(() => { if (camVideoRef.current) camVideoRef.current.srcObject = stream; }, 50);
    } catch (e) {
      alert('Camera permission allow karo, ya Gallery use karo');
      setStep('picker');
    }
  };

  const stopCamera = () => {
    if (recTimerRef.current) clearInterval(recTimerRef.current);
    setIsRecording(false);
    camStreamRef.current?.getTracks().forEach(t => t.stop());
    camStreamRef.current = null;
  };

  const switchCamera = async () => {
    const next = camFacing === 'user' ? 'environment' : 'user';
    setCamFacing(next);
    await startCamera(next);
  };

  const capturePhoto = () => {
    const video = camVideoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    if (camFacing === 'user') { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const f = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
      stopCamera();
      setFile(f); setMediaType('image'); setPreview(URL.createObjectURL(f));
      resetEdit(); setStep('edit');
    }, 'image/jpeg', 0.92);
  };

  const toggleRecord = () => {
    if (isRecording) {
      camRecorderRef.current?.stop();
      if (recTimerRef.current) clearInterval(recTimerRef.current);
      setIsRecording(false);
      return;
    }
    const stream = camStreamRef.current;
    if (!stream) return;
    camChunksRef.current = [];
    const rec = new MediaRecorder(stream, { mimeType: 'video/webm' });
    camRecorderRef.current = rec;
    rec.ondataavailable = e => { if (e.data.size) camChunksRef.current.push(e.data); };
    rec.onstop = () => {
      const blob = new Blob(camChunksRef.current, { type: 'video/webm' });
      const f = new File([blob], `reel_${Date.now()}.webm`, { type: 'video/webm' });
      stopCamera();
      setFile(f); setMediaType('video'); setPreview(URL.createObjectURL(f));
      resetEdit(); setStep('edit');
    };
    rec.start();
    setIsRecording(true);
    setRecTime(0);
    recTimerRef.current = setInterval(() => setRecTime(t => t + 1), 1000);
  };

  const resetEdit = () => {
    setFilter('natural'); setSmooth(65); setBright(62); setOverlayText("");
    setOverlayColor("#FFFFFF"); setOverlayPos('center'); setOverlaySize(28); setTextStyle('classic'); setEditTab('beauty');
  };

  const openPicker = (type: MediaType) => { setPickerFor(type); setStep('picker'); };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, type: MediaType) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (type === 'video' && f.size > 100 * 1024 * 1024) { alert('Video 100MB se chhota hona chahiye'); return; }
    setFile(f); setMediaType(type); setPreview(URL.createObjectURL(f));
    resetEdit(); setStep('edit');
    e.target.value = '';
  };

  const clearAll = () => {
    stopCamera();
    setFile(null); setPreview(""); setMediaType(null); setStep('box');
    setContent(""); setFeeling(""); setOverlayText("");
  };

  const getBeautyStyle = (forThumb?: Filter) => {
    const af = forThumb || filter;
    const s = smooth / 100; const b = bright / 100; const i = 0.78;
    let base = `brightness(${1 + b * 0.12}) contrast(${1 - s * 0.05})`;
    if (af === 'softGlow') base += ` sepia(${0.12 * i}) blur(${s * 0.5}px)`;
    if (af === 'golden') base += ` sepia(${0.22 * i}) saturate(${1 + 0.18 * i})`;
    if (af === 'fresh') base += ` saturate(${1 + 0.15 * i})`;
    if (af === 'minimal') base += ` grayscale(${0.18 * i})`;
    if (af === 'cinematic') base += ` contrast(${1 + 0.12 * i})`;
    return base;
  };

  // Premium Text Style - Preview ke liye
  const getTextStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute', left: '50%', transform: overlayPos === 'center' ? 'translate(-50%,-50%)' : 'translateX(-50%)',
      top: overlayPos === 'top' ? '10%' : overlayPos === 'center' ? '50%' : undefined,
      bottom: overlayPos === 'bottom' ? '10%' : undefined,
      color: overlayColor, fontSize: overlaySize, fontWeight: 800, textAlign: 'center',
      width: '88%', lineHeight: 1.25, wordBreak: 'break-word', pointerEvents: 'none', whiteSpace: 'pre-wrap',
      fontFamily: textStyle === 'bold' ? 'Arial Black, sans-serif' : 'Georgia, serif',
      letterSpacing: textStyle === 'bold' ? '0.5px' : '0px',
    };
    if (textStyle === 'classic') base.textShadow = '0 2px 12px rgba(0,0,0,0.8), 0 0 3px rgba(0,0,0,0.9)';
    if (textStyle === 'neon') base.textShadow = `0 0 12px ${overlayColor}, 0 0 24px ${overlayColor}, 0 2px 4px rgba(0,0,0,0.8)`;
    if (textStyle === 'pill') { base.background = 'rgba(0,0,0,0.55)'; base.backdropFilter = 'blur(6px)'; base.padding = '10px 16px'; base.borderRadius = 999; base.textShadow = '0 1px 4px rgba(0,0,0,0.6)'; }
    if (textStyle === 'bold') base.textShadow = '3px 3px 0 rgba(0,0,0,0.7), 0 2px 10px rgba(0,0,0,0.6)';
    return base;
  };

  // Photo pe Filter + Premium Text burn karo
  const getEditedImageFile = async (): Promise<File> => {
    if (!file || mediaType !== 'image') return file!;
    return new Promise((resolve) => {
      const img = new window.Image(); img.src = preview;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.filter = getBeautyStyle();
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';
        if (overlayText.trim()) {
          const fontSize = Math.max(32, (img.width * overlaySize) / 320);
          ctx.font = textStyle === 'bold' ? `900 ${fontSize}px Arial` : `800 ${fontSize}px Georgia, serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          const y = overlayPos === 'top' ? img.height * 0.12 : overlayPos === 'bottom' ? img.height * 0.88 : img.height * 0.5;
          const lines = overlayText.split('\n');
          lines.forEach((line, idx) => {
            const ly = y + (idx - (lines.length - 1) / 2) * (fontSize * 1.35);
            if (textStyle === 'pill') {
              const w = ctx.measureText(line).width + 60;
              ctx.fillStyle = 'rgba(0,0,0,0.55)';
              const r = fontSize;
              ctx.beginPath();
              ctx.roundRect(img.width / 2 - w / 2, ly - fontSize * 0.7, w, fontSize * 1.4, r);
              ctx.fill();
            }
            if (textStyle === 'neon') { ctx.shadowColor = overlayColor; ctx.shadowBlur = 30; }
            if (textStyle === 'bold') { ctx.lineWidth = fontSize / 10; ctx.strokeStyle = 'rgba(0,0,0,0.8)'; ctx.strokeText(line, img.width / 2, ly); }
            else { ctx.lineWidth = fontSize / 12; ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.strokeText(line, img.width / 2, ly); }
            ctx.shadowBlur = 0; ctx.fillStyle = overlayColor; ctx.fillText(line, img.width / 2, ly);
          });
        }
        canvas.toBlob((blob) => {
          if (blob) resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          else resolve(file);
        }, 'image/jpeg', 0.92);
      };
      img.onerror = () => resolve(file);
    });
  };

  const handlePost = async () => {
    if (!content.trim() && !file) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login first");
      let imageUrl: string | null = null;
      let videoUrl: string | null = null;
      if (file) {
        if (mediaType === 'image') {
          const finalFile = await getEditedImageFile();
          const name = `${user.id}/${Date.now()}_${finalFile.name}`;
          const { error } = await supabase.storage.from('post-images').upload(name, finalFile);
          if (error) throw error;
          const { data: pub } = supabase.storage.from('post-images').getPublicUrl(name);
          imageUrl = pub.publicUrl;
        } else {
          const name = `${user.id}/${Date.now()}_${file.name}`;
          const { error } = await supabase.storage.from('post-videos').upload(name, file, { contentType: file.type });
          if (error) {
            const { error: e2 } = await supabase.storage.from('post-images').upload(name, file);
            if (e2) throw e2;
            const { data: pub } = supabase.storage.from('post-images').getPublicUrl(name);
            videoUrl = pub.publicUrl;
          } else {
            const { data: pub } = supabase.storage.from('post-videos').getPublicUrl(name);
            videoUrl = pub.publicUrl;
          }
        }
      }
      const overlayPart = overlayText.trim() && mediaType === 'video' ? ` 📝 ${overlayText.trim()}` : '';
      const finalContent = `${content.trim()}${overlayPart}`.trim() || (feeling ? `Feeling ${feeling}` : '');
      const payload: any = { user_id: user.id, content: finalContent, image_url: imageUrl || videoUrl, category: activeTab };
      if (videoUrl) payload.video_url = videoUrl;
      if (mediaType) payload.media_type = mediaType;
      if (overlayText.trim()) payload.overlay_text = overlayText.trim();
      let res = await supabase.from('posts').insert(payload).select().single();
      if (res.error && res.error.code === 'PGRST204') {
        res = await supabase.from('posts').insert({ user_id: user.id, content: finalContent, image_url: imageUrl || videoUrl, category: activeTab }).select().single();
      }
      if (res.error) throw res.error;
      if (res.data) await supabase.from('notifications').insert({ user_id: user.id, actor_id: user.id, post_id: res.data.id, type: 'new_post', message: `You posted in ${activeTab}` });
      clearAll();
      if (onPostCreated) onPostCreated();
    } catch (err) { console.error(err); alert("Post failed: " + (err as any).message); }
    finally { setLoading(false); }
  };

  const Slider = ({ value, onChange, max = 100 }: { value: number, onChange: (v: number) => void, max?: number }) => (
    <div style={{ position: 'relative', flex: 1, height: 22, display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'absolute', width: '100%', height: 5, borderRadius: 10, background: '#F0E6D3' }} />
      <div style={{ position: 'absolute', width: `${(value / max) * 100}%`, height: 5, borderRadius: 10, background: '#2D2415' }} />
      <input type="range" min={0} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', appearance: 'none', background: 'transparent', position: 'relative', zIndex: 2, height: 22 }} />
      <style>{`input[type=range]::-webkit-slider-thumb{ -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#fff; border:2px solid #2D2415; cursor:pointer; }`}</style>
    </div>
  );

  // ===== 1. COMPACT BOX - Chhota =====
  if (step === 'box') {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
        <div style={{ width: '100%', maxWidth: 680, margin: '0 12px', background: '#FFFEFB', borderRadius: 16, padding: '10px', border: '1px solid #EFE5D2', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EDE6D3', overflow: 'hidden', flexShrink: 0 }}>
              {avatar ? <img src={avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>👤</div>}
            </div>
            <div onClick={() => setStep('edit')} style={{ flex: 1, minHeight: 38, background: '#F8F2E6', border: '1px solid #EDE2CD', borderRadius: 999, padding: '0 14px', fontSize: 13, color: '#8A7F6A', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              What's on your mind?
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, paddingTop: 8, borderTop: '1px solid #F0E6D3' }}>
            <button onClick={() => openPicker('image')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, height: 34, border: 'none', background: 'transparent', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><ImageIcon size={17} color="#45BD62" /> Photo</button>
            <button onClick={() => openPicker('video')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, height: 34, border: 'none', background: 'transparent', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><VideoIcon size={17} color="#E53935" /> Reel</button>
            <button onClick={() => { setShowFeeling(true); setStep('edit'); }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, height: 34, border: 'none', background: 'transparent', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Smile size={17} color="#F7B125" /> Feeling</button>
          </div>
        </div>
        <input ref={galleryImageRef} type="file" accept="image/*" hidden onChange={e => handleFile(e, 'image')} />
        <input ref={galleryVideoRef} type="file" accept="video/*" hidden onChange={e => handleFile(e, 'video')} />
      </div>
    );
  }

  // ===== 2. PICKER - Camera / Gallery =====
  if (step === 'picker') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setStep('box')}>
        <div style={{ width: '100%', maxWidth: 460, background: '#FFFEFB', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: '10px 14px 20px' }} onClick={e => e.stopPropagation()}>
          <div style={{ width: 36, height: 4, background: '#E5DDCC', borderRadius: 999, margin: '0 auto 12px' }} />
          <div style={{ fontSize: 16, fontWeight: 700, textAlign: 'center' }}>{pickerFor === 'image' ? 'Add Photo' : 'Add Reel'}</div>
          <div style={{ fontSize: 12, color: '#888', textAlign: 'center', marginBottom: 14 }}>Camera se lo ya Gallery se chuno</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => startCamera()} style={{ flex: 1, padding: '16px 8px', borderRadius: 14, border: '1px solid #EDE2CD', background: '#2D2415', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Camera size={22} color="#fff" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Camera</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{pickerFor === 'image' ? 'Live Camera' : 'Record Reel'}</span>
            </button>
            <button onClick={() => pickerFor === 'image' ? galleryImageRef.current?.click() : galleryVideoRef.current?.click()} style={{ flex: 1, padding: '16px 8px', borderRadius: 14, border: '1px solid #EDE2CD', background: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <FolderOpen size={22} color="#5A7A6A" />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Gallery</span>
              <span style={{ fontSize: 10, color: '#888' }}>Choose from Phone</span>
            </button>
          </div>
          <button onClick={() => setStep('box')} style={{ marginTop: 10, width: '100%', height: 40, borderRadius: 10, border: 'none', background: 'transparent', fontSize: 12, color: '#888', cursor: 'pointer' }}>Cancel</button>
        </div>
        <input ref={galleryImageRef} type="file" accept="image/*" hidden onChange={e => handleFile(e, 'image')} />
        <input ref={galleryVideoRef} type="file" accept="video/*" hidden onChange={e => handleFile(e, 'video')} />
      </div>
    );
  }

  // ===== 3. LIVE CAMERA SCREEN =====
  if (step === 'camera') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#000', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
          <span onClick={() => { stopCamera(); setStep('picker'); }} style={{ color: '#fff', fontSize: 24, cursor: 'pointer' }}>‹</span>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{pickerFor === 'image' ? 'Take Photo' : 'Record Reel'}</span>
          <button onClick={switchCamera} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><SwitchCamera size={18} color="#fff" /></button>
        </div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#111' }}>
          <video ref={camVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: camFacing === 'user' ? 'scaleX(-1)' : 'none' }} />
          {isRecording && <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', background: '#E53935', color: '#fff', fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} /> REC {Math.floor(recTime / 60)}:{String(recTime % 60).padStart(2, '0')}</div>}
          {pickerFor === 'video' && !isRecording && <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, padding: '5px 12px', borderRadius: 999 }}>Tap Red Button to Record</div>}
        </div>
        <div style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, background: '#000', paddingBottom: 18 }}>
          <button onClick={() => { stopCamera(); setStep('picker'); }} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: 13, cursor: 'pointer' }}>Gallery</button>
          {pickerFor === 'image' ? (
            <button onClick={capturePhoto} style={{ width: 68, height: 68, borderRadius: '50%', background: '#fff', border: '4px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Circle size={30} color="#111" /></button>
          ) : (
            <button onClick={toggleRecord} style={{ width: 68, height: 68, borderRadius: '50%', background: isRecording ? '#E53935' : '#fff', border: '4px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ width: isRecording ? 22 : 28, height: isRecording ? 22 : 28, borderRadius: isRecording ? 6 : '50%', background: isRecording ? '#fff' : '#E53935', display: 'block' }} />
            </button>
          )}
          <button onClick={switchCamera} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><SwitchCamera size={18} color="#fff" /></button>
        </div>
      </div>
    );
  }

  // ===== 4. EDITOR - Simple + Premium Text =====
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setStep('box')}>
      <div style={{ width: '100%', maxWidth: 520, maxHeight: '92dvh', background: '#FFFEFB', borderTopLeftRadius: 20, borderTopRightRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', borderBottom: '1px solid #F0E6D3', flexShrink: 0 }}>
          <span onClick={() => setStep('box')} style={{ fontSize: 22, cursor: 'pointer' }}>‹</span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>{file ? (mediaType === 'image' ? 'Edit Photo' : 'Edit Reel') : 'Create Post'}</span>
          <span onClick={clearAll} style={{ width: 30, height: 30, borderRadius: '50%', background: '#F0E6D3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={15} /></span>
        </div>

        <div style={{ overflowY: 'auto', padding: '12px 14px 14px', flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EDE6D3', overflow: 'hidden' }}>
              {avatar ? <img src={avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{userName}{feeling ? <span style={{ fontWeight: 400, color: '#666' }}> • {feeling}</span> : ''}</div>
          </div>

          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={`What's on your mind, ${userName.split(' ')[0] || 'Friend'}?`}
            style={{ marginTop: 10, width: '100%', minHeight: file ? 44 : 80, border: 'none', fontSize: 15, outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.5 }} />

          {(showFeeling || feeling) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 2 }}>
              {FEELINGS.map(f => (
                <span key={f} onClick={() => setFeeling(feeling === f ? "" : f)} style={{ padding: '5px 10px', borderRadius: 999, background: feeling === f ? '#2D2415' : '#F8F2E6', color: feeling === f ? '#fff' : '#333', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>{f}</span>
              ))}
            </div>
          )}

          {/* Preview - Chhota, Simple, No Before/After */}
          {file && mediaType === 'image' && (
            <div style={{ position: 'relative', marginTop: 10, borderRadius: 14, overflow: 'hidden', height: 260, background: '#111' }}>
              <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: getBeautyStyle() }} alt="" />
              {overlayText && <div style={getTextStyle()}>{overlayText}</div>}
              <button onClick={() => { setFile(null); setPreview(""); setMediaType(null); }} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} /></button>
            </div>
          )}
          {file && mediaType === 'video' && (
            <div style={{ position: 'relative', marginTop: 10, borderRadius: 14, overflow: 'hidden', background: '#000' }}>
              <video ref={videoRef} src={preview} controls playsInline loop style={{ width: '100%', maxHeight: 260, display: 'block', filter: getBeautyStyle() }} />
              {overlayText && <div style={getTextStyle()}>{overlayText}</div>}
            </div>
          )}

          {file && (
            <>
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <button onClick={() => setEditTab('beauty')} style={{ flex: 1, height: 36, borderRadius: 999, border: 'none', background: editTab === 'beauty' ? '#2D2415' : '#F0E6D3', color: editTab === 'beauty' ? '#fff' : '#333', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}><Sparkles size={14} /> Beauty</button>
                <button onClick={() => setEditTab('text')} style={{ flex: 1, height: 36, borderRadius: 999, border: 'none', background: editTab === 'text' ? '#2D2415' : '#F0E6D3', color: editTab === 'text' ? '#fff' : '#333', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}><Type size={14} /> Text</button>
              </div>

              {editTab === 'beauty' && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 11, fontWeight: 700, width: 52 }}>Smooth</span><Slider value={smooth} onChange={setSmooth} /></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 11, fontWeight: 700, width: 52 }}>Bright</span><Slider value={bright} onChange={setBright} /></div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
                    {FILTERS.map(f => (
                      <div key={f} onClick={() => setFilter(f)} style={{ minWidth: 58, cursor: 'pointer' }}>
                        <div style={{ width: 58, height: 58, borderRadius: 10, overflow: 'hidden', border: filter === f ? '2px solid #2D2415' : '1px solid #EDE2CD' }}>
                          {mediaType === 'image' ? <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: getBeautyStyle(f) }} alt="" />
                            : <video src={preview} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', filter: getBeautyStyle(f) }} />}
                        </div>
                        <div style={{ fontSize: 10, textAlign: 'center', marginTop: 4, textTransform: 'capitalize' }}>{f}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {editTab === 'text' && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>✍️ Premium Text</div>
                  <input value={overlayText} onChange={e => setOverlayText(e.target.value)} placeholder="Add stylish text on photo / reel..."
                    style={{ width: '100%', height: 42, border: '1px solid #EDE2CD', borderRadius: 10, padding: '0 12px', fontSize: 13, outline: 'none' }} />
                  {/* Style - Premium */}
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    {TEXT_STYLES.map(s => (
                      <button key={s.id} onClick={() => setTextStyle(s.id)} style={{ flex: 1, height: 32, borderRadius: 999, border: 'none', background: textStyle === s.id ? '#2D2415' : '#F0E6D3', color: textStyle === s.id ? '#fff' : '#333', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>{s.label}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
                    {COLORS.map(c => (
                      <div key={c} onClick={() => setOverlayColor(c)} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: overlayColor === c ? '3px solid #2D2415' : '1px solid #ddd', cursor: 'pointer', flexShrink: 0 }} />
                    ))}
                    <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
                      {(['top', 'center', 'bottom'] as const).map(p => (
                        <button key={p} onClick={() => setOverlayPos(p)} style={{ height: 28, padding: '0 10px', borderRadius: 999, border: 'none', background: overlayPos === p ? '#2D2415' : '#F0E6D3', color: overlayPos === p ? '#fff' : '#333', fontSize: 10, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize' }}>{p}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}><span style={{ fontSize: 11, fontWeight: 700, width: 36 }}>Size</span><Slider value={overlaySize} onChange={setOverlaySize} max={56} /></div>
                </div>
              )}
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, padding: '8px 10px', border: '1px solid #EDE2CD', borderRadius: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Add to post</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => openPicker('image')} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ImageIcon size={16} color="#45BD62" /></button>
              <button onClick={() => openPicker('video')} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><VideoIcon size={16} color="#E53935" /></button>
              <button onClick={() => setShowFeeling(!showFeeling)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Smile size={16} color="#F7B125" /></button>
            </div>
          </div>

          <button onClick={handlePost} disabled={loading || (!content.trim() && !file)}
            style={{ marginTop: 12, width: '100%', height: 44, borderRadius: 10, border: 'none', background: (content.trim() || file) ? '#2D2415' : '#E4E6EB', color: (content.trim() || file) ? '#fff' : '#999', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Posting...' : file ? (mediaType === 'video' ? 'Share Reel' : 'Share Photo') : 'Post'}
          </button>
        </div>
      </div>

      <input ref={galleryImageRef} type="file" accept="image/*" hidden onChange={e => handleFile(e, 'image')} />
      <input ref={galleryVideoRef} type="file" accept="video/*" hidden onChange={e => handleFile(e, 'video')} />
    </div>
  );
}