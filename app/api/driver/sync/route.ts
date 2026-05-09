import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const actions = await req.json()
    const results = []
    
    for (const action of actions) {
      if (action.type === 'COMPLETE_STOP') {
        const stop = await prisma.stop.update({
          where: { id: action.stopId },
          data: {
            status: 'COMPLETED',
            actualArrivalAt: new Date(action.timestamp),
            actualDepartAt: new Date(action.timestamp),
            notes: action.data.notes
          }
        })
        results.push({ success: true, actionId: action.stopId })
      }
    }
    
    return NextResponse.json({ success: true, results })
  } catch (error) {
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
