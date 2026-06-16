"use client";

import React from "react";
import Sidebar from "./Sidebar";

export default function DashboardView() {
  return (
    <div className="flex h-screen bg-[#070b12] text-zinc-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="p-8">
          <h1 className="text-3xl font-semibold text-white tracking-wide">
            Super Admin Dashboard
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Full system overview of users, donations, and reports.
          </p>
        </header>

        {/* Dashboard Grid */}
        <main className="px-8 pb-8 flex-1 flex flex-col gap-6">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Card 1: Total Users */}
            <div className="bg-[#111928]/60 border border-zinc-800/50 rounded-2xl p-6 flex items-center gap-4 hover:border-zinc-700/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 font-medium">Total Users</span>
                <span className="text-2xl font-bold text-white mt-0.5">53</span>
              </div>
            </div>

            {/* Card 2: Total Donations */}
            <div className="bg-[#111928]/60 border border-zinc-800/50 rounded-2xl p-6 flex items-center gap-4 hover:border-zinc-700/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5M4.5 19.25V6.25m15 13V6.25M7.5 19.25V6.25m9 13V6.25m-9 3.5h9m-9 3.5h9m-9 3.5h9"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 font-medium">Total Donations</span>
                <span className="text-2xl font-bold text-white mt-0.5">194</span>
              </div>
            </div>

            {/* Card 3: Active Admins */}
            <div className="bg-[#111928]/60 border border-zinc-800/50 rounded-2xl p-6 flex items-center gap-4 hover:border-zinc-700/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 font-medium">Active Admins</span>
                <span className="text-2xl font-bold text-white mt-0.5">11</span>
              </div>
            </div>

            {/* Card 4: Super Admins */}
            <div className="bg-[#111928]/60 border border-zinc-800/50 rounded-2xl p-6 flex items-center gap-4 hover:border-zinc-700/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 font-medium">Super Admins</span>
                <span className="text-2xl font-bold text-white mt-0.5">1</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-[350px]">
            {/* Chart 1: Monthly Donations Overview */}
            <div className="bg-[#111928]/60 border border-zinc-800/50 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700/50 transition-all duration-300">
              <h3 className="text-lg font-medium text-white mb-2">
                Monthly Donations Overview
              </h3>
              <div className="flex-1 flex items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20 text-zinc-500 font-medium text-sm">
                Chart placeholder
              </div>
            </div>

            {/* Chart 2: New Users This Month */}
            <div className="bg-[#111928]/60 border border-zinc-800/50 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700/50 transition-all duration-300">
              <h3 className="text-lg font-medium text-white mb-2">
                New Users This Month
              </h3>
              <div className="flex-1 flex items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20 text-zinc-500 font-medium text-sm">
                Chart placeholder
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
