'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod';
import { dataApi } from '@/lib/data';
import type { Claim, ClaimNote, ClaimStatus } from '@/lib/types';
import { extractClaimEntities as extractClaimEntitiesFlow } from '@/ai/flows/extract-claim-entities';
import { verifyClaimInformation as verifyClaimInformationFlow } from '@/ai/flows/verify-claim-information';


const createClaimSchema = z.object({
  claimantName: z.string(),
  claimantEmail: z.string().email(),
  policyNumber: z.string(),
  claimDescription: z.string(),
  dateFiled: z.string().datetime(),
  processorId: z.string().nullable(),
  incidentReport: z.string(),
  medicalRecords: z.string(),
  policyDetails: z.string(),
});

export async function createClaim(data: z.infer<typeof createClaimSchema>) {
  const validatedData = createClaimSchema.parse(data);
  await dataApi.createClaim(validatedData);
  revalidatePath('/dashboard');
}

export async function updateClaimStatus(claimId: string, status: ClaimStatus, note: string, authorId: string) {
  const claim = await dataApi.getClaim(claimId);
  if (!claim) {
    throw new Error('Claim not found');
  }

  const newNote: ClaimNote = {
    id: `note-${Date.now()}`,
    content: `${status}: ${note}`,
    authorId: authorId,
    createdAt: new Date().toISOString()
  };
  
  const updates: Partial<Claim> = {
    status: status,
    notes: [newNote, ...claim.notes],
  };

  await dataApi.updateClaim(claimId, updates);
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/claims/${claimId}`);
}

export async function assignProcessor(claimId: string, processorId: string | null) {
  await dataApi.updateClaim(claimId, { processorId });
  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/claims/${claimId}`);
}

export async function extractClaimEntities(claimDescription: string) {
    try {
        const result = await extractClaimEntitiesFlow({ claimDescription });
        return { success: true, data: result.entities };
    } catch (error) {
        console.error("Error extracting entities:", error);
        return { success: false, error: "Failed to extract entities." };
    }
}

export async function verifyClaimInformation(claim: Claim) {
    try {
        const result = await verifyClaimInformationFlow({
            claimDescription: claim.claimDescription,
            policyDetails: claim.policyDetails,
            incidentReport: claim.incidentReport,
            medicalRecords: claim.medicalRecords,
        });
        return { success: true, data: result };
    } catch (error) {
        console.error("Error verifying information:", error);
        return { success: false, error: "Failed to verify information." };
    }
}
