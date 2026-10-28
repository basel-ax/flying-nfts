import React from 'react'
import { NFTInfo } from '../types'
import SettingsPanel from './SettingsPanel'
import ChainSelector from './ChainSelector'
import Footer from './Footer'
import { ENABLE_WALLETCONNECT, createWalletConnectSession, MOCK_WALLETCONNECT } from '../../lib/walletconnect'
import { saveSelectedChain, loadSelectedChain } from '../../lib/storage'

type Props = {
  onSubmit: (address: string, chain: string) => Promise<NFTInfo[]>
  selectedChain: string
  onChainChange: (chainId: string) => void
  initialAddress?: string
  autoBanner?: string | null
}

export default function StartScreen({ onSubmit, selectedChain, onChainChange, initialAddress = '', autoBanner = null }: Props) {
  const [address, setAddress] = React.useState<string>(initialAddress)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [chain, setChain] = React.useState<string>(selectedChain)

  React.useEffect(() => {
    const saved = loadSelectedChain()
    if (saved) {
      setChain(saved)
      onChainChange(saved)
    }
  }, [])

  const handleChainChange = (chainId: string) => {
    setChain(chainId)
    saveSelectedChain(chainId)
    onChainChange(chainId)
  }

  const submit = async () => {
    setError(null)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError('Please enter a valid wallet address')
      return
    }
    setLoading(true)
    try {
      await onSubmit(address, chain)
    } catch (e) {
      setError('Failed to load NFTs')
    } finally {
      setLoading(false)
    }
  }

  // basic layout: address input and actions
  const wcAvailable = typeof window !== 'undefined' && ENABLE_WALLETCONNECT
  // For UX, provide a banner when WalletConnect is gated off and not available yet
  // When WalletConnect is enabled, attempt a real connection via the library
  const [wcUri, setWcUri] = React.useState<string | null>(null)
  const [wcVisible, setWcVisible] = React.useState(false)
  const handleWC = async () => {
    try {
      const res = await createWalletConnectSession()
      if (!res) {
        // If MOCK_WALLETCONNECT is enabled, provide a demo flow address
        if (MOCK_WALLETCONNECT) {
          const demoAddress = '0x000000000000000000000000000000000000dead'
          setAddress(demoAddress)
          try {
            await fetch('/api/wallet-connect', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ address: demoAddress, chain: chain }),
            })
          } catch {
            // ignore
          }
          await submit()
          return
        }
        alert('WalletConnect integration is not available in this build.')
        return
      }
      if (res.address) {
        try {
          await fetch('/api/wallet-connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: res.address, chain: chain }),
          })
        } catch {
          // Non-fatal: continue with UI flow even if edge route is unavailable
        }
        setAddress(res.address)
        await submit()
        return
      }
      if (res.uri) {
        setWcUri(res.uri)
        setWcVisible(true)
        return
      }
      // Fallback: no data returned
      alert('WalletConnect flow did not return an address or URI.')
    } catch {
      alert('WalletConnect integration is not available in this build.')
    }
  }

  // Demo wallet connect grid (mock) when MOCK_WALLETCONNECT is enabled
  const mockWallets = [
    '0x1111111111111111111111111111111111111111',
    '0x2222222222222222222222222222222222222222',
    '0x3333333333333333333333333333333333333333',
  ]

  const onMockConnect = async (addr: string) => {
    setAddress(addr)
    try {
      await fetch('/api/wallet-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addr, chain: chain }),
      })
    } catch {
      // ignore
    }
    await submit()
  }

  return (
    <div className="surface-dark rounded p-6 h-full flex flex-col justify-center neon-border">
      {autoBanner && (
        <div className="mb-4 rounded border px-3 py-2 text-sm neon-border-pink" style={{borderColor: 'var(--cyberpunk-pink)', backgroundColor: 'var(--cyberpunk-surface-light)', color: 'var(--cyberpunk-pink)'}} role="status">
          {autoBanner}
        </div>
      )}
      <h1 className="text-2xl font-semibold mb-4 neon-glow-text" style={{color: 'var(--cyberpunk-cyan)'}}>NFT Flying Studio</h1>
      <div className="space-y-4">
        <ChainSelector selectedChain={chain} onChange={handleChainChange} />
        <label className="block text-sm font-medium" style={{color: 'var(--cyberpunk-text-muted)'}}>Wallet Address</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x..."
          className="w-full rounded px-3 py-2 transition-all duration-200"
          style={{backgroundColor: 'var(--cyberpunk-surface-light)', color: 'var(--cyberpunk-text)', border: '1px solid var(--cyberpunk-border)'}}
        />
        {error && <div className="text-sm font-medium" style={{color: 'var(--cyberpunk-red)'}}>{error}</div>}
        {wcAvailable && (
          <button
            className="mb-2 px-4 py-2 rounded transition-all duration-200 hover:scale-105"
            onClick={handleWC}
          style={{backgroundColor: 'var(--cyberpunk-green)', color: '#000'}}
          >
            Connect Wallet (WalletConnect v2)
          </button>
        )}
        {address && address.length > 0 && (
          <div className="text-sm text-gray-600 mt-1">Connected: {address.substring(0,6)}...{address.substring(address.length-4)}</div>
        )}
      {wcVisible && wcUri && (
        <div className="mt-2 border rounded p-3 bg-yellow-50 text-sm text-yellow-800">
          WalletConnect URI: <span className="break-words">{wcUri}</span>
          <div className="mt-2 flex gap-2">
            <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={() => {
              navigator.clipboard?.writeText(wcUri)
            }}>Copy URI</button>
            <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => setWcVisible(false)}>Close</button>
          </div>
        </div>
      )}
      {/* Simple in-app mock wallet connect flow for demonstration */}
      {MOCK_WALLETCONNECT && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          <div className="text-sm font-semibold mb-2">Demo WalletConnect (mock)</div>
          <div className="grid grid-cols-3 gap-2">
            {mockWallets.map((a) => (
              <button
                key={a}
                className="px-2 py-1 border rounded bg-white hover:bg-gray-100 text-xs"
                onClick={() => onMockConnect(a)}
              >
                {a.substring(0,6)}...{a.substring(a.length-4)}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2">Tip: This is a demo flow. In production, WalletConnect v2 modal will appear.</div>
        </div>
      )}
        <button
          onClick={submit}
          className="px-4 py-2 rounded transition-all duration-200 hover:scale-105 disabled:opacity-50"
          disabled={loading}
          style={{backgroundColor: 'var(--cyberpunk-cyan)', color: '#000'}}
        >
          {loading ? 'Loading...' : 'Load NFTs'}
        </button>
      </div>
      <div className="mt-6">
        <SettingsPanel />
      </div>
    </div>
  )
}
