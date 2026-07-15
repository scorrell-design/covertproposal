import { notFound } from "next/navigation";
import SavedProposalView from "@/components/output/SavedProposalView";
import { getCurrentDbUser } from "@/lib/auth";
import { getOwnedProposal } from "@/lib/proposals";
import { PCRData } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentDbUser();
  const proposal = await getOwnedProposal(id, user.id);
  if (!proposal) notFound();

  // pcrData is stored as JSON; it was written from a validated PCRData object.
  const data = proposal.pcrData as unknown as PCRData;
  return <SavedProposalView id={proposal.id} data={data} shareToken={proposal.shareToken} />;
}
