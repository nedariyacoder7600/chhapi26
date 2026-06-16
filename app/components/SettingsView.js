"use client";

import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../utils/db";

export default function SettingsView() {
  const [currentUser, setCurrentUser] = useState(null);
  const [systemOnline, setSystemOnline] = useState(true);
  const [allowSignups, setAllowSignups] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  if (!currentUser) return null;

  const isSuperAdmin = currentUser.role === "SUPER_ADMIN";

  return (
    <div className="flex-1 flex flex-col p-8 bg-[#070b12] text-zinc-100 min-h-screen">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-white tracking-wide">
          {isSuperAdmin ? "System Settings" : "My Account Profile"}
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          {isSuperAdmin 
            ? "Configure global application behavior and platform defaults." 
            : "Review your account profile details and security role settings."}
        </p>
      </header>

      {/* Settings Options */}
      <div className="max-w-3xl flex flex-col gap-6">
        
        {/* Profile Card */}
        <div className="bg-[#111928]/60 border border-zinc-800/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {isSuperAdmin ? "Super Admin Account Details" : `${currentUser.role.replace("_", " ")} Profile Details`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-zinc-500 font-medium block">Full Name</span>
              <span className="text-white font-semibold text-base mt-0.5 block">{currentUser.name}</span>
            </div>
            <div>
              <span className="text-zinc-500 font-medium block">Security Role</span>
              <span className="text-purple-400 font-semibold text-base mt-0.5 block">{currentUser.role}</span>
            </div>
            <div>
              <span className="text-zinc-500 font-medium block">Phone / Mobile</span>
              <span className="text-white font-mono text-base mt-0.5 block">+91 {currentUser.mobile}</span>
            </div>
            <div>
              <span className="text-zinc-500 font-medium block">Account Status</span>
              <span className="text-emerald-400 font-semibold text-base mt-0.5 block">{currentUser.status || "Active & Verified"}</span>
            </div>
          </div>
        </div>

        {/* Global Controls - Only visible to SUPER_ADMIN */}
        {isSuperAdmin && (
          <div className="bg-[#111928]/60 border border-zinc-800/50 rounded-2xl p-6 flex flex-col gap-6 animate-[fadeIn_0.25s_ease-out]">
            <h3 className="text-lg font-semibold text-white">System Controls</h3>

            {/* Option 1 */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Platform System Status</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Toggle overall core platform accessibility</p>
              </div>
              <button
                onClick={() => setSystemOnline(!systemOnline)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  systemOnline ? "bg-emerald-600" : "bg-zinc-800"
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                    systemOnline ? "left-7" : "left-1"
                  }`}
                ></span>
              </button>
            </div>

            {/* Option 2 */}
            <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4">
              <div>
                <h4 className="font-semibold text-white">Allow Admin/User Registrations</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Allows new account creations in user management panel</p>
              </div>
              <button
                onClick={() => setAllowSignups(!allowSignups)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  allowSignups ? "bg-emerald-600" : "bg-zinc-800"
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                    allowSignups ? "left-7" : "left-1"
                  }`}
                ></span>
              </button>
            </div>

            {/* Option 3 */}
            <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4">
              <div>
                <h4 className="font-semibold text-white">Email Transaction Notifications</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Sends automated receipts to contributors immediately</p>
              </div>
              <button
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  emailAlerts ? "bg-emerald-600" : "bg-zinc-800"
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                    emailAlerts ? "left-7" : "left-1"
                  }`}
                ></span>
              </button>
            </div>

            {/* Option 4 */}
            <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4">
              <div>
                <h4 className="font-semibold text-white text-red-400">Force System Maintenance</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Place website offline under a maintenance banner</p>
              </div>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  maintenanceMode ? "bg-red-600" : "bg-zinc-800"
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                    maintenanceMode ? "left-7" : "left-1"
                  }`}
                ></span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
