"use client";

import React, { useState, useEffect, useRef } from "react";

export default function ThemeSettingsView() {
  const singleColors = [
    { name: "Royal Purple", value: "#7c3aed" },
    { name: "Sunset Orange", value: "#ea580c" },
    { name: "Golden Glow", value: "#d97706" },
    { name: "Forest Green", value: "#059669" },
    { name: "Ocean Blue", value: "#0284c7" },
    { name: "Rose Pink", value: "#db2777" },
    { name: "Slate Gray", value: "#4b5563" },
    { name: "Midnight Indigo", value: "#4f46e5" },
  ];

  const gradientColors = [
    { name: "Sunset Glow", value: "#ef4444", gradient: "linear-gradient(135deg, #f97316, #ef4444)" },
    { name: "Neon Purple", value: "#8b5cf6", gradient: "linear-gradient(135deg, #ec4899, #8b5cf6)" },
    { name: "Ocean Wave", value: "#3b82f6", gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)" },
    { name: "Forest Jade", value: "#059669", gradient: "linear-gradient(135deg, #10b981, #059669)" },
  ];

  const visionAssistive = [
    { name: "Vision Dark", value: "#0f172a" },
    { name: "Clear Ocean", value: "#007e8a" },
  ];

  const [activeColor, setActiveColor] = useState("#007e8a");
  const [activeGradient, setActiveGradient] = useState("");
  const colorInputRef = useRef(null);

  useEffect(() => {
    const savedColor = localStorage.getItem("sidebar-accent-color");
    const savedGradient = localStorage.getItem("sidebar-accent-gradient");
    if (savedColor) {
      setActiveColor(savedColor);
    }
    if (savedGradient) {
      setActiveGradient(savedGradient);
    }
  }, []);

  const selectColor = (color, gradient = "") => {
    setActiveColor(color);
    setActiveGradient(gradient);
    localStorage.setItem("sidebar-accent-color", color);
    localStorage.setItem("sidebar-accent-gradient", gradient);
    document.documentElement.style.setProperty("--primary-accent", color);
    
    // Dispatch custom event to notify layout/sidebar of theme change instantly
    window.dispatchEvent(new Event("accent-color-change"));
  };

  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    selectColor(color, "");
  };

  const isPredefined = [
    ...singleColors,
    ...gradientColors,
    ...visionAssistive
  ].some((c) => c.value.toLowerCase() === activeColor.toLowerCase());

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 bg-[#070b12] text-zinc-100 min-h-screen">
      {/* Header */}
      <header className="mb-8 border-b border-zinc-800/40 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Appearance
        </h1>
        <p className="text-sm text-zinc-400 mt-2">
          Customize how the dashboard looks. Changes are saved automatically.
        </p>
      </header>

      {/* Main stacked sections */}
      <div className="max-w-6xl flex flex-col gap-10">
        
        {/* Theme Colors selector card */}
        <div className="bg-[#111928]/40 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-8">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">Theme Colors</h2>
            <p className="text-xs text-zinc-450 mt-1">
              Pick a preset or create your own custom theme.
            </p>
          </div>

          {/* SINGLE COLOR PRESETS */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">
              Single Color
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {singleColors.map((c) => {
                const isSelected = activeColor.toLowerCase() === c.value.toLowerCase() && !activeGradient;
                return (
                  <div
                    key={c.value}
                    onClick={() => selectColor(c.value, "")}
                    style={{
                      borderColor: isSelected ? c.value : undefined,
                      boxShadow: isSelected ? `0 0 14px ${c.value}1e` : undefined,
                    }}
                    className={`group cursor-pointer flex items-center p-3.5 bg-[#111928]/25 border rounded-2xl transition-all duration-300 ${
                      isSelected
                        ? "bg-white/[0.03] border-2"
                        : "border-zinc-800/60 hover:border-zinc-700 hover:bg-[#111928]/50 active:scale-[0.98]"
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mr-3.5 text-white transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: c.value }}
                    >
                      {isSelected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={4}
                          stroke="currentColor"
                          className="w-2.5 h-2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold tracking-wide truncate ${
                        isSelected ? "text-white font-bold" : "text-zinc-400 group-hover:text-zinc-200"
                      }`}
                    >
                      {c.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GRADIENT COMBOS */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">
              Gradient Combos (Premium)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {gradientColors.map((c) => {
                const isSelected = activeGradient === c.gradient;
                return (
                  <div
                    key={c.name}
                    onClick={() => selectColor(c.value, c.gradient)}
                    style={{
                      borderColor: isSelected ? c.value : undefined,
                      boxShadow: isSelected ? `0 0 14px ${c.value}1e` : undefined,
                    }}
                    className={`group cursor-pointer flex items-center p-3.5 bg-[#111928]/25 border rounded-2xl transition-all duration-300 ${
                      isSelected
                        ? "bg-white/[0.03] border-2"
                        : "border-zinc-800/60 hover:border-zinc-700 hover:bg-[#111928]/50 active:scale-[0.98]"
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mr-3.5 text-white transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundImage: c.gradient }}
                    >
                      {isSelected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={4}
                          stroke="currentColor"
                          className="w-2.5 h-2.5 text-white drop-shadow"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold tracking-wide truncate ${
                        isSelected ? "text-white font-bold" : "text-zinc-400 group-hover:text-zinc-200"
                      }`}
                    >
                      {c.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* VISION ASSISTIVE PRESETS */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">
              Vision Assistive
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {visionAssistive.map((c) => {
                const isSelected = activeColor.toLowerCase() === c.value.toLowerCase() && !activeGradient;
                return (
                  <div
                    key={c.value}
                    onClick={() => selectColor(c.value, "")}
                    style={{
                      borderColor: isSelected ? c.value : undefined,
                      boxShadow: isSelected ? `0 0 14px ${c.value}1e` : undefined,
                    }}
                    className={`group cursor-pointer flex items-center p-3.5 bg-[#111928]/25 border rounded-2xl transition-all duration-300 ${
                      isSelected
                        ? "bg-white/[0.03] border-2"
                        : "border-zinc-800/60 hover:border-zinc-700 hover:bg-[#111928]/50 active:scale-[0.98]"
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mr-3.5 text-white transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: c.value }}
                    >
                      {isSelected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={4}
                          stroke="currentColor"
                          className="w-2.5 h-2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold tracking-wide truncate ${
                        isSelected ? "text-white font-bold" : "text-zinc-400 group-hover:text-zinc-200"
                      }`}
                    >
                      {c.name}
                    </span>
                  </div>
                );
              })}

              {/* Custom Color Selector inside the Assistive Row */}
              <div
                onClick={() => colorInputRef.current && colorInputRef.current.click()}
                style={{
                  borderColor: !isPredefined ? activeColor : undefined,
                  boxShadow: !isPredefined ? `0 0 14px ${activeColor}1e` : undefined,
                }}
                className={`group cursor-pointer flex items-center p-3.5 bg-[#111928]/25 border rounded-2xl transition-all duration-300 ${
                  !isPredefined
                    ? "bg-white/[0.03] border-2"
                    : "border-zinc-800/60 hover:border-zinc-700 hover:bg-[#111928]/50 active:scale-[0.98]"
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mr-3.5 text-white transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: !isPredefined ? activeColor : "#1f2a3f",
                    border: isPredefined ? "1px dashed #4b5563" : "none",
                  }}
                >
                  {!isPredefined ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={4}
                      stroke="currentColor"
                      className="w-2.5 h-2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  ) : (
                    <span className="text-zinc-400 font-semibold text-[10px]">+</span>
                  )}
                </div>
                <span
                  className={`text-xs font-semibold tracking-wide truncate uppercase ${
                    !isPredefined ? "text-white font-bold" : "text-zinc-400 group-hover:text-zinc-200"
                  }`}
                >
                  {!isPredefined ? activeColor : "Custom Accent"}
                </span>
                <input
                  type="color"
                  ref={colorInputRef}
                  value={!isPredefined ? activeColor : "#4a154b"}
                  onChange={handleCustomColorChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview stacked below */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-800/50 border border-zinc-700/40 flex items-center justify-center text-zinc-300 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4.5 h-4.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">Live Preview</h3>
              <p className="text-xs text-zinc-450">
                See how your current selections will look across the interface.
              </p>
            </div>
          </div>

          {/* Interactive Mock Dashboard Container */}
          <div className="border border-zinc-800/60 rounded-3xl overflow-hidden bg-[#070b12] text-[11px] shadow-2xl flex flex-col md:flex-row aspect-video md:aspect-[21/9] min-h-[320px] max-h-[480px]">
            
            {/* Mock Sidebar */}
            <div
              className="w-full md:w-[220px] p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 transition-all duration-500 shrink-0"
              style={{
                backgroundColor: activeGradient ? undefined : activeColor,
                backgroundImage: activeGradient || undefined,
              }}
            >
              <div className="flex flex-col gap-5">
                {/* Logo & App title */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/15 rounded-xl border border-white/10 flex items-center justify-center text-white text-xs shadow-md">
                    ❤
                  </div>
                  <div className="font-extrabold text-[13px] tracking-tight text-white animate-pulse">
                    Chhapi Donation
                  </div>
                </div>

                {/* Mock Links list */}
                <div className="flex flex-col gap-1">
                  <div className="h-8 bg-white/10 rounded-xl w-full flex items-center px-3 gap-2.5 text-white/90">
                    <div className="w-3.5 h-3.5 bg-white/20 rounded-md"></div>
                    <div className="h-2 bg-white/20 rounded-md w-3/5"></div>
                  </div>
                  <div className="h-8 rounded-xl w-full flex items-center px-3 gap-2.5 text-white/60 hover:bg-white/5 transition-colors">
                    <div className="w-3.5 h-3.5 bg-white/10 rounded-md"></div>
                    <div className="h-2 bg-white/10 rounded-md w-1/2"></div>
                  </div>
                  {/* Active theme link mock - styled exactly like the curved tab */}
                  <div className="h-8 bg-white rounded-l-full w-full flex items-center px-3 gap-2.5 relative" style={{ color: activeColor }}>
                    <div className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: activeColor }}></div>
                    <div className="h-2 rounded-md w-1/2 font-bold" style={{ backgroundColor: activeColor, opacity: 0.85 }}></div>
                    {/* Outward curves */}
                    <div className="absolute right-0 top-[-8px] w-2 h-2 bg-transparent pointer-events-none" style={{ borderBottomRightRadius: '8px', boxShadow: `2px 2px 0 0 #ffffff` }}></div>
                    <div className="absolute right-0 bottom-[-8px] w-2 h-2 bg-transparent pointer-events-none" style={{ borderTopRightRadius: '8px', boxShadow: `2px -2px 0 0 #ffffff` }}></div>
                  </div>
                  <div className="h-8 rounded-xl w-full flex items-center px-3 gap-2.5 text-white/60 hover:bg-white/5 transition-colors">
                    <div className="w-3.5 h-3.5 bg-white/10 rounded-md"></div>
                    <div className="h-2 bg-white/10 rounded-md w-2/5"></div>
                  </div>
                </div>
              </div>

              {/* Bottom profile avatar */}
              <div className="h-9 bg-white/10 rounded-xl flex items-center p-2 gap-2 mt-4">
                <div className="w-6 h-6 bg-white/25 rounded-full shrink-0 flex items-center justify-center font-bold text-white text-[9px]">
                  A
                </div>
                <div className="w-2/3 h-2 bg-white/25 rounded-md"></div>
              </div>
            </div>

            {/* Mock Dashboard Content Area */}
            <div className="flex-1 p-5 flex flex-col gap-5 bg-[#0d111c] overflow-y-auto justify-between">
              
              {/* Header */}
              <div className="flex justify-between items-center border-b border-zinc-800/60 pb-3">
                <div className="flex flex-col gap-1.5 w-1/2">
                  <div className="h-3.5 bg-white/10 rounded-md w-3/4"></div>
                  <div className="h-2 bg-zinc-700/60 rounded-md w-1/2"></div>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wide">
                    Live
                  </span>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[...Array(4)].map((_, idx) => (
                  <div
                    key={idx}
                    className="h-14 bg-[#111928]/40 border border-zinc-800/40 rounded-xl p-2.5 flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center">
                      <div className="w-1/2 h-1.5 bg-zinc-700/60 rounded-md"></div>
                      <div className="w-4 h-4 bg-zinc-800/80 rounded-md"></div>
                    </div>
                    <div className="w-1/3 h-2.5 bg-zinc-600/60 rounded-md"></div>
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[2px] opacity-80"
                      style={{
                        backgroundColor: activeColor,
                        backgroundImage: activeGradient || undefined,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Central Section: Charts or Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div className="border border-zinc-800/50 bg-[#111928]/20 rounded-xl p-3.5 flex flex-col justify-between min-h-[90px]">
                  <div className="w-1/3 h-2 bg-zinc-700 rounded-md mb-2"></div>
                  <div className="h-10 w-full relative flex items-end">
                    {/* SVG Line Graph overlay in activeColor */}
                    <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                      <path
                        d="M0 25 C 20 25, 30 5, 50 15 C 70 25, 80 8, 100 5"
                        fill="none"
                        stroke={activeColor}
                        strokeWidth="2"
                      />
                      <path
                        d="M0 25 C 20 25, 30 5, 50 15 C 70 25, 80 8, 100 5 L 100 30 L 0 30 Z"
                        fill={activeColor}
                        opacity="0.1"
                      />
                    </svg>
                  </div>
                </div>

                <div className="border border-zinc-800/50 bg-[#111928]/20 rounded-xl p-3.5 flex flex-col justify-between min-h-[90px]">
                  <div className="w-1/3 h-2 bg-zinc-700 rounded-md mb-2"></div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div className="w-1/2 h-2 bg-zinc-800 rounded-md"></div>
                      <div className="w-5 h-2 bg-emerald-500/20 rounded-md"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="w-2/3 h-2 bg-zinc-800 rounded-md"></div>
                      <div className="w-5 h-2 bg-amber-500/20 rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2.5 mt-2">
                <button className="px-3.5 py-1.5 rounded-lg border border-zinc-800 text-[9px] font-semibold text-zinc-400 hover:text-zinc-200">
                  Cancel
                </button>
                <button
                  className="px-4 py-1.5 rounded-lg text-white text-[9px] font-bold transition-all shadow-md active:scale-95"
                  style={{
                    backgroundColor: activeColor,
                    backgroundImage: activeGradient || undefined,
                  }}
                >
                  Save Theme
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
