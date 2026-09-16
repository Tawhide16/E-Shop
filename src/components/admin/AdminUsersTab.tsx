import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, UserCheck, Plus, Lock } from 'lucide-react';

export const AdminUsersTab: React.FC = () => {
  const { adminUsers } = useStore();

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-black">Admin Access Control & Roles</h2>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">Manage team permissions, role hierarchy, and audit security</p>
        </div>

        <button 
          onClick={() => alert('Invite administrator link generated!')}
          className="flex items-center gap-1.5 bg-black text-white text-xs font-extrabold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer shadow-md"
        >
          <Plus size={16} />
          <span>Invite Admin User</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-extrabold">
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Permissions</th>
              <th className="py-3.5 px-4">Last Active</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {adminUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-3.5 px-4">
                  <p className="font-bold text-black text-xs">{user.name}</p>
                  <p className="text-[10px] text-gray-400">{user.email}</p>
                </td>
                <td className="py-3.5 px-4">
                  <span className="bg-black text-white text-[10px] font-black px-2 py-0.5 rounded uppercase font-mono">
                    {user.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-gray-600 font-bold">
                  {Array.isArray(user.permissions) ? user.permissions.join(', ') : String(user.permissions || '')}
                </td>
                <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">{user.lastActive}</td>
                <td className="py-3.5 px-4">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
