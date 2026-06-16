"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCurrentUser, getDonationsHistory, getPendingDonations } from "../utils/db";

export default function DonationsHistoryView({ forceMyDonations = false }) {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/dashbord") ? "/dashbord" : "/dashboard";

  const [currentUser, setCurrentUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [monthFilter, setMonthFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    const loadData = () => {
      const hist = getDonationsHistory();
      const pend = getPendingDonations();
      
      const mappedHist = hist.map(h => ({
        ...h,
        status: h.status === "Completed" ? "Approved" : h.status
      }));

      const mappedPend = pend.map(p => ({
        ...p,
        status: "Pending"
      }));

      setHistory([...mappedPend, ...mappedHist]);
    };

    loadData();

    const handleDbUpdate = () => {
      loadData();
    };
    window.addEventListener("chhapi_db_update", handleDbUpdate);
    return () => {
      window.removeEventListener("chhapi_db_update", handleDbUpdate);
    };
  }, []);

  // Export progress simulation
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
            }, 850);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isExporting]);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === "SUPER_ADMIN" || currentUser.role === "ADMIN";
  const displayOnlyMy = forceMyDonations || !isAdmin;

  // Filter list by role: admins see all, regular user / forced-my-donations sees only their own payments
  const roleHistory = displayOnlyMy 
    ? history.filter((h) => h.mobile === currentUser.mobile)
    : history;

  // Filter by search, campaign, status, month, and year dropdowns
  const filteredHistory = roleHistory.filter((h) => {
    // 1. Search filter
    const matchesSearch = search.trim() === "" || (
      h.campaign.toLowerCase().includes(search.toLowerCase()) ||
      (h.bank && h.bank.toLowerCase().includes(search.toLowerCase())) ||
      (h.status && h.status.toLowerCase().includes(search.toLowerCase())) ||
      (h.date && h.date.includes(search)) ||
      (h.amount && h.amount.toString().includes(search)) ||
      (!displayOnlyMy && (
        h.name.toLowerCase().includes(search.toLowerCase()) || 
        h.mobile.includes(search)
      ))
    );

    // 2. Campaign filter
    const matchesCampaign = campaignFilter === "ALL" || h.campaign === campaignFilter;

    // 3. Status filter
    const matchesStatus = statusFilter === "ALL" || h.status === statusFilter;

    // 4. Month filter (date format: YYYY-MM-DD)
    let matchesMonth = true;
    if (monthFilter !== "ALL" && h.date) {
      const parts = h.date.split("-");
      if (parts.length >= 2) {
        matchesMonth = parts[1] === monthFilter;
      } else {
        matchesMonth = false;
      }
    }

    // 5. Year filter
    let matchesYear = true;
    if (yearFilter !== "ALL" && h.date) {
      const parts = h.date.split("-");
      matchesYear = parts[0] === yearFilter;
    }

    return matchesSearch && matchesCampaign && matchesStatus && matchesMonth && matchesYear;
  });

  // Calculations for stats based on the active role context
  const totalVolume = filteredHistory.reduce((sum, h) => sum + h.amount, 0);
  const totalTransactions = filteredHistory.length;
  const averageDonation = totalTransactions > 0 ? Math.round(totalVolume / totalTransactions) : 0;

  // Filter options list
  const campaignsList = ["ALL", ...new Set(roleHistory.map((h) => h.campaign))];
  const statusesList = ["ALL", "Pending", "Approved", "Rejected"];
  
  const getDynamicYears = () => {
    const years = new Set();
    roleHistory.forEach((h) => {
      if (h.date) {
        const y = h.date.split("-")[0];
        if (y) years.add(Number(y));
      }
    });
    years.add(new Date().getFullYear());
    
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    return ["ALL", ...sortedYears.map(String)];
  };
  const yearsList = getDynamicYears();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="flex-1 p-6 lg:p-10 bg-[#070b12] text-zinc-100 min-h-screen relative overflow-y-auto">
      {/* Background decorations */}
      <div className="absolute top-[-5%] left-[-10%] w-[35%] h-[35%] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 relative">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            {displayOnlyMy ? "My Donations History" : "Audited History"}
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            {displayOnlyMy 
              ? "Review your completed contributions and download verified audit receipts."
              : "Review fully verified contributions, campaign assignments, and receipt clearances."}
          </p>
        </div>

        <button
          onClick={() => setIsExporting(true)}
          className="text-white text-xs font-bold px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 cursor-pointer border border-zinc-700/30 flex items-center gap-2 shadow-md"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {displayOnlyMy ? "Download My Statement" : "Export Audit Sheets"}
        </button>
      </header>

      {/* Navigation Tabs - Hide monthly summaries for regular users */}
      {!displayOnlyMy && (
        <div className="flex border-b border-zinc-800/80 mb-8 z-10 relative">
          <a
            href={`${basePath}/donations-history`}
            className="pb-4 px-6 text-sm font-bold border-b-2 transition-all border-primary-accent text-white"
          >
            All Donation List
          </a>
          <a
            href={`${basePath}/donations-history/monthly`}
            className="pb-4 px-6 text-sm font-semibold border-b-2 transition-all border-transparent text-zinc-500 hover:text-zinc-300"
          >
            Monthly Summary Report
          </a>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 z-10 relative">
        <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
            {displayOnlyMy ? "My Settled Donations" : "Settled Donations"}
          </span>
          <h2 className="text-3xl font-extrabold text-emerald-400 mt-2">₹{totalVolume.toLocaleString("en-IN")}</h2>
          <p className="text-[11px] text-zinc-500 mt-1">Total volume credited to wallets.</p>
        </div>

        <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
            {displayOnlyMy ? "My Transaction Counts" : "Transactions Clearances"}
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-2">{totalTransactions} receipts</h2>
          <p className="text-[11px] text-zinc-500 mt-1">Audit ledger verified count.</p>
        </div>

        <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Avg Ledger Credit</span>
          <h2 className="text-3xl font-extrabold text-amber-400 mt-2">₹{averageDonation.toLocaleString("en-IN")}</h2>
          <p className="text-[11px] text-zinc-500 mt-1">Average contribution amount.</p>
        </div>
      </div>

      {/* Filters and search row */}
      <div className="flex flex-col gap-4 mb-6 z-10 relative">
        {/* Search */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={displayOnlyMy ? "Search campaign, bank, reference, status, amount..." : "Search contributor name, mobile, campaign, bank..."}
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

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {/* Campaign Filter */}
          <div className="relative w-full">
            <select
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              className="w-full bg-[#111928]/40 border border-zinc-800/80 rounded-2xl py-3.5 pl-4 pr-10 text-white appearance-none focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
            >
              {campaignsList.map((camp) => (
                <option key={camp} value={camp} className="bg-[#0f172a]">
                  {camp === "ALL" ? "All Campaigns" : camp}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500 pointer-events-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>

          {/* Status Filter */}
          <div className="relative w-full">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#111928]/40 border border-zinc-800/80 rounded-2xl py-3.5 pl-4 pr-10 text-white appearance-none focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
            >
              {statusesList.map((st) => (
                <option key={st} value={st} className="bg-[#0f172a]">
                  {st === "ALL" ? "All Statuses" : st}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500 pointer-events-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>

          {/* Month Filter */}
          <div className="relative w-full">
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full bg-[#111928]/40 border border-zinc-800/80 rounded-2xl py-3.5 pl-4 pr-10 text-white appearance-none focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
            >
              <option value="ALL" className="bg-[#0f172a]">All Months</option>
              {monthNames.map((month, idx) => (
                <option key={month} value={String(idx + 1).padStart(2, '0')} className="bg-[#0f172a]">
                  {month}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500 pointer-events-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>

          {/* Year Filter */}
          <div className="relative w-full">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full bg-[#111928]/40 border border-zinc-800/80 rounded-2xl py-3.5 pl-4 pr-10 text-white appearance-none focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
            >
              {yearsList.map((year) => (
                <option key={year} value={year} className="bg-[#0f172a]">
                  {year === "ALL" ? "All Years" : year}
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

      {/* Table Container - Desktop Only */}
      <div className="hidden md:block bg-[#111928]/20 border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl z-10 relative backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#111928]/50 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-5 px-6">Contributor</th>
                <th className="py-5 px-6">Donation Campaign</th>
                <th className="py-5 px-6">Amount (INR)</th>
                <th className="py-5 px-6">Settlement Date</th>
                <th className="py-5 px-6">Status</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-sm">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color || 'from-zinc-700 to-zinc-800'} flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-inner`}>
                          {item.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-white group-hover:text-primary-accent transition-all">
                            {item.name}
                          </span>
                          <span className="text-xs text-zinc-500 font-mono mt-0.5">
                            +91 {item.mobile}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-zinc-300 font-medium">{item.campaign}</td>
                    <td className="py-4.5 px-6">
                      <span className="text-emerald-400 font-bold font-mono text-base">₹{item.amount.toLocaleString("en-IN")}</span>
                    </td>
                    <td className="py-4.5 px-6 text-zinc-400 font-mono">{item.date}</td>
                    <td className="py-4.5 px-6">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        item.status === "Approved" || item.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : item.status === "Pending"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === "Approved" || item.status === "Completed"
                            ? "bg-emerald-400 animate-pulse"
                            : item.status === "Pending"
                            ? "bg-amber-400 animate-pulse"
                            : "bg-red-400"
                        }`}></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <button
                        onClick={() => setSelectedRecord(item)}
                        className="text-xs font-semibold px-4 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer border border-zinc-800"
                      >
                        Audit Summary
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-zinc-500">
                    <span>No transaction history logs found.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card Layout - Mobile Only */}
      <div className="md:hidden space-y-4 z-10 relative">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <div key={item.id} className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-5 backdrop-blur-md shadow-md flex flex-col justify-between hover:border-zinc-700/50 transition-all group">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color || 'from-zinc-700 to-zinc-800'} flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-inner`}>
                    {item.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white text-base leading-tight group-hover:text-primary-accent transition-all">{item.name}</span>
                    <span className="text-xs text-zinc-500 font-mono mt-1">+91 {item.mobile}</span>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold font-mono text-base shrink-0">₹{item.amount.toLocaleString("en-IN")}</span>
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-zinc-800/40 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Campaign</span>
                  <span className="text-zinc-300 font-medium">{item.campaign}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Settled Date</span>
                  <span className="text-zinc-400 font-mono">{item.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status</span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    item.status === "Approved" || item.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : item.status === "Pending"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      item.status === "Approved" || item.status === "Completed"
                        ? "bg-emerald-400 animate-pulse"
                        : item.status === "Pending"
                        ? "bg-amber-400 animate-pulse"
                        : "bg-red-400"
                    }`}></span>
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-zinc-800/40">
                <button
                  onClick={() => setSelectedRecord(item)}
                  className="w-full text-center py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold transition-all cursor-pointer text-xs border border-zinc-800"
                >
                  Audit Summary
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#111928]/20 border border-zinc-800/50 rounded-3xl p-16 text-center text-zinc-500">
            <span>No transaction history logs found.</span>
          </div>
        )}
      </div>

      {/* DETAIL SUMMARY MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#111928] border border-zinc-800 rounded-3xl p-6 max-w-sm w-full relative shadow-2xl">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
              Audit Summary Ledger
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-zinc-800 pb-2.5">
                <span className="text-zinc-500">Sender Name</span>
                <span className="font-semibold text-white">{selectedRecord.name}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2.5">
                <span className="text-zinc-500">Contact Number</span>
                <span className="font-mono text-zinc-300">+91 {selectedRecord.mobile}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2.5">
                <span className="text-zinc-500">Target Campaign</span>
                <span className="font-semibold text-white">{selectedRecord.campaign}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2.5">
                <span className="text-zinc-500">Settled Amount</span>
                <span className="font-bold text-emerald-400">₹{selectedRecord.amount.toLocaleString("en-IN")}.00</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2.5">
                <span className="text-zinc-500">Settlement Gateway</span>
                <span className="text-zinc-300">{selectedRecord.bank}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-zinc-500">Clearance Status</span>
                <span className={`font-semibold inline-flex items-center gap-1 ${
                  selectedRecord.status === "Approved" || selectedRecord.status === "Completed"
                    ? "text-emerald-400"
                    : selectedRecord.status === "Pending"
                    ? "text-amber-400"
                    : "text-red-400"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedRecord.status === "Approved" || selectedRecord.status === "Completed"
                      ? "bg-emerald-400 animate-pulse"
                      : selectedRecord.status === "Pending"
                      ? "bg-amber-400 animate-pulse"
                      : "bg-red-400"
                  }`}></span>
                  {selectedRecord.status}
                </span>
              </div>
              {selectedRecord.reason && (
                <div className="flex justify-between border-t border-zinc-800/40 pt-2.5 mt-2.5">
                  <span className="text-zinc-500">Rejection Reason</span>
                  <span className="text-red-400 italic text-right font-medium max-w-[180px] break-words">{selectedRecord.reason}</span>
                </div>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all cursor-pointer text-xs"
              >
                Close Summary
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
                  ✓ Ready! Statement download initialized.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
