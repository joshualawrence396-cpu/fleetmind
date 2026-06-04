import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads')

    await mkdir(uploadDir, {
      recursive: true
    })

    // Convert uploaded file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const storedFileName = `${Date.now()}-${file.name}`

    const filePath = join(uploadDir, storedFileName)

    // Save file to disk
    await writeFile(filePath, buffer)

    // Save document record to database
    const document = await prisma.document.create({
      data: {
        fileName: file.name,
        fileUrl: `/uploads/${storedFileName}`,
        fileType: file.type || null,
        uploadedBy: 'SYSTEM'
      }
    })

    return NextResponse.json(document, {
      status: 201
    })
  } catch (error) {
    console.error('Upload error:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to upload document'
      },
      {
        status: 500
      }
    )
  }
}

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Fetch documents error:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch documents'
      },
      {
        status: 500
      }
    )
  }
}