import React from 'react'
import { NFTInfo } from '../types'
import SettingsPanel from './SettingsPanel'
import { ENABLE_WALLETCONNECT, createWalletConnectSession, MOCK_WALLETCONNECT } from '../../lib/walletconnect'

type Props = {
  onSubmit: (address: string) => Promise<NFTInfo[]>
  initialAddress?: string
  autoBanner?: string | null
}

export default function StartScreen({ onSubmit, initialAddress = '', autoBanner = null }: Props) {
  const [address, setAddress] = React.useState<string>(initialAddress)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const submit = async () => {
    setError(null)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError('Please enter a valid wallet address')
      return
    }
    setLoading(true)
    try {
      await onSubmit(address)
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
              body: JSON.stringify({ address: demoAddress, chain: 'arb' }),
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
        // Persist session via edge API route (session management on edge)
        try {
          await fetch('/api/wallet-connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: res.address, chain: 'arb' }),
          })
        } catch {
          // Non-fatal: continue with UI flow even if edge route is unavailable
        }
        // Autofill the connected address to proceed with NFT loading
        setAddress(res.address)
        // Auto-submit to load NFTs
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
        body: JSON.stringify({ address: addr, chain: 'arb' }),
      })
    } catch {
      // ignore
    }
    await submit()
  }

  return (
    <div className="bg-white rounded shadow p-6 h-full flex flex-col justify-center">
      {autoBanner && (
        <div className="mb-4 rounded border border-blue-200 bg-blue-50 text-blue-800 px-3 py-2 text-sm" role="status">
          {autoBanner}
        </div>
      )}
      <h1 className="text-2xl font-semibold mb-4">NFT Flying Studio</h1>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Wallet Address (Arbitrum)</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x..."
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {wcAvailable && (
          <button
            className="mb-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleWC}
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
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
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
