"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUsers, setCurrentUser, getCurrentUser, addAuditLog } from "./utils/db";


export default function Home() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoSelector, setShowDemoSelector] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Auto-redirect if already logged in
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      router.push("/dashboard");
    }
  }, [router]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!mobile || mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    setIsLoading(true);

    // Simulate database lookup
    setTimeout(() => {
      const usersList = getUsers();
      const matchedUser = usersList.find((u) => u.mobile === mobile);

      if (!matchedUser) {
        setError("Account not found. Check your mobile number.");
        setIsLoading(false);
        return;
      }

      if (matchedUser.password !== password) {
        setError("Incorrect password. Please try again.");
        setIsLoading(false);
        return;
      }

      if (matchedUser.status === "Inactive") {
        setError("Your account is currently inactive. Contact Super Admin.");
        setIsLoading(false);
        return;
      }

      // Successful login
      setCurrentUser(matchedUser);
      addAuditLog("User Login", `Successfully signed into the dashboard (${matchedUser.role})`);
      addToast(`Welcome back, ${matchedUser.name}!`, "success");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }, 800);
  };

  // Demo accounts data
  const demoAccounts = [
    { name: "Amir bhai", role: "SUPER_ADMIN", mobile: "9876543210", pass: "Amir@786", color: "from-red-500 to-pink-600" },
    { name: "Mohammad Yunus", role: "SUPER_ADMIN", mobile: "7600526010", pass: "Qaswa@786", color: "from-violet-600 to-indigo-600" },
    { name: "Amir Admin", role: "ADMIN", mobile: "9104092123", pass: "Amir@123", color: "from-amber-500 to-rose-600" },
    { name: "Rahul Sharma", role: "USER", mobile: "9900887766", pass: "Rahul@123", color: "from-cyan-500 to-blue-600" },
  ];

  const handleQuickLogin = (demo) => {
    setIsLoading(true);
    setTimeout(() => {
      const usersList = getUsers();
      const dbUser = usersList.find((u) => u.mobile === demo.mobile) || {
        id: Date.now(),
        name: demo.name,
        mobile: demo.mobile,
        password: demo.pass,
        role: demo.role,
        status: "Active",
        joined: "2026-06-13",
        donations: demo.role === "USER" ? 8500 : 0,
        color: demo.color
      };

      setCurrentUser(dbUser);
      addAuditLog("User Login", `Developer sandbox session forced as ${dbUser.name} (${dbUser.role})`);
      addToast(`Logged in as ${dbUser.name} (${dbUser.role})`, "success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    }, 400);
  };

  return (
    <div className="dashboard-light-theme min-h-screen bg-[#070b12] text-zinc-100 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      
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
              <span className={`w-2 h-2 rounded-full ${toast.type === "error" ? "bg-red-400" : "bg-emerald-400 animate-pulse"}`}></span>
            </div>
            <div className="text-sm font-medium">{toast.message}</div>
          </div>
        ))}
      </div>

      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#4a154b]/10 blur-[150px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur-md shadow-2xl z-10 space-y-6 animate-[fadeIn_0.3s_ease-out]">
        
        {/* Logo Icon */}
        <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center mx-auto border border-white/10 shadow-lg shadow-white/5">
          <img src="/logo.png" alt="Chhapi Donation Logo" className="w-full h-full object-cover" />
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Chhapi Donation</h1>
          <p className="text-xs text-zinc-400">Community Contributions & allocations Panel</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3.5 text-xs text-red-400 font-semibold text-center animate-shake">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Mobile Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-zinc-600 font-mono text-sm">+91</span>
              <input
                type="tel"
                maxLength={10}
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 10-digit number"
                className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-2xl py-3 pl-14 pr-4 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#4a154b] focus:ring-4 focus:ring-[#4a154b]/10 transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Password</label>
              <span className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer font-semibold">Forgot?</span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1e293b]/20 border border-zinc-800 rounded-2xl py-3 px-4 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#4a154b] focus:ring-4 focus:ring-[#4a154b]/10 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-[#4a154b] hover:bg-[#3d113e] text-white text-sm font-bold py-3.5 rounded-2xl tracking-wide transition-all shadow-lg shadow-[#4a154b]/10 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Demo accounts selector button */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setShowDemoSelector(!showDemoSelector)}
            className="text-xs font-semibold text-zinc-400 hover:text-white underline cursor-pointer decoration-dotted underline-offset-4"
          >
            {showDemoSelector ? "Hide Developer bypass panel" : "View Developer bypass panel"}
          </button>
        </div>

        {/* Demo bypass panel */}
        {showDemoSelector && (
          <div className="bg-[#1e293b]/20 border border-zinc-800 rounded-2xl p-4 mt-2 space-y-3.5 animate-[fadeIn_0.20s_ease-out]">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block text-center">Quick Login (One-Click Bypass)</span>
            <div className="grid grid-cols-2 gap-2 text-left">
              {demoAccounts.map((demo) => (
                <button
                  key={demo.mobile}
                  type="button"
                  onClick={() => handleQuickLogin(demo)}
                  className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors hover:bg-zinc-900/40 text-left cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white leading-tight truncate">{demo.name}</div>
                    <span className="text-[9px] text-zinc-500 font-mono mt-0.5 block truncate">+91 {demo.mobile}</span>
                  </div>
                  <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded mt-2 border self-start ${
                    demo.role === "SUPER_ADMIN" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                    demo.role === "ADMIN" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                    "bg-blue-500/10 border-blue-500/20 text-blue-400"
                  }`}>
                    {demo.role}
                  </span>
                </button>
              ))}
            </div>
            <div className="text-[9px] text-zinc-600 font-mono text-center leading-relaxed">
              Pills trigger session creation and redirect instantly.
            </div>
          </div>
        )}

        {/* Bottom security stamp */}
        <div className="text-[10px] text-zinc-700 font-mono tracking-wider pt-2 uppercase text-center border-t border-zinc-800/40">
          authorized personnel only • encrypted session
        </div>

      </div>
    </div>
  );
}
