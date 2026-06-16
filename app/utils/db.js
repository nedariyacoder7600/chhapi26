"use client";

// Check if we are running in the browser
const isBrowser = typeof window !== "undefined";

const initialUsers = [
  { id: 1, name: "Mohammad Yunus", mobile: "7600526010", password: "Qaswa@786", role: "SUPER_ADMIN", status: "Active", joined: "2026-01-15", donations: 154000, color: "from-violet-600 to-indigo-600", addedBy: "System" },
  { id: 2, name: "Amir Admin", mobile: "9104092123", password: "Amir@123", role: "ADMIN", status: "Active", joined: "2026-02-10", donations: 42500, color: "from-amber-500 to-rose-600", addedBy: "Mohammad Yunus" },
  { id: 3, name: "Amir bhai", mobile: "9876543210", password: "Amir@786", role: "SUPER_ADMIN", status: "Active", joined: "2025-11-04", donations: 295000, color: "from-red-500 to-pink-600", addedBy: "System" },
  { id: 4, name: "Qaswa Khan", mobile: "7766554433", password: "Qaswa@123", role: "USER", status: "Active", joined: "2026-03-22", donations: 12000, color: "from-emerald-400 to-teal-700", addedBy: "Amir Admin" },
  { id: 5, name: "Rahul Sharma", mobile: "9900887766", password: "Rahul@123", role: "USER", status: "Active", joined: "2026-04-01", donations: 8500, color: "from-cyan-500 to-blue-600", addedBy: "Amir Admin" },
  { id: 6, name: "Priya Patel", mobile: "9123456789", password: "Priya@123", role: "USER", status: "Inactive", joined: "2026-04-18", donations: 0, color: "from-purple-500 to-indigo-500", addedBy: "Mohammad Yunus" },
  { id: 7, name: "Vikram Rathore", mobile: "8899776655", password: "Vikram@123", role: "ADMIN", status: "Active", joined: "2026-05-12", donations: 62000, color: "from-amber-500 to-rose-600", addedBy: "Mohammad Yunus" },
];

const initialDonations = [
  { id: 1, name: "Rajesh Patel", mobile: "9876501234", campaign: "Food Distribution", amount: 5000, date: "2026-06-10", refNo: "UPI9204810239", time: "14:35", bank: "State Bank of India" },
  { id: 2, name: "Simran Sheikh", mobile: "8765409876", campaign: "Emergency Medical Aid", amount: 1500, date: "2026-06-11", refNo: "UPI8374920194", time: "09:12", bank: "HDFC Bank" },
  { id: 3, name: "Amit Verma", mobile: "9988776655", campaign: "Education Support", amount: 10000, date: "2026-06-08", refNo: "UPI3948201934", time: "18:44", bank: "ICICI Bank" },
  { id: 4, name: "Fatima Ansari", mobile: "7766550011", campaign: "Food Distribution", amount: 2500, date: "2026-06-11", refNo: "UPI9483019234", time: "11:20", bank: "Axis Bank" },
  { id: 5, name: "Gaurav Sen", mobile: "9090121234", campaign: "Water Wells Project", amount: 7500, date: "2026-06-09", refNo: "UPI7283910293", time: "16:02", bank: "Punjab National Bank" },
  { id: 6, name: "Amir Admin", mobile: "9104092123", campaign: "Education Support", amount: 1500, date: "2026-06-14", refNo: "UPI4918204928", time: "12:30", bank: "HDFC Bank" },
  { id: 7, name: "Amir Admin", mobile: "9104092123", campaign: "Food Distribution", amount: 3000, date: "2026-06-15", refNo: "UPI9028301938", time: "15:45", bank: "State Bank of India" },
  { id: 8, name: "Rahul Sharma", mobile: "9900887766", campaign: "Emergency Medical Aid", amount: 500, date: "2026-06-15", refNo: "UPI2938102938", time: "10:10", bank: "Axis Bank" }
];

