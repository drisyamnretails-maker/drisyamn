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
    const isEmail = identifier.includes("@");
    const email = isEmail? identifier : `${identifier}@drisyamn.local`;
    // username banate hain - unique
    const username = name.toLowerCase().replace(/\s+/g,'') + Math.floor(Math.random()*1000);

    const { data, error } = await supabase.from('profiles').insert([
      {
        username: username,
        display_name: name,
        email: email,
        password: password, // Note: production me hash karna
        bio: `Hi, I am ${name}`,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      }
    ]).select().single();

    setLoading(false);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    // save current user
    localStorage.setItem('currentUser', JSON.stringify(data));
    localStorage.setItem('username', data.username);

    router.push("/roles");
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