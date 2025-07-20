// components/RoleProvider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";

type Permission = {
  code: string;
  label: string;
};

type Role = {
  name: string;
  description: string;
  permissions: Permission[];
};

type Profile = {
  full_name: string;
  status: string;
  role: Role;
  faculty: string;
  section: string;
  program: string;
  semester: string;
};

type UserStatus = {
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  profile: Profile;
};

type RoleContextType = {
  user: UserStatus | null;
  hasPermission: (permCode: string) => boolean;
  hasRole: (roleName: string) => boolean;
  loading: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // avoid setting state on unmounted component

    const fetchUser = () => {
      axiosWithCsrf
        .get("/api/user/role-check/")
        .then((res) => {
          if (isMounted) {
            setUser(res.data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
        });
    };

    fetchUser(); // initial fetch
    const interval = setInterval(fetchUser, 5000); // poll every 5 seconds

    return () => {
      isMounted = false;
      clearInterval(interval); // cleanup on unmount
    };
  }, []);

  const hasPermission = (permCode: string) =>
    user?.profile?.role?.permissions?.some((p) => p.code === permCode) ?? false;

  const hasRole = (roleName: string) => user?.profile?.role?.name === roleName;

  return (
    <RoleContext.Provider value={{ user, hasPermission, hasRole, loading }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
