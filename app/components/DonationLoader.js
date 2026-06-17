"use client";

import React, { useEffect, useState } from "react";

export default function DonationLoader({ message = "Validating session..." }) {
  const [progress, setProgress] = useState(0);
  const [totalCoins, setTotalCoins] = useState(142600);
  const [activeDonation, setActiveDonation] = useState(null);

  useEffect(() => {
    // Smooth progress counter loop
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 40);

    // Staggered value updates synchronized with coin landing in animation (every 3 seconds)
    // Left coin drops at 49% of 6s (2.94s)
    const delayLeft = setTimeout(() => {
      const intervalLeft = setInterval(() => {
        const amt = Math.floor(Math.random() * 4 + 2) * 100; // ₹200 to ₹500
        setTotalCoins((prev) => prev + amt);
        setActiveDonation(`+₹${amt}`);
        setTimeout(() => setActiveDonation(null), 1500);
      }, 6000);
      return () => clearInterval(intervalLeft);
    }, 2900);

    // Right coin drops at 49% of 6s + 3s delay (5.94s)
    const delayRight = setTimeout(() => {
      const intervalRight = setInterval(() => {
        const amt = Math.floor(Math.random() * 5 + 3) * 100; // ₹300 to ₹700
        setTotalCoins((prev) => prev + amt);
        setActiveDonation(`+₹${amt}`);
        setTimeout(() => setActiveDonation(null), 1500);
      }, 6000);
      return () => clearInterval(intervalRight);
    }, 5900);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(delayLeft);
      clearTimeout(delayRight);
    };
  }, []);

  return (
    <div className="dashboard-light-theme fixed inset-0 bg-[#060814] text-zinc-100 flex flex-col items-center justify-center font-sans z-[9999] overflow-hidden select-none">
      {/* Advanced CSS Animations */}
      <style>{`
        @keyframes bgGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes walkLeft {
          0% { transform: translate(-120px, 0px) scaleX(1); opacity: 0; }
          8% { opacity: 1; }
          /* Realistic walk bobbing */
          10% { transform: translate(-20px, -4px) scaleX(1); }
          15% { transform: translate(40px, 0px) scaleX(1); }
          20% { transform: translate(100px, -4px) scaleX(1); }
          25% { transform: translate(160px, 0px) scaleX(1); }
          30% { transform: translate(220px, -4px) scaleX(1); }
          35% { transform: translate(275px, 0px) scaleX(1); }
          /* Stand still & contribute */
          50% { transform: translate(275px, 0px) scaleX(1); }
          /* Turn and walk back */
          54% { transform: translate(275px, 0px) scaleX(-1); }
          60% { transform: translate(210px, -4px) scaleX(-1); }
          65% { transform: translate(150px, 0px) scaleX(-1); }
          70% { transform: translate(90px, -4px) scaleX(-1); }
          75% { transform: translate(30px, 0px) scaleX(-1); }
          80% { transform: translate(-30px, -4px) scaleX(-1); }
          85% { transform: translate(-90px, 0px) scaleX(-1); }
          92% { opacity: 1; }
          100% { transform: translate(-150px, 0px) scaleX(-1); opacity: 0; }
        }
        @keyframes walkRight {
          0% { transform: translate(920px, 0px) scaleX(-1); opacity: 0; }
          8% { opacity: 1; }
          /* Bobbing */
          10% { transform: translate(820px, -4px) scaleX(-1); }
          15% { transform: translate(760px, 0px) scaleX(-1); }
          20% { transform: translate(700px, -4px) scaleX(-1); }
          25% { transform: translate(640px, 0px) scaleX(-1); }
          30% { transform: translate(580px, -4px) scaleX(-1); }
          35% { transform: translate(525px, 0px) scaleX(-1); }
          /* Donate */
          50% { transform: translate(525px, 0px) scaleX(-1); }
          /* Turn & Walk home */
          54% { transform: translate(525px, 0px) scaleX(1); }
          60% { transform: translate(590px, -4px) scaleX(1); }
          65% { transform: translate(650px, 0px) scaleX(1); }
          70% { transform: translate(710px, -4px) scaleX(1); }
          75% { transform: translate(770px, 0px) scaleX(1); }
          80% { transform: translate(830px, -4px) scaleX(1); }
          85% { transform: translate(890px, 0px) scaleX(1); }
          92% { opacity: 1; }
          100% { transform: translate(950px, 0px) scaleX(1); opacity: 0; }
        }
        @keyframes armL {
          0%, 35%, 53%, 100% { transform: rotate(0deg); }
          42%, 48% { transform: rotate(-35deg); }
        }
        @keyframes armR {
          0%, 35%, 53%, 100% { transform: rotate(0deg); }
          42%, 48% { transform: rotate(35deg); }
        }
        @keyframes 3dCoinDropL {
          0%, 42% { transform: translate(305px, 205px) scale(0) rotateY(0deg); opacity: 0; }
          44% { transform: translate(305px, 205px) scale(1.2) rotateY(90deg); opacity: 1; }
          49% { transform: translate(370px, 210px) scale(0.9) rotateY(270deg); opacity: 1; }
          52% { transform: translate(400px, 245px) scale(0.4) rotateY(450deg); opacity: 0.1; }
          53%, 100% { transform: translate(400px, 245px) scale(0) rotateY(450deg); opacity: 0; }
        }
        @keyframes 3dCoinDropR {
          0%, 42% { transform: translate(495px, 205px) scale(0) rotateY(0deg); opacity: 0; }
          44% { transform: translate(495px, 205px) scale(1.2) rotateY(90deg); opacity: 1; }
          49% { transform: translate(430px, 210px) scale(0.9) rotateY(270deg); opacity: 1; }
          52% { transform: translate(400px, 245px) scale(0.4) rotateY(450deg); opacity: 0.1; }
          53%, 100% { transform: translate(400px, 245px) scale(0) rotateY(450deg); opacity: 0; }
        }
        @keyframes boxReact {
          0%, 48%, 56%, 100% { transform: scale(1); filter: drop-shadow(0 15px 30px rgba(16, 185, 129, 0.2)); }
          51%, 53% { transform: scale(1.07) translateY(2px); filter: drop-shadow(0 25px 45px rgba(245, 158, 11, 0.5)); }
        }
        @keyframes floatHeart {
          0%, 51% { transform: translate(400px, 235px) scale(0); opacity: 0; }
          54% { transform: translate(390px, 190px) scale(1.3); opacity: 1; }
          75% { transform: translate(360px, 110px) scale(1.1); opacity: 0.8; }
          100% { transform: translate(340px, 50px) scale(0.6) rotate(-20deg); opacity: 0; }
        }
        @keyframes floatLeaf {
          0%, 51% { transform: translate(400px, 235px) scale(0) rotate(0deg); opacity: 0; }
          54% { transform: translate(410px, 195px) scale(1.3) rotate(30deg); opacity: 1; }
          75% { transform: translate(440px, 120px) scale(1) rotate(60deg); opacity: 0.8; }
          100% { transform: translate(465px, 60px) scale(0.6) rotate(100deg); opacity: 0; }
        }
        @keyframes burstStar1 {
          0%, 50% { transform: translate(400px, 240px) scale(0) rotate(0deg); opacity: 0; }
          52% { transform: translate(370px, 205px) scale(1.2) rotate(45deg); opacity: 1; }
          65% { transform: translate(345px, 180px) scale(0.8) rotate(90deg); opacity: 0.7; }
          100% { transform: translate(335px, 165px) scale(0) rotate(120deg); opacity: 0; }
        }
        @keyframes burstStar2 {
          0%, 50% { transform: translate(400px, 240px) scale(0) rotate(0deg); opacity: 0; }
          52% { transform: translate(430px, 205px) scale(1.2) rotate(-45deg); opacity: 1; }
          65% { transform: translate(455px, 180px) scale(0.8) rotate(-90deg); opacity: 0.7; }
          100% { transform: translate(465px, 165px) scale(0) rotate(-120deg); opacity: 0; }
        }
        @keyframes rippleRing {
          0%, 51% { transform: translate(400px, 240px) scale(0.2); opacity: 0; }
          53% { opacity: 1; }
          70% { transform: translate(400px, 240px) scale(1.8); opacity: 0; }
          100% { transform: translate(400px, 240px) scale(2); opacity: 0; }
        }
        @keyframes counterPop {
          0%, 100% { transform: scale(1); color: #ffffff; }
          50% { transform: scale(1.05); color: #f59e0b; text-shadow: 0 0 15px rgba(245, 158, 11, 0.4); }
        }
        .anim-left {
          animation: walkLeft 6s infinite linear;
        }
        .anim-right {
          animation: walkRight 6s infinite linear;
          animation-delay: 3s;
        }
        .arm-left {
          animation: armL 6s infinite ease-in-out;
        }
        .arm-right {
          animation: armR 6s infinite ease-in-out;
          animation-delay: 3s;
        }
        .coin-left {
          animation: 3dCoinDropL 6s infinite cubic-bezier(0.16, 1, 0.3, 1);
        }
        .coin-right {
          animation: 3dCoinDropR 6s infinite cubic-bezier(0.16, 1, 0.3, 1);
          animation-delay: 3s;
        }
        .box-body {
          animation: boxReact 3s infinite ease-in-out;
        }
        .heart-float {
          animation: floatHeart 6s infinite ease-out;
        }
        .leaf-float {
          animation: floatLeaf 6s infinite ease-out;
          animation-delay: 3s;
        }
        .star-burst-1 {
          animation: burstStar1 6s infinite ease-out;
        }
        .star-burst-2 {
          animation: burstStar2 6s infinite ease-out;
          animation-delay: 3s;
        }
        .ripple-ring-1 {
          animation: rippleRing 6s infinite cubic-bezier(0.1, 0.8, 0.2, 1);
        }
        .ripple-ring-2 {
          animation: rippleRing 6s infinite cubic-bezier(0.1, 0.8, 0.2, 1);
          animation-delay: 3s;
        }
        .counter-glow {
          animation: counterPop 3s infinite ease-in-out;
        }
      `}</style>

      {/* Ambient moving background lights */}
      <div 
        className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] rounded-full bg-emerald-500/10 blur-[180px] pointer-events-none"
        style={{ animation: "bgGlow 10s infinite ease-in-out" }}
      ></div>
      <div 
        className="absolute bottom-[-30%] right-[-20%] w-[80%] h-[80%] rounded-full bg-purple-600/10 blur-[180px] pointer-events-none"
        style={{ animation: "bgGlow 10s infinite ease-in-out", animationDelay: "5s" }}
      ></div>

      <div className="max-w-2xl w-full flex flex-col items-center p-6 space-y-8 z-10">
        
        {/* Dynamic Premium Header Card */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Chhapi Donation Fund Pool
          </div>
          
          {/* Glowing Counter */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3 font-mono counter-glow">
            ₹{totalCoins.toLocaleString("en-IN")}
          </h1>
          <p className="text-[11px] text-zinc-400 tracking-wider uppercase font-semibold">
            Total Contributions Received Live
          </p>
        </div>

        {/* Live Donation popups */}
        <div className="h-6 relative w-full flex justify-center items-center">
          {activeDonation && (
            <span className="absolute text-emerald-400 font-extrabold text-sm tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full animate-bounce backdrop-blur">
              {activeDonation} Registered!
            </span>
          )}
        </div>

        {/* SVG Animation Stage inside Premium Frame */}
        <div className="w-full max-w-lg aspect-[2/1] relative bg-gradient-to-b from-[#0e1327]/40 to-[#070b14]/90 border border-zinc-800/40 rounded-[32px] backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
          <svg viewBox="0 0 800 400" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <linearGradient id="floorGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <clipPath id="logoClip">
                <circle cx="400" cy="290" r="23" />
              </clipPath>
            </defs>

            {/* Stage Floor and Guidelines */}
            <path d="M 50 350 L 750 350" stroke="url(#floorGrad)" strokeWidth="3" strokeLinecap="round" />

            {/* Ripple rings on coin drop */}
            <circle cx="0" cy="0" r="30" fill="none" stroke="#eab308" strokeWidth="2.5" className="ripple-ring-1" style={{ transformOrigin: "0px 0px" }} />
            <circle cx="0" cy="0" r="30" fill="none" stroke="#10b981" strokeWidth="2.5" className="ripple-ring-2" style={{ transformOrigin: "0px 0px" }} />

            {/* --- WALKERS --- */}
            {/* Walker Left (Man in blue jacket) */}
            <g className="anim-left">
              {/* Floor Shadow */}
              <ellipse cx="0" cy="350" rx="18" ry="4.5" fill="rgba(0,0,0,0.3)" />
              {/* Head */}
              <circle cx="0" cy="190" r="14" fill="#fbcfe8" />
              {/* Hair */}
              <path d="M-14,188 C-14,172 14,172 14,188 Z" fill="#1e293b" />
              {/* Torso */}
              <path d="M-18,275 C-18,215 18,215 18,275 L15,350 L-15,350 Z" fill="#2563eb" />
              {/* Inner shirt / details */}
              <path d="M-6,215 L6,215 L0,235 Z" fill="#ffffff" />
              <path d="M-2,235 L2,235 L0,265 Z" fill="#ef4444" />
              {/* Arm */}
              <g className="arm-left" style={{ transformOrigin: "12px 220px" }}>
                <path d="M12,220 C25,210 32,200 35,185" stroke="#fbcfe8" strokeWidth="7" strokeLinecap="round" fill="none" />
                <circle cx="35" cy="182" r="3" fill="#fbcfe8" />
              </g>
            </g>

            {/* Walker Right (Woman in green jacket) */}
            <g className="anim-right">
              {/* Floor Shadow */}
              <ellipse cx="0" cy="350" rx="18" ry="4.5" fill="rgba(0,0,0,0.3)" />
              {/* Head */}
              <circle cx="0" cy="190" r="14" fill="#fed7aa" />
              {/* Hair */}
              <path d="M-14,188 C-14,172 14,172 14,188 Z" fill="#b45309" />
              {/* Torso */}
              <path d="M-18,275 C-18,215 18,215 18,275 L15,350 L-15,350 Z" fill="#059669" />
              {/* Arm */}
              <g className="arm-right" style={{ transformOrigin: "-12px 220px" }}>
                <path d="M-12,220 C-25,210 -32,200 -35,185" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" fill="none" />
                <circle cx="-35" cy="182" r="3" fill="#fed7aa" />
              </g>
            </g>

            {/* --- 3D ROTATING SHINY COINS --- */}
            <g className="coin-left">
              <circle cx="0" cy="0" r="10" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(234,179,8,0.4))" />
              <text x="0" y="3.5" textAnchor="middle" fill="#854d0e" fontSize="11" fontWeight="extrabold" fontFamily="sans-serif">₹</text>
            </g>

            <g className="coin-right">
              <circle cx="0" cy="0" r="10" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(234,179,8,0.4))" />
              <text x="0" y="3.5" textAnchor="middle" fill="#854d0e" fontSize="11" fontWeight="extrabold" fontFamily="sans-serif">₹</text>
            </g>

            {/* --- DONATION CHEST (DABBA) --- */}
            <g className="box-body" style={{ transformOrigin: "400px 300px" }}>
              {/* Drop shadow */}
              <ellipse cx="400" cy="350" rx="52" ry="12" fill="rgba(0,0,0,0.6)" />

              {/* Main Chest Structure (Premium Emerald Green) */}
              <rect x="345" y="240" width="110" height="110" rx="20" fill="url(#boxGrad)" stroke="#10b981" strokeWidth="3" />

              {/* Gold Corner Guards */}
              <path d="M 345 265 L 345 240 L 370 240" fill="none" stroke="#eab308" strokeWidth="3" />
              <path d="M 455 265 L 455 240 L 430 240" fill="none" stroke="#eab308" strokeWidth="3" />
              <path d="M 345 325 L 345 350 L 370 350" fill="none" stroke="#eab308" strokeWidth="3" />
              <path d="M 455 325 L 455 350 L 430 350" fill="none" stroke="#eab308" strokeWidth="3" />

              {/* Gold Ornament Rim inside */}
              <rect x="353" y="248" width="94" height="94" rx="14" fill="none" stroke="#ca8a04" strokeWidth="1.5" opacity="0.5" />
              
              {/* Circular Medallion holding the Chhapi Logo */}
              <circle cx="400" cy="295" r="28" fill="#ca8a04" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.4))" />
              <circle cx="400" cy="295" r="25" fill="#ffffff" />
              <image href="/logo.png" x="375" y="270" width="50" height="50" clipPath="url(#logoClip)" />

              {/* Lid / Top Slot Frame */}
              <rect x="355" y="231" width="90" height="10" rx="5" fill="#ca8a04" stroke="#fef08a" strokeWidth="1.5" />
              <rect x="375" y="234" width="50" height="4" rx="2" fill="#090d16" />
            </g>

            {/* --- PARTICLES & DECORATIONS --- */}
            {/* Burst stars */}
            <path d="M 0 0 L 2 -5 L 7 -5 L 3 -2 L 5 3 L 0 0 Z" fill="#f59e0b" className="star-burst-1" style={{ transformOrigin: "0 0" }} />
            <path d="M 0 0 L 2 -5 L 7 -5 L 3 -2 L 5 3 L 0 0 Z" fill="#ef4444" className="star-burst-2" style={{ transformOrigin: "0 0" }} />

            {/* Floating Heart (Left drop) */}
            <g className="heart-float">
              <path d="M 0 0 C 0 0, -9 -7, -9 -12 C -9 -17, -4 -19, -1 -15 L 0 -13 L 1 -15 C 4 -19, 9 -17, 9 -12 C 9 -7, 0 0, 0 0 Z" fill="#ef4444" filter="drop-shadow(0 2px 4px rgba(239,68,68,0.3))" />
            </g>

            {/* Floating Leaf (Right drop) */}
            <g className="leaf-float">
              <path d="M0,0 C8,-12 12,-15 15,-15 C15,-8 10,-2 0,0 C-10,-2 -15,-8 -15,-15 C-12,-15 -8,-12 0,0 Z" fill="#10b981" filter="drop-shadow(0 2px 4px rgba(16,185,129,0.3))" />
            </g>
          </svg>
        </div>

        {/* Progress and status loading card */}
        <div className="w-full max-w-sm bg-[#111928]/30 border border-zinc-800/50 rounded-3xl p-6 backdrop-blur-md shadow-lg space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-[15px] font-bold text-white tracking-wide">
              {message}
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
              Encrypted handshake verification
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden relative border border-zinc-800/60 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 shadow-[0_0_12px_#10b981] transition-all duration-300 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono">
              <span className="animate-pulse">SYNCHRONIZING REPOSITORIES...</span>
              <span className="text-emerald-400 font-bold">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Hindi support text */}
        <p className="text-[11px] text-zinc-650 italic font-medium text-center">
          "आपका सहयोग, किसी की आशा"
        </p>

      </div>
    </div>
  );
}
