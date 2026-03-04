PR Plan: Incremental, small PRs for NFT Flying Studio

Overview
- This plan breaks the remaining work into several small PRs to enable safe review and incremental delivery.
- Each PR focuses on a coherent, isolated change with clear acceptance criteria.

1) PR: Auto-load UX Banner & Banner Rendering
- What it changes:
  - Add auto-load banner state and UI banner in StartScreen to reflect auto-load results.
- Files touched:
  - app/page.tsx (banner state, auto-load flow)
  - app/components/StartScreen.tsx (banner rendering)
- Acceptance:
  - On first load with a lastAddress present, an informative banner appears after auto-load.
  - Banner text accurately reflects NFT fetch results (count or lack thereof).

2) PR: WalletConnect gating flag and UI gating
- What it changes:
  - Introduce ENABLE_WALLETCONNECT flag (default false).
  - Gate WalletConnect UI button behind flag in StartScreen.
- Files touched:
  - lib/walletconnect.ts (flag export)
  - app/components/StartScreen.tsx (gate rendering based on flag)
- Acceptance:
  - WalletConnect UI remains hidden by default. When flag is enabled, the UI shows and triggers a skeleton flow.

3) PR: API error handling and caching improvements
- What it changes:
  - Edge /api/nfts route caches results per address with TTL.
  - Adds fallback provider (Alchemy -> Moralis) and clear error messaging.
- Files touched:
  - app/api/nfts/route.ts
- Acceptance:
  - Repeated fetches within TTL return cached data; errors surfaced with friendly messages; second provider fallback works.

4) PR: Canvas runtime settings wiring
- What it changes:
  - Wire SettingsPanel Apply action to dispatch NFT settings updates to the canvas engine via events.
  - Ensure NFTCanvas listens and CanvasEngine updates in real time.
- Files touched:
  - app/components/SettingsPanel.tsx
  - app/components/NFTCanvas.tsx
  - app/nft/CanvasEngine.ts
- Acceptance:
  - Live updates to speed, cap, and size reflect immediately in the animation.

5) PR: UX polish & auto-load banner details
- What it changes:
  - Minor banner styling, improved wording, and a small UX cue for auto-load status.
- Files touched:
  - app/components/StartScreen.tsx
  - app/page.tsx
- Acceptance:
  - Clear, unobtrusive UX banners that do not distract from the canvas animation.

6) PR: Documentation & deployment notes
- What it changes:
  - Update README with local dev, Cloudflare Pages deployment steps, and edge function notes.
- Files touched:
  - README.md
- Acceptance:
  - Devs can set up locally and deploy to Cloudflare Pages with environment variables for keys.

Merge plan
- Each PR includes a concise description, rationale, and a mapping to the acceptance criteria.
- Reviewer checks: unit-level sanity, end-to-end flow for NFT fetch and animation, and non-regressions in UI.
- Acceptance:
  - On first load with a lastAddress present, an informative banner appears after auto-load.
  - Banner text includes a shortened address snippet (e.g., 0x1234...).
