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
    myPendingSum: 0,
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

  const [totalPendingAmount, setTotalPendingAmount] = useState(0);

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

      // Pending sum
      const totalPendingSum = pending.reduce((sum, p) => sum + p.amount, 0);
      setTotalPendingAmount(totalPendingSum);

      // User specific calculations
      const myHistory = history.filter((h) => h.mobile === user.mobile);
      const myPending = pending.filter((p) => p.mobile === user.mobile);
      const myTotalDonations = myHistory.reduce((sum, h) => sum + h.amount, 0);
      const myPendingSum = myPending.reduce((sum, p) => sum + p.amount, 0);

      setDbStats({
        totalUsers,
        totalApproved,
        activeAdmins,
        superAdmins,
        totalDonationsSum,
        myTotalDonations,
        myApprovedCount: myHistory.length,
        myPendingCount: myPending.length,
        myPendingSum,
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

  // Data mapping for 5 cards based on User Role (using Title Case to match screenshot)
  const metrics = isAdmin
    ? [
        { label: "Total Contributors", value: dbStats.totalUsers.toLocaleString("en-IN"), colorClass: "bg-blue-500", isRed: false },
        { label: "Approved Claims", value: dbStats.totalApproved.toLocaleString("en-IN"), colorClass: "bg-emerald-500", isRed: false },
        { label: "Moderators List", value: `${dbStats.activeAdmins} Admins`, colorClass: "bg-purple-500", isRed: false },
        { label: "Monthly Collections", value: `₹${dbStats.totalDonationsSum.toLocaleString("en-IN")}`, colorClass: "bg-cyan-500", isRed: false },
        { label: "Pending Claims Sum", value: `₹${totalPendingAmount.toLocaleString("en-IN")}`, colorClass: "bg-red-500", isRed: true },
      ]
    : [
        { label: "Total Claims", value: (dbStats.myApprovedCount + dbStats.myPendingCount).toString(), colorClass: "bg-blue-500", isRed: false },
        { label: "Approved Claims", value: dbStats.myApprovedCount.toString(), colorClass: "bg-emerald-500", isRed: false },
        { label: "Registry Tier", value: "Contributor", colorClass: "bg-purple-500", isRed: false },
        { label: "My Contributed Sum", value: `₹${dbStats.myTotalDonations.toLocaleString("en-IN")}`, colorClass: "bg-cyan-500", isRed: false },
        { label: "Awaiting Verification", value: `₹${dbStats.myPendingSum.toLocaleString("en-IN")}`, colorClass: "bg-red-500", isRed: true },
      ];

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 bg-[#070b12] text-zinc-100 min-h-screen">
      
      {/* Dynamic Mobile Header Title (Desktop Title is in layout top-bar) */}
      <div className="lg:hidden mb-6">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          {isAdmin ? "Overview" : "My Contributor Panel"}
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          {isAdmin 
            ? "Full system overview of users, donations, and reports." 
            : `Welcome back, ${currentUser.name}. Track your claims status.`}
        </p>
      </div>

      <main className="space-y-8 flex-1 flex flex-col justify-between">
        
        {/* REDESIGNED METRIC CARDS ROW: 5 Columns Grid exactly like screenshot */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 md:gap-4 lg:gap-5">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-[#111928]/40 border border-zinc-800/40 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-center gap-1.5 min-h-[90px] last:col-span-2 md:last:col-span-1"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${m.colorClass}`}></span>
                <span className="text-[10px] sm:text-xs text-zinc-400 font-semibold tracking-wider uppercase truncate">
                  {m.label}
                </span>
              </div>
              <span
                className={`text-xl sm:text-2xl font-bold tracking-tight ${
                  m.isRed ? "text-red-500" : "text-zinc-100"
                }`}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* REDESIGNED CHARTS ROW: Daily Sales (Bar) & Monthly Sales (Line) Side-by-side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1">
          
          {/* Daily Sales Bar Chart Card (Left) */}
          <div className="bg-[#111928]/40 border border-zinc-800/40 rounded-3xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[360px]">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Daily Sales</h3>
              <p className="text-xs text-zinc-505 mt-0.5">Mock overview of registry volume.</p>
            </div>

            {/* SVG Bar Chart representing user's screenshot layout */}
            <div className="flex-1 w-full relative h-[220px] flex items-center justify-center pt-4">
              <svg viewBox="0 0 440 240" className="w-full h-full overflow-visible">
                {/* Horizontal dotted gridlines */}
                {[0, 60, 120, 180, 240].map((val, idx) => {
                  const y = 200 - (val / 240) * 160;
                  return (
                    <g key={idx}>
                      <line
                        x1="35"
                        y1={y}
                        x2="420"
                        y2={y}
                        stroke="rgba(226, 232, 240, 0.08)"
                        strokeDasharray="3"
                        className="dashboard-light-theme:stroke-slate-200"
                        style={{ stroke: "var(--light-card-border)" }}
                      />
                      <text
                        x="10"
                        y={y + 4}
                        fill="#64748b"
                        className="text-[10px] font-mono text-zinc-500"
                        textAnchor="start"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Bars - Purple/Indigo like screenshot Daily Sales */}
                {[
                  { x: 55, h: 110, val: 110, day: "Mon" },
                  { x: 105, h: 130, val: 130, day: "Tue" },
                  { x: 155, h: 90, val: 90, day: "Wed" },
                  { x: 205, h: 130, val: 130, day: "Thu" },
                  { x: 255, h: 190, val: 190, day: "Fri" },
                  { x: 305, h: 235, val: 235, day: "Sat" },
                  { x: 355, h: 215, val: 215, day: "Sun" },
                ].map((bar, idx) => {
                  const y = 200 - bar.h;
                  const isHovered = hoveredChart2 === idx;
                  return (
                    <g
                      key={idx}
                      onMouseEnter={() => setHoveredChart2(idx)}
                      onMouseLeave={() => setHoveredChart2(null)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={bar.x}
                        y={y}
                        width="24"
                        height={bar.h}
                        rx="5"
                        fill={isHovered ? "#4f46e5" : "#6366f1"}
                        className="transition-all duration-300 origin-bottom"
                      />
                      {/* X Axis Labels under each bar */}
                      <text
                        x={bar.x + 12}
                        y="225"
                        fill="#64748b"
                        className="text-[10px] font-mono text-zinc-500 font-semibold"
                        textAnchor="middle"
                      >
                        {bar.day}
                      </text>
                    </g>
                  );
                })}
              </svg>
              
              {/* Tooltip */}
              {hoveredChart2 !== null && (
                <div
                  className="absolute z-20 bg-zinc-950 text-white border border-zinc-800 px-3 py-1.5 rounded-xl shadow-2xl text-[10px] font-mono pointer-events-none"
                  style={{
                    left: `${55 + hoveredChart2 * 50 + 12}px`,
                    top: `${200 - [110, 130, 90, 130, 190, 235, 215][hoveredChart2] - 30}px`,
                    transform: "translateX(-50%)",
                  }}
                >
                  {[110, 130, 90, 130, 190, 235, 215][hoveredChart2]} Claims
                </div>
              )}
            </div>
          </div>

          {/* Monthly Sales Curved Line Chart Card (Right) */}
          <div className="bg-[#111928]/40 border border-zinc-800/40 rounded-3xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[360px]">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Monthly Sales</h3>
              <p className="text-xs text-zinc-505 mt-0.5">Overview of verified registry collections.</p>
            </div>

            {/* SVG Line Chart representing user's screenshot layout */}
            <div className="flex-1 w-full relative h-[220px] flex items-center justify-center pt-4">
              <svg viewBox="0 0 440 240" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal dotted gridlines */}
                {[0, 2000, 4000, 6000, 8000].map((val, idx) => {
                  const y = 200 - (val / 8000) * 160;
                  return (
                    <g key={idx}>
                      <line
                        x1="35"
                        y1={y}
                        x2="420"
                        y2={y}
                        stroke="rgba(226, 232, 240, 0.08)"
                        strokeDasharray="3"
                        className="dashboard-light-theme:stroke-slate-200"
                        style={{ stroke: "var(--light-card-border)" }}
                      />
                      <text
                        x="10"
                        y={y + 4}
                        fill="#64748b"
                        className="text-[10px] font-mono text-zinc-500"
                        textAnchor="start"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Gradient area underneath curved path */}
                <path
                  d="M 50 120 C 90 155, 120 90, 170 100 C 220 110, 250 70, 300 76 C 350 80, 400 60, 420 70 L 420 200 L 50 200 Z"
                  fill="url(#cyanGradient)"
                />

                {/* Smooth cyan curved line path */}
                <path
                  d="M 50 120 C 90 155, 120 90, 170 100 C 220 110, 250 70, 300 76 C 350 80, 400 60, 420 70"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3.5"
                />

                {/* Tooltip anchors / Circles / X Axis Labels */}
                {[
                  { x: 50, y: 120, val: 4000, month: "Jan" },
                  { x: 110, y: 138, val: 3100, month: "Feb" },
                  { x: 170, y: 100, val: 5000, month: "Mar" },
                  { x: 236, y: 106, val: 4700, month: "Apr" },
                  { x: 300, y: 76, val: 6200, month: "May" },
                  { x: 364, y: 64, val: 6800, month: "Jun" },
                  { x: 420, y: 70, val: 6500, month: "Jul" },
                ].map((pt, idx) => {
                  const isHovered = hoveredChart1 === idx;
                  return (
                    <g key={idx}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 8 : 4.5}
                        fill={isHovered ? "#22d3ee" : "#ffffff"}
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                        onMouseEnter={() => setHoveredChart1(idx)}
                        onMouseLeave={() => setHoveredChart1(null)}
                        className="cursor-pointer transition-all duration-200"
                      />
                      {/* X Axis Labels under each line coordinate */}
                      <text
                        x={pt.x}
                        y="225"
                        fill="#64748b"
                        className="text-[10px] font-mono text-zinc-500 font-semibold"
                        textAnchor="middle"
                      >
                        {pt.month}
                      </text>
                    </g>
                  );
                })}
              </svg>
              
              {/* Line chart Tooltip */}
              {hoveredChart1 !== null && (
                <div
                  className="absolute z-20 bg-zinc-950 text-white border border-zinc-800 px-3 py-1.5 rounded-xl shadow-2xl text-[10px] font-mono pointer-events-none"
                  style={{
                    left: `${[50, 110, 170, 236, 300, 364, 420][hoveredChart1] + 12}px`,
                    top: `${[120, 138, 100, 106, 76, 64, 70][hoveredChart1] - 30}px`,
                    transform: "translateX(-50%)",
                  }}
                >
                  ₹{[4000, 3100, 5000, 4700, 6200, 6800, 6500][hoveredChart1].toLocaleString("en-IN")}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* WhatsApp Banner preservation */}
        {!isAdmin && !currentUser?.whatsappJoined && (
          <div className="bg-gradient-to-br from-[#0c1a16] via-[#040f0c] to-[#0c1a16] border border-emerald-500/25 rounded-[24px] p-6 hover:border-emerald-400/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.12)] transition-all duration-500 relative overflow-hidden backdrop-blur-md shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 mt-6">
            <div className="absolute top-[-20%] right-[-10%] w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>
            
            <div className="space-y-3 z-10 flex-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-widest block">Official Community Group</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Join Our WhatsApp Community</h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-3xl">
                Get real-time updates regarding food distribution drives, education funds allocation, and emergency appeals. Connect directly with administrators.
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
