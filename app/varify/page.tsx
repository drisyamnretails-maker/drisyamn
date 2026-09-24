'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

export default function VerifyPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(30)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (timer > 0) {
      const id = setTimeout(() => setTimer(t => t - 1), 1000)
      return () => clearTimeout(id)
    }
  }, [timer])

  const handleChange = (val: string, idx: number) => {
    if (!/^\d*$/.test(val)) return
    const newOtp = [...otp]
    newOtp[idx] = val.slice(-1)
    setOtp(newOtp)
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus()
  }

  const handleKey = (e: any, idx: number) => {
    if (e.key === 'Backspace' &&!otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus()
    }
  }

  const isComplete = otp.every(v => v!== '')

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box} html,body{overflow:hidden;height:100%}
       .otp-box{transition:all 0.2s ease}
       .otp-box:focus{border-color:white!important; transform:scale(1.08); box-shadow:0 0 15px rgba(255,255,255,0.3)}
       .otp-box:hover{border-color:rgba(255,255,255,0.3)!important}
       .verify-btn:hover{transform:scale(1.03); box-shadow:0 10px 25px rgba(255,255,255,0.3)}
       .verify-btn:active{transform:scale(0.97)}
      `}</style>

      <div style={{ height: '100vh', width: '100vw', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #000 0%, #000 30%, #1a080a 70%, #7A121A 100%)' }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '380px', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px' }}>

          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: 'white', fontSize: '46px', fontWeight: '800' }}>Drisyamn</h1>
            <h2 style={{ color: 'white', fontSize: '22px', fontWeight: '700', marginTop: '30px' }}>Verify OTP</h2>
            <p style={{ color: 'white', fontSize: '12px', marginTop: '8px', lineHeight: '18px', opacity: 0.9 }}>
              Code sent to<br />
              <span style={{ fontWeight: '700', letterSpacing: '0.5px' }}>+91 98XXXX X210 / email@gmail.com</span>
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '32px' }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputsRef.current[i] = el }}
                value={digit}
                onChange={e => handleChange(e.target.value, i)}
                onKeyDown={e => handleKey(e, i)}
                maxLength={1}
                className="otp-box"
                style={{
                  width: '46px', height: '52px', background: 'rgba(30,30,30,0.9)',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px',
                  color: 'white', fontSize: '20px', fontWeight: '700',
                  textAlign: 'center', outline: 'none'
                }}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '22px' }}>
            {timer > 0? (
              <p style={{ color: 'white', fontSize: '13px', opacity: 0.7 }}>Resend code in <span style={{ fontWeight: '700' }}>{timer}s</span></p>
            ) : (
              <p onClick={() => setTimer(30)} style={{ color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>Resend OTP</p>
            )}
          </div>

          <button
            onClick={() => isComplete && router.push('/roles')}
            className="verify-btn"
            style={{
              marginTop: '28px', width: '100%', padding: '15px', borderRadius: '999px',
              border: 'none', background: isComplete? 'white' : '#2a2a2a',
              color: isComplete? 'black' : '#777', fontWeight: '800', fontSize: '14px',
              letterSpacing: '1px', cursor: isComplete? 'pointer' : 'not-allowed', transition: 'all 0.25s'
            }}>
            VERIFY & CONTINUE
          </button>

          <p style={{ color: 'white', fontSize: '12px', textAlign: 'center', marginTop: '20px', opacity: 0.8 }}>
            Wrong number? <span onClick={() => router.back()} style={{ fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>Edit</span>
          </p>
        </div>
      </div>
    </>
  )
}