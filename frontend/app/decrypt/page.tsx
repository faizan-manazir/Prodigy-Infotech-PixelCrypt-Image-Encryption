'use client';

import { useEffect, useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import Toast, { ToastState } from '@/components/Toast';
import { decryptImage } from '@/lib/api';
import { Key, Settings2, Download, Unlock, RefreshCw, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

const methods = [
  { id: 'hybrid', name: 'Hybrid Mode' },
  { id: 'xor', name: 'XOR Pixel Transformation' },
  { id: 'swap', name: 'Pixel Permutation' },
  { id: 'channel', name: 'RGB Channel Permutation' },
];

export default function DecryptPage() {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState('');
  const [method, setMethod] = useState('hybrid');
  const [showKey, setShowKey] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; metadata: { width: string; height: string; pixels: string } } | null>(null);
  const [progress, setProgress] = useState({ text: '', percent: 0 });
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url); }, [result?.url]);

  const handleDecrypt = async () => {
    if (!file || key.length < 8) {
      setToast({ type: 'error', message: 'Enter an encrypted PixelCrypt PNG and a key containing at least 8 characters.' });
      return;
    }
    setIsProcessing(true); setToast(null);
    const steps = [
      { t: 'Reading PixelCrypt verification metadata...', percent: 20 },
      { t: 'Validating key and method...', percent: 50 },
      { t: 'Reversing pixel transformations...', percent: 85 },
      { t: 'Verifying recovered pixels...', percent: 95 },
    ];
    let index = 0;
    const interval = setInterval(() => { if (index < steps.length) setProgress(steps[index++]); }, 350);

    try {
      const data = await decryptImage(file, key, method);
      const url = URL.createObjectURL(data.blob);
      clearInterval(interval);
      setProgress({ text: 'Decryption integrity verified.', percent: 100 });
      setResult({ url, metadata: { width: data.width, height: data.height, pixels: data.pixels } });
      setToast({ type: 'success', message: 'Decryption succeeded and the recovered pixel checksum was verified.' });
    } catch (error) {
      clearInterval(interval);
      setToast({ type: 'error', message: error instanceof Error ? error.message : 'Decryption failed.' });
    } finally { setIsProcessing(false); }
  };

  const handleReset = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null); setKey(''); setResult(null); setProgress({ text: '', percent: 0 });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">PixelCrypt Workspace</p>
        <h1 className="text-3xl font-bold text-white mb-2">Decrypt <span className="text-cyan">an Image</span></h1>
        <p className="text-muted">Only verified PixelCrypt PNG outputs can be recovered. Wrong keys and methods are rejected.</p>
      </div>
      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="glass-panel rounded-xl p-1">
              <div className="p-4 border-b border-white/5 flex items-center gap-2"><Settings2 className="w-5 h-5 text-primary" /><h2 className="font-semibold text-white">Parameters</h2></div>
              <div className="p-4 space-y-5">
                <div><label className="block text-sm font-medium text-muted mb-2">Original Method</label><select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan">{methods.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Original Encryption Key</label>
                  <div className="relative"><Key className="absolute left-3 top-3.5 h-5 w-5 text-muted" /><input type={showKey ? 'text' : 'password'} value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter the original key" maxLength={128} className="w-full bg-surface border border-white/10 rounded-lg pl-10 pr-11 py-3 text-white focus:outline-none focus:border-cyan font-mono" /><button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-3 text-muted hover:text-white">{showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div>
                </div>
              </div>
            </div>
            <button onClick={handleDecrypt} disabled={!file || key.length < 8 || isProcessing} className={clsx('w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all', (!file || key.length < 8 || isProcessing) ? 'bg-surface/50 text-muted cursor-not-allowed border border-white/5' : 'bg-cyan text-background hover:bg-cyan/90 shadow-[0_0_25px_rgba(34,211,238,0.35)]')}>
              {isProcessing ? <><RefreshCw className="w-5 h-5 animate-spin" /> Decrypting...</> : <><Unlock className="w-5 h-5" /> Decrypt & Verify</>}
            </button>
          </div>
          <div className="lg:col-span-2"><div className="glass-panel rounded-xl h-full flex flex-col p-6"><h2 className="font-semibold text-white mb-4">Encrypted PixelCrypt PNG</h2><div className="flex-grow flex flex-col items-center justify-center min-h-[360px]">{isProcessing ? <div className="w-full max-w-md"><div className="flex justify-between text-sm mb-2 font-mono text-primary"><span>{progress.text}</span><span>{progress.percent}%</span></div><div className="w-full bg-surface rounded-full h-2 overflow-hidden border border-white/5"><div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} /></div></div> : <ImageUploader onImageSelected={setFile} selectedFile={file} label="Upload Encrypted PNG" onError={(message) => setToast({ type: 'error', message })} />}</div></div></div>
        </div>
      ) : (
        <div className="glass-panel rounded-xl p-5 sm:p-8 border border-success/30">
          <div className="flex items-center gap-3 mb-6"><ShieldCheck className="h-9 w-9 text-success" /><div><p className="text-xs uppercase tracking-[0.2em] text-success">Integrity Verified</p><h2 className="text-2xl font-bold text-white">Decryption Successful</h2></div></div>
          <div className="rounded-xl border border-white/10 bg-surface/50 p-4 mb-6"><img src={result.url} alt="Recovered image" className="w-full max-h-[60vh] object-contain rounded-lg" /></div>
          <div className="flex flex-col sm:flex-row gap-4"><a href={result.url} download={`recovered_${file?.name.replace(/\.png$/i, '') || 'image'}.png`} className="flex-1 py-4 bg-white text-background font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200"><Download className="w-5 h-5" /> Download Recovered PNG</a><button onClick={handleReset} className="px-6 py-4 bg-surface border border-white/10 font-bold text-white rounded-lg hover:bg-white/5">Decrypt Another</button></div>
        </div>
      )}
    </div>
  );
}
