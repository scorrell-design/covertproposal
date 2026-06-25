import { notFound } from "next/navigation";
import OutputProposal from "@/components/output/OutputProposal";
import ViewBeacon from "@/components/output/ViewBeacon";
import { getProposalByShareToken } from "@/lib/proposals";
import { PCRData } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * PUBLIC prospect-facing view (no auth — allowlisted in middleware). Renders the
 * proposal read-only with download enabled and no owner controls; the view is
 * tracked via ViewBeacon.
 */
export default async function PublicProposalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const proposal = await getProposalByShareToken(token);
  if (!proposal) notFound();

  const data = proposal.pcrData as unknown as PCRData;
  return (
    <>
      <ViewBeacon token={token} />
      <OutputProposal data={data} />
    </>
  );
}
