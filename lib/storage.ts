export function saveNFTs(nfts: any[]) {
  localStorage.setItem('nftApp.nfts', JSON.stringify(nfts))
}

export function loadNFTs(): any[] {
  const s = localStorage.getItem('nftApp.nfts')
  if (!s) return []
  try {
    return JSON.parse(s)
  } catch {
    return []
  }
}

export function saveSettings(s: any) {
  localStorage.setItem('nftApp.settings', JSON.stringify(s))
}

export function loadSettings(): any {
  const s = localStorage.getItem('nftApp.settings')
  if (!s) return { speed: 1.0, size: 1.0, cap: 100, background: 'white' }
  try {
    return JSON.parse(s)
  } catch {
    return { speed: 1.0, size: 1.0, cap: 100, background: 'white' }
  }
}

export function saveLastAddress(addr: string) {
  localStorage.setItem('nftApp.lastAddress', addr)
}

export function loadLastAddress(): string | null {
  return localStorage.getItem('nftApp.lastAddress')
}

export function saveSelectedChain(id: string) {
  localStorage.setItem('nftApp.selectedChain', id)
}

export function loadSelectedChain(): string | null {
  return localStorage.getItem('nftApp.selectedChain')
}
