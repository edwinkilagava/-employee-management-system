 
const API_URL = import.meta.env.VITE_API_URL; 
 
const ACCESS_TOKEN_KEY = "ems_access_token"; 
 
if (!API_URL) { 
  console.warn( 
    "VITE_API_URL is not configured. Add it to your .env file." 
  ); 
} 
 
export const tokenStorage = { 
  get() { 
    return localStorage.getItem(ACCESS_TOKEN_KEY); 
  }, 
 
  set(token) { 
    localStorage.setItem(ACCESS_TOKEN_KEY, token); 
  }, 
 
  remove() { 
    localStorage.removeItem(ACCESS_TOKEN_KEY); 
  }, 
 
  exists() { 
    return Boolean(localStorage.getItem(ACCESS_TOKEN_KEY)); 
  }, 
}; 
 
class ApiError extends Error { 
  constructor(message, options = {}) { 
    super(message); 
 
    this.name = "ApiError"; 
    this.status = options.status ?? null; 
    this.data = options.data ?? null; 
    this.isNetworkError = options.isNetworkError ?? false; 
  } 
} 
 
const getErrorMessage = (data, status) => { 
  if (data?.message) { 
    return data.message; 
  } 
 
  if (status === 400) { 
    return "The request could not be processed."; 
  } 
 
  if (status === 401) { 
    return "Your session is invalid or has expired."; 
  } 
 
  if (status === 403) { 
    return "You are not authorized to perform this action."; 
  } 
 
  if (status === 404) { 
    return "The requested resource was not found."; 
  } 
 
  if (status >= 500) { 
    return "The server encountered an error. Please try again later."; 
  } 
 
  return "Something went wrong. Please try again."; 
}; 
 
const parseResponse = async (response) => { 
  const contentType = response.headers.get("content-type") || ""; 
 
  if (contentType.includes("application/json")) { 
    try { 
      return await response.json(); 
    } catch { 
      return null; 
    } 
  } 
 
  const text = await response.text(); 
 
  return text ? { message: text } : null; 
}; 
 
export const apiRequest = async ( 
  endpoint, 
  { 
    method = "GET", 
    body, 
    headers = {}, 
    auth = true, 
    signal, 
  } = {} 
) => { 
  if (!API_URL) { 
    throw new ApiError( 
      "The API URL is not configured. Check your Vite environment variables." 
    ); 
  } 
 
  const requestHeaders = { 
    Accept: "application/json", 
    ...headers, 
  }; 
 
  const isFormData = 
    typeof FormData !== "undefined" && body instanceof FormData; 
 
  if (body !== undefined && body !== null && !isFormData) { 
    requestHeaders["Content-Type"] = "application/json"; 
  } 
 
  // Attach the saved access token to authenticated requests. 
  if (auth) { 
    const token = tokenStorage.get(); 
 
    if (token) { 
      requestHeaders.Authorization = `Bearer ${token}`; 
    } 
  } 
 
  let response; 
 
  try { 
    response = await fetch(`${API_URL}${endpoint}`, { 
      method, 
      headers: requestHeaders, 
      body: 
        body === undefined || body === null 
          ? undefined 
          : isFormData 
            ? body 
            : JSON.stringify(body), 
      signal, 
    }); 
  } catch (error) { 
    if (error.name === "AbortError") { 
      throw error; 
    } 
 
    throw new ApiError( 
      "Unable to connect to the server. Please check your internet connection and try again.", 
      { 
        isNetworkError: true, 
      } 
    ); 
  } 
 
  const data = await parseResponse(response);

  if (response.status === 401 && auth) {
    tokenStorage.remove();
    window.dispatchEvent(new Event("auth:unauthorized"));
  } 
 
  if (!response.ok) { 
    throw new ApiError(getErrorMessage(data, response.status), { 
      status: response.status, 
      data, 
    }); 
  } 
 
  return { 
    data, 
    status: response.status, 
  }; 
}; 
 
export { ApiError }; 

