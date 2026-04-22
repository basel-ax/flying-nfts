export type NFTInfo = {
  tokenId: string
  contractAddress: string
  name?: string
  imageUrl?: string
  metadataUrl?: string
}

export type BlockchainConfig = {
  id: string
  name: string
  alchemyId: string
  moralisId: string
  chainId: string
  message: string
  color: string
}
