// Helper to make fetch requests with credentials (cookies) included
export const fetchApi = async (url, options = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // Important: this sends cookies with the request
    credentials: "include",
  };

  const response = await fetch(url, config);

  // Handle 401 Unauthorized globally if needed, or return response to let components handle it
  if (response.status === 401) {
    // Optional: Redirect to login or dispatch logout action if you have global store access here
    // But for now we just return the response so components can handle it
  }

  return response;
};
