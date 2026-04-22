"use client";
import React from 'react'
import StartScreen from './components/StartScreen'
import NFTCanvas from './components/NFTCanvas'
import { NFTInfo } from './types'
import { loadSelectedChain } from '../lib/storage'

type NFTAppState = {
  nfts: NFTInfo[]
  lastAddress: string | null
}

export default function Page() {
  const [state, setState] = React.useState<NFTAppState>({ nfts: [], lastAddress: null })
  const [autoBanner, setAutoBanner] = React.useState<string | null>(null)
  const [selectedChain, setSelectedChain] = React.useState<string>('arb')

  React.useEffect(() => {
    const saved = loadSelectedChain()
    if (saved) {
      setSelectedChain(saved)
    }
  }, [])

  const handleChainChange = (chainId: string) => {
    setSelectedChain(chainId)
  }

  const loadNFTs = async (address: string, chain: string) => {
    try {
      const res = await fetch(`/api/nfts?address=${address}&provider=primary&chain=${chain}`)
      const data = await res.json()
      const nfts = data?.nfts ?? []
      if (typeof window !== 'undefined') {
        localStorage.setItem('nftApp.nfts', JSON.stringify(nfts))
        localStorage.setItem('nftApp.lastAddress', address)
      }
      setState({ nfts, lastAddress: address })
      const shortAddr = address.substring(0, 6)
      const banner = nfts.length > 0 ? `Loaded ${nfts.length} NFT(s) from ${shortAddr}... on ${chain.toUpperCase()}` : `No NFTs found for address ${shortAddr}...`
      setAutoBanner(banner)
      return nfts
    } catch (e) {
      console.error('Failed to load NFTs', e)
      setAutoBanner('Failed to load NFTs; please try again')
      return []
    }
  }

  // Hydrate from localStorage on first mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('nftApp.nfts')
      const last = localStorage.getItem('nftApp.lastAddress')
      const nfts = stored ? JSON.parse(stored) : []
      setState({ nfts, lastAddress: last })
    } catch {
      // ignore
    }
  }, [])

  // Auto-load NFT data for lastAddress to improve UX
  React.useEffect(() => {
    const addr = state.lastAddress
    if (addr && state.nfts.length === 0) {
      const t = setTimeout(() => loadNFTs(addr, selectedChain), 500)
      return () => clearTimeout(t)
    }
  }, [state.lastAddress, state.nfts.length, selectedChain])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 grid grid-cols-12">
        <div className="col-span-6 p-4">
          <StartScreen onSubmit={loadNFTs} selectedChain={selectedChain} onChainChange={handleChainChange} initialAddress={state.lastAddress ?? ''} autoBanner={autoBanner} />
        </div>
        <div className="col-span-6 p-4">
          <NFTCanvas nftInfos={state.nfts} />
        </div>
      </div>
    </div>
  )
}
