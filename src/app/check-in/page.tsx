'use client'

import { useState } from 'react'
import { z } from 'zod'

const schema = z.object({
  mood: z.number().min(1).max(10),
  stress: z.number().min(1).max(10),
  note: z.string().max(500).optional(),
})

export default function CheckInPage() {
  const [mood, setMood] = useState(5)
  const [stress, setStress] = useState(5)
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    try {
      setLoading(true)
      setStatus(null)
      const data = schema.parse({ mood, stress, note: note || undefined })
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      setStatus('Saved! Great job checking in with yourself today.')
      setNote('')
    } catch (e: any) {
      setStatus(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold mb-2">Daily Mood Check-in</h1>
      <p className="text-muted-foreground mb-6">Rate how you feel right now. This helps you notice patterns over time.</p>

      <div className="bg-card border rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm mb-1">Mood (1–10)</label>
          <input type="range" min={1} max={10} value={mood} onChange={(e)=>setMood(Number(e.target.value))} className="w-full" />
          <div className="text-sm text-muted-foreground">{mood}</div>
        </div>
        <div>
          <label className="block text-sm mb-1">Stress (1–10)</label>
          <input type="range" min={1} max={10} value={stress} onChange={(e)=>setStress(Number(e.target.value))} className="w-full" />
          <div className="text-sm text-muted-foreground">{stress}</div>
        </div>
        <div>
          <label className="block text-sm mb-1">Notes (optional)</label>
          <textarea value={note} onChange={(e)=>setNote(e.target.value)} className="w-full border rounded-md p-2" rows={3} placeholder="What’s on your mind?" />
        </div>
        <button onClick={submit} disabled={loading} className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {loading ? 'Saving…' : 'Save Check-in'}
        </button>
        {status && <div className="text-sm text-accent mt-2">{status}</div>}
      </div>
    </div>
  )
}
