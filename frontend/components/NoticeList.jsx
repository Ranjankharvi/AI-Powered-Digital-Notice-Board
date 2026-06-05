"use client";

import NoticeCard from "./NoticeCard";

export default function NoticeList({ notices, onDelete, isAdmin = false }) {
  if (!notices.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-blue-50/30 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-slate-700">No notices yet</p>
        <p className="mt-1 text-sm text-slate-500">Check back soon for new updates!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {notices.map((notice) => (
        <NoticeCard 
          key={notice._id} 
          notice={notice} 
          onDelete={onDelete}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}

