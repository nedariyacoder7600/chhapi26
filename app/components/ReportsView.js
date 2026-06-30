"use client";

import React, { useState, useEffect } from "react";

// Timeframe data definitions
const reportsData = {
  "7D": {
    averageContribution: 2850,
    recurringRate: 58,
    totalRaised: 89400,
    chartPoints: [
      { label: "Mon", value: 12000, users: 14 },
      { label: "Tue", value: 8500, users: 9 },
      { label: "Wed", value: 15000, users: 18 },
      { label: "Thu", value: 9200, users: 11 },
      { label: "Fri", value: 18400, users: 22 },
      { label: "Sat", value: 11300, users: 15 },
      { label: "Sun", value: 15000, users: 19 }
    ],
    campaigns: [
      { name: "Food Distribution", percent: 50, amount: 44700, color: "bg-blue-500" },
      { name: "Emergency Medical Aid", percent: 30, amount: 26820, color: "bg-emerald-500" },
      { name: "Education Support", percent: 20, amount: 17880, color: "bg-amber-500" }
    ]
  },
  "30D": {
    averageContribution: 3120,
    recurringRate: 61,
    totalRaised: 395000,
    chartPoints: [
      { label: "Week 1", value: 85000, users: 78 },
      { label: "Week 2", value: 98000, users: 92 },
      { label: "Week 3", value: 112000, users: 105 },
      { label: "Week 4", value: 100000, users: 89 }
    ],
    campaigns: [
      { name: "Food Distribution", percent: 45, amount: 177750, color: "bg-blue-500" },
      { name: "Emergency Medical Aid", percent: 35, amount: 138250, color: "bg-emerald-500" },
      { name: "Education Support", percent: 20, amount: 79000, color: "bg-amber-500" }
    ]
  },
  "YTD": {
    averageContribution: 3420,
    recurringRate: 64,
    totalRaised: 1845000,
    chartPoints: [
      { label: "Jan", value: 120000, users: 110 },
      { label: "Feb", value: 145000, users: 134 },
      { label: "Mar", value: 130000, users: 121 },
      { label: "Apr", value: 165000, users: 156 },
      { label: "May", value: 190000, users: 180 },
      { label: "Jun", value: 215000, users: 205 },
      { label: "Jul", value: 170000, users: 162 },
      { label: "Aug", value: 210000, users: 198 },
      { label: "Sep", value: 230000, users: 210 },
      { label: "Oct", value: 275000, users: 245 }
    ],
    campaigns: [
      { name: "Food Distribution", percent: 42, amount: 774900, color: "bg-blue-500" },
      { name: "Emergency Medical Aid", percent: 38, amount: 701100, color: "bg-emerald-500" },
      { name: "Education Support", percent: 20, amount: 369000, color: "bg-amber-500" }
    ]
  }
};

