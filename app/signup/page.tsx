"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Signup() {
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async () => {
    if (!name || !contact || !password) { alert("Sab bharo"); return; }
    if (password !== confirm) { alert("Password match nahi ho raha"); return; }
    setLoading(true)
    try {
      const isEmail = contact.includes("@")
      const authEmail = isEmail ? contact.trim() : `${contact.trim()}@d.com`
      const phoneVal = isEmail ? null : contact.trim()
      const username = contact.replace(/[@.]/g, "_") + "_" + Date.now()

      // 1. Password sirf Auth me jayega
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: authEmail,
        password: password,
      })
      if (authError) throw authError
      if (!authData.user) throw new Error("User create nahi hua")

      // 2. Profiles me password KABHI NAHI jayega - ye permanent fix hai
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        username: username,
        full_name: name,
        display_name: name,
        email: authEmail,
        phone: phoneVal,
        bio: `Hi, I am ${name}`,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        role: 'personal',
        onboarding_done: false
      })
      if (profileError) throw profileError

      alert("Account ban gaya!")
      router.push("/onboarding")
    } catch (e: any) {
      alert("Error: " + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create account</h1>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" className="border p-3 w-full my-2 rounded-lg"/>
      <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Email or Mobile Number" className="border p-3 w-full my-2 rounded-lg"/>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="border p-3 w-full my-2 rounded-lg"/>
      <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm Password" className="border p-3 w-full my-2 rounded-lg"/>
      <button onClick={handleSignup} className="bg-orange-500 text-white p-3 w-full rounded-lg mt-4">
        {loading ? "CREATING..." : "Create Account"}
      </button>
    </div>
  )
}