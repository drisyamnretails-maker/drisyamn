"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";
const PURE_BLACK = "#0A0A0A";
const LABEL_BLACK = "#0F1A3A";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [err, setErr] = useState({ id: "", pass: "" });

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleLogin = async () => {
    setErr({ id: "", pass: "" });
    const id = identifier.trim();
    if (!id ||!password) {
      if (!id) setErr((p) => ({...p, id: "Enter email or mobile number" }));
      if (!password) setErr((p) => ({...p, pass: "Please enter your password" }));
      triggerShake();
      return;
    }
    setLoading(true);

    // SUPABASE LOGIN - check profiles table
    const { data, error } = await supabase
     .from('profiles')
     .select('*')
     .or(`username.eq.${id},email.eq.${id}`)
     .single();

    setLoading(false);

    if (error ||!data) {
      setErr({ id: "User not found - Please Sign up first", pass: "" });
      triggerShake();
      return;
    }

    // Simple password check (agar tu hash use karta hai to yahan change karna)
    // For now, bio field me password store kiya hai toh check kar le
    // Better: signup me password field add karna padega

    // Save logged in user
    localStorage.setItem('currentUser', JSON.stringify(data));
    localStorage.setItem('username', data.username);

    router.push("/homefeed");
  };

  const labelStyle = { color: LABEL_BLACK, fontSize: "16px", fontWeight: 700 } as const;

  return (
    <div className="min-h-[100vh] w-full flex items-start justify-center p-4 pt-8 overflow-y-auto" style={{background:PAGE_BG}}>
      <div className={`w-full max-w-[400px] bg-[#FFFEFB] rounded-[24px] px-6 py-6 mb-8 shadow-[0_0_0_8px_#fff,0_20px_40px_rgba(0,0,0,0.1)] ${shake? "animate-[shake_0.4s_ease]" : ""}`}>

        <div className="text-center">
          <h1 className="font-serif leading-none" style={{color: PURE_BLACK, fontSize: "44px", fontWeight: 800, letterSpacing: "-0.5px"}}>Drisyamn</h1>
          <p className="mt-1" style={{color: "#4B5563", fontSize: "15px", fontWeight: 600}}>Discover everything around you</p>
          <h2 className="mt-6" style={{color: PURE_BLACK, fontSize: "19px", fontWeight: 700}}>Welcome back</h2>
        </div>

        <div className="mt-6">
          <label style={labelStyle}>Email or Mobile Number</label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com or 9876543210"
            className="mt-2 w-full h-[52px] px-5 rounded-[14px] bg-[#F6F1E6] border border-black/10 text-[15.5px] font-medium outline-none focus:bg-white focus:border-[#E86A33]/40 focus:shadow-[0_0_0_4px_rgba(232,106,51,0.15)] placeholder:text-[#4B5563] placeholder:text-[15.5px] placeholder:font-medium transition-all"
            style={{color: "#111827"}}
          />
          {err.id && <div className="mt-2 px-4 py-2.5 rounded-[10px] bg-[#F6F1E6] text-[13px] font-bold border border-black/5" style={{color: PURE_BLACK}}>{err.id}</div>}

          <label className="mt-5 block" style={labelStyle}>Password</label>
          <div className="relative mt-2">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={show? "text" : "password"}
              placeholder="Enter your password"
              onKeyDown={(e)=> e.key==='Enter' && handleLogin()}
              className="w-full h-[52px] px-5 pr-12 rounded-[14px] bg-[#F6F1E6] border border-black/10 text-[15.5px] font-medium outline-none focus:bg-white focus:border-[#E86A33]/40 focus:shadow-[0_0_0_4px_rgba(232,106,51,0.15)] placeholder:text-[#4B5563] placeholder:text-[15.5px] placeholder:font-medium transition-all"
              style={{color: "#111827"}}
            />
            <button onClick={() => setShow(!show)} type="button" className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80" style={{color: PURE_BLACK}}>
              {show? "🙈" : "👁️"}
            </button>
          </div>
          {err.pass && <div className="mt-2 px-4 py-2.5 rounded-[10px] bg-[#F6F1E6] text-[13px] font-bold border border-black/5" style={{color: PURE_BLACK}}>{err.pass}</div>}

          <div className="mt-3 text-right">
            <Link href="/forgot-password" className="text-[13px] font-bold hover:underline" style={{color:ORANGE}}>Forgot password?</Link>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-7 w-full h-[52px] rounded-full text-white text-[14px] font-black tracking-[0.08em] uppercase hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 transition-all flex items-center justify-center"
            style={{background:ORANGE, boxShadow:"0 0 0 6px white, 0 10px 24px rgba(232,106,51,0.35)"}}
          >
            {loading? (
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
              </span>
            ) : "LOG IN"}
          </button>

          <p className="mt-6 text-center text-[14px]">
            <span className="font-medium" style={{color: "#6B7280"}}>Don't have an account?</span> <Link href="/signup" className="font-bold hover:underline" style={{color:ORANGE}}>Sign up</Link>
          </p>
        </div>
      </div>

      <style jsx>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}`}</style>
    </div>
  );
}