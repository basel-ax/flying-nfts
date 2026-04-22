import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getBlockchainById } from '../../../lib/blockchains'

export const runtime = 'edge'

type NFTInfo = {
  tokenId: string
  contractAddress: string
  name?: string
  imageUrl?: string
  metadataUrl?: string
}

async function fetchFromAlchemy(address: string, chain: string): Promise<NFTInfo[]> {
  const key = process.env.ALCHEMY_API_KEY
  if (!key) throw new Error('Missing ALCHEMY_API_KEY')
  const base = `https://eth-${chain}.g.alchemy.com/v2/${key}`
  const url = `${base}/getNFTs?owner=${address}&withMetadata=true`
  const r = await fetch(url)
  if (!r.ok) throw new Error(`Alchemy NFT fetch failed: ${r.status}`)
  const data = await r.json()
  const items = (data?.ownedNfts ?? []) as any[]
  return items.map((it) => ({
    tokenId: String(it?.id?.tokenId ?? it?.tokenId ?? ''),
    contractAddress: String(it?.contract?.address ?? it?.contractAddress ?? ''),
    name: it?.metadata?.name ?? it?.title ?? '',
    imageUrl: it?.metadata?.image ?? it?.image ?? '',
    metadataUrl: it?.metadataUrl ?? ''
  }))
}

async function fetchFromMoralis(address: string, chain: string): Promise<NFTInfo[]> {
  const key = process.env.MORALIS_API_KEY
  if (!key) throw new Error('Missing MORALIS_API_KEY')
  // Moralis NFT API endpoint (arb chain)
  const url = `https://deep-index.moralis.io/api/v1/${address}/nft?chain=${chain}&format=decimal`
  const r = await fetch(url, {
    headers: { 'X-API-Key': key }
  })
  if (!r.ok) throw new Error(`Moralis NFT fetch failed: ${r.status}`)
  const data = await r.json()
  const result: NFTInfo[] = (data?.result ?? []).map((n: any) => ({
    tokenId: String(n?.token_id ?? ''),
    contractAddress: String(n?.token_address ?? ''),
    name: n?.name ?? n?.symbol ?? '',
    imageUrl: n?.thumbnail ?? n?.image_url ?? '',
    metadataUrl: n?.metadata_url ?? ''
  }))
  return result
}

type CacheEntry = { t: number; nfts: NFTInfo[] }
const cache: Map<string, CacheEntry> = new Map()

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const address = url.searchParams.get('address')?.trim() ?? ''
  const chainParam = url.searchParams.get('chain')?.trim() ?? 'arb'
  const chainConfig = getBlockchainById(chainParam)
  const resolvedChain = chainConfig?.alchemyId ?? chainParam
  const provider = (url.searchParams.get('provider') ?? 'primary').toString()
  if (!address) {
    return NextResponse.json({ error: 'address is required' }, { status: 400 })
  }
  try {
    const cacheKey = `${address}|${chainParam}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.t < 60000) {
      return NextResponse.json({ nfts: cached.nfts })
    }
    let nfts: NFTInfo[] = []
    try {
      nfts = await fetchFromAlchemy(address, resolvedChain)
    } catch {
      nfts = await fetchFromMoralis(address, chainConfig?.moralisId ?? chainParam)
    }
    // Normalize
    const simplified = nfts.map((n) => ({
      tokenId: n.tokenId,
      contractAddress: n.contractAddress,
      name: n.name,
      imageUrl: n.imageUrl,
      metadataUrl: n.metadataUrl
    }))
    // cache result
    cache.set(cacheKey, { t: Date.now(), nfts: simplified })
    return NextResponse.json({ nfts: simplified }, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' } })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
