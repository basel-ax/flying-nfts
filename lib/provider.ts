export type NFTInfo = {
  tokenId: string
  contractAddress: string
  name?: string
  imageUrl?: string
  metadataUrl?: string
}

export async function fetchNFTsAlchemy(address: string, chain: string = 'arb'): Promise<NFTInfo[]> {
  const key = process.env.ALCHEMY_API_KEY
  if (!key) throw new Error('Missing Alchemy API Key')
  const base = `https://eth-${chain}.g.alchemy.com/v2/${key}`
  const url = `${base}/getNFTs?owner=${address}&withMetadata=true`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Alchemy fetch failed')
  const data = await res.json()
  return ((data?.ownedNfts ?? []) as any[]).map((n) => ({
    tokenId: String(n?.id?.tokenId ?? n?.tokenId ?? ''),
    contractAddress: String(n?.contract?.address ?? n?.contractAddress ?? ''),
    name: n?.metadata?.name ?? n?.title ?? '',
    imageUrl: n?.metadata?.image ?? n?.image ?? '',
    metadataUrl: n?.metadataUrl ?? ''
  }))
}

export async function fetchNFTsMoralis(address: string, chain: string = 'arb'): Promise<NFTInfo[]> {
  const key = process.env.MORALIS_API_KEY
  if (!key) throw new Error('Missing Moralis API Key')
  const url = `https://deep-index.moralis.io/api/v1/${address}/nft?chain=${chain}&format=decimal`
  const res = await fetch(url, { headers: { 'X-API-Key': key } })
  if (!res.ok) throw new Error('Moralis fetch failed')
  const data = await res.json()
  return ((data?.result ?? []) as any[]).map((n) => ({
    tokenId: String(n?.token_id ?? ''),
    contractAddress: String(n?.token_address ?? ''),
    name: n?.name ?? n?.symbol ?? '',
    imageUrl: n?.thumbnail ?? n?.image_url ?? '',
    metadataUrl: n?.metadata_url ?? ''
  }))
}
