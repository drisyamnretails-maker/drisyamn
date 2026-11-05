// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// deno-lint-ignore no-explicit-any
declare const Deno: any;

Deno.serve(async (req: any) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  const { data: reels } = await supabase.from('reels').select('id')
  
  for (const reel of reels || []) {
    const { data: ev } = await supabase
      .from('reel_events')
      .select('event_type')
      .eq('reel_id', reel.id)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())

    const started = ev?.filter((e: any) => e.event_type === 'started').length || 0
    const completed = ev?.filter((e: any) => e.event_type === 'completed').length || 0
    const rewatch = ev?.filter((e: any) => e.event_type === 'rewatch').length || 0
    const shares = ev?.filter((e: any) => e.event_type === 'share').length || 0
    
    const completion = started > 0 ? completed / started : 0
    const viral_score = (completion * 10) + (rewatch * 3) + (shares * 5) + (started * 0.1)

    await supabase.from('reels').update({ viral_score, completion_rate: completion }).eq('id', reel.id)
  }
  
  return new Response('done')
})