import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserSubscription,
  PaymentRequest,
  RevenueStats,
  PlanId,
  ToolId
} from '../types';
import { TOOLS } from '../data/tools';
import { api } from '../utils/api';

interface SubscriptionContextType {
  userEmail: string;
  setUserEmail: (email: string) => void;
  subscription: UserSubscription;
  payments: PaymentRequest[];
  stats: RevenueStats;
  loading: boolean;
  selectedPlanForCheckout: PlanId | null;
  setSelectedPlanForCheckout: (planId: PlanId | null) => void;
  isToolUnlocked: (toolId: ToolId) => boolean;
  getRemainingDays: () => number;
  submitPayment: (payment: {
    userName: string;
    userEmail: string;
    userPhone: string;
    planId: PlanId;
    planName: string;
    amount: number;
    upiTransactionId: string;
  }) => Promise<{ success: boolean; payment?: PaymentRequest; error?: string }>;
  approvePayment: (id: string) => Promise<{ success: boolean; error?: string }>;
  rejectPayment: (id: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  activateUserSubscription: (
    email: string,
    userName: string,
    planId: PlanId,
    durationDays?: number
  ) => Promise<{ success: boolean; error?: string }>;
  cancelUserSubscription: (email: string) => Promise<{ success: boolean; error?: string }>;
  toggleAutoRenew: (autoRenew: boolean) => Promise<{ success: boolean; message?: string; error?: string }>;
  refreshData: () => Promise<void>;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const defaultSubscription: UserSubscription = {
  userId: 'guest@smarttoolhub.com',
  planId: 'free',
  planName: 'Free Plan',
  startDate: new Date().toISOString(),
  expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
  status: 'Free',
  amountPaid: 0,
  updatedAt: new Date().toISOString()
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Local persistence helpers for static host / offline fallback
function getLocalPayments(): PaymentRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('sth_local_payments');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalPayments(payments: PaymentRequest[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('sth_local_payments', JSON.stringify(payments));
  } catch {}
}

function getLocalSubscriptions(): Record<string, UserSubscription> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('sth_local_subscriptions');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalSubscriptions(subs: Record<string, UserSubscription>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('sth_local_subscriptions', JSON.stringify(subs));
  } catch {}
}

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userEmail, setUserEmailState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const rawAuth = localStorage.getItem('sth_auth_user');
        if (rawAuth) {
          const parsed = JSON.parse(rawAuth);
          if (parsed?.email) return parsed.email;
        }
      } catch (e) {}

