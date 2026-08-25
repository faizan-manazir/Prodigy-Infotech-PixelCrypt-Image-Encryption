import { Code } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 text-center">
      <h1 className="text-4xl font-bold mb-6">About <span className="text-cyan">PixelCrypt</span></h1>
      
      <div className="glass-panel p-8 rounded-2xl text-left mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Project Context</h2>
        <p className="text-muted mb-4 leading-relaxed">
          PixelCrypt was built as a full-stack educational project demonstrating image processing, cryptography, and modern web development. It showcases how mathematical operations (like XOR and Permutations) can be applied directly to image byte arrays to obfuscate visual data perfectly losslessly.
        </p>
        
        <h2 className="text-xl font-bold text-white mt-8 mb-4">Technology Stack</h2>
        <ul className="list-disc list-inside text-muted space-y-2 mb-4">
          <li><strong>Frontend:</strong> Next.js (App Router), React, Tailwind CSS, Lucide Icons</li>
          <li><strong>Backend:</strong> Python, FastAPI, Pillow (PIL), NumPy</li>
          <li><strong>Architecture:</strong> Stateless API with in-memory array manipulation</li>
        </ul>
        
        <h2 className="text-xl font-bold text-white mt-8 mb-4">Team</h2>
        <p className="text-muted mb-4 leading-relaxed">
          Developed by Faizan.
        </p>
        
        <div className="mt-8 p-4 bg-danger/10 border border-danger/20 rounded-lg">
          <h3 className="text-danger font-bold mb-2">Security Disclaimer</h3>
          <p className="text-sm text-muted">
            While PixelCrypt uses deterministic key derivation and reversible logic, it is designed for <strong>educational and demonstrative purposes</strong>. For military-grade file security, always use established authenticated encryption standards like AES-256-GCM provided by specialized encryption tools.
          </p>
        </div>
      </div>
      
      <a 
        href="https://github.com/faizan-manazir/Prodigy-Infotech-Image-Encryption" 
        target="_blank" 
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-white/10 rounded-full hover:bg-white/5 transition-colors font-medium"
      >
        <Code className="w-5 h-5" />
        View Source Code
      </a>
    </div>
  );
}