const initialHistory = [
  { id: 1, name: "Imran Pathan", mobile: "9012345678", campaign: "Food Distribution", amount: 500, date: "2026-06-05", status: "Completed", bank: "State Bank of India", color: "from-violet-600 to-indigo-600" },
  { id: 2, name: "Salma Sheikh", mobile: "9876504321", campaign: "Emergency Medical Aid", amount: 1200, date: "2026-06-06", status: "Completed", bank: "HDFC Bank", color: "from-amber-500 to-rose-600" },
  { id: 3, name: "Zainab Khan", mobile: "8877665544", campaign: "Education Support", amount: 3000, date: "2026-06-06", status: "Completed", bank: "ICICI Bank", color: "from-emerald-400 to-teal-700" },
  { id: 4, name: "Asif Mansuri", mobile: "7766554433", campaign: "Water Well Installation", amount: 2500, date: "2026-06-07", status: "Completed", bank: "Axis Bank", color: "from-cyan-500 to-blue-600" },
  { id: 5, name: "Abdul Razak", mobile: "9900112233", campaign: "Food Distribution", amount: 5000, date: "2026-06-08", status: "Completed", bank: "Punjab National Bank", color: "from-red-500 to-pink-600" },
  { id: 6, name: "Shakil Qureshi", mobile: "9055443322", campaign: "Emergency Medical Aid", amount: 1500, date: "2026-06-09", status: "Completed", bank: "State Bank of India", color: "from-purple-500 to-indigo-500" },
  { id: 7, name: "Amir Admin", mobile: "9104092123", campaign: "Food Distribution", amount: 2000, date: "2026-05-12", status: "Completed", bank: "ICICI Bank", color: "from-amber-500 to-rose-600" },
  { id: 8, name: "Amir Admin", mobile: "9104092123", campaign: "Education Support", amount: 8000, date: "2025-10-18", status: "Completed", bank: "HDFC Bank", color: "from-amber-500 to-rose-600" },
  { id: 9, name: "Amir Admin", mobile: "9104092123", campaign: "Water Well Installation", amount: 12000, date: "2024-04-05", status: "Completed", bank: "State Bank of India", color: "from-amber-500 to-rose-600" },
  { id: 10, name: "Amir Admin", mobile: "9104092123", campaign: "Emergency Medical Aid", amount: 4500, date: "2026-06-14", status: "Rejected", bank: "Axis Bank", reason: "Invalid bank receipt details", color: "from-amber-500 to-rose-600" },
  { id: 11, name: "Rahul Sharma", mobile: "9900887766", campaign: "Food Distribution", amount: 1500, date: "2026-06-12", status: "Completed", bank: "HDFC Bank", color: "from-cyan-500 to-blue-600" },
  { id: 12, name: "Rahul Sharma", mobile: "9900887766", campaign: "Water Well Installation", amount: 7000, date: "2025-08-25", status: "Completed", bank: "State Bank of India", color: "from-cyan-500 to-blue-600" }
];

const initialAuditLogs = [
  { id: 1, user: { name: "Mohammad Yunus", role: "SUPER_ADMIN", mobile: "7600526010" }, action: "System Initialized", details: "Chhapi Donation system successfully booted and local registry loaded.", date: "2026-06-13", time: "08:30:00" },
  { id: 2, user: { name: "Amir Admin", role: "ADMIN", mobile: "9104092123" }, action: "User Login", details: "Signed in from ADMIN portal.", date: "2026-06-14", time: "10:15:24" },
  { id: 3, user: { name: "Amir Admin", role: "ADMIN", mobile: "9104092123" }, action: "Donation Approved", details: "Approved ₹5,000 from Rajesh Patel for Food Distribution", date: "2026-06-14", time: "10:20:11" },
  { id: 4, user: { name: "Mohammad Yunus", role: "SUPER_ADMIN", mobile: "7600526010" }, action: "Status Changed", details: "Deactivated profile of Priya Patel (+91 9123456789)", date: "2026-06-15", time: "06:05:44" }
];

const initialFunds = [
  { category: "Food Distribution", allocated: 150000, spent: 120000, remaining: 30000, color: "bg-blue-500", border: "border-blue-500/20" },
  { category: "Emergency Medical Aid", allocated: 250000, spent: 210000, remaining: 40000, color: "bg-emerald-500", border: "border-emerald-500/20" },
  { category: "Education Support", allocated: 100000, spent: 85000, remaining: 15000, color: "bg-purple-500", border: "border-purple-500/20" },
  { category: "Water Well Installation", allocated: 180000, spent: 150000, remaining: 30000, color: "bg-amber-500", border: "border-amber-500/20" },
];

