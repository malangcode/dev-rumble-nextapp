import { useEffect, useState } from "react";
import axios from "axios";

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [authData, setAuthData] = useState({
    authenticated: false,
    username: "",
    email: "",
    is_staff: false,
    is_superuser: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/auth/check-auth/", {
          withCredentials: true, // ✅ Very important for HttpOnly cookies
        });
        setAuthData(res.data); // ✅ Backend sends the structure correctly
      } catch (err) {
        // ✅ Safe fallback if user is not logged in or error
        setAuthData({
          authenticated: false,
          username: "",
          email: "",
          is_staff: false,
          is_superuser: false,
        });
      } finally {
        setLoading(false); // ✅ Important to trigger UI rendering
      }
    };
    checkAuth(); // ✅ Call once on component mount
  }, []);

  return { ...authData, loading }; // ✅ Reusable and clean
}
