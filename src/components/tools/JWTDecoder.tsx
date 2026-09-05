import React, { useState, useMemo, useEffect } from 'react';
import {
  Key,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  RotateCcw,
  Clock,
  Unlock,
  Lock,
  Sparkles,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { toast } from '../../utils/toast';

export function JWTDecoder() {
  const [mode, setMode] = useState<'decode' | 'encode'>('decode');
  const [jwtToken, setJwtToken] = useState<string>(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4z94yS_Q8O'
  );
  const [secretKey, setSecretKey] = useState<string>('your-256-bit-secret');

  // Encoding State
  const [encodeHeader, setEncodeHeader] = useState<string>('{\n  "alg": "HS256",\n  "type": "JWT"\n}');
  const [encodePayload, setEncodePayload] = useState<string>('{\n  "sub": "1234567890",\n  "name": "Jane Developer",\n  "role": "admin",\n  "iat": ' + Math.floor(Date.now() / 1000) + '\n}');

  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Decoding logic
  const decoded = useMemo(() => {
    if (!jwtToken.trim()) return { error: 'Please enter a JWT token string to decode.' };

    try {
      const parts = jwtToken.trim().split('.');
      if (parts.length !== 3) {
        return { error: 'Invalid JWT structure. A standard JWT must contain exactly 3 dot-separated base64 parts (Header.Payload.Signature).' };
      }

      const headerJson = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payloadJson = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const signatureRaw = parts[2];

      let issuedAt: string | null = null;
      let expiresAt: string | null = null;
      let notBefore: string | null = null;
      let isExpired = false;
      let timeRemaining = '';

      if (payloadJson.iat) {
        issuedAt = new Date(payloadJson.iat * 1000).toLocaleString();
      }
      if (payloadJson.nbf) {
        notBefore = new Date(payloadJson.nbf * 1000).toLocaleString();
      }
      if (payloadJson.exp) {
        const expDate = new Date(payloadJson.exp * 1000);
        expiresAt = expDate.toLocaleString();
        const diffMs = expDate.getTime() - Date.now();
        isExpired = diffMs < 0;

        const absDiffSec = Math.abs(Math.floor(diffMs / 1000));
        const days = Math.floor(absDiffSec / 86400);
        const hours = Math.floor((absDiffSec % 86400) / 3600);
        const mins = Math.floor((absDiffSec % 3600) / 60);

        if (isExpired) {
          timeRemaining = `Expired ${days > 0 ? `${days}d ` : ''}${hours}h ${mins}m ago`;
        } else {
          timeRemaining = `Valid for ${days > 0 ? `${days}d ` : ''}${hours}h ${mins}m remaining`;
        }
      }

      return {
        header: headerJson,
        payload: payloadJson,
        signature: signatureRaw,
        issuedAt,
        expiresAt,
        notBefore,
        isExpired,
        timeRemaining,
        error: null
      };
    } catch (err: any) {
      return { error: 'Failed to parse Base64 JSON token: ' + err.message };
    }
  }, [jwtToken]);

  // Colorized token display generator
  const renderColoredToken = () => {
    const parts = jwtToken.trim().split('.');
    if (parts.length !== 3) {
      return <span className="text-slate-400">{jwtToken}</span>;
    }

    return (
      <span className="font-mono text-xs sm:text-sm break-all">
        <span className="text-rose-500 font-bold">{parts[0]}</span>
        <span className="text-slate-400 font-black">.</span>
        <span className="text-purple-500 font-bold">{parts[1]}</span>
        <span className="text-slate-400 font-black">.</span>
        <span className="text-cyan-500 font-bold">{parts[2]}</span>
      </span>
    );
  };

  const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              mode === 'decode'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Unlock size={14} />
            <span>JWT Token Decoder</span>
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto text-xs font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
          <ShieldCheck size={15} />
          <span>100% Client-Side Private</span>
        </div>
      </div>

      {mode === 'decode' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Raw JWT Token Entry */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Key size={16} className="text-blue-500" />
                  <span>Encoded JWT Token</span>
                </h3>

                <button
                  onClick={() =>
                    setJwtToken(
                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4z94yS_Q8O'
                    )
                  }
                  className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Load Sample</span>
                </button>
              </div>

              <textarea
                value={jwtToken}
                onChange={(e) => setJwtToken(e.target.value)}
                placeholder="Paste eyJhbGciOiJIUzI1Ni..."
                rows={7}
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none break-all"
              />

              {/* Colorized Breakdown Box */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Color Breakdown Legend:
                </span>
                <div className="p-2.5 bg-slate-900/80 rounded-xl">{renderColoredToken()}</div>
                <div className="flex justify-around text-[10px] font-mono pt-1">
                  <span className="text-rose-500 font-bold">● Header</span>
                  <span className="text-purple-500 font-bold">● Payload</span>
                  <span className="text-cyan-500 font-bold">● Signature</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Decoded Sections */}
          <div className="lg:col-span-7 space-y-6">
            {decoded.error ? (
              <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-3xl space-y-2 flex items-start gap-3">
                <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Decoding Error</h4>
                  <p className="text-xs font-mono">{decoded.error}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Expiration Banner */}
                {decoded.expiresAt && (
                  <div
                    className={`p-4 rounded-3xl border flex items-center justify-between ${
                      decoded.isExpired
                        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300'
                        : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock size={18} />
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider block">
                          Token Validity Status
                        </span>
                        <p className="text-xs font-bold font-mono">{decoded.timeRemaining}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-black uppercase px-3 py-1 rounded-full bg-white/60 dark:bg-black/30">
                      {decoded.isExpired ? 'EXPIRED' : 'ACTIVE'}
                    </span>
                  </div>
                )}

                {/* Header JSON Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-xs font-extrabold text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      HEADER (ALGORITHM &amp; TYPE)
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(JSON.stringify(decoded.header, null, 2), setCopiedHeader)
                      }
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedHeader ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedHeader ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-950 text-rose-400 rounded-2xl font-mono text-xs overflow-x-auto font-bold leading-relaxed">
                    {JSON.stringify(decoded.header, null, 2)}
                  </pre>
                </div>

                {/* Payload JSON Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-xs font-extrabold text-purple-500 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      PAYLOAD (CLAIMS &amp; DATA)
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(JSON.stringify(decoded.payload, null, 2), setCopiedPayload)
                      }
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedPayload ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedPayload ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-950 text-purple-300 rounded-2xl font-mono text-xs overflow-x-auto font-bold leading-relaxed">
                    {JSON.stringify(decoded.payload, null, 2)}
                  </pre>

                  {/* Standard Claims Timestamps */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {decoded.issuedAt && (
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Issued At (iat)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {decoded.issuedAt}
                        </span>
                      </div>
                    )}
                    {decoded.expiresAt && (
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Expiration (exp)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {decoded.expiresAt}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Signature Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                  <span className="text-xs font-extrabold text-cyan-500 uppercase tracking-widest block border-b border-slate-100 dark:border-slate-800 pb-2">
                    SIGNATURE
                  </span>
                  <div className="p-4 bg-slate-950 text-cyan-400 rounded-2xl font-mono text-xs break-all font-bold">
                    HMACSHA256(
                    <br />
                    &nbsp;&nbsp;base64UrlEncode(header) + "." + base64UrlEncode(payload),
                    <br />
                    &nbsp;&nbsp;<span className="text-amber-400">[your-secret-key]</span>
                    <br />) = <span className="text-white">{decoded.signature}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JWTDecoder;
