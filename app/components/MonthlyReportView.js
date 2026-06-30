"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const monthlyHistory = [
  { month: "October 2026", amount: 275000, contributors: 245, topCampaign: "Emergency Medical Aid", status: "Under Audit Review", color: "from-amber-500 to-rose-600", weekly: [60000, 75000, 80000, 60000] },
  { month: "September 2026", amount: 230000, contributors: 210, topCampaign: "Food Distribution", status: "Audited & Locked", color: "from-violet-600 to-indigo-600", weekly: [50000, 60000, 70000, 50000] },
  { month: "August 2026", amount: 210000, contributors: 198, topCampaign: "Education Support", status: "Audited & Locked", color: "from-emerald-400 to-teal-700", weekly: [45000, 55000, 60000, 50000] },
  { month: "July 2026", amount: 170000, contributors: 162, topCampaign: "Food Distribution", status: "Audited & Locked", color: "from-cyan-500 to-blue-600", weekly: [40000, 42000, 48000, 40000] },
  { month: "June 2026", amount: 215000, contributors: 205, topCampaign: "Water Wells Project", status: "Audited & Locked", color: "from-red-500 to-pink-600", weekly: [50000, 55000, 60000, 50000] },
  { month: "May 2026", amount: 190000, contributors: 180, topCampaign: "Emergency Medical Aid", status: "Audited & Locked", color: "from-purple-500 to-indigo-500", weekly: [40000, 50000, 55000, 45000] },
  { month: "April 2026", amount: 165000, contributors: 156, topCampaign: "Education Support", status: "Audited & Locked", color: "from-violet-600 to-indigo-600", weekly: [35000, 45000, 45000, 40000] },
  { month: "March 2026", amount: 130000, contributors: 121, topCampaign: "Food Distribution", status: "Audited & Locked", color: "from-amber-500 to-rose-600", weekly: [30000, 32000, 38000, 30000] },
  { month: "February 2026", amount: 145000, contributors: 134, topCampaign: "Emergency Medical Aid", status: "Audited & Locked", color: "from-emerald-400 to-teal-700", weekly: [30000, 40000, 45000, 30000] },
  { month: "January 2026", amount: 120000, contributors: 110, topCampaign: "Education Support", status: "Audited & Locked", color: "from-cyan-500 to-blue-600", weekly: [25000, 30000, 35000, 30000] },
  { month: "December 2025", amount: 160000, contributors: 130, topCampaign: "Food Distribution", status: "Audited & Locked", color: "from-red-500 to-pink-600", weekly: [35000, 45000, 45000, 35000] },
  { month: "November 2025", amount: 140000, contributors: 115, topCampaign: "Water Wells Project", status: "Audited & Locked", color: "from-purple-500 to-indigo-500", weekly: [30000, 35000, 40000, 35000] },
];

