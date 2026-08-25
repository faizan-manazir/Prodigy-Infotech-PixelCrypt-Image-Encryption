'use client';

import { useEffect, useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import Toast, { ToastState } from '@/components/Toast';
import { encryptImage } from '@/lib/api';
import { Key, Settings2, Download, Zap, RefreshCw, Eye, EyeOff, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const methods = [
  { id: 'hybrid', name: 'Hybrid Mode (Recommended)', desc: 'Combines permutation, RGB transformation, and XOR in a reversible educational workflow.' },
  { id: 'xor', name: 'XOR Pixel Transformation', desc: 'Applies a deterministic XOR keystream to pixel values.' },
  { id: 'swap', name: 'Pixel Permutation', desc: 'Deterministically scrambles complete pixel positions.' },
  { id: 'channel', name: 'RGB Channel Permutation', desc: 'Rearranges RGB channels while preserving alpha.' },
];

export default function EncryptPage() {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState('');
  const [method, setMethod] = useState('hybrid');
  const [showKey, setShowKey] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; metadata: { width: string; height: string; pixels: string } } | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState({ text: '', percent: 0 });
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!file) { setOriginalUrl(null); return; }
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url); }, [result?.url]);

  const handleEncrypt = async () => {
    if (!file || key.length < 8) {
      setToast({ type: 'error', message: 'Enter an image and a key containing at least 8 characters.' });
      return;
    }

    setIsProcessing(true);
    setToast(null);
    const steps = [
      { t: 'Validating image...', p: 15 },
      { t: 'Deriving deterministic key material...', p: 40 },
      { t: 'Applying pixel transformation...', p: 75 },
      { t: 'Writing verified PNG payload...', p: 92 },
    ];
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) setProgress(steps[stepIdx++]);
    }, 350);

    try {
      const data = await encryptImage(file, key, method);
      const url = URL.createObjectURL(data.blob);
      clearInterval(interval);
      setProgress({ text: 'Encryption completed.', percent: 100 });
      setResult({ url, metadata: { width: data.width, height: data.height, pixels: data.pixels } });
      setToast({ type: 'success', message: 'Image encrypted successfully. The output PNG includes key/method verification metadata.' });
    } catch (error) {
      clearInterval(interval);
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Encryption failed.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null); setKey(''); setResult(null); setProgress({ text: '', percent: 0 });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan mb-2">PixelCrypt Workspace</p>
        <h1 className="text-3xl font-bold text-white mb-2">Encrypt <span className="text-primary">an Image</span></h1>
        <p className="text-muted">Transform image pixels with a reversible, key-based educational workflow.</p>
      </div>

      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="glass-panel rounded-xl p-1">
              <div className="p-4 border-b border-white/5 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-cyan" /><h2 className="font-semibold text-white">Parameters</h2>
              </div>
              <div className="p-4 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Transformation Method</label>
                  <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary">
                    {methods.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  <p className="text-xs text-muted mt-2">{methods.find((m) => m.id === method)?.desc}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Encryption Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3.5 h-5 w-5 text-muted" />
                    <input type={showKey ? 'text' : 'password'} value={key} onChange={(e) => setKey(e.target.value)} placeholder="Minimum 8 characters" maxLength={128} className="w-full bg-surface border border-white/10 rounded-lg pl-10 pr-11 py-3 text-white focus:outline-none focus:border-primary font-mono" />
                    <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-3 text-muted hover:text-white" aria-label="Toggle key visibility">{showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
                  </div>
                  <p className={clsx('mt-2 text-xs', key && key.length < 8 ? 'text-danger' : 'text-muted')}>{key.length}/128 characters {key && key.length < 8 ? '• minimum 8 required' : ''}</p>
                </div>
              </div>
            </div>
            <button onClick={handleEncrypt} disabled={!file || key.length < 8 || isProcessing} className={clsx('w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all', (!file || key.length < 8 || isProcessing) ? 'bg-surface/50 text-muted cursor-not-allowed border border-white/5' : 'bg-primary text-white hover:bg-primary-hover shadow-[0_0_25px_rgba(124,58,237,0.35)]')}>
              {isProcessing ? <><RefreshCw className="w-5 h-5 animate-spin" /> Processing...</> : <><Zap className="w-5 h-5" /> Encrypt Image</>}
            </button>
          </div>
          <div className="lg:col-span-2">
            <div className="glass-panel rounded-xl h-full flex flex-col p-6">
              <h2 className="font-semibold text-white mb-4">Target Image</h2>
              <div className="flex-grow flex flex-col items-center justify-center min-h-[360px]">
                {isProcessing ? (
                  <div className="w-full max-w-md">
                    <div className="flex justify-between text-sm mb-2 font-mono text-cyan"><span>{progress.text}</span><span>{progress.percent}%</span></div>
                    <div className="w-full bg-surface rounded-full h-2 overflow-hidden border border-white/5"><div className="bg-cyan h-2 rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} /></div>
                  </div>
                ) : <ImageUploader onImageSelected={setFile} selectedFile={file} onError={(message) => setToast({ type: 'error', message })} />}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-xl p-5 sm:p-8 border border-success/30">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div><p className="text-xs uppercase tracking-[0.2em] text-success mb-2">Verified Output</p><h2 className="text-2xl font-bold text-white">Encryption Successful</h2></div>
            <span className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-medium text-success">● VERIFIED PAYLOAD</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="rounded-xl border border-white/10 bg-surface/40 p-3">
              <p className="mb-3 text-xs uppercase tracking-wider text-muted">Original</p>
              {originalUrl && <img src={originalUrl} alt="Original preview" className="h-72 w-full object-contain rounded-lg" />}
            </div>
            <div className="rounded-xl border border-primary/20 bg-surface/40 p-3">
              <p className="mb-3 text-xs uppercase tracking-wider text-primary">Encrypted</p>
              <img src={result.url} alt="Encrypted result" className="h-72 w-full object-contain rounded-lg [image-rendering:pixelated]" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-sm">
            <div className="rounded-lg bg-surface/50 p-3"><span className="block text-muted text-xs">Dimensions</span><span className="text-white font-mono">{result.metadata.width} × {result.metadata.height}</span></div>
            <div className="rounded-lg bg-surface/50 p-3"><span className="block text-muted text-xs">Pixels</span><span className="text-white font-mono">{Number(result.metadata.pixels).toLocaleString()}</span></div>
            <div className="rounded-lg bg-surface/50 p-3"><span className="block text-muted text-xs">Method</span><span className="text-white capitalize">{method}</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={result.url} download={`pixelcrypt_${file?.name.split('.')[0] || 'image'}.png`} className="flex-1 py-4 bg-white text-background font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200"><Download className="w-5 h-5" /> Download Encrypted PNG</a>
            <button onClick={handleReset} className="sm:w-auto px-6 py-4 bg-surface border border-white/10 font-bold text-white rounded-lg hover:bg-white/5 flex items-center justify-center gap-2">Encrypt Another <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
