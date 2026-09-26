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
    try {
      let emailToUse = id.toLowerCase();
      const cleanPhone = id.replace(/\D/g, "");

      if (!emailToUse.includes("@")) {
        // FIX: pehle m...@drisyamn.com use kar - gmail nahi
        const phoneEmailVariant = `m${cleanPhone}@drisyamn.com`;
        const { data: profiles } = await supabase
         .from("profiles")
         .select("email")
         .or(`phone.eq.${id},phone.eq.${cleanPhone},email.eq.${phoneEmailVariant}`)
         .limit(1);

        if (profiles && profiles.length > 0) {
          emailToUse = profiles[0].email;
        } else {
          emailToUse = phoneEmailVariant;
        }
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: password,
      });

      if (authError) {
        if (authError.message.toLowerCase().includes("invalid login credentials")) {
          throw new Error("Wrong password");
        }
        throw authError;
      }

      const { data: fullProfile } = await supabase.from("profiles").select("*").eq("id", authData.user.id).maybeSingle();
      if (fullProfile) {
        localStorage.setItem("currentUser", JSON.stringify(fullProfile));
        localStorage.setItem("username", fullProfile.username || "");
      }
      router.push("/homefeed");
    } catch (e: any) {
      if (e.message.includes("Wrong password")) setErr({ id: "", pass: "Wrong password" });
      else setErr({ id: e.message, pass: "" });
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { color: LABEL_BLACK, fontSize: "16.5px", fontWeight: 800 } as const;

  return (
    <div
      className="min-h-[100dvh] w-full flex items-start justify-center p-4 pt-10"
      style={{ background: PAGE_BG }}
    >
      <div
        className={`w-full max-w-[410px] bg-[#FFFEFB] rounded-[32px] px-7 py-8 mb-8 shadow-[0_0_0_10px_#fff,0_25px_60px_rgba(0,0,0,0.13)] ${
          shake? "animate-[shake_0.4s_ease]" : ""
        }`}
      >
        <div className="text-center">
          <h1 className="font-serif leading-none tracking-tight" style={{ color: PURE_BLACK, fontSize: "52px", fontWeight: 900 }}>
            Drisyamn
          </h1>
          <p className="mt-2" style={{ color: "#4B5563", fontSize: "15.5px", fontWeight: 600 }}>
            Discover everything around you
          </p>
          <h2 className="mt-8" style={{ color: PURE_BLACK, fontSize: "20px", fontWeight: 800 }}>
            Welcome back
          </h2>
        </div>

        <div className="mt-8">
          <label style={labelStyle}>Email or Mobile Number</label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com or 9876543210"
            className="mt-2.5 w-full h-[56px] px-5 rounded-[16px] bg-[#F6F1E6] border border-black/10 text-[15.5px] font-semibold outline-none focus:bg-white focus:border-[#E86A33]/40 focus:shadow-[0_0_0_5px_rgba(232,106,51,0.15)] placeholder:text-[#6B7280]"
            style={{ color: "#111827" }}
          />
          {err.id && <div className="mt-2.5 px-4 py-3 rounded-[12px] bg-[#FFF0E8] text-[13px] font-bold border border-orange-200 text-red-600">{err.id}</div>}

          <label className="mt-6 block" style={labelStyle}>Password</label>
          <div className="relative mt-2.5">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={show? "text" : "password"}
              placeholder="Enter your password"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full h-[56px] px-5 pr-12 rounded-[16px] bg-[#F6F1E6] border border-black/10 text-[15.5px] font-semibold outline-none focus:bg-white focus:border-[#E86A33]/40 focus:shadow-[0_0_0_5px_rgba(232,106,51,0.15)] placeholder:text-[#6B7280]"
              style={{ color: "#111827" }}
            />
            <button onClick={() => setShow(!show)} type="button" className="absolute right-5 top-1/2 -translate-y-1/2 text-[20px]" style={{ color: PURE_BLACK }}>
              {show? "🙈" : "👁️"}
            </button>
          </div>
          {err.pass && <div className="mt-2.5 px-4 py-3 rounded-[12px] bg-[#FFF0E8] text-[13px] font-bold border border-orange-200 text-red-600">{err.pass}</div>}

          <div className="mt-4 text-right">
            <Link href="/forgot-password" className="text-[14px] font-extrabold hover:underline" style={{ color: ORANGE }}>
              Forgot password?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-8 w-full h-[58px] rounded-full text-white text-[14.5px] font-black tracking-[0.08em] uppercase hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 transition-all flex items-center justify-center cursor-pointer"
            style={{ background: ORANGE, boxShadow: "0 0 0 7px white, 0 14px 32px rgba(232,106,51,0.4)" }}
          >
            {loading? (
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
              </span>
            ) : "LOG IN"}
          </button>

          <p className="mt-8 text-center text-[14.5px]">
            <span className="font-medium" style={{ color: "#6B7280" }}>Don't have an account?</span>{" "}
            <Link href="/signup" className="font-extrabold hover:underline" style={{ color: ORANGE }}>Sign up</Link>
          </p>
        </div>
      </div>
      <style jsx>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`}</style>
    </div>
  );
}