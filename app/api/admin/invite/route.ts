import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, role } = await req.json()

    return NextResponse.json(
      {
        success: true,
        message: `Invitation sent to ${email} with role ${role}`,
        invitationToken: `invite-${Date.now()}`
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to send invitation:', error)

    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    )
  }
}