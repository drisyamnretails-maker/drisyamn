// helpers.ts:114 pe tum aise kar rahe hoge — galat
// const url = `https://${projectId}.supabase.net`  <- .net galat hai

// Sahi ye hai:
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL! // https://xxxxx.supabase.co
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)