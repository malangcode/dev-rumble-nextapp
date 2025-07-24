// utils/auth.ts
// utils/auth.ts
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
// import axios from 'axios';

export interface UserAuthStatus {
  authenticated: boolean;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
  email: string;
  wallet_balance: string;
  photo: string | null;
  exp: number; // 👈 new
}

export const getAuthStatus = async (): Promise<UserAuthStatus | null> => {
  try {
    const res = await axiosWithCsrf.get("/auth/status/", {});
    if (res.data.user_status_encoded) {
      document.cookie = `user_status=${res.data.user_status_encoded}; path=/; Secure; SameSite=None`;
    }
    return res.data as UserAuthStatus;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      // 👇 Try refresh
      try {
        await axiosWithCsrf.post("/token/refresh/", {}, {});

        // 👇 Retry original request after successful refresh
        const retryRes = await axiosWithCsrf.get("/auth/status/", {});

        return retryRes.data as UserAuthStatus;
      } catch (refreshError) {
        console.error("Refresh failed", refreshError);
        return null;
      }
    }

    return null;
  }
};

// Logout user
export const logout = async () => {
  try {
    await axiosWithCsrf.post("/auth/logout/", {}, {});
  } catch (err) {
    console.error("Logout failed", err);
  }
};
