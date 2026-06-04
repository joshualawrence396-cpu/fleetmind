import { NextRequest, NextResponse } from 'next/server'

type Order = {
  id: string
  customer?: string
  status?: string
}

const orders: Order[] = []

export async function GET() {
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const order: Order = {
      id: crypto.randomUUID(),
      customer: body.customer,
      status: body.status ?? 'PENDING'
    }

    orders.push(order)

    return NextResponse.json(order, {
      status: 201
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to create order'
      },
      {
        status: 500
      }
    )
  }
}