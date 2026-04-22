# Flying NFTs Studio (Next.js + Tailwind)

This repository hosts a TypeScript Next.js app that renders NFT images as flying sprites on a canvas. Images come from on-chain NFT metadata for a given Arbitrum wallet.

## What you get
- Address-first NFT fetch using Cloudflare Pages Functions (edge) with a primary (Alchemy) and a secondary provider (Moralis).
- LocalStorage persistence for NFTs, settings, and last-address.
- Canvas-based animation with adjustable cap, speed, and size (default cap 100).
- White background; no runtime theme switching for initial phase.
- WalletConnect groundwork prepared for a future integration.

## Notes
- All assets PNGs previously in the repo have been removed; NFT images come from metadata URLs.
- Deployment targets Cloudflare Pages; ensure environment vars for ALCHEMY_API_KEY and MORALIS_API_KEY are configured in Pages.

## Usage
- Run locally with dev server: 
```
npm run dev
```
- Build for production: npm run build

## Local Development and Testing

### Prerequisites
- Node.js 18+ (LTS)
- npm or yarn

## Node.js version management (nvm)
- This project requires Node.js version 18 or newer. If you manage multiple Node versions, use nvm:
- Install and switch to Node 18 with:
  - nvm install 18
  - nvm use 18
  - nvm alias default 18
- Verify: node -v should show something like v18.x.x

### Setup local environment
- Install dependencies: `npm install`
- Create local environment variables in a `.env.local` file (this is for local development; Cloudflare Pages will provide keys in the edge environment):
  - `ALCHEMY_API_KEY=your_alchemy_api_key`
  - `MORALIS_API_KEY=your_moralis_api_key`
- If you don't have API keys yet, you can still run the app; NFT fetches will fail gracefully and you can test other UI parts.

### Run locally
- Start the dev server: `npm run dev` (uses Webpack on ARM64 platforms where Turbopack native bindings are unavailable)
- Open in your browser: http://localhost:3000
- The app uses the app directory structure and TailwindCSS for styling; changes hot-reload automatically.

### Test API and UI locally
- Smoke test for API: `npm run test:smoke` (requires the server to be up; checks missing-address path and API key handling)
- Manually test the NFT flow:
  1. Launch the app in the browser
  2. Enter a wallet address (Arbitrum) on the Start screen
  3. Click Load NFTs and observe the canvas animation with the flying NFT images loaded from metadata URLs
  4. Use the Settings panel to adjust speed, size, and cap (up to 1000) and verify live updates
- If a wallet address has no NFTs, the banner should reflect that and the canvas may show fewer sprites or none.

### Known issues & fixes applied
- **Node.js version**: Project requires Node 18+ (relaxed from >=22.0.0 to work with v20)
- **Turbopack on ARM64**: Dev server uses `--webpack` flag automatically for compatibility
- **Optional dependencies**: `@walletconnect/client` and `node-fetch` are optional dev dependencies
- **File permissions**: Fixed on `node_modules/.bin/*` executables

### Environment and deployment notes
- For Cloudflare Pages deployment, environment variables are configured on the Pages dashboard (ALCHEMY_API_KEY, MORALIS_API_KEY).
- The NFT data route is `/api/nfts` and is served via a Pages Function (edge) to keep keys secure and minimize latency.
- Local development uses `.env.local` to provide keys; cloud deployment uses Page environment variables.
- Ensure edge function routing supports `/api/nfts` and returns NFT data quickly; consider short TTL caching for performance.

### Deployment on Cloudflare Pages
- Cloudflare Pages will host the Next.js app; NFT data requests go through a Pages Function at /api/nfts to keep keys secure.
- Set environment variables for ALCHEMY_API_KEY and MORALIS_API_KEY in Pages.
- Build command: npm run build; publish directory depends on your Pages configuration (often .next or out for static export).
- Ensure edge function routing supports /api/nfts and returns NFT data quickly; consider short TTL caching for performance.

### Project overview
- Tech stack: TypeScript, Next.js app directory, TailwindCSS.
- Data: NFTs owned by a wallet address on Arbitrum, fetched via edge API routes; image data comes from NFT metadata URLs.
- UX: Canvas-based animation with configurable cap, speed, and size; white background; modern, minimal Settings Panel.
- Deployment: Cloudflare Pages with edge functions for NFT data access.
- Wallet-connect: scaffolding prepared for future integration behind ENABLE_WALLETCONNECT flag.

### Local environment configuration
- Local development uses a .env.local file to override environment variables at runtime. Create:
- .env.local with the following contents:
- ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY_HERE
- MORALIS_API_KEY=YOUR_MORALIS_API_KEY_HERE
- Instead of committing secrets, keep .env.local in your gitignore.
- For production deployment to Cloudflare Pages, environment variables are configured in the Pages dashboard and are not accessible from the client.

### CI and Testing Guidance
- This project supports smoke testing in CI to confirm the app builds, runs, and responds to basic API requests. The smoke tests are designed to be CI-friendly and do not require real NFT API keys to run.

- Quick CI run locally (simulate CI):
  1) npm ci
  2) npm run build
  3) npm run start &
  4) npm run test:smoke
  5) pkill -f node
- CI with real keys (optional):
  - In CI, set secrets for ALCHEMY_API_KEY and MORALIS_API_KEY if you want to exercise real NFT fetches.
  - Run steps 1-4; the tests will exercise missing-address (400) and missing-keys (500) paths when keys are absent.

- CI workflow example (GitHub Actions) snippet (illustrative):
```yaml
name: CI
on:
  push:
    branches: [ development, main ]
jobs:
  build-and-smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run start &
      - run: npm run test:smoke
      - run: pkill -f node
```
## Local Development Helpers

To simplify local setup, you can run the helper script that cleans dependencies, installs with legacy peer dependencies, and starts the dev server in the background.

- Script: `scripts/setup-dev.sh`
- Usage: `bash scripts/setup-dev.sh` (make it executable with `chmod +x scripts/setup-dev.sh` if you prefer `./scripts/setup-dev.sh`)
- What it does:
  - Removes `node_modules` for a clean slate
  - Runs `npm install --legacy-peer-deps`
  - Starts the Next.js dev server in the background
