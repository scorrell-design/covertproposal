"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import CovertLogo from "@/components/shared/CovertLogo";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      const redirect = params.get("redirect");
      const dest = redirect && redirect.startsWith("/") ? redirect : "/";
      router.replace(dest);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      style={{ width: "100%", maxWidth: "320px" }}
    >
      <input
        type="password"
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Team password"
        aria-label="Team password"
        className="rounded-xl px-4 py-3 outline-none"
        style={{
          border: "1px solid var(--covert-border)",
          fontSize: "15px",
          backgroundColor: "#fff",
        }}
      />
      {error && (
        <p style={{ fontSize: "13px", color: "#DC2626", margin: 0 }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={loading || password.length === 0}
        className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3"
        style={{
          backgroundColor: "var(--covert-teal)",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 600,
          opacity: loading || password.length === 0 ? 0.6 : 1,
          cursor: loading || password.length === 0 ? "default" : "pointer",
        }}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center gap-8 px-6"
      style={{ backgroundColor: "var(--covert-bg)" }}
    >
      <CovertLogo size={32} />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
