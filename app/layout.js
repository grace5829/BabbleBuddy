"use client"
import './globals.css'
import Providers from './Providers'

// export default function RootLayout({
//   children,
// } : {
//   children: React.ReactNode
// })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
      <Providers>

      {children}
      </Providers>
      </body>
    </html>
  )
}
