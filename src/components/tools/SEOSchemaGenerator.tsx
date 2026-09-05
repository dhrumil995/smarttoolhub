import React, { useState, useMemo } from 'react';
import { FileCode, HelpCircle, Code, Copy, Check, Eye, HelpCircle as HelpIcon, Sparkles, AlertTriangle, Plus, Trash2, CheckCircle2 } from 'lucide-react';

type SchemaType = 'product' | 'faq' | 'local' | 'article';

export default function SEOSchemaGenerator() {
  const [schemaType, setSchemaType] = useState<SchemaType>('product');
  const [copied, setCopied] = useState(false);

  // Forms states
  // 1. Product States
  const [prodName, setProdName] = useState('Premium Mechanical Keyboard');
  const [prodBrand, setProdBrand] = useState('KeyCraft');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80');
  const [prodPrice, setProdPrice] = useState('149.99');
  const [prodCurrency, setProdCurrency] = useState('USD');
  const [prodRating, setProdRating] = useState('4.8');
  const [prodReviews, setProdReviews] = useState('42');
  const [prodInStock, setProdInStock] = useState(true);

  // 2. FAQ Page States
  const [faqs, setFaqs] = useState([
    { q: 'Is shipping fully free?', a: 'Yes! We ship all mechanical keyboards globally with zero freight costs.' },
    { q: 'Do you offer custom switch configurations?', a: 'Indeed, you can choose between Cherry MX Blue, Red, or Brown linear switches on checkout.' },
  ]);

  // 3. Local Business States
  const [bizName, setBizName] = useState('Gourmet Pizza Studio');
  const [bizAddress, setBizAddress] = useState('128 Broadway Avenue');
  const [bizCity, setBizCity] = useState('New York');
  const [bizRegion, setBizRegion] = useState('NY');
  const [bizPostal, setBizPostal] = useState('10001');
  const [bizPhone, setBizPhone] = useState('+1 212-555-0199');
  const [bizLat, setBizLat] = useState('40.7128');
  const [bizLon, setBizLon] = useState('-74.0060');

  // 4. Article / Blog States
  const [artTitle, setArtTitle] = useState('Strategic React Performance Optimizations in 2026');
  const [artAuthor, setArtAuthor] = useState('Sarah Jenkins');
  const [artPublisher, setArtPublisher] = useState('DevCraft Insights');
  const [artPubLogo, setArtPubLogo] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80');
  const [artDate, setArtDate] = useState('2026-07-11');
  const [artDesc, setArtDesc] = useState('Learn how to structure React state machines, stabilize useEffect dependency trees, and avoid unnecessary re-renders.');

  // FAQ handlers
  const handleAddFaq = () => {
    setFaqs([...faqs, { q: 'New Frequently Asked Question?', a: 'Detailed diagnostic answer content goes here...' }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: 'q' | 'a', value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  // Compile JSON-LD schema script based on chosen type
  const compiledJsonLd = useMemo(() => {
    let schemaObj: any = {
      '@context': 'https://schema.org',
    };

    if (schemaType === 'product') {
      schemaObj = {
        ...schemaObj,
        '@type': 'Product',
        name: prodName,
        image: prodImage || undefined,
        brand: {
          '@type': 'Brand',
          name: prodBrand,
        },
        offers: {
          '@type': 'Offer',
          price: parseFloat(prodPrice) || 0,
          priceCurrency: prodCurrency,
          availability: prodInStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
        aggregateRating: prodRating ? {
          '@type': 'AggregateRating',
          ratingValue: parseFloat(prodRating) || 5.0,
          reviewCount: parseInt(prodReviews) || 1,
        } : undefined,
      };
    } else if (schemaType === 'faq') {
      schemaObj = {
        ...schemaObj,
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      };
    } else if (schemaType === 'local') {
      schemaObj = {
        ...schemaObj,
        '@type': 'LocalBusiness',
        name: bizName,
        telephone: bizPhone || undefined,
        address: {
          '@type': 'PostalAddress',
          streetAddress: bizAddress,
          addressLocality: bizCity,
          addressRegion: bizRegion,
          postalCode: bizPostal,
          addressCountry: 'US',
        },
        geo: (bizLat && bizLon) ? {
          '@type': 'GeoCoordinates',
          latitude: parseFloat(bizLat),
          longitude: parseFloat(bizLon),
        } : undefined,
      };
    } else if (schemaType === 'article') {
      schemaObj = {
        ...schemaObj,
        '@type': 'BlogPosting',
        headline: artTitle,
        datePublished: artDate,
        description: artDesc,
        author: {
          '@type': 'Person',
          name: artAuthor,
        },
        publisher: {
          '@type': 'Organization',
          name: artPublisher,
          logo: artPubLogo ? {
            '@type': 'ImageObject',
            url: artPubLogo,
          } : undefined,
        },
      };
    }

    return JSON.stringify(schemaObj, null, 2);
  }, [
    schemaType, prodName, prodBrand, prodImage, prodPrice, prodCurrency, prodRating, prodReviews, prodInStock,
    faqs, bizName, bizAddress, bizCity, bizRegion, bizPostal, bizPhone, bizLat, bizLon,
    artTitle, artAuthor, artPublisher, artPubLogo, artDate, artDesc
  ]);

  // Google Validator warnings / recommended fields checker
  const validationWarnings = useMemo(() => {
    const warnings: string[] = [];
    if (schemaType === 'product') {
      if (!prodImage) warnings.push('Recommended property "image" is missing.');
      if (!prodRating) warnings.push('Recommended property "aggregateRating" is missing.');
      if (!prodBrand) warnings.push('Recommended property "brand" is missing.');
    } else if (schemaType === 'faq') {
      if (faqs.length < 2) warnings.push('Google rich results require at least 2 FAQ entries to display Snippet cards.');
      faqs.forEach((item, index) => {
        if (!item.q.trim() || !item.a.trim()) warnings.push(`FAQ Entry #${index + 1} has blank fields.`);
      });
    } else if (schemaType === 'local') {
      if (!bizPhone) warnings.push('Recommended property "telephone" is missing for LocalBusiness.');
      if (!bizLat || !bizLon) warnings.push('Geographical coordinates "geo" are highly recommended for local map pins.');
    } else if (schemaType === 'article') {
      if (!artDesc) warnings.push('Recommended property "description" is missing for full blog summaries.');
      if (!artPubLogo) warnings.push('Recommended property "publisher.logo" is missing for Google AMP carousel eligibility.');
    }
    return warnings;
  }, [schemaType, prodImage, prodRating, prodBrand, faqs, bizPhone, bizLat, bizLon, artDesc, artPubLogo]);

  const handleCopyCode = () => {
    const fullScript = `<script type="application/ld+json">\n${compiledJsonLd}\n</script>`;
    navigator.clipboard.writeText(fullScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keep track of FAQ accordion open/close state in Google Search preview
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      {/* Type Selector Header */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 flex flex-wrap gap-1">
        {(['product', 'faq', 'local', 'article'] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setSchemaType(t);
              setOpenFaqIndex(0);
            }}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all ${
              schemaType === t
                ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t === 'product' && 'Product / Offer'}
            {t === 'faq' && 'FAQ Accordion Page'}
            {t === 'local' && 'Local Business'}
            {t === 'article' && 'Article / Blog Posting'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dynamic Parameter form */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-850">
            <Sparkles size={16} className="text-emerald-500" />
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              Configure Schema Attributes
            </h3>
          </div>

          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
            {/* PRODUCT FORMS */}
            {schemaType === 'product' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Product Name</label>
                    <input
                      type="text"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Brand Name</label>
                    <input
                      type="text"
                      value={prodBrand}
                      onChange={(e) => setProdBrand(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-600 dark:text-slate-400">Product Image URL (Optional)</label>
                  <input
                    type="text"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    placeholder="https://example.com/item.png"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Offer Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Currency Code</label>
                    <input
                      type="text"
                      value={prodCurrency}
                      onChange={(e) => setProdCurrency(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Average Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={prodRating}
                      onChange={(e) => setProdRating(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Review Count</label>
                    <input
                      type="number"
                      value={prodReviews}
                      onChange={(e) => setProdReviews(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Availability</label>
                    <select
                      value={prodInStock ? 'true' : 'false'}
                      onChange={(e) => setProdInStock(e.target.value === 'true')}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                    >
                      <option value="true">In Stock</option>
                      <option value="false">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ FORMS */}
            {schemaType === 'faq' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="block font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest text-[10px]">
                    Questions & Answers Accordions ({faqs.length})
                  </span>
                  <button
                    onClick={handleAddFaq}
                    type="button"
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus size={11} /> Add Q&A
                  </button>
                </div>

                <div className="space-y-3.5 divide-y divide-slate-100 dark:divide-slate-850 pt-1">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className={`${idx > 0 ? 'pt-4' : ''} space-y-2.5 relative group/item`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-mono text-[10px] text-slate-450">FAQ Question #{idx + 1}</span>
                        {faqs.length > 1 && (
                          <button
                            onClick={() => handleRemoveFaq(idx)}
                            type="button"
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Remove FAQ question"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={faq.q}
                          onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                          placeholder="e.g. Do you support free returns?"
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-bold"
                        />
                        <textarea
                          value={faq.a}
                          onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
                          placeholder="e.g. Yes! We offer free premium returns within 30 days..."
                          rows={2}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 font-medium resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LOCAL BUSINESS FORMS */}
            {schemaType === 'local' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Business Name</label>
                    <input
                      type="text"
                      value={bizName}
                      onChange={(e) => setBizName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Telephone</label>
                    <input
                      type="text"
                      value={bizPhone}
                      onChange={(e) => setBizPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-600 dark:text-slate-400">Street Address</label>
                  <input
                    type="text"
                    value={bizAddress}
                    onChange={(e) => setBizAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">City</label>
                    <input
                      type="text"
                      value={bizCity}
                      onChange={(e) => setBizCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Region / State</label>
                    <input
                      type="text"
                      value={bizRegion}
                      onChange={(e) => setBizRegion(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Postal Code</label>
                    <input
                      type="text"
                      value={bizPostal}
                      onChange={(e) => setBizPostal(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Latitude (GPS)</label>
                    <input
                      type="text"
                      value={bizLat}
                      onChange={(e) => setBizLat(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Longitude (GPS)</label>
                    <input
                      type="text"
                      value={bizLon}
                      onChange={(e) => setBizLon(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ARTICLE FORMS */}
            {schemaType === 'article' && (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-600 dark:text-slate-400">Article Headline</label>
                  <input
                    type="text"
                    value={artTitle}
                    onChange={(e) => setArtTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Author Name</label>
                    <input
                      type="text"
                      value={artAuthor}
                      onChange={(e) => setArtAuthor(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Publish Date</label>
                    <input
                      type="date"
                      value={artDate}
                      onChange={(e) => setArtDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Publisher Name</label>
                    <input
                      type="text"
                      value={artPublisher}
                      onChange={(e) => setArtPublisher(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 dark:text-slate-400">Publisher Logo URL (Optional)</label>
                    <input
                      type="text"
                      value={artPubLogo}
                      onChange={(e) => setArtPubLogo(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-600 dark:text-slate-400">Article Brief Summary</label>
                  <textarea
                    value={artDesc}
                    onChange={(e) => setArtDesc(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 resize-none font-medium"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Code Output & Previews */}
        <div className="lg:col-span-6 space-y-6">
          {/* Simulated Google Search Result Preview frame */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
            <h4 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-3 text-xs sm:text-sm">
              <Eye size={16} className="text-emerald-500" />
              Google SERP Rich Snippet Preview
            </h4>

            {/* SERP mock canvas */}
            <div className="p-4 bg-[#f8f9fa] dark:bg-[#1a1b1c] rounded-2xl border border-slate-200 dark:border-slate-800 font-sans text-left space-y-3.5">
              <div className="space-y-1.5">
                {/* Search breadcrumb */}
                <div className="flex items-center gap-1.5 text-[11px] text-[#202124] dark:text-[#bdc1c6] tracking-wide">
                  <span className="font-bold">https://example.com</span>
                  <span className="text-slate-400 text-[9px]">&gt;</span>
                  <span>blog</span>
                </div>

                {/* Search title */}
                <h5 className="text-[17px] leading-snug font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer">
                  {schemaType === 'product' && `${prodBrand} — ${prodName}`}
                  {schemaType === 'faq' && 'Frequently Asked Questions | Developer Hub'}
                  {schemaType === 'local' && `${bizName} - Local Services`}
                  {schemaType === 'article' && artTitle}
                </h5>

                {/* Search snippet description */}
                <p className="text-[12.5px] text-[#4d5156] dark:text-[#dae0e6] leading-relaxed">
                  {schemaType === 'product' && `Buy the high-quality, professional-grade ${prodBrand} ${prodName} on our official portal. Free shipping, global warranty...`}
                  {schemaType === 'faq' && `Check answers to common developer queries. Get help on shipping, configurations, linear switches, and more.`}
                  {schemaType === 'local' && `Contact our branch at ${bizAddress}, ${bizCity}, ${bizRegion}. Call ${bizPhone} for customized menus and coordination details.`}
                  {schemaType === 'article' && artDesc}
                </p>
              </div>

              {/* DYNAMIC METADATA RICH SNIPPETS */}
              {/* Product Rating/Review/Price Rich Row */}
              {schemaType === 'product' && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-200 dark:border-slate-800/80 pt-2.5 text-[11px] text-[#4d5156] dark:text-[#dae0e6] font-medium">
                  {prodRating && (
                    <div className="flex items-center gap-1">
                      <span className="text-[#f5c518] text-xs">★</span>
                      <span>Rating: <strong>{prodRating}/5</strong></span>
                    </div>
                  )}
                  {prodReviews && (
                    <div className="text-slate-350 dark:text-slate-650">•</div>
                  )}
                  {prodReviews && (
                    <span><strong>{prodReviews}</strong> reviews</span>
                  )}
                  <div className="text-slate-350 dark:text-slate-650">•</div>
                  <span>Price: <strong>{prodCurrency} {prodPrice}</strong></span>
                  <div className="text-slate-350 dark:text-slate-650">•</div>
                  <span className={`px-1.5 py-0.5 rounded-sm font-bold text-[9px] ${
                    prodInStock ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}>
                    {prodInStock ? 'IN STOCK' : 'OUT OF STOCK'}
                  </span>
                </div>
              )}

              {/* FAQ Page Accordions */}
              {schemaType === 'faq' && (
                <div className="border-t border-slate-200 dark:border-slate-800/80 pt-2.5 space-y-1.5 text-xs">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-slate-200/40 dark:border-slate-800/40 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                        className="w-full text-left p-2.5 font-bold text-[#1a0dab] dark:text-[#8ab4f8] flex items-center justify-between hover:underline cursor-pointer"
                      >
                        <span className="pr-4 truncate">{faq.q}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{openFaqIndex === index ? '▲' : '▼'}</span>
                      </button>
                      {openFaqIndex === index && (
                        <div className="p-2.5 border-t border-slate-100 dark:border-slate-850/80 text-[#4d5156] dark:text-[#dae0e6] bg-[#fafafa] dark:bg-slate-950 font-medium">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Local Maps / Coordinate Preview Row */}
              {schemaType === 'local' && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-200 dark:border-slate-800/80 pt-2.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span>🗺️ Coordinates: <strong>{bizLat}, {bizLon}</strong></span>
                  <div className="text-slate-350 dark:text-slate-650">•</div>
                  <span>📞 Call: <strong className="text-blue-600 dark:text-blue-400">{bizPhone}</strong></span>
                </div>
              )}

              {/* Article Person/Publisher Preview Row */}
              {schemaType === 'article' && (
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-slate-200 dark:border-slate-800/80 pt-2.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span>✍️ By: <strong>{artAuthor}</strong></span>
                  <div className="text-slate-350 dark:text-slate-650">•</div>
                  <span>📰 Publisher: <strong>{artPublisher}</strong></span>
                  <div className="text-slate-350 dark:text-slate-650">•</div>
                  <span>Published: <strong>{artDate}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* JSON-LD Script codebox */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-1.5">
                <Code size={14} className="text-emerald-500" />
                <span className="font-mono text-xs font-bold text-slate-350">
                  Pretty-Printed JSON-LD Output
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl font-semibold font-sans text-[10px] text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy Schema Script'}
              </button>
            </div>

            <pre className="text-[10px] sm:text-xs font-mono text-[#a5d6ff] p-4 bg-slate-950/60 rounded-xl overflow-x-auto max-h-[190px] border border-slate-900 leading-relaxed text-left">
              {`<script type="application/ld+json">\n${compiledJsonLd}\n</script>`}
            </pre>
          </div>
        </div>
      </div>

      {/* Recommended Property validations warning box */}
      {validationWarnings.length > 0 && (
        <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 rounded-2xl flex items-start gap-3 text-xs text-amber-600 dark:text-amber-400">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Google Rich Results Validator Warnings ({validationWarnings.length})</span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {validationWarnings.map((warning, idx) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Success banner if all is green */}
      {validationWarnings.length === 0 && (
        <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={16} className="shrink-0" />
          <span className="font-bold">Perfect Validation! Your JSON-LD schema contains all required and recommended structural fields.</span>
        </div>
      )}
    </div>
  );
}
