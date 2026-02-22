import type { Metadata } from "next"
import Link from "next/link"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { UserMenu } from "@/components/auth/UserMenu"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Gatherly",
  description: "Design beautiful digital invitations with Gatherly",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <header className="flex items-center justify-between border-b border-border px-4 py-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-foreground" />
            <span className="text-sm font-semibold tracking-tight">Gatherly</span>
          </Link>
          <UserMenu />
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
