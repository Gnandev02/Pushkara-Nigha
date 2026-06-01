"use client";

import { useState, useEffect } from "react";
import { Users, Shield, UserPlus, MoreVertical, CheckCircle, Clock } from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "supervisor", district: "East Godavari" });

  useEffect(() => {
    const saved = localStorage.getItem("app_users");
    if (saved) {
      try {
        setUsers(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("app_users", JSON.stringify(users));
    }
  }, [users, isLoaded]);

  const addUser = (e) => {
    e.preventDefault();
    setUsers(prev => [...prev, {
      id: Date.now(), ...form, status: "active", lastLogin: "Never"
    }]);
    setForm({ name: "", email: "", role: "supervisor", district: "East Godavari" });
    setShowForm(false);
  };

  const activeCount = users.filter(u => u.status === "active").length;
  const adminCount = users.filter(u => u.role === "admin").length;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="gov-header-card">
        <div>
          <span className="gov-header-subtitle">COMMAND SUPERVISOR MANAGEMENT</span>
          <h1 className="gov-header-title">User Management & Access Control</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-lg transition-all hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, #0B6B53, #0D9488)" }}
        >
          <UserPlus style={{ width: 15, height: 15 }} />
          Add User
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Operators", value: users.length, icon: Users, color: "#0B6B53" },
          { label: "Active Sessions", value: activeCount, icon: CheckCircle, color: "#059669" },
          { label: "Admin Accounts", value: adminCount, icon: Shield, color: "#0D9488" },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="dashboard-card flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${card.color}14` }}>
                <Icon style={{ width: 20, height: 20, color: card.color }} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-extrabold text-slate-900 font-mono">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add User Form */}
      {showForm && (
        <div className="dashboard-card">
          <h3 className="card-heading mb-4">Add New Operator</h3>
          <form onSubmit={addUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Operator name"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
              <input
                required type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="operator@iccc.gov.in"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role</label>
              <select
                value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-[#0D9488]"
              >
                <option value="supervisor">Command Supervisor</option>
                <option value="admin">System Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">District</label>
              <select
                value={form.district}
                onChange={e => setForm(p => ({ ...p, district: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:border-[#0D9488]"
              >
                <option value="All Districts">All Districts</option>
                <option value="East Godavari">East Godavari</option>
                <option value="West Godavari">West Godavari</option>
                <option value="Khammam">Khammam</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white rounded-lg" style={{ background: "#0B6B53" }}>
                Add Operator
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 text-sm font-semibold text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="dashboard-card p-0 overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #F1F5F9" }}>
          <h3 className="card-heading">Registered Operators</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="surveillance-cyber-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>District</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id}>
                  <td className="text-slate-400 font-mono text-xs">{String(i + 1).padStart(2, "0")}</td>
                  <td className="font-bold text-slate-800">{user.name}</td>
                  <td className="text-slate-500 text-xs font-mono">{user.email}</td>
                  <td>
                    <span className={`table-risk-badge ${user.role === "admin" ? "busy" : "safe"}`}>
                      {user.role === "admin" ? "🛡️ Admin" : "👁️ Supervisor"}
                    </span>
                  </td>
                  <td className="text-slate-500">{user.district}</td>
                  <td>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${user.status === "active" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-400"}`}>
                      {user.status === "active" ? <CheckCircle style={{ width: 10, height: 10 }} /> : <Clock style={{ width: 10, height: 10 }} />}
                      {user.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-slate-400 text-[11px] font-mono">{user.lastLogin}</td>
                  <td>
                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors">
                      <MoreVertical style={{ width: 15, height: 15 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
