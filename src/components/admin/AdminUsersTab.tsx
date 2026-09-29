import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShieldCheck, 
  UserCheck, 
  Plus, 
  Lock, 
  Trash2, 
  Copy, 
  Check, 
  Mail, 
  User, 
  X, 
  Shield, 
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AdminUser } from '../../types/cms';

const AVAILABLE_PERMISSIONS = [
  'All Permissions',
  'Products',
  'Categories',
  'Orders',
  'Customers',
  'Coupons',
  'Homepage Builder',
  'Media Library',
  'SEO & Theme Settings',
  'System Management'
];

const DEFAULT_ROLE_PERMISSIONS: Record<AdminUser['role'], string[]> = {
  'Super Admin': ['All Permissions', 'System Management', 'Database Access', 'User Roles'],
  'Admin': ['Products', 'Categories', 'Orders', 'Customers', 'Coupons', 'SEO & Theme Settings'],
  'Editor': ['Homepage Builder', 'Media Library', 'Categories', 'SEO & Theme Settings'],
  'Product Manager': ['Products', 'Categories', 'Media Library'],
  'Order Manager': ['Orders', 'Customers', 'Coupons'],
  'Marketing Manager': ['Coupons', 'SEO & Theme Settings', 'Homepage Builder']
};

export const AdminUsersTab: React.FC = () => {
  const { adminUsers, addAdminUser, deleteAdminUser } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminUser['role']>('Admin');
  const [password, setPassword] = useState('admin123');
  const [permissions, setPermissions] = useState<string[]>(DEFAULT_ROLE_PERMISSIONS['Admin']);
  const [status, setStatus] = useState<'active' | 'pending'>('active');
  const [formError, setFormError] = useState('');

  const handleRoleChange = (newRole: AdminUser['role']) => {
    setRole(newRole);
    setPermissions(DEFAULT_ROLE_PERMISSIONS[newRole] || ['Products']);
  };

  const togglePermission = (perm: string) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter(p => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  const handleOpenModal = () => {
    setName('');
    setEmail('');
    setRole('Admin');
    setPassword('admin123');
    setPermissions(DEFAULT_ROLE_PERMISSIONS['Admin']);
    setStatus('active');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setFormError('Name is required.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setFormError('Valid email address is required.');
      return;
    }

    if (adminUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      setFormError('An administrator with this email already exists.');
      return;
    }

    addAdminUser({
      name: cleanName,
      email: cleanEmail,
      role,
      password: password.trim() || 'admin123',
      permissions: permissions.length > 0 ? permissions : ['General Access'],
      status,
      lastActive: status === 'active' ? 'Just now' : 'Invitation Sent'
    });

    setIsModalOpen(false);
    setNotification(`Successfully added administrator: ${cleanName} (${cleanEmail})`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDelete = (id: string, userEmail: string, userName: string) => {
    if (userEmail.toLowerCase() === 'lox.bd0.1@gmail.com') {
      alert('The primary Super Admin account (lox.bd0.1@gmail.com) cannot be deleted.');
      return;
    }

    if (window.confirm(`Are you sure you want to remove admin access for ${userName} (${userEmail})?`)) {
      deleteAdminUser(id);
      setNotification(`Removed admin account: ${userName}`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const copyLoginDetails = (user: AdminUser) => {
    const text = `Admin Login Credentials:\nEmail: ${user.email}\nPassword: ${user.password || 'admin123'}\nLogin URL: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="bg-black text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between gap-3 text-xs font-bold border border-gray-800 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-black" />
            <h2 className="text-base font-black text-black">Admin Access Control & Roles</h2>
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Manage admin team members, assign granular permissions, and control dashboard security
          </p>
        </div>

        <button 
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 bg-black text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95"
        >
          <Plus size={16} />
          <span>Invite / Add Admin User</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-black font-black">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase">Total Admins</p>
            <p className="text-xl font-black text-black">{adminUsers.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase">Super Admins</p>
            <p className="text-xl font-black text-black">
              {adminUsers.filter(u => u.role === 'Super Admin').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <KeyRound size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase">Default Password</p>
            <p className="text-xs font-mono font-bold text-gray-800">admin123</p>
          </div>
        </div>
      </div>

      {/* Admin Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400 uppercase font-extrabold tracking-wider">
                <th className="py-4 px-5">User</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Permissions</th>
                <th className="py-4 px-4">Last Active</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {adminUsers.map((user) => {
                const isSuperAdminEmail = user.email.toLowerCase() === 'lox.bd0.1@gmail.com';
                return (
                  <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-black text-white flex items-center justify-center text-[11px] font-black shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user.name ? user.name.substring(0, 2).toUpperCase() : 'AD'
                          )}
                        </div>
                        <div>
                          <p className="font-extrabold text-black text-xs flex items-center gap-1.5">
                            {user.name}
                            {isSuperAdminEmail && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                                Primary
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-gray-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center text-[10px] font-black px-2.5 py-1 rounded-md uppercase font-mono ${
                        user.role === 'Super Admin'
                          ? 'bg-black text-white'
                          : user.role === 'Admin'
                          ? 'bg-indigo-100 text-indigo-800'
                          : user.role === 'Product Manager'
                          ? 'bg-emerald-100 text-emerald-800'
                          : user.role === 'Order Manager'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(user.permissions) && user.permissions.length > 0 ? (
                          user.permissions.slice(0, 3).map((perm, i) => (
                            <span key={i} className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded">
                              {perm}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-[11px]">All Standard</span>
                        )}
                        {Array.isArray(user.permissions) && user.permissions.length > 3 && (
                          <span className="text-[10px] font-bold text-gray-400 self-center">
                            +{user.permissions.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-gray-400 font-mono text-[11px] whitespace-nowrap">
                      {user.lastActive || 'Recently'}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                        user.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'pending' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        {user.status === 'pending' ? 'Pending' : 'Active'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => copyLoginDetails(user)}
                          title="Copy login details"
                          className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                          {copiedId === user.id ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                        </button>

                        {!isSuperAdminEmail && (
                          <button
                            onClick={() => handleDelete(user.id, user.email, user.name)}
                            title="Remove admin"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite / Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-black">Invite / Add Admin User</h3>
                  <p className="text-[11px] text-gray-400 font-semibold">Grant administrative dashboard permissions</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-700 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-200">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:bg-white focus:border-black focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. admin@gymwear.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:bg-white focus:border-black focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">
                  Admin Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value as AdminUser['role'])}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:bg-white focus:border-black focus:outline-none cursor-pointer transition-colors"
                >
                  <option value="Super Admin">Super Admin (Full System & User Control)</option>
                  <option value="Admin">Admin (Full Store & Product Access)</option>
                  <option value="Editor">Editor (Homepage Builder & Media)</option>
                  <option value="Product Manager">Product Manager (Products & Categories)</option>
                  <option value="Order Manager">Order Manager (Orders & Coupons)</option>
                  <option value="Marketing Manager">Marketing Manager (Coupons & SEO)</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">
                  Access Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="e.g. admin123"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-medium focus:bg-white focus:border-black focus:outline-none transition-colors"
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-semibold mt-1">
                  Default is <span className="font-mono font-bold text-gray-600">admin123</span>. User can log in immediately.
                </p>
              </div>

              {/* Permissions Checkboxes */}
              <div>
                <label className="block text-[11px] font-black uppercase text-gray-600 mb-1.5">
                  Granular Permissions
                </label>
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200 max-h-36 overflow-y-auto">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked = permissions.includes(perm);
                    return (
                      <label 
                        key={perm}
                        className="flex items-center gap-2 text-[11px] font-bold text-gray-700 cursor-pointer hover:text-black"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(perm)}
                          className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                        />
                        <span>{perm}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">
                  Account Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={status === 'active'}
                      onChange={() => setStatus('active')}
                      className="text-black focus:ring-black cursor-pointer"
                    />
                    <span>Active Immediately</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="pending"
                      checked={status === 'pending'}
                      onChange={() => setStatus('pending')}
                      className="text-black focus:ring-black cursor-pointer"
                    />
                    <span>Send Invite (Pending)</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl text-xs font-extrabold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white hover:bg-gray-800 rounded-xl text-xs font-black cursor-pointer shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  Add Administrator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
