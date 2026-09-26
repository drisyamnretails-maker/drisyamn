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

  // Form State
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<"personal" | "creator" | "retail" | "service">("personal");
  
  // UI & OTP State
  const [show, setShow] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [isPhoneAuth, setIsPhoneAuth] = useState(false);
  const [shake, setShake] = useState(false);
  const [err, setErr] = useState("");

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  // 1. Handle Signup Submission
  const handleSignup = async () => {
    setErr("");

    if (!name.trim() || !contact.trim() || !password || !confirm) {
      setErr("All fields are required");
      triggerShake();
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match");
      triggerShake();
      return;
    }
    if (password.length < 6) {
      setErr("Password must be 6+ characters");
      triggerShake();
      return;
    }
    if (!terms) {
      setErr("Please accept Terms & Conditions");
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      const isEmail = contact.includes("@");
      setIsPhoneAuth(!isEmail);

      if (isEmail) {
        // --- EMAIL SIGNUP ---
        const cleanEmail = contact.trim().toLowerCase();

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: name.trim(),
              username: cleanEmail.split("@")[0] + "_" + Math.floor(Math.random() * 1000),
              role: role,
            },
          },
        });

        if (error) throw error;
        setStep("otp");
      } else {
        // --- PHONE SIGNUP ---
        // Clean input and attach country code (e.g., +91 for India, change as needed)
        const digits = contact.replace(/\D/g, "");
        if (digits.length < 10) throw new Error("Enter a valid phone number with country code");
        
        const formattedPhone = contact.startsWith("+") ? contact.trim() : `+${digits}`;

        const { data, error } = await supabase.auth.signUp({
          phone: formattedPhone,
          password: password,
          options: {
            data: {
              full_name: name.trim(),
              username: "user_" + digits.slice(-4) + "_" + Math.floor(Math.random() * 1000),
              role: role,
            },
          },
        });

        if (error) throw error;
        setStep("otp");
      }
    } catch (e: any) {
      setErr(e.message || "An error occurred during signup");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle OTP Verification
  const verifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setErr("Enter full 6-digit OTP code");
      triggerShake();
      return;
    }

    setLoading(true);
    setErr("");

    try {
      if (isPhoneAuth) {
        const digits = contact.replace(/\D/g, "");
        const formattedPhone = contact.startsWith("+") ? contact.trim() : `+${digits}`;

        const { error } = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: otp,
          type: "sms",
        });

        if (error) throw error;
      } else {
        const { error } = await supabase.auth.verifyOtp({
          email: contact.trim().toLowerCase(),
          token: otp,
          type: "signup",
        });

        if (error) throw error;
      }

      // Successfully verified! Redirect user to onboarding or homefeed
      router.push("/varify"); // Or /homefeed
    } catch (e: any) {
      setErr(e.message || "Invalid or expired OTP");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { color: LABEL_BLACK, fontSize: "16px", fontWeight: 700 } as const;

  return (
    <div
      className="min-h-[100vh] w-full flex items-start justify-center p-4 pt-8 overflow-y-auto"
      style={{ background: PAGE_BG }}
    >
      <div
        className={`w-full max-w-[400px] bg-[#FFFEFB] rounded-[24px] px-6 py-6 mb-8 shadow-[0_0_0_8px_#fff,0_20px_40px_rgba(0,0,0,0.1)] ${
          shake ? "animate-[shake_0.4s_ease]" : ""
        }`}
      >
        <div className="text-center">
          <h1 className="font-serif leading-none" style={{ color: PURE_BLACK, fontSize: "44px", fontWeight: 800 }}>
            Drisyamn
          </h1>
          <p className="mt-1" style={{ color: "#4B5563", fontSize: "15px", fontWeight: 600 }}>
            Discover everything around you
          </p>
          <h2 className="mt-6" style={{ color: PURE_BLACK, fontSize: "19px", fontWeight: 700 }}>
            {step === "form" ? "Create account" : "Verify OTP"}
          </h2>
        </div>

        {step === "form" ? (
          <div className="mt-6">
            {/* Full Name */}
            <label style={labelStyle}>Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="eg: John Doe"
              className="mt-2 w-full h-[52px] px-5 rounded-[14px] bg-[#F6F1E6] border border-black/10 text-[15.5px] font-medium outline-none focus:bg-white focus:border-[#E86A33]/40"
              style={{ color: "#111827" }}
            />

            {/* Email or Phone */}
            <label className="mt-5 block" style={labelStyle}>
              Email or Mobile Number
            </label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="you@example.com or +919876543210"
              className="mt-2 w-full h-[52px] px-5 rounded-[14px] bg-[#F6F1E6] border border-black/10 text-[15.5px] font-medium outline-none"
              style={{ color: "#111827" }}
            />

            {/* Account Role Selector */}
            <label className="mt-5 block" style={labelStyle}>
              Account Type
            </label>
            <select
              value={role}
              onChange={(e: any) => setRole(e.target.value)}
              className="mt-2 w-full h-[52px] px-5 rounded-[14px] bg-[#F6F1E6] border border-black/10 text-[15.5px] font-medium outline-none"
              style={{ color: "#111827" }}
            >
              <option value="personal">Personal Account</option>
              <option value="creator">Creator Account</option>
              <option value="retail">Retail Business</option>
              <option value="service">Service Provider</option>
            </select>

            {/* Password */}
            <label className="mt-5 block" style={labelStyle}>
              Password
            </label>
            <div className="relative mt-2">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={show ? "text" : "password"}
                placeholder="Min 6 characters"
                className="w-full h-[52px] px-5 pr-12 rounded-[14px] bg-[#F6F1E6] border border-black/10 text-[15.5px] font-medium outline-none"
                style={{ color: "#111827" }}
              />
              <button
                onClick={() => setShow(!show)}
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: PURE_BLACK }}
              >
                {show ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Confirm Password */}
            <label className="mt-5 block" style={labelStyle}>
              Confirm Password
            </label>
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              type="password"
              placeholder="Confirm password"
              className="mt-2 w-full h-[52px] px-5 rounded-[14px] bg-[#F6F1E6] border border-black/10 text-[15.5px] font-medium outline-none"
              style={{ color: "#111827" }}
            />

            {/* Terms Agreement */}
            <label className="mt-5 flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#E86A33]"
              />
              <span className="text-[13px] font-medium leading-4" style={{ color: "#4B5563" }}>
                I agree to{" "}
                <Link href="/terms" className="font-bold" style={{ color: ORANGE }}>
                  Terms & Conditions
                </Link>{" "}
                and Privacy Policy
              </span>
            </label>

            {/* Error Message */}
            {err && (
              <div
                className="mt-4 px-4 py-2.5 rounded-[10px] bg-[#F6F1E6] text-[13px] font-bold border border-black/5 text-red-600"
              >
                {err}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSignup}
              disabled={loading}
              className="mt-6 w-full h-[52px] rounded-full text-white text-[14px] font-black tracking-[0.08em] uppercase disabled:opacity-70 flex items-center justify-center"
              style={{
                background: ORANGE,
                boxShadow: "0 0 0 6px white, 0 10px 24px rgba(232,106,51,0.35)",
              }}
            >
              {loading ? "CREATING..." : "CREATE ACCOUNT"}
            </button>

            <p className="mt-6 text-center text-[14px]">
              <span className="font-medium" style={{ color: "#6B7280" }}>
                Already have account?
              </span>{" "}
              <Link href="/login" className="font-bold hover:underline" style={{ color: ORANGE }}>
                Log in
              </Link>
            </p>
          </div>
        ) : (
          /* OTP Screen */
          <div className="mt-6">
            <p className="text-[14px] font-medium text-center" style={{ color: "#4B5563" }}>
              Enter the 6-digit code sent to <br />
              <strong className="text-black">{contact}</strong>
            </p>

            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="mt-4 w-full h-[52px] px-5 rounded-[14px] bg-[#F6F1E6] border border-black/10 text-[20px] tracking-[0.4em] font-bold text-center outline-none"
              style={{ color: "#111827" }}
            />

            {err && (
              <div className="mt-4 px-4 py-2.5 rounded-[10px] bg-[#F6F1E6] text-[13px] font-bold border border-black/5 text-red-600">
                {err}
              </div>
            )}

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="mt-6 w-full h-[52px] rounded-full text-white text-[14px] font-black uppercase disabled:opacity-70 flex items-center justify-center"
              style={{ background: ORANGE }}
            >
              {loading ? "VERIFYING..." : "VERIFY & CONTINUE"}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}