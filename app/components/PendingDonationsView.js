"use client";

import React, { useState, useEffect } from "react";
import { 
  getCurrentUser, 
  getPendingDonations, 
  savePendingDonations, 
  getDonationsHistory, 
  saveDonationsHistory,
  getUsers,
  saveUsers,
  addAuditLog,
  getFunds,
  saveFunds,
  addFunds
} from "../utils/db";

export default function PendingDonationsView() {
  const [currentUser, setCurrentUser] = useState(null);
  const [donations, setDonations] = useState([]);
  
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const [searchTerm, setSearchTerm] = useState("");
  const [toasts, setToasts] = useState([]);

  // Modal control states
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [approvingDonation, setApprovingDonation] = useState(null);
  const [rejectingDonation, setRejectingDonation] = useState(null);

  // Approval form details
  const [selectedWallet, setSelectedWallet] = useState("Food Distribution");
  const [rejectionReason, setRejectionReason] = useState("");

  // USER: Submit New Claim states
  const [isSubmitClaimOpen, setIsSubmitClaimOpen] = useState(false);
  const [claimAmount, setClaimAmount] = useState("");
  const [claimCampaign, setClaimCampaign] = useState("Food Distribution");
  const [claimBank, setClaimBank] = useState("State Bank of India");
  const [claimRefNo, setClaimRefNo] = useState("");
  const [claimDate, setClaimDate] = useState("");
  const [claimTime, setClaimTime] = useState("");

  // ADMIN: Submit On Behalf states
  const [isAdminClaimOpen, setIsAdminClaimOpen] = useState(false);
  const [selectedUserMobile, setSelectedUserMobile] = useState("");
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setDonations(getPendingDonations());
    setUsersList(getUsers());

    const handleDbUpdate = () => {
      setDonations(getPendingDonations());
      setUsersList(getUsers());
    };
    window.addEventListener("chhapi_db_update", handleDbUpdate);
    return () => {
      window.removeEventListener("chhapi_db_update", handleDbUpdate);
    };
  }, []);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === "SUPER_ADMIN" || currentUser.role === "ADMIN";

  // Filter list by role: Admins see all, Users see only their own
  const myDonations = isAdmin 
    ? donations 
    : donations.filter((d) => d.mobile === currentUser.mobile);

  // Filter by search query
  const filteredDonations = myDonations.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.refNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculations
  const pendingAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0);
  const urgentCount = filteredDonations.filter((d) => d.amount >= 5000).length;

  // Audit calculations for USER
  const allHistory = getDonationsHistory();
  const mySettledHistory = allHistory.filter((h) => h.mobile === currentUser.mobile);
  const mySettledAmount = mySettledHistory.reduce((sum, h) => sum + h.amount, 0);

  const handleApproveSubmit = (e) => {
    e.preventDefault();
    if (!approvingDonation) return;

    // 1. Remove from pending queue
    const updatedPending = donations.filter((d) => d.id !== approvingDonation.id);
    setDonations(updatedPending);
    savePendingDonations(updatedPending);

    // 2. Add to settled audit history logs
    const randomGradients = [
      "from-violet-600 to-indigo-600",
      "from-amber-500 to-rose-600",
      "from-red-500 to-pink-600",
      "from-emerald-400 to-teal-700",
      "from-cyan-500 to-blue-600",
    ];
    const newHistoryRecord = {
      id: Date.now(),
      name: approvingDonation.name,
      mobile: approvingDonation.mobile,
      campaign: approvingDonation.campaign,
      amount: approvingDonation.amount,
      date: new Date().toISOString().split("T")[0],
      status: "Completed",
      bank: approvingDonation.bank || "UPI Bank Channel",
      color: randomGradients[Math.floor(Math.random() * randomGradients.length)]
    };
    const updatedHistory = [newHistoryRecord, ...allHistory];
    saveDonationsHistory(updatedHistory);

    // 3. Increment contributor's aggregated donations in Users Registry
    const users = getUsers();
    const updatedUsers = users.map((u) => {
      if (u.mobile === approvingDonation.mobile) {
        return { ...u, donations: u.donations + approvingDonation.amount };
      }
      return u;
    });
    saveUsers(updatedUsers);

    // 3b. Add to dynamic campaign funds
    addFunds(selectedWallet, approvingDonation.amount);

    addAuditLog("Donation Approved", `Approved ₹${approvingDonation.amount.toLocaleString("en-IN")} from ${approvingDonation.name} to ${selectedWallet}`);

    addToast(
      `✅ Approved ₹${approvingDonation.amount.toLocaleString("en-IN")} from ${approvingDonation.name} to ${selectedWallet}!`,
      "success"
    );

    // 4. Trigger WhatsApp link with custom Gujarati message
    const msg = `નમસ્તે ${approvingDonation.name}, Chhapi Donation માં તમારા ₹${approvingDonation.amount.toLocaleString("en-IN")} જમા થઈ ગયા છે. આ રકમ ${selectedWallet} ના ફંડમાં ઉમેરવામાં આવી છે. તમારા સહકાર બદલ ખૂબ ખૂબ આભાર! 🙏😊`;
    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${approvingDonation.mobile}&text=${encodedMsg}`;
    window.open(whatsappUrl, "_blank");

    setApprovingDonation(null);
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectingDonation) return;

    const reasonText = rejectionReason || "No explanation provided";
    
    // Remove from pending database
    const updatedPending = donations.filter((d) => d.id !== rejectingDonation.id);
    setDonations(updatedPending);
    savePendingDonations(updatedPending);

    // Save to history with status "Rejected"
    const history = getDonationsHistory();
    const newHistoryRecord = {
      id: Date.now(),
      name: rejectingDonation.name,
      mobile: rejectingDonation.mobile,
      campaign: rejectingDonation.campaign,
      amount: rejectingDonation.amount,
      date: new Date().toISOString().split("T")[0],
      status: "Rejected",
      bank: rejectingDonation.bank || "UPI Bank Channel",
      reason: reasonText,
      color: rejectingDonation.color || "from-zinc-700 to-zinc-800"
    };
    saveDonationsHistory([newHistoryRecord, ...history]);

    addAuditLog("Donation Rejected", `Rejected donation claim of ₹${rejectingDonation.amount.toLocaleString("en-IN")} from ${rejectingDonation.name} (Reason: ${reasonText})`);

    addToast(
      `❌ Rejected donation claim from ${rejectingDonation.name} (Reason: ${reasonText})`,
      "error"
    );
    setRejectingDonation(null);
    setRejectionReason("");
  };

  // USER submits claim
  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!claimAmount || parseFloat(claimAmount) <= 0) {
      addToast("Please enter a valid donation amount.", "error");
      return;
    }
    if (!claimRefNo || claimRefNo.length < 8) {
      addToast("Please enter a valid UPI reference number.", "error");
      return;
    }

    const newClaim = {
      id: Date.now(),
      name: currentUser.name,
      mobile: currentUser.mobile,
      campaign: claimCampaign,
      amount: parseFloat(claimAmount),
      date: claimDate || new Date().toISOString().split("T")[0],
      refNo: claimRefNo,
      time: claimTime || new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }),
      bank: claimBank
    };

    const updatedPending = [newClaim, ...donations];
    setDonations(updatedPending);
    savePendingDonations(updatedPending);

    addAuditLog("Donation Claim Submitted", `Submitted payment claim of ₹${parseFloat(claimAmount).toLocaleString("en-IN")} for ${claimCampaign}`);

    addToast("🎉 Claim submitted successfully! Verification is under review.", "success");

    // Reset fields
    setClaimAmount("");
    setClaimRefNo("");
    setClaimDate("");
    setClaimTime("");
    setIsSubmitClaimOpen(false);
  };

  // ADMIN submits claim on behalf of a user
  const handleAdminClaimSubmit = (e) => {
    e.preventDefault();
    if (!claimAmount || parseFloat(claimAmount) <= 0) {
      addToast("Please enter a valid donation amount.", "error");
      return;
    }
    if (!selectedUserMobile) {
      addToast("Please select a contributor user.", "error");
      return;
    }

    const selectedUser = usersList.find(u => u.mobile === selectedUserMobile);
    if (!selectedUser) {
      addToast("Selected contributor account not found.", "error");
      return;
    }

    const newClaim = {
      id: Date.now(),
      name: selectedUser.name,
      mobile: selectedUser.mobile,
      campaign: claimCampaign,
      amount: parseFloat(claimAmount),
      date: claimDate || new Date().toISOString().split("T")[0],
      refNo: claimRefNo || `TXN${Date.now().toString().slice(-6)}`,
      time: claimTime || new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }),
      bank: claimBank,
      addedBy: currentUser.name
    };

    const updatedPending = [newClaim, ...donations];
    setDonations(updatedPending);
    savePendingDonations(updatedPending);

    addAuditLog("Donation Recorded", `Admin ${currentUser.name} recorded payment claim of ₹${parseFloat(claimAmount).toLocaleString("en-IN")} for ${selectedUser.name} (${claimCampaign})`);

    addToast(`🎉 Recorded donation for ${selectedUser.name}! Verification pending.`, "success");

    // Reset fields
    setClaimAmount("");
    setClaimRefNo("");
    setClaimDate("");
    setClaimTime("");
    setIsAdminClaimOpen(false);
  };

  return (
    <div className="flex-1 p-6 lg:p-10 bg-[#070b12] text-zinc-100 min-h-screen relative overflow-y-auto">
      {/* Toast Notifications */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-slide-in-right ${
              toast.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-200" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
            }`}
          >
            <div className="mr-3">
              {toast.type === "error" ? (
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

      {/* Decorative Glow */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>

      {/* Page Header */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 relative">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            {isAdmin ? "Review Ledger" : "My Donation Claims"}
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            {isAdmin 
              ? "Review, crosscheck reference IDs, verify bank receipts, and credit wallets."
              : "Review your submitted payments, track clearances, and log new contributions."}
          </p>
        </div>

        {/* Buttons / Switchers */}
        <div className="flex items-center gap-4">
          {!isAdmin ? (
            <button
              onClick={() => setIsSubmitClaimOpen(true)}
              style={{ backgroundColor: "var(--primary-accent)" }}
              className="text-white text-sm font-bold px-5 py-3 rounded-2xl hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg shadow-primary-accent/20 flex items-center gap-2 hover:shadow-primary-accent/40"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Submit Payment Claim
            </button>
          ) : (
            <button
              onClick={() => {
                setIsAdminClaimOpen(true);
                if (usersList.length > 0) {
                  setSelectedUserMobile(usersList[0].mobile);
                }
              }}
              style={{ backgroundColor: "var(--primary-accent)" }}
              className="text-white text-sm font-bold px-5 py-3 rounded-2xl hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg shadow-primary-accent/20 flex items-center gap-2 hover:shadow-primary-accent/40"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add User Donation
            </button>
          )}

          <div className="bg-zinc-900/60 p-1 rounded-xl border border-zinc-800 flex items-center shadow-inner">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "list" ? "bg-primary-accent text-white shadow" : "text-zinc-400 hover:text-white"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "grid" ? "bg-primary-accent text-white shadow" : "text-zinc-400 hover:text-white"
              }`}
            >
              Grid View
            </button>
          </div>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 z-10 relative">
        {isAdmin ? (
          <>
            <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Awaiting Funds</span>
              <h2 className="text-3xl font-extrabold text-amber-400 mt-2">₹{pendingAmount.toLocaleString("en-IN")}</h2>
              <p className="text-[11px] text-zinc-500 mt-1">Pending approval to main wallets.</p>
            </div>
            <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Queue Transactions</span>
              <h2 className="text-3xl font-extrabold text-white mt-2">{filteredDonations.length} items</h2>
              <p className="text-[11px] text-zinc-500 mt-1">Total pending bank receipt inputs.</p>
            </div>
            <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Urgent Action Items</span>
              <h2 className="text-3xl font-extrabold text-rose-400 mt-2">{urgentCount} items</h2>
              <p className="text-[11px] text-zinc-500 mt-1">Contributions equal to or exceeding ₹5,000.</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">My Settled Donations</span>
              <h2 className="text-3xl font-extrabold text-emerald-400 mt-2">₹{mySettledAmount.toLocaleString("en-IN")}</h2>
              <p className="text-[11px] text-zinc-500 mt-1">Total volume credited to campaign wallets.</p>
            </div>
            <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Under Verification</span>
              <h2 className="text-3xl font-extrabold text-amber-500 mt-2">{filteredDonations.length} claims</h2>
              <p className="text-[11px] text-zinc-500 mt-1">Claims currently in verification queue.</p>
            </div>
            <div className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Approved Receipts</span>
              <h2 className="text-3xl font-extrabold text-white mt-2">{mySettledHistory.length} receipts</h2>
              <p className="text-[11px] text-zinc-500 mt-1">Your contribution receipts count.</p>
            </div>
          </>
        )}
      </div>

      {/* Filter and Search */}
      <div className="relative mb-6 z-10 relative">
        <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={isAdmin ? "Search by contributor name, campaign category, or UPI reference ID..." : "Search by campaign category or UPI reference ID..."}
          className="w-full bg-[#111928]/40 border border-zinc-800/80 rounded-2xl py-3.5 pl-12 pr-10 text-white placeholder-zinc-500 focus:outline-none focus:border-primary-accent focus:ring-4 focus:ring-primary-accent/15 transition-all text-sm"
        />
      </div>

      {/* List / Grid View Render */}
      {filteredDonations.length > 0 ? (
        viewMode === "list" ? (
          /* TABLE LIST VIEW */
          <>
            <div className="hidden md:block bg-[#111928]/20 border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl z-10 relative backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-[#111928]/50 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      <th className="py-5 px-6">Contributor Details</th>
                      <th className="py-5 px-6">Donation Campaign</th>
                      <th className="py-5 px-6">UPI Reference</th>
                      <th className="py-5 px-6">Amount (INR)</th>
                      <th className="py-5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 text-sm">
                    {filteredDonations.map((d) => (
                      <tr key={d.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4.5 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white group-hover:text-primary-accent transition-all">{d.name}</span>
                            <span className="text-xs text-zinc-500 font-mono mt-0.5">+91 {d.mobile}</span>
                          </div>
                        </td>
                        <td className="py-4.5 px-6">
                          <span className="text-zinc-300 font-medium">{d.campaign}</span>
                        </td>
                        <td className="py-4.5 px-6">
                          <div className="flex flex-col">
                            <span className="font-mono text-zinc-400 text-xs">{d.refNo}</span>
                            <span className="text-[10px] text-zinc-655 mt-0.5">{d.date} at {d.time}</span>
                          </div>
                        </td>
                        <td className="py-4.5 px-6">
                          <span className="text-emerald-400 font-bold font-mono text-base">₹{d.amount.toLocaleString("en-IN")}</span>
                        </td>
                        <td className="py-4.5 px-6 text-right">
                          {currentUser?.role === "SUPER_ADMIN" ? (
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => setViewingReceipt(d)} className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer">
                                Verify Receipt
                              </button>
                              <button onClick={() => { setApprovingDonation(d); setSelectedWallet(d.campaign); }} className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer shadow-sm">
                                Approve
                              </button>
                              <button onClick={() => setRejectingDonation(d)} className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 transition-all cursor-pointer">
                                Reject
                              </button>
                            </div>
                          ) : currentUser?.role === "ADMIN" ? (
                            <div className="flex gap-2 justify-end items-center">
                              <button onClick={() => setViewingReceipt(d)} className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer">
                                View Details
                              </button>
                              <span className="text-xs font-semibold text-amber-500/80 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl">
                                Awaiting Super Admin Approval
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-zinc-500 italic">Under Admin Verification</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table Fallback Cards on Mobile */}
            <div className="md:hidden space-y-4 z-10 relative">
              {filteredDonations.map((d) => (
                <div key={d.id} className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-5 backdrop-blur-md shadow-md flex flex-col justify-between hover:border-zinc-700/50 transition-all group">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="font-semibold text-white group-hover:text-primary-accent transition-colors block">{d.name}</span>
                      <span className="text-xs text-zinc-500 font-mono mt-1">+91 {d.mobile}</span>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono text-base">₹{d.amount.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="space-y-2 mt-4 pt-4 border-t border-zinc-800/40 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Campaign</span>
                      <span className="text-zinc-300 font-medium">{d.campaign}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Reference ID</span>
                      <span className="text-zinc-400 font-mono">{d.refNo}</span>
                    </div>
                  </div>

                  {currentUser?.role === "SUPER_ADMIN" ? (
                    <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-zinc-800/40">
                      <button onClick={() => setViewingReceipt(d)} className="text-center py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold transition-all cursor-pointer text-xs">Verify</button>
                      <button onClick={() => { setApprovingDonation(d); setSelectedWallet(d.campaign); }} className="text-center py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all cursor-pointer text-xs shadow-sm">Approve</button>
                      <button onClick={() => setRejectingDonation(d)} className="text-center py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 font-semibold transition-all cursor-pointer text-xs">Reject</button>
                    </div>
                  ) : currentUser?.role === "ADMIN" ? (
                    <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-zinc-800/40 items-center">
                      <button onClick={() => setViewingReceipt(d)} className="text-center py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold transition-all cursor-pointer text-xs">Verify</button>
                      <span className="text-center text-[10px] font-semibold text-amber-500/80 bg-amber-500/10 border border-amber-500/20 py-2.5 rounded-xl">Awaiting Super Admin Approval</span>
                    </div>
                  ) : (
                    <div className="mt-4 pt-4 border-t border-zinc-800/40 text-center text-xs text-zinc-500 italic">
                      Awaiting administrative confirmation
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          /* CARD GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 z-10 relative">
            {filteredDonations.map((d) => (
              <div key={d.id} className="bg-[#111928]/40 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-md shadow-lg flex flex-col justify-between hover:border-zinc-700/80 transition-all group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-primary-accent transition-colors">{d.name}</h3>
                      <p className="text-zinc-500 text-xs font-mono mt-0.5">+91 {d.mobile}</p>
                    </div>
                    <span className="text-emerald-400 font-extrabold font-mono text-lg">₹{d.amount.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="space-y-2 mt-4 pt-4 border-t border-zinc-800/40 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Campaign</span>
                      <span className="text-zinc-300 font-medium">{d.campaign}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">UPI Ref</span>
                      <span className="text-zinc-400 font-mono">{d.refNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Submitted</span>
                      <span className="text-zinc-400">{d.date} @ {d.time}</span>
                    </div>
                  </div>
                </div>

                 {currentUser?.role === "SUPER_ADMIN" ? (
                  <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-zinc-800/40">
                    <button onClick={() => setViewingReceipt(d)} className="text-center py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold transition-all cursor-pointer text-[11px]">Verify</button>
                    <button onClick={() => { setApprovingDonation(d); setSelectedWallet(d.campaign); }} className="text-center py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all cursor-pointer text-[11px] shadow-sm">Approve</button>
                    <button onClick={() => setRejectingDonation(d)} className="text-center py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 font-semibold transition-all cursor-pointer text-[11px]">Reject</button>
                  </div>
                ) : currentUser?.role === "ADMIN" ? (
                  <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-zinc-800/40 items-center">
                    <button onClick={() => setViewingReceipt(d)} className="text-center py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold transition-all cursor-pointer text-[11px]">Verify</button>
                    <span className="text-center text-[10px] font-semibold text-amber-500/80 bg-amber-500/10 border border-amber-500/20 py-2.5 rounded-xl">Awaiting Super Admin Approval</span>
                  </div>
                ) : (
                  <div className="mt-6 pt-4 border-t border-zinc-800/40 text-center text-xs text-zinc-500 italic">
                    Awaiting verification review
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="bg-[#111928]/20 border border-zinc-800/50 rounded-3xl p-16 text-center z-10 relative flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
          <h3 className="text-lg font-bold text-white">No Pending Claims</h3>
          <p className="text-zinc-500 text-xs max-w-sm">
            {isAdmin 
              ? "All submitted contributor payment receipts are reviewed and verified."
              : "All your claims have been processed or you have not logged any payments yet."}
          </p>
        </div>
      )}

      {/* ADMIN: RECEIPT VIEW MODAL */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#111928] border border-zinc-800 rounded-3xl p-6 max-w-md w-full relative shadow-2xl">
            <button onClick={() => setViewingReceipt(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
              Bank Transaction Receipt
            </h3>

            <div className="bg-gradient-to-b from-[#1c2438] to-[#121824] border border-zinc-700/40 rounded-2xl p-6 text-zinc-200 shadow-inner relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] w-24 h-24 rounded-full bg-emerald-500/5 flex items-center justify-center">
                <span className="text-emerald-500/10 text-6xl font-bold">✓</span>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-emerald-400 tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  UPI PAYMENT SYSTEM
                </span>
                <span className="text-[10px] font-mono text-zinc-500">{viewingReceipt.refNo}</span>
              </div>

              <div className="text-center my-6">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Transaction Amount</span>
                <h2 className="text-4xl font-extrabold text-white mt-1">₹{viewingReceipt.amount.toLocaleString("en-IN")}.00</h2>
                <span className="text-xs text-emerald-400 mt-2 font-semibold inline-flex items-center gap-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  ✓ Success
                </span>
              </div>

              <div className="space-y-3.5 border-t border-zinc-800 pt-5 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Sender</span>
                  <span className="font-semibold text-white">{viewingReceipt.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Sender Mobile</span>
                  <span className="font-mono">{viewingReceipt.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Receiving Wallet</span>
                  <span className="font-semibold text-white">{viewingReceipt.campaign}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Gateway</span>
                  <span>{viewingReceipt.bank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Timestamp</span>
                  <span className="font-mono">{viewingReceipt.date} • {viewingReceipt.time}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => { setViewingReceipt(null); setRejectingDonation(viewingReceipt); }}
                className="py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold transition-all cursor-pointer text-xs"
              >
                Reject Claim
              </button>
              <button
                onClick={() => { setViewingReceipt(null); setApprovingDonation(viewingReceipt); }}
                className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer text-xs shadow-lg shadow-emerald-600/25"
              >
                Approve claim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN: APPROVAL CONFIRMATION */}
      {approvingDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#111928] border border-zinc-800 rounded-3xl p-6 max-w-sm w-full relative shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
              Confirm Funds Approval
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              Approving transaction of <strong className="text-emerald-400">₹{approvingDonation.amount.toLocaleString("en-IN")}</strong> from <strong>{approvingDonation.name}</strong>. Choose target wallet:
            </p>

            <form onSubmit={handleApproveSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Credit Target Wallet</label>
                <select
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-xl py-3 px-3.5 text-white text-xs cursor-pointer focus:outline-none focus:border-emerald-500"
                >
                  <option value="Food Distribution" className="bg-[#0f172a]">Food Distribution</option>
                  <option value="Emergency Medical Aid" className="bg-[#0f172a]">Emergency Medical Aid</option>
                  <option value="Education Support" className="bg-[#0f172a]">Education Support</option>
                  <option value="Water Well Installation" className="bg-[#0f172a]">Water Well Installation</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setApprovingDonation(null)} className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all cursor-pointer text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer text-xs shadow-lg shadow-emerald-600/20">Confirm Credit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN: REJECTION MODAL */}
      {rejectingDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#111928] border border-zinc-800 rounded-3xl p-6 max-w-sm w-full relative shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
              Reject Receipt Input
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6">Explain payment claim rejection details:</p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Reason for Rejection</label>
                <input
                  type="text"
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Reference code mismatch"
                  className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-xl py-3 px-3.5 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setRejectingDonation(null); setRejectionReason(""); }} className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all cursor-pointer text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all cursor-pointer text-xs shadow-lg shadow-red-600/20">Reject Receipt</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER: SUBMIT PAYMENT CLAIM MODAL */}
      {isSubmitClaimOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-zinc-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="h-full bg-[#111928] border-l border-zinc-800 max-w-md w-full p-8 shadow-2xl flex flex-col justify-between animate-slide-in-right">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary-accent rounded-full"></span>
                  Log New Payment Claim
                </h3>
                <button onClick={() => setIsSubmitClaimOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleClaimSubmit} className="space-y-5">
                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Donation Amount (INR)</label>
                  <input
                    type="number"
                    required
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-primary-accent transition-all text-sm font-semibold"
                  />
                </div>

                {/* Campaign Choice */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Campaign Allocation</label>
                  <select
                    value={claimCampaign}
                    onChange={(e) => setClaimCampaign(e.target.value)}
                    className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
                  >
                    <option value="Food Distribution" className="bg-[#0f172a]">Food Distribution</option>
                    <option value="Emergency Medical Aid" className="bg-[#0f172a]">Emergency Medical Aid</option>
                    <option value="Education Support" className="bg-[#0f172a]">Education Support</option>
                    <option value="Water Well Installation" className="bg-[#0f172a]">Water Well Installation</option>
                  </select>
                </div>

                {/* Bank Channel */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Bank Channel Gateway</label>
                  <select
                    value={claimBank}
                    onChange={(e) => setClaimBank(e.target.value)}
                    className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
                  >
                    <option value="State Bank of India" className="bg-[#0f172a]">State Bank of India</option>
                    <option value="HDFC Bank" className="bg-[#0f172a]">HDFC Bank</option>
                    <option value="ICICI Bank" className="bg-[#0f172a]">ICICI Bank</option>
                    <option value="Axis Bank" className="bg-[#0f172a]">Axis Bank</option>
                    <option value="Punjab National Bank" className="bg-[#0f172a]">Punjab National Bank</option>
                  </select>
                </div>

                {/* Ref No */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">UPI / Transaction Ref ID</label>
                  <input
                    type="text"
                    required
                    value={claimRefNo}
                    onChange={(e) => setClaimRefNo(e.target.value)}
                    placeholder="e.g. UPI8394019234"
                    className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-primary-accent transition-all text-sm font-mono"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Date</label>
                    <input
                      type="date"
                      value={claimDate}
                      onChange={(e) => setClaimDate(e.target.value)}
                      className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-primary-accent transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Time</label>
                    <input
                      type="time"
                      value={claimTime}
                      onChange={(e) => setClaimTime(e.target.value)}
                      className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-primary-accent transition-all text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ backgroundColor: "var(--primary-accent)" }}
                  className="w-full text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition-all duration-200 cursor-pointer shadow-lg mt-4 shadow-primary-accent/15"
                >
                  Submit Donation Claim
                </button>
              </form>
            </div>

            <div className="text-zinc-600 text-[11px] leading-relaxed">
              * Note: Please make sure reference codes correspond precisely with your bank notification to ensure swift admin clearance.
            </div>
          </div>
        </div>
      )}

      {/* ADMIN: SUBMIT ON BEHALF MODAL */}
      {isAdminClaimOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-zinc-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="h-full bg-[#111928] border-l border-zinc-800 max-w-md w-full p-8 shadow-2xl flex flex-col justify-between animate-slide-in-right">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary-accent rounded-full"></span>
                  Record User Donation
                </h3>
                <button onClick={() => setIsAdminClaimOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleAdminClaimSubmit} className="space-y-5">
                {/* Select Contributor User */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Select Contributor User</label>
                  <select
                    value={selectedUserMobile}
                    onChange={(e) => setSelectedUserMobile(e.target.value)}
                    className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
                  >
                    {usersList.map((user) => (
                      <option key={user.id} value={user.mobile} className="bg-[#0f172a]">
                        {user.name} (+91 {user.mobile}) [{user.role}]
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Donation Amount (INR)</label>
                  <input
                    type="number"
                    required
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-primary-accent transition-all text-sm font-semibold"
                  />
                </div>

                {/* Campaign Choice */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Campaign Allocation</label>
                  <select
                    value={claimCampaign}
                    onChange={(e) => setClaimCampaign(e.target.value)}
                    className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
                  >
                    <option value="Food Distribution" className="bg-[#0f172a]">Food Distribution</option>
                    <option value="Emergency Medical Aid" className="bg-[#0f172a]">Emergency Medical Aid</option>
                    <option value="Education Support" className="bg-[#0f172a]">Education Support</option>
                    <option value="Water Well Installation" className="bg-[#0f172a]">Water Well Installation</option>
                  </select>
                </div>

                {/* Bank Channel */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Bank Channel Gateway</label>
                  <select
                    value={claimBank}
                    onChange={(e) => setClaimBank(e.target.value)}
                    className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:border-primary-accent transition-all text-sm cursor-pointer"
                  >
                    <option value="State Bank of India" className="bg-[#0f172a]">State Bank of India</option>
                    <option value="HDFC Bank" className="bg-[#0f172a]">HDFC Bank</option>
                    <option value="ICICI Bank" className="bg-[#0f172a]">ICICI Bank</option>
                    <option value="Axis Bank" className="bg-[#0f172a]">Axis Bank</option>
                    <option value="Punjab National Bank" className="bg-[#0f172a]">Punjab National Bank</option>
                  </select>
                </div>

                {/* Ref No */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">UPI Ref / Transact ID (Optional)</label>
                  <input
                    type="text"
                    value={claimRefNo}
                    onChange={(e) => setClaimRefNo(e.target.value)}
                    placeholder="Auto-generated if blank"
                    className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-primary-accent transition-all text-sm font-mono"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Date</label>
                    <input
                      type="date"
                      value={claimDate}
                      onChange={(e) => setClaimDate(e.target.value)}
                      className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-primary-accent transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Time</label>
                    <input
                      type="time"
                      value={claimTime}
                      onChange={(e) => setClaimTime(e.target.value)}
                      className="w-full bg-[#1e293b]/30 border border-zinc-800/80 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-primary-accent transition-all text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ backgroundColor: "var(--primary-accent)" }}
                  className="w-full text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition-all duration-200 cursor-pointer shadow-lg mt-4 shadow-primary-accent/15"
                >
                  Record User Donation
                </button>
              </form>
            </div>

            <div className="text-zinc-650 text-[10px] leading-relaxed">
              * Note: Logging a donation directly here queues it for Super Admin clearance. Funds will credit to campaigns upon confirmation.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
