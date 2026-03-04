"use client";
import React from 'react'
import StartScreen from './components/StartScreen'
import NFTCanvas from './components/NFTCanvas'
import { NFTInfo } from './types'

type NFTAppState = {
  nfts: NFTInfo[]
  lastAddress: string | null
}

export default function Page() {
  const [state, setState] = React.useState<NFTAppState>({ nfts: [], lastAddress: null })
  const [autoBanner, setAutoBanner] = React.useState<string | null>(null)

  // Simple in-app bridge to fetch NFTs via API route
  const loadNFTs = async (address: string) => {
    try {
      const res = await fetch(`/api/nfts?address=${address}&provider=primary&chain=arbitrum`)
      const data = await res.json()
      const nfts = data?.nfts ?? []
      // Persist in localStorage and update state
      if (typeof window !== 'undefined') {
        localStorage.setItem('nftApp.nfts', JSON.stringify(nfts))
        localStorage.setItem('nftApp.lastAddress', address)
      }
      setState({ nfts, lastAddress: address })
      // banner text with shortened address snippet
      const shortAddr = address.substring(0, 6)
      const banner = nfts.length > 0 ? `Auto-loaded ${nfts.length} NFT(s) for address ${shortAddr}...` : `No NFTs found for address ${shortAddr}...`
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
      const t = setTimeout(() => loadNFTs(addr), 500)
      return () => clearTimeout(t)
    }
  }, [state.lastAddress, state.nfts.length])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 grid grid-cols-12">
        <div className="col-span-6 p-4">
          <StartScreen onSubmit={loadNFTs} initialAddress={state.lastAddress ?? ''} autoBanner={autoBanner} />
        </div>
        <div className="col-span-6 p-4">
          <NFTCanvas nftInfos={state.nfts} />
        </div>
      </div>
    </div>
  )
}
