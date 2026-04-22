import React from 'react'
import { getBlockchainConfigs } from '../../lib/blockchains'
import type { BlockchainConfig } from '../types'

type Props = {
  selectedChain: string
  onChange: (chainId: string) => void
}

export default function ChainSelector({ selectedChain, onChange }: Props) {
  const configs = getBlockchainConfigs()

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">Network</label>
      <select
        value={selectedChain}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
      >
        {configs.map((config: BlockchainConfig) => (
          <option key={config.id} value={config.id}>
            {config.name}
          </option>
        ))}
      </select>
    </div>
  )
}