import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const entityType = formData.get('entityType')
    const entityId = formData.get('entityId')
    const documentType = formData.get('documentType')
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }
    
    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    
    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = ${Date.now()}-
    const filePath = join(uploadDir, fileName)
    await writeFile(filePath, buffer)
    
    // Save to database
    const document = await prisma.document.create({
      data: {
        fileName: file.name,
        fileUrl: /uploads/,
        fileSize: file.size,
        mimeType: file.type,
        entityType: entityType as string,
        entityId: entityId as string,
        documentType: documentType as string,
        uploadedBy: 'SYSTEM'
      }
    })
    
    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const entityType = searchParams.get('entityType')
    const entityId = searchParams.get('entityId')
    
    const documents = await prisma.document.findMany({
      where: {
        ...(entityType && { entityType }),
        ...(entityId && { entityId })
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(documents)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}
