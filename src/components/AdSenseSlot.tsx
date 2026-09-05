import React, { useEffect, useRef } from 'react';

interface AdSenseSlotProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: 'true' | 'false';
  className?: string;
}

export default function AdSenseSlot({
  slot = 'default-slot',
  format = 'auto',
  responsive = 'true',
  className = 'my-4',
}: AdSenseSlotProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // Initialize the ad push on component mount
      const win = window as any;
      if (win) {
        (win.adsbygoogle = win.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn('AdSense load error or blocker active:', e);
    }
  }, []);

  return (
    <div className={`w-full max-w-4xl mx-auto overflow-hidden bg-slate-100/50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center transition-all ${className}`} id={`ad-wrapper-${slot}`}>
      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-2">
        Sponsored Advertisement
      </span>
      <div className="w-full flex justify-center items-center min-h-[90px]">
        {/* Real AdSense HTML Component */}
        <ins
          ref={adRef}
          className="adsbygoogle w-full block text-center"
          style={{ display: 'block', minHeight: '90px' }}
          data-ad-client="ca-pub-4598132123552240"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      </div>
    </div>
  );
}
