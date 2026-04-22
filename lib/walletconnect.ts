// Gate flag for WalletConnect integration (default off for milestone)
// Enable via NEXT_PUBLIC_ENABLE_WALLETCONNECT=true in environment (client-safe)
export const ENABLE_WALLETCONNECT = true

// Optional mock mode for local development and UI wiring without a real wallet
export const MOCK_WALLETCONNECT = (process.env.NEXT_PUBLIC_WALLETCONNECT_MOCK === 'true')

// WalletConnect v2 integration skeleton (behind flag)
export type WalletConnectSession = {
  connected: boolean
  accounts?: string[]
  disconnect?: () => void
}

// Internal last connected address (shared across MVP flows)
let _connectedAddress: string | null = null
export function getConnectedWalletAddress(): string | null {
  return _connectedAddress
}

export async function initWalletConnect(): Promise<WalletConnectSession | null> {
  if (!ENABLE_WALLETCONNECT) {
    console.log('WalletConnect is disabled by feature flag.')
    return null
  }
  try {
    // If in mock mode, return a ready session with a dummy address
    if (MOCK_WALLETCONNECT) {
      const mockAddress = '0x000000000000000000000000000000000000dead'
      console.log('WalletConnect mock session created (address:', mockAddress, ')')
      const session: WalletConnectSession = { connected: true, accounts: [mockAddress] }
      _connectedAddress = mockAddress
      return session
    }
    // Legacy WalletConnect client (v1) skeleton
    const wc = await import('@walletconnect/client')
    // Minimal skeleton: in a real integration you'd initialize the client here
    console.log('WalletConnect legacy client loaded (v1 skeleton).')
    const session: WalletConnectSession = { connected: false, accounts: [] }
    return session
  } catch {
    console.warn('WalletConnect library not available in this build.')
    return null
  }
}

export function isWalletConnectAvailable(): boolean {
  // Availability relies on the optional dependency; reflect the flag
  return ENABLE_WALLETCONNECT
}

// Lightweight entry point for wallet connection; returns an address if connected
export async function connectWallet(): Promise<string | null> {
  if (!ENABLE_WALLETCONNECT) return null
  // Mock mode is useful for local UI wiring without a real wallet
  if (MOCK_WALLETCONNECT) {
    const mockAddress = '0x000000000000000000000000000000000000dead'
    console.log('WalletConnect mock connected, address:', mockAddress)
    return mockAddress
  }
  try {
    // Attempt real WalletConnect v2 flow if the library is available
    const wcModule = await import('@walletconnect/client')
    const wcClientFactory: any = (wcModule as any).default?.createClient || (wcModule as any).default || (wcModule as any).WalletConnect
    let client: any
    // Try common factory paths
    if (typeof wcClientFactory === 'function') {
      client = await wcClientFactory({
        relayUrl: 'wss://relay.walletconnect.org',
        metadata: {
          name: 'Flying NFTs Studio',
          description: 'WalletConnect integration for NFT viewer',
          url: 'https://localhost',
          icons: [],
        },
      })
    } else {
      const WCClass = (wcModule as any).WalletConnect
      if (WCClass) {
        client = new WCClass({
          relayUrl: 'wss://relay.walletconnect.org',
          clientMeta: {
            name: 'Flying NFTs Studio',
            description: 'WalletConnect integration for NFT viewer',
            url: 'https://localhost',
            icons: [],
          },
        })
      }
    }

    if (!client) {
      console.warn('WalletConnect client not initialized.');
      return null
    }

    // Initiate connection; v2 returns a URI for a QR/deeplink flow
    const res: any = await client.connect({
      requiredNamespaces: {
        eip155: {
          chains: ['eip155:42161'],
          methods: ['eth_sendTransaction', 'eth_sign', 'personal_sign'],
          events: ['accountsChanged'],
        },
      },
    })

    // If the library returns an address directly, use it
    const potentialAccounts: string[] | undefined = res?.accounts
    if (Array.isArray(potentialAccounts) && potentialAccounts.length > 0) {
      // Pick the first account as the connected address
      const addr = potentialAccounts[0]
      console.log('WalletConnect real session connected, address:', addr)
      _connectedAddress = addr
      return addr
    }

    // Some flows provide the accounts on the client/session object after approval
    const accountsFromClient: string[] | undefined = client?.accounts
    if (Array.isArray(accountsFromClient) && accountsFromClient.length > 0) {
      _connectedAddress = accountsFromClient[0]
      return accountsFromClient[0]
    }

    // If we reach here, no address yet; the user must approve the connection in their wallet
    // A real implementation would listen for session events and resolve when accounts appear.
    // For MVP, return null and let the user retry or continue with manual address input.
    console.log('WalletConnect: awaiting user approval in wallet app.')
    return null
  } catch (err) {
    console.warn('WalletConnect real integration failed to initialize or connect:', err)
    return null
  }
}

// Create a WalletConnect session and return a URI for scanning or the connected address if already available
export async function createWalletConnectSession(): Promise<{ uri?: string; address?: string } | null> {
  if (!ENABLE_WALLETCONNECT) return null
  // Mock path: provide a fake URI and a pre-known address to simulate flow
  if (MOCK_WALLETCONNECT) {
    const mockAddress = '0x000000000000000000000000000000000000dead'
    _connectedAddress = mockAddress
    return { address: mockAddress }
  }
  try {
    const wcModule = await import('@walletconnect/client')
    // Best-effort: try a standard creation path to obtain a URI for QR/deep-link flow
    const wcClient = (wcModule as any).default || wcModule
    let client: any
    if (typeof wcClient?.createClient === 'function') {
      client = wcClient.createClient({
        relayProvider: 'wss://relay.walletconnect.org',
        // minimal metadata
        metadata: {
          name: 'Flying NFTs Studio',
          description: 'WalletConnect integration for NFT viewer',
          url: 'https://localhost',
          icons: [],
        },
      })
    }
    if (!client) return null
    // Try to create a URI; not guaranteed across versions
    const res: any = await client.connect({})
    if (res?.uri) {
      return { uri: res.uri }
    }
    if (Array.isArray(res?.accounts) && res.accounts.length > 0) {
      const addr = res.accounts[0]
      _connectedAddress = addr
      return { address: addr }
    }
    // If the library exposes accounts on a different path, attempt a light check
    if (Array.isArray(client?.accounts) && client.accounts.length > 0) {
      const addr = client.accounts[0]
      _connectedAddress = addr
      return { address: addr }
    }
    return null
  } catch {
    // If WalletConnect isn't wired up fully, return null to let UI fallback
    return null
  }
}