export default function ReportsView() {
  const [timeframe, setTimeframe] = useState("YTD");
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const activeData = reportsData[timeframe];

  // Export progress simulation
  useEffect(() => {
    let interval;
    if (isExporting) {
      setExportProgress(0);
      interval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsExporting(false);
            }, 800);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isExporting]);

  // Compute SVG Line coordinates based on values
  const getSvgPathData = () => {
    const points = activeData.chartPoints;
    if (points.length === 0) return { line: "", area: "" };

    const maxVal = Math.max(...points.map((p) => p.value)) * 1.1; // Add padding
    const width = 800;
    const height = 260;
    const paddingX = 40;
    const paddingY = 20;

    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;

    const coords = points.map((p, index) => {
      const x = paddingX + (index / (points.length - 1)) * chartWidth;
      const y = paddingY + chartHeight - (p.value / maxVal) * chartHeight;
      return { x, y };
    });

    let linePath = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      // Create smooth Bezier curves
      const cpX1 = coords[i - 1].x + (coords[i].x - coords[i - 1].x) / 3;
      const cpY1 = coords[i - 1].y;
      const cpX2 = coords[i - 1].x + (2 * (coords[i].x - coords[i - 1].x)) / 3;
      const cpY2 = coords[i].y;
      linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${coords[i].x} ${coords[i].y}`;
    }

    const areaPath = `
      ${linePath} 
      L ${coords[coords.length - 1].x} ${height - paddingY} 
      L ${coords[0].x} ${height - paddingY} 
      Z
    `;

    return { line: linePath, area: areaPath, coords };
  };

  const { line, area, coords } = getSvgPathData();

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 sm:pb-12 bg-[#070b12] text-zinc-100 relative">
      
      {/* Background decorations */}
      <div className="absolute top-[-5%] left-[-10%] w-[35%] h-[35%] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

      {/* Header section */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 relative">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">System Growth & Analytics</h1>
          <p className="text-zinc-400 mt-2 text-sm">Detailed graphs, campaign conversion ratios, and donor demographic reports.</p>
        </div>

        {/* Timeframe selector & export */}
        <div className="flex items-center gap-4">
          <div className="bg-zinc-900/60 p-1 rounded-xl border border-zinc-800 flex shadow-inner">
            {["7D", "30D", "YTD"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeframe === t
                    ? "bg-primary-accent text-white shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsExporting(true)}
            className="text-white text-xs font-bold px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 cursor-pointer border border-zinc-700/30 flex items-center gap-2 shadow-md"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Sheet
          </button>
        </div>
      </header>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 z-10 relative">
        {/* KPI 1 */}
        <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Contributions Raised</span>
            <h2 className="text-3xl font-extrabold text-white">₹{activeData.totalRaised.toLocaleString("en-IN")}</h2>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <span>↑ {timeframe === "7D" ? "14.2%" : timeframe === "30D" ? "11.8%" : "23.4%"}</span>
              <span className="text-zinc-500 font-medium">from last cycle</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-accent/15 border border-primary-accent/20 flex items-center justify-center text-primary-accent">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Average Contribution</span>
            <h2 className="text-3xl font-extrabold text-white">₹{activeData.averageContribution.toLocaleString("en-IN")}</h2>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <span>↑ {timeframe === "7D" ? "3.2%" : timeframe === "30D" ? "5.4%" : "12.3%"}</span>
              <span className="text-zinc-500 font-medium">average per donor</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Recurring Donors</span>
            <h2 className="text-3xl font-extrabold text-white">{activeData.recurringRate}%</h2>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <span>↑ {timeframe === "7D" ? "0.8%" : timeframe === "30D" ? "2.1%" : "4.1%"}</span>
              <span className="text-zinc-500 font-medium">retention rate</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Charts section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 z-10 relative">
        
        {/* SVG Area Chart (2/3 width on large screens) */}
        <div className="xl:col-span-2 bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between shadow-2xl relative min-h-[380px]">
          
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-white">Funds Growth Dynamics</h3>
              <p className="text-xs text-zinc-500">Live graphical area distribution of processed contributions.</p>
            </div>

            {/* Legend indicators */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-primary-accent rounded-full"></span>
                <span className="text-zinc-400 font-medium">Funds (INR)</span>
              </div>
            </div>
          </div>

          {/* Custom SVG Area Chart */}
          <div className="flex-1 w-full relative h-[260px] flex items-center justify-center">
            
            {/* Grid Line Helpers behind SVG */}
            <div className="absolute inset-0 flex flex-col justify-between py-[20px] px-[40px] pointer-events-none select-none">
              <div className="border-b border-zinc-800/30 w-full h-px"></div>
              <div className="border-b border-zinc-800/30 w-full h-px"></div>
              <div className="border-b border-zinc-800/30 w-full h-px"></div>
              <div className="border-b border-zinc-800/30 w-full h-px"></div>
            </div>

            <svg viewBox="0 0 800 260" className="w-full h-full overflow-visible z-10">
              <defs>
                {/* Area fill gradient color */}
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary-accent)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--primary-accent)" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Area path */}
              <path d={area} fill="url(#chartGradient)" />

              {/* Line path */}
              <path d={line} fill="none" stroke="var(--primary-accent)" strokeWidth="3" className="drop-shadow-[0_4px_8px_rgba(74,21,75,0.4)]" />

              {/* Interactive coordinates dots */}
              {coords && coords.map((c, i) => (
                <g key={i}>
                  {/* Outer circle halo shown on hover */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={hoveredPoint === i ? "10" : "0"}
                    fill="var(--primary-accent)"
                    opacity="0.15"
                    className="transition-all duration-200"
                  />
                  {/* Main active dot */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={hoveredPoint === i ? "6" : "4.5"}
                    fill="#ffffff"
                    stroke="var(--primary-accent)"
                    strokeWidth="3"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              ))}
            </svg>

            {/* Dynamic floating tooltip inside chart container */}
            {hoveredPoint !== null && coords && (
              <div
                className="absolute z-20 bg-zinc-950/90 border border-zinc-800 p-3.5 rounded-2xl shadow-2xl backdrop-blur text-xs pointer-events-none animate-[fadeIn_0.15s_ease-out]"
                style={{
                  left: `${(coords[hoveredPoint].x / 800) * 100}%`,
                  top: `${(coords[hoveredPoint].y / 260) * 100 - 32}%`,
                  transform: "translateX(-50%) translateY(-100%)",
                }}
              >
                <div className="font-bold text-zinc-400 uppercase text-[9px] tracking-wider">
                  {activeData.chartPoints[hoveredPoint].label}
                </div>
                <div className="font-extrabold text-white mt-1 text-sm">
                  ₹{activeData.chartPoints[hoveredPoint].value.toLocaleString("en-IN")}
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">
                  {activeData.chartPoints[hoveredPoint].users} contributors
                </div>
              </div>
            )}
          </div>

          {/* SVG X-Axis Labels Row */}
          <div className="flex justify-between px-[20px] md:px-[32px] pt-4 border-t border-zinc-800/40 text-[8px] md:text-[10px] font-mono text-zinc-500 uppercase tracking-wider overflow-hidden">
            {activeData.chartPoints.map((p, i) => {
              // Hide alternate items on mobile when there are more than 5 labels to avoid overlapping
              const isMobileAlternate = activeData.chartPoints.length > 5 && i % 2 !== 0;
              return (
                <span
                  key={i}
                  className={`text-center w-8 ${isMobileAlternate ? "hidden md:inline-block" : "inline-block"}`}
                >
                  {p.label}
                </span>
              );
            })}
          </div>

        </div>

        {/* Campaign Allocation Card (1/3 width) */}
        <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between shadow-2xl relative min-h-[380px]">
          
          <div className="space-y-0.5 mb-6">
            <h3 className="text-base font-bold text-white">Campaign Allocation</h3>
            <p className="text-xs text-zinc-500">Distribution breakdown of total funds across programs.</p>
          </div>

          {/* Bar metrics visualization */}
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {activeData.campaigns.map((camp) => (
              <div key={camp.name} className="space-y-2 group">
                
                {/* Text and figures */}
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-semibold group-hover:text-primary-accent transition-colors">
                    {camp.name}
                  </span>
                  <span className="font-mono font-bold text-white">
                    {camp.percent}% <span className="text-zinc-500 font-medium">({`₹${camp.amount.toLocaleString("en-IN")}`})</span>
                  </span>
                </div>

                {/* Progress track */}
                <div className="h-2 w-full bg-zinc-900/60 rounded-full overflow-hidden border border-zinc-800/30">
                  <div
                    className={`h-full ${camp.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${camp.percent}%` }}
                  ></div>
                </div>

              </div>
            ))}
          </div>

          {/* Static informational card bottom */}
          <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-4 mt-6 text-xs text-zinc-500 leading-relaxed">
            Percentages represent actual funds credited directly to respective trust wallets after super-admin validation.
          </div>

        </div>

      </div>

      {/* MODAL: SIMULATED EXPORT PROGRESS */}
      {isExporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#111928] border border-zinc-800 rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl">
            
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white">Compiling Sheets</h3>
              <p className="text-zinc-400 text-xs mt-1">Generating custom Excel formatting templates...</p>
            </div>

            {/* Custom styled progress indicator */}
            <div className="my-8 relative flex items-center justify-center">
              
              {/* Radial or linear status bar */}
              <div className="w-full space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500">Progress:</span>
                  <span className="text-white font-bold">{exportProgress}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-primary-accent transition-all duration-150"
                    style={{ width: `${exportProgress}%` }}
                  ></div>
                </div>
              </div>

            </div>

            <div className="text-xs text-zinc-500">
              {exportProgress < 100 ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Encoding lines...
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
                  ✓ Ready! Download initialized.
                </span>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
