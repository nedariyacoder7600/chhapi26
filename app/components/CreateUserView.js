"use client";

import React, { useState, useEffect } from "react";
import { getCurrentUser, getUsers, saveUsers } from "../utils/db";

export default function CreateUserView() {
  const [currentUser, setCurrentUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [whatsappGroup, setWhatsappGroup] = useState("");
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarColor, setAvatarColor] = useState("from-violet-600 to-indigo-600");
  const [toasts, setToasts] = useState([]);

  // Mock avatar color choices
  const avatarThemes = [
    { name: "Neon Violet", class: "from-violet-600 to-indigo-600" },
    { name: "Sunset Gold", class: "from-amber-500 to-rose-600" },
    { name: "Emerald Mint", class: "from-emerald-400 to-teal-700" },
    { name: "Ocean Breeze", class: "from-cyan-500 to-blue-600" },
    { name: "Hot Crimson", class: "from-red-500 to-pink-600" },
  ];

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setUsersList(getUsers());

    // Set default role if admin (admins can only create users)
    if (user && user.role === "ADMIN") {
      setRole("USER");
    }

    const handleDbUpdate = () => {
      setUsersList(getUsers());
    };
    window.addEventListener("chhapi_db_update", handleDbUpdate);
    return () => {
      window.removeEventListener("chhapi_db_update", handleDbUpdate);
    };
  }, []);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: "", score: 0, color: "bg-zinc-800" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { label: "Weak", score: 20, color: "bg-rose-500" };
      case 2:
        return { label: "Fair", score: 40, color: "bg-amber-500" };
      case 3:
        return { label: "Good", score: 60, color: "bg-yellow-400" };
      case 4:
        return { label: "Strong", score: 80, color: "bg-teal-500" };
      case 5:
        return { label: "Excellent", score: 100, color: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" };
      default:
        return { label: "Weak", score: 10, color: "bg-rose-500" };
    }
  };

  const strength = getPasswordStrength();

  // Toast handler
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  // Remove toast after 4s
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  if (!currentUser) return null;

  // USER role has NO access to user creation
  if (currentUser.role === "USER") {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#070b12] text-zinc-100 min-h-screen">
        <div className="max-w-md w-full bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur-md shadow-2xl text-center space-y-5 animate-[fadeIn_0.2s_ease-out]">
          <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20 shadow-md">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-white">Access Denied</h2>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Your account tier (Regular Contributor) does not possess permission to provision new user profiles.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all cursor-pointer text-xs"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const isSuperAdmin = currentUser.role === "SUPER_ADMIN";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName) {
      addToast("Full Name is required.", "error");
      return;
    }
    if (!mobileNumber || mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
      addToast("Please enter a valid 10-digit mobile number.", "error");
      return;
    }
    if (password.length < 6) {
      addToast("Password must be at least 6 characters.", "error");
      return;
    }

    // Admins cannot create Admin/SuperAdmin
    if (!isSuperAdmin && role !== "USER") {
      addToast("Error: You are only authorized to provision Regular Contributor accounts.", "error");
      return;
    }

    // Check duplicate mobile number
    const isDuplicate = usersList.some((u) => u.mobile === mobileNumber);
    if (isDuplicate) {
      addToast("Account with this mobile number already exists.", "error");
      return;
    }

    setIsLoading(true);

    // Simulate mock API request
    setTimeout(() => {
      setIsLoading(false);

      const newUserObj = {
        id: Date.now(),
        name: fullName,
        mobile: mobileNumber,
        password: password,
        role: role,
        status: "Active",
        joined: new Date().toISOString().split("T")[0],
        donations: 0,
        color: avatarColor,
        addedBy: currentUser.name || "System",
        whatsappGroup: whatsappGroup || "https://chat.whatsapp.com/G2EHonNxcjoBwtygpTmCg4",
        whatsappJoined: alreadyJoined,
      };

      const updatedUsers = [newUserObj, ...usersList];
      saveUsers(updatedUsers);
      setUsersList(updatedUsers);

      addToast(`🎉 Account successfully created for ${fullName}!`, "success");
      
      // Reset form fields
      setFullName("");
      setMobileNumber("");
      setPassword("");
      setRole("USER");
      setWhatsappGroup("");
      setAlreadyJoined(false);
    }, 1000);
  };

  return (
    <div className="flex-1 p-6 lg:p-10 bg-[#070b12] text-zinc-100 min-h-screen relative overflow-hidden flex flex-col justify-center">
      {/* Toast Container */}
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

      {/* Decorative Blur Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-accent/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl w-full mx-auto z-10">
        {/* Header */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Create User Account
          </h1>
          <p className="text-zinc-400 mt-2 text-sm md:text-base">
            Provision new user accounts, assign system access privileges, and configure roles.
          </p>
        </div>

        {/* Form and Preview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form */}
          <div className="lg:col-span-7 bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary-accent rounded-full"></span>
              Account Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Mohammad Yunus"
                      className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-650 focus:outline-none focus:border-primary-accent focus:ring-4 focus:ring-primary-accent/15 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit number"
                      className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-650 focus:outline-none focus:border-primary-accent focus:ring-4 focus:ring-primary-accent/15 transition-all text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create secure password"
                    className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder-zinc-650 focus:outline-none focus:border-primary-accent focus:ring-4 focus:ring-primary-accent/15 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {passwordVisible ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    )}
                  </button>
                </div>

                {password && (
                  <div className="mt-2.5 space-y-1.5 animate-[fadeIn_0.2s_ease-out]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Security strength:</span>
                      <span className={`font-semibold ${strength.score <= 40 ? "text-rose-400" : strength.score <= 60 ? "text-amber-400" : "text-emerald-400"}`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-zinc-800/80 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} transition-all duration-500`} style={{ width: `${strength.score}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* WhatsApp Group Link */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  WhatsApp Group Link (Optional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-emerald-500">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 448 512">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                  </span>
                  <input
                    type="url"
                    value={whatsappGroup}
                    onChange={(e) => setWhatsappGroup(e.target.value)}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-650 focus:outline-none focus:border-primary-accent focus:ring-4 focus:ring-primary-accent/15 transition-all text-sm"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mb-4">Defaults to the official group link if left blank.</p>
              </div>

              {/* Already Joined WhatsApp */}
              <div className="flex items-center gap-3 bg-[#111928]/30 border border-zinc-800/60 px-4 py-3.5 rounded-2xl mb-6">
                <input
                  type="checkbox"
                  id="alreadyJoined"
                  checked={alreadyJoined}
                  onChange={(e) => setAlreadyJoined(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-zinc-800 text-emerald-500 focus:ring-emerald-500/15 bg-[#1e293b]/30 accent-emerald-500 cursor-pointer"
                />
                <label htmlFor="alreadyJoined" className="text-xs font-bold text-zinc-350 cursor-pointer select-none">
                  User is already a member of this WhatsApp Group
                </label>
              </div>

              {/* Role & Avatar Themes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* System Role */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Assigned Role
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l6-6M12 21a9.003 9.003 0 008.361-5.639L12 15.75H4.236A9 9 0 0012 21z" />
                      </svg>
                    </span>
                    
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3.5 pl-12 pr-10 text-white appearance-none focus:outline-none focus:border-primary-accent focus:ring-4 focus:ring-primary-accent/15 transition-all text-sm cursor-pointer"
                    >
                      <option value="USER" className="bg-[#0f172a] text-white">Regular User (Contributor)</option>
                      {isSuperAdmin && (
                        <>
                          <option value="ADMIN" className="bg-[#0f172a] text-white">System Admin</option>
                          <option value="SUPER_ADMIN" className="bg-[#0f172a] text-white">Super Admin (Full Access)</option>
                        </>
                      )}
                    </select>
                    
                    <span className="absolute inset-y-0 right-4 flex items-center text-zinc-500 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Avatar Badge Theme */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Avatar Theme Color
                  </label>
                  <div className="flex items-center gap-2 py-1.5">
                    {avatarThemes.map((theme) => (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() => setAvatarColor(theme.class)}
                        className={`w-9 h-9 rounded-full bg-gradient-to-br ${
                          theme.class
                        } border-2 transition-all hover:scale-110 active:scale-95 cursor-pointer relative ${
                          avatarColor === theme.class ? "border-white scale-105 shadow-[0_0_12px_rgba(255,255,255,0.2)]" : "border-transparent"
                        }`}
                        title={theme.name}
                      >
                        {avatarColor === theme.class && (
                          <span className="absolute inset-0 flex items-center justify-center text-white text-[10px]">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                style={{ backgroundColor: "var(--primary-accent)" }}
                className="w-full text-white font-bold py-4 rounded-2xl transition-all duration-300 mt-4 shadow-lg hover:shadow-primary-accent/30 cursor-pointer flex justify-center items-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>
          </div>

          {/* Preview Identity Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full lg:sticky lg:top-8 space-y-6">
              <div className="text-center lg:text-left">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Live Identity Preview</h3>
                <p className="text-xs text-zinc-400">Observe the generated user ID card render as you enter details.</p>
              </div>

              <div className="w-full bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col justify-between aspect-[1.586/1] max-w-md mx-auto group">
                <div className={`absolute -right-16 -top-16 w-36 h-36 rounded-full bg-gradient-to-br ${avatarColor} opacity-20 blur-2xl group-hover:scale-125 transition-transform duration-700`}></div>

                <div className="flex justify-between items-start z-10">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center font-bold text-xl text-white shadow-lg border border-white/10 shrink-0 transform group-hover:rotate-3 transition-transform`}>
                      {fullName ? fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "ID"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-white tracking-wide truncate max-w-[180px] block">{fullName || "User Name"}</span>
                      <span className="text-xs font-semibold font-mono text-zinc-400 mt-0.5">
                        {mobileNumber ? `+91 ${mobileNumber.replace(/(\d{5})(\d{5})/, "$1 $2")}` : "+91 XXXXX XXXXX"}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border shadow-sm ${
                    role === "SUPER_ADMIN" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                    role === "ADMIN" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                    "bg-blue-500/10 border-blue-500/20 text-blue-400"
                  }`}>
                    {role}
                  </span>
                </div>

                <div className="my-6 z-10 flex items-center gap-2">
                  <div className="w-9 h-7 rounded bg-gradient-to-br from-amber-400/80 to-yellow-600/80 border border-amber-300/30 flex flex-col justify-between p-1.5 opacity-80 shadow-md">
                    <div className="h-px bg-zinc-950/20 w-full"></div>
                    <div className="h-px bg-zinc-950/20 w-full"></div>
                    <div className="h-px bg-zinc-950/20 w-full"></div>
                  </div>
                  <div className="h-5 w-px bg-zinc-800"></div>
                  <span className="text-[10px] text-zinc-500 font-mono tracking-widest">SECURE SIGNATURE ENCRYPTED</span>
                </div>

                <div className="flex justify-between items-end z-10 border-t border-zinc-800/40 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">ISSUED BY</span>
                    <span className="text-xs font-semibold text-zinc-300 mt-0.5">Chhapi Donation Board</span>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">SYSTEM KEY</span>
                    <span className="text-[11px] font-mono text-zinc-400 mt-0.5 block">
                      SHA-{fullName ? Math.abs(fullName.split("").reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)).toString(16).toUpperCase().slice(0, 5) : "XXXXX"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 max-w-md mx-auto text-xs text-zinc-500 flex gap-3">
                <svg className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="leading-relaxed">
                  Upon clicking <strong>Create Account</strong>, this user is securely stored locally within the application data registry and immediate permissions are initialized for the selected role.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
