import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

type ConnPayload = {
  address?: string
  chain?: string
}

// Simple edge-session management using cookies. This is a lightweight stand-in for a real WalletConnect session store.

export async function GET(req: NextRequest) {
  // Read session data from cookies
  const address = req.cookies.get('wc_address')?.value ?? null
  const chain = req.cookies.get('wc_chain')?.value ?? 'arb'
  if (address) {
    return NextResponse.json({ connected: true, address, chain })
  }
  return NextResponse.json({ connected: false }, { status: 200 })
}

export async function POST(req: NextRequest) {
  try {
    const payload: ConnPayload = await req.json()
    const address = payload?.address?.trim() ?? ''
    const chain = payload?.chain ?? 'arb'
    if (!address) {
      return NextResponse.json({ error: 'address is required' }, { status: 400 })
    }
    const res = NextResponse.json({ status: 'ok', address, chain })
    // Persist in cookies for session continuity
    res.cookies.set('wc_address', address, { path: '/', sameSite: 'lax', httpOnly: false, maxAge: 60 * 60 * 24 * 7 })
    res.cookies.set('wc_chain', chain, { path: '/', sameSite: 'lax', httpOnly: false, maxAge: 60 * 60 * 24 * 7 })
    return res
  } catch (e) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest) {
  const res = NextResponse.json({ status: 'disconnected' })
  // Clear cookies
  res.cookies.delete('wc_address')
  res.cookies.delete('wc_chain')
  return res
}
