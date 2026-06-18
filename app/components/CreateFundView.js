"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function CreateFundView() {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/dashbord") ? "/dashbord" : "/dashboard";

  const [category, setCategory] = useState("");
  const [allocation, setAllocation] = useState("");
  const [description, setDescription] = useState("");
  const [themeColor, setThemeColor] = useState("from-violet-600 to-indigo-600");
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const themeThemes = [
    { name: "Neon Violet", class: "from-violet-600 to-indigo-600" },
    { name: "Sunset Gold", class: "from-amber-500 to-rose-600" },
    { name: "Emerald Mint", class: "from-emerald-400 to-teal-700" },
    { name: "Ocean Breeze", class: "from-cyan-500 to-blue-600" },
    { name: "Hot Crimson", class: "from-red-500 to-pink-600" },
  ];

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
    if (!category) {
      addToast("Campaign Category name is required.", "error");
      return;
    }
    if (!allocation || isNaN(allocation) || parseFloat(allocation) <= 0) {
      addToast("Please enter a valid allocation amount.", "error");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      addToast(`🎉 Fund Wallet for "${category}" successfully initialized!`, "success");
      
      // Reset
      setCategory("");
      setAllocation("");
      setDescription("");
      setThemeColor("from-violet-600 to-indigo-600");
    }, 1200);
  };

  return (
    <div className="flex-1 p-6 lg:p-10 bg-[#070b12] text-zinc-100 min-h-screen relative overflow-y-auto">
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
          className="pb-4 px-6 text-sm font-bold border-b-2 transition-all border-primary-accent text-white whitespace-nowrap"
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

      {/* Form and Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10 relative">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary-accent rounded-full"></span>
            Initialize New Wallet
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campaign Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Campaign Category / Name
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Winter Clothes Drive"
                className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3.5 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-primary-accent focus:ring-4 focus:ring-primary-accent/15 transition-all text-sm"
              />
            </div>

            {/* Allocation Amount */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Capital Allocation (INR)
              </label>
              <input
                type="number"
                required
                value={allocation}
                onChange={(e) => setAllocation(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3.5 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-primary-accent focus:ring-4 focus:ring-primary-accent/15 transition-all text-sm font-mono"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Wallet Description / Objective
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Briefly state project target and items budget plan..."
                className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-primary-accent focus:ring-4 focus:ring-primary-accent/15 transition-all text-sm"
              />
            </div>

            {/* Theme Colors selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Wallet Design Theme
              </label>
              <div className="flex items-center gap-2.5 py-1">
                {themeThemes.map((theme) => (
                  <button
                    key={theme.name}
                    type="button"
                    onClick={() => setThemeColor(theme.class)}
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${
                      theme.class
                    } border-2 transition-all hover:scale-110 cursor-pointer relative ${
                      themeColor === theme.class
                        ? "border-white scale-105 shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                        : "border-transparent"
                    }`}
                    title={theme.name}
                  >
                    {themeColor === theme.class && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-[10px]">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: "var(--primary-accent)" }}
              className="w-full text-white font-bold py-4 rounded-2xl transition-all duration-300 mt-4 shadow-lg hover:shadow-primary-accent/30 cursor-pointer flex justify-center items-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Allocating Funds...</span>
                </>
              ) : (
                <span>Initialize Wallet</span>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full sticky top-8 space-y-6">
            
            <div className="text-center lg:text-left">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Fund Wallet Card Preview
              </h3>
              <p className="text-xs text-zinc-400">
                Observe the generated target wallet card render live.
              </p>
            </div>

            {/* Premium Wallet Card */}
            <div className="w-full bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col justify-between aspect-[1.586/1] max-w-md mx-auto group">
              
              {/* Radial glow background based on selected gradient */}
              <div className={`absolute -right-16 -top-16 w-36 h-36 rounded-full bg-gradient-to-br ${themeColor} opacity-20 blur-2xl group-hover:scale-125 transition-transform duration-700`}></div>

              {/* Card Top */}
              <div className="flex justify-between items-start z-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                    PROJECT FUND WALLET
                  </span>
                  <span className="text-xl font-extrabold text-white tracking-wide mt-1 truncate max-w-[220px] block">
                    {category || "Campaign Category"}
                  </span>
                </div>

                {/* Secure Chip Vector */}
                <div className="w-10 h-8 rounded bg-gradient-to-br from-amber-400/80 to-yellow-600/80 border border-amber-300/30 flex flex-col justify-between p-1.5 shadow-md shrink-0">
                  <div className="h-px bg-zinc-950/20 w-full"></div>
                  <div className="h-px bg-zinc-950/20 w-full"></div>
                  <div className="h-px bg-zinc-950/20 w-full"></div>
                </div>
              </div>

              {/* Card Middle Balance */}
              <div className="my-4 z-10">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">
                  Allocated Capital balance
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-1 font-mono">
                  ₹{allocation ? parseFloat(allocation).toLocaleString("en-IN") : "0"}.00
                </h2>
              </div>

              {/* Card Bottom */}
              <div className="flex justify-between items-end z-10 border-t border-zinc-800/40 pt-4 text-xs">
                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">
                    LIMIT SPECIFICATION
                  </span>
                  <span className="font-semibold text-zinc-300 mt-0.5 max-w-[200px] truncate block">
                    {description || "No specific limit notes."}
                  </span>
                </div>

                {/* Badge decoration */}
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 uppercase tracking-wider shrink-0`}>
                  ACTIVE
                </span>
              </div>

            </div>

            {/* Information note */}
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 max-w-md mx-auto text-xs text-zinc-500 flex gap-3">
              <svg className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="leading-relaxed">
                Fund wallets initialized here default to <strong>Audited</strong> status and allocations can be instantly spent using the <strong>Use Fund</strong> panel.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
