"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

/** Clears the shared-password session cookie and returns to the login page. */
export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/logout", { method: "POST" }).catch(() => {});
    router.replace("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="inline-flex items-center gap-1.5"
      style={{
        fontSize: "14px",
        fontWeight: 600,
        color: "var(--covert-text-secondary)",
        cursor: "pointer",
      }}
    >
      <LogOut size={15} />
      Sign out
    </button>
  );
}
