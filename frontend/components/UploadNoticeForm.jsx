"use client";

import { useRef, useState } from "react";
import { uploadNotice } from "@/lib/api";

export default function UploadNoticeForm({ categories, token, onUploaded }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  function handleFileChange(event) {
    const selected = event.target.files?.[0];
    if (selected) setFile(selected);
  }

  function handleDrop(event) {
    event.preventDefault();
    if (event.dataTransfer.files?.[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file && !text) {
      setStatus("Provide raw text or upload a file.");
      return;
    }
    setIsUploading(true);
    setStatus("Uploading...");

    try {
      const data = new FormData();
      if (file) data.append("file", file);
      if (text) data.append("text", text);
      if (title) data.append("title", title);
      if (description) data.append("description", description);
      if (category) data.append("category", category);

      const response = await uploadNotice(data, token);
      setStatus("Uploaded successfully!");
      setFile(null);
      setText("");
      setTitle("");
      setDescription("");
      setCategory("");
      if (inputRef.current) inputRef.current.value = "";
      onUploaded?.(response.notice);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-8 shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Upload Notice</h3>
          <p className="text-sm text-slate-600">PDF, images, or raw text are supported</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Notice Title</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter notice title..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add a brief description..."
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
          />
        </div>
        
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm capitalize transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Auto detect category (AI-powered)</option>
            {categories.map((cat) => (
              <option key={cat.slug || cat.name} value={cat.slug || cat.name.toLowerCase()}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Upload File</label>
          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-blue-50/30 px-4 py-12 text-center transition-all hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50/50"
            onClick={() => inputRef.current?.click()}
          >
            <input type="file" ref={inputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
            {file ? (
              <div className="space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500">{Math.round(file.size / 1024)} KB</p>
                <p className="text-xs text-slate-400">Click to change file</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Drag & drop your file here</p>
                  <p className="mt-1 text-xs text-slate-500">or click to browse</p>
                </div>
                <p className="text-xs text-slate-400">PDF, JPG, PNG up to 15 MB</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Or Paste Raw Text</label>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={5}
            placeholder="Paste notice text here (optional)..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none font-mono"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isUploading}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/40 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-md"
      >
        {isUploading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing with AI...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload & Process Notice
          </span>
        )}
      </button>

      {status && (
        <div className={`mt-4 rounded-lg border p-3 text-sm ${
          status.includes("successful") || status.includes("Uploaded")
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-amber-200 bg-amber-50 text-amber-700"
        }`}>
          {status}
        </div>
      )}
    </form>
  );
}

