
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../services/auth.service.js";

import { tokenStorage } from "../services/api.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * Get the currently authenticated user from the backend.
   */
  const refreshUser = useCallback(async () => {
    if (!tokenStorage.exists()) {
      setUser(null);
      return null;
    }

    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);

      return currentUser;
    } catch {
      tokenStorage.remove();
      setUser(null);

      return null;
    }
  }, []);

  /*
   * Restore authentication when the application starts.
   */
  useEffect(() => {
    let mounted = true;

    const restoreAuthentication = async () => {
      if (!tokenStorage.exists()) {
        if (mounted) {
          setLoading(false);
        }

        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (mounted) {
          setUser(currentUser);
        }
      } catch {
        tokenStorage.remove();

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    restoreAuthentication();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Handle an expired or invalid JWT.
   *
   * api.js dispatches "auth:unauthorized" whenever the backend
   * returns HTTP 401 for an authenticated request.
   */
  useEffect(() => {
    const handleUnauthorized = () => {
      tokenStorage.remove();
      setUser(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener(
        "auth:unauthorized",
        handleUnauthorized
      );
    };
  }, []);

  /*
   * Login user.
   */
  const login = useCallback(async (credentials) => {
    const currentUser = await loginUser(credentials);

    setUser(currentUser);

    return currentUser;
  }, []);

  /*
   * Logout user.
   */
  const logout = useCallback(async () => {
    try {
      if (tokenStorage.exists()) {
        await logoutUser();
      }
    } catch {
      /*
       * Even if the backend logout request fails,
       * the frontend must still clear authentication.
       */
    } finally {
      tokenStorage.remove();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refreshUser,
    }),
    [user, loading, login, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

