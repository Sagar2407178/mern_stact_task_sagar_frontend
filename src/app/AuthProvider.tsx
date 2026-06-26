"use client";

import { useEffect } from "react";
import { useGetMeQuery } from "@/store/api/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Skip if we don't have a token, or if we are already fully authenticated
  const { data } = useGetMeQuery(undefined, {
    skip: !token || isAuthenticated,
  });

  useEffect(() => {
    if (data?.data?.user && token) {
      dispatch(setCredentials({ user: data.data.user, token }));
    }
  }, [data, token, dispatch]);

  return <>{children}</>;
}
