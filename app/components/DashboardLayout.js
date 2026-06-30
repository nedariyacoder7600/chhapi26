"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { getCurrentUser, setCurrentUser, getUsers, logout } from "../utils/db";


export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setSessionUser] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [showDevSwitcher, setShowDevSwitcher] = useState(false);
  const [themeMode, setThemeMode] = useState("light");
  const [accentColor, setAccentColor] = useState("#007e8a");
  const [accentGradient, setAccentGradient] = useState("");


  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Set client flag and verify session
  useEffect(() => {
    setIsClient(true);
    const user = getCurrentUser();
    if (!user) {
      router.push("/");
    } else {
      setSessionUser(user);
    }

    const handleSessionUpdate = () => {
      const updatedUser = getCurrentUser();
      setSessionUser(updatedUser);
      if (!updatedUser) {
        router.push("/");
      }
    };

    window.addEventListener("chhapi_session_update", handleSessionUpdate);
    return () => {
      window.removeEventListener("chhapi_session_update", handleSessionUpdate);
    };
  }, [router]);

  // Handle Light/Dark Mode based on selected accent color
  useEffect(() => {
    const checkThemeMode = () => {
      const savedColor = localStorage.getItem("sidebar-accent-color");
      const savedGradient = localStorage.getItem("sidebar-accent-gradient");
      
      if (savedColor) {
        setAccentColor(savedColor);
      }
      setAccentGradient(savedGradient || "");

      if (savedColor === "#0f172a" || savedColor === "#0F172A") {
        setThemeMode("dark");
      } else {
        setThemeMode("light");
      }
    };
    checkThemeMode();
    window.addEventListener("accent-color-change", checkThemeMode);
    return () => {
      window.removeEventListener("accent-color-change", checkThemeMode);
    };
  }, []);

  // Automatically close mobile menu when path change occurs
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleDevRoleSwitch = (role) => {
    const usersList = getUsers();
    let targetUser = usersList.find((u) => u.role === role);
    if (!targetUser) {
      // Create a dummy user of that role if not exists
      targetUser = {
        id: Date.now(),
        name: `Mock ${role.toLowerCase()}`,
        mobile: role === "SUPER_ADMIN" ? "9876543210" : role === "ADMIN" ? "9104092123" : "9900887766",
        role: role,
        status: "Active",
        joined: "2026-06-13",
        donations: role === "USER" ? 8500 : 0,
        color: role === "SUPER_ADMIN" ? "from-red-500 to-pink-600" : role === "ADMIN" ? "from-amber-500 to-rose-600" : "from-cyan-500 to-blue-600"
      };
    }
    setCurrentUser(targetUser);
    // Reload page to refresh all active view components
    window.location.reload();
  };

  if (!isClient || !currentUser) {
    return null;
  }

  return (
    <div className={`${themeMode === "light" ? "dashboard-light-theme" : ""} flex h-screen bg-[#070b12] text-zinc-100 font-sans overflow-hidden relative`}>
      
      {/* Sidebar Wrapper: Sliding Drawer on Mobile, Persistent Sidebar on Desktop */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-out shrink-0
        lg:relative lg:translate-x-0 lg:z-20 lg:flex
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {isMobileMenuOpen && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-5 right-5 z-[60] p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors lg:hidden cursor-pointer"
            aria-label="Close Navigation Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <Sidebar />
      </div>

      {/* Semi-transparent Backdrop Overlay for mobile slide-out menu */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm z-40 lg:hidden animate-[fadeIn_0.2s_ease-out]"
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto relative">
        

        
        {/* Mobile Header Bar */}
        <div className="flex lg:hidden items-center justify-between px-6 py-4 border-b border-zinc-800/60 bg-[#0c1220]/80 backdrop-blur-md sticky top-0 z-30">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Chhapi Donation Logo" className="w-8 h-8 rounded-full border border-white/10 object-cover" />
            <span className="text-lg font-bold text-white tracking-wide">
              Chhapi Donation
            </span>
          </div>

          {/* Profile Circle */}
          <div className="w-10 h-10 rounded-full mobile-profile-circle flex items-center justify-center font-bold text-sm text-white">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Page children wrapped securely */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>

      {/* Floating Developer Role Switcher Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {showDevSwitcher && (
          <div className="bg-[#111928]/95 border border-zinc-800 rounded-2xl p-4 mb-2 shadow-2xl backdrop-blur-xl animate-[fadeIn_0.2s_ease-out] w-56 flex flex-col gap-2.5">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center border-b border-zinc-800 pb-1.5 block">Developer Sandbox Switch</span>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => handleDevRoleSwitch("SUPER_ADMIN")}
                className={`py-2 px-3 rounded-lg text-[10px] font-bold text-left cursor-pointer transition-all border ${
                  currentUser.role === "SUPER_ADMIN"
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Super Admin Access
              </button>
              <button
                onClick={() => handleDevRoleSwitch("ADMIN")}
                className={`py-2 px-3 rounded-lg text-[10px] font-bold text-left cursor-pointer transition-all border ${
                  currentUser.role === "ADMIN"
                    ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                    : "bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Admin Access
              </button>
              <button
                onClick={() => handleDevRoleSwitch("USER")}
                className={`py-2 px-3 rounded-lg text-[10px] font-bold text-left cursor-pointer transition-all border ${
                  currentUser.role === "USER"
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    : "bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                User Access
              </button>
            </div>
            <span className="text-[9px] text-zinc-500 font-mono text-center block">Current Role: {currentUser.role}</span>
          </div>
        )}
        <button
          onClick={() => setShowDevSwitcher(!showDevSwitcher)}
          className="w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center shadow-lg hover:shadow-violet-600/30 active:scale-95 transition-all cursor-pointer border border-violet-500/50"
          title="Sandbox Controls"
        >
          <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

    </div>
  );
}
