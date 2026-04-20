/**
 * API configuration constants.
 * Base URL can be overridden via NEXT_PUBLIC_API_BASE_URL env var.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    me: `${API_BASE_URL}/api/auth/me`,
  },
  tickets: {
    list: `${API_BASE_URL}/api/tickets`,
    create: `${API_BASE_URL}/api/tickets`,
    detail: (id) => `${API_BASE_URL}/api/tickets/${id}`,
    updateStatus: (id) => `${API_BASE_URL}/api/tickets/${id}/status`,
    comments: {
      list: (id) => `${API_BASE_URL}/api/tickets/${id}/comments`,
      create: (id) => `${API_BASE_URL}/api/tickets/${id}/comments`,
    },
  },
};

export const TOKEN_STORAGE_KEY = "nethub_token";
export const USER_STORAGE_KEY = "nethub_user";
