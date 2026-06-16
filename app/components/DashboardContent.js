"use client";

import React, { useState, useEffect } from "react";
import { getCurrentUser, getUsers, getPendingDonations, getDonationsHistory, saveUsers, setCurrentUser } from "../utils/db";

export default function DashboardContent() {
  const [currentUser, setCurrentStateUser] = useState(null);
  const [dbStats, setDbStats] = useState({
    totalUsers: 0,
    totalApproved: 0,
    activeAdmins: 0,
    superAdmins: 0,
    totalDonationsSum: 0,
    myTotalDonations: 0,
    myApprovedCount: 0,
    myPendingCount: 0,
  });

  const [hoveredChart1, setHoveredChart1] = useState(null);
  const [hoveredChart2, setHoveredChart2] = useState(null);
  const [myRecentClaims, setMyRecentClaims] = useState([]);

  const handleJoinGroup = () => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, whatsappJoined: true };
    setCurrentStateUser(updatedUser);
    setCurrentUser(updatedUser);
    const users = getUsers();
    const updatedUsers = users.map((u) =>
      u.mobile === currentUser.mobile ? { ...u, whatsappJoined: true } : u
    );
    saveUsers(updatedUsers);
    window.open(currentUser.whatsappGroup || "https://chat.whatsapp.com/G2EHonNxcjoBwtygpTmCg4", "_blank");
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentStateUser(user);
      
      const users = getUsers();
      const pending = getPendingDonations();
      const history = getDonationsHistory();

      // System calculations
      const totalUsers = users.length;
      const totalApproved = history.length;
      const activeAdmins = users.filter((u) => u.role === "ADMIN").length;
      const superAdmins = users.filter((u) => u.role === "SUPER_ADMIN").length;
      const totalDonationsSum = users.reduce((sum, u) => sum + u.donations, 0);

      // User specific calculations
      const myHistory = history.filter((h) => h.mobile === user.mobile);
      const myPending = pending.filter((p) => p.mobile === user.mobile);
      const myTotalDonations = myHistory.reduce((sum, h) => sum + h.amount, 0);

      setDbStats({
        totalUsers,
        totalApproved,
        activeAdmins,
        superAdmins,
        totalDonationsSum,
        myTotalDonations,
        myApprovedCount: myHistory.length,
        myPendingCount: myPending.length,
      });

      // Filter recent timeline claims for user
      const mergedClaims = [
        ...myPending.map(p => ({ ...p, status: "Pending", color: "text-amber-400 bg-amber-500/10 border-amber-500/25" })),
        ...myHistory.map(h => ({ ...h, status: "Approved", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" }))
      ].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

      setMyRecentClaims(mergedClaims);
    }
  }, []);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === "SUPER_ADMIN" || currentUser.role === "ADMIN";

  // Chart Coordinates (Monthly Donations System-wide or User-specific)
  const chartPoints = isAdmin 
    ? [
        { label: "Jan", val: 80 },
        { label: "Feb", val: 110 },
        { label: "Mar", val: 95 },
        { label: "Apr", val: 140 },
        { label: "May", val: 160 },
        { label: "Jun", val: 215 },
      ]
    : [
        { label: "Jan", val: 0 },
        { label: "Feb", val: 2 },
        { label: "Mar", val: 5 },
        { label: "Apr", val: 3 },
        { label: "May", val: 8 },
        { label: "Jun", val: 12 }, // Scaled down points for user
      ];

  const maxVal = isAdmin ? 250 : 20;
  const chartCoords = chartPoints.map((p, idx) => {
    const x = 50 + (idx / 5) * 500;
    const y = 200 - (p.val / maxVal) * 160;
    return { x, y, ...p };
  });

  let linePath = `M ${chartCoords[0].x} ${chartCoords[0].y}`;
  for (let i = 1; i < chartCoords.length; i++) {
    const cpX1 = chartCoords[i - 1].x + (chartCoords[i].x - chartCoords[i - 1].x) / 3;
    const cpY1 = chartCoords[i - 1].y;
    const cpX2 = chartCoords[i - 1].x + (2 * (chartCoords[i].x - chartCoords[i - 1].x)) / 3;
    const cpY2 = chartCoords[i].y;
    linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${chartCoords[i].x} ${chartCoords[i].y}`;
  }
  const areaPath = `${linePath} L ${chartCoords[chartCoords.length - 1].x} 200 L ${chartCoords[0].x} 200 Z`;

  // Weekly user registries (admin) or Campaign contribution breakdown (user)
  const chart2Points = isAdmin
    ? [
        { label: "Wk 1", val: 12 },
        { label: "Wk 2", val: 18 },
        { label: "Wk 3", val: 24 },
        { label: "Wk 4", val: 15 },
        { label: "Wk 5", val: 29 },
      ]
    : [
        { label: "Food", val: 5 },
        { label: "Medical", val: 8 },
        { label: "Educate", val: 15 },
        { label: "Water", val: 4 },
        { label: "General", val: 10 },
      ];

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 bg-[#070b12] text-zinc-100 min-h-screen">
      
      {/* Top Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800/40 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            {isAdmin ? `${currentUser.role.replace("_", " ")} Dashboard` : "My Contributor Panel"}
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            {isAdmin 
              ? "Full system overview of users, donations, and reports." 
              : `Welcome back, ${currentUser.name}. Track your contribution points and claim records.`}
          </p>
        </div>
        
        {/* Dynamic status pill */}
        <div className="flex items-center gap-3 self-start md:self-auto bg-[#0e1325]/55 border border-zinc-800/50 px-4 py-2.5 rounded-2xl backdrop-blur-md shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-mono text-zinc-300 font-semibold uppercase tracking-wider">
            System Online
          </span>
        </div>
      </header>

      {/* Dashboard Main Grid */}
      <main className="space-y-8 flex-1 flex flex-col">
        
        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isAdmin ? (
            // Admin/Super Admin stats cards
            <>
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
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <span className="text-3xl font-extrabold text-cyan-400 block tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.2)] group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300">{dbStats.totalUsers}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1 w-full">
                    <span className="text-emerald-400">+12.4%</span>
                    <span className="text-zinc-500 font-medium">from last cycle</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Total Contributed */}
              <div className="bg-gradient-to-br from-[#0e1325]/90 to-[#080c16]/95 border border-emerald-500/35 rounded-[24px] p-5 min-h-[140px] h-auto relative backdrop-blur-xl flex flex-col justify-between overflow-hidden group hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-500 shadow-2xl">
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 shadow-[0_0_12px_#10b981] opacity-90" />
                
                <div className="space-y-2.5 min-w-0 w-full z-10 flex flex-col justify-between flex-1">
                  <div className="flex justify-between items-start gap-3 w-full">
                    <div className="min-w-0 flex-1 pt-1.5 relative group/tooltip">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block cursor-help">Total Contributed</span>
                      <div className="absolute bottom-full left-0 mb-2 w-max opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-300 ease-out z-30">
                        <div className="bg-[#0e1325]/95 backdrop-blur-md border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(16,185,129,0.1)] text-[10px] font-extrabold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Total Contributed
                        </div>
                        <div className="w-2 h-2 bg-[#0e1325] border-r border-b border-emerald-500/30 rotate-45 absolute top-full left-4 -translate-y-[5px]"></div>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-[16px] border border-emerald-500/30 flex items-center justify-center bg-[#0d1222]/80 shadow-[0_0_15px_rgba(16,185,129,0.15)] shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300">
                      <div className="w-8 h-8 rounded-full border border-emerald-500/60 flex items-center justify-center bg-transparent">
                        <span className="text-emerald-400 font-black text-lg drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]">$</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <span className="text-3xl font-extrabold text-emerald-400 block tracking-tight drop-shadow-[0_0_8px_rgba(16,185,129,0.2)] group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300">₹{dbStats.totalDonationsSum.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1 w-full">
                    <span>Gross collection registry</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Active Admins */}
              <div className="bg-gradient-to-br from-[#0e1325]/90 to-[#080c16]/95 border border-purple-500/35 rounded-[24px] p-5 min-h-[140px] h-auto relative backdrop-blur-xl flex flex-col justify-between overflow-hidden group hover:border-purple-400 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-500 shadow-2xl">
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-purple-500/10 blur-2xl pointer-events-none group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 shadow-[0_0_12px_#8b5cf6] opacity-90" />
                
                <div className="space-y-2.5 min-w-0 w-full z-10 flex flex-col justify-between flex-1">
                  <div className="flex justify-between items-start gap-3 w-full">
                    <div className="min-w-0 flex-1 pt-1.5">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">Active Admins</span>
                    </div>
                    <div className="w-12 h-12 rounded-[16px] border border-purple-500/30 flex items-center justify-center bg-[#0d1222]/80 shadow-[0_0_15px_rgba(139,92,246,0.15)] shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:border-purple-500/50 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300">
                      <div className="w-8 h-8 rounded-full border border-purple-500/60 flex items-center justify-center bg-transparent">
                        <svg className="w-4.5 h-4.5 text-purple-400 drop-shadow-[0_0_6px_rgba(139,92,246,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0 1 10.089 21c-2.243 0-4.32-.647-6.079-1.758 1.935-1.921 4.673-3.113 7.68-3.113 1.956 0 3.791.493 5.4 1.361M15 8.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 12a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <span className="text-3xl font-extrabold text-purple-400 block tracking-tight drop-shadow-[0_0_8px_rgba(139,92,246,0.2)] group-hover:text-purple-300 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300">{dbStats.activeAdmins}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1 w-full">
                    <span>Active moderation staff</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Super Admins */}
              <div className="bg-gradient-to-br from-[#0e1325]/90 to-[#080c16]/95 border border-amber-500/35 rounded-[24px] p-5 min-h-[140px] h-auto relative backdrop-blur-xl flex flex-col justify-between overflow-hidden group hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-500 shadow-2xl">
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-amber-500/10 blur-2xl pointer-events-none group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 shadow-[0_0_12px_#f59e0b] opacity-90" />
                
                <div className="space-y-2.5 min-w-0 w-full z-10 flex flex-col justify-between flex-1">
                  <div className="flex justify-between items-start gap-3 w-full">
                    <div className="min-w-0 flex-1 pt-1.5">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">Super Admins</span>
                    </div>
                    <div className="w-12 h-12 rounded-[16px] border border-amber-500/30 flex items-center justify-center bg-[#0d1222]/80 shadow-[0_0_15px_rgba(245,158,11,0.15)] shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:border-amber-500/50 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300">
                      <div className="w-8 h-8 rounded-full border border-amber-500/60 flex items-center justify-center bg-transparent">
                        <svg className="w-4.5 h-4.5 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <span className="text-3xl font-extrabold text-amber-500 block tracking-tight drop-shadow-[0_0_8px_rgba(245,158,11,0.2)] group-hover:text-amber-400 group-hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-300">{dbStats.superAdmins}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1 w-full">
                    <span>Full Access system operators</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Regular User stats cards
            <>
              {/* Card 1: My Total Contributions */}
              <div className="bg-gradient-to-br from-[#0e1325]/90 to-[#080c16]/95 border border-amber-500/35 rounded-[24px] p-5 min-h-[140px] h-auto relative backdrop-blur-xl flex flex-col justify-between overflow-hidden group hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-500 shadow-2xl">
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-amber-500/10 blur-2xl pointer-events-none group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 shadow-[0_0_12px_#f59e0b] opacity-90" />
                
                <div className="space-y-2.5 min-w-0 w-full z-10 flex flex-col justify-between flex-1">
                  <div className="flex justify-between items-start gap-3 w-full">
                    <div className="min-w-0 flex-1 pt-1.5">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">My Total Contributions</span>
                    </div>
                    <div className="w-12 h-12 rounded-[16px] border border-amber-500/30 flex items-center justify-center bg-[#0d1222]/80 shadow-[0_0_15px_rgba(245,158,11,0.15)] shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:border-amber-500/50 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300">
                      <div className="w-8 h-8 rounded-full border border-amber-500/60 flex items-center justify-center bg-transparent">
                        <span className="text-amber-400 font-black text-lg drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]">$</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <span className="text-2xl font-extrabold text-amber-500 block tracking-tight drop-shadow-[0_0_8px_rgba(245,158,11,0.2)] group-hover:text-amber-400 group-hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-300 font-sans font-extrabold">₹{dbStats.myTotalDonations.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1 w-full">
                    <span>Verified credits</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Approved Receipts */}
              <div className="bg-gradient-to-br from-[#0e1325]/90 to-[#080c16]/95 border border-emerald-500/35 rounded-[24px] p-5 min-h-[140px] h-auto relative backdrop-blur-xl flex flex-col justify-between overflow-hidden group hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-500 shadow-2xl">
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 shadow-[0_0_12px_#10b981] opacity-90" />
                
                <div className="space-y-2.5 min-w-0 w-full z-10 flex flex-col justify-between flex-1">
                  <div className="flex justify-between items-start gap-3 w-full">
                    <div className="min-w-0 flex-1 pt-1.5">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">Approved Transactions</span>
                    </div>
                    <div className="w-12 h-12 rounded-[16px] border border-emerald-500/30 flex items-center justify-center bg-[#0d1222]/80 shadow-[0_0_15px_rgba(16,185,129,0.15)] shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300">
                      <div className="w-8 h-8 rounded-full border border-emerald-500/60 flex items-center justify-center bg-transparent">
                        <svg className="w-4.5 h-4.5 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <span className="text-3xl font-extrabold text-emerald-400 block tracking-tight drop-shadow-[0_0_8px_rgba(16,185,129,0.2)] group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300">{dbStats.myApprovedCount}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1 w-full">
                    <span>Settled successfully</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Pending verification */}
              <div className="bg-gradient-to-br from-[#0e1325]/90 to-[#080c16]/95 border border-purple-500/35 rounded-[24px] p-5 min-h-[140px] h-auto relative backdrop-blur-xl flex flex-col justify-between overflow-hidden group hover:border-purple-400 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-500 shadow-2xl">
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-purple-500/10 blur-2xl pointer-events-none group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 shadow-[0_0_12px_#8b5cf6] opacity-90" />
                
                <div className="space-y-2.5 min-w-0 w-full z-10 flex flex-col justify-between flex-1">
                  <div className="flex justify-between items-start gap-3 w-full">
                    <div className="min-w-0 flex-1 pt-1.5">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">Awaiting Verification</span>
                    </div>
                    <div className="w-12 h-12 rounded-[16px] border border-purple-500/30 flex items-center justify-center bg-[#0d1222]/80 shadow-[0_0_15px_rgba(139,92,246,0.15)] shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:border-purple-500/50 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300">
                      <div className="w-8 h-8 rounded-full border border-purple-500/60 flex items-center justify-center bg-transparent">
                        <svg className="w-4.5 h-4.5 text-purple-400 drop-shadow-[0_0_6px_rgba(139,92,246,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <span className="text-3xl font-extrabold text-amber-500 block tracking-tight drop-shadow-[0_0_8px_rgba(245,158,11,0.2)] group-hover:text-amber-400 group-hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-300">{dbStats.myPendingCount} claims</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1 w-full">
                    <span className="text-amber-500">Under review by admins</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Registry Tier */}
              <div className="bg-gradient-to-br from-[#0e1325]/90 to-[#080c16]/95 border border-cyan-500/35 rounded-[24px] p-5 min-h-[140px] h-auto relative backdrop-blur-xl flex flex-col justify-between overflow-hidden group hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-500 shadow-2xl">
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600 shadow-[0_0_12px_#06b6d4] opacity-90" />
                
                <div className="space-y-2.5 min-w-0 w-full z-10 flex flex-col justify-between flex-1">
                  <div className="flex justify-between items-start gap-3 w-full">
                    <div className="min-w-0 flex-1 pt-1.5">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">Registry Tier</span>
                    </div>
                    <div className="w-12 h-12 rounded-[16px] border border-cyan-500/30 flex items-center justify-center bg-[#0d1222]/80 shadow-[0_0_15px_rgba(6,182,212,0.15)] shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300">
                      <div className="w-8 h-8 rounded-full border border-cyan-500/60 flex items-center justify-center bg-transparent">
                        <svg className="w-4.5 h-4.5 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <span className="text-2xl font-extrabold text-blue-400 block tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.2)] group-hover:text-blue-300 group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300">{currentUser.role.replace("_", " ")}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1.5 w-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Status: Active</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Charts and Details Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-[380px]">
          
          {/* Chart 1: Contribution overview */}
          <div className="bg-[#0e1325]/55 border border-zinc-800/40 rounded-[24px] p-6 flex flex-col justify-between hover:border-zinc-700/50 transition-all duration-300 backdrop-blur-md shadow-lg relative overflow-hidden">
            <div className="mb-4">
              <h3 className="text-base font-bold text-white">
                {isAdmin ? "Monthly Donations Overview" : "My Contributions Timeline"}
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                {isAdmin ? "Line breakdown of verified credits." : "Line graph mapping your payment points."}
              </p>
            </div>

            <div className="flex-1 w-full relative h-[200px] flex items-center justify-center">
              <div className="absolute inset-0 flex flex-col justify-between py-[20px] px-[40px] pointer-events-none opacity-[0.05]">
                <div className="border-b border-white w-full h-px"></div>
                <div className="border-b border-white w-full h-px"></div>
                <div className="border-b border-white w-full h-px"></div>
              </div>

              <svg viewBox="0 0 600 220" className="w-full h-full overflow-visible z-10">
                <defs>
                  <linearGradient id="dbGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-accent)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--primary-accent)" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <path d={areaPath} fill="url(#dbGradient)" />
                {/* Glowing glow line */}
                <path d={linePath} fill="none" stroke="var(--primary-accent)" strokeWidth="8" opacity="0.35" filter="url(#glow)" />
                {/* Crisp main line */}
                <path d={linePath} fill="none" stroke="var(--primary-accent)" strokeWidth="3.5" />

                {chartCoords.map((c, i) => (
                  <g key={i}>
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={hoveredChart1 === i ? "10" : "0"}
                      fill="var(--primary-accent)"
                      opacity="0.25"
                      className="transition-all duration-200"
                    />
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={hoveredChart1 === i ? "6.5" : "4.5"}
                      fill="#ffffff"
                      stroke="var(--primary-accent)"
                      strokeWidth="3"
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredChart1(i)}
                      onMouseLeave={() => setHoveredChart1(null)}
                    />
                  </g>
                ))}
              </svg>

              {hoveredChart1 !== null && chartCoords[hoveredChart1] && (
                <div
                  className="absolute z-20 bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl shadow-2xl backdrop-blur text-xs pointer-events-none"
                  style={{
                    left: `${(chartCoords[hoveredChart1].x / 600) * 100}%`,
                    top: `${(chartCoords[hoveredChart1].y / 220) * 100 - 10}%`,
                    transform: "translateX(-50%) translateY(-100%)",
                  }}
                >
                  <div className="font-extrabold text-white">
                    {isAdmin 
                      ? `₹${(chartCoords[hoveredChart1].val * 1000).toLocaleString("en-IN")}` 
                      : `₹${(chartCoords[hoveredChart1].val * 500).toLocaleString("en-IN")}`}
                  </div>
                  <div className="text-[9px] text-zinc-500 uppercase mt-0.5">{chartCoords[hoveredChart1].label}</div>
                </div>
              )}
            </div>

            <div className="flex justify-between px-[45px] pt-4 border-t border-zinc-800/40 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              {chartPoints.map((p, i) => (
                <span key={i}>{p.label}</span>
              ))}
            </div>
          </div>

          {/* Right Panel: Admin weekly summaries OR User personal recent timeline */}
          {isAdmin ? (
            /* Admin: Weekly Registries Chart */
            <div className="bg-[#0e1325]/55 border border-zinc-800/40 rounded-[24px] p-6 flex flex-col justify-between hover:border-zinc-700/50 transition-all duration-300 backdrop-blur-md shadow-lg relative overflow-hidden">
              <div className="mb-4">
                <h3 className="text-base font-bold text-white">New Registries Summary</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Weekly volume of newly approved profiles.</p>
              </div>

              <div className="flex-1 w-full relative h-[200px] flex items-end justify-between px-6 py-2">
                <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 pointer-events-none opacity-[0.05]">
                  <div className="border-b border-white w-full h-px"></div>
                  <div className="border-b border-white w-full h-px"></div>
                  <div className="border-b border-white w-full h-px"></div>
                </div>

                {chart2Points.map((val, idx) => {
                  const maxChart2 = Math.max(...chart2Points.map((p) => p.val));
                  const barHeight = (val.val / maxChart2) * 80;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group z-10">
                      <div className="w-12 flex-1 bg-zinc-800/10 rounded-2xl relative overflow-hidden flex items-end border border-zinc-800/15">
                        <div
                          style={{ height: `${barHeight}%`, backgroundColor: "var(--primary-accent)" }}
                          className="w-full rounded-t-xl transition-all duration-500 relative shadow-[0_-4px_12px_rgba(255,255,255,0.05)] cursor-pointer opacity-80 group-hover:opacity-100 group-hover:scale-y-[1.02] origin-bottom"
                          onMouseEnter={() => setHoveredChart2(idx)}
                          onMouseLeave={() => setHoveredChart2(null)}
                        >
                          {hoveredChart2 === idx && (
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-950 text-[10px] text-white px-2.5 py-1 rounded-lg border border-zinc-800 whitespace-nowrap font-mono shadow-2xl z-20">
                              {val.val} Users
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                        {val.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* User: Recent claims timeline + Payment Guides */
            <div className="bg-[#0e1325]/55 border border-zinc-800/40 rounded-[24px] p-6 flex flex-col justify-between hover:border-zinc-700/50 transition-all duration-300 backdrop-blur-md shadow-lg relative overflow-hidden">
              <div className="mb-4 flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-white">My Payment Claims</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Timeline status of recent transactions.</p>
                </div>
                <a
                  href="/dashboard/pending-donations"
                  style={{ color: "var(--primary-accent)" }}
                  className="text-xs font-bold hover:underline cursor-pointer"
                >
                  Submit New Claim
                </a>
              </div>

              <div className="flex-1 space-y-4 my-2 overflow-y-auto no-scrollbar max-h-[220px]">
                {myRecentClaims.length > 0 ? (
                  myRecentClaims.map((claim) => (
                    <div key={claim.id} className="flex justify-between items-center bg-[#0d1222]/30 hover:bg-[#0d1222]/55 border border-zinc-800/40 p-4 rounded-2xl transition-all duration-200 hover:border-zinc-700/50 group">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white block group-hover:text-zinc-100 transition-colors">{claim.campaign}</span>
                        <div className="text-[10px] font-mono text-zinc-500 flex gap-2">
                          <span>{claim.date}</span>
                          <span>•</span>
                          <span>Ref: {claim.refNo}</span>
                        </div>
                      </div>
                      
                      <div className="text-right flex items-center gap-3">
                        <span className="text-sm font-bold font-mono text-white">₹{claim.amount.toLocaleString("en-IN")}</span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border shadow-sm ${claim.color}`}>
                          {claim.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-xs text-zinc-500 flex flex-col items-center justify-center gap-2 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20">
                    <svg className="w-7 h-7 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>No donation claims registered. Click top-right to log your first payment.</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {!isAdmin && !currentUser?.whatsappJoined && (
          <div className="bg-gradient-to-br from-[#0c1a16] via-[#040f0c] to-[#0c1a16] border border-emerald-500/25 rounded-[24px] p-6 md:p-8 hover:border-emerald-400/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.12)] transition-all duration-500 relative overflow-hidden backdrop-blur-md shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute top-[-20%] right-[-10%] w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>
            
            <div className="space-y-3 z-10 flex-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-widest block">Official Community Group</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">Join Our WhatsApp Community</h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-3xl">
                Get real-time updates regarding food distribution drives, education funds allocation, and emergency medical appeals. Connect directly with administrators and fellow contributors.
              </p>
            </div>
            
            <button
              onClick={handleJoinGroup}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-6 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/45 hover:scale-[1.03] active:scale-[0.98] shrink-0 z-10 text-sm flex items-center justify-center gap-2.5 cursor-pointer border border-emerald-400/20"
            >
              <svg className="w-5 h-5 fill-white" viewBox="0 0 448 512">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
              </svg>
              <span>Join WhatsApp Group</span>
            </button>
          </div>
        )}

      </main>

    </div>
  );
}
