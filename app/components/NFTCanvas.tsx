import React from 'react'
import { NFTInfo } from '../types'
import CanvasEngine from '../nft/CanvasEngine'

type Props = {
  nftInfos: NFTInfo[]
}

export default function NFTCanvas({ nftInfos }: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const engineRef = React.useRef<CanvasEngine | null>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // initialize engine
    const engine = new CanvasEngine(canvas)
    engine.setNFTs(nftInfos)
    engine.start()
    engineRef.current = engine
    const onResize = () => engine.resize()
    window.addEventListener('resize', onResize)
    return () => {
      engine.stop()
      window.removeEventListener('resize', onResize)
    }
  }, [nftInfos])

  // Listen for runtime settings updates from the SettingsPanel
  React.useEffect(() => {
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as { speed?: number; cap?: number; size?: number }
      engineRef.current?.updateSettings(detail ?? {})
    }
    window.addEventListener('nftSettingsChanged' as any, handler as any)
    window.addEventListener('settings-update' as any, handler as any)
    return () => {
      window.removeEventListener('nftSettingsChanged' as any, handler as any)
      window.removeEventListener('settings-update' as any, handler as any)
    }
  }, [])

  // re-apply assets on NFT list changes
  React.useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setNFTs(nftInfos)
    }
  }, [nftInfos])

  return (
    <div className="w-full h-full bg-white border rounded">
      <canvas ref={canvasRef} className="canvas-container w-full h-full" />
    </div>
  )
}
