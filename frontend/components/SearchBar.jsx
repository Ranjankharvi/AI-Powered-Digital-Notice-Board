"use client";

export default function SearchBar({ defaultQuery, onSearch }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSearch(formData.get("query") || "");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all focus-within:border-blue-400 focus-within:shadow-md focus-within:shadow-blue-100"
    >
      <svg className="h-5 w-5 flex-shrink-0 text-slate-400 group-focus-within:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        name="query"
        defaultValue={defaultQuery}
        placeholder="Search notices, keywords, or topics..."
        className="flex-1 border-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:from-blue-700 hover:to-indigo-700"
      >
        Search
      </button>
    </form>
  );
}

