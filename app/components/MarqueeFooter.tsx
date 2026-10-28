'use client'
import React from 'react'
import blockchains from '../../config/blockchains.json'

type BlockchainConfig = {
  id: string
  name: string
  alchemyId: string
  moralisId: string
  chainId: string
  message: string
  color: string
}

export default function MarqueeFooter() {
  const [chainData, setChainData] = React.useState<BlockchainConfig | null>(null)
  const [nftCount, setNftCount] = React.useState<number>(0)
  const [walletAddress, setWalletAddress] = React.useState<string>('')

  React.useEffect(() => {
    const saved = localStorage.getItem('nftApp.selectedChain')
    const config = blockchains.find((b: BlockchainConfig) => b.id === saved)
    setChainData(config ? (blockchains[0] as BlockchainConfig) : (blockchains[0] as BlockchainConfig))

    try {
      const stored = localStorage.getItem('nftApp.nfts')
      const nfts = stored ? JSON.parse(stored) : []
      setNftCount(nfts.length)
    } catch {
      setNftCount(0)
    }

    const last = localStorage.getItem('nftApp.lastAddress')
    if (last) {
      setWalletAddress(`${last.substring(0, 6)}...${last.substring(last.length - 4)}`)
    }
  }, [])

  if (!chainData) {
    return null
  }

  const chainName = chainData.name.toUpperCase()
  const chainColor = chainData.color
  const chainMessage = chainData.message

  const fullMessage = `🎮 ${nftCount} NFTs FLYING FROM ${walletAddress || 'NO WALLET'} ON ${chainName} | ${chainMessage} | FLYING NFTS STUDIO 🎮 ${nftCount} NFTs FLYING FROM ${walletAddress || 'NO WALLET'} ON ${chainName} | ${chainMessage} | FLYING NFTS STUDIO `

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-50 px-0 py-0 overflow-hidden"
      style={{ backgroundColor: chainColor }}
    >
      <div className="marquee-track">
        <div className="marquee-content marquee-fast">
          <span
            className="inline-block py-3 px-8 text-xl font-bold tracking-wider whitespace-nowrap"
            style={{
              color: '#FFFFFF',
              textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.5)'
            }}
          >
            {fullMessage}
          </span>
        </div>
      </div>
    </footer>
  )
}