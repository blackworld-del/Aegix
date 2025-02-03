import { Button } from "@/components/ui/button"
import { ExternalLink} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BackgroundBeams } from "@/components/ui/background-beams"
import Link from "next/link";
import { LoginForm } from "./components/login-form";
export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative overflow-hidden bg-white">
      {/* Background Beams Effect */}
      <BackgroundBeams />

      <header className="fixed top-0 left-0 right-0 z-50 px-4">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Avatar className="bg-black border border-white/[0.1]">
              <AvatarFallback>AE</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-black">Aegix</span>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
<Button asChild className="text-black bg-transparent hover:bg-transparent focus:ring-0">
  <Link href="/login">Login</Link>
</Button>
              </li>
              <li>
                <Button size="sm" className="bg-black text-white hover:bg-black/100">
                  Sign Up
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="space-y-12 max-w-2xl mx-auto mt-16 relative z-10">
        {/* Logo Section */}
        <div className="mb-8">
          <p className="mt-2 text-2xl font-bold text-black">Aegix</p>
        </div>

        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-black">
            Build your next project with Blocks
          </h1>
          <p className="text-zinc-400 text-lg max-w-[800px] mx-auto">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat omnis! Porro
            facilis quo animi consequatur. Explicabo.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="bg-black text-white hover:bg-black/100">
            Get Started
          </Button>
          <Button size="lg" className="text-black bg-transparent hover:bg-transparent focus:ring-0">
            Learn more
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Technology Stack */}
        <div className="pt-12">
          <p className="text-zinc-500 mb-6">Built with open-source technologies</p>
          <div className="flex justify-center gap-6">
            {/* Technology Icons */}
            <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center border border-black/10">
              <div className="w-6 h-6 bg-black/20" />
            </div>
            <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center border border-black/10">
              <span className="font-mono text-sm text-black/70">TS</span>
            </div>
            <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center border border-black/10">
              <div className="w-6 h-6 rounded-full border-2 border-black/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-black/20" />
              </div>
            </div>
            <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center border border-black/10">
              <div className="w-6 h-6 bg-black/20 rounded" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
