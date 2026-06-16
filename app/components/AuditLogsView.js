"use client";
import React, { useState, useEffect } from "react";
import { getAuditLogs, saveAuditLogs, getCurrentUser } from "../utils/db";

export default function AuditLogsView() {
  const [currentUser, setCurrentUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setLogs(getAuditLogs());

    const handleDbUpdate = () => {
      setLogs(getAuditLogs());
    };
    window.addEventListener("chhapi_db_update", handleDbUpdate);
    return () => {
      window.removeEventListener("chhapi_db_update", handleDbUpdate);
    };
  }, []);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  if (!currentUser) return null;

  // Only SUPER_ADMIN has access to audit logs
  if (currentUser.role !== "SUPER_ADMIN") {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#070b12] text-zinc-100 min-h-screen">
        <div className="max-w-md w-full bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur-md shadow-2xl text-center space-y-5 animate-[fadeIn_0.2s_ease-out]">
          <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20 shadow-md">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-white">Access Denied</h2>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Your account tier ({currentUser.role.replace("_", " ")}) does not possess authorization to view administrative system audit logs.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all cursor-pointer text-xs"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Filter logs by search term and category
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.mobile.includes(searchTerm);

    let matchesCategory = true;
    if (categoryFilter === "SESSIONS") {
      matchesCategory = log.action.includes("Login") || log.action.includes("Logout");
    } else if (categoryFilter === "FINANCIAL") {
      matchesCategory = log.action.includes("Donation") || log.action.includes("Claim");
    } else if (categoryFilter === "ACCOUNTS") {
      matchesCategory = log.action.includes("User") || log.action.includes("Status");
    }

    return matchesSearch && matchesCategory;
  });

  const handleClearLogs = () => {
    const emptyLogs = [
      {
        id: Date.now(),
        user: { name: currentUser.name, role: currentUser.role, mobile: currentUser.mobile },
        action: "Logs Purged",
        details: "All system activity logs were cleared by the Super Admin.",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
      }
    ];
    setLogs(emptyLogs);
    saveAuditLogs(emptyLogs);
    addToast("All audit logs have been successfully cleared.", "success");
  };

  const getActionBadgeClass = (action) => {
    if (action.includes("Login") || action.includes("Logout")) {
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    }
    if (action.includes("Approved") || action.includes("Initialized")) {
      return "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";
    }
    if (action.includes("Created") || action.includes("Modified")) {
      return "bg-purple-500/10 border-purple-500/20 text-purple-400";
    }
    if (action.includes("Changed") || action.includes("Toggled")) {
      return "bg-amber-500/10 border-amber-500/20 text-amber-400";
    }
    if (action.includes("Deleted") || action.includes("Rejected") || action.includes("Purged")) {
      return "bg-red-500/10 border-red-500/20 text-red-400";
    }
    return "bg-blue-500/10 border-blue-500/20 text-blue-400";
  };

  const getUserBadgeColor = (role) => {
    if (role === "SUPER_ADMIN") return "from-red-500 to-pink-600";
    if (role === "ADMIN") return "from-amber-500 to-rose-600";
    return "from-cyan-500 to-blue-600";
  };

  return (
    <div className="flex-1 p-6 lg:p-10 bg-[#070b12] text-zinc-100 min-h-screen relative overflow-y-auto">
      
      {/* Toast Notifications */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-slide-in-right ${
              toast.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-200"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
            }`}
          >
            <div className="mr-3">
              <span className={`w-2 h-2 rounded-full ${toast.type === "error" ? "bg-red-400" : "bg-emerald-400 animate-pulse"}`}></span>
            </div>
            <div className="text-sm font-medium">{toast.message}</div>
          </div>
        ))}
      </div>

      {/* Background Glows */}
      <div className="absolute top-[-5%] right-[-10%] w-[35%] h-[35%] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-red-500/5 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 relative">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">System Audit Logs</h1>
          <p className="text-zinc-400 mt-2 text-sm">Monitor system transactions, login sessions, user setting edits, and administrative operations.</p>
        </div>
        <button
          onClick={handleClearLogs}
          className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-5 py-3 rounded-2xl transition-all duration-200 cursor-pointer shadow-lg shadow-red-600/20 flex items-center gap-2 hover:shadow-red-600/40"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9 9m6.9-3-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          Purge History
        </button>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 z-10 relative">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search logs by user name, action category, or operation details..."
            className="w-full bg-[#111928]/40 border border-zinc-800/80 rounded-2xl py-3.5 pl-12 pr-10 text-white placeholder-zinc-500 focus:outline-none focus:border-primary-accent focus:ring-4 focus:ring-primary-accent/15 transition-all text-sm"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-4 flex items-center text-zinc-500 hover:text-white cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="relative w-full md:w-56">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-[#111928]/40 border border-zinc-800/80 rounded-2xl py-3.5 pl-4 pr-10 text-white appearance-none focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
          >
            <option value="ALL" className="bg-[#0f172a]">All Activities</option>
            <option value="SESSIONS" className="bg-[#0f172a]">Sessions (Login/Logout)</option>
            <option value="FINANCIAL" className="bg-[#0f172a]">Financial (Donations)</option>
            <option value="ACCOUNTS" className="bg-[#0f172a]">Accounts (Registrations)</option>
          </select>
          <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500 pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#111928]/20 border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl z-10 relative backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#111928]/50 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-5 px-6">User / Operator</th>
                <th className="py-5 px-6">Event / Action</th>
                <th className="py-5 px-6">Activity Details</th>
                <th className="py-5 px-6 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-sm">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getUserBadgeColor(log.user.role)} flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-inner`}>
                          {log.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{log.user.name}</span>
                          <span className="text-[10px] text-zinc-500 font-mono mt-0.5">{log.user.role.replace("_", " ")}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4.5 px-6">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shadow-sm ${getActionBadgeClass(log.action)}`}>
                        {log.action}
                      </span>
                    </td>

                    <td className="py-4.5 px-6 max-w-md">
                      <span className="text-zinc-300 font-medium break-words leading-relaxed">{log.details}</span>
                    </td>

                    <td className="py-4.5 px-6 text-right">
                      <div className="flex flex-col text-right">
                        <span className="font-semibold text-zinc-300 text-xs">{log.date}</span>
                        <span className="text-[10px] text-zinc-550 font-mono mt-0.5">{log.time}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-zinc-500">
                    <span>No system activities recorded for search filters.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
