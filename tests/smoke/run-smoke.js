// Simple smoke tests for the NFT Flying Studio API route
// Run with: node tests/smoke/run-smoke.js

const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args))

async function testMissingAddress() {
  try {
    const res = await fetch('http://localhost:3000/api/nfts')
    if (res.status === 400) {
      console.log('SMOKE PASS: missing address returns 400')
    } else {
      console.error('SMOKE FAIL: missing address returned status', res.status)
      process.exit(2)
    }
  } catch (e) {
    console.error('SMOKE FAIL: could not reach API', e)
    process.exit(3)
  }
}

async function run() {
  await testMissingAddress()
  console.log('SMOKE DONE')
}

run()
