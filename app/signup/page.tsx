"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Signup() {
  const [name, setName] = useState("tanka")
  const [contact, setContact] = useState("9380597404")
  const [password, setPassword] = useState("tanka@123")
  const [confirm, setConfirm] = useState("")
  const router = useRouter()

  const handleSignup = async () => {
    try {
      if (password !== confirm) { alert("Password match nahi kar raha"); return; }

      const isEmail = contact.includes("@")
      const authEmail = isEmail ? contact : `${contact}@d.com`
      const phone = isEmail ? null : contact
      const username = contact.replace(/[@.]/g, "_") + "_" + Date.now()

      // 1. Auth me password jayega (safe)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authEmail,
        password: password,
      })
      if (authError) throw authError
      if (!authData.user) throw new Error("User nahi bana")

      // 2. Profiles me password KABHI NAHI jayega
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        username: username,
        full_name: name,
        display_name: name,
        email: authEmail,
        phone: phone,
        bio: `Hi, I am ${name}`,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        role: 'personal',
        onboarding_done: false
      })
      if (profileError) throw profileError

      router.push("/onboarding")
    } catch (e: any) {
      alert("Error: " + e.message)
    }
  }

  return (
    <div className="p-6">
      <h1>Create account</h1>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" className="border p-2 w-full my-2"/>
      <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Email or Mobile" className="border p-2 w-full my-2"/>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="border p-2 w-full my-2"/>
      <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm Password" className="border p-2 w-full my-2"/>
      <button onClick={handleSignup} className="bg-orange-500 text-white p-3 w-full rounded">Create Account</button>
    </div>
  )
}