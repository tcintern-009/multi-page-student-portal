"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo = "/login",
}) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (requireAdmin && !isAdmin) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, isAdmin, requireAdmin, redirectTo, router]);

  if (loading) {
    return <LoadingSpinner label="Checking authentication..." />;
  }

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return <LoadingSpinner label="Redirecting..." />;
  }

  return children;
}
