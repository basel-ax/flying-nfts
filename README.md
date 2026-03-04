# Flying NFTs Studio (Next.js + Tailwind)

This repository hosts a TypeScript Next.js app that renders NFT images as flying sprites on a canvas. Images come from on-chain NFT metadata for a given Arbitrum wallet.

What you get
- Address-first NFT fetch using Cloudflare Pages Functions (edge) with a primary (Alchemy) and a secondary provider (Moralis).
- LocalStorage persistence for NFTs, settings, and last-address.
- Canvas-based animation with adjustable cap, speed, and size (default cap 100).
- White background; no runtime theme switching for initial phase.
- WalletConnect groundwork prepared for a future integration.

Notes
- All assets PNGs previously in the repo have been removed; NFT images come from metadata URLs.
- Deployment targets Cloudflare Pages; ensure environment vars for ALCHEMY_API_KEY and MORALIS_API_KEY are configured in Pages.

Usage
- Run locally with dev server: npm run dev
- Build for production: npm run build
