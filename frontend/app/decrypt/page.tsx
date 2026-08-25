'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { decryptImage } from '@/lib/api';
import { Key, Settings2, Download, Unlock, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

export default function DecryptPage() {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState('');
  const [method, setMethod] = useState('hybrid');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; metadata: any } | null>(null);
  const [progress, setProgress] = useState({ text: '', percent: 0 });

  const methods = [
    { id: 'hybrid', name: 'Hybrid Mode', desc: 'Reverses full hybrid permutation' },
    { id: 'xor', name: 'XOR Cipher', desc: 'Reverses XOR stream' },
    { id: 'swap', name: 'Pixel Permutation', desc: 'Reverses spatial shuffle' },
    { id: 'channel', name: 'Channel Shift', desc: 'Reverses channel transforms' },
  ];

  const handleDecrypt = async () => {
    if (!file || !key) return;
    
    setIsProcessing(true);
    setResult(null);
    
    const steps = [
      { t: 'Analyzing encrypted payload...', p: 20 },
      { t: 'Validating key signatures...', p: 50 },
      { t: 'Reversing transformations...', p: 85 },
      { t: 'Reconstructing original image...', p: 95 }
    ];
    
    let stepIdx = 0;
    const progressInterval = setInterval(() => {
      if (stepIdx < steps.length) {
        setProgress({ text: steps[stepIdx].t, percent: steps[stepIdx].p });
        stepIdx++;
      }
    }, 400);

    try {
      const data = await decryptImage(file, key, method);
      const url = URL.createObjectURL(data.blob);
      
      clearInterval(progressInterval);
      setProgress({ text: 'Decryption completed successfully.', percent: 100 });
      
      setTimeout(() => {
        setResult({ url, metadata: data });
        setIsProcessing(false);
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      setIsProcessing(false);
      alert('Decryption failed. Ensure the key and method match the original encryption.');
    }
  };

  const handleReset = () => {
    setFile(null);
    setKey('');
    setResult(null);
    setProgress({ text: '', percent: 0 });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Workspace <span className="text-cyan">/ Decrypt</span></h1>
        <p className="text-muted">Recover your original image by supplying the correct key and algorithm.</p>
      </div>

      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel rounded-xl p-1">
              <div className="p-4 border-b border-white/5 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-white">Parameters</h2>
              </div>
              <div className="p-4 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Original Method</label>
                  <select 
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors appearance-none"
                  >
                    {methods.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Decryption Key</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-muted" />
                    </div>
                    <input
                      type="password"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="Enter the original key..."
                      className="w-full bg-surface border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleDecrypt}
              disabled={!file || !key || isProcessing}
              className={clsx(
                "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300",
                (!file || !key || isProcessing) 
                  ? "bg-surface/50 text-muted cursor-not-allowed border border-white/5" 
                  : "bg-cyan text-background hover:bg-cyan/90 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] border border-cyan"
              )}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Decrypting...
                </>
              ) : (
                <>
                  <Unlock className="w-5 h-5" />
                  Execute Decryption
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-panel rounded-xl h-full flex flex-col p-6">
              <h2 className="font-semibold text-white mb-4">Encrypted Image</h2>
              
              <div className="flex-grow flex flex-col items-center justify-center min-h-[300px]">
                {isProcessing ? (
                  <div className="w-full max-w-md">
                    <div className="flex justify-between text-sm mb-2 font-mono text-primary">
                      <span>{progress.text}</span>
                      <span>{progress.percent}%</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-2 overflow-hidden border border-white/5">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                        style={{ width: `${progress.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <ImageUploader onImageSelected={setFile} selectedFile={file} label="Upload Encrypted PNG" />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-xl p-8 border border-success/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              RECOVERED
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-6">Decryption Successful</h2>
          
          <div className="flex flex-col items-center justify-center bg-surface/50 rounded-lg border border-white/5 p-4 mb-8">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="Decrypted result" className="max-w-full max-h-[60vh] object-contain rounded shadow-lg" />
          </div>
          
          <div className="flex gap-4">
            <a 
              href={result.url} 
              download={`decrypted_${file?.name || 'image'}`}
              className="flex-1 py-4 bg-white text-background font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Recovered Image
            </a>
            <button 
              onClick={handleReset}
              className="px-6 py-4 bg-surface border border-white/10 font-bold text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Decrypt Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