export default function MonthlyReportView() {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/dashbord") ? "/dashbord" : "/dashboard";

  const [report, setReport] = useState(monthlyHistory);
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedMonthFilter, setSelectedMonthFilter] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Lists for dropdown filters
  const yearsList = ["ALL", "2026", "2025"];
  const monthsList = [
    "ALL",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  // Calculations
  const totalVolume = report.reduce((sum, r) => sum + r.amount, 0);
  const topMonthObj = report.reduce((max, r) => (r.amount > max.amount ? r : max), report[0]);
  const averageVolume = Math.round(totalVolume / report.length);

  // Interactive filtering logic based on text search, month select, and year select
  const filteredReport = report.filter((r) => {
    const [monthName, yearVal] = r.month.split(" ");
    
    const matchesSearch =
      r.month.toLowerCase().includes(search.toLowerCase()) ||
      r.topCampaign.toLowerCase().includes(search.toLowerCase());
      
    const matchesYear = selectedYear === "ALL" || yearVal === selectedYear;
    const matchesMonth = selectedMonthFilter === "ALL" || monthName === selectedMonthFilter;
    
    return matchesSearch && matchesYear && matchesMonth;
  });

  // Export animation
  useEffect(() => {
    let interval;
    if (isExporting) {
      setExportProgress(0);
      interval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsExporting(false);
            }, 800);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isExporting]);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 sm:pb-12 bg-[#070b12] text-zinc-100 relative">
      {/* Background decoration */}
      <div className="absolute top-[-5%] left-[-10%] w-[35%] h-[35%] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 relative">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">Monthly Ledger Report</h1>
          <p className="text-zinc-400 mt-2 text-sm">Review compiled monthly contributions volume, auditable checkpoints, and campaign summaries.</p>
        </div>

        <button
          onClick={() => setIsExporting(true)}
          className="text-white text-xs font-bold px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 cursor-pointer border border-zinc-700/30 flex items-center gap-2 shadow-md"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Annual Ledger
        </button>
      </header>

      {/* Navigation Tabs directly inside page layout */}
      <div className="flex border-b border-zinc-800/80 mb-8 z-10 relative">
        <Link
          href={`${basePath}/donations-history`}
          className="pb-4 px-6 text-sm font-semibold border-b-2 transition-all border-transparent text-zinc-500 hover:text-zinc-300"
        >
          All Donation List
        </Link>
        <Link
          href={`${basePath}/donations-history/monthly`}
          className="pb-4 px-6 text-sm font-bold border-b-2 transition-all border-primary-accent text-white"
        >
          Monthly Summary Report
        </Link>
      </div>

      {/* Monthly Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 z-10 relative">
        {/* Card 1 */}
        <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Annual Total Raised</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">₹{totalVolume.toLocaleString("en-IN")}</h2>
          <p className="text-[11px] text-zinc-500 mt-1">Aggregated collections across all months.</p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Peak Settlement Month</span>
          <h2 className="text-3xl font-extrabold text-emerald-400 mt-2">{topMonthObj.month}</h2>
          <p className="text-[11px] text-zinc-500 mt-1">₹{topMonthObj.amount.toLocaleString("en-IN")} total volume collected.</p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Avg Monthly Volume</span>
          <h2 className="text-3xl font-extrabold text-amber-400 mt-2">₹{averageVolume.toLocaleString("en-IN")}</h2>
          <p className="text-[11px] text-zinc-500 mt-1">Calculated monthly performance average.</p>
        </div>
      </div>

      {/* Premium Filters Selector Controls Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 z-10 relative">
        {/* Search Input (6/12 cols) */}
        <div className="md:col-span-6 relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaign driver..."
            className="w-full bg-[#111928]/40 border border-zinc-800/80 rounded-2xl py-3.5 pl-12 pr-10 text-white placeholder-zinc-500 focus:outline-none focus:border-primary-accent focus:ring-4 focus:ring-primary-accent/15 transition-all text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-4 flex items-center text-zinc-500 hover:text-white cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Selectors container side-by-side on mobile */}
        <div className="grid grid-cols-2 gap-3 md:col-span-6">
          {/* Month Selector */}
          <div className="relative">
            <select
              value={selectedMonthFilter}
              onChange={(e) => setSelectedMonthFilter(e.target.value)}
              className="w-full bg-[#111928]/40 border border-zinc-800/80 rounded-2xl py-3.5 pl-4 pr-10 text-white appearance-none focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
            >
              {monthsList.map((m) => (
                <option key={m} value={m} className="bg-[#0f172a]">
                  {m === "ALL" ? "All Months" : m}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500 pointer-events-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>

          {/* Year Selector */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-[#111928]/40 border border-zinc-800/80 rounded-2xl py-3.5 pl-4 pr-10 text-white appearance-none focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
            >
              {yearsList.map((y) => (
                <option key={y} value={y} className="bg-[#0f172a]">
                  {y === "ALL" ? "All Years" : y}
                </option>
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

      {/* Monthly Report Table - Desktop Only */}
      <div className="hidden md:block bg-[#111928]/20 border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl z-10 relative backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#111928]/50 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-5 px-6">Month / Year</th>
                <th className="py-5 px-6">Total Collections</th>
                <th className="py-5 px-6">Unique Contributors</th>
                <th className="py-5 px-6">Top Campaign Category</th>
                <th className="py-5 px-6">Audit Status</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-sm">
              {filteredReport.length > 0 ? (
                filteredReport.map((item) => (
                  <tr key={item.month} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color || 'from-zinc-700 to-zinc-800'} flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-inner`}>
                          {item.month.slice(0, 3).toUpperCase()}
                        </div>
                        <span className="font-semibold text-white group-hover:text-primary-accent transition-colors">
                          {item.month}
                        </span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 font-bold font-mono text-base text-emerald-400">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4.5 px-6 text-zinc-300 font-mono">
                      {item.contributors} accounts
                    </td>
                    <td className="py-4.5 px-6 text-zinc-400">
                      {item.topCampaign}
                    </td>
                    <td className="py-4.5 px-6">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        item.status.includes("Review")
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status.includes("Review") ? "bg-amber-400" : "bg-emerald-400"
                        }`}></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <button
                        onClick={() => setSelectedMonth(item)}
                        className="text-xs font-semibold px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer border border-zinc-800"
                      >
                        Audited Breakdown
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>No monthly report entries found matching select parameters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card Layout - Mobile Only */}
      <div className="md:hidden space-y-4 z-10 relative">
        {filteredReport.length > 0 ? (
          filteredReport.map((item) => (
            <div key={item.month} className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-col justify-between hover:border-zinc-700/50 transition-all group">
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${item.color || 'from-zinc-700 to-zinc-800'} flex items-center justify-center font-bold text-xs sm:text-sm text-white shrink-0 shadow-inner`}>
                    {item.month.slice(0, 3).toUpperCase()}
                  </div>
                  <span className="font-semibold text-white text-sm sm:text-base leading-tight group-hover:text-primary-accent transition-all truncate">{item.month}</span>
                </div>
                <span className="text-emerald-400 font-bold font-mono text-sm sm:text-base shrink-0">₹{item.amount.toLocaleString("en-IN")}</span>
              </div>

              <div className="space-y-2.5 mt-4 pt-4 border-t border-zinc-800/40 text-xs">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-zinc-500 shrink-0">Top Campaign</span>
                  <span className="text-zinc-300 font-medium text-right truncate max-w-[65%]">{item.topCampaign}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-zinc-500 shrink-0">Donors Count</span>
                  <span className="text-zinc-400 font-mono text-right">{item.contributors} accounts</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-zinc-500 shrink-0">Audit Status</span>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    item.status.includes("Review")
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      item.status.includes("Review") ? "bg-amber-400" : "bg-emerald-400"
                    }`}></span>
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/40">
                <button
                  onClick={() => setSelectedMonth(item)}
                  className="w-full text-center py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold transition-all cursor-pointer text-xs border border-zinc-800"
                >
                  Audited Breakdown
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#111928]/20 border border-zinc-800/50 rounded-3xl p-16 text-center text-zinc-500">
            <div className="flex flex-col items-center justify-center gap-2">
              <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>No monthly report entries found matching select parameters.</span>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL: MONTHLY BREAKDOWN DETAIL WITH MINI SVG CHART (NO IDS DISPLAYED) */}
      {selectedMonth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#111928] border border-zinc-800 rounded-3xl p-6 max-w-md w-full relative shadow-2xl">
            
            <button
              onClick={() => setSelectedMonth(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
              {selectedMonth.month} Analysis
            </h3>
            <p className="text-zinc-500 text-xs mt-1 leading-normal mb-6">
              Audited summary data of funds allocated during this month.
            </p>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-4 bg-[#1e293b]/20 border border-zinc-800/60 rounded-2xl p-4 mb-6">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Month Volume</span>
                <span className="text-base font-extrabold text-emerald-400 block mt-0.5">₹{selectedMonth.amount.toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Total Donors</span>
                <span className="text-sm font-semibold text-zinc-300 block mt-1">{selectedMonth.contributors} accounts</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-zinc-800/40">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Top Campaign Driver</span>
                <span className="text-xs font-semibold text-white block mt-0.5">{selectedMonth.topCampaign}</span>
              </div>
            </div>

            {/* Premium Mini SVG Weekly Bar Chart */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Weekly Collections</h4>
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 flex items-end justify-between h-[120px] pt-6 relative">
                
                {/* Horizontal help grids */}
                <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none px-2 select-none opacity-20">
                  <div className="border-b border-zinc-700 w-full h-px"></div>
                  <div className="border-b border-zinc-700 w-full h-px"></div>
                  <div className="border-b border-zinc-700 w-full h-px"></div>
                </div>

                {selectedMonth.weekly.map((val, idx) => {
                  const maxWeekly = Math.max(...selectedMonth.weekly);
                  const barHeight = Math.max(15, (val / maxWeekly) * 80); // Calculate % height

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group z-10">
                      <div
                        style={{ height: `${barHeight}%` }}
                        className="w-12 bg-primary-accent/80 group-hover:bg-primary-accent rounded-t-lg transition-all relative flex justify-center shadow-md"
                      >
                        {/* Hover Weekly Value Tooltip */}
                        <span className="absolute -top-7 bg-zinc-950 text-[10px] text-white px-2 py-0.5 rounded border border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 font-mono shadow-xl">
                          ₹{(val / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">
                        Wk {idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setSelectedMonth(null)}
                className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all cursor-pointer text-xs"
              >
                Done / Close
              </button>
              <button
                onClick={() => {
                  setSelectedMonth(null);
                  setIsExporting(true);
                }}
                className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer text-xs shadow-lg shadow-emerald-600/25"
              >
                Export PDF Audit
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EXPORT PROGRESS MODAL */}
      {isExporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#111928] border border-zinc-800 rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl">
            
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white">Compiling Sheets</h3>
              <p className="text-zinc-400 text-xs mt-1">Generating custom Excel formatting templates...</p>
            </div>

            <div className="my-8 relative flex items-center justify-center">
              <div className="w-full space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500">Progress:</span>
                  <span className="text-white font-bold">{exportProgress}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-primary-accent transition-all duration-150"
                    style={{ width: `${exportProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="text-xs text-zinc-500">
              {exportProgress < 100 ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Encoding lines...
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
                  ✓ Ready! Download initialized.
                </span>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
