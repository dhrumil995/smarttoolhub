import React, { useState, useMemo, useCallback } from 'react';
import {
  QrCode,
  Download,
  RefreshCw,
  Check,
  ExternalLink,
  Wifi,
  Mail,
  Phone,
  MessageSquare,
  User,
  Globe,
  FileText,
  Sparkles,
  Copy,
  Printer,
  Shield,
  Layers,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from '../../utils/toast';

type QRType = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'sms' | 'vcard' | 'whatsapp';

export default function QRGenerator() {
  const [activeType, setActiveType] = useState<QRType>('url');

  // Input fields for various types
  const [urlInput, setUrlInput] = useState('https://smarttoolhub.net');
  const [textInput, setTextInput] = useState('');

  // WiFi
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // Email
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Phone & SMS
  const [phoneNum, setPhoneNum] = useState('');
  const [smsMsg, setSmsMsg] = useState('');

  // WhatsApp
  const [waPhone, setWaPhone] = useState('');
  const [waMsg, setWaMsg] = useState('');

  // vCard
  const [vFirstName, setVFirstName] = useState('');
  const [vLastName, setVLastName] = useState('');
  const [vOrg, setVOrg] = useState('');
  const [vTitle, setVTitle] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vEmail, setVEmail] = useState('');
  const [vUrl, setVUrl] = useState('');

  // QR Customizations
  const [size, setSize] = useState('300');
  const [fgColor, setFgColor] = useState('#0f172a'); // slate-900
  const [bgColor, setBgColor] = useState('#ffffff');
  const [ecc, setEcc] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [margin, setMargin] = useState('2');

  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDataUri, setCopiedDataUri] = useState(false);

  // Formatted QR String construction
  const payloadData = useMemo(() => {
    switch (activeType) {
      case 'url':
        return urlInput.trim();
      case 'text':
        return textInput.trim();
      case 'wifi':
        if (!wifiSsid.trim()) return '';
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'email':
        if (!emailTo.trim()) return '';
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return phoneNum.trim() ? `tel:${phoneNum.trim()}` : '';
      case 'sms':
        if (!phoneNum.trim()) return '';
        return `smsto:${phoneNum}:${smsMsg}`;
      case 'whatsapp':
        if (!waPhone.trim()) return '';
        const cleanPhone = waPhone.replace(/[^0-9]/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`;
      case 'vcard':
        if (!vFirstName && !vLastName && !vPhone) return '';
        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `N:${vLastName};${vFirstName};;;`,
          `FN:${vFirstName} ${vLastName}`.trim(),
          vOrg ? `ORG:${vOrg}` : '',
          vTitle ? `TITLE:${vTitle}` : '',
          vPhone ? `TEL;TYPE=CELL:${vPhone}` : '',
          vEmail ? `EMAIL:${vEmail}` : '',
          vUrl ? `URL:${vUrl}` : '',
          'END:VCARD'
        ]
          .filter(Boolean)
          .join('\n');
      default:
        return '';
    }
  }, [
    activeType,
    urlInput,
    textInput,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    wifiHidden,
    emailTo,
    emailSubject,
    emailBody,
    phoneNum,
    smsMsg,
    waPhone,
    waMsg,
    vFirstName,
    vLastName,
    vOrg,
    vTitle,
    vPhone,
    vEmail,
    vUrl
  ]);

  const cleanFg = fgColor.replace('#', '');
  const cleanBg = bgColor.replace('#', '');

  const qrUrl = useMemo(() => {
    if (!payloadData) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
      payloadData
    )}&color=${cleanFg}&bgcolor=${cleanBg}&margin=${margin}&ecc=${ecc}`;
  }, [payloadData, size, cleanFg, cleanBg, margin, ecc]);

  const handleDownloadPNG = async () => {
    if (!qrUrl) return;
    setIsDownloading(true);
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `smarttoolhub_qr_${activeType}_${size}x${size}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success('High-resolution QR code image downloaded!');
    } catch {
      window.open(qrUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!qrUrl) return;
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopiedLink(true);
      toast.success('Direct QR image URL copied!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  const handlePrint = () => {
    if (!qrUrl) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code - SmartToolHub</title>
            <style>
              body { font-family: sans-serif; text-align: center; padding: 40px; }
              img { max-width: 350px; height: auto; border: 1px solid #ccc; padding: 20px; border-radius: 12px; }
              h1 { font-size: 20px; margin-bottom: 10px; }
              p { font-size: 14px; color: #666; margin-top: 15px; }
            </style>
          </head>
          <body>
            <h1>Scan QR Code</h1>
            <img src="${qrUrl}" alt="QR Code" />
            <p>${activeType.toUpperCase()} Payload | Generated on SmartToolHub</p>
            <script>window.onload = function() { window.print(); window.close(); }</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleReset = () => {
    setUrlInput('https://smarttoolhub.net');
    setTextInput('');
    setWifiSsid('');
    setWifiPassword('');
    setEmailTo('');
    setEmailSubject('');
    setEmailBody('');
    setPhoneNum('');
    setSmsMsg('');
    setWaPhone('');
    setWaMsg('');
    setVFirstName('');
    setVLastName('');
    setVOrg('');
    setVTitle('');
    setVPhone('');
    setVEmail('');
    setVUrl('');
    setFgColor('#0f172a');
    setBgColor('#ffffff');
    setEcc('M');
    setSize('300');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-2 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
        {[
          { id: 'url', label: 'Website URL', icon: Globe },
          { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
          { id: 'vcard', label: 'vCard Contact', icon: User },
          { id: 'text', label: 'Plain Text', icon: FileText },
          { id: 'email', label: 'Email', icon: Mail },
          { id: 'phone', label: 'Phone Call', icon: Phone },
          { id: 'sms', label: 'SMS Text', icon: MessageSquare },
          { id: 'whatsapp', label: 'WhatsApp Chat', icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id as QRType)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeType === tab.id
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-blue-500" />
                <span>
                  {activeType === 'url' && 'Website Link Payload'}
                  {activeType === 'wifi' && 'Wi-Fi Credentials Payload'}
                  {activeType === 'vcard' && 'vCard Business Contact Details'}
                  {activeType === 'text' && 'Plain Text Payload'}
                  {activeType === 'email' && 'Email Prefill Payload'}
                  {activeType === 'phone' && 'Phone Call Dialing Payload'}
                  {activeType === 'sms' && 'SMS Text Message Payload'}
                  {activeType === 'whatsapp' && 'WhatsApp Instant Direct Link'}
                </span>
              </h3>
            </div>

            {/* Inputs by active tab */}
            {activeType === 'url' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Target Website URL
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>
            )}

            {activeType === 'text' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Plain Text Content
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={4}
                  placeholder="Enter custom text, code snippets, notes, or instructions..."
                  className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-mono text-slate-900 dark:text-white resize-none"
                />
              </div>
            )}

            {activeType === 'wifi' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Network Name (SSID)
                    </label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="e.g. Office_5G"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Wi-Fi Password
                    </label>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      placeholder="Network Password"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Encryption Security
                    </label>
                    <select
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value as any)}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                      <option value="WEP">WEP (Legacy)</option>
                      <option value="nopass">Open Network (No Password)</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer self-end">
                    <input
                      type="checkbox"
                      checked={wifiHidden}
                      onChange={(e) => setWifiHidden(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer accent-blue-600"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Hidden Network SSID
                    </span>
                  </label>
                </div>
              </div>
            )}

            {activeType === 'email' && (
              <div className="space-y-3">
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="Recipient Email (e.g. contact@domain.com)"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email Subject Line"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                />
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={3}
                  placeholder="Email Message Body..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs resize-none"
                />
              </div>
            )}

            {activeType === 'phone' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Phone Number (With Country Code)
                </label>
                <input
                  type="tel"
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            )}

            {activeType === 'sms' && (
              <div className="space-y-3">
                <input
                  type="tel"
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                />
                <textarea
                  value={smsMsg}
                  onChange={(e) => setSmsMsg(e.target.value)}
                  rows={3}
                  placeholder="Prefilled SMS message..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs resize-none"
                />
              </div>
            )}

            {activeType === 'whatsapp' && (
              <div className="space-y-3">
                <input
                  type="tel"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="WhatsApp Number with Country Code (e.g. 15551234567)"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                />
                <textarea
                  value={waMsg}
                  onChange={(e) => setWaMsg(e.target.value)}
                  rows={3}
                  placeholder="Pre-filled WhatsApp chat message..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs resize-none"
                />
              </div>
            )}

            {activeType === 'vcard' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={vFirstName}
                  onChange={(e) => setVFirstName(e.target.value)}
                  placeholder="First Name *"
                  className="px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  value={vLastName}
                  onChange={(e) => setVLastName(e.target.value)}
                  placeholder="Last Name"
                  className="px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  value={vOrg}
                  onChange={(e) => setVOrg(e.target.value)}
                  placeholder="Company / Organization"
                  className="px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  value={vTitle}
                  onChange={(e) => setVTitle(e.target.value)}
                  placeholder="Job Title"
                  className="px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                />
                <input
                  type="tel"
                  value={vPhone}
                  onChange={(e) => setVPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                />
                <input
                  type="email"
                  value={vEmail}
                  onChange={(e) => setVEmail(e.target.value)}
                  placeholder="Email Address"
                  className="px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                />
                <input
                  type="url"
                  value={vUrl}
                  onChange={(e) => setVUrl(e.target.value)}
                  placeholder="Website URL"
                  className="sm:col-span-2 px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                />
              </div>
            )}

            {/* Customization Styling Controls */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Visual Styling &amp; Resolution
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Size */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Image Resolution
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                  >
                    <option value="150">150 x 150 px (Small)</option>
                    <option value="300">300 x 300 px (Standard HD)</option>
                    <option value="500">500 x 500 px (Large)</option>
                    <option value="1000">1000 x 1000 px (Ultra Print)</option>
                  </select>
                </div>

                {/* Foreground */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    QR Modules Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-9 h-9 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={fgColor.toUpperCase()}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                    />
                  </div>
                </div>

                {/* Background */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-9 h-9 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={bgColor.toUpperCase()}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Error Correction & Margin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Error Correction Level
                  </label>
                  <select
                    value={ecc}
                    onChange={(e) => setEcc(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                  >
                    <option value="L">Level L (7% Damage Recovery)</option>
                    <option value="M">Level M (15% Standard)</option>
                    <option value="Q">Level Q (25% High Reliability)</option>
                    <option value="H">Level H (30% Max Redundancy)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Quiet Zone Margin ({margin} Blocks)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    value={margin}
                    onChange={(e) => setMargin(e.target.value)}
                    className="w-full mt-2 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handleReset}
                className="px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Reset Form</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm text-center w-full space-y-6">
            <span className="text-xs font-bold font-mono tracking-widest uppercase text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1.5">
              <QrCode size={16} />
              <span>Vector QR Code Preview</span>
            </span>

            <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 min-h-[260px] relative">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt="Generated QR Code"
                  className="max-w-full h-auto object-contain transition-transform duration-300 hover:scale-105 rounded-lg shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 space-y-2 p-6">
                  <QrCode size={48} className="stroke-[1.5]" />
                  <p className="text-xs font-medium">Fill in fields to generate QR code...</p>
                </div>
              )}
            </div>

            {/* Encoded Payload String Preview */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 text-left">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Raw Encoded Payload:
              </span>
              <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300 break-all line-clamp-2">
                {payloadData || 'None'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleDownloadPNG}
                disabled={!qrUrl || isDownloading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Download size={16} />
                <span>{isDownloading ? 'Preparing File...' : 'Download HD PNG Image'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyLink}
                  disabled={!qrUrl}
                  className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copiedLink ? 'Copied' : 'Copy Direct Link'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  disabled={!qrUrl}
                  className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print Poster</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
