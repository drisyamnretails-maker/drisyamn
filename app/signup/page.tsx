"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type PasswordStrength = "weak" | "medium" | "strong";

export default function SignupPage() {
  const router = useRouter();

  // Form States
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);

  // UI States
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [focused, setFocused] = useState<string>("");

  // Derived validations
  const isEmail = useMemo(() => contact.includes("@"), [contact]);
  const isValidEmail = useMemo(() => {
    if (!contact) return false;
    if (isEmail) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    return contact.replace(/\D/g, "").length >= 10;
  }, [contact, isEmail]);

  const passwordStrength: PasswordStrength = useMemo(() => {
    if (password.length < 6) return "weak";
    if (password.length < 10) return "medium";
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return "strong";
    return "medium";
  }, [password]);

  const isFormValid = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      isValidEmail &&
      password.length >= 6 &&
      confirm === password &&
      terms
    );
  }, [name, isValidEmail, password, confirm, terms]);

  const handleSignup = async () => {
    setErr("");

    // Full validation
    if (!name.trim()) return setErr("Full name is required");
    if (name.trim().length < 2) return setErr("Name must be at least 2 characters");
    if (!contact.trim()) return setErr("Email or mobile is required");
    if (!isValidEmail) return setErr(isEmail? "Invalid email format" : "Invalid mobile number");
    if (!password) return setErr("Password is required");
    if (password.length < 6) return setErr("Password must be 6+ characters");
    if (password!== confirm) return setErr("Passwords do not match");
    if (!terms) return setErr("Please accept Terms & Conditions");

    setLoading(true);
    try {
      const cleanContact = contact.trim().toLowerCase();
      const digitsOnly = contact.replace(/\D/g, "");
      const emailToUse = isEmail? cleanContact : `user_${digitsOnly}@gmail.com`;
      const phoneVal = isEmail? null : contact.trim();

      const baseName = name.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
      const username = `${baseName}_${Date.now().toString().slice(-4)}`;

      // 1. Auth signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailToUse,
        password,
        options: {
          data: {
            full_name: name.trim(),
            username: username,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Signup failed - no user returned");

      // 2. Profile insert with full data
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: authData.user.id,
          username: username,
          full_name: name.trim(),
          display_name: name.trim(),
          email: emailToUse,
          phone: phoneVal,
          bio: "",
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=141414,1F3A4A,E86A33`,
          role: "personal", // default, will be updated in select-role page
          onboarding_done: false,
          location: "Matigara, Siliguri",
          created_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (profileError) throw profileError;

      // 3. Auto login
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (loginError) throw loginError;

      // 4. NEW ROUTE: Signup -> Select Role -> Setup -> Homefeed
      router.push(`/select-role/${username}`);

    } catch (e: any) {
      const message = e.message || "Something went wrong";
      if (message.includes("already registered")) {
        setErr("This email/mobile already exists. Please login.");
      } else {
        setErr(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white relative overflow-hidden flex justify-center">
      {/* LUXURY BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[400px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#E86A33]/[0.10] rounded-full blur-[160px]" />
        <div className="absolute -bottom-[400px] -right-[300px] w-[800px] h-[800px] bg-[#1F3A4A]/[0.25] rounded-full blur-[150px]" />
        <div className="absolute top-[30%] -left-[200px] w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.01)_50%,transparent_100%)] bg-[length:100%_4px]" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] px-5 py-8 flex flex-col min-h-screen">

        {/* TOP NAV */}
        <div className="flex justify-between items-center">
          <button onClick={() => router.push("/")} className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.10] transition-colors">
            <span className="text-[16px]">←</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/40">SECURE SIGNUP</span>
          </div>
        </div>

        {/* HEADER */}
        <div className="mt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08]">
            <span className="text-[10px] font-black tracking-[0.2em] text-white/60">STEP 1 OF 3</span>
            <div className="w-12 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div className="w-[33%] h-full bg-white" />
            </div>
          </div>
          <h1 className="mt-5 font-serif text-[48px] font-[900] tracking-[-0.06em] leading-[0.9]">Create<br/><span className="font-[200] italic text-white/50">account</span></h1>
          <p className="mt-3 text-[13.5px] leading-[1.5] text-white/40">Join 1,200+ people from Siliguri building<br/>their digital identity on Drisyamn.</p>
        </div>

        {/* FORM CARD */}
        <div className="mt-8 rounded-[32px] bg-[#111111] border border-white/[0.07] p-[1px] shadow-[0_20px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)_inset]">
          <div className="rounded-[31px] bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-white/[0.01] p-[22px] sm:p-7 space-y-5">

            {/* NAME */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-black tracking-[0.22em] text-white/30">FULL NAME</label>
                {name.trim().length >= 2 && <span className="text-[10px] font-bold text-emerald-400">✓ VALID</span>}
              </div>
              <div className={`relative group rounded-[16px] bg-white/[0.05] border transition-all ${focused==="name"? "border-white/20 bg-white/[0.08] shadow-[0_0_0_4px_rgba(255,255,255,0.06)]" : "border-white/[0.06] hover:border-white/[0.10]"}`}>
                <input value={name} onFocus={()=>setFocused("name")} onBlur={()=>setFocused("")} onChange={e=>setName(e.target.value)} placeholder="Tanka Nath" className="w-full h-[58px] px-5 pr-12 bg-transparent outline-none text-[15px] font-[500] placeholder:text-white/20" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[12px]">👤</div>
              </div>
            </div>

            {/* CONTACT */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-black tracking-[0.22em] text-white/30">EMAIL OR MOBILE</label>
                {isValidEmail && <span className="text-[10px] font-bold text-emerald-400">✓ VALID</span>}
              </div>
              <div className={`relative rounded-[16px] bg-white/[0.05] border transition-all ${focused==="contact"? "border-white/20 bg-white/[0.08] shadow-[0_0_0_4px_rgba(255,255,255,0.06)]" : "border-white/[0.06] hover:border-white/[0.10]"}`}>
                <input value={contact} onFocus={()=>setFocused("contact")} onBlur={()=>setFocused("")} onChange={e=>setContact(e.target.value)} placeholder="you@example.com or 98765 43210" className="w-full h-[58px] px-5 pr-12 bg-transparent outline-none text-[15px] font-[500] placeholder:text-white/20" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[12px]">{isEmail? "✉️" : "📱"}</div>
              </div>
              <p className="text-[11px] text-white/25 px-1">We will send verification to this {isEmail? "email" : "mobile"}</p>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-[0.22em] text-white/30">PASSWORD</label>
              <div className={`relative rounded-[16px] bg-white/[0.05] border transition-all ${focused==="password"? "border-white/20 bg-white/[0.08]" : "border-white/[0.06]"}`}>
                <input value={password} onFocus={()=>setFocused("password")} onBlur={()=>setFocused("")} onChange={e=>setPassword(e.target.value)} type={show?"text":"password"} placeholder="Create strong password" className="w-full h-[58px] px-5 pr-20 bg-transparent outline-none text-[15px] font-[500] placeholder:text-white/20" />
                <button onClick={()=>setShow(!show)} type="button" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 px-4 rounded-full bg-white text-black text-[10px] font-black tracking-widest">{show?"HIDE":"SHOW"}</button>
              </div>
              {password && (
                <div className="flex gap-1.5 px-1">
                  <div className={`h-1 flex-1 rounded-full transition-all ${passwordStrength==="weak"?"bg-red-400":passwordStrength==="medium"?"bg-yellow-400":"bg-emerald-400"}`} />
                  <div className={`h-1 flex-1 rounded-full transition-all ${passwordStrength==="medium" || passwordStrength==="strong"? passwordStrength==="medium"?"bg-yellow-400":"bg-emerald-400" : "bg-white/10"}`} />
                  <div className={`h-1 flex-1 rounded-full transition-all ${passwordStrength==="strong"? "bg-emerald-400" : "bg-white/10"}`} />
                  <span className="ml-2 text-[10px] font-bold tracking-widest text-white/30">{passwordStrength.toUpperCase()}</span>
                </div>
              )}
            </div>

            {/* CONFIRM */}
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-[0.22em] text-white/30">CONFIRM PASSWORD</label>
              <div className={`relative rounded-[16px] bg-white/[0.05] border transition-all ${focused==="confirm"? "border-white/20 bg-white/[0.08]" : "border-white/[0.06]"}`}>
                <input value={confirm} onFocus={()=>setFocused("confirm")} onBlur={()=>setFocused("")} onChange={e=>setConfirm(e.target.value)} type={showConfirm?"text":"password"} placeholder="Repeat password" className="w-full h-[58px] px-5 pr-20 bg-transparent outline-none text-[15px] font-[500] placeholder:text-white/20" />
                <button onClick={()=>setShowConfirm(!showConfirm)} type="button" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 px-4 rounded-full bg-white/10 text-white text-[10px] font-black tracking-widest border border-white/10">{showConfirm?"HIDE":"SHOW"}</button>
              </div>
              {confirm && confirm===password && <p className="text-[11px] font-bold text-emerald-400 px-1">✓ Passwords match</p>}
              {confirm && confirm!==password && <p className="text-[11px] font-bold text-red-400 px-1">✗ Passwords do not match</p>}
            </div>

            {/* TERMS */}
            <label className="flex gap-3 items-start p-3 rounded-[14px] bg-white/[0.03] border border-white/[0.05] cursor-pointer hover:bg-white/[0.05] transition-colors">
              <button onClick={()=>setTerms(!terms)} type="button" className={`mt-0.5 w-[20px] h-[20px] rounded-[6px] border flex items-center justify-center transition-all shrink-0 ${terms?'bg-white border-white':'bg-transparent border-white/20'}`}>
                {terms && <span className="text-black text-[11px] font-black">✓</span>}
              </button>
              <span className="text-[12px] leading-[1.4] text-white/50">I agree to <Link href="/terms" className="text-white font-bold underline underline-offset-4 decoration-white/20">Terms & Conditions</Link> and <Link href="/privacy" className="text-white font-bold underline underline-offset-4 decoration-white/20">Privacy Policy</Link>. I understand my data is encrypted.</span>
            </label>

            {/* ERROR */}
            {err && <div className="px-4 py-3.5 rounded-[14px] bg-red-500/10 border border-red-500/20 text-red-300 text-[12.5px] font-bold flex gap-2"><span>⚠️</span><span>{err}</span></div>}

            {/* SUBMIT */}
            <div className="pt-2 space-y-3">
              <button onClick={handleSignup} disabled={loading ||!isFormValid} className="group w-full h-[58px] rounded-full bg-white text-black font-black text-[12px] tracking-[0.18em] hover:bg-[#F2F2F2] active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.15)]">
                {loading? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    CREATING ACCOUNT...
                  </>
                ) : (
                  <>
                    CREATE ACCOUNT
                    <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">→</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-[1px] bg-white/10" />
                <span className="text-[10px] tracking-[0.2em] font-bold text-white/20">OR CONTINUE WITH</span>
                <div className="flex-1 h-[1px] bg-white/10" />
              </div>

              <p className="text-center text-[12.5px] text-white/30">Already have an account? <Link href="/login" className="text-white font-black tracking-wide hover:underline underline-offset-4">LOG IN →</Link></p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-8 flex justify-center gap-6 text-[10px] font-bold tracking-[0.2em] text-white/15">
          <span>🔒 256-BIT ENCRYPTED</span>
          <span>•</span>
          <span>MADE IN MATIGARA</span>
        </div>
      </div>

      <style jsx>{`
       .font-serif { font-family: 'Instrument Serif', 'Times New Roman', serif; }
      `}</style>
    </div>
  );
}