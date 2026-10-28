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
      <label className="text-sm font-medium" style={{color: 'var(--cyberpunk-text-muted)'}}>Network</label>
      <select
        value={selectedChain}
        onChange={(e) => onChange(e.target.value)}
        className="rounded px-2 py-1 text-sm transition-all duration-200"
        style={{backgroundColor: 'var(--cyberpunk-surface-light)', color: 'var(--cyberpunk-text)', border: '1px solid var(--cyberpunk-border)'}}
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