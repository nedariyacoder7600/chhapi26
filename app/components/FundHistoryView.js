"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const initialHistory = [
  { type: "Credit", entity: "Rajesh Patel", category: "Food Distribution", amount: 5000, date: "2026-06-10", time: "14:35", method: "UPI Gateway", color: "from-blue-600 to-indigo-600", note: "Approved contribution" },
  { type: "Debit", entity: "Kirana Wholesale Traders", category: "Food Distribution", amount: 15000, date: "2026-06-10", time: "16:10", method: "Bank Transfer", color: "from-zinc-700 to-zinc-800", note: "Purchased ration packs" },
  { type: "Credit", entity: "Simran Sheikh", category: "Emergency Medical Aid", amount: 1500, date: "2026-06-11", time: "09:12", method: "GPay Gateway", color: "from-amber-500 to-rose-600", note: "Approved contribution" },
  { type: "Debit", entity: "Metro Medical Supplies", category: "Emergency Medical Aid", amount: 25000, date: "2026-06-11", time: "11:55", method: "Corporate Card", color: "from-zinc-700 to-zinc-800", note: "Purchased insulin & emergency syringes" },
  { type: "Credit", entity: "Amit Verma", category: "Education Support", amount: 10000, date: "2026-06-08", time: "18:44", method: "Netbanking Credit", color: "from-emerald-400 to-teal-700", note: "Approved contribution" },
  { type: "Debit", entity: "Adarsh Book Store", category: "Education Support", amount: 8000, date: "2026-06-09", time: "10:30", method: "Cheque Clearing", color: "from-zinc-700 to-zinc-800", note: "Purchased notebooks for primary class distribution" },
];

