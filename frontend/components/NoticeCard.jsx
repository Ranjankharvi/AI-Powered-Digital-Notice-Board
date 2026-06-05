"use client";

import { formatDistanceToNow } from "date-fns";

const categoryColors = {
  academic: "bg-blue-100 text-blue-700 border-blue-200",
  events: "bg-purple-100 text-purple-700 border-purple-200",
  placements: "bg-green-100 text-green-700 border-green-200",
  others: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function NoticeCard({ notice, onDelete, isAdmin = false }) {
  const { summary = {} } = notice;
  const categoryKey = notice.category?.toLowerCase() || "others";
  const categoryColor = categoryColors[categoryKey] || categoryColors.others;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-300/60 hover:shadow-xl hover:shadow-blue-100/50">
      {/* Gradient accent bar */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-100"></div>
      
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${categoryColor}`}>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {notice.category}
        </span>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">
            {notice.publishedAt
              ? formatDistanceToNow(new Date(notice.publishedAt), { addSuffix: true })
              : "Just now"}
          </span>
        </div>
      </div>

      <h3 className="mb-3 text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
        {notice.title}
      </h3>
      
      {summary.short && (
        <p className="mb-4 text-sm leading-relaxed text-slate-600 line-clamp-2">
          {summary.short}
        </p>
      )}

      {summary.bullets?.length ? (
        <ul className="mb-4 space-y-2 border-l-2 border-blue-100 pl-4">
          {summary.bullets.slice(0, 3).map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
        <div className="flex flex-wrap items-center gap-4">
          {notice.fileUrl && (
            <a
              href={notice.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="group/link inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              View File
              <svg className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover/link:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          {notice.extractedText && (
            <button
              type="button"
              onClick={() => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4';
                modal.innerHTML = `
                  <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
                    <div class="flex items-center justify-between p-6 border-b border-slate-200">
                      <h3 class="text-lg font-bold text-slate-900">Extracted Text</h3>
                      <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-600">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div class="p-6 overflow-y-auto max-h-[60vh] text-sm text-slate-700 whitespace-pre-wrap">${notice.extractedText}</div>
                  </div>
                `;
                document.body.appendChild(modal);
                modal.querySelector('button').addEventListener('click', () => modal.remove());
                modal.addEventListener('click', (e) => e.target === modal && modal.remove());
              }}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Text
            </button>
          )}
        </div>
        {isAdmin && onDelete && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${notice.title}"? This action cannot be undone.`)) {
                onDelete(notice._id);
              }
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition-all hover:bg-red-100 hover:border-red-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        )}
      </div>
    </article>
  );
}

