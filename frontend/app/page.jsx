"use client";

import { useEffect, useState } from "react";
import { fetchCategories, fetchNotices } from "@/lib/api";
import CategoryFilter from "@/components/CategoryFilter";
import NoticeList from "@/components/NoticeList";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import SubscriptionPanel from "@/components/SubscriptionPanel";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data.categories))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    async function loadNotices() {
      setLoading(true);
      try {
        const result = await fetchNotices({
          page,
          limit: 6,
          category: category || undefined,
          q: query || undefined,
        });
        setNotices(result.notices);
        setPages(result.pagination.pages || 1);
      } catch (err) {
        console.error(err);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    }

    loadNotices();
  }, [category, page, query]);

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 sm:p-12 text-white shadow-2xl shadow-blue-500/20">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI-Powered Intelligence
          </div>
          <h1 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Stay Updated with
            <br />
            <span className="bg-gradient-to-r from-blue-100 to-indigo-100 bg-clip-text text-transparent">
              Smart Notices
            </span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-blue-100">
            Automatically scanned, intelligently summarized, and instantly categorized. Get real-time push notifications for what matters to you.
          </p>
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </section>

      {/* Search and Filter Section */}
      <section className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-lg shadow-slate-200/50">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Find What You Need</h2>
          <p className="text-sm text-slate-600">
            Search through notices or filter by category to find relevant information quickly.
          </p>
        </div>
        <div className="space-y-4">
          <SearchBar defaultQuery={query} onSearch={(q) => { setQuery(q); setPage(1); }} />
          <CategoryFilter categories={categories} active={category} onChange={(value) => { setCategory(value); setPage(1); }} />
        </div>
      </section>

      {/* Notices Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Latest Notices</h2>
            <p className="mt-1 text-sm text-slate-600">AI-processed and intelligently categorized for easy reading</p>
          </div>
        </div>
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <p className="text-slate-500 font-medium">Loading notices...</p>
          </div>
        ) : (
          <>
            <NoticeList notices={notices} />
            <Pagination page={page} pages={pages} onChange={setPage} />
          </>
        )}
      </section>

      {/* Subscription Panel */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2"></div>
        <div className="lg:col-span-1">
          <SubscriptionPanel categories={categories} />
        </div>
      </div>
    </div>
  );
}

