import '../styles/globals.css'
import MarqueeFooter from './components/MarqueeFooter'

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
      <body>
        {children}
        <MarqueeFooter />
      </body>
    </html>
  )
}
