"use client";

import React from "react";

export default function FundOverviewView() {
  const fundsBreakdown = [
    { category: "Food Distribution", allocated: 150000, spent: 120000, remaining: 30000, color: "bg-blue-500" },
    { category: "Emergency Medical Aid", allocated: 250000, spent: 210000, remaining: 40000, color: "bg-emerald-500" },
    { category: "Education Support", allocated: 100000, spent: 85000, remaining: 15000, color: "bg-purple-500" },
    { category: "Water Well Installation", allocated: 180000, spent: 150000, remaining: 30000, color: "bg-amber-500" },
  ];

  const totalAllocated = fundsBreakdown.reduce((sum, f) => sum + f.allocated, 0);
  const totalSpent = fundsBreakdown.reduce((sum, f) => sum + f.spent, 0);
  const totalRemaining = fundsBreakdown.reduce((sum, f) => sum + f.remaining, 0);

  return (
    <div className="flex-1 flex flex-col p-8 bg-[#070b12] text-zinc-100 min-h-screen">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-white tracking-wide">Fund Management</h1>
        <p className="text-sm text-zinc-400 mt-1">Audit log of system resources, allocations, and expenditures.</p>
      </header>

      {/* Main Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#111928]/60 border border-zinc-800/50 rounded-2xl p-6">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Funds Allocated</span>
          <h2 className="text-3xl font-bold text-white mt-1">₹{totalAllocated.toLocaleString("en-IN")}</h2>
        </div>

        <div className="bg-[#111928]/60 border border-zinc-800/50 rounded-2xl p-6">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Expended</span>
          <h2 className="text-3xl font-bold text-red-400 mt-1">₹{totalSpent.toLocaleString("en-IN")}</h2>
        </div>

        <div className="bg-[#111928]/60 border border-zinc-800/50 rounded-2xl p-6">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Available Balance</span>
          <h2 className="text-3xl font-bold text-emerald-400 mt-1">₹{totalRemaining.toLocaleString("en-IN")}</h2>
        </div>
      </div>

      {/* Funds breakdown table */}
      <h3 className="text-lg font-medium text-white mb-4">Allocation Breakdown</h3>
      <div className="bg-[#111928]/40 border border-zinc-800/50 rounded-2xl overflow-hidden shadow-xl mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#111928]/80 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-4 px-6">Campaign Category</th>
                <th className="py-4 px-6">Allocated Amount</th>
                <th className="py-4 px-6">Spent Amount</th>
                <th className="py-4 px-6">Remaining Balance</th>
                <th className="py-4 px-6">Distribution Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-sm">
              {fundsBreakdown.map((fund, idx) => {
                const percent = Math.round((fund.spent / fund.allocated) * 100);
                return (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${fund.color}`}></span>
                      {fund.category}
                    </td>
                    <td className="py-4 px-6 font-mono text-zinc-300">₹{fund.allocated.toLocaleString("en-IN")}</td>
                    <td className="py-4 px-6 font-mono text-red-400">₹{fund.spent.toLocaleString("en-IN")}</td>
                    <td className="py-4 px-6 font-mono text-emerald-400 font-bold">₹{fund.remaining.toLocaleString("en-IN")}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-zinc-800 rounded-full h-2">
                          <div
                            style={{ width: `${percent}%` }}
                            className={`h-2 rounded-full ${fund.color}`}
                          ></div>
                        </div>
                        <span className="text-xs text-zinc-400 font-mono">{percent}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
