import { randomBytes } from "node:crypto";
import { prisma } from "./db";
import { Prisma, ProposalEventType, ProposalStatus } from "@/lib/generated/prisma/client";
import { PCRData } from "./types";
import type { Provenance } from "./pcr/types";

/** URL-safe, unguessable token for the public share link (~22 chars). */
export function newShareToken(): string {
  return randomBytes(16).toString("base64url");
}

const asJson = (v: unknown) => v as Prisma.InputJsonValue;

/** Upsert the Clerk user into our DB so proposals have an owner. */
export function syncUser(input: { clerkId: string; email: string; name?: string | null }) {
  return prisma.user.upsert({
    where: { clerkId: input.clerkId },
    create: { clerkId: input.clerkId, email: input.email, name: input.name ?? null },
    update: { email: input.email, name: input.name ?? null },
  });
}

/** Create a proposal (with share token) and log a CREATED event atomically. */
export function createProposal(input: {
  ownerUserId: string;
  clientName: string;
  preparedFor?: string;
  pcrData: PCRData;
  provenance?: Provenance;
}) {
  return prisma.proposal.create({
    data: {
      ownerUserId: input.ownerUserId,
      clientName: input.clientName,
      preparedFor: input.preparedFor ?? "",
      shareToken: newShareToken(),
      pcrData: asJson(input.pcrData),
      provenance: input.provenance ? asJson(input.provenance) : Prisma.JsonNull,
      events: { create: { type: ProposalEventType.CREATED } },
    },
  });
}

/** A salesperson's proposals for their dashboard, newest first. */
export function listProposalsForUser(ownerUserId: string) {
  return prisma.proposal.findMany({
    where: { ownerUserId },
    orderBy: { updatedAt: "desc" },
  });
}

/** Fetch a proposal the caller owns (returns null if not theirs). */
export function getOwnedProposal(id: string, ownerUserId: string) {
  return prisma.proposal.findFirst({ where: { id, ownerUserId } });
}

/** Public, view-only lookup by share token (for the prospect-facing link). */
export function getProposalByShareToken(shareToken: string) {
  return prisma.proposal.findUnique({ where: { shareToken } });
}

/** Save edits from the review screen (client name, copy, corrected figures, status). */
export function updateProposal(
  id: string,
  patch: {
    clientName?: string;
    preparedFor?: string;
    status?: ProposalStatus;
    pcrData?: PCRData;
    provenance?: Provenance;
  }
) {
  return prisma.proposal.update({
    where: { id },
    data: {
      clientName: patch.clientName,
      preparedFor: patch.preparedFor,
      status: patch.status,
      pcrData: patch.pcrData ? asJson(patch.pcrData) : undefined,
      provenance: patch.provenance ? asJson(patch.provenance) : undefined,
    },
  });
}

/** Append a lifecycle event (shared / viewed / downloaded / engaged). */
export function recordEvent(
  proposalId: string,
  type: ProposalEventType,
  metadata?: Record<string, unknown>
) {
  return prisma.proposalEvent.create({
    data: { proposalId, type, metadata: metadata ? asJson(metadata) : Prisma.JsonNull },
  });
}

/**
 * Record a prospect opening the public share link: logs a VIEWED event and
 * advances the status (DRAFT/SENT → VIEWED), without ever downgrading an
 * already-ENGAGED proposal. Returns false if the token doesn't resolve.
 */
export async function recordView(shareToken: string): Promise<boolean> {
  const proposal = await prisma.proposal.findUnique({
    where: { shareToken },
    select: { id: true, status: true },
  });
  if (!proposal) return false;
  await prisma.proposalEvent.create({
    data: { proposalId: proposal.id, type: ProposalEventType.VIEWED },
  });
  if (proposal.status === ProposalStatus.DRAFT || proposal.status === ProposalStatus.SENT) {
    await prisma.proposal.update({
      where: { id: proposal.id },
      data: { status: ProposalStatus.VIEWED },
    });
  }
  return true;
}

/**
 * Record an owner-initiated event (SHARED when they copy the link, DOWNLOADED
 * when they export the PDF). Sharing a draft advances it to SENT. Verifies the
 * caller owns the proposal; returns false otherwise.
 */
export async function recordOwnerEvent(
  id: string,
  ownerUserId: string,
  type: ProposalEventType,
  metadata?: Record<string, unknown>
): Promise<boolean> {
  const proposal = await prisma.proposal.findFirst({
    where: { id, ownerUserId },
    select: { id: true, status: true },
  });
  if (!proposal) return false;
  await prisma.proposalEvent.create({
    data: { proposalId: id, type, metadata: metadata ? asJson(metadata) : Prisma.JsonNull },
  });
  if (type === ProposalEventType.SHARED && proposal.status === ProposalStatus.DRAFT) {
    await prisma.proposal.update({ where: { id }, data: { status: ProposalStatus.SENT } });
  }
  return true;
}

/** Capture a prospect's "Request Client Service Agreement" submission + mark ENGAGED. */
export function createEngagementRequest(input: {
  proposalId: string;
  prospectName: string;
  prospectEmail: string;
  prospectCompany?: string;
  prospectPhone?: string;
  notes?: string;
}) {
  return prisma.$transaction([
    prisma.engagementRequest.create({ data: input }),
    prisma.proposalEvent.create({
      data: { proposalId: input.proposalId, type: ProposalEventType.ENGAGED },
    }),
    prisma.proposal.update({
      where: { id: input.proposalId },
      data: { status: ProposalStatus.ENGAGED },
    }),
  ]);
}
