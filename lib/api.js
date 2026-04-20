import { API_ENDPOINTS, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "@/constants/api";

/**
 * Low-level JSON fetch wrapper.
 * Throws an Error with a readable message on non-2xx responses.
 */
export async function apiFetch(
  url,
  { method = "GET", body, headers, token, auth = true } = {}
) {
  // Auto-attach the stored bearer token unless the caller opts out
  let bearer = token;
  if (!bearer && auth && typeof window !== "undefined") {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored && stored !== "session") bearer = stored;
  }

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new Error(
      "Could not reach the server. Make sure the API is running at the configured base URL."
    );
  }

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function register({ name, email, password }) {
  const data = await apiFetch(API_ENDPOINTS.auth.register, {
    method: "POST",
    body: { name, email, password },
  });
  persistSession(data, { name, email });
  return data;
}

export async function login({ email, password }) {
  const data = await apiFetch(API_ENDPOINTS.auth.login, {
    method: "POST",
    body: { email, password },
  });
  persistSession(data, { email });
  return data;
}

/**
 * Extract a token + user object from a variety of common API response shapes.
 * Falls back to the submitted payload if the server doesn't echo a user object.
 */
function persistSession(data, fallback = {}) {
  if (typeof window === "undefined") return;

  // Token: support { token }, { access_token }, { accessToken }, { jwt }, or { data: { token } }
  const token =
    data?.token ||
    data?.access_token ||
    data?.accessToken ||
    data?.jwt ||
    data?.data?.token ||
    data?.data?.access_token ||
    null;

  // User: support { user }, { data: { user } }, { data }, or root object
  let user =
    data?.user ||
    data?.data?.user ||
    (data && (data.email || data.name) ? data : null) ||
    (data?.data && (data.data.email || data.data.name) ? data.data : null) ||
    null;

  // If server returned nothing useful, synthesize a user from the submitted fields
  if (!user && (fallback.email || fallback.name)) {
    user = {
      name: fallback.name || fallback.email,
      email: fallback.email,
      role: "customer",
    };
  } else if (user && !user.role) {
    user = { ...user, role: "customer" };
  }

  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
  if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

  // If neither token nor user came back and we couldn't synthesize one,
  // at least mark the session so the auth guard doesn't kick the user out.
  if (!token && !user) {
    localStorage.setItem(TOKEN_STORAGE_KEY, "session");
  }
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* -------------------- Tickets -------------------- */

function unwrap(res) {
  // Server returns { data: {...}, success: true } — normalize to the inner object
  if (res && typeof res === "object" && "data" in res) return res.data;
  return res;
}

/**
 * Normalize an API ticket into the shape the UI components expect.
 * API:  { id, title, description, status, user_id, created_at, updated_at }
 * UI:   { id, title, description, status, priority, category,
 *         customer: { name, email, avatar }, assignee, createdAt, updatedAt,
 *         location, messages }
 */
export function normalizeTicket(t, currentUser = null) {
  if (!t) return null;
  const status = (t.status || "open").toLowerCase().replace(/\s+/g, "_");
  const rawId = t.id ?? t.ID ?? t.ticket_id;
  const prettyId =
    typeof rawId === "string" && rawId.startsWith("TCK-")
      ? rawId
      : `TCK-${String(rawId ?? "—").padStart(4, "0")}`;

  const customerName =
    t.user?.name || t.customer?.name || currentUser?.name || currentUser?.email || "You";
  const customerEmail =
    t.user?.email || t.customer?.email || currentUser?.email || "";

  return {
    id: prettyId,
    rawId,
    title: t.title || "Untitled",
    description: t.description || "",
    status,
    priority: t.priority || "medium",
    category: t.category || "General",
    customer: {
      name: customerName,
      email: customerEmail,
      avatar: initialsOf(customerName),
    },
    assignee: t.assignee
      ? { name: t.assignee.name, avatar: initialsOf(t.assignee.name) }
      : { name: "Unassigned", avatar: "NA" },
    createdAt: t.created_at || t.createdAt || new Date().toISOString(),
    updatedAt: t.updated_at || t.updatedAt || t.created_at || new Date().toISOString(),
    location: t.location || "—",
    messages: t.messages || [],
  };
}

function initialsOf(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts[0]) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export async function createTicket({ title, description }) {
  const res = await apiFetch(API_ENDPOINTS.tickets.create, {
    method: "POST",
    body: { title, description },
  });
  return normalizeTicket(unwrap(res), getStoredUser());
}

export async function listTickets() {
  const res = await apiFetch(API_ENDPOINTS.tickets.list);
  const data = unwrap(res);
  const arr = Array.isArray(data) ? data : data?.tickets || data?.items || [];
  const me = getStoredUser();
  return arr.map((t) => normalizeTicket(t, me));
}

function resolveTicketId(id) {
  // Accept pretty "TCK-0001" ids — strip the prefix for the request
  if (typeof id === "string" && id.startsWith("TCK-")) {
    return Number(id.replace(/^TCK-0*/, "")) || id;
  }
  return id;
}

export async function getTicket(id) {
  const res = await apiFetch(API_ENDPOINTS.tickets.detail(resolveTicketId(id)));
  return normalizeTicket(unwrap(res), getStoredUser());
}

/**
 * Admin only — update a ticket's status.
 * PUT /api/tickets/:id/status  body: { status }
 */
export async function updateTicketStatus(id, status) {
  const res = await apiFetch(API_ENDPOINTS.tickets.updateStatus(resolveTicketId(id)), {
    method: "PUT",
    body: { status },
  });
  return normalizeTicket(unwrap(res), getStoredUser());
}

export async function listTicketComments(id) {
  const res = await apiFetch(API_ENDPOINTS.tickets.comments.list(resolveTicketId(id)));
  const data = unwrap(res);
  return Array.isArray(data) ? data : data?.comments || data?.items || [];
}

export async function createTicketComment(id, { text }) {
  const res = await apiFetch(API_ENDPOINTS.tickets.comments.create(resolveTicketId(id)), {
    method: "POST",
    body: { message: text, text },
  });
  return unwrap(res);
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}
