"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, UserPlus, Check, X, AlertTriangle, UserCheck, UserX } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  approved: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // New User Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("operator");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.status === 403 || res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      setError("Failed to fetch users. Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role: newRole,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers([data.user, ...users]);
        setShowAddForm(false);
        setNewName("");
        setNewEmail("");
        setNewPassword("");
        setNewRole("operator");
      } else {
        setError(data.error || "Failed to create user");
      }
    } catch (err) {
      setError("Failed to create user. Network error.");
    }
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: !currentStatus }),
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, approved: !currentStatus } : u));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update user");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const changeRole = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update role");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading User Management...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto text-slate-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="text-blue-500" /> 
            User Management Panel
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Admin-only operational access control.
          </p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <UserPlus size={16} />
          {showAddForm ? "Cancel" : "Add Authorized User"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded mb-6 flex items-center gap-2">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">Create New Official Account</h2>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <input 
                type="text" required value={newName} onChange={e => setNewName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Officer Name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Official Email (@gov.in)</label>
              <input 
                type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="officer@police.gov.in"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Initial Password</label>
              <input 
                type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Secure Password"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Role</label>
              <select 
                value={newRole} onChange={e => setNewRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="admin">Admin (Full Access)</option>
                <option value="police">Police Officer (Monitoring)</option>
                <option value="supervisor">Supervisor (Crowd Mgmt)</option>
                <option value="operator">ICCC Operator (Camera Feeds)</option>
                <option value="analytics">Analytics Team (Reports)</option>
              </select>
            </div>
            <div className="md:col-span-2 pt-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded text-sm font-medium transition-colors">
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">User Official</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-200">{user.name}</div>
                  <div className="text-slate-500 text-xs">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={user.role} 
                    onChange={e => changeRole(user.id, e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none text-slate-300"
                  >
                    <option value="admin">Admin</option>
                    <option value="police">Police</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="operator">Operator</option>
                    <option value="analytics">Analytics</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleApproval(user.id, user.approved)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      user.approved 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                    } transition-colors`}
                  >
                    {user.approved ? <UserCheck size={14} /> : <UserX size={14} />}
                    {user.approved ? "Approved" : "Pending"}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-xs text-slate-500">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
