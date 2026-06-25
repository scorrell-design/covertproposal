"use client";

import { useRouter } from "next/navigation";
import OutputProposal from "./OutputProposal";
import { PCRData } from "@/lib/types";

/**
 * Owner-facing view of a persisted proposal: renders OutputProposal with the
 * nav wired for the salesperson — back to dashboard, "Share link" (copies the
 * public /p/[token] URL + marks the proposal sent), and download (logged).
 */
export default function SavedProposalView({
  id,
  data,
  shareToken,
}: {
  id: string;
  data: PCRData;
  shareToken: string;
}) {
  const router = useRouter();

  const postEvent = (type: "SHARED" | "DOWNLOADED") =>
    fetch(`/api/proposals/${id}/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    }).catch(() => {});

  const handleShare = async () => {
    const url = `${window.location.origin}/p/${shareToken}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard can be blocked; the event still records the share intent.
    }
    await postEvent("SHARED");
  };

  return (
    <OutputProposal
      data={data}
      onBack={() => router.push("/dashboard")}
      onShare={handleShare}
      onDownloaded={() => postEvent("DOWNLOADED")}
    />
  );
}
