import React, { useState, useMemo } from 'react';
import {
  Database,
  Copy,
  Download,
  RefreshCw,
  Check,
  Sparkles,
  Code2,
  Table as TableIcon,
  Plus,
  Trash2,
  Sliders,
  Play,
  FileCode,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from '../../utils/toast';

type PresetType = 'users' | 'ecommerce' | 'fintech' | 'logs' | 'companies' | 'custom';
type ExportFormat = 'json' | 'csv' | 'sql' | 'typescript';

interface SchemaField {
  id: string;
  name: string;
  type:
    | 'id'
    | 'uuid'
    | 'fullName'
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'phone'
    | 'avatar'
    | 'jobTitle'
    | 'company'
    | 'department'
    | 'country'
    | 'city'
    | 'street'
    | 'price'
    | 'currency'
    | 'status'
    | 'boolean'
    | 'date'
    | 'ipAddress';
}

const FIELD_TYPES = [
  { value: 'id', label: 'Auto ID (1, 2, 3...)' },
  { value: 'uuid', label: 'UUID (usr_a89bc...)' },
  { value: 'fullName', label: 'Full Name' },
  { value: 'firstName', label: 'First Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'email', label: 'Email Address' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'avatar', label: 'Avatar Image URL' },
  { value: 'jobTitle', label: 'Job Title / Role' },
  { value: 'company', label: 'Company Name' },
  { value: 'department', label: 'Department' },
  { value: 'country', label: 'Country' },
  { value: 'city', label: 'City' },
  { value: 'street', label: 'Street Address' },
  { value: 'price', label: 'Price / Number ($)' },
  { value: 'currency', label: 'Currency Code (USD, EUR)' },
  { value: 'status', label: 'Status (active, pending...)' },
  { value: 'boolean', label: 'Boolean (true / false)' },
  { value: 'date', label: 'ISO Date (YYYY-MM-DD)' },
  { value: 'ipAddress', label: 'IPv4 Address' },
];

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Sam', 'Chris', 'Elena', 'Marcus', 'Sophia', 'Liam', 'Maya', 'Noah', 'Zoe', 'Devon'];
const LAST_NAMES = ['Vance', 'Chen', 'Miller', 'Rostova', 'Smith', 'Johnson', 'Williams', 'Kowalski', 'Al-Mansoor', 'Patel', 'Kim', 'Garcia'];
const DOMAINS = ['gmail.com', 'techcorp.io', 'startup.co', 'devstudio.org', 'cloudhub.net', 'acme.design'];
const ROLES = ['Frontend Architect', 'Full Stack Engineer', 'Product Manager', 'UX Researcher', 'DevOps Specialist', 'Security Lead', 'Data Scientist'];
const COMPANIES = ['Acme Dynamics', 'Starlight Tech', 'Apex Innovations', 'Vortex Systems', 'Nexus Cloud', 'Hyperion Labs', 'Pulse AI'];
const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Customer Success', 'Legal & Ops'];
const CITIES = ['San Francisco', 'New York', 'London', 'Berlin', 'Tokyo', 'Toronto', 'Singapore', 'Austin'];
const COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'Japan', 'Canada', 'Singapore', 'Australia'];
const STATUSES = ['active', 'pending', 'completed', 'suspended', 'archived'];

export function MockDataGenerator() {
  const [preset, setPreset] = useState<PresetType>('users');
  const [format, setFormat] = useState<ExportFormat>('json');
  const [recordCount, setRecordCount] = useState<number>(10);
  const [viewMode, setViewMode] = useState<'code' | 'table'>('code');
  const [tableName, setTableName] = useState<string>('mock_records');
  const [copied, setCopied] = useState(false);
  const [seed, setSeed] = useState<number>(1);

  const [customFields, setCustomFields] = useState<SchemaField[]>([
    { id: '1', name: 'id', type: 'id' },
    { id: '2', name: 'name', type: 'fullName' },
    { id: '3', name: 'email', type: 'email' },
    { id: '4', name: 'role', type: 'jobTitle' },
    { id: '5', name: 'status', type: 'status' },
  ]);

  const addCustomField = () => {
    setCustomFields((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        name: `field_${prev.length + 1}`,
        type: 'email'
      }
    ]);
  };

  const removeCustomField = (id: string) => {
    setCustomFields((prev) => prev.filter((f) => f.id !== id));
  };

  const updateCustomField = (id: string, updates: Partial<SchemaField>) => {
    setCustomFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  // Generate a value for a specific field type
  const generateFieldValue = (type: SchemaField['type'], index: number, total: number) => {
    const s = seed * 31 + index;
    const fn = FIRST_NAMES[(s + index) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(s * 3 + index) % LAST_NAMES.length];
    const domain = DOMAINS[(s + index) % DOMAINS.length];
    const comp = COMPANIES[(s + index) % COMPANIES.length];
    const city = CITIES[(s + index) % CITIES.length];
    const country = COUNTRIES[(s + index) % COUNTRIES.length];

    switch (type) {
      case 'id':
        return index + 1;
      case 'uuid':
        return `usr_${Math.sin(s + index).toString(36).substring(2, 10)}`;
      case 'fullName':
        return `${fn} ${ln}`;
      case 'firstName':
        return fn;
      case 'lastName':
        return ln;
      case 'email':
        return `${fn.toLowerCase()}.${ln.toLowerCase()}@${domain}`;
      case 'phone':
        return `+1 (${200 + (s % 700)}) 555-${1000 + (index * 13) % 9000}`;
      case 'avatar':
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${fn}${ln}`;
      case 'jobTitle':
        return ROLES[(s + index) % ROLES.length];
      case 'company':
        return comp;
      case 'department':
        return DEPARTMENTS[(s + index) % DEPARTMENTS.length];
      case 'country':
        return country;
      case 'city':
        return city;
      case 'street':
        return `${100 + (s % 899)} Innovation Way, Suite ${index + 1}`;
      case 'price':
        return Number((19.99 + ((s + index) % 250) * 4.5).toFixed(2));
      case 'currency':
        return 'USD';
      case 'status':
        return STATUSES[(s + index) % STATUSES.length];
      case 'boolean':
        return (s + index) % 2 === 0;
      case 'date':
        const d = new Date(Date.now() - (index * 86400000 * 2));
        return d.toISOString().split('T')[0];
      case 'ipAddress':
        return `192.168.${1 + (s % 250)}.${10 + (index % 240)}`;
      default:
        return 'N/A';
    }
  };

  // Generate active records
  const generatedRecords = useMemo(() => {
    const records: Record<string, any>[] = [];

    for (let i = 0; i < recordCount; i++) {
      const s = seed * 37 + i;
      const fn = FIRST_NAMES[(s + i) % FIRST_NAMES.length];
      const ln = LAST_NAMES[(s * 3 + i) % LAST_NAMES.length];
      const domain = DOMAINS[(s + i) % DOMAINS.length];
      const comp = COMPANIES[(s + i) % COMPANIES.length];

      if (preset === 'users') {
        records.push({
          id: i + 1,
          uuid: `usr_${Math.sin(s + i).toString(36).substring(2, 10)}`,
          name: `${fn} ${ln}`,
          email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${domain}`,
          role: ROLES[(s + i) % ROLES.length],
          company: comp,
          department: DEPARTMENTS[(s + i) % DEPARTMENTS.length],
          status: STATUSES[(s + i) % STATUSES.length],
          createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString().split('T')[0]
        });
      } else if (preset === 'ecommerce') {
        const PRODUCTS = ['Ergonomic Chair', 'Mechanical Keyboard', '4K Monitor', 'Wireless Headphones', 'USB-C Dock', 'Microphone', 'Desk Mat'];
        records.push({
          id: i + 1,
          sku: `SKU-${1000 + i}`,
          productName: `${PRODUCTS[i % PRODUCTS.length]} Pro`,
          category: (['Electronics', 'Office Supplies', 'Audio', 'Accessories'] as const)[i % 4],
          price: Number((29.99 + (i * 18.5)).toFixed(2)),
          stockQuantity: 15 + ((s + i) % 180),
          rating: Number((3.8 + (i % 12) * 0.1).toFixed(1)),
          inStock: (i + s) % 5 !== 0
        });
      } else if (preset === 'fintech') {
        records.push({
          transactionId: `TXN-${90000 + i}`,
          userId: 100 + (i % 15),
          sender: `${fn} ${ln}`,
          amount: Number((24.50 + ((s + i) % 120) * 15.25).toFixed(2)),
          currency: 'USD',
          paymentMethod: (['Credit Card', 'Stripe', 'PayPal', 'Wire Transfer', 'Apple Pay'] as const)[i % 5],
          status: (['completed', 'pending', 'settled', 'failed'] as const)[i % 4],
          timestamp: new Date(Date.now() - i * 3600000 * 4).toISOString()
        });
      } else if (preset === 'logs') {
        records.push({
          logId: `log_${1000 + i}`,
          timestamp: new Date(Date.now() - i * 60000 * 15).toISOString(),
          level: (['INFO', 'DEBUG', 'WARN', 'ERROR'] as const)[i % 4],
          service: (['auth-service', 'payment-gateway', 'api-router', 'worker-queue'] as const)[i % 4],
          statusCode: ([200, 201, 400, 404, 500] as const)[i % 5],
          ip: `10.0.${1 + (i % 20)}.${100 + (i % 150)}`,
          responseTimeMs: 12 + ((s + i) % 85)
        });
      } else if (preset === 'companies') {
        records.push({
          companyId: i + 1,
          name: comp,
          domain: `${comp.toLowerCase().replace(/\s+/g, '')}.com`,
          industry: (['SaaS', 'FinTech', 'AI Cloud', 'Cybersecurity', 'BioTech'] as const)[i % 5],
          employeesCount: 20 + ((s + i) % 250) * 5,
          annualRevenue: `$${(2.5 + (i * 1.8)).toFixed(1)}M`,
          country: COUNTRIES[i % COUNTRIES.length],
          foundedYear: 2015 + (i % 9)
        });
      } else {
        // Custom schema
        const item: Record<string, any> = {};
        customFields.forEach((field) => {
          item[field.name] = generateFieldValue(field.type, i, recordCount);
        });
        records.push(item);
      }
    }

    return records;
  }, [preset, recordCount, seed, customFields]);

  // Formatted string output
  const outputCode = useMemo(() => {
    if (generatedRecords.length === 0) return '';

    if (format === 'json') {
      return JSON.stringify(generatedRecords, null, 2);
    } else if (format === 'csv') {
      const headers = Object.keys(generatedRecords[0]);
      const csvRows = [headers.join(',')];
      for (const row of generatedRecords) {
        csvRows.push(
          Object.values(row)
            .map((val) => (typeof val === 'string' && val.includes(',') ? `"${val}"` : String(val)))
            .join(',')
        );
      }
      return csvRows.join('\n');
    } else if (format === 'sql') {
      const tName = tableName.trim() || 'mock_records';
      const headers = Object.keys(generatedRecords[0]);
      const lines = [`INSERT INTO ${tName} (${headers.join(', ')}) VALUES`];
      const rows = generatedRecords.map((row, idx) => {
        const vals = Object.values(row).map((v) => (typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v));
        return `  (${vals.join(', ')})${idx === generatedRecords.length - 1 ? ';' : ','}`;
      });
      return lines.concat(rows).join('\n');
    } else {
      // TypeScript
      const sample = generatedRecords[0];
      const typeLines = Object.entries(sample).map(([k, v]) => `  ${k}: ${typeof v};`);
      return `export interface GeneratedRecord {\n${typeLines.join('\n')}\n}\n\nexport const MOCK_DATA: GeneratedRecord[] = ${JSON.stringify(
        generatedRecords,
        null,
        2
      )};`;
    }
  }, [generatedRecords, format, tableName]);

  const handleCopy = async () => {
    if (!outputCode) return;
    try {
      await navigator.clipboard.writeText(outputCode);
      setCopied(true);
      toast.success('Mock data copied to clipboard!', 'Data Copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy data.');
    }
  };

  const handleDownload = () => {
    if (!outputCode) return;
    const ext = format === 'json' ? 'json' : format === 'csv' ? 'csv' : format === 'sql' ? 'sql' : 'ts';
    const mime =
      format === 'json'
        ? 'application/json'
        : format === 'csv'
        ? 'text/csv'
        : format === 'sql'
        ? 'application/sql'
        : 'text/typescript';

    const blob = new Blob([outputCode], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock-data-${preset}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported mock-data-${preset}.${ext}`, 'File Downloaded');
  };

  const PRESETS_LIST: { id: PresetType; label: string; desc: string }[] = [
    { id: 'users', label: 'User Profiles', desc: 'UUIDs, names, emails, roles & companies' },
    { id: 'ecommerce', label: 'E-Commerce Products', desc: 'SKUs, titles, categories, pricing & stock' },
    { id: 'fintech', label: 'FinTech Transactions', desc: 'Payment amounts, methods, statuses & timestamps' },
    { id: 'logs', label: 'Server & Error Logs', desc: 'Status codes, IP addresses & latency metrics' },
    { id: 'companies', label: 'B2B Organizations', desc: 'Company domains, employee sizes & revenues' },
    { id: 'custom', label: 'Custom Schema Builder', desc: 'Design your own custom fields and data types' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Database size={13} /> High-Fidelity Dataset Studio
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Mock Data & Schema Generator
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate realistic datasets in JSON, CSV, SQL, and TypeScript with pre-built schemas or custom field builders.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setSeed((prev) => prev + 1)}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Re-randomize generated dataset"
            >
              <RefreshCw size={13} />
              <span>Shuffle</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Preset Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-4">
          {PRESETS_LIST.map((p) => {
            const isSelected = preset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-bold leading-tight">{p.label}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1">{p.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Config Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders size={14} className="text-emerald-500" /> Export Configuration
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                {recordCount} Records
              </span>
            </div>

            {/* Export Format Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Format
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['json', 'csv', 'sql', 'typescript'] as ExportFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`py-2 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer border ${
                      format === fmt
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                  >
                    {fmt === 'typescript' ? 'TS' : fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* SQL Table Name input if SQL selected */}
            {format === 'sql' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  SQL Table Name
                </label>
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            )}

            {/* Record Count Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Row Quantity</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{recordCount} rows</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={recordCount}
                onChange={(e) => setRecordCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Custom Schema Builder (if Custom preset is active) */}
            {preset === 'custom' && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Schema Columns ({customFields.length})
                  </span>
                  <button
                    onClick={addCustomField}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} /> Add Field
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {customFields.map((field) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateCustomField(field.id, { name: e.target.value })}
                        className="w-1/2 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                        placeholder="fieldName"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => updateCustomField(field.id, { type: e.target.value as any })}
                        className="w-1/2 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                      >
                        {FIELD_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeCustomField(field.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                        title="Remove column"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Output View */}
        <div className="lg:col-span-8 flex flex-col min-h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          {/* Top View Mode Bar */}
          <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('code')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'code'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750'
                }`}
              >
                <Code2 size={13} /> Raw {format.toUpperCase()}
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750'
                }`}
              >
                <TableIcon size={13} /> Table View
              </button>
            </div>

            <div className="text-xs font-mono text-slate-400">
              {generatedRecords.length} items • {Object.keys(generatedRecords[0] || {}).length} columns
            </div>
          </div>

          {/* View Content */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 bg-white dark:bg-slate-900">
            {viewMode === 'code' ? (
              <pre className="font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap select-all">
                {outputCode}
              </pre>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                      {Object.keys(generatedRecords[0] || {}).map((header) => (
                        <th key={header} className="p-2.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {generatedRecords.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors">
                        {Object.values(row).map((val: any, cIdx) => (
                          <td key={cIdx} className="p-2.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {typeof val === 'boolean' ? (
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${val ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                                {val ? 'true' : 'false'}
                              </span>
                            ) : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MockDataGenerator;
