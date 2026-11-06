"use client";
export const dynamic = 'force-dynamic';
import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Camera, ImageIcon, Video, X, Send, Sparkles, Sun, Droplets, Phone, PhoneOff, Mic, MicOff, Volume2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ChatDetailPage() {
  const router = useRouter();
  const params = useParams();
  const chatId = (params.id as string) || "test-chat";
  const myId = "user_123";

  const [text, setText] = useState("");
  const [showAttach, setShowAttach] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showBeauty, setShowBeauty] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [beauty, setBeauty] = useState(25);
  const [bright, setBright] = useState(110);
  const [smooth, setSmooth] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);

  const [callType, setCallType] = useState<"voice" | "video" | null>(null);
  const [callTime, setCallTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const galleryRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const callVideoRef = useRef<HTMLVideoElement>(null);
  const callStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const beautyFilter = `brightness(${bright}%) contrast(${100 + beauty / 5}%) saturate(${100 + beauty / 2}%) blur(${smooth / 20}px)`;

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from("messages").select("*").eq("chat_id", chatId).order("created_at", { ascending: true });
      if (!error && data) setMessages(data);
    };
    load();
    const ch = supabase.channel(`chat-${chatId}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` }, (p) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === p.new.id)) return prev;
        return [...prev, p.new];
      });
    }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [chatId]);

  useEffect(() => {
    bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight);
  }, [messages]);

  const uploadMedia = async (file: File) => {
    const name = `${chatId}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("chat-media").upload(name, file);
    if (error) throw error;
    const { data } = supabase.storage.from("chat-media").getPublicUrl(name);
    return data.publicUrl;
  };

  const sendMsg = async (type = "text", content: string, filterVal = "") => {
    if (!content.trim()) return;
    const tempId = Date.now().toString();
    const optimistic = { id: tempId, chat_id: chatId, sender_id: myId, text: content, type, filter: filterVal, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, optimistic]);
    setText("");

    try {
      const { data, error } = await supabase.from("messages").insert({ chat_id: chatId, sender_id: myId, text: content, type, filter: filterVal }).select();
      if (error) {
        console.log("Supabase error, keeping local message:", error.message);
      } else if (data?.[0]) {
        setMessages((prev) => prev.map((m) => (m.id === tempId ? data[0] : m)));
      }
    } catch (e) {
      console.log("Network issue, message saved locally");
    }
  };

  const openCamera = async () => {
    setShowAttach(false); setShowCamera(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = s;
      if (videoElRef.current) videoElRef.current.srcObject = s;
    } catch { setShowCamera(false); alert("Camera permission needed"); }
  };
  const closeCamera = () => { streamRef.current?.getTracks().forEach((t) => t.stop()); setShowCamera(false); };
  const capture = () => {
    if (!videoElRef.current || !canvasRef.current) return;
    const v = videoElRef.current, c = canvasRef.current;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d")?.drawImage(v, 0, 0);
    c.toBlob((b) => {
      if (!b) return;
      const f = new File([b], `cam_${Date.now()}.jpg`, { type: "image/jpeg" });
      setPreviewImg(URL.createObjectURL(f)); setPreviewFile(f); closeCamera(); setShowBeauty(true);
    }, "image/jpeg", 0.9);
  };
  const handleFile = async (e: any, type: "image" | "video") => {
    const file = e.target.files?.[0]; if (!file) return;
    if (type === "image") { setPreviewImg(URL.createObjectURL(file)); setPreviewFile(file); setShowBeauty(true); }
    else {
      try { const url = await uploadMedia(file); await sendMsg("video", url); }
      catch { const url = URL.createObjectURL(file); await sendMsg("video", url); }
    }
    setShowAttach(false);
  };
  const sendBeauty = async () => {
    if (!previewImg) return;
    let url = previewImg;
    try { if (previewFile) url = await uploadMedia(previewFile); } catch {}
    await sendMsg("image", url, beautyFilter);
    setShowBeauty(false); setPreviewImg(null); setPreviewFile(null);
  };

  const startCall = async (type: "voice" | "video") => {
    setCallType(type); setCallTime(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia(type === "video" ? { video: true, audio: true } : { audio: true });
      callStreamRef.current = stream;
      if (type === "video" && callVideoRef.current) callVideoRef.current.srcObject = stream;
      timerRef.current = setInterval(() => setCallTime((t) => t + 1), 1000);
    } catch { alert("Mic/Camera permission needed"); setCallType(null); }
  };
  const endCall = () => { callStreamRef.current?.getTracks().forEach((t) => t.stop()); clearInterval(timerRef.current); setCallType(null); setCallTime(0); };
  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ height: "100dvh", background: "#FFFEFB", display: "flex", justifyContent: "center", overflow: "hidden" }}>
      <div style={{ width: "100%", maxWidth: "720px", height: "100dvh", background: "#FFFEFB", display: "flex", flexDirection: "column" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
          *{font-family:'Inter',sans-serif!important;box-sizing:border-box}
          .c-top{background:#F6F1E8;padding:10px 12px;display:flex;align-items:center;gap:10px;border-bottom:0.8px solid #EADFBF;flex-shrink:0}
          .c-back{width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:#FDF8EE;border:0.8px solid #EADFBF;border-radius:50%}
          .c-avatar-wrap{position:relative;width:34px;height:34px}.c-avatar{width:34px;height:34px;border-radius:50%;object-fit:cover;border:0.8px solid #EADFBF;padding:1.5px;background:#FDF8EE}
          .c-dot{position:absolute;bottom:0;right:0;width:8px;height:8px;background:#22C55E;border-radius:50%;border:1.8px solid #fff}
          .c-name{font-size:13px;font-weight:600;color:#121212}.c-status{font-size:9.5px;color:#22C55E}
          .c-call{margin-left:auto;display:flex;gap:8px}.c-icon{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:#FDF8EE;border:0.8px solid #EADFBF}
          .c-body{flex:1;overflow-y:auto;padding:14px 12px 16px;display:flex;flex-direction:column;gap:10px}
          .c-bubble-wrap{max-width:72%;display:flex;flex-direction:column}.c-bubble-wrap.me{align-self:flex-end;align-items:flex-end}
          .c-bubble{padding:8px 12px;border-radius:16px;font-size:12.5px;line-height:1.35;background:#FDF8EE;color:#121212;border:0.8px solid #EADFBF}
          .c-bubble-img{width:170px;border-radius:12px;border:0.8px solid #EADFBF}
          .c-input-bar{flex-shrink:0;background:#FFFEFB;padding:12px 10px 24px 10px;display:flex;gap:7px;align-items:center;border-top:0.8px solid #EADFBF}
          .c-attach{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#FDF8EE;border:0.8px solid #EADFBF;cursor:pointer}
          .c-input-wrap{flex:1;background:#FDF8EE;border:0.8px solid #EADFBF;border-radius:20px;display:flex;align-items:center;padding:0 12px;height:38px}
          .c-input-wrap input{border:none;outline:none;flex:1;background:transparent;font-size:12.5px;color:#121212}
          .c-send{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#FDF8EE;border:0.8px solid #EADFBF;cursor:pointer}
          .c-sheet{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:720px;background:#FFFEFB;border-radius:20px 20px 0 0;padding:8px 0 28px;box-shadow:0 -10px 30px rgba(0,0,0,0.08);z-index:50;border-top:0.8px solid #EADFBF}
          .c-handle{width:32px;height:4px;background:#EADFBF;border-radius:10px;margin:0 auto 14px}
          .c-grid{display:flex;justify-content:space-around;padding:0 16px}.c-item{display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer}.c-circle{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#FDF8EE;border:0.8px solid #EADFBF}.c-label{font-size:10.5px;color:#2D2415}
          .cam-full{position:fixed;inset:0;background:#000;z-index:100;display:flex;flex-direction:column}.cam-header{padding:12px 14px;display:flex;justify-content:space-between;color:#fff;align-items:center}.cam-icon-btn{background:#FDF8EE;border:0.8px solid #EADFBF;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center}.cam-video{flex:1;object-fit:cover;width:100%}.cam-bottom{padding:18px;display:flex;justify-content:center;gap:32px;position:absolute;bottom:0;width:100%;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding-bottom:28px}.cam-shutter{width:62px;height:62px;border-radius:50%;border:1.5px solid #EADFBF;background:#FDF8EE;display:flex;align-items:center;justify-content:center;cursor:pointer}.cam-shutter-inner{width:48px;height:48px;border-radius:50%;background:#121212}
          .beauty-full{position:fixed;inset:0;background:#0F0F0F;z-index:110;display:flex;flex-direction:column}.beauty-top{padding:12px 14px;display:flex;justify-content:space-between;color:#fff;align-items:center}.beauty-img-wrap{flex:1;display:flex;align-items:center;justify-content:center;background:#000;overflow:hidden}.beauty-ctrl{background:#1A1A1A;padding:14px 16px 28px;border-radius:18px 18px 0 0;display:flex;flex-direction:column;gap:14px;border-top:0.8px solid #EADFBF}.b-row{display:flex;align-items:center;gap:10px;color:#fff;font-size:11px}.b-row input{flex:1;accent-color:#EADFBF}
          .call-full{position:fixed;inset:0;background:#0F0F0F;z-index:200;display:flex;flex-direction:column;align-items:center}.call-avatar-big{width:96px;height:96px;border-radius:50%;border:2px solid #EADFBF;padding:3px;margin-top:80px}.call-name{color:#fff;font-size:20px;font-weight:600;margin-top:16px}.call-status{color:#B8A994;font-size:12px;margin-top:6px}.call-time{color:#fff;font-size:13px;margin-top:4px}.call-actions{position:absolute;bottom:0;width:100%;max-width:720px;background:#1A1A1A;border-top:0.8px solid #EADFBF;border-radius:22px 22px 0 0;padding:22px 20px 28px;display:flex;justify-content:center;gap:18px}.call-btn{width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:0.8px solid #EADFBF}.call-btn.end{background:#FF3B30;border-color:#FF3B30}.call-btn.mute{background:#FDF8EE}.call-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.call-video-top{position:absolute;top:0;left:0;right:0;padding:14px;display:flex;justify-content:space-between;z-index:2}
        `}</style>

        <div className="c-top">
          <div className="c-back" onClick={() => router.back()}><X size={14} /></div>
          <div className="c-avatar-wrap"><img src="https://i.pravatar.cc/100?img=32" className="c-avatar" alt="" /><div className="c-dot" /></div>
          <div><div className="c-name">Emma</div><div className="c-status">Online</div></div>
          <div className="c-call">
            <div className="c-icon" onClick={() => startCall("voice")}><Phone size={14} /></div>
            <div className="c-icon" onClick={() => startCall("video")}><Video size={14} /></div>
          </div>
        </div>

        <div className="c-body" ref={bodyRef}>
          {messages.map((m: any) => (
            <div key={m.id} className={`c-bubble-wrap ${m.sender_id === myId ? "me" : ""}`}>
              {m.type === "image" ? <img src={m.text} className="c-bubble-img" style={{ filter: m.filter || "" }} alt="" /> : m.type === "video" ? <video src={m.text} controls style={{ width: 200, borderRadius: 12, border: "0.8px solid #EADFBF" }} /> : <div className="c-bubble">{m.text}</div>}
            </div>
          ))}
        </div>

        <div className="c-input-bar">
          <div className="c-attach" onClick={() => setShowAttach(true)}><Camera size={15} /></div>
          <div className="c-input-wrap"><input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMsg("text", text)} placeholder="Write a message..." /></div>
          <div className="c-send" onClick={() => sendMsg("text", text)}><Send size={13} /></div>
        </div>

        {showAttach && (
          <div className="c-sheet">
            <div className="c-handle" />
            <div className="c-grid">
              <div className="c-item" onClick={openCamera}><div className="c-circle"><Camera size={18} /></div><div className="c-label">Camera</div></div>
              <div className="c-item" onClick={() => galleryRef.current?.click()}><div className="c-circle"><ImageIcon size={18} /></div><div className="c-label">Gallery</div></div>
              <div className="c-item" onClick={() => videoFileRef.current?.click()}><div className="c-circle"><Video size={18} /></div><div className="c-label">Video</div></div>
            </div>
            <div onClick={() => setShowAttach(false)} style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#B8A994", cursor: "pointer" }}>Cancel</div>
          </div>
        )}

        {showCamera && (
          <div className="cam-full">
            <div className="cam-header">
              <div className="cam-icon-btn" onClick={closeCamera}><X size={14} color="#121212" /></div>
              <div>Camera</div>
              <div style={{ width: 28 }} />
            </div>
            <video ref={videoElRef} autoPlay playsInline className="cam-video" />
            <canvas ref={canvasRef} hidden />
            <div className="cam-bottom">
              <div style={{ background: "#FDF8EE", border: "0.8px solid #EADFBF", padding: "4px 8px", borderRadius: 10, fontSize: 10 }}>HD</div>
              <div className="cam-shutter" onClick={capture}><div className="cam-shutter-inner" /></div>
              <div style={{ background: "#FDF8EE", border: "0.8px solid #EADFBF", padding: "4px 8px", borderRadius: 10, fontSize: 10, display: "flex", gap: 3 }}><Sparkles size={10} /> Beauty</div>
            </div>
          </div>
        )}

        {showBeauty && previewImg && (
          <div className="beauty-full">
            <div className="beauty-top">
              <div className="cam-icon-btn" onClick={() => setShowBeauty(false)}><X size={14} color="#121212" /></div>
              <div>Edit • Beauty</div>
              <div onClick={sendBeauty} style={{ background: "#FDF8EE", border: "0.8px solid #EADFBF", color: "#121212", padding: "6px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer" }}>Send</div>
            </div>
            <div className="beauty-img-wrap"><img src={previewImg} alt="" style={{ maxWidth: "100%", maxHeight: "100%", filter: beautyFilter }} /></div>
            <div className="beauty-ctrl">
              <div className="b-row"><Sparkles size={11} /><span style={{ minWidth: 42 }}>Beauty</span><input type="range" min={0} max={80} value={beauty} onChange={(e) => setBeauty(Number(e.target.value))} /><span>{beauty}%</span></div>
              <div className="b-row"><Sun size={11} /><span style={{ minWidth: 42 }}>Bright</span><input type="range" min={80} max={150} value={bright} onChange={(e) => setBright(Number(e.target.value))} /><span>{bright}%</span></div>
              <div className="b-row"><Droplets size={11} /><span style={{ minWidth: 42 }}>Smooth</span><input type="range" min={0} max={20} value={smooth} onChange={(e) => setSmooth(Number(e.target.value))} /><span>{smooth}</span></div>
            </div>
          </div>
        )}

        {callType === "voice" && (
          <div className="call-full">
            <img src="https://i.pravatar.cc/100?img=32" className="call-avatar-big" alt="" />
            <div className="call-name">Emma</div>
            <div className="call-status">{callTime < 2 ? "Calling..." : "On Call"}</div>
            <div className="call-time">{formatTime(callTime)}</div>
            <div className="call-actions">
              <div className="call-btn mute" onClick={() => setIsMuted(!isMuted)}>{isMuted ? <MicOff size={20} /> : <Mic size={20} />}</div>
              <div className="call-btn mute"><Volume2 size={20} /></div>
              <div className="call-btn end" onClick={endCall}><PhoneOff size={22} color="#fff" /></div>
            </div>
          </div>
        )}

        {callType === "video" && (
          <div className="call-full">
            <video ref={callVideoRef} autoPlay playsInline muted className="call-video" />
            <div className="call-video-top">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}><img src="https://i.pravatar.cc/100?img=32" style={{ width: 32, height: 32, borderRadius: "50%" }} alt="" /><div><div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Emma</div><div style={{ color: "#fff", fontSize: 10 }}>{formatTime(callTime)}</div></div></div>
              <div className="cam-icon-btn" onClick={endCall}><X size={14} /></div>
            </div>
            <div className="call-actions">
              <div className="call-btn mute" onClick={() => setIsMuted(!isMuted)}>{isMuted ? <MicOff size={20} /> : <Mic size={20} />}</div>
              <div className="call-btn mute"><Camera size={20} /></div>
              <div className="call-btn end" onClick={endCall}><PhoneOff size={22} color="#fff" /></div>
            </div>
          </div>
        )}

        <input ref={galleryRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e, "image")} />
        <input ref={videoFileRef} type="file" accept="video/*" hidden onChange={(e) => handleFile(e, "video")} />
      </div>
    </div>
  );
}
