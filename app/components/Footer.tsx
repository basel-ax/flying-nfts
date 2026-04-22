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

export default function Footer() {
  const [selectedChain, setSelectedChain] = React.useState<BlockchainConfig | null>(null)

  React.useEffect(() => {
    const saved = localStorage.getItem('nftApp.selectedChain')
    if (saved) {
      const config = blockchains.find((b: BlockchainConfig) => b.id === saved)
      if (config) {
        setSelectedChain(config)
        return
      }
    }
    setSelectedChain(blockchains[0] as BlockchainConfig)
  }, [])

  if (!selectedChain) {
    return null
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 px-4 py-2 text-center text-sm text-gray-600">
      <span
        className="inline-flex items-center gap-2"
        style={{ color: selectedChain.color }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: selectedChain.color }}
        />
        {selectedChain.message}
      </span>
    </footer>
  )
}