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
    <div className="bg-gray-50 p-4 rounded border">
      <div className="mb-2 font-semibold">Settings</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Speed</label>
          <input type="range" min={0.1} max={3} step={0.1} value={settings.speed}
            onChange={(e) => setSettings({ ...settings, speed: parseFloat(e.target.value) })}
            className="w-full" />
          <div className="text-sm text-gray-600">{settings.speed.toFixed(1)}x</div>
        </div>
        <div>
          <label className="block text-sm">NFT Size</label>
          <input type="range" min={0.5} max={2.0} step={0.1} value={settings.size}
            onChange={(e) => setSettings({ ...settings, size: parseFloat(e.target.value) })}
            className="w-full" />
          <div className="text-sm text-gray-600">{settings.size.toFixed(1)}x</div>
        </div>
        <div>
          <label className="block text-sm">Cap</label>
          <input type="range" min={10} max={1000} step={10} value={settings.cap}
            onChange={(e) => setSettings({ ...settings, cap: parseInt(e.target.value) })}
            className="w-full" />
          <div className="text-sm text-gray-600">{settings.cap} NFTs</div>
        </div>
        <div>
          <label className="block text-sm">Background</label>
          <div className="text-sm text-gray-600">White (fixed)</div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
        <button className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
