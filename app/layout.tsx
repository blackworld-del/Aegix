import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeSwitcher } from "@/components/theme-switcher"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Aegix API Testing",
  description: "AI-powered API testing platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background relative">
            <main className="min-h-screen">
              {children}
            </main>
            {/* Theme Switcher - Fixed to bottom right */}
            <div className="fixed bottom-4 right-4 z-50">
              <ThemeSwitcher />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
