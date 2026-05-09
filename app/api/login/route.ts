import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    
    console.log('Login attempt for:', email)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email }
    })
    
    if (!user) {
      console.log('User not found')
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    // Check password
    const valid = await bcrypt.compare(password, user.password)
    
    if (!valid) {
      console.log('Invalid password')
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    // Create session
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
    
    const response = NextResponse.json({ 
      success: true, 
      user: sessionData 
    })
    
    // Set cookie
    response.cookies.set('auth', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })
    
    console.log('Login successful for:', email)
    return response
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
