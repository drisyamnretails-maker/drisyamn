"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const ORANGE = "#E86A33";
const PAGE_BG = "#EDE6D3";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name ||!identifier ||!password) { alert("Details bharo"); return; }
    if (password!== confirm) { alert("Password match nahi ho raha"); return; }

    setLoading(true);
    try {
      const isEmail = identifier.includes("@");
      const cleanIdentifier = identifier.trim().toLowerCase();
      const phone = isEmail? null : cleanIdentifier.replace(/\D/g, '');
      // Auth ke liye email chahiye, agar mobile hai toh fake email banao
      const authEmail = isEmail? cleanIdentifier : `${phone}@drisyamn.local`;

      const username = name.toLowerCase().replace(/\s+/g,'') + Math.floor(Math.random()*900 + 100);

      // STEP 1: Supabase Auth me user banao - YE SABSE IMPORTANT HAI
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authEmail,
        password: password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User create nahi hua");

      // STEP 2: Ab profiles table me banao
      const { data: profile, error: profileError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id, // Auth wali ID link karo
          username: username,
          full_name: name, // tera column display_name nahi full_name hai
          display_name: name,
          email: authEmail,
          phone: phone,
          bio: `Hi, I am ${name}`,
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
          role: 'personal',
          onboarding_done: false
        }
      ]).select().single();

      if (profileError) throw profileError;

      // Local me save (optional, session se kaam chalega)
      localStorage.setItem('currentUser', JSON.stringify(profile));
      localStorage.setItem('username', profile.username);

      router.push("/roles"); // Ya /onboarding/role

    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { color: "#0F1A3A", fontSize: "15px", fontWeight: 700 } as const;
  const inputStyle = { color: "#111827", backgroundColor: "#F6F1E6" } as const;

  return (
    <div className="min-h-[100vh] w-full flex items-start justify-center p-4 pt-8 overflow-y-auto" style={{ background: PAGE_BG }}>
      <div className="w-full max-w-[400px] bg-[#FFFEFB] rounded-[24px] px-6 py-6 shadow-[0_0_0_8px_#fff,0_20px_40px_rgba(0,0,0,0.1)] mb-8">
        <h1 className="text-center font-serif leading-none" style={{ color: "#0A0A0A", fontSize: "42px", fontWeight: 800 }}>Drisyamn</h1>
        <p className="text-center mt-1" style={{ color: "#6B7280", fontSize: "14px", fontWeight: 600 }}>Discover everything around you</p>
        <h2 className="mt-6" style={{ color: "#0A0A0A", fontSize: "18px", fontWeight: 700 }}>Create account</h2>

        <div className="mt-4">
          <label style={labelStyle}>Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jordan Lee" className="mt-1.5 w-full h-[48px] px-4 rounded-[12px] border border-black/10 text-[14px] font-medium outline-none focus:border-[#E86A33] focus:bg-white placeholder:text-[#6B7280]" style={inputStyle} />

          <label className="mt-4 block" style={labelStyle}>Email or Mobile Number</label>
          <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="you@example.com or 9876543210" className="mt-1.5 w-full h-[48px] px-4 rounded-[12px] border border-black/10 text-[14px] font-medium outline-none focus:border-[#E86A33] focus:bg-white placeholder:text-[#6B7280]" style={inputStyle} />

          <label className="mt-4 block" style={labelStyle}>Password</label>
          <div className="relative mt-1.5">
            <input value={password} onChange={(e) => setPassword(e.target.value)} type={show? "text" : "password"} placeholder="Create a password" className="w-full h-[48px] px-4 pr-11 rounded-[12px] border border-black/10 text-[14px] font-medium outline-none focus:border-[#E86A33] focus:bg-white placeholder:text-[#6B7280]" style={inputStyle} />
            <button onClick={() => setShow(!show)} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[16px]">👁️</button>
          </div>

          <label className="mt-4 block" style={labelStyle}>Confirm Password</label>
          <div className="relative mt-1.5">
            <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type={show2? "text" : "password"} placeholder="Confirm your password" className="w-full h-[48px] px-4 pr-11 rounded-[12px] border border-black/10 text-[14px] font-medium outline-none focus:border-[#E86A33] focus:bg-white placeholder:text-[#6B7280]" style={inputStyle} />
            <button onClick={() => setShow2(!show2)} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[16px]">👁️</button>
          </div>

          <button onClick={handleSignup} disabled={loading} className="mt-6 w-full h-[50px] rounded-full text-white text-[14px] font-bold uppercase tracking-wider disabled:opacity-70" style={{ background: ORANGE }}>
            {loading? "CREATING..." : "SIGN UP"}
          </button>

          <p className="mt-4 text-center text-[13px]">
            <span className="text-[#6B7280]">Already have an account?</span> <Link href="/login" className="font-bold" style={{ color: ORANGE }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}