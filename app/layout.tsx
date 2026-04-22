import '../styles/globals.css'

export const metadata = {
  title: 'Flying NFTs Studio',
  description: 'NFT images as flying sprites on canvas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
