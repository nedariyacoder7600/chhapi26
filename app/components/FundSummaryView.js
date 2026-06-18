"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getFunds } from "../utils/db";
import Link from "next/link";

export default function FundSummaryView() {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/dashbord") ? "/dashbord" : "/dashboard";

  const [funds, setFunds] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setFunds(getFunds());
    const handleDbUpdate = () => {
      setFunds(getFunds());
    };
    window.addEventListener("chhapi_db_update", handleDbUpdate);
    return () => {
      window.removeEventListener("chhapi_db_update", handleDbUpdate);
    };
  }, []);

  const totalAllocated = funds.reduce((sum, f) => sum + f.allocated, 0);
  const totalSpent = funds.reduce((sum, f) => sum + f.spent, 0);
  const totalRemaining = funds.reduce((sum, f) => sum + f.remaining, 0);

  const filteredFunds = funds.filter((f) =>
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 lg:p-10 bg-[#070b12] text-zinc-100 min-h-screen relative overflow-y-auto">
      {/* Background decorations */}
      <div className="absolute top-[-5%] left-[-10%] w-[35%] h-[35%] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="mb-8 z-10 relative">
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">Fund Management</h1>
        <p className="text-zinc-400 mt-2 text-sm">Audit allocations, manage campaign budget limits, and track active fund balances.</p>
      </header>

      {/* Navigation Tabs directly inside page layout */}
      <div className="flex border-b border-zinc-800/80 mb-8 z-10 relative overflow-x-auto no-scrollbar">
        <Link
          href={`${basePath}/fund-management/summary`}
          className="pb-4 px-6 text-sm font-bold border-b-2 transition-all border-primary-accent text-white whitespace-nowrap"
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
          className="pb-4 px-6 text-sm font-semibold border-b-2 transition-all border-transparent text-zinc-500 hover:text-zinc-300 whitespace-nowrap"
        >
          Fund History
        </Link>
      </div>

      {/* Metrics breakdown row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 z-10 relative">
        {/* Metric 1 */}
        <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Total Allocated Capital</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">₹{totalAllocated.toLocaleString("en-IN")}</h2>
          <p className="text-[11px] text-zinc-500 mt-1">Total assigned project resources.</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Total Expended Funds</span>
          <h2 className="text-3xl font-extrabold text-rose-400 mt-2">₹{totalSpent.toLocaleString("en-IN")}</h2>
          <p className="text-[11px] text-zinc-500 mt-1">Deducted amounts for active programs.</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Available Balance</span>
          <h2 className="text-3xl font-extrabold text-emerald-400 mt-2">₹{totalRemaining.toLocaleString("en-IN")}</h2>
          <p className="text-[11px] text-zinc-500 mt-1">Net wallet balance remaining.</p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative mb-6 z-10 relative">
        <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter allocations by campaign category..."
          className="w-full bg-[#111928]/40 border border-zinc-800/80 rounded-2xl py-3.5 pl-12 pr-10 text-white placeholder-zinc-500 focus:outline-none focus:border-primary-accent focus:ring-4 focus:ring-primary-accent/15 transition-all text-sm"
        />
      </div>

      {/* Table grid - Desktop Only */}
      <div className="hidden md:block bg-[#111928]/20 border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl z-10 relative backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#111928]/50 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-5 px-6">Campaign Category</th>
                <th className="py-5 px-6">Allocated Amount</th>
                <th className="py-5 px-6">Spent Amount</th>
                <th className="py-5 px-6">Remaining Balance</th>
                <th className="py-5 px-6">Distribution Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-sm">
              {filteredFunds.length > 0 ? (
                filteredFunds.map((fund, idx) => {
                  const percent = Math.round((fund.spent / fund.allocated) * 100);
                  return (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4.5 px-6 font-semibold text-white flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${fund.color} shrink-0`}></span>
                        {fund.category}
                      </td>
                      <td className="py-4.5 px-6 font-mono text-zinc-300">₹{fund.allocated.toLocaleString("en-IN")}</td>
                      <td className="py-4.5 px-6 font-mono text-rose-400">₹{fund.spent.toLocaleString("en-IN")}</td>
                      <td className="py-4.5 px-6 font-mono text-emerald-400 font-bold">₹{fund.remaining.toLocaleString("en-IN")}</td>
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-3 min-w-[150px]">
                          <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800/60">
                            <div
                              style={{ width: `${percent}%` }}
                              className={`h-2 rounded-full ${fund.color} transition-all duration-1000`}
                            ></div>
                          </div>
                          <span className="text-xs text-zinc-400 font-mono shrink-0">{percent}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-zinc-500">
                    No matching campaign allocation funds found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card Layout - Mobile Only */}
      <div className="md:hidden space-y-4 z-10 relative">
        {filteredFunds.length > 0 ? (
          filteredFunds.map((fund, idx) => {
            const percent = Math.round((fund.spent / fund.allocated) * 100);
            return (
              <div key={idx} className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-5 backdrop-blur-md shadow-md flex flex-col justify-between hover:border-zinc-700/50 transition-all group">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${fund.color} shrink-0`}></span>
                    <span className="font-semibold text-white text-base leading-tight group-hover:text-primary-accent transition-all">{fund.category}</span>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono text-base shrink-0">₹{fund.remaining.toLocaleString("en-IN")}</span>
                </div>

                <div className="space-y-2.5 mt-4 pt-4 border-t border-zinc-800/40 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Allocated Amount</span>
                    <span className="text-zinc-300 font-mono">₹{fund.allocated.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Spent Amount</span>
                    <span className="text-rose-400 font-mono">₹{fund.spent.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-800/20">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Remaining Balance</span>
                      <span className="text-emerald-400 font-bold font-mono">₹{fund.remaining.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800/60">
                        <div
                          style={{ width: `${percent}%` }}
                          className={`h-2 rounded-full ${fund.color} transition-all duration-1000`}
                        ></div>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono shrink-0">{percent}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-[#111928]/20 border border-zinc-800/50 rounded-3xl p-16 text-center text-zinc-500">
            No matching campaign allocation funds found.
          </div>
        )}
      </div>
    </div>
  );
}
