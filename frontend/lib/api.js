const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function handleResponse(res) {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message = errorBody.error || 'Request failed';
    throw new Error(message);
  }
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/api/categories`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function fetchNotices(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value);
  });
  const res = await fetch(`${API_BASE}/api/notices?${query.toString()}`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function uploadNotice(formData, token) {
  const res = await fetch(`${API_BASE}/api/notices/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return handleResponse(res);
}

export async function registerSubscription(payload) {
  const res = await fetch(`${API_BASE}/api/subscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteNotice(noticeId, token) {
  const res = await fetch(`${API_BASE}/api/notices/${noticeId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

