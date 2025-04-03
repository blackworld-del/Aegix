import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { BackgroundBeams } from "@/components/ui/background-beams"
import Link from "next/link"
import { TestApiButton } from "@/components/test-api-button"
import { DemoButton } from "@/components/demo-button"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function LandingPage() {
  return (
    <ThemeProvider>
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative overflow-hidden bg-background text-foreground">
        <BackgroundBeams />

        <header className="fixed top-0 left-0 right-0 z-50 px-4">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" height="30" width="33.5" viewBox="0 0 448 512">
                <path fill="currentColor" d="M248 106.6c18.9-9 32-28.3 32-50.6c0-30.9-25.1-56-56-56s-56 25.1-56 56c0 22.3 13.1 41.6 32 50.6l0 98.8c-2.8 1.3-5.5 2.9-8 4.7l-80.1-45.8c1.6-20.8-8.6-41.6-27.9-52.8C57.2 96 23 105.2 7.5 132S1.2 193 28 208.5c1.3 .8 2.6 1.5 4 2.1l0 90.8c-1.3 .6-2.7 1.3-4 2.1C1.2 319-8 353.2 7.5 380S57.2 416 84 400.5c19.3-11.1 29.4-32 27.8-52.8l50.5-28.9c-11.5-11.2-19.9-25.6-23.8-41.7L88 306.1c-2.6-1.8-5.2-3.3-8-4.7l0-90.8c2.8-1.3 5.5-2.9 8-4.7l80.1 45.8c-.1 1.4-.2 2.8-.2 4.3c0 22.3 13.1 41.6 32 50.6l0 98.8c-18.9 9-32 28.3-32 50.6c0 30.9 25.1 56 56 56s56-25.1 56-56c0-22.3-13.1-41.6-32-50.6l0-98.8c2.8-1.3 5.5-2.9 8-4.7l80.1 45.8c-1.6 20.8 8.6 41.6 27.8 52.8c26.8 15.5 61 6.3 76.5-20.5s6.3-61-20.5-76.5c-1.3-.8-2.7-1.5-4-2.1l0-90.8c1.4-.6 2.7-1.3 4-2.1c26.8-15.5 36-49.7 20.5-76.5S390.8 96 364 111.5c-19.3 11.1-29.4 32-27.8 52.8l-50.6 28.9c11.5 11.2 19.9 25.6 23.8 41.7L360 205.9c2.6 1.8 5.2 3.3 8 4.7l0 90.8c-2.8 1.3-5.5 2.9-8 4.6l-80.1-45.8c.1-1.4 .2-2.8 .2-4.3c0-22.3-13.1-41.6-32-50.6l0-98.8z"/>
              </svg>
            </div>
            <nav className="flex items-center space-x-4">
              <ul className="flex space-x-4">
                <li>
                  <Button asChild variant="ghost">
                    <Link href="https://github.com/blackworld-del/Aegix">Docs</Link>
                  </Button>
                </li>
                <li>
                  <DemoButton />
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <div className="space-y-12 max-w-2xl mx-auto mt-16 relative z-10">
          {/* Logo Section */}
          <div className="mb-8">
            <p className="mt-2 text-2xl font-bold">Aegix</p>
          </div>

          {/* Hero Section */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Hack Yourself Before They Do
            </h1>
            <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
              AI-powered API security at your fingertips. Detect vulnerabilities, fortify your code, 
              and stay ahead of attackers—before they strike.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <TestApiButton />
            <Button size="lg" variant="ghost" >
              Learn more
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <br />

          {/* Dashboard Preview */}
          <div className="relative w-full max-w-7xl mx-auto mt-16">
            <div className="w-full h-auto rounded-xl overflow-hidden shadow-2xl border border-border scale-125">
              <img
                src="/dashboard.png"
                alt="API Analysis Dashboard"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Technology Stack */}
          <div className="pt-12">
            <p className="text-muted-foreground mb-6">Built with open-source technologies</p>
            <div className="flex justify-center gap-6">
              {/* Node.js */}
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center border border-border">
                <svg xmlns="http://www.w3.org/2000/svg" height="14" width="12.25" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M224 508c-6.7 0-13.5-1.8-19.4-5.2l-61.7-36.5c-9.2-5.2-4.7-7-1.7-8 12.3-4.3 14.8-5.2 27.9-12.7 1.4-.8 3.2-.5 4.6 .4l47.4 28.1c1.7 1 4.1 1 5.7 0l184.7-106.6c1.7-1 2.8-3 2.8-5V149.3c0-2.1-1.1-4-2.9-5.1L226.8 37.7c-1.7-1-4-1-5.7 0L36.6 144.3c-1.8 1-2.9 3-2.9 5.1v213.1c0 2 1.1 4 2.9 4.9l50.6 29.2c27.5 13.7 44.3-2.4 44.3-18.7V167.5c0-3 2.4-5.3 5.4-5.3h23.4c2.9 0 5.4 2.3 5.4 5.3V378c0 36.6-20 57.6-54.7 57.6-10.7 0-19.1 0-42.5-11.6l-48.4-27.9C8.1 389.2 .7 376.3 .7 362.4V149.3c0-13.8 7.4-26.8 19.4-33.7L204.6 9c11.7-6.6 27.2-6.6 38.8 0l184.7 106.7c12 6.9 19.4 19.8 19.4 33.7v213.1c0 13.8-7.4 26.7-19.4 33.7L243.4 502.8c-5.9 3.4-12.6 5.2-19.4 5.2z"/>
                </svg>
              </div>
              {/* JavaScript */}
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center border border-border">
                <svg xmlns="http://www.w3.org/2000/svg" height="19" width="22.5" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M0 32v448h448V32H0zm243.8 349.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"/>
                </svg>
              </div>
              {/* React */}
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center border border-border">
                <svg xmlns="http://www.w3.org/2000/svg" height="19" width="22.5" viewBox="0 0 640 512">
                  <path fill="currentColor" d="M349.9 236.3h-66.1v-59.4h66.1v59.4zm0-204.3h-66.1v60.7h66.1V32zm78.2 144.8H362v59.4h66.1v-59.4zm-156.3-72.1h-66.1v60.1h66.1v-60.1zm78.1 0h-66.1v60.1h66.1v-60.1zm276.8 100c-14.4-9.7-47.6-13.2-73.1-8.4-3.3-24-16.7-44.9-41.1-63.7l-14-9.3-9.3 14c-18.4 27.8-23.4 73.6-3.7 103.8-8.7 4.7-25.8 11.1-48.4 10.7H2.4c-8.7 50.8 5.8 116.8 44 162.1 37.1 43.9 92.7 66.2 165.4 66.2 157.4 0 273.9-72.5 328.4-204.2 21.4 .4 67.6 .1 91.3-45.2 1.5-2.5 6.6-13.2 8.5-17.1l-13.3-8.9zm-511.1-27.9h-66v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm-78.1-72.1h-66.1v60.1h66.1v-60.1z"/>
                </svg>
              </div>
              {/* Git */}
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center border border-border">
                <svg xmlns="http://www.w3.org/2000/svg" height="14" width="12.25" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M439.6 236.1L244 40.5a28.9 28.9 0 0 0-40.8 0l-40.7 40.6 51.5 51.5c27.1-9.1 52.7 16.8 43.4 43.7l49.7 49.7c34.2-11.8 61.2 31 35.5 56.7-26.5 26.5-70.2-2.9-56-37.3L240.2 199v121.9c25.3 12.5 22.3 41.9 9.1 55a34.3 34.3 0 0 1-48.6 0c-17.6-17.6-11.1-46.9 11.3-56v-123c-20.8-8.5-24.6-30.7-18.6-45L142.6 101 8.5 235.1a28.9 28.9 0 0 0 0 40.8l195.6 195.6a28.9 28.9 0 0 0 40.8 0l194.7-194.7a28.9 28.9 0 0 0 0-40.8z"/>
                </svg>
              </div>
            </div>
          </div>
          <br />
        </div>
      </main>
    </ThemeProvider>
  )
}
