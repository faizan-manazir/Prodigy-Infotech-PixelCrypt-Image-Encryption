import { Shuffle, Layers, Settings2, ShieldCheck } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">How It <span className="text-primary">Works</span></h1>
      <p className="text-xl text-muted mb-12 leading-relaxed">
        PixelCrypt doesn't just encrypt the file headers; it physically scrambles the visual data of your image at the pixel level using deterministic cryptographic operations.
      </p>

      <div className="space-y-16">
        <section className="flex flex-col md:flex-row gap-8 items-start">
          <div className="p-4 bg-surface border border-white/10 rounded-2xl flex-shrink-0 mt-2 text-cyan">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3">1. Key Derivation (SHA-256)</h2>
            <p className="text-muted leading-relaxed">
              When you provide an encryption key, it is never stored. Instead, it is immediately hashed using SHA-256. A portion of this hash is extracted to seed a deterministic random number generator. This guarantees that the exact same sequence of operations is performed when encrypting and decrypting with the same key.
            </p>
          </div>
        </section>

        <section className="flex flex-col md:flex-row gap-8 items-start">
          <div className="p-4 bg-surface border border-white/10 rounded-2xl flex-shrink-0 mt-2 text-primary">
            <Shuffle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3">2. Pixel Permutation</h2>
            <p className="text-muted leading-relaxed">
              In this phase, the image is flattened into a 1D array of pixels. Based on the deterministic seed, a random permutation is generated, and every single pixel is swapped to a new location. Visually, this destroys the spatial coherence of the image.
            </p>
          </div>
        </section>

        <section className="flex flex-col md:flex-row gap-8 items-start">
          <div className="p-4 bg-surface border border-white/10 rounded-2xl flex-shrink-0 mt-2 text-blue">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3">3. Channel Transformation</h2>
            <p className="text-muted leading-relaxed">
              The Red, Green, and Blue color channels are deterministically shifted or swapped. For instance, what used to be the Red channel data might become the Blue channel. This alters the color histogram of the image.
            </p>
          </div>
        </section>

        <section className="flex flex-col md:flex-row gap-8 items-start">
          <div className="p-4 bg-surface border border-white/10 rounded-2xl flex-shrink-0 mt-2 text-white">
            <Settings2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3">4. XOR Cipher</h2>
            <p className="text-muted leading-relaxed">
              A key stream of random bytes (generated from the initial seed) is XOR'd against the pixel values. This completely obscures the original pixel values. XOR is mathematically reversible, meaning applying the exact same key stream again recovers the original values perfectly.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
