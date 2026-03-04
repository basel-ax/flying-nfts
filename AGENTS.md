# AGENTS for Flying NFTs Studio

This repository hosts a small TypeScript Next.js application that renders NFT images as flying sprites using an HTML canvas. The project has been migrated to a modern stack (TypeScript, Next.js app directory, TailwindCSS) and uses NFT metadata for imagery instead of embedded assets. Deployment targets Cloudflare Pages with edge functions for NFT data access.

The following guidance is intended for AI coding agents operating in this repository. It describes the intended workflow, tooling, and safe patterns to follow when making changes.

## Project context and goals
- Tech stack: TypeScript, Next.js (app directory), TailwindCSS.
- Data: NFTs owned by a wallet address on Arbitrum, fetched via edge API routes; image data comes from NFT metadata URLs.
- UX: A modern canvas-based animation with a configurable cap, speed, and size; a white background in the initial phase; a polished settings panel; and a simple start screen for wallet input.
- Deployment: Cloudflare Pages with Pages Functions to securely fetch NFT data, keys kept on the edge, no embedded PNG assets in the repo.
- Wallet-connect: scaffolding prepared for future integration (gate via a feature flag; not enabled by default).

## How to work in this repo (pattern for agents)
- Make small, isolated changes in focused patches. Prefer updates to a single directory rather than sweeping edits across multiple files.
- Use the patching workflow: create a branch, apply changes, run tests locally, and generate patches for review. When possible, keep changes small and cohesive (one feature per patch).
- Use edge API routes for any external API keys or third-party services; never commit secrets. Place keys in environment variables.
- After changes, run smoke tests locally and, if possible, run the included test script (test:smoke) to ensure the basic endpoint behaves as expected.
- Update documentation where relevant, especially deployment notes and any new runtime features.

## Development workflow and commands
- Run locally: npm run dev
- Build: npm run build
- Start production server: npm run start
- Smoke test: npm run test:smoke
- Patch workflow: create a patch per PR, commit with a descriptive message, and export via git format-patch for PR review.

## Code quality, style, and safety
- Prefer ASCII in new files. If non-ASCII characters are introduced, ensure there is a clear justification.
- Add comments only when necessary for clarity.
- Do not introduce breaking changes without explicit consent or a clear migration path.
- Ensure any new assets are appropriate for a web environment; prefer on-demand loading of NFT images from metadata.

## Testing and verification guidance
- Functional checks: app loads, wallet address input works, NFT data fetch path returns results, and animation renders without errors.
- Manual QA: verify cap enforcement (up to 1000), white background rendering, and runtime changes to speed/size via Settings Panel.
- Edge cases: missing image metadata, failed image loads, and empty wallet addresses.
- Smoke tests: the provided tests/smoke/run-smoke.js currently validates the missing-address path for /api/nfts.

## Extension points (for future work)
- WalletConnect v2 integration (enable via ENABLE_WALLETCONNECT flag in lib/walletconnect.ts).
- Advanced UX: richer in-canvas interactions, additional theme options, or per-NFT metadata overlays.
- Server-side caching strategies and rate-limit awareness for NFT data fetch.

## Conventions and patch guidance
- Patch names should reflect the area of the change (e.g., feat/canvas-wiring, fix/api-cache).
- PR descriptions should include: what changed, why it was needed, and how to verify.
- Include acceptance criteria in PR bodies to guide reviewers.

End of AGENTS guidance. Use this as a living document to reflect new patterns as the project evolves.
