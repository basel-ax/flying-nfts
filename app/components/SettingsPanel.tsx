import React from 'react'

type Settings = {
  speed: number
  size: number
  cap: number
  background: 'white'
}

const defaultSettings: Settings = {
  speed: 1.0,
  size: 1.0,
  cap: 100,
  background: 'white'
}

export default function SettingsPanel() {
  const [settings, setSettings] = React.useState<Settings>(() => {
    try {
      const s = localStorage.getItem('nftApp.settings')
      return s ? JSON.parse(s) : defaultSettings
    } catch {
      return defaultSettings
    }
  })

  React.useEffect(() => {
    localStorage.setItem('nftApp.settings', JSON.stringify(settings))
  }, [settings])

  const reset = () => {
    if (!confirm('Reset to defaults and clear NFT cache?')) return
    localStorage.removeItem('nftApp.settings')
    localStorage.removeItem('nftApp.nfts')
    setSettings(defaultSettings)
  }

  return (
    <div className="p-4 rounded neon-border" style={{backgroundColor: 'var(--cyberpunk-surface)'}}>
      <div className="mb-2 font-semibold neon-glow-text-sm" style={{color: 'var(--cyberpunk-cyan)'}}>Settings</div>
      <div className="grid grid-cols-2 gap-4">
<div>
           <label className="block text-sm" style={{color: 'var(--cyberpunk-text-muted)'}}>Speed</label>
           <input type="range" min={0.1} max={3} step={0.1} value={settings.speed}
             onChange={(e) => setSettings({ ...settings, speed: parseFloat(e.target.value) })}
             className="w-full" />
           <div className="text-sm" style={{color: 'var(--cyberpunk-cyan)'}}>{settings.speed.toFixed(1)}x</div>
         </div>
         <div>
           <label className="block text-sm" style={{color: 'var(--cyberpunk-text-muted)'}}>NFT Size</label>
           <input type="range" min={0.5} max={2.0} step={0.1} value={settings.size}
             onChange={(e) => setSettings({ ...settings, size: parseFloat(e.target.value) })}
             className="w-full" />
           <div className="text-sm" style={{color: 'var(--cyberpunk-cyan)'}}>{settings.size.toFixed(1)}x</div>
         </div>
         <div>
           <label className="block text-sm" style={{color: 'var(--cyberpunk-text-muted)'}}>Cap</label>
           <input type="range" min={10} max={1000} step={10} value={settings.cap}
             onChange={(e) => setSettings({ ...settings, cap: parseInt(e.target.value) })}
             className="w-full" />
           <div className="text-sm" style={{color: 'var(--cyberpunk-cyan)'}}>{settings.cap} NFTs</div>
         </div>
      </div>
      <div className="mt-3 flex gap-2">
<button
           className="px-3 py-2 rounded transition-all duration-200 hover:scale-105"
           style={{backgroundColor: 'var(--cyberpunk-cyan)', color: '#000'}}
          onClick={() => {
            const detail = {
              speed: settings.speed,
              cap: settings.cap,
              size: settings.size
            }
            // broadcast to runtime listeners
            window.dispatchEvent(new CustomEvent('nftSettingsChanged', { detail }))
            // also for compatibility with existing listener
            window.dispatchEvent(new CustomEvent('settings-update', { detail }))
          }}
        >Apply</button>
        <button className="px-3 py-2 rounded transition-all duration-200 hover:scale-105" style={{backgroundColor: 'var(--cyberpunk-border)', color: 'var(--cyberpunk-text)'}} onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
