import Link from "next/link";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Plus, FileText } from "lucide-react";
import CovertLogo from "@/components/shared/CovertLogo";
import { getCurrentDbUser } from "@/lib/auth";
import { listProposalsForUser } from "@/lib/proposals";
import { ProposalStatus } from "@/lib/generated/prisma/client";

// Always render fresh — proposal list changes per request.
export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<ProposalStatus, { label: string; bg: string; fg: string }> = {
  DRAFT: { label: "Draft", bg: "#EEF1F4", fg: "#6D7482" },
  SENT: { label: "Sent", bg: "#E6F7F4", fg: "#2C7A7B" },
  VIEWED: { label: "Viewed", bg: "#FFF4E5", fg: "#B7791F" },
  ENGAGED: { label: "Engaged", bg: "#E6F7F4", fg: "#14B8A6" },
};

function StatusBadge({ status }: { status: ProposalStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1"
      style={{ backgroundColor: s.bg, color: s.fg, fontSize: "12px", fontWeight: 600 }}
    >
      {s.label}
    </span>
  );
}

export default async function DashboardPage() {
  const user = await getCurrentDbUser();
  if (!user) redirect("/sign-in");

  const proposals = await listProposalsForUser(user.id);

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "var(--covert-bg)" }}>
      <nav style={{ borderBottom: "1px solid var(--covert-border)" }}>
        <div
          className="mx-auto flex items-center justify-between px-6 md:px-10"
          style={{ height: "64px", maxWidth: "960px" }}
        >
          <CovertLogo size={28} />
          <UserButton />
        </div>
      </nav>

      <main
        className="mx-auto px-6 md:px-10"
        style={{ maxWidth: "960px", paddingTop: "48px", paddingBottom: "120px" }}
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--covert-black)" }}>
              Proposals
            </h1>
            <p style={{ fontSize: "15px", color: "var(--covert-text-secondary)", marginTop: "4px" }}>
              {proposals.length === 0
                ? "No proposals yet."
                : `${proposals.length} proposal${proposals.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5"
            style={{ backgroundColor: "var(--covert-teal)", color: "#fff", fontSize: "14px", fontWeight: 600 }}
          >
            <Plus size={16} />
            New proposal
          </Link>
        </div>

        {proposals.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-2xl"
            style={{ border: "1px dashed var(--covert-border)", padding: "64px 24px" }}
          >
            <FileText size={28} style={{ color: "var(--covert-text-secondary)" }} />
            <p style={{ fontSize: "15px", color: "var(--covert-text-secondary)" }}>
              Upload a PCR to generate your first proposal.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 mt-2"
              style={{ backgroundColor: "var(--covert-teal)", color: "#fff", fontSize: "14px", fontWeight: 600 }}
            >
              <Plus size={16} />
              New proposal
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--covert-border)" }}>
            {proposals.map((p, i) => (
              <Link
                key={p.id}
                href={`/proposals/${p.id}`}
                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-[var(--covert-bg-secondary)]"
                style={{ borderTop: i === 0 ? "none" : "1px solid var(--covert-border)" }}
              >
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--covert-black)" }}>
                    {p.clientName}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--covert-text-secondary)", marginTop: "2px" }}>
                    Updated {new Date(p.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <StatusBadge status={p.status} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
