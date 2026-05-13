import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Get userId from cookie
    const cookieHeader = request.headers.get('cookie');
    const userId = cookieHeader?.match(/userId=([^;]+)/)?.[1];
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
