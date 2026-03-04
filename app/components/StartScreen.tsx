import React from 'react'
import { NFTInfo } from '../types'
import SettingsPanel from './SettingsPanel'
import { ENABLE_WALLETCONNECT } from '../../lib/walletconnect'

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
  const handleWC = async () => {
    // Placeholder for future WalletConnect flow; show a friendly notice
    alert('WalletConnect v2 integration will be wired in a future update.')
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
            Connect Wallet (WalletConnect v2) - Coming
          </button>
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