      const stored = localStorage.getItem('sth_user_email');
      if (stored === 'demo.user@smarttoolhub.com') {
        localStorage.removeItem('sth_user_email');
        return '';
      }
      return stored || '';
    }
    return '';
  });

  // Sync user email whenever sth_auth_user changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const rawAuth = localStorage.getItem('sth_auth_user');
        if (rawAuth) {
          const parsed = JSON.parse(rawAuth);
          if (parsed?.email && parsed.email !== userEmail) {
            setUserEmailState(parsed.email);
          }
        }
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [userEmail]);

  const setUserEmail = (email: string) => {
    const clean = email.toLowerCase().trim();
    setUserEmailState(clean);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sth_user_email', clean);
    }
  };

  const [subscription, setSubscription] = useState<UserSubscription>(defaultSubscription);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [stats, setStats] = useState<RevenueStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingCount: 0,
    activeSubscribers: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanId | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sth_is_admin') === 'true';
    }
    return false;
  });

  const handleSetIsAdmin = (value: boolean) => {
    setIsAdmin(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sth_is_admin', value ? 'true' : 'false');
    }
  };

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const emailLower = userEmail.toLowerCase().trim();

      // 1. Fetch Backend Payments
      let backendPayments: PaymentRequest[] = [];
      const payRes = await api.get<{ payments: PaymentRequest[] }>('/api/payments', { showToastOnError: false });
      if (payRes.ok && payRes.data?.payments) {
        backendPayments = payRes.data.payments;
      }

      // Merge backend payments with local fallback payments
      const localPayments = getLocalPayments();
      const paymentMap = new Map<string, PaymentRequest>();
      [...backendPayments, ...localPayments].forEach((p) => {
        paymentMap.set(p.id, p);
      });
      const mergedPayments = Array.from(paymentMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPayments(mergedPayments);

      // 2. Fetch User Subscription
      let currentSub: UserSubscription = defaultSubscription;
      if (emailLower) {
        const subRes = await api.get<{ subscription: UserSubscription }>(
          `/api/subscription/${encodeURIComponent(emailLower)}`,
          { showToastOnError: false }
        );
        if (subRes.ok && subRes.data?.subscription) {
          currentSub = subRes.data.subscription;
        }

        // Check local subscription override if local is active or pending
        const localSubs = getLocalSubscriptions();
        if (localSubs[emailLower]) {
          const localSub = localSubs[emailLower];
          if (currentSub.status === 'Free' || localSub.status === 'Active' || localSub.status === 'Pending') {
            currentSub = localSub;
          }
        }
      }
      setSubscription(currentSub);

      // 3. Calculate / Fetch Stats
      const statsRes = await api.get<RevenueStats>('/api/admin/stats', { showToastOnError: false });
      if (statsRes.ok && statsRes.data) {
        setStats(statsRes.data);
      } else {
        // Compute stats locally if backend API is not available
        const approved = mergedPayments.filter((p) => p.status === 'Approved');
        const pending = mergedPayments.filter((p) => p.status === 'Pending');
        const totalRev = approved.reduce((acc, p) => acc + (p.amount || 0), 0);
        setStats({
          totalRevenue: totalRev,
          monthlyRevenue: totalRev,
          pendingCount: pending.length,
          activeSubscribers: approved.length
        });
      }
    } catch (e) {
      console.error('Error refreshing subscription data:', e);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    refreshData();
  }, [refreshData, userEmail]);

  const getRemainingDays = useCallback((): number => {
    if (!subscription || subscription.status === 'Free' || !subscription.expiryDate) {
      return 0;
    }
    const expiry = new Date(subscription.expiryDate).getTime();
    const now = Date.now();
    const diff = expiry - now;
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [subscription]);

  const isToolUnlocked = useCallback(
    (toolId: ToolId): boolean => {
      const tool = TOOLS.find((t) => t.id === toolId);
      if (!tool) return true;

      // Check if tool is AI Business or explicitly marked Premium
      const isPremiumCategory = tool.category === 'ai-business' || tool.isPremium;
      if (!isPremiumCategory) return true;

      // Admin or Active subscription unlocks premium
      if (isAdmin) return true;
      if (subscription && subscription.status === 'Active' && getRemainingDays() > 0) {
        return true;
      }

      return false;
    },
    [subscription, isAdmin, getRemainingDays]
  );

  const submitPayment = async (paymentInput: {
    userName: string;
    userEmail: string;
    userPhone: string;
    planId: PlanId;
    planName: string;
    amount: number;
    upiTransactionId: string;
  }) => {
    const formattedEmail = paymentInput.userEmail.toLowerCase().trim();

    // First attempt backend API request with silent error catching
    const res = await api.post(
      '/api/payments',
      {
        ...paymentInput,
        userEmail: formattedEmail,
        upiIdUsed: 'aslaliyadhrumil40-4@okaxis'
      },
      { showToastOnError: false }
    );

    if (res.ok && res.data?.success) {
      setUserEmail(formattedEmail);
      await refreshData();
      return { success: true, payment: res.data.payment };
    }

    // Seamless Fallback: Save in localStorage for static host / 404 response
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `STH-ORD-${randomNum}`;
    const newPayment: PaymentRequest = {
      id: orderId,
      userId: formattedEmail,
      userName: paymentInput.userName.trim(),
      userEmail: formattedEmail,
      userPhone: paymentInput.userPhone.trim(),
      planId: paymentInput.planId,
      planName: paymentInput.planName,
      amount: paymentInput.amount,
      upiTransactionId: paymentInput.upiTransactionId,
      upiIdUsed: 'aslaliyadhrumil40-4@okaxis',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const localPayments = getLocalPayments();
    localPayments.unshift(newPayment);
    saveLocalPayments(localPayments);

    const localSubs = getLocalSubscriptions();
    localSubs[formattedEmail] = {
      userId: formattedEmail,
      userName: paymentInput.userName.trim(),
      userPhone: paymentInput.userPhone.trim(),
      planId: paymentInput.planId,
      planName: paymentInput.planName,
      status: 'Pending',
      startDate: new Date().toISOString(),
      expiryDate: new Date().toISOString(),
      amountPaid: paymentInput.amount,
      autoRenew: false,
      updatedAt: new Date().toISOString()
    };
    saveLocalSubscriptions(localSubs);

    setUserEmail(formattedEmail);
    await refreshData();
    return { success: true, payment: newPayment };
  };

  const approvePayment = async (id: string) => {
    const res = await api.put(`/api/payments/${id}/approve`, undefined, { showToastOnError: false });
    if (res.ok && res.data?.success) {
      await refreshData();
      return { success: true };
    }

    // Local fallback for approval
    const localPayments = getLocalPayments();
    const pIndex = localPayments.findIndex((p) => p.id === id);
    if (pIndex !== -1) {
      localPayments[pIndex].status = 'Approved';
      localPayments[pIndex].updatedAt = new Date().toISOString();
      saveLocalPayments(localPayments);

      const targetEmail = localPayments[pIndex].userEmail;
      const localSubs = getLocalSubscriptions();
      const startDate = new Date().toISOString();
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);

      localSubs[targetEmail] = {
        userId: targetEmail,
        userName: localPayments[pIndex].userName,
        userPhone: localPayments[pIndex].userPhone,
        planId: localPayments[pIndex].planId,
        planName: localPayments[pIndex].planName,
        status: 'Active',
        startDate,
        expiryDate: expiry.toISOString(),
        amountPaid: localPayments[pIndex].amount,
        lastOrderId: localPayments[pIndex].id,
        autoRenew: false,
        updatedAt: new Date().toISOString()
      };
      saveLocalSubscriptions(localSubs);
      await refreshData();
      return { success: true };
    }

    return { success: false, error: res.error || 'Failed to approve payment.' };
  };

  const rejectPayment = async (id: string, reason?: string) => {
    const res = await api.put(`/api/payments/${id}/reject`, { reason }, { showToastOnError: false });
    if (res.ok && res.data?.success) {
      await refreshData();
      return { success: true };
    }

    // Local fallback for rejection
    const localPayments = getLocalPayments();
    const pIndex = localPayments.findIndex((p) => p.id === id);
    if (pIndex !== -1) {
      localPayments[pIndex].status = 'Rejected';
      localPayments[pIndex].rejectionReason = reason || 'Admin rejected payment';
      localPayments[pIndex].updatedAt = new Date().toISOString();
      saveLocalPayments(localPayments);

      const targetEmail = localPayments[pIndex].userEmail;
      const localSubs = getLocalSubscriptions();
      if (localSubs[targetEmail]) {
        localSubs[targetEmail].status = 'Free';
        saveLocalSubscriptions(localSubs);
      }
      await refreshData();
      return { success: true };
    }

    return { success: false, error: res.error || 'Failed to reject payment.' };
  };

  const activateUserSubscription = async (
    email: string,
    userName: string,
    planId: PlanId,
    durationDays = 30
  ) => {
    const formattedEmail = email.toLowerCase().trim();
    const res = await api.post(
      '/api/subscription/activate',
      {
        email: formattedEmail,
        userName,
        planId,
        durationDays
      },
      { showToastOnError: false }
    );

    if (res.ok && res.data?.success) {
      await refreshData();
      return { success: true };
    }

    // Local fallback
    const localSubs = getLocalSubscriptions();
    const startDate = new Date().toISOString();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + durationDays);

    localSubs[formattedEmail] = {
      userId: formattedEmail,
      userName,
      planId,
      planName: `${planId.toUpperCase()} Plan`,
      status: 'Active',
      startDate,
      expiryDate: expiry.toISOString(),
      amountPaid: planId === 'business' ? 2499 : planId === 'pro' ? 699 : 299,
      autoRenew: false,
      updatedAt: new Date().toISOString()
    };
    saveLocalSubscriptions(localSubs);
    await refreshData();
    return { success: true };
  };

  const cancelUserSubscription = async (email: string) => {
    const formattedEmail = email.toLowerCase().trim();
    const res = await api.post('/api/subscription/cancel', { email: formattedEmail }, { showToastOnError: false });
    if (res.ok && res.data?.success) {
      await refreshData();
      return { success: true };
    }

    const localSubs = getLocalSubscriptions();
    if (localSubs[formattedEmail]) {
      localSubs[formattedEmail].status = 'Free';
      saveLocalSubscriptions(localSubs);
    }
    await refreshData();
    return { success: true };
  };

  const toggleAutoRenew = async (autoRenew: boolean) => {
    const res = await api.post(
      '/api/subscription/toggle-auto-renew',
      {
        email: userEmail,
        autoRenew
      },
      { showToastOnError: false }
    );

    if (res.ok && res.data?.success) {
      setSubscription((prev) => ({ ...prev, autoRenew }));
      await refreshData();
      return { success: true, message: res.data.message };
    }

    const emailLower = userEmail.toLowerCase().trim();
    const localSubs = getLocalSubscriptions();
    if (localSubs[emailLower]) {
      localSubs[emailLower].autoRenew = autoRenew;
      saveLocalSubscriptions(localSubs);
    }
    setSubscription((prev) => ({ ...prev, autoRenew }));
    return { success: true, message: 'Auto-renew preference updated.' };
  };

  return (
    <SubscriptionContext.Provider
      value={{
        userEmail,
        setUserEmail,
        subscription,
        payments,
        stats,
        loading,
        selectedPlanForCheckout,
        setSelectedPlanForCheckout,
        isToolUnlocked,
        getRemainingDays,
        submitPayment,
        approvePayment,
        rejectPayment,
        activateUserSubscription,
        cancelUserSubscription,
        toggleAutoRenew,
        refreshData,
        isAdmin,
        setIsAdmin: handleSetIsAdmin
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
