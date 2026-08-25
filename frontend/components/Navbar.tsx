'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Shield, X } from 'lucide-react';

const links = [
  { href: '/encrypt', label: 'Encrypt' },
  { href: '/decrypt', label: 'Decrypt' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <Shield className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl tracking-wider text-white">PIXEL<span className="text-cyan">CRYPT</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-2">
            {links.map((link) => <Link key={link.href} href={link.href} className="text-muted hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">{link.label}</Link>)}
            <a href="https://github.com/faizan-manazir/Prodigy-Infotech-PixelCrypt-Image-Encryption" target="_blank" rel="noreferrer" className="text-muted hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">GitHub</a>
          </div>
          <button className="md:hidden p-2 text-muted hover:text-white" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && <div className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl px-4 py-3 space-y-1">
        {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-muted hover:bg-white/5 hover:text-white">{link.label}</Link>)}
        <a href="https://github.com/faizan-manazir/Prodigy-Infotech-PixelCrypt-Image-Encryption" target="_blank" rel="noreferrer" className="block rounded-lg px-3 py-3 text-muted hover:bg-white/5 hover:text-white">GitHub</a>
      </div>}
    </nav>
  );
}
