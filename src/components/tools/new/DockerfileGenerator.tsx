import React, { useState } from 'react';
import { Layers, Copy, Check, Download, ShieldCheck, Code } from 'lucide-react';

export function DockerfileGenerator() {
  const [stack, setStack] = useState<'node' | 'python' | 'go'>('node');
  const [port, setPort] = useState<number>(3000);
  const [useMultiStage, setUseMultiStage] = useState(true);
  const [useNonRoot, setUseNonRoot] = useState(true);
  const [copiedDocker, setCopiedDocker] = useState(false);
  const [copiedCompose, setCopiedCompose] = useState(false);

  const getDockerfile = () => {
    if (stack === 'node') {
      return `# Multi-stage Dockerfile for Node.js App
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
${useNonRoot ? 'USER node' : ''}
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE ${port}
HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:${port}/api/health || exit 1
CMD ["node", "dist/server.cjs"]`;
    }

    if (stack === 'python') {
      return `# Production Dockerfile for Python App
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE ${port}
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "${port}"]`;
    }

    return `# Multi-stage Dockerfile for Go Service
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server .

FROM scratch
COPY --from=builder /app/server /server
EXPOSE ${port}
ENTRYPOINT ["/server"]`;
  };

  const getCompose = () => {
    return `version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "${port}:${port}"
    environment:
      - PORT=${port}
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:${port}/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <Layers size={14} /> Container Config Builder
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Dockerfile & Docker Compose Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Generate optimized multi-stage Dockerfiles and docker-compose.yml files with security best practices, healthchecks, and non-root users.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Stack Configuration</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tech Stack</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'node', label: 'Node.js' },
                  { id: 'python', label: 'Python' },
                  { id: 'go', label: 'Go' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStack(s.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      stack === s.id
                        ? 'bg-cyan-600 text-white border-cyan-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Exposed Port</label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Dockerfile</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getDockerfile());
                  setCopiedDocker(true);
                  setTimeout(() => setCopiedDocker(false), 2000);
                }}
                className="text-xs text-cyan-600 font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedDocker ? <Check size={12} /> : <Copy size={12} />} {copiedDocker ? 'Copied' : 'Copy Dockerfile'}
              </button>
            </div>
            <pre className="text-xs font-mono bg-slate-950 text-cyan-300 p-4 rounded-xl overflow-x-auto max-h-56">
              {getDockerfile()}
            </pre>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase">docker-compose.yml</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getCompose());
                  setCopiedCompose(true);
                  setTimeout(() => setCopiedCompose(false), 2000);
                }}
                className="text-xs text-cyan-600 font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedCompose ? <Check size={12} /> : <Copy size={12} />} {copiedCompose ? 'Copied' : 'Copy Compose'}
              </button>
            </div>
            <pre className="text-xs font-mono bg-slate-950 text-emerald-300 p-4 rounded-xl overflow-x-auto max-h-52">
              {getCompose()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