export default function FundHistoryView() {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/dashbord") ? "/dashbord" : "/dashboard";

  const [history, setHistory] = useState(initialHistory);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Calculations
  const totalCredits = history.filter(h => h.type === "Credit").reduce((sum, h) => sum + h.amount, 0);
  const totalDebits = history.filter(h => h.type === "Debit").reduce((sum, h) => sum + h.amount, 0);

  const filteredHistory = history.filter((h) => {
    const matchesSearch =
      h.entity.toLowerCase().includes(search.toLowerCase()) ||
      h.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "ALL" || h.type === typeFilter;
    return matchesSearch && matchesType;
  });

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
            }, 800);
            return 100;
          }
          return prev + 10;
        });
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isExporting]);

  return (
    <div className="flex-1 p-6 lg:p-10 bg-[#070b12] text-zinc-100 min-h-screen relative overflow-y-auto">
      {/* Background decorations */}
      <div className="absolute top-[-5%] left-[-10%] w-[35%] h-[35%] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 relative">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">Fund Management</h1>
          <p className="text-zinc-400 mt-2 text-sm">Audit allocations, manage campaign budget limits, and track active fund balances.</p>
        </div>

        <button
          onClick={() => setIsExporting(true)}
          className="text-white text-xs font-bold px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 cursor-pointer border border-zinc-700/30 flex items-center gap-2 shadow-md"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Ledger
        </button>
      </header>

      {/* Navigation Tabs directly inside page layout */}
      <div className="flex border-b border-zinc-800/80 mb-8 z-10 relative overflow-x-auto no-scrollbar">
        <Link
          href={`${basePath}/fund-management/summary`}
          className="pb-4 px-6 text-sm font-semibold border-b-2 transition-all border-transparent text-zinc-500 hover:text-zinc-300 whitespace-nowrap"
        >
          Fund Summary
        </Link>
        <Link
          href={`${basePath}/fund-management/create`}
          className="pb-4 px-6 text-sm font-semibold border-b-2 transition-all border-transparent text-zinc-500 hover:text-zinc-300 whitespace-nowrap"
        >
          Create Fund
        </Link>
        <Link
          href={`${basePath}/fund-management/use`}
          className="pb-4 px-6 text-sm font-semibold border-b-2 transition-all border-transparent text-zinc-500 hover:text-zinc-300 whitespace-nowrap"
        >
          Use Fund
        </Link>
        <Link
          href={`${basePath}/fund-management/history`}
          className="pb-4 px-6 text-sm font-bold border-b-2 transition-all border-primary-accent text-white whitespace-nowrap"
        >
          Fund History
        </Link>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 z-10 relative">
        {/* Metric 1 */}
        <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Total Credited Donations</span>
          <h2 className="text-3xl font-extrabold text-emerald-400 mt-2">₹{totalCredits.toLocaleString("en-IN")}</h2>
          <p className="text-[11px] text-zinc-500 mt-1">Total inputs from approved contributors.</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Total Debited Expenses</span>
          <h2 className="text-3xl font-extrabold text-rose-400 mt-2">₹{totalDebits.toLocaleString("en-IN")}</h2>
          <p className="text-[11px] text-zinc-500 mt-1">Total deductions for project resources.</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Net Cashflow</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">₹{(totalCredits - totalDebits).toLocaleString("en-IN")}</h2>
          <p className="text-[11px] text-zinc-500 mt-1">Active ledger liquid balance.</p>
        </div>
      </div>

      {/* Filter controls row */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 z-10 relative">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by receiver, sender, or campaign category..."
            className="w-full bg-[#111928]/40 border border-zinc-800/80 rounded-2xl py-3.5 pl-12 pr-10 text-white placeholder-zinc-500 focus:outline-none focus:border-primary-accent focus:ring-4 focus:ring-primary-accent/15 transition-all text-sm"
          />
        </div>

        {/* Type Filter */}
        <div className="relative w-full md:w-56">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-[#111928]/40 border border-zinc-800/80 rounded-2xl py-3.5 pl-4 pr-10 text-white appearance-none focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
          >
            <option value="ALL" className="bg-[#0f172a]">All Transactions</option>
            <option value="Credit" className="bg-[#0f172a]">Credits (+)</option>
            <option value="Debit" className="bg-[#0f172a]">Debits (-)</option>
          </select>
          <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500 pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </div>
      </div>

      {/* Grid Table - Desktop Only */}
      <div className="hidden md:block bg-[#111928]/20 border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl z-10 relative backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#111928]/50 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-5 px-6">Sender / Receiver</th>
                <th className="py-5 px-6">Wallet Target</th>
                <th className="py-5 px-6">Transaction Type</th>
                <th className="py-5 px-6">Date & Time</th>
                <th className="py-5 px-6 text-right">Amount</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-sm">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                    {/* Entity Details */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color || 'from-zinc-700 to-zinc-800'} flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-inner`}>
                          {item.entity.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <span className="font-semibold text-white group-hover:text-primary-accent transition-all">
                          {item.entity}
                        </span>
                      </div>
                    </td>

                    {/* Campaign Wallet */}
                    <td className="py-4.5 px-6 text-zinc-300 font-medium">
                      {item.category}
                    </td>

                    {/* Type Badge */}
                    <td className="py-4.5 px-6">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shadow-sm ${
                        item.type === "Credit"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                      }`}>
                        {item.type === "Credit" ? "CREDIT WALLET" : "DEBIT DISBURSE"}
                      </span>
                    </td>

                    {/* Date Time */}
                    <td className="py-4.5 px-6">
                      <div className="flex flex-col">
                        <span className="text-zinc-400 font-mono">{item.date}</span>
                        <span className="text-[10px] text-zinc-600 mt-0.5">{item.time}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className={`py-4.5 px-6 text-right font-bold font-mono text-base ${
                      item.type === "Credit" ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {item.type === "Credit" ? "+" : "-"}₹{item.amount.toLocaleString("en-IN")}
                    </td>

                    {/* Actions */}
                    <td className="py-4.5 px-6 text-right">
                      <button
                        onClick={() => setSelectedAudit(item)}
                        className="text-xs font-semibold px-4 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer border border-zinc-800"
                      >
                        Audit Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-zinc-500">
                    No matching ledger audit trail history found.
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
          filteredHistory.map((item, idx) => (
            <div key={idx} className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-5 backdrop-blur-md shadow-md flex flex-col justify-between hover:border-zinc-700/50 transition-all group">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color || 'from-zinc-700 to-zinc-800'} flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-inner`}>
                    {item.entity.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <span className="font-semibold text-white text-base leading-tight group-hover:text-primary-accent transition-all">{item.entity}</span>
                </div>
                <span className={`font-bold font-mono text-base shrink-0 ${
                  item.type === "Credit" ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {item.type === "Credit" ? "+" : "-"}₹{item.amount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-zinc-800/40 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Target Wallet</span>
                  <span className="text-zinc-300 font-medium">{item.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Logged Date</span>
                  <span className="text-zinc-400 font-mono">{item.date} • {item.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Type</span>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border shadow-sm ${
                    item.type === "Credit"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  }`}>
                    {item.type === "Credit" ? "CREDIT WALLET" : "DEBIT DISBURSE"}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-zinc-800/40">
                <button
                  onClick={() => setSelectedAudit(item)}
                  className="w-full text-center py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold transition-all cursor-pointer text-xs border border-zinc-800"
                >
                  Audit Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#111928]/20 border border-zinc-800/50 rounded-3xl p-16 text-center text-zinc-500">
            No matching ledger audit trail history found.
          </div>
        )}
      </div>

      {/* DETAIL MODAL: TRANS SUMMARY DETAILED CARD (NO IDS VISIBLE) */}
      {selectedAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#111928] border border-zinc-800 rounded-3xl p-6 max-w-sm w-full relative shadow-2xl">
            <button
              onClick={() => setSelectedAudit(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
              Ledger Audit Log
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-zinc-800 pb-2.5">
                <span className="text-zinc-500">{selectedAudit.type === "Credit" ? "Contributor Sender" : "Receiver Vendor"}</span>
                <span className="font-semibold text-white">{selectedAudit.entity}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2.5">
                <span className="text-zinc-500">Wallet Target</span>
                <span className="font-semibold text-white">{selectedAudit.category}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2.5">
                <span className="text-zinc-500">Transaction Mode</span>
                <span className="font-semibold text-zinc-300">{selectedAudit.method}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2.5">
                <span className="text-zinc-500">Settled Date & Time</span>
                <span className="font-mono text-zinc-300">{selectedAudit.date} • {selectedAudit.time}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2.5">
                <span className="text-zinc-500">Audit Status Note</span>
                <span className="text-zinc-400 font-medium">{selectedAudit.note}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-zinc-500">Ledger Entry Type</span>
                <span className={`font-semibold ${selectedAudit.type === "Credit" ? "text-emerald-400" : "text-rose-400"}`}>
                  {selectedAudit.type === "Credit" ? "CAPITAL DEPOSIT" : "CAPITAL WITHDRAWAL"}
                </span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-3 text-sm">
                <span className="text-zinc-500 font-bold">Processed Amount</span>
                <span className={`font-mono font-extrabold ${selectedAudit.type === "Credit" ? "text-emerald-400" : "text-rose-400"}`}>
                  {selectedAudit.type === "Credit" ? "+" : "-"}₹{selectedAudit.amount.toLocaleString("en-IN")}.00
                </span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setSelectedAudit(null)}
                className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all cursor-pointer text-xs"
              >
                Close Audit details
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
