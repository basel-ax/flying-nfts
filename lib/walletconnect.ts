// Gate flag for WalletConnect integration (default off for milestone)
export const ENABLE_WALLETCONNECT = false

// WalletConnect v2 integration skeleton (behind flag)
export type WalletConnectSession = {
  connected: boolean
  accounts?: string[]
  disconnect?: () => void
}

export async function initWalletConnect(): Promise<WalletConnectSession | null> {
  if (!ENABLE_WALLETCONNECT) {
    console.log('WalletConnect is disabled by feature flag.')
    return null
  }
  try {
    // Attempt dynamic import of WalletConnect v2 client if installed
    const wc = await import('@walletconnect/client')
    // Minimal skeleton: in a real integration you'd initialize the client here
    console.log('WalletConnect v2 skeleton loaded (client available).')
    const session: WalletConnectSession = { connected: false, accounts: [] }
    return session
  } catch {
    console.warn('WalletConnect library not available in this build.')
    return null
  }
}

export function isWalletConnectAvailable(): boolean {
  // Availability relies on the optional dependency; default false in skeleton
  return false
}
