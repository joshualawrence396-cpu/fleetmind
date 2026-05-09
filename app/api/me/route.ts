import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const authCookie = request.cookies.get('auth')?.value
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const user = JSON.parse(authCookie)
    return NextResponse.json(user)
    
  } catch (error) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }
}
