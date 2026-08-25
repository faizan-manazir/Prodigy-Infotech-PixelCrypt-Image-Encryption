import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <Link href="/" className="font-bold text-xl tracking-wider text-white">
              PIXEL<span className="text-cyan">CRYPT</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/encrypt" className="text-muted hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Encrypt
              </Link>
              <Link href="/decrypt" className="text-muted hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Decrypt
              </Link>
              <Link href="/how-it-works" className="text-muted hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                How It Works
              </Link>
              <Link href="/about" className="text-muted hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </Link>
              <a href="https://github.com/faizan-manazir/Prodigy-Infotech-Image-Encryption" target="_blank" rel="noreferrer" className="text-muted hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
