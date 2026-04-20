export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiUrl = (path) => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
