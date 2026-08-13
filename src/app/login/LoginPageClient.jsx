"use client";

import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function LoginPageClient() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading..." />}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
