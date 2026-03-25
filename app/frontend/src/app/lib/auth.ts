import { clearAccessSnapshot } from "./permission";

const TOKEN_KEY = "easycms_token";
const TOKEN_EXPIRES_AT_KEY = "easycms_token_expires_at";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, expiresAt?: string) {
  localStorage.setItem(TOKEN_KEY, token);
  if (expiresAt) {
    localStorage.setItem(TOKEN_EXPIRES_AT_KEY, expiresAt);
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
  clearAccessSnapshot();
}

/**
 * 统一登出收口：清理本地会话并回到登录页。
 * - 主动登出：按钮点击后调用
 * - 被动登出：401/1002 时调用
 */
export function logoutToLogin() {
  clearToken();
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
}
