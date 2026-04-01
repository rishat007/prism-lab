/**
 * Admin API - authenticated requests (Bearer token)
 */
const API_BASE = '/api';
const TOKEN_KEY = 'prism_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  const value = token && typeof token === 'string' ? token.trim() : '';
  if (value) localStorage.setItem(TOKEN_KEY, value);
  else localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaderValue() {
  const token = getToken();
  return token && token.trim() ? `Bearer ${token.trim()}` : '';
}

export async function loginAdmin(username, password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    let msg = text;
    try {
      const json = JSON.parse(text);
      msg = json.message || json.error || text;
    } catch (_) {}
    throw new Error(msg || 'Login failed');
  }
  return res.json();
}

export async function logoutAdmin() {
  try {
    await adminRequest('/admin/logout', { method: 'POST' });
  } finally {
    setToken(null);
  }
}

async function adminRequest(endpoint, options = {}) {
  const auth = getAuthHeaderValue();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: auth,
    },
  });
  if (res.status === 401) {
    setToken(null);
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    let msg = text;
    try {
      const json = JSON.parse(text);
      msg = json.message || json.error || text;
    } catch (_) {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function verifyAdmin() {
  return adminRequest('/admin/verify');
}

export async function getAdminContent() {
  return adminRequest('/admin/content');
}

export async function putAdminContent(section, data) {
  return adminRequest('/admin/content', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section, data }),
  });
}

export async function uploadHero(imageFile, caption = '') {
  const form = new FormData();
  form.append('image', imageFile);
  form.append('caption', caption);
  const res = await fetch(`${API_BASE}/hero`, {
    method: 'POST',
    headers: { Authorization: getAuthHeaderValue() },
    body: form,
  });
  if (res.status === 401) {
    setToken(null);
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

export async function uploadHomeHeroPhoto(photoFile) {
  const form = new FormData();
  form.append('photo', photoFile);
  const res = await fetch(`${API_BASE}/home/photo`, {
    method: 'POST',
    headers: { Authorization: getAuthHeaderValue() },
    body: form,
  });
  if (res.status === 401) {
    setToken(null);
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

export async function uploadContactPhoto(photoFile) {
  const form = new FormData();
  form.append('photo', photoFile);
  const res = await fetch(`${API_BASE}/contact/photo`, {
    method: 'POST',
    headers: { Authorization: getAuthHeaderValue() },
    body: form,
  });
  if (res.status === 401) {
    setToken(null);
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

export async function uploadSidebarPhoto(photoFile) {
  const form = new FormData();
  form.append('photo', photoFile);
  const res = await fetch(`${API_BASE}/contact/sidebar-photo`, {
    method: 'POST',
    headers: { Authorization: getAuthHeaderValue() },
    body: form,
  });
  if (res.status === 401) {
    setToken(null);
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

export async function updateHeroSlide(id, { caption, order }) {
  return adminRequest(`/hero/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caption, order }),
  });
}

export async function deleteHeroSlide(id) {
  return adminRequest(`/hero/${id}`, { method: 'DELETE' });
}

export async function reorderHeroSlides(ids) {
  return adminRequest('/hero/reorder', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
}

// Navigation (navbar & sidebar)
export async function getAdminNav(location) {
  return adminRequest(`/admin/nav?location=${location}`);
}

export async function postNavItem(data) {
  return adminRequest('/admin/nav', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function putNavItem(id, data) {
  return adminRequest(`/admin/nav/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteNavItem(id, location) {
  return adminRequest(`/admin/nav/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location }),
  });
}

export async function putNavReorder(location, orderedIds) {
  return adminRequest('/admin/nav/reorder', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location, orderedIds }),
  });
}

export async function uploadStudentPhoto(photoFile) {
  const form = new FormData();
  form.append('photo', photoFile);
  const res = await fetch(`${API_BASE}/students/photo`, {
    method: 'POST',
    headers: { Authorization: getAuthHeaderValue() },
    body: form,
  });
  if (res.status === 401) {
    setToken(null);
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

export async function uploadContactMemberPhoto(photoFile) {
  const form = new FormData();
  form.append('photo', photoFile);
  const res = await fetch(`${API_BASE}/contact/member-photo`, {
    method: 'POST',
    headers: { Authorization: getAuthHeaderValue() },
    body: form,
  });
  if (res.status === 401) {
    setToken(null);
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

// Social Links API
export async function getSocialLinks() {
  const res = await fetch(`${API_BASE}/social`);
  if (!res.ok) throw new Error('Failed to fetch social links');
  return res.json();
}

export async function addSocialLink(label, url, icon) {
  const res = await fetch(`${API_BASE}/admin/social`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeaderValue(),
    },
    body: JSON.stringify({ label, url, icon }),
  });
  if (res.status === 401) {
    setToken(null);
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

export async function updateSocialLink(id, updates) {
  const res = await fetch(`${API_BASE}/admin/social/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeaderValue(),
    },
    body: JSON.stringify(updates),
  });
  if (res.status === 401) {
    setToken(null);
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

export async function deleteSocialLink(id) {
  const res = await fetch(`${API_BASE}/admin/social/${id}`, {
    method: 'DELETE',
    headers: { Authorization: getAuthHeaderValue() },
  });
  if (res.status === 401) {
    setToken(null);
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

export async function reorderSocialLinks(order) {
  const res = await fetch(`${API_BASE}/admin/social/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeaderValue(),
    },
    body: JSON.stringify({ order }),
  });
  if (res.status === 401) {
    setToken(null);
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}
