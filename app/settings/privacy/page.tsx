"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const ORANGE = "#E86A33";
const DARK = "#1F3A4A";
const PAGE_BG = "#EDE6D3";
const CARD_BG = "#FFFEFB";
const prettyBox: React.CSSProperties = {
  background: CARD_BG,
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 0 0 8px #FFFFFF, 0 0 0 9px rgba(0,0,0,0.10), 0 16px 40px rgba(62,42,20,0.14)"
};

type PrivacySettings = {
  privateAccount: boolean;
  showOnline: boolean;
  showLocation: boolean;
  allowTagging: boolean;
  searchEngine: boolean;
  defaultVisibility: "public" | "followers" | "onlyme";
  whoCanComment: "everyone" | "followers" | "nobody";
  allowShare: boolean;
  hideHashtags: boolean;
  whoCanDM: "everyone" | "followers" | "nobody";
  messageRequest: boolean;
  readReceipts: boolean;
  notifLikes: boolean;
  notifComments: boolean;
  hideFollowersList: boolean;
  followerApproval: boolean;
  showShopContact: boolean;
  twoFactor: boolean;
  preciseLocation: boolean;
};

const defaultSettings: PrivacySettings = {
  privateAccount: false,
  showOnline: true,
  showLocation: true,
  allowTagging: true,
  searchEngine: true,
  defaultVisibility: "public",
  whoCanComment: "everyone",
  allowShare: true,
  hideHashtags: false,
  whoCanDM: "everyone",
  messageRequest: true,
  readReceipts: true,
  notifLikes: true,
  notifComments: true,
  hideFollowersList: false,
  followerApproval: false,
  showShopContact: true,
  twoFactor: false,
  preciseLocation: false,
};

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className={`w-[46px] h-[28px] rounded-full p-[3px] transition flex ${value? "justify-end bg-[#1F3A4A]" : "justify-start bg-[#EDE6D3] border"}`}>
      <span className="w-[22px] h-[22px] bg-white rounded-full shadow border"></span>
    </button>
  );
}

