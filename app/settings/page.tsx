"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { safeGet, safeSet } from "@/lib/storage";

const DARK = "#1F3A4A";
const PAGE_BG = "#EDE6D3";
const CARD_BG = "#FFFEFB";
const ORANGE = "#E86A33";

const prettyBox: React.CSSProperties = {
  background: CARD_BG,
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 0 0 8px #FFFFFF, 0 0 0 9px rgba(0,0,0,0.10), 0 16px 40px rgba(62,42,20,0.14)"
};

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className={`w-[46px] h-[28px] rounded-full p-[3px] flex ${value? "justify-end bg-[#1F3A4A]" : "justify-start bg-[#EDE6D3] border"}`}>
      <span className="w-[22px] h-[22px] bg-white rounded-full shadow" />
    </button>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<"account" | "privacy" | "data">("account");
  const [username, setUsername] = useState("drisyamn");
  const [bio, setBio] = useState("Matigara based creator");
  const [privateAccount, setPrivateAccount] = useState(false);
  const [showOnline, setShowOnline] = useState(true);
  const [allowShare, setAllowShare] = useState(true);

  useEffect(() => {
    setUsername(localStorage.getItem("drisyamn_username") || "drisyamn");
    const s = safeGet("drisyamn_settings_all", {});
    setPrivateAccount(s.privateAccount || false);
    setShowOnline(s.showOnline?? true);
  }, []);

  const saveAll = () => {
    safeSet("drisyamn_settings_all", { privateAccount, showOnline, allowShare, bio });
    localStorage.setItem("drisyamn_bio", bio);
    alert("Saved ✅");
  };

  return (
    <div className="min-h-screen px-4 pb-20" style={{ background: PAGE_BG, color: DARK }}>
      <nav className="max-w-[1024px] mx-auto mt-6 h-[68px] flex items-center justify-between px-6 rounded-[22px] sticky top-6 z-40" style={prettyBox}>
        <Link href="/homefeed" className="font-black text-[22px]">Drisyamn<span style={{ color: ORANGE }}>.</span></Link>
        <button onClick={saveAll} className="px-6 py-2 rounded-full text-white text-[11px] font-black border-[3px] border-white shadow" style={{ background: DARK }}>Save All</button>
      </nav>

      <div className="max-w-[1024px] mx-auto mt-8 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <div className="rounded-[22px] p-4" style={prettyBox}>
            <div className="flex gap-3 items-center">
              <img src={`https://i.pravatar.cc/100?u=${username}`} className="w-12 h-12 rounded-full border-[3px] border-white shadow" alt="" />
              <div><div className="font-black text-[14px]">@{username}</div><div className="text-[11px] opacity-60">Matigara, Siliguri</div></div>
            </div>
            <div className="mt-4 space-y-2">
              <button onClick={() => setTab("account")} className={`w-full text-left p-4 rounded-[14px] border font-bold text-[13px] ${tab === "account"? "bg-[#1F3A4A] text-white" : "bg-[#F6F1E6]"}`}>👤 Account Settings</button>
              <button onClick={() => setTab("privacy")} className={`w-full text-left p-4 rounded-[14px] border font-bold text-[13px] ${tab === "privacy"? "bg-[#1F3A4A] text-white" : "bg-[#F6F1E6]"}`}>🔐 Privacy Settings</button>
              <button onClick={() => setTab("data")} className={`w-full text-left p-4 rounded-[14px] border font-bold text-[13px] ${tab === "data"? "bg-[#1F3A4A] text-white" : "bg-[#F6F1E6]"}`}>🛡️ Data & Security</button>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-[22px] p-6 space-y-4" style={prettyBox}>
            {tab === "account" && (
              <>
                <h2 className="font-black text-[16px]">Account</h2>
                <div><label className="text-[11px] font-bold opacity-60">USERNAME</label><input value={username} onChange={e => setUsername(e.target.value)} className="w-full mt-1 bg-[#F6F1E6] border rounded-full px-4 py-3 text-[13px] outline-none" /></div>
                <div><label className="text-[11px] font-bold opacity-60">BIO</label><textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full mt-1 bg-[#F6F1E6] border rounded-[16px] px-4 py-3 text-[13px] outline-none" /></div>
              </>
            )}
            {tab === "privacy" && (
              <>
                <h2 className="font-black text-[16px]">Privacy</h2>
                <div className="flex justify-between items-center p-4 bg-[#F6F1E6] rounded-[14px] border"><div><div className="font-bold text-[13px]">Private Account</div><div className="text-[11px] opacity-60">Only followers can see posts</div></div><Toggle value={privateAccount} onChange={setPrivateAccount} /></div>
                <div className="flex justify-between items-center p-4 bg-[#F6F1E6] rounded-[14px] border"><div><div className="font-bold text-[13px]">Show Online</div></div><Toggle value={showOnline} onChange={setShowOnline} /></div>
                <div className="flex justify-between items-center p-4 bg-[#F6F1E6] rounded-[14px] border"><div><div className="font-bold text-[13px]">Allow Share</div></div><Toggle value={allowShare} onChange={setAllowShare} /></div>
              </>
            )}
            {tab === "data" && (
              <>
                <h2 className="font-black text-[16px]">Data & Security</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { const blob = new Blob([JSON.stringify(localStorage)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "drisyamn.json"; a.click(); }} className="py-3 rounded-full bg-[#1F3A4A] text-white text-[12px] font-bold">📥 Export Data</button>
                  <button onClick={() => { if (confirm("Clear?")) { localStorage.clear(); alert("Cleared"); } }} className="py-3 rounded-full bg-red-50 text-red-600 border text-[12px] font-bold">🗑️ Clear Data</button>
                </div>
              </>
            )}
            <button onClick={saveAll} className="w-full py-3 rounded-full bg-[#1F3A4A] text-white font-bold text-[13px]">Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}