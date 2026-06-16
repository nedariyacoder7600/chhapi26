"use client";

import React, { useState, useEffect, useRef } from "react";

export default function ThemeSettingsView() {
  const colors = [
    // Row 1
    { name: "Aubergine", value: "#4a154b" },
    { name: "Clementine", value: "#e15b00" },
    { name: "Banana", value: "#ecb22e" },

    // Row 2
    { name: "Emerald", value: "#2eb67d" },
    { name: "Cyan", value: "#11a8cd" },
    { name: "Purple", value: "#8f39d8" },

    // Row 3
    { name: "Slate", value: "#4a5568" },
    { name: "Coral", value: "#ff7a59" },
    { name: "Tomato", value: "#ff5252" },

    // Row 4
    { name: "Royal Blue", value: "#3f51b5" },
    { name: "Medium Slate Blue", value: "#7b68ee" },
    { name: "Blue Violet", value: "#8a2be2" },

    // Row 5
    { name: "Peru", value: "#cd853f" },
    { name: "Golden Rod", value: "#daa520" },
    { name: "Dark Khaki", value: "#bdb76b" },

    // Row 6
    { name: "Deep Purple", value: "#673ab7" },
    { name: "Dark Magenta", value: "#8b008b" },
    { name: "Hot Pink", value: "#ff69b4" },

    // Row 7
    { name: "Aqua", value: "#00ffff" },
    { name: "Turquoise", value: "#40e0d0" },
    { name: "Medium Turquoise", value: "#48d1cc" },

    // Row 8 (Orange Red, Custom Color in middle column)
    { name: "Orange Red", value: "#ff4500" },
  ];

  const [activeColor, setActiveColor] = useState("#4a154b");
  const colorInputRef = useRef(null);

  useEffect(() => {
    const savedColor = localStorage.getItem("sidebar-accent-color");
    if (savedColor) {
      setActiveColor(savedColor);
    }
  }, []);

  const selectColor = (color) => {
    setActiveColor(color);
    localStorage.setItem("sidebar-accent-color", color);
    document.documentElement.style.setProperty("--primary-accent", color);
    
    // Dispatch custom event to notify Sidebar of color change instantly
    window.dispatchEvent(new Event("accent-color-change"));
  };

  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    selectColor(color);
  };

  const isPredefined = colors.some(
    (c) => c.value.toLowerCase() === activeColor.toLowerCase()
  );

  return (
    <div className="flex-1 flex flex-col p-8 bg-[#070b12] text-zinc-100 min-h-screen">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-white tracking-wide">Appearance & Theme</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Customize the primary accent color scheme and styling of your dashboard.
        </p>
      </header>

      <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Color Options List Card */}
        <div className="lg:col-span-7 flex flex-col gap-6 bg-[#111928]/40 border border-zinc-800/80 rounded-3xl p-8 shadow-xl">
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">Primary Accent Color</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              This color will be used for buttons, active states, and highlights across your dashboard.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-y-8 gap-x-4 py-4 justify-items-center">
            {/* Map Predefined Colors */}
            {colors.map((c) => {
              const isSelected = activeColor.toLowerCase() === c.value.toLowerCase();
              return (
                <div
                  key={c.value}
                  className="flex flex-col items-center gap-2.5 group cursor-pointer w-24"
                  onClick={() => selectColor(c.value)}
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "ring-2 ring-offset-4 ring-offset-[#070b12] ring-white scale-105"
                        : "hover:scale-105 active:scale-95 border border-white/5"
                    }`}
                    style={{ backgroundColor: c.value }}
                  >
                    {isSelected && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="w-5 h-5 text-white drop-shadow-md"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-medium tracking-wide text-center transition-colors truncate w-full ${
                      isSelected
                        ? "text-white font-semibold"
                        : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  >
                    {c.name}
                  </span>
                </div>
              );
            })}

            {/* Custom Color Button */}
            <div
              className="flex flex-col items-center gap-2.5 group cursor-pointer w-24"
              onClick={() => colorInputRef.current && colorInputRef.current.click()}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                  !isPredefined
                    ? "ring-2 ring-offset-4 ring-offset-[#070b12] ring-white scale-105"
                    : "hover:scale-105 active:scale-95 bg-[#1f2a3f]/40 border border-zinc-700/50 hover:border-zinc-500"
                }`}
                style={{
                  backgroundColor: !isPredefined ? activeColor : undefined,
                }}
              >
                {!isPredefined ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="w-5 h-5 text-white drop-shadow-md"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                )}
              </div>
              <span
                className={`text-[11px] font-medium tracking-wide text-center transition-colors truncate w-full uppercase ${
                  !isPredefined
                    ? "text-white font-semibold"
                    : "text-zinc-400 group-hover:text-zinc-200"
                }`}
              >
                {!isPredefined ? activeColor : "Custom Color"}
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

        {/* Live Preview Panel */}
        <div className="lg:col-span-5 bg-[#111928]/60 border border-zinc-800/50 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl h-fit">
          <h3 className="text-lg font-semibold text-white">Live Theme Preview</h3>
          
          {/* Mock Layout */}
          <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-[#070b12] text-[10px] aspect-[4/3] flex">
            {/* Mock Sidebar */}
            <div
              className="w-1/3 p-2.5 flex flex-col justify-between border-r border-white/5 transition-all duration-300"
              style={{ backgroundColor: activeColor }}
            >
              <div className="flex flex-col gap-3">
                {/* Logo */}
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-white/10 rounded border border-white/10 flex items-center justify-center text-[8px]">
                    ❤
                  </div>
                  <div className="scale-75 origin-left font-bold whitespace-nowrap">Donation</div>
                </div>
                {/* Mock Links */}
                <div className="flex flex-col gap-1">
                  <div className="h-3 bg-white/10 rounded-md w-full"></div>
                  <div className="h-3 rounded-md w-4/5 hover:bg-white/5"></div>
                  <div className="h-3 rounded-md w-3/4 hover:bg-white/5"></div>
                </div>
              </div>
              {/* Profile Card */}
              <div className="h-5 bg-white/10 rounded flex items-center p-1 gap-1">
                <div className="w-3 h-3 bg-white/20 rounded-full shrink-0"></div>
                <div className="w-3/5 h-2 bg-white/20 rounded"></div>
              </div>
            </div>

            {/* Mock Main Content */}
            <div className="flex-1 p-3 flex flex-col gap-3 bg-[#0d111c]">
              <div className="h-3 bg-zinc-800 rounded-md w-1/2"></div>
              {/* Cards Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="h-8 bg-[#131b2e] border border-zinc-800 rounded p-1 flex items-center justify-between">
                  <div className="w-4 h-4 bg-blue-500/10 rounded"></div>
                  <div className="w-1/2 h-2 bg-zinc-700 rounded"></div>
                </div>
                <div className="h-8 bg-[#131b2e] border border-zinc-800 rounded p-1 flex items-center justify-between">
                  <div className="w-4 h-4 bg-emerald-500/10 rounded"></div>
                  <div className="w-1/2 h-2 bg-zinc-700 rounded"></div>
                </div>
              </div>
              {/* Button */}
              <div
                className="h-5 rounded-md flex items-center justify-center text-white font-semibold transition-colors duration-300"
                style={{ backgroundColor: activeColor }}
              >
                Primary Action
              </div>
            </div>
          </div>
          
          <p className="text-xs text-zinc-400 leading-relaxed text-center">
            Click any color option on the left or click 'Custom Color' to dynamically shift the accent themes across the website instantly.
          </p>
        </div>
      </div>
    </div>
  );
}
