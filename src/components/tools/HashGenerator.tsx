import React, { useState, useEffect } from 'react';
import { Hash, Copy, Check, Sliders, ShieldCheck } from 'lucide-react';
import AdSenseSlot from '../AdSenseSlot';

export default function HashGenerator() {
  const [inputText, setInputText] = useState('');
  const [sha256Hash, setSha256Hash] = useState('');
  const [sha512Hash, setSha512Hash] = useState('');
  const [sha384Hash, setSha384Hash] = useState('');
  const [sha1Hash, setSha1Hash] = useState('');
  const [md5Hash, setMd5Hash] = useState('');

  const [copiedType, setCopiedType] = useState<string | null>(null);

  // MD5 helper since Web Crypto doesn't natively support MD5 on some browsers (or we write a lightweight MD5 utility)
  // Let's implement a simple, standard MD5 function or high-performance JS hashing
  const computeMd5 = (string: string) => {
    // Simple light MD5 implementation
    function md5cycle(x: any, k: any) {
      let a = x[0], b = x[1], c = x[2], d = x[3];
      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17,  606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12,  1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7,  1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7,  1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22,  1236535329);

      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14,  643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9,  38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5,  568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20,  1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14,  1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);

      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16,  1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11,  1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4,  681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23,  76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);
      d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16,  530742520);
      b = hh(b, c, d, a, k[2], 23, -995338651);

      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10,  1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6,  1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6,  1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21,  1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15,  718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);

      x[0] = add32(a, x[0]);
      x[1] = add32(b, x[1]);
      x[2] = add32(c, x[2]);
      x[3] = add32(d, x[3]);
    }

    function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
      a = add32(add32(a, q), add32(x, t));
      return add32((a << s) | (a >>> (32 - s)), b);
    }
    function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
      return cmn((b & c) | (~b & d), a, b, x, s, t);
    }
    function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
      return cmn((b & d) | (c & ~d), a, b, x, s, t);
    }
    function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
      return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
      return cmn(c ^ (b | ~d), a, b, x, s, t);
    }

    function md51(s: string) {
      const txt = '';
      const n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i = 0;
      let md5_blocks: any[] = [];
      for (let j = 0; j < n; j++) {
        md5_blocks[j >> 2] |= s.charCodeAt(j) << ((j & 3) << 3);
      }
      md5_blocks[n >> 2] |= 0x80 << ((n & 3) << 3);
      const div_offset = (((n + 8) >> 6) + 1) * 16;
      md5_blocks[div_offset - 2] = n * 8;
      for (let j = 0; j < div_offset; j += 16) {
        md5cycle(state, md5_blocks.slice(j, j + 16));
      }
      return state;
    }

    function add32(x: number, y: number) {
      return (x + y) & 0xFFFFFFFF;
    }

    const hex_chr = '0123456789abcdef';
    function rhex(num: number) {
      let str = '', j = 0;
      for (; j < 4; j++) {
        str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) + hex_chr.charAt((num >> (j * 8)) & 0x0F);
      }
      return str;
    }

    function hex(x: any) {
      for (let i = 0; i < x.length; i++) {
        x[i] = rhex(x[i]);
      }
      return x.join('');
    }

    if (!string) return '';
    try {
      return hex(md51(string));
    } catch {
      return '';
    }
  };

  // Run encryption functions asynchronously when text changes
  useEffect(() => {
    if (!inputText) {
      setSha256Hash('');
      setSha512Hash('');
      setSha384Hash('');
      setSha1Hash('');
      setMd5Hash('');
      return;
    }

    const msgBuffer = new TextEncoder().encode(inputText);

    // Modern crypto hashing
    const hashAsHex = async (algo: 'SHA-256' | 'SHA-512' | 'SHA-384' | 'SHA-1') => {
      try {
        const hashBuffer = await crypto.subtle.digest(algo, msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        console.error(e);
        return '';
      }
    };

    hashAsHex('SHA-256').then(setSha256Hash);
    hashAsHex('SHA-512').then(setSha512Hash);
    hashAsHex('SHA-384').then(setSha384Hash);
    hashAsHex('SHA-1').then(setSha1Hash);
    setMd5Hash(computeMd5(inputText));
  }, [inputText]);

  const copyToClipboard = (text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Hash size={12} />
            Cryptographic Utilities
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Hash & Checksum Generator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate and verify crytographically secure hash values entirely client-side. Zero data is ever sent to a server.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Sliders size={18} className="text-slate-400" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                Input Parameters
              </h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Enter Text String
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your text to hash in real-time..."
                rows={8}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-3 text-xs font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 px-3 py-2.5 rounded-xl border border-emerald-500/10">
              <ShieldCheck size={14} className="shrink-0" />
              <span>Processed locally on your device. Absolute data privacy.</span>
            </div>
          </div>
        </div>

        {/* Hashes output */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                Generated Hashes
              </h3>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-md font-mono">
                {inputText.length} chars
              </span>
            </div>

            {/* SHA-256 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SHA-256 (Highly Secure)</span>
                <button
                  onClick={() => copyToClipboard(sha256Hash, 'sha256')}
                  disabled={!sha256Hash}
                  className="p-1 px-2.5 rounded-md text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  {copiedType === 'sha256' ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                  {copiedType === 'sha256' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl p-3 font-mono text-[11px] text-indigo-600 dark:text-indigo-400 break-all select-all min-h-[38px] flex items-center">
                {sha256Hash || <span className="text-slate-400 dark:text-slate-600 italic">Waiting for input...</span>}
              </div>
            </div>

            {/* SHA-512 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SHA-512</span>
                <button
                  onClick={() => copyToClipboard(sha512Hash, 'sha512')}
                  disabled={!sha512Hash}
                  className="p-1 px-2.5 rounded-md text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  {copiedType === 'sha512' ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                  {copiedType === 'sha512' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl p-3 font-mono text-[11px] text-indigo-600 dark:text-indigo-400 break-all select-all min-h-[38px] flex items-center">
                {sha512Hash || <span className="text-slate-400 dark:text-slate-600 italic">Waiting for input...</span>}
              </div>
            </div>

            {/* MD5 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">MD5 Checksum</span>
                <button
                  onClick={() => copyToClipboard(md5Hash, 'md5')}
                  disabled={!md5Hash}
                  className="p-1 px-2.5 rounded-md text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  {copiedType === 'md5' ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                  {copiedType === 'md5' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl p-3 font-mono text-[11px] text-indigo-600 dark:text-indigo-400 break-all select-all min-h-[38px] flex items-center">
                {md5Hash || <span className="text-slate-400 dark:text-slate-600 italic">Waiting for input...</span>}
              </div>
            </div>

            {/* SHA-1 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SHA-1</span>
                <button
                  onClick={() => copyToClipboard(sha1Hash, 'sha1')}
                  disabled={!sha1Hash}
                  className="p-1 px-2.5 rounded-md text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  {copiedType === 'sha1' ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                  {copiedType === 'sha1' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl p-3 font-mono text-[11px] text-indigo-600 dark:text-indigo-400 break-all select-all min-h-[38px] flex items-center">
                {sha1Hash || <span className="text-slate-400 dark:text-slate-600 italic">Waiting for input...</span>}
              </div>
            </div>

            {/* SHA-384 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SHA-384</span>
                <button
                  onClick={() => copyToClipboard(sha384Hash, 'sha384')}
                  disabled={!sha384Hash}
                  className="p-1 px-2.5 rounded-md text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  {copiedType === 'sha384' ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                  {copiedType === 'sha384' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl p-3 font-mono text-[11px] text-indigo-600 dark:text-indigo-400 break-all select-all min-h-[38px] flex items-center">
                {sha384Hash || <span className="text-slate-400 dark:text-slate-600 italic">Waiting for input...</span>}
              </div>
            </div>

          </div>
        </div>
      </div>

      <AdSenseSlot slot="hash-generator-bottom" />
    </div>
  );
}
