"use client";

import { useEffect, useState } from "react";
import { fetchCategories, fetchNotices, login, deleteNotice } from "@/lib/api";
import UploadNoticeForm from "@/components/UploadNoticeForm";
import NoticeList from "@/components/NoticeList";

export default function AdminPage() {
  const [categories, setCategories] = useState([]);
  const [notices, setNotices] = useState([]);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchCategories().then((data) => setCategories(data.categories));
    const session = typeof window !== "undefined" ? localStorage.getItem("adminSession") : null;
    if (session) {
      const parsed = JSON.parse(session);
      setToken(parsed.token);
      setUser(parsed.user);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadNotices();
    }
  }, [token]);

  async function loadNotices() {
    try {
      const data = await fetchNotices({ limit: 10 });
      setNotices(data.notices);
    } catch (err) {
      console.error("Failed to load notices:", err);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await login(email, password);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem("adminSession", JSON.stringify(response));
      setStatus("Login successful.");
    } catch (err) {
      setStatus(err.message);
    }
  }

  function handleLogout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("adminSession");
  }

  async function handleDeleteNotice(noticeId) {
    if (!window.confirm("Are you sure you want to delete this notice? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteNotice(noticeId, token);
      setNotices((prev) => prev.filter((notice) => notice._id !== noticeId));
      setStatus("Notice deleted successfully.");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setStatus(err.message || "Failed to delete notice");
      setTimeout(() => setStatus(""), 5000);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Portal</h1>
            <p className="text-blue-100 mt-1">
              Manage notices, AI processing, and notifications
            </p>
          </div>
        </div>
      </div>

      {/* Login Section */}
      {!token ? (
        <section className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-8 shadow-lg">
          <div className="mx-auto max-w-md">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign In</h2>
              <p className="text-sm text-slate-600">
                Enter your admin credentials to access the portal
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/40 hover:from-blue-700 hover:to-indigo-700"
              >
                Sign In
              </button>
              {status && (
                <div className={`rounded-lg border p-3 text-sm ${
                  status.includes("successful") || status.includes("Login")
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}>
                  {status}
                </div>
              )}
            </form>
          </div>
        </section>
      ) : (
        <>
          {/* User Info Section */}
          <section className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Logged in as</p>
                  <p className="text-lg font-bold text-slate-900">
                    {user?.name}
                  </p>
                  <p className="text-sm text-slate-600">{user?.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </section>

          {/* Upload Form */}
          <UploadNoticeForm
            categories={categories}
            token={token}
            onUploaded={(notice) => {
              setNotices((prev) => [notice, ...prev].slice(0, 10));
              setStatus("Notice uploaded successfully!");
              setTimeout(() => setStatus(""), 3000);
            }}
          />

          {/* Status Message */}
          {status && (
            <div className={`rounded-lg border p-4 ${
              status.includes("successful") || status.includes("deleted")
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}>
              <p className="text-sm font-medium">{status}</p>
            </div>
          )}

          {/* Recent Notices */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">All Notices</h2>
                <p className="mt-1 text-sm text-slate-600">Manage and delete notices</p>
              </div>
              <button
                type="button"
                onClick={loadNotices}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
            <NoticeList notices={notices} onDelete={handleDeleteNotice} isAdmin={true} />
          </section>
        </>
      )}
    </div>
  );
}

