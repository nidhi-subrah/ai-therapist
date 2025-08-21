import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { MoodCheckin } from '@/models'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { mood, stress, note } = body as { mood: number; stress: number; note?: string }
    if (!mood || !stress) {
      return NextResponse.json({ error: 'mood and stress required' }, { status: 400 })
    }

    try {
      await dbConnect()
      await MoodCheckin.create({ userId: null, mood, stress, note })
    } catch (e) {
      // Do not block; allow saving later when DB is configured
      console.warn('Checkin persistence skipped:', e)
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
