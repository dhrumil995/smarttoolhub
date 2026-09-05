import React, { useState } from 'react';
import { Workflow, Copy, Check, Download, Layers } from 'lucide-react';

export function CICDPipelineGenerator() {
  const [platform, setPlatform] = useState<'github' | 'gitlab' | 'jenkins'>('github');
  const [nodeVersion, setNodeVersion] = useState('20');
  const [includeDocker, setIncludeDocker] = useState(true);
  const [copied, setCopied] = useState(false);

  const getWorkflow = () => {
    if (platform === 'github') {
      return `name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js ${nodeVersion}
        uses: actions/setup-node@v4
        with:
          node-version: '${nodeVersion}'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Linter
        run: npm run lint

      - name: Run Build
        run: npm run build

${includeDocker ? `      - name: Build Docker Image
        run: docker build -t my-app:\${{ github.sha }} .` : ''}`;
    }

    if (platform === 'gitlab') {
      return `image: node:${nodeVersion}-alpine

stages:
  - lint
  - build
  - test

cache:
  paths:
    - .npm/

lint_job:
  stage: lint
  script:
    - npm ci
    - npm run lint

build_job:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/`;
    }

    return `pipeline {
    agent any
    tools {
        nodejs 'Node20'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install & Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }
    }
}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full text-xs font-semibold">
          <Workflow size={14} /> Workflow & CI/CD Builder
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          CI/CD Pipeline YAML Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Generate production-ready GitHub Actions workflows, GitLab CI YAMLs, or Jenkinsfiles with linting, testing, and Docker stages.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Platform Settings</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CI/CD Platform</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'github', label: 'GitHub' },
                  { id: 'gitlab', label: 'GitLab' },
                  { id: 'jenkins', label: 'Jenkins' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      platform === p.id
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Node.js Version</label>
              <select
                value={nodeVersion}
                onChange={(e) => setNodeVersion(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="18">Node 18 LTS</option>
                <option value="20">Node 20 LTS</option>
                <option value="22">Node 22</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">YAML Pipeline Workflow</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(getWorkflow());
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-violet-600 font-bold flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied Workflow' : 'Copy YAML'}
            </button>
          </div>

          <pre className="text-xs font-mono bg-slate-950 text-violet-300 p-4 rounded-xl overflow-x-auto min-h-[300px]">
            {getWorkflow()}
          </pre>
        </div>
      </div>
    </div>
  );
}