export default function PrivacyPage() {
  const [activeTab, setActiveTab] = useState<"account" | "posts" | "messages" | "data">("account");
  const [settings, setSettings] = useState<PrivacySettings>(defaultSettings);
  const [username, setUsername] = useState("drisyamn");

  useEffect(() => {
    const u = localStorage.getItem("drisyamn_username") || "drisyamn";
    setUsername(u);
    const saved = localStorage.getItem("drisyamn_privacy_settings");
    if (saved) { try { setSettings({...defaultSettings,...JSON.parse(saved)}); } catch {} }
  }, []);

  const update = (key: keyof PrivacySettings, value: any) => {
    const ns = {...settings, [key]: value };
    setSettings(ns);
    localStorage.setItem("drisyamn_privacy_settings", JSON.stringify(ns));
  };

  const clearData = () => {
    if (!confirm("Local posts, DMs clear ho jayenge. Sure?")) return;
    localStorage.removeItem("drisyamn_global_posts_v2");
    localStorage.removeItem("homefeed_posts");
    localStorage.removeItem("drisyamn_posts");
    alert("Cleared!");
  };

  const exportData = () => {
    const data = {
      posts: localStorage.getItem("drisyamn_global_posts_v2"),
      homefeed: localStorage.getItem("homefeed_posts"),
      privacy: localStorage.getItem("drisyamn_privacy_settings"),
      username,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `drisyamn-data-${username}.json`; a.click();
  };

  return (
    <div className="min-h-screen px-4 pb-20" style={{ background: PAGE_BG, color: DARK }}>
      <nav className="max-w-[1024px] mx-auto mt-6 h-[68px] flex items-center justify-between px-6 rounded-[22px] sticky top-6 z-40" style={prettyBox}>
        <Link href="/homefeed" className="font-serif font-black text-[22px]" style={{ color: DARK }}>Drisyamn<span style={{ color: ORANGE }}>.</span></Link>
        <div className="flex gap-2">
          <Link href="/settings" className="px-4 py-2 rounded-full bg-[#F6F1E6] border text-[11px] font-bold">← Settings</Link>
          <Link href="/homefeed" className="px-4 py-2 rounded-full text-white text-[11px] font-bold border-[3px] border-white shadow" style={{ background: DARK }}>Homefeed</Link>
        </div>
      </nav>

      <div className="max-w-[1024px] mx-auto mt-8 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <div className="rounded-[22px] p-4" style={prettyBox}>
            <div className="flex gap-3 items-center p-2">
              <img src={`https://i.pravatar.cc/100?u=${username}`} className="w-12 h-12 rounded-full border-[3px] border-white shadow" alt="" />
              <div><div className="font-bold text-[14px]">@{username}</div><div className="text-[11px] opacity-60">Privacy Controls</div></div>
            </div>
            <div className="mt-4 space-y-2">
              {[
                { id: "account", label: "🔐 Account Privacy" },
                { id: "posts", label: "📝 Posts & Media" },
                { id: "messages", label: "💬 Messages & Followers" },
                { id: "data", label: "🛡️ Data & Security" },
              ].map((t: any) => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full text-left p-4 rounded-[14px] border font-bold text-[13px] ${activeTab === t.id? "bg-[#1F3A4A] text-white border-white" : "bg-[#F6F1E6]"}`}>{t.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-4">
          {activeTab === "account" && (
            <div className="rounded-[22px] p-6" style={prettyBox}>
              <h2 className="font-black text-[16px]">Account Privacy</h2>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center p-4 bg-[#F6F1E6] rounded-[14px] border"><div><div className="font-bold text-[13px]">Private Account</div><div className="text-[11px] opacity-60">Only followers see posts</div></div><Toggle value={settings.privateAccount} onChange={v=>update("privateAccount",v)} /></div>
                <div className="flex justify-between items-center p-4 bg-[#F6F1E6] rounded-[14px] border"><div><div className="font-bold text-[13px]">Show Online 🟢</div><div className="text-[11px] opacity-60">Show online status</div></div><Toggle value={settings.showOnline} onChange={v=>update("showOnline",v)} /></div>
                <div className="flex justify-between items-center p-4 bg-[#F6F1E6] rounded-[14px] border"><div><div className="font-bold text-[13px]">Show Location</div><div className="text-[11px] opacity-60">Matigara / City Center tag</div></div><Toggle value={settings.showLocation} onChange={v=>update("showLocation",v)} /></div>
                <div className="flex justify-between items-center p-4 bg-[#F6F1E6] rounded-[14px] border"><div><div className="font-bold text-[13px]">Allow @Mention</div><div className="text-[11px] opacity-60">Anyone can mention you</div></div><Toggle value={settings.allowTagging} onChange={v=>update("allowTagging",v)} /></div>
              </div>
            </div>
          )}

          {activeTab === "posts" && (
            <div className="rounded-[22px] p-6" style={prettyBox}>
              <h2 className="font-black text-[16px]">Posts & Media</h2>
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-[#F6F1E6] rounded-[14px] border"><div className="font-bold text-[13px]">Default Visibility</div><div className="flex gap-2 mt-2">{(["public","followers","onlyme"] as const).map(v=><button key={v} onClick={()=>update("defaultVisibility",v)} className={`px-4 py-2 rounded-full text-[11px] font-bold border ${settings.defaultVisibility===v?"bg-black text-white":"bg-white"}`}>{v.toUpperCase()}</button>)}</div></div>
                <div className="flex justify-between items-center p-4 bg-[#F6F1E6] rounded-[14px] border"><div><div className="font-bold text-[13px]">Allow Share</div></div><Toggle value={settings.allowShare} onChange={v=>update("allowShare",v)} /></div>
                <div className="flex justify-between items-center p-4 bg-[#F6F1E6] rounded-[14px] border"><div><div className="font-bold text-[13px]">Hide Hashtags from Search</div></div><Toggle value={settings.hideHashtags} onChange={v=>update("hideHashtags",v)} /></div>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="rounded-[22px] p-6" style={prettyBox}>
              <h2 className="font-black text-[16px]">Messages & Followers</h2>
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-[#F6F1E6] rounded-[14px] border"><div className="font-bold text-[13px]">Who can DM?</div><div className="flex gap-2 mt-2">{(["everyone","followers","nobody"] as const).map(v=><button key={v} onClick={()=>update("whoCanDM",v)} className={`px-4 py-2 rounded-full text-[11px] font-bold border ${settings.whoCanDM===v?"bg-black text-white":"bg-white"}`}>{v}</button>)}</div></div>
                <div className="flex justify-between items-center p-4 bg-[#F6F1E6] rounded-[14px] border"><div><div className="font-bold text-[13px]">Message Requests</div></div><Toggle value={settings.messageRequest} onChange={v=>update("messageRequest",v)} /></div>
                <div className="flex justify-between items-center p-4 bg-[#F6F1E6] rounded-[14px] border"><div><div className="font-bold text-[13px]">Read Receipts ✓✓</div></div><Toggle value={settings.readReceipts} onChange={v=>update("readReceipts",v)} /></div>
                <div className="flex justify-between items-center p-4 bg-[#F6F1E6] rounded-[14px] border"><div><div className="font-bold text-[13px]">Hide Followers List</div></div><Toggle value={settings.hideFollowersList} onChange={v=>update("hideFollowersList",v)} /></div>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="rounded-[22px] p-6 space-y-3" style={prettyBox}>
              <h2 className="font-black text-[16px]">Data & Security</h2>
              <div className="flex justify-between items-center p-4 bg-[#F6F1E6] rounded-[14px] border"><div><div className="font-bold text-[13px]">Two-Factor Auth</div></div><Toggle value={settings.twoFactor} onChange={v=>update("twoFactor",v)} /></div>
              <div className="flex justify-between items-center p-4 bg-[#F6F1E6] rounded-[14px] border"><div><div className="font-bold text-[13px]">Precise Location</div><div className="text-[11px] opacity-60">Exact pin vs Area only</div></div><Toggle value={settings.preciseLocation} onChange={v=>update("preciseLocation",v)} /></div>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button onClick={exportData} className="py-3 rounded-full bg-[#1F3A4A] text-white text-[12px] font-bold border-[3px] border-white shadow">📥 Download Data</button>
                <button onClick={clearData} className="py-3 rounded-full bg-red-50 text-red-600 border border-red-200 text-[12px] font-bold">🗑️ Clear Local Data</button>
              </div>
              <div className="mt-4 p-4 rounded-[14px] border-2 border-red-100 bg-red-50">
                <div className="font-bold text-[13px] text-red-600">Danger Zone</div>
                <button onClick={()=>{if(confirm("Permanent delete?")) alert("Requested")}} className="mt-2 w-full py-2.5 rounded-full bg-red-600 text-white text-[12px] font-bold">Delete Account Permanently</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}