"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";
const PURE_BLACK = "#0A0A0A";
const LABEL_BLACK = "#0F1A3A";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [shake, setShake] = useState(false);
  const [err, setErr] = useState("");

  const triggerShake = () => { setShake(true); setTimeout(()=>setShake(false),400); }

  const handleSignup = async () => {
    setErr("");
    if (!name.trim() ||!contact.trim() ||!password ||!confirm) {
      setErr("All fields are required"); triggerShake(); return;
    }
    if (password!== confirm) { setErr("Passwords do not match"); triggerShake(); return; }
    if (password.length < 6) { setErr("Password must be 6+ characters"); triggerShake(); return; }
    if (!terms) { setErr("Please accept Terms & Conditions"); triggerShake(); return; }

    setLoading(true);
    try {
      const isEmail = contact.includes("@");
      const emailToUse = isEmail? contact.trim().toLowerCase() : `${contact.trim()}@drisyamn.com`;
      const phoneVal = isEmail? null : contact.trim();
      setAuthEmail(emailToUse);
      const username = contact.replace(/[@.]/g, "_") + "_" + Date.now();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailToUse,
        password: password,
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Signup failed");

      // PERMANENT FIX: password kabhi profiles me nahi jayega
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        username: username,
        full_name: name.trim(),
        display_name: name.trim(),
        email: emailToUse,
        phone: phoneVal,
        bio: `Hi, I am ${name}`,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        role: 'personal',
        onboarding_done: false
      });
      if (profileError) throw profileError;

      // Agar real email hai to OTP screen dikhao, phone hai to direct onboarding
      if (isEmail) {
        setStep("otp");
      } else {
        // phone wale ka email fake hai, isliye auto login kara dete hain
        await supabase.auth.signInWithPassword({ email: emailToUse, password });
        router.push("/onboarding");
      }
    } catch (e: any) {
      setErr(e.message); triggerShake();
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 6) { setErr("Enter 6-digit OTP"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: authEmail,
        token: otp,
        type: 'signup'
      });
      if (error) throw error;
      router.push("/onboarding");
    } catch (e: any) {
      setErr(e.message); triggerShake();
    } finally { setLoading(false); }
  };

  const labelStyle = { color: LABEL_BLACK, fontSize: "16px", fontWeight: 700 } as const;

  return (
    <div className="min-h-[100vh] w-full flex items-start justify-center p-4 pt-8 overflow-y-auto" style={{background:PAGE_BG}}>
      <div className={`w-full max-w-[400px] bg-[#FFFEFB] rounded-[24px] px-6 py-6 mb-8 shadow-[0_0_0_8px_#fff,0_20px_40px_rgba(0,0,0,0.1)] ${shake? "animate-[shake_0.4s_ease]" : ""}`}>

        <div className="text-center">
          <h1 className="font-serif leading-none" style={{color: PURE_BLACK, fontSize: "44px", fontWeight: 800, letterSpacing: "-0.5px"}}>Drisyamn</h1>
          <p className="mt-1" style={{color: "#4B5563", fontSize: "15px", fontWeight: 600}}>Discover everything around you</p>
          <h2 className="mt-6" style={{color: PURE_BLACK, fontSize: "19px", fontWeight: 700}}>{step === "form"? "Create account" : "Verify OTP"}</h2>
        </div>

        {step === "form"? (
        <div className="mt-6">
          <label style={labelStyle}>Full Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="eg: tanka" className="mt-2 w-full h-[52px] px-5 rounded-[14px] bg-[#F6F1E6] border border-black/10 text-[15.5px] font-medium outline-none focus:bg-white focus:border-[#E86A33]/40 focus:shadow-[0_0_0_4px_rgba(232,106,51,0.15)]" style={{color:"#111827"}}/>

          <label className="mt-5 block" style={labelStyle}>Email or Mobile Number</label>
          <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="you@example.com or 9876543210" className="mt-2 w-full h-[52px] px-5 rounded-[14px] bg-[#F6F1E6] border border-black/10 text-[15.5px] font-medium outline-none focus:bg-white focus:border-[#E86A33]/40" style={{color:"#111827"}}/>

          <label className="mt-5 block" style={labelStyle}>Password</label>
          <div className="relative mt-2">
            <input value={password} onChange={e=>setPassword(e.target.value)} type={show? "text":"password"} placeholder="Min 6 characters" className="w-full h-[52px] px-5 pr-12 rounded-[14px] bg-[#F6F1E6] border border-black/10 text-[15.5px] font-medium outline-none focus:bg-white focus:border-[#E86A33]/40" style={{color:"#111827"}}/>
            <button onClick={()=>setShow(!show)} type="button" className="absolute right-4 top-1/2 -translate-y-1/2" style={{color:PURE_BLACK}}>{show? "🙈":"👁️"}</button>
          </div>

          <label className="mt-5 block" style={labelStyle}>Confirm Password</label>
          <input value={confirm} onChange={e=>setConfirm(e.target.value)} type="password" placeholder="Confirm your password" className="mt-2 w-full h-[52px] px-5 rounded-[14px] bg-[#F6F1E6] border border-black/10 text-[15.5px] font-medium outline-none focus:bg-white focus:border-[#E86A33]/40" style={{color:"#111827"}}/>

          <label className="mt-5 flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} className="mt-1 w-4 h-4 accent-[#E86A33]"/>
            <span className="text-[13px] font-medium leading-4" style={{color:"#4B5563"}}>I agree to <Link href="/terms" className="font-bold" style={{color:ORANGE}}>Terms & Conditions</Link> and Privacy Policy</span>
          </label>

          {err && <div className="mt-4 px-4 py-2.5 rounded-[10px] bg-[#F6F1E6] text-[13px] font-bold border border-black/5" style={{color:PURE_BLACK}}>{err}</div>}

          <button onClick={handleSignup} disabled={loading} className="mt-6 w-full h-[52px] rounded-full text-white text-[14px] font-black tracking-[0.08em] uppercase hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 transition-all flex items-center justify-center" style={{background:ORANGE, boxShadow:"0 0 0 6px white, 0 10px 24px rgba(232,106,51,0.35)"}}>
            {loading? <span className="flex gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span><span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span><span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span></span> : "CREATE ACCOUNT"}
          </button>

          <p className="mt-6 text-center text-[14px]"><span className="font-medium" style={{color:"#6B7280"}}>Already have account?</span> <Link href="/login" className="font-bold hover:underline" style={{color:ORANGE}}>Log in</Link></p>
        </div>
        ) : (
        <div className="mt-6">
          <p className="text-[14px] font-medium" style={{color:"#4B5563"}}>OTP sent to {authEmail}. Check email.</p>
          <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter 6-digit OTP" className="mt-4 w-full h-[52px] px-5 rounded-[14px] bg-[#F6F1E6] border border-black/10 text-[18px] tracking-[0.3em] font-bold text-center outline-none focus:bg-white focus:border-[#E86A33]/40" style={{color:"#111827"}}/>
          {err && <div className="mt-4 px-4 py-2.5 rounded-[10px] bg-[#F6F1E6] text-[13px] font-bold border border-black/5" style={{color:PURE_BLACK}}>{err}</div>}
          <button onClick={verifyOtp} disabled={loading} className="mt-6 w-full h-[52px] rounded-full text-white text-[14px] font-black tracking-[0.08em] uppercase disabled:opacity-70 flex items-center justify-center" style={{background:ORANGE, boxShadow:"0 0 0 6px white, 0 10px 24px rgba(232,106,51,0.35)"}}>{loading? "VERIFYING..." : "VERIFY OTP"}</button>
          <button onClick={()=>setStep("form")} className="mt-4 w-full text-[13px] font-bold" style={{color:"#6B7280"}}>Back</button>
        </div>
        )}
      </div>
      <style jsx>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}`}</style>
    </div>
  );
}