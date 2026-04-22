import blockchains from '../config/blockchains.json'
import type { BlockchainConfig } from '../app/types'

export function getBlockchainConfigs(): BlockchainConfig[] {
  return blockchains as BlockchainConfig[]
}

export function getBlockchainById(id: string): BlockchainConfig | undefined {
  return (blockchains as BlockchainConfig[]).find((b) => b.id === id)
}