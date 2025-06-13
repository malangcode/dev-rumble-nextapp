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
}

export const getAuthStatus = async (): Promise<UserAuthStatus | null> => {
  try {
    const res = await axios.get('http://localhost:8000/auth/status/', {
      withCredentials: true,
    });
    return res.data as UserAuthStatus;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      // 👇 Try refresh
      try {
        await axios.post('http://localhost:8000/token/refresh/', {}, {
          withCredentials: true,
        });

        // 👇 Retry original request after successful refresh
        const retryRes = await axios.get('http://localhost:8000/auth/status/', {
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
    await axios.post('http://localhost:8000/auth/logout/', {}, {
      withCredentials: true,
    });
    window.location.href = '/login';
  } catch (err) {
    console.error("Logout failed", err);
  }
};
