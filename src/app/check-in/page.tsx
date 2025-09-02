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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9EDCC]">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-[#BDE4E1] mt-16">
        <h1 className="text-3xl font-bold mb-2 text-[#4A6C6F]">Daily Mood Check-in</h1>
        <p className="text-[#875C74] mb-6">Rate how you feel right now. This helps you notice patterns over time.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-[#4A6C6F]">Mood (1–10)</label>
            <input type="range" min={1} max={10} value={mood} onChange={(e)=>setMood(Number(e.target.value))} className="w-full accent-[#4A6C6F]" />
            <div className="text-sm text-[#875C74]">{mood}</div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#98473E]">Stress (1–10)</label>
            <input type="range" min={1} max={10} value={stress} onChange={(e)=>setStress(Number(e.target.value))} className="w-full accent-[#98473E]" />
            <div className="text-sm text-[#875C74]">{stress}</div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#4A6C6F]">Notes (optional)</label>
            <textarea value={note} onChange={(e)=>setNote(e.target.value)} className="w-full border rounded-md p-2 border-[#BDE4E1]" rows={3} placeholder="What’s on your mind?" />
          </div>
          <button onClick={submit} disabled={loading} className="rounded-md bg-[#4A6C6F] px-4 py-2 text-white font-semibold hover:bg-[#875C74] disabled:opacity-50">
            {loading ? 'Saving…' : 'Save Check-in'}
          </button>
          {status && <div className="text-sm text-[#E4572E] mt-2">{status}</div>}
        </div>
      </div>
    </div>
  )
}
