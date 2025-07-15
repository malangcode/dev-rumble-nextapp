// utils/auth.ts
// utils/auth.ts
import axios from 'axios';

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
    const res = await axios.get('https://rahis.pythonanywhere.com/auth/status/', {
      withCredentials: true,
    });
    return res.data as UserAuthStatus;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      // 👇 Try refresh
      try {
        await axios.post('https://rahis.pythonanywhere.com/token/refresh/', {}, {
          withCredentials: true,
        });

        // 👇 Retry original request after successful refresh
        const retryRes = await axios.get('https://rahis.pythonanywhere.com/auth/status/', {
          withCredentials: true,
        });

        return retryRes.data as UserAuthStatus;
      } catch (refreshError) {
        console.error('Refresh failed', refreshError);
        return null;
      }
    }

    return null;
  }
};


// Logout user
export const logout = async () => {
  try {
    await axios.post('https://rahis.pythonanywhere.com/auth/logout/', {}, {
      withCredentials: true,
    });
  } catch (err) {
    console.error("Logout failed", err);
  }
};
