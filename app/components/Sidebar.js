"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, logout } from "../utils/db";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const basePath = pathname.startsWith("/dashbord") ? "/dashbord" : "/dashboard";

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(true);
  const [donationsDropdownOpen, setDonationsDropdownOpen] = useState(false);
  const [fundDropdownOpen, setFundDropdownOpen] = useState(false);
  const [accentColor, setAccentColor] = useState("#007e8a");
  const [accentGradient, setAccentGradient] = useState("");

  useEffect(() => {
    // Load active session
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    const savedColor = localStorage.getItem("sidebar-accent-color");
    const savedGradient = localStorage.getItem("sidebar-accent-gradient");
    if (savedColor) {
      setAccentColor(savedColor);
      document.documentElement.style.setProperty("--primary-accent", savedColor);
    }
    if (savedGradient) {
      setAccentGradient(savedGradient);
    }

    const handleColorChange = () => {
      const savedColor = localStorage.getItem("sidebar-accent-color");
      const savedGradient = localStorage.getItem("sidebar-accent-gradient");
      if (savedColor) {
        setAccentColor(savedColor);
      }
      setAccentGradient(savedGradient || "");
    };
    
    const handleSidebarToggle = () => {
      setIsCollapsed((prev) => !prev);
    };

    window.addEventListener("accent-color-change", handleColorChange);
    window.addEventListener("sidebar-toggle", handleSidebarToggle);
    return () => {
      window.removeEventListener("accent-color-change", handleColorChange);
      window.removeEventListener("sidebar-toggle", handleSidebarToggle);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-accent", accentColor);
  }, [accentColor]);

  useEffect(() => {
    if (pathname.includes("/users") || pathname.includes("/pending-donations") || pathname.includes("/my-donations") || pathname.includes("/reports")) {
      setUserDropdownOpen(true);
    }
    if (pathname.includes("/donations-history")) {
      setDonationsDropdownOpen(true);
    }
    if (pathname.includes("/fund-overview") || pathname.includes("/fund-management")) {
      setFundDropdownOpen(true);
    }
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!currentUser) return null;

  const role = currentUser.role;

  const isDashboardActive = pathname === basePath;
  const isUserMgmtActive = role !== "USER" && (pathname === `${basePath}/users` || pathname === `${basePath}/pending-donations` || pathname === `${basePath}/my-donations` || pathname === `${basePath}/reports` || pathname === `${basePath}/audit-logs`);
  const isClaimsActive = role === "USER" && pathname === `${basePath}/pending-donations`;
  const isDonationsActive = pathname === `${basePath}/donations-history` || pathname === `${basePath}/donations-history/monthly`;
  const isFundActive = pathname === `${basePath}/fund-management/summary` || pathname === `${basePath}/fund-overview` || pathname === `${basePath}/fund-management/create` || pathname === `${basePath}/fund-management/use` || pathname === `${basePath}/fund-management/history`;
  const isSettingsActive = pathname === `${basePath}/settings`;
  const isThemeActive = pathname === `${basePath}/Theme` || pathname === `${basePath}/theme`;

  const getLinkClass = (isActive, isSubItem = false) => {
    if (isCollapsed) {
      return `relative flex items-center justify-center w-12 h-12 mx-auto rounded-xl transition-all duration-300 group cursor-pointer ${
        isActive
          ? "bg-white text-teal-850 shadow-lg"
          : "text-white/60 hover:text-white hover:bg-white/[0.08]"
      }`;
    }

    if (isActive) {
      return `relative flex items-center gap-4 py-3 pl-5 pr-0 cursor-pointer transition-all duration-300 sidebar-active-tab ${
        isSubItem ? "ml-8" : "ml-4"
      }`;
    }

    return `relative flex items-center gap-4 py-3 px-5 transition-all duration-300 group cursor-pointer rounded-l-full ${
      isSubItem ? "ml-8 text-white/50 hover:text-white" : "ml-4 text-white/70 hover:text-white"
    } hover:bg-white/[0.04]`;
  };

  const getParentClass = (isActive) => {
    if (isCollapsed) {
      return `relative flex items-center justify-center w-12 h-12 mx-auto rounded-xl transition-all duration-300 group cursor-pointer ${
        isActive
          ? "bg-white/10 text-white"
          : "text-white/60 hover:text-white hover:bg-white/[0.08]"
      }`;
    }

    return `relative flex items-center justify-between gap-4 py-3 px-5 ml-4 rounded-l-full transition-all duration-300 group cursor-pointer ${
      isActive
        ? "text-white bg-white/10 font-bold"
        : "text-white/70 hover:text-white hover:bg-white/[0.04]"
    }`;
  };

  const renderLeftIndicator = (isActive) => {
    return null;
  };

  return (
    <div
      style={{
        backgroundColor: accentGradient ? undefined : accentColor,
        backgroundImage: accentGradient || undefined,
      }}
      className={`sidebar-container text-white h-full min-h-screen flex flex-col justify-between font-sans border-r border-white/5 shrink-0 relative transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.3)] ${
        isCollapsed ? "w-[90px]" : "w-[320px]"
      }`}
    >
      {/* Sidebar Toggle Button (Desktop Only) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3.5 top-[34px] w-7 h-7 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.25)] items-center justify-center z-50 cursor-pointer transition-all hover:scale-110 active:scale-95 border border-zinc-200"
        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        style={{ color: accentColor }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3.2}
          stroke="currentColor"
          className="w-3.5 h-3.5"
        >
          {isCollapsed ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          )}
        </svg>
      </button>


      {/* Top Brand Section */}
      <div className="p-6">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-4"}`}>
          {isCollapsed ? (
            <div
              className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center border border-white/15 shrink-0 transition-all duration-300 hover:scale-105 shadow-lg"
              title="Chhapi Donation"
            >
              <img src="/logo.png" alt="Chhapi Donation Logo" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="flex items-center gap-3.5 animate-[fadeIn_0.2s_ease-out] w-full">
              <div className="w-11 h-11 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 shrink-0 shadow-lg bg-white/10">
                <img src="/logo.png" alt="Chhapi Donation Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xl font-extrabold tracking-tight text-white truncate">
                  Chhapi Donation
                </span>
                <span
                  className="text-[9px] font-bold tracking-widest uppercase mt-0.5 px-1.5 py-0.5 rounded bg-white/15 text-white/90 border border-white/5 w-fit"
                >
                  {role.replace("_", " ")}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className={`flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar ${isCollapsed ? "px-3 py-6" : "py-4"}`}>
        {/* Dashboard */}
        <Link
          href={basePath}
          className={getLinkClass(isDashboardActive, false)}
          style={{ color: isDashboardActive && !isCollapsed ? accentColor : undefined }}
          title={isCollapsed ? "Dashboard" : undefined}
        >
          {renderLeftIndicator(isDashboardActive)}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-115">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25-2.25H13.5v-2.25Z" />
          </svg>
          {!isCollapsed && (
            <span className="text-[15px] font-semibold tracking-wide whitespace-nowrap animate-[fadeIn_0.2s_ease-out]">
              Dashboard
            </span>
          )}
        </Link>

        {/* User Management / Claims - Role Dependent */}
        {role !== "USER" ? (
          <div>
            <button
              onClick={() => !isCollapsed && setUserDropdownOpen(!userDropdownOpen)}
              className={getParentClass(isUserMgmtActive)}
              title={isCollapsed ? "User Management" : undefined}
            >
              <div className="flex items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-115">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0 1 10.089 21c-2.243 0-4.32-.647-6.079-1.758 1.935-1.921 4.673-3.113 7.68-3.113 1.956 0 3.791.493 5.4 1.361M15 8.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 12a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                {!isCollapsed && (
                  <span className="text-[15px] font-semibold tracking-wide whitespace-nowrap animate-[fadeIn_0.2s_ease-out]">
                    User Management
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className={`w-3.5 h-3.5 text-white/40 transition-transform duration-300 ease-out shrink-0 ${userDropdownOpen ? "rotate-180" : ""}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              )}
            </button>

            {!isCollapsed && userDropdownOpen && (
              <div className="mt-1.5 flex flex-col gap-1 animate-[fadeIn_0.15s_ease-out]">
                <Link
                  href={`${basePath}/users`}
                  className={getLinkClass(pathname === `${basePath}/users`, true)}
                  style={{ color: pathname === `${basePath}/users` && !isCollapsed ? accentColor : undefined }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-70 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <span>Users List</span>
                </Link>
                {role === "SUPER_ADMIN" ? (
                  <Link
                    href={`${basePath}/pending-donations`}
                    className={getLinkClass(pathname === `${basePath}/pending-donations`, true)}
                    style={{ color: pathname === `${basePath}/pending-donations` && !isCollapsed ? accentColor : undefined }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-70 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span>Pending Donations</span>
                  </Link>
                ) : role === "ADMIN" ? (
                  <Link
                    href={`${basePath}/my-donations`}
                    className={getLinkClass(pathname === `${basePath}/my-donations`, true)}
                    style={{ color: pathname === `${basePath}/my-donations` && !isCollapsed ? accentColor : undefined }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-70 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.375m1.875-10.378a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3h-9.75a3 3 0 0 1-3-3V7.622a3 3 0 0 1 3-3h9.75ZM9.75 9.75H12v2.25H9.75v-2.25Z" />
                    </svg>
                    <span>My Donation History</span>
                  </Link>
                ) : null}
                {role === "SUPER_ADMIN" && (
                  <>
                    <Link
                      href={`${basePath}/reports`}
                      className={getLinkClass(pathname === `${basePath}/reports`, true)}
                      style={{ color: pathname === `${basePath}/reports` && !isCollapsed ? accentColor : undefined }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-70 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      <span>Reports</span>
                    </Link>
                    <Link
                      href={`${basePath}/audit-logs`}
                      className={getLinkClass(pathname === `${basePath}/audit-logs`, true)}
                      style={{ color: pathname === `${basePath}/audit-logs` && !isCollapsed ? accentColor : undefined }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-70 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
                      </svg>
                      <span>Audit Logs</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Regular User Claims Menu (no dropdown) */
          <Link
            href={`${basePath}/pending-donations`}
            className={getLinkClass(isClaimsActive, false)}
            style={{ color: isClaimsActive && !isCollapsed ? accentColor : undefined }}
            title={isCollapsed ? "My Claims" : undefined}
          >
            {renderLeftIndicator(isClaimsActive)}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-115">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {!isCollapsed && (
              <span className="text-[15px] font-semibold tracking-wide whitespace-nowrap animate-[fadeIn_0.2s_ease-out]">
                My Donation Claims
              </span>
            )}
          </Link>
        )}

        {/* Donations History */}
        <div>
          <button
            onClick={() => !isCollapsed && setDonationsDropdownOpen(!donationsDropdownOpen)}
            className={getParentClass(isDonationsActive)}
            title={isCollapsed ? "Donations History" : undefined}
          >
            <div className="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-115">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              {!isCollapsed && (
                <span className="text-[15px] font-semibold tracking-wide whitespace-nowrap animate-[fadeIn_0.2s_ease-out]">
                  {role === "USER" ? "My Donations" : "Donations History"}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className={`w-3.5 h-3.5 text-white/40 transition-transform duration-300 ease-out shrink-0 ${donationsDropdownOpen ? "rotate-180" : ""}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            )}
          </button>

          {!isCollapsed && donationsDropdownOpen && (
            <div className="flex flex-col gap-1 border-l border-white/10 animate-[fadeIn_0.15s_ease-out]">
              <Link
                href={`${basePath}/donations-history`}
                className={getLinkClass(pathname === `${basePath}/donations-history`, true)}
                style={{ color: pathname === `${basePath}/donations-history` && !isCollapsed ? accentColor : undefined }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-70 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.375m1.875-10.378a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3h-9.75a3 3 0 0 1-3-3V7.622a3 3 0 0 1 3-3h9.75ZM9.75 9.75H12v2.25H9.75v-2.25Z" />
                </svg>
                <span>{role === "USER" ? "History Logs" : "All Donations"}</span>
              </Link>
              {role !== "USER" && (
                <Link
                  href={`${basePath}/donations-history/monthly`}
                  className={getLinkClass(pathname === `${basePath}/donations-history/monthly`, true)}
                  style={{ color: pathname === `${basePath}/donations-history/monthly` && !isCollapsed ? accentColor : undefined }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-70 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                  </svg>
                  <span>Monthly Report</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Fund Management */}
        <div>
          <button
            onClick={() => !isCollapsed && setFundDropdownOpen(!fundDropdownOpen)}
            className={getParentClass(isFundActive)}
            title={isCollapsed ? "Fund Management" : undefined}
          >
            <div className="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-115">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.25H4.5V21m-1.5 0h18" />
              </svg>
              {!isCollapsed && (
                <span className="text-[15px] font-semibold tracking-wide whitespace-nowrap animate-[fadeIn_0.2s_ease-out]">
                  Fund Management
                </span>
              )}
            </div>
            {!isCollapsed && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className={`w-3.5 h-3.5 text-white/40 transition-transform duration-300 ease-out shrink-0 ${fundDropdownOpen ? "rotate-180" : ""}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            )}
          </button>

          {!isCollapsed && fundDropdownOpen && (
            <div className="flex flex-col gap-1 border-l border-white/10 animate-[fadeIn_0.15s_ease-out]">
              <Link
                href={`${basePath}/fund-management/summary`}
                className={getLinkClass(pathname === `${basePath}/fund-management/summary` || pathname === `${basePath}/fund-overview`, true)}
                style={{ color: (pathname === `${basePath}/fund-management/summary` || pathname === `${basePath}/fund-overview`) && !isCollapsed ? accentColor : undefined }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-70 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span>Fund Summary</span>
              </Link>
              {role === "SUPER_ADMIN" && (
                <>
                  <Link
                    href={`${basePath}/fund-management/create`}
                    className={getLinkClass(pathname === `${basePath}/fund-management/create`, true)}
                    style={{ color: pathname === `${basePath}/fund-management/create` && !isCollapsed ? accentColor : undefined }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-70 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0Z" />
                    </svg>
                    <span>Create Fund</span>
                  </Link>
                  <Link
                    href={`${basePath}/fund-management/use`}
                    className={getLinkClass(pathname === `${basePath}/fund-management/use`, true)}
                    style={{ color: pathname === `${basePath}/fund-management/use` && !isCollapsed ? accentColor : undefined }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-70 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span>Use Fund</span>
                  </Link>
                </>
              )}
              {role !== "USER" && (
                <Link
                  href={`${basePath}/fund-management/history`}
                  className={getLinkClass(pathname === `${basePath}/fund-management/history`, true)}
                  style={{ color: pathname === `${basePath}/fund-management/history` && !isCollapsed ? accentColor : undefined }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 opacity-70 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>Fund History</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Settings */}
        <Link
          href={`${basePath}/settings`}
          className={getLinkClass(isSettingsActive, false)}
          style={{ color: isSettingsActive && !isCollapsed ? accentColor : undefined }}
          title={isCollapsed ? "Settings" : undefined}
        >
          {renderLeftIndicator(isSettingsActive)}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-115">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          {!isCollapsed && (
            <span className="text-[15px] font-semibold tracking-wide whitespace-nowrap animate-[fadeIn_0.2s_ease-out]">
              {role === "USER" ? "My Profile" : "Settings"}
            </span>
          )}
        </Link>

        {/* Theme Settings */}
        <Link
          href={`${basePath}/Theme`}
          className={getLinkClass(isThemeActive, false)}
          style={{ color: isThemeActive && !isCollapsed ? accentColor : undefined }}
          title={isCollapsed ? "Appearance & Theme" : undefined}
        >
          {renderLeftIndicator(isThemeActive)}
          <div className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-115">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.01-3.012a4.836 4.836 0 0 1-1.003-1.003m0 0a4.5 4.5 0 0 0 7.826 4.704m-7.826-4.704A4.5 4.5 0 0 0 5.625 4.5H4.5m1.125 0a1.125 1.125 0 0 1 0 2.25h-1.125m11.25-2.25a9 9 0 0 1 8.1 8.94c0 1.25-.497 2.44-1.39 3.33M21.75 12h-1.125a1.125 1.125 0 0 1 0-2.25H21.75M16.5 4.5v1.125a1.125 1.125 0 0 1-2.25 0V4.5m-3.375 7.875h1.125a1.125 1.125 0 0 1 0 2.25h-1.125m3.375-3.375h1.125a1.125 1.125 0 0 1 0-2.25h-1.125" />
            </svg>
            {!isCollapsed && (
              <span className="text-[15px] font-semibold tracking-wide whitespace-nowrap animate-[fadeIn_0.2s_ease-out]">
                Appearance & Theme
              </span>
            )}
          </div>
          {!isCollapsed && (
            <div
              className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0 animate-[fadeIn_0.2s_ease-out] shadow-[0_0_8px_rgba(255,255,255,0.2)]"
              style={{
                backgroundColor: accentGradient ? undefined : accentColor,
                backgroundImage: accentGradient || undefined,
              }}
            ></div>
          )}
        </Link>
      </div>

      {/* Bottom Profile Section with Logout */}
      <div className={`border-t border-white/5 ${isCollapsed ? "p-4 flex justify-center" : "p-5"}`}>
        <div
          onClick={handleLogout}
          className={`flex items-center cursor-pointer group rounded-xl transition-all duration-300 ${
            isCollapsed
              ? "w-12 h-12 justify-center bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
              : "w-full justify-between p-3 bg-white/[0.03] border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
          }`}
          title={isCollapsed ? `Sign Out (${currentUser.name})` : undefined}
        >
          {isCollapsed ? (
            <div className={`w-9 h-9 bg-gradient-to-br ${currentUser.color || 'from-zinc-700 to-zinc-800'} rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-md transition-transform group-hover:scale-95`}>
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${currentUser.color || 'from-zinc-700 to-zinc-800'} rounded-full flex items-center justify-center border border-white/10 font-bold text-base text-white shrink-0 shadow-md`}>
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col overflow-hidden max-w-[150px]">
                  <span className="text-[14px] font-bold tracking-wide leading-tight whitespace-nowrap text-white group-hover:text-red-300 transition-colors">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] text-white/40 group-hover:text-red-400/60 font-bold tracking-widest uppercase mt-0.5 whitespace-nowrap transition-colors">
                    {role.replace("_", " ")}
                  </span>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 text-white/40 group-hover:text-red-400 transition-colors shrink-0"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
