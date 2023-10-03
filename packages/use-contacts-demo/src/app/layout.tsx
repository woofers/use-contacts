import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'useContact',
  description: ''
} satisfies Metadata

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head />
      <body>
        <div id="__next">
          <div className={inter.className}>{children}</div>
        </div>
      </body>
    </html>
  )
}

export default RootLayout
