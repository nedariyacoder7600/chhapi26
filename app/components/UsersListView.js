"use client";

import React, { useState, useEffect } from "react";
import { getUsers, saveUsers, getCurrentUser, addAuditLog } from "../utils/db";

export default function UsersListView() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [creatorFilter, setCreatorFilter] = useState("ALL");
  const [toasts, setToasts] = useState([]);

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null); // For viewing profile
  const [deleteUserId, setDeleteUserId] = useState(null); // For confirming delete
  const [isAddUserOpen, setIsAddUserOpen] = useState(false); // Quick add user
  const [editingUser, setEditingUser] = useState(null); // For editing user

  // Form states for new user
  const [newUserName, setNewUserName] = useState("");
  const [newUserMobile, setNewUserMobile] = useState("");
  const [newUserRole, setNewUserRole] = useState("USER");
  const [newWhatsappGroup, setNewWhatsappGroup] = useState("");
  const [newAlreadyJoined, setNewAlreadyJoined] = useState(false);

  // Form states for editing user
  const [editUserName, setEditUserName] = useState("");
  const [editUserMobile, setEditUserMobile] = useState("");
  const [editUserRole, setEditUserRole] = useState("USER");
  const [editUserDonations, setEditUserDonations] = useState(0);
  const [editUserWhatsappGroup, setEditUserWhatsappGroup] = useState("");
  const [editAlreadyJoined, setEditAlreadyJoined] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setUsers(getUsers());

    const handleDbUpdate = () => {
      setUsers(getUsers());
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
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  if (!currentUser) return null;

  // USER role has NO access to users list
  if (currentUser.role === "USER") {
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
            Your account tier (Regular Contributor) does not possess permission to inspect the user registrations database.
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

  const isSuperAdmin = currentUser.role === "SUPER_ADMIN";

  // Calculations for stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const totalDonationsSum = users.reduce((sum, u) => sum + u.donations, 0);

  const creatorsList = ["ALL", ...new Set(users.map(u => u.addedBy || "System"))];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile.includes(searchTerm);
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const userCreator = user.addedBy || "System";
    const matchesCreator = creatorFilter === "ALL" || userCreator === creatorFilter;
    return matchesSearch && matchesRole && matchesCreator;
  });

  const toggleStatus = (id, name, userRole) => {
    // Admins cannot change statuses of Admins or Super Admins
    if (!isSuperAdmin && (userRole === "ADMIN" || userRole === "SUPER_ADMIN")) {
      addToast("Failed: You cannot toggle the status of administrative accounts.", "error");
      return;
    }

    const targetUser = users.find((u) => u.id === id);
    const nextStatus = targetUser.status === "Active" ? "Inactive" : "Active";
    const updated = users.map((user) => {
      if (user.id === id) {
        addToast(`Status of ${name} updated to ${nextStatus}`, "success");
        return { ...user, status: nextStatus };
      }
      return user;
    });
    setUsers(updated);
    saveUsers(updated);
    addAuditLog("Status Changed", `Toggled status of ${name} (+91 ${targetUser.mobile}) to ${nextStatus}`);
  };

  const confirmDelete = (id) => {
    const target = users.find((u) => u.id === id);
    if (!isSuperAdmin && (target.role === "ADMIN" || target.role === "SUPER_ADMIN")) {
      addToast("Failed: Administrative accounts can only be removed by a Super Admin.", "error");
      setDeleteUserId(null);
      return;
    }

    const updated = users.filter((user) => user.id !== id);
    setUsers(updated);
    saveUsers(updated);
    addAuditLog("User Deleted", `Removed user account for ${target.name} (+91 ${target.mobile})`);
    addToast(`User ${target.name} has been removed.`, "error");
    setDeleteUserId(null);
  };

  const handleAddNewUser = (e) => {
    e.preventDefault();
    if (!newUserName) {
      addToast("Please enter a name.", "error");
      return;
    }
    if (!newUserMobile || newUserMobile.length !== 10) {
      addToast("Please enter a valid 10-digit mobile number.", "error");
      return;
    }

    // Admins cannot create ADMIN or SUPER_ADMIN
    if (!isSuperAdmin && newUserRole !== "USER") {
      addToast("Failed: Admins can only register Regular Contributors.", "error");
      return;
    }

    const gradients = [
      "from-violet-600 to-indigo-600",
      "from-amber-500 to-rose-600",
      "from-red-500 to-pink-600",
      "from-emerald-400 to-teal-700",
      "from-cyan-500 to-blue-600",
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const newUserObj = {
      id: Date.now(),
      name: newUserName,
      mobile: newUserMobile,
      password: "123456", // Default password
      role: newUserRole,
      status: "Active",
      joined: new Date().toISOString().split("T")[0],
      donations: 0,
      color: randomGradient,
      addedBy: currentUser.name || "System",
      whatsappGroup: newWhatsappGroup || "https://chat.whatsapp.com/G2EHonNxcjoBwtygpTmCg4",
      whatsappJoined: newAlreadyJoined,
    };

    const updated = [newUserObj, ...users];
    setUsers(updated);
    saveUsers(updated);
    addAuditLog("User Created", `Registered new user ${newUserName} (+91 ${newUserMobile}) as ${newUserRole}`);
    addToast(`User ${newUserName} added successfully!`, "success");

    setNewUserRole("USER");
    setNewWhatsappGroup("");
    setNewAlreadyJoined(false);
    setIsAddUserOpen(false);
  };

  const startEditing = (user) => {
    if (!isSuperAdmin && (user.role === "ADMIN" || user.role === "SUPER_ADMIN")) {
      addToast("Failed: Administrative accounts can only be edited by a Super Admin.", "error");
      return;
    }
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserMobile(user.mobile);
    setEditUserRole(user.role);
    setEditUserDonations(user.donations);
    setEditUserWhatsappGroup(user.whatsappGroup || "");
    setEditAlreadyJoined(!!user.whatsappJoined);
  };

  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!editUserName) {
      addToast("Please enter a name.", "error");
      return;
    }
    if (!editUserMobile || editUserMobile.length !== 10) {
      addToast("Please enter a valid 10-digit mobile number.", "error");
      return;
    }

    // Admins cannot change roles to ADMIN or SUPER_ADMIN
    if (!isSuperAdmin && editUserRole !== "USER") {
      addToast("Failed: Admins can only assign Regular Contributor roles.", "error");
      return;
    }

    const updated = users.map((user) => {
      if (user.id === editingUser.id) {
        return {
          ...user,
          name: editUserName,
          mobile: editUserMobile,
          role: editUserRole,
          donations: Number(editUserDonations),
          whatsappGroup: editUserWhatsappGroup || "https://chat.whatsapp.com/G2EHonNxcjoBwtygpTmCg4",
          whatsappJoined: editAlreadyJoined,
        };
      }
      return user;
    });

    setUsers(updated);
    saveUsers(updated);
    addAuditLog("User Modified", `Updated parameters and settings for ${editUserName} (+91 ${editUserMobile})`);
    addToast(`User ${editUserName} updated successfully!`, "success");
    setEditingUser(null);
  };

  return (
    <div className="flex-1 p-6 lg:p-10 bg-[#070b12] text-zinc-100 min-h-screen relative overflow-y-auto">
      {/* Toast Container */}
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
              {toast.type === "error" ? (
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="text-sm font-medium">{toast.message}</div>
          </div>
        ))}
      </div>

      {/* Background decorations */}
      <div className="absolute top-[-5%] right-[-10%] w-[35%] h-[35%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-primary-accent/5 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 relative">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">Users Registry</h1>
          <p className="text-zinc-400 mt-2 text-sm">Review register entries, adjust administrative roles, and inspect contributors.</p>
        </div>
        <button
          onClick={() => setIsAddUserOpen(true)}
          style={{ backgroundColor: "var(--primary-accent)" }}
          className="text-white text-sm font-bold px-5 py-3 rounded-2xl hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg shadow-primary-accent/20 flex items-center gap-2 hover:shadow-primary-accent/45"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add New User
        </button>
      </header>

      {/* Stat Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 z-10 relative">
        {/* Card 1: Total Registries */}
        <div className="bg-gradient-to-br from-[#0e1325]/90 to-[#080c16]/95 border border-cyan-500/35 rounded-[24px] p-5 min-h-[140px] h-auto relative backdrop-blur-xl flex flex-col justify-between overflow-hidden group hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-500 shadow-2xl">
          <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-500" />
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600 shadow-[0_0_12px_#06b6d4] opacity-90" />
          
          <div className="space-y-2.5 min-w-0 w-full z-10 flex flex-col justify-between flex-1">
            <div className="flex justify-between items-start gap-3 w-full">
              <div className="min-w-0 flex-1 pt-1.5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">Total Registries</span>
              </div>
              <div className="w-12 h-12 rounded-[16px] border border-cyan-500/30 flex items-center justify-center bg-[#0d1222]/80 shadow-[0_0_15px_rgba(6,182,212,0.15)] shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300">
                <div className="w-8 h-8 rounded-full border border-cyan-500/60 flex items-center justify-center bg-transparent">
                  <svg className="w-4.5 h-4.5 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full">
              <span className="text-3xl font-extrabold text-cyan-400 block tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.2)] group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300">{totalUsers}</span>
            </div>
            <div className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1 w-full">
              <span>System registry entries</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Accounts */}
        <div className="bg-gradient-to-br from-[#0e1325]/90 to-[#080c16]/95 border border-emerald-500/35 rounded-[24px] p-5 min-h-[140px] h-auto relative backdrop-blur-xl flex flex-col justify-between overflow-hidden group hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-500 shadow-2xl">
          <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-500" />
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 shadow-[0_0_12px_#10b981] opacity-90" />
          
          <div className="space-y-2.5 min-w-0 w-full z-10 flex flex-col justify-between flex-1">
            <div className="flex justify-between items-start gap-3 w-full">
              <div className="min-w-0 flex-1 pt-1.5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">Active Accounts</span>
              </div>
              <div className="w-12 h-12 rounded-[16px] border border-emerald-500/30 flex items-center justify-center bg-[#0d1222]/80 shadow-[0_0_15px_rgba(16,185,129,0.15)] shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300">
                <div className="w-8 h-8 rounded-full border border-emerald-500/60 flex items-center justify-center bg-transparent">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
                </div>
              </div>
            </div>
            <div className="w-full">
              <span className="text-3xl font-extrabold text-emerald-400 block tracking-tight drop-shadow-[0_0_8px_rgba(16,185,129,0.2)] group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300">{activeUsers}</span>
            </div>
            <div className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1 w-full">
              <span>Currently active sessions</span>
            </div>
          </div>
        </div>

        {/* Card 3: Administrators */}
        <div className="bg-gradient-to-br from-[#0e1325]/90 to-[#080c16]/95 border border-purple-500/35 rounded-[24px] p-5 min-h-[140px] h-auto relative backdrop-blur-xl flex flex-col justify-between overflow-hidden group hover:border-purple-400 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-500 shadow-2xl">
          <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-purple-500/10 blur-2xl pointer-events-none group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-500" />
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 shadow-[0_0_12px_#8b5cf6] opacity-90" />
          
          <div className="space-y-2.5 min-w-0 w-full z-10 flex flex-col justify-between flex-1">
            <div className="flex justify-between items-start gap-3 w-full">
              <div className="min-w-0 flex-1 pt-1.5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">Administrators</span>
              </div>
              <div className="w-12 h-12 rounded-[16px] border border-purple-500/30 flex items-center justify-center bg-[#0d1222]/80 shadow-[0_0_15px_rgba(139,92,246,0.15)] shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:border-purple-500/50 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300">
                <div className="w-8 h-8 rounded-full border border-purple-500/60 flex items-center justify-center bg-transparent">
                  <svg className="w-4.5 h-4.5 text-purple-400 drop-shadow-[0_0_6px_rgba(139,92,246,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full">
              <span className="text-3xl font-extrabold text-purple-400 block tracking-tight drop-shadow-[0_0_8px_rgba(139,92,246,0.2)] group-hover:text-purple-300 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300">
                {users.filter(u => u.role.includes("ADMIN")).length}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1 w-full">
              <span>System administrative tier</span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Contributed */}
        <div className="bg-gradient-to-br from-[#0e1325]/90 to-[#080c16]/95 border border-amber-500/35 rounded-[24px] p-5 min-h-[140px] h-auto relative backdrop-blur-xl flex flex-col justify-between overflow-hidden group hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-500 shadow-2xl">
          <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-amber-500/10 blur-2xl pointer-events-none group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-500" />
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 shadow-[0_0_12px_#f59e0b] opacity-90" />
          
          <div className="space-y-2.5 min-w-0 w-full z-10 flex flex-col justify-between flex-1">
            <div className="flex justify-between items-start gap-3 w-full">
              <div className="min-w-0 flex-1 pt-1.5">
                <div className="relative group/tooltip inline-block">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block cursor-help">
                    Total Contributed
                  </span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-300 ease-out z-30">
                    <div className="bg-[#0e1325]/95 backdrop-blur-md border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(245,158,11,0.1)] text-[10px] font-extrabold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                      Total Contributed
                    </div>
                    <div className="w-2 h-2 bg-[#0e1325] border-r border-b border-amber-500/30 rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-[5px]"></div>
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 rounded-[16px] border border-amber-500/30 flex items-center justify-center bg-[#0d1222]/80 shadow-[0_0_15px_rgba(245,158,11,0.15)] shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:border-amber-500/50 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300">
                <div className="w-8 h-8 rounded-full border border-amber-500/60 flex items-center justify-center bg-transparent">
                  <span className="text-amber-400 font-black text-lg drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]">$</span>
                </div>
              </div>
            </div>
            <div className="w-full">
              <span className="text-3xl font-extrabold text-amber-400 block tracking-tight drop-shadow-[0_0_8px_rgba(245,158,11,0.2)] group-hover:text-amber-400 group-hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-300">₹{totalDonationsSum.toLocaleString("en-IN")}</span>
            </div>
            <div className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1 w-full">
              <span>Gross collection registry</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 z-10 relative">
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
            placeholder="Search registrations by name or mobile number..."
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

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-48 lg:w-52">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-[#111928]/40 border border-zinc-800/80 rounded-2xl py-3.5 pl-4 pr-10 text-white appearance-none focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
            >
              <option value="ALL" className="bg-[#0f172a]">All System Roles</option>
              <option value="SUPER_ADMIN" className="bg-[#0f172a]">Super Admins</option>
              <option value="ADMIN" className="bg-[#0f172a]">Admins</option>
              <option value="USER" className="bg-[#0f172a]">Regular Contributors</option>
            </select>
            <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500 pointer-events-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>

          <div className="relative w-full sm:w-48 lg:w-52">
            <select
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
              className="w-full bg-[#111928]/40 border border-zinc-800/80 rounded-2xl py-3.5 pl-4 pr-10 text-white appearance-none focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
            >
              <option value="ALL" className="bg-[#0f172a]">All Creators</option>
              {creatorsList.filter(creator => creator !== "ALL").map((creator) => (
                <option key={creator} value={creator} className="bg-[#0f172a]">{creator}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500 pointer-events-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="hidden md:block bg-[#111928]/20 border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl z-10 relative backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#111928]/50 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-5 px-6">User Details</th>
                <th className="py-5 px-6">Assigned Role</th>
                <th className="py-5 px-6">Registered By</th>
                <th className="py-5 px-6">Registry Status</th>
                <th className="py-5 px-6">Total Donated</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${user.color || 'from-zinc-700 to-zinc-800'} flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-inner`}>
                          {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-white group-hover:text-primary-accent transition-colors">{user.name}</span>
                          <span className="text-xs text-zinc-500 font-mono mt-0.5">+91 {user.mobile}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4.5 px-6">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shadow-sm ${
                        user.role === "SUPER_ADMIN" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                        user.role === "ADMIN" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                        "bg-blue-500/10 border-blue-500/20 text-blue-400"
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="py-4.5 px-6">
                      <span className="text-xs text-zinc-400 font-semibold">{user.addedBy || "System"}</span>
                    </td>

                    <td className="py-4.5 px-6">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        user.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-400 animate-pulse" : "bg-zinc-400"}`}></span>
                        {user.status}
                      </span>
                    </td>

                    <td className="py-4.5 px-6">
                      <span className={`font-bold font-mono text-sm ${user.donations > 0 ? "text-amber-400" : "text-zinc-500"}`}>
                        {user.donations > 0 ? `₹${user.donations.toLocaleString("en-IN")}` : "—"}
                      </span>
                    </td>

                    <td className="py-4.5 px-6 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 hover:text-white text-zinc-300 transition-all cursor-pointer border border-transparent"
                          title="View Profile"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        </button>

                        {/* Edit option for authorized users */}
                        {(isSuperAdmin || (user.role === "USER")) && (
                          <button
                            onClick={() => startEditing(user)}
                            className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-all cursor-pointer border border-transparent"
                            title="Edit User"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                          </button>
                        )}
                        
                        {/* Status toggle restriction for ADMIN roles */}
                        {(isSuperAdmin || (user.role === "USER")) && (
                          <button
                            onClick={() => toggleStatus(user.id, user.name, user.role)}
                            className="p-2 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer border border-zinc-800"
                            title="Toggle Status"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-9L21 12m0 0-4.5 4.5M21 12H7.5" />
                            </svg>
                          </button>
                        )}
                        
                        {/* Only SUPER_ADMIN can delete users */}
                        {isSuperAdmin && (
                          <button
                            onClick={() => setDeleteUserId(user.id)}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer border border-transparent"
                            title="Delete User"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9 9m6.9-3-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-zinc-500">
                    <span>No registrations match search filters.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Grid */}
      <div className="md:hidden space-y-4 z-10 relative">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-5 backdrop-blur-md shadow-md flex flex-col justify-between hover:border-zinc-700/50 transition-all group">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${user.color || 'from-zinc-700 to-zinc-800'} flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-inner`}>
                  {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-white text-base leading-tight">{user.name}</span>
                  <span className="text-xs text-zinc-500 font-mono mt-1">+91 {user.mobile}</span>
                </div>
              </div>
              <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full border shadow-sm shrink-0 ${
                user.role === "SUPER_ADMIN" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                user.role === "ADMIN" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                "bg-blue-500/10 border-blue-500/20 text-blue-400"
              }`}>
                {user.role}
              </span>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-800/40 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Total Donated</span>
                <span className={`font-bold font-mono text-sm mt-0.5 block ${user.donations > 0 ? "text-amber-400" : "text-zinc-500"}`}>
                  {user.donations > 0 ? `₹${user.donations.toLocaleString("en-IN")}` : "—"}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Registered By</span>
                <span className="text-xs text-zinc-400 font-semibold mt-0.5 block">{user.addedBy || "System"}</span>
              </div>
              <div className="text-end">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Status</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold mt-0.5 ${user.status === "Active" ? "text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full" : "text-zinc-400 bg-zinc-500/10 px-2 py-0.5 rounded-full"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-400 animate-pulse" : "bg-zinc-400"}`}></span>
                  {user.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2.5 justify-end mt-5 pt-4 border-t border-zinc-800/40">
              <button
                onClick={() => setSelectedUser(user)}
                className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer border border-transparent"
                title="View Profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>
              {(isSuperAdmin || (user.role === "USER")) && (
                <button
                  onClick={() => startEditing(user)}
                  className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-all cursor-pointer border border-transparent"
                  title="Edit User"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                </button>
              )}
              {(isSuperAdmin || (user.role === "USER")) && (
                <button
                  onClick={() => toggleStatus(user.id, user.name, user.role)}
                  className="p-2.5 rounded-xl bg-zinc-800/40 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer border border-zinc-800"
                  title="Toggle Status"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-9L21 12m0 0-4.5 4.5M21 12H7.5" />
                  </svg>
                </button>
              )}
              {isSuperAdmin && (
                <button
                  onClick={() => setDeleteUserId(user.id)}
                  className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer border border-transparent"
                  title="Delete User"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4.5 h-4.5" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9 9m6.9-3-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: VIEW PROFILE */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#111928] border border-zinc-800 rounded-3xl p-6 max-w-lg w-full relative shadow-2xl">
            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="flex flex-col items-center text-center mt-4">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedUser.color || 'from-zinc-700 to-zinc-800'} flex items-center justify-center font-bold text-3xl text-white shadow-xl`}>
                {selectedUser.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <h3 className="text-xl font-bold text-white mt-4">{selectedUser.name}</h3>
              <p className="text-zinc-500 font-mono text-sm mt-1">+91 {selectedUser.mobile}</p>

              <div className="flex gap-3 mt-4">
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                  selectedUser.role === "SUPER_ADMIN" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                  selectedUser.role === "ADMIN" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                  "bg-blue-500/10 border-blue-500/20 text-blue-400"
                }`}>
                  {selectedUser.role}
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-3 py-1 rounded-full ${
                  selectedUser.status === "Active" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-zinc-500/10 border border-zinc-800 text-zinc-400"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedUser.status === "Active" ? "bg-emerald-400" : "bg-zinc-400"}`}></span>
                  {selectedUser.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 bg-[#1e293b]/20 border border-zinc-800/60 rounded-2xl p-4">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Contributions</span>
                <span className="text-base font-bold text-amber-400 block mt-0.5">₹{selectedUser.donations.toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Registered By</span>
                <span className="text-xs font-semibold text-zinc-300 block mt-1 truncate">{selectedUser.addedBy || "System"}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Joined System</span>
                <span className="text-xs font-semibold text-zinc-300 block mt-1">{selectedUser.joined}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Access Privileges</h4>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Add/Modify Donation Entries</li>
                {selectedUser.role !== "USER" && (
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Approve pending receipts</li>
                )}
                {selectedUser.role === "SUPER_ADMIN" ? (
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Full User Access Control & Configurations</li>
                ) : (
                  <li className="flex items-center gap-2 text-zinc-650"><span>✗</span> No System parameter modification access</li>
                )}
              </ul>
            </div>

            <div className="mt-8">
              <button onClick={() => setSelectedUser(null)} className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all cursor-pointer">
                Done / Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM DELETE */}
      {deleteUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#111928] border border-zinc-800 rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-white">Remove Account?</h3>
            <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
              Are you sure you want to delete this user from the local registry? This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteUserId(null)} className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all cursor-pointer text-xs">
                No, Keep
              </button>
              <button onClick={() => confirmDelete(deleteUserId)} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all cursor-pointer text-xs shadow-lg shadow-red-600/20">
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: QUICK ADD USER OVERLAY */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-zinc-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="h-full bg-[#111928] border-l border-zinc-800 max-w-md w-full p-8 shadow-2xl flex flex-col justify-between animate-slide-in-right">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary-accent rounded-full"></span>
                  Quick Register Entry
                </h3>
                <button onClick={() => setIsAddUserOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleAddNewUser} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="e.g. Vikram Rathore"
                    className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3 px-4 text-white placeholder-zinc-650 focus:outline-none focus:border-primary-accent transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={newUserMobile}
                    onChange={(e) => setNewUserMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit mobile number"
                    className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3 px-4 text-white placeholder-zinc-650 focus:outline-none focus:border-primary-accent transition-all text-sm font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Assigned Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
                  >
                    <option value="USER" className="bg-[#0f172a]">USER</option>
                    {isSuperAdmin && (
                      <>
                        <option value="ADMIN" className="bg-[#0f172a]">ADMIN</option>
                        <option value="SUPER_ADMIN" className="bg-[#0f172a]">SUPER_ADMIN</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">WhatsApp Group Link</label>
                  <input
                    type="url"
                    value={newWhatsappGroup}
                    onChange={(e) => setNewWhatsappGroup(e.target.value)}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3 px-4 text-white placeholder-zinc-650 focus:outline-none focus:border-primary-accent transition-all text-sm"
                  />
                </div>

                <div className="flex items-center gap-3 bg-[#111928]/30 border border-zinc-800/60 px-4 py-3 rounded-2xl">
                  <input
                    type="checkbox"
                    id="newAlreadyJoined"
                    checked={newAlreadyJoined}
                    onChange={(e) => setNewAlreadyJoined(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-zinc-800 text-emerald-500 focus:ring-emerald-500/15 bg-[#1e293b]/30 accent-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="newAlreadyJoined" className="text-xs font-bold text-zinc-350 cursor-pointer select-none">
                    Is already in WhatsApp Group
                  </label>
                </div>

                <button
                  type="submit"
                  style={{ backgroundColor: "var(--primary-accent)" }}
                  className="w-full text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition-all duration-200 cursor-pointer shadow-lg mt-4 shadow-primary-accent/10"
                >
                  Create User
                </button>
              </form>
            </div>

            <div className="text-zinc-600 text-xs leading-relaxed">
              * Note: Accounts added via quick registry default to password <code>123456</code> and their status is active upon entry.
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT USER OVERLAY */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#111928] border border-zinc-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800/60">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                Edit User Details
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-zinc-500 hover:text-white cursor-pointer">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-450 uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  required
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-[#1e293b]/30 border border-zinc-800 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-450 uppercase tracking-wider block">Mobile Number</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={editUserMobile}
                  onChange={(e) => setEditUserMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit Mobile Number"
                  className="w-full bg-[#1e293b]/30 border border-zinc-800 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-450 uppercase tracking-wider block">Total Contributions (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={editUserDonations}
                  onChange={(e) => setEditUserDonations(e.target.value)}
                  placeholder="Amount in ₹"
                  className="w-full bg-[#1e293b]/30 border border-zinc-800 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all text-sm font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-450 uppercase tracking-wider block">System Role</label>
                <select
                  value={editUserRole}
                  onChange={(e) => setEditUserRole(e.target.value)}
                  className="w-full bg-[#1e293b]/30 border border-zinc-800 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all text-sm cursor-pointer"
                >
                  <option value="USER" className="bg-[#0f172a]">USER</option>
                  {isSuperAdmin && (
                    <>
                      <option value="ADMIN" className="bg-[#0f172a]">ADMIN</option>
                      <option value="SUPER_ADMIN" className="bg-[#0f172a]">SUPER_ADMIN</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-450 uppercase tracking-wider block">WhatsApp Group Link</label>
                <input
                  type="url"
                  value={editUserWhatsappGroup}
                  onChange={(e) => setEditUserWhatsappGroup(e.target.value)}
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full bg-[#1e293b]/30 border border-zinc-800 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-amber-550 focus:ring-4 focus:ring-amber-500/10 transition-all text-sm"
                />
              </div>

              <div className="flex items-center gap-3 bg-[#111928]/30 border border-zinc-800/60 px-4 py-3 rounded-2xl">
                <input
                  type="checkbox"
                  id="editAlreadyJoined"
                  checked={editAlreadyJoined}
                  onChange={(e) => setEditAlreadyJoined(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-zinc-800 text-emerald-500 focus:ring-emerald-500/15 bg-[#1e293b]/30 accent-emerald-500 cursor-pointer"
                />
                <label htmlFor="editAlreadyJoined" className="text-xs font-bold text-zinc-350 cursor-pointer select-none">
                  Is already in WhatsApp Group
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all cursor-pointer text-sm shadow-lg shadow-amber-500/15"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
