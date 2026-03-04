export default class CanvasEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private sprites: NFTSprite[] = []
  private raf?: number
  private running = false
  private lastTime = 0
  private cap = 100
  private speed = 1.0
  private baseScale = 1.0
  private devicePixelRatio = 1

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context not available')
    this.ctx = ctx
    this.resize()
  }

  

  updateSettings(settings: { speed?: number; cap?: number; size?: number }) {
    if (settings.speed !== undefined) this.speed = settings.speed
    if (settings.cap !== undefined) {
      this.cap = Math.max(1, settings.cap)
      if (this.sprites.length > this.cap) this.sprites.length = this.cap
    }
    if (settings.size !== undefined) this.baseScale = settings.size
  }

  setNFTs(nfts: { imageUrl?: string; tokenId?: string; name?: string }[]) {
    // preload up to cap assets
    const toUse = nfts.slice(0, Math.max(0, Math.min(this.cap, nfts.length)))
    this.sprites = toUse
      .map((n, i) => {
        const img = new Image()
        img.src = n.imageUrl ?? ''
        const s = new NFTSprite(img, Math.random() * this.canvas.width, Math.random() * this.canvas.height, 0.6 + Math.random() * 1.4)
        s.name = n.name ?? ''
        // random initial velocity
        s.vx = (Math.random() - 0.5) * 0.6
        s.vy = (Math.random() - 0.5) * 0.6
        s.scale = (0.5 + Math.random() * 1.5) * this.baseScale
        s.rotation = Math.random() * Math.PI * 2
        s.rotationSpeed = (Math.random() - 0.5) * 0.02
        return s
      })
      .filter((s) => !!s.image?.src || s.imageUrl?.length || s.image?.src !== '')
    // enforce cap after refresh
    if (this.sprites.length > this.cap) {
      this.sprites.length = this.cap
    }
  }

  start() {
    if (this.running) return
    this.running = true
    this.lastTime = performance.now()
    const loop = (t: number) => {
      if (!this.running) return
      const dt = Math.min(50, t - this.lastTime) // clamp delta
      this.lastTime = t
      this.update(dt)
      this.render()
      this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)
  }

  stop() {
    this.running = false
    if (this.raf) cancelAnimationFrame(this.raf)
  }

  resize() {
    const dpr = Math.max(window.devicePixelRatio || 1, 1)
    this.devicePixelRatio = dpr
    this.canvas.width = this.canvas.clientWidth * dpr
    this.canvas.height = this.canvas.clientHeight * dpr
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  update(dt: number) {
    const w = this.canvas.clientWidth
    const h = this.canvas.clientHeight
    this.sprites.forEach((s) => {
      s.x += s.vx * dt
      s.y += s.vy * dt
      s.rotation += s.rotationSpeed * dt
      // bounce
      if (s.x < 0 || s.x > w) s.vx *= -1
      if (s.y < 0 || s.y > h) s.vy *= -1
    })
  }

  render() {
    const w = this.canvas.clientWidth
    const h = this.canvas.clientHeight
    this.ctx.clearRect(0, 0, w, h)
    // white background
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, w, h)
    // draw sprites
    this.sprites.forEach((s) => {
      if (!s.image?.complete) return
      const imgW = (s.image?.naturalWidth ?? 100) * s.scale
      const imgH = (s.image?.naturalHeight ?? 100) * s.scale
      const x = s.x
      const y = s.y
      this.ctx.save()
      this.ctx.translate(x, y)
      this.ctx.rotate(s.rotation)
      this.ctx.drawImage(s.image, -imgW / 2, -imgH / 2, imgW, imgH)
      this.ctx.restore()
    })
  }

  setHeightOverride(h: number) {
    // reserved for future UX
  }

  // helper for initial assets
  getNFTCount() {
    return this.sprites.length
  }
}

class NFTSprite {
  image: HTMLImageElement
  x: number
  y: number
  vx: number
  vy: number
  scale: number
  rotation: number
  rotationSpeed: number
  name?: string
  constructor(image: HTMLImageElement, x: number, y: number, scale: number) {
    this.image = image
    this.x = x
    this.y = y
    this.vx = 0
    this.vy = 0
    this.scale = scale
    this.rotation = 0
    this.rotationSpeed = 0
  }
}
