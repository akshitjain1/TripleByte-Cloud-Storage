/**
 * API Configuration
 *
 * For production (nginx reverse proxy on same domain):
 * - baseURL: "" (empty string means current domain)
 * - All requests go to /auth, /files, /health
 *
 * For development:
 * - Uses environment variable VITE_API_BASE_URL
 * - Defaults to relative paths (works with Vite proxy or same-domain setup)
 */

export const getApiBaseUrl = () => {
  // In production, use empty string (same domain via nginx)
  if (import.meta.env.PROD) {
    return ''
  }

  // In development, check environment variable or use relative paths
  const envUrl = import.meta.env.VITE_API_BASE_URL
  if (envUrl) {
    return envUrl
  }

  // Default to relative paths (works with Vite proxy)
  return ''
}

export const API_BASE_URL = getApiBaseUrl()
