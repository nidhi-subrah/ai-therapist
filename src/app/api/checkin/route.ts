import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import { MoodCheckin } from '@/models'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { mood, stress, note } = body as { mood: number; stress: number; note?: string }
    if (!mood || !stress) {
      return NextResponse.json({ error: 'mood and stress required' }, { status: 400 })
    }

    // Get user session if available
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || null

    try {
      await dbConnect()
      await MoodCheckin.create({ userId, mood, stress, note })
      
      console.log(`Mood check-in saved for user: ${userId || 'anonymous'}`)
    } catch (e) {
      console.error('Checkin persistence error:', e)
      return NextResponse.json({ error: 'Failed to save check-in' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Check-in API error:', e)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
