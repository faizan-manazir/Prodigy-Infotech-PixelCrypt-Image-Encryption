import Link from 'next/link';
import { Lock, Image as ImageIcon, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-8">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        Pixel-Level Encryption Engine v1.0
      </div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
        Secure Your Images <br />
        <span className="text-gradient">Pixel by Pixel.</span>
      </h1>
      
      <p className="text-lg md:text-xl text-muted max-w-2xl mb-12 leading-relaxed">
        Encrypt and decrypt images using reversible pixel-level transformations and secure key-based operations. Keep your visual data safe with advanced cryptographic algorithms.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <Link 
          href="/encrypt" 
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-primary rounded-lg overflow-hidden transition-all hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        >
          Encrypt an Image
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link 
          href="/how-it-works" 
          className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-surface border border-white/10 rounded-lg hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-background"
        >
          How It Works
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl text-left">
        <div className="glass-panel p-6 rounded-xl flex items-start gap-4">
          <div className="p-3 bg-blue/10 rounded-lg text-blue">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Key-Based Security</h3>
            <p className="text-sm text-muted">Deterministic transformations powered by SHA-256 key derivation ensuring repeatable but secure encryption.</p>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-xl flex items-start gap-4">
          <div className="p-3 bg-cyan/10 rounded-lg text-cyan">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Lossless Recovery</h3>
            <p className="text-sm text-muted">Mathematically reversible algorithms guarantee 100% pixel-perfect image reconstruction upon decryption.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
