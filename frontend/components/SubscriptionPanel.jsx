"use client";

import { useEffect, useState } from "react";
import { requestFcmToken } from "@/lib/firebase";
import { registerSubscription } from "@/lib/api";

export default function SubscriptionPanel({ categories }) {
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (categories.length) {
      setSelected(categories.map((c) => c.slug || c.name.toLowerCase()));
    }
  }, [categories]);

  async function handleSubscribe() {
    try {
      setStatus("Requesting browser permission...");
      const token = await requestFcmToken();
      if (!token) {
        setStatus("Unable to get browser token.");
        return;
      }
      
      // Check if using mock token
      const isMockToken = token.startsWith('dev-mock-token-');
      
      setStatus("Saving preferences...");
      await registerSubscription({ token, categories: selected });
      
      if (isMockToken) {
        setStatus("✓ Preferences saved! (Using development mode - configure Firebase for real notifications)");
      } else {
        setStatus("✓ Subscribed! You will receive alerts for selected categories.");
      }
    } catch (err) {
      const errorMessage = err.message || "Unable to get browser token.";
      setStatus(errorMessage);
      console.error("Subscription error:", err);
    }
  }

  return (
    <section className="sticky top-24 rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white to-blue-50/30 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Push Notifications</h3>
          <p className="text-xs text-slate-600">
            Stay updated instantly
          </p>
        </div>
      </div>
      
      <p className="mb-4 text-sm text-slate-600">
        Get notified when new notices match your interests.
      </p>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((category) => {
          const slug = category.slug || category.name.toLowerCase();
          const active = selected.includes(slug);
          return (
            <button
              key={slug}
              type="button"
              onClick={() =>
                setSelected((prev) =>
                  active ? prev.filter((item) => item !== slug) : [...prev, slug]
                )
              }
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                active
                  ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/30"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {active && (
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {category.name}
            </button>
          );
        })}
      </div>
      
      <button
        type="button"
        onClick={handleSubscribe}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/40 hover:from-blue-700 hover:to-indigo-700"
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Enable Notifications
        </span>
      </button>
      
      {status && (
        <div className={`mt-4 rounded-lg border p-3 text-xs ${
          status.includes("✓") || status.includes("successful")
            ? "border-green-200 bg-green-50 text-green-700"
            : status.includes("development mode")
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : "border-amber-200 bg-amber-50 text-amber-700"
        }`}>
          {status}
        </div>
      )}
    </section>
  );
}

