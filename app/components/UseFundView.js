"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const initialWallets = [
  { category: "Food Distribution", remaining: 30000, color: "bg-blue-500" },
  { category: "Emergency Medical Aid", remaining: 40000, color: "bg-emerald-500" },
  { category: "Education Support", remaining: 15000, color: "bg-purple-500" },
  { category: "Water Well Installation", remaining: 30000, color: "bg-amber-500" },
];

export default function UseFundView() {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/dashbord") ? "/dashbord" : "/dashboard";

  const [wallets, setWallets] = useState(initialWallets);
  const [selectedWallet, setSelectedWallet] = useState(initialWallets[0].category);
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [vendor, setVendor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const activeWallet = wallets.find((w) => w.category === selectedWallet);
    if (!activeWallet) return;

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      addToast("Please enter a valid amount.", "error");
      return;
    }
    if (parseFloat(amount) > activeWallet.remaining) {
      addToast(`❌ Insufficient funds in ${selectedWallet} wallet!`, "error");
      return;
    }
    if (!purpose) {
      addToast("Purpose of expense is required.", "error");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      // Deduct funds locally
      setWallets(
        wallets.map((w) =>
          w.category === selectedWallet
            ? { ...w, remaining: w.remaining - parseFloat(amount) }
            : w
        )
      );

      addToast(`✅ Successfully disbursed ₹${parseFloat(amount).toLocaleString("en-IN")} for ${purpose}!`, "success");
      
      // Reset fields
      setAmount("");
      setPurpose("");
      setVendor("");
    }, 1200);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 sm:pb-12 bg-[#070b12] text-zinc-100 relative">
      {/* Toast Notification Container */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
          className="pb-4 px-6 text-sm font-bold border-b-2 transition-all border-primary-accent text-white whitespace-nowrap"
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

      {/* Form and Available Balances Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10 relative">
        
        {/* Left Column: Disburse Form */}
        <div className="lg:col-span-7 bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
            Disburse Fund Capital
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Source Wallet */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Select Source Fund Wallet
              </label>
              <div className="relative">
                <select
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3.5 px-4 text-white appearance-none focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
                >
                  {wallets.map((w) => (
                    <option key={w.category} value={w.category} className="bg-[#0f172a]">
                      {w.category} (Remaining: ₹{w.remaining.toLocaleString("en-IN")})
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

            {/* Spend Amount */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Disbursement Amount (INR)
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3.5 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-primary-accent focus:ring-4 focus:ring-primary-accent/15 transition-all text-sm font-mono"
              />
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Purpose / Description of Expense
              </label>
              <input
                type="text"
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Purchased 50 Ration kits for distribution"
                className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3.5 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-primary-accent focus:ring-4 focus:ring-primary-accent/15 transition-all text-sm"
              />
            </div>

            {/* Target Vendor */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Target Vendor / Receiver (Optional)
              </label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="e.g. Kirana Wholesale Suppliers"
                className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3.5 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-primary-accent focus:ring-4 focus:ring-primary-accent/15 transition-all text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-rose-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 mt-4 shadow-lg hover:shadow-rose-600/30 cursor-pointer flex justify-center items-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Disbursing Capital...</span>
                </>
              ) : (
                <span>Confirm Spend Allocation</span>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Active Balances Tracker */}
        <div className="lg:col-span-5 bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md shadow-2xl space-y-6">
          <div>
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Active Wallet Registers
            </h3>
            <p className="text-xs text-zinc-400">
              Disbursable funds remaining in each system program.
            </p>
          </div>

          <div className="space-y-4">
            {wallets.map((w) => (
              <div key={w.category} className="p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl flex justify-between items-center hover:bg-zinc-900/60 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${w.color}`}></span>
                  <span className="text-xs font-semibold text-zinc-300">{w.category}</span>
                </div>
                <span className="font-bold font-mono text-sm text-emerald-400">
                  ₹{w.remaining.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
