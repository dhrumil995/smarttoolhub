import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  RefreshCw,
  UserCheck,
  UserX,
  ShieldAlert,
  KeyRound,
  Trash2,
  Crown,
  Lock,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Download,
  Filter,
  UserPlus,
  X,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { toast } from '../../utils/toast';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
  subscription?: {
    planId: string;
    planName: string;
    status: string;
    expiryDate: string;
  };
  totalPaymentsCount: number;
  totalAmountSpent: number;
}

export const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [resetPassEmail, setResetPassEmail] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const [editSubEmail, setEditSubEmail] = useState<string | null>(null);
  const [editSubPlan, setEditSubPlan] = useState('pro');
  const [editSubDays, setEditSubDays] = useState(30);

  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState<string | null>(null);

  // Form State for Add User
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<'user' | 'admin'>('user');
  const [newUserPlan, setNewUserPlan] = useState('free');
  const [addingUser, setAddingUser] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        toast.error('Failed to load users list');
      }
    } catch (e) {
      console.error('Failed to fetch users:', e);
      toast.error('Server error while loading users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered logic with complete defensive guarding
  const safeUsers = Array.isArray(users) ? users : [];
  const filteredUsers = safeUsers.filter((u) => {
    if (!u) return false;
    const query = searchQuery.toLowerCase().trim();
    const userName = (u.name || '').toLowerCase();
    const userEmail = (u.email || '').toLowerCase();
    const userPhone = u.phone || '';
    const planName = (u.subscription?.planName || '').toLowerCase();

    const matchesQuery =
      !query ||
      userName.includes(query) ||
      userEmail.includes(query) ||
      userPhone.includes(query) ||
      planName.includes(query);

    const userRole = (u.role || 'user').toLowerCase();
    const matchesRole =
      roleFilter === 'All' || userRole === roleFilter.toLowerCase();

    const userStatus = (u.status || 'active').toLowerCase();
    const matchesStatus =
      statusFilter === 'All' || userStatus === statusFilter.toLowerCase();

    return matchesQuery && matchesRole && matchesStatus;
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword) {
      toast.error('Please enter name, email and password.');
      return;
    }

    setAddingUser(true);
    try {
      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          phone: newUserPhone,
          role: newUserRole,
          planId: newUserPlan
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`User account for ${newUserEmail} created!`);
        setShowAddUserModal(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserPhone('');
        setNewUserRole('user');
        setNewUserPlan('free');
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to create user');
      }
    } catch (e) {
      toast.error('Error creating user');
    } finally {
      setAddingUser(false);
    }
  };

  const handleToggleRole = async (email: string, currentRole: 'admin' | 'user') => {
    const targetRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(email)}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`User role changed to ${targetRole.toUpperCase()}`);
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to update role');
      }
    } catch (e) {
      toast.error('Error updating role');
    }
  };

  const handleToggleStatus = async (email: string, currentStatus: 'active' | 'blocked') => {
    const targetStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(email)}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Account status changed to ${targetStatus.toUpperCase()}`);
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (e) {
      toast.error('Error updating status');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPassEmail || !newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(resetPassEmail)}/reset-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Password reset for ${resetPassEmail}`);
        setResetPassEmail(null);
        setNewPassword('');
      } else {
        toast.error(data.error || 'Failed to reset password');
      }
    } catch (e) {
      toast.error('Error resetting password');
    }
  };

  const handleGrantSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSubEmail) return;

    try {
      const res = await fetch('/api/subscription/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editSubEmail,
          planId: editSubPlan,
          planName: `${editSubPlan.toUpperCase()} Plan`,
          durationDays: editSubDays
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Subscription updated for ${editSubEmail}`);
        setEditSubEmail(null);
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to update subscription');
      }
    } catch (e) {
      toast.error('Error updating subscription');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmEmail) return;
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(deleteConfirmEmail)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`User ${deleteConfirmEmail} deleted`);
        setDeleteConfirmEmail(null);
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to delete user');
      }
    } catch (e) {
      toast.error('Error deleting user');
    }
  };

  const handleExportCSV = () => {
    if (users.length === 0) {
      toast.error('No users to export');
      return;
    }
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Plan', 'Total Spent (₹)', 'Joined Date'];
    const rows = users.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.phone || '',
      u.role,
      u.status,
      u.subscription?.planName || 'Free',
      u.totalAmountSpent || 0,
      u.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smarttoolhub_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return 'N/A';
    try {
      return new Date(isoStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <UserCheck className="text-blue-600 dark:text-blue-400" size={22} />
              <span>User Accounts Management</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage accounts, adjust privileges, grant subscriptions, and enforce security policies.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <UserPlus size={15} />
              <span>Add New User</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={fetchUsers}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
              title="Refresh User List"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, Email, Phone, Plan..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Role:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl w-full border border-slate-200 dark:border-slate-800">
              {['All', 'Admin', 'User'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    roleFilter === r
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Status:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl w-full border border-slate-200 dark:border-slate-800">
              {['All', 'Active', 'Blocked'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    statusFilter === s
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-3 px-3">User Details</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Account Status</th>
                  <th className="py-3 px-3">Active Subscription</th>
                  <th className="py-3 px-3">Joined Date</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`}
                          alt={u.name}
                          className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 dark:border-slate-700 object-cover"
                        />
                        <div>
                          <strong className="block text-slate-900 dark:text-white text-xs font-bold">
                            {u.name}
                          </strong>
                          <span className="text-slate-500 text-[11px] block">{u.email}</span>
                          {u.phone && <span className="text-slate-400 text-[10px] block">{u.phone}</span>}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleToggleRole(u.email, u.role)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase cursor-pointer border transition-all ${
                          u.role === 'admin'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                        }`}
                        title="Click to toggle role"
                      >
                        {u.role === 'admin' ? <Crown size={10} /> : null}
                        <span>{u.role}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleToggleStatus(u.email, u.status)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase cursor-pointer border transition-all ${
                          u.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/20'
                        }`}
                        title="Click to toggle account status"
                      >
                        {u.status === 'active' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        <span>{u.status}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                          {u.subscription?.planName || 'Free Plan'}
                        </span>
                        <button
                          onClick={() => {
                            setEditSubEmail(u.email);
                            setEditSubPlan(u.subscription?.planId || 'pro');
                          }}
                          className="text-blue-600 hover:text-blue-500 text-[10px] underline font-semibold cursor-pointer"
                        >
                          Modify
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Spent: ₹{u.totalAmountSpent} ({u.totalPaymentsCount} orders)
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                      {formatDate(u.createdAt)}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setResetPassEmail(u.email)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound size={14} />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmEmail(u.email)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete User Account"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            No user accounts found matching query.
          </div>
        )}
      </div>

      {/* Modal 1: Add New User */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
                <UserPlus size={20} className="text-blue-600" />
                <span>Add User Account</span>
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password *</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone (Optional)</label>
                  <input
                    type="text"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Account Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as 'user' | 'admin')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Initial Subscription Plan</label>
                <select
                  value={newUserPlan}
                  onChange={(e) => setNewUserPlan(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="free">Free Plan (Default)</option>
                  <option value="starter">Starter Plan (₹299/mo)</option>
                  <option value="pro">Pro Plan (₹999/mo)</option>
                  <option value="business">Business Plan (₹2,999/mo)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingUser}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md transition-colors"
                >
                  {addingUser ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Reset Password */}
      {resetPassEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-2">
                <KeyRound size={16} className="text-amber-500" />
                <span>Reset User Password</span>
              </h3>
              <button onClick={() => setResetPassEmail(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Set new password for <strong className="text-slate-900 dark:text-white">{resetPassEmail}</strong>.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetPassEmail(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Modify Subscription */}
      {editSubEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-2">
                <Crown size={16} className="text-blue-500" />
                <span>Grant / Modify Subscription</span>
              </h3>
              <button onClick={() => setEditSubEmail(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              User: <strong className="text-slate-900 dark:text-white">{editSubEmail}</strong>
            </p>

            <form onSubmit={handleGrantSub} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Plan Tier</label>
                <select
                  value={editSubPlan}
                  onChange={(e) => setEditSubPlan(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="starter">Starter Plan (₹299/mo)</option>
                  <option value="pro">Pro Plan (₹999/mo)</option>
                  <option value="business">Business Plan (₹2,999/mo)</option>
                  <option value="free">Free Plan (Demote)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Duration (Days)</label>
                <select
                  value={editSubDays}
                  onChange={(e) => setEditSubDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={7}>7 Days Trial</option>
                  <option value={30}>30 Days (1 Month)</option>
                  <option value={90}>90 Days (3 Months)</option>
                  <option value={365}>365 Days (1 Year)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditSubEmail(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Apply Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Delete Confirmation */}
      {deleteConfirmEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-600 font-bold">
              <ShieldAlert size={20} />
              <span>Confirm Account Deletion</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Are you sure you want to permanently delete account <strong className="text-slate-900 dark:text-white">{deleteConfirmEmail}</strong>? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmEmail(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
