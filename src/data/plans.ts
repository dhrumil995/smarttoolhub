import { PlanDetails } from '../types';

export const UPI_ID = 'aslaliyadhrumil40-4@okaxis';
export const PAYEE_NAME = 'SmartToolHub';

export const PLANS: PlanDetails[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billingPeriod: 'forever',
    description: 'Perfect for casual users & quick everyday tasks',
    aiLimit: '5 AI Generations / Day',
    features: [
      'Access to 45+ Standard Dev & Text Tools',
      'Basic YouTube & SEO Calculators',
      '5 AI Generations per day',
      'Standard Processing Speed',
      'Community Support',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 299,
    billingPeriod: 'month',
    description: 'Essential AI capabilities for creators & freelancers',
    badge: 'Starter',
    aiLimit: '100 AI Operations / Month',
    features: [
      'Everything in Free',
      '100 AI Operations & Code Generations/mo',
      'Access to AI Receipt Scanner & Basic Invoice OCR',
      'High Speed Processing Queue',
      'No Daily Limits',
      'Email Support (Response in 24h)',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 999,
    billingPeriod: 'month',
    description: 'Most Popular for power users, developers & agency owners',
    badge: 'Most Popular',
    isPopular: true,
    aiLimit: 'Unlimited AI Operations',
    features: [
      'Everything in Starter',
      'UNLOCK ALL 20+ Premium AI Business Tools',
      'Automated PO & Invoice Reconciliation',
      'Contract Summarizer & AI Document Chat',
      'GST Invoice Validator & Expense Analyzer',
      'Unlimited AI Usage without throttling',
      'Official Downloadable Invoices',
      'Priority 24/7 VIP Support',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 2999,
    billingPeriod: 'month',
    description: 'Full enterprise automation for teams, manufacturers & suppliers',
    badge: 'Enterprise',
    aiLimit: 'Unlimited + Multi-User Access',
    features: [
      'Everything in Pro',
      'Multi-User Supplier & Manufacturing Dashboard',
      'Bulk Invoice & Order Processing',
      'Custom Branding on Quotes & Invoices',
      'Manufacturing Document Vector Search',
      'Dedicated Account Manager',
      'Custom API Integrations & Exporting',
      '1-on-1 Onboarding Call',
    ],
  },
];