// Initialize DB structure
if (isBrowser) {
  if (!localStorage.getItem("chhapi_data_reinit_v4")) {
    localStorage.setItem("chhapi_users", JSON.stringify(initialUsers));
    localStorage.setItem("chhapi_pending_donations", JSON.stringify(initialDonations));
    localStorage.setItem("chhapi_donations_history", JSON.stringify(initialHistory));
    localStorage.setItem("chhapi_audit_logs", JSON.stringify(initialAuditLogs));
    localStorage.setItem("chhapi_funds", JSON.stringify(initialFunds));
    localStorage.setItem("chhapi_data_reinit_v4", "true");
  } else {
    if (!localStorage.getItem("chhapi_users")) {
      localStorage.setItem("chhapi_users", JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem("chhapi_pending_donations")) {
      localStorage.setItem("chhapi_pending_donations", JSON.stringify(initialDonations));
    }
    if (!localStorage.getItem("chhapi_donations_history")) {
      localStorage.setItem("chhapi_donations_history", JSON.stringify(initialHistory));
    }
    if (!localStorage.getItem("chhapi_audit_logs")) {
      localStorage.setItem("chhapi_audit_logs", JSON.stringify(initialAuditLogs));
    }
    if (!localStorage.getItem("chhapi_funds")) {
      localStorage.setItem("chhapi_funds", JSON.stringify(initialFunds));
    }
  }
}

export function getUsers() {
  if (!isBrowser) return initialUsers;
  return JSON.parse(localStorage.getItem("chhapi_users")) || initialUsers;
}

export function saveUsers(users) {
  if (isBrowser) {
    localStorage.setItem("chhapi_users", JSON.stringify(users));
    // Trigger custom event so other components know data changed
    window.dispatchEvent(new Event("chhapi_db_update"));
  }
}

export function getPendingDonations() {
  if (!isBrowser) return initialDonations;
  return JSON.parse(localStorage.getItem("chhapi_pending_donations")) || initialDonations;
}

export function savePendingDonations(donations) {
  if (isBrowser) {
    localStorage.setItem("chhapi_pending_donations", JSON.stringify(donations));
    window.dispatchEvent(new Event("chhapi_db_update"));
  }
}

export function getDonationsHistory() {
  if (!isBrowser) return initialHistory;
  return JSON.parse(localStorage.getItem("chhapi_donations_history")) || initialHistory;
}

export function saveDonationsHistory(history) {
  if (isBrowser) {
    localStorage.setItem("chhapi_donations_history", JSON.stringify(history));
    window.dispatchEvent(new Event("chhapi_db_update"));
  }
}

export function getCurrentUser() {
  if (!isBrowser) return null;
  const user = localStorage.getItem("chhapi_current_user");
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user) {
  if (isBrowser) {
    if (user) {
      localStorage.setItem("chhapi_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("chhapi_current_user");
    }
    window.dispatchEvent(new Event("chhapi_session_update"));
  }
}

export function logout() {
  addAuditLog("User Logout", "Logged out from the active session.");
  setCurrentUser(null);
}

export function getAuditLogs() {
  if (!isBrowser) return initialAuditLogs;
  return JSON.parse(localStorage.getItem("chhapi_audit_logs")) || initialAuditLogs;
}

export function saveAuditLogs(logs) {
  if (isBrowser) {
    localStorage.setItem("chhapi_audit_logs", JSON.stringify(logs));
    window.dispatchEvent(new Event("chhapi_db_update"));
  }
}

export function addAuditLog(action, details) {
  if (!isBrowser) return;
  const activeUser = getCurrentUser() || { name: "System", role: "SYSTEM", mobile: "0000000000" };
  const newLog = {
    id: Date.now(),
    user: {
      name: activeUser.name,
      role: activeUser.role,
      mobile: activeUser.mobile
    },
    action: action,
    details: details,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
  };
  const currentLogs = getAuditLogs();
  const updatedLogs = [newLog, ...currentLogs];
  saveAuditLogs(updatedLogs);
}

export function getFunds() {
  if (!isBrowser) return initialFunds;
  return JSON.parse(localStorage.getItem("chhapi_funds")) || initialFunds;
}

export function saveFunds(funds) {
  if (isBrowser) {
    localStorage.setItem("chhapi_funds", JSON.stringify(funds));
    window.dispatchEvent(new Event("chhapi_db_update"));
  }
}

export function addFunds(category, amount) {
  if (!isBrowser) return;
  const funds = getFunds();
  const updated = funds.map((f) => {
    if (f.category.toLowerCase() === category.toLowerCase() || 
        (category.toLowerCase().includes("food") && f.category.toLowerCase().includes("food")) ||
        (category.toLowerCase().includes("medical") && f.category.toLowerCase().includes("medical")) ||
        (category.toLowerCase().includes("education") && f.category.toLowerCase().includes("education")) ||
        (category.toLowerCase().includes("well") && f.category.toLowerCase().includes("well")) ||
        (category.toLowerCase().includes("water") && f.category.toLowerCase().includes("water"))
    ) {
      return {
        ...f,
        allocated: f.allocated + amount,
        remaining: f.remaining + amount
      };
    }
    return f;
  });
  saveFunds(updated);
}
