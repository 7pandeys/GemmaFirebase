import { type ExtractClaimEntitiesOutput } from '@/ai/flows/extract-claim-entities';
import { type VerifyClaimInformationOutput } from '@/ai/flows/verify-claim-information';

export type UserRole = 'Customer Agent' | 'Claim Processor';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export type ClaimStatus =
  | 'Open'
  | 'In Progress'
  | 'Approved'
  | 'Rejected'
  | 'Needs Information';

export interface ClaimNote {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Claim {
  id: string;
  policyNumber: string;
  claimantName: string;
  claimantEmail: string;
  claimDescription: string;
  status: ClaimStatus;
  processorId: string | null;
  dateFiled: string;
  lastUpdated: string;
  notes: ClaimNote[];
  extractedEntities?: ExtractClaimEntitiesOutput['entities'];
  verificationResult?: VerifyClaimInformationOutput;
  // For verification flow
  incidentReport: string;
  medicalRecords: string;
  policyDetails: string;
}
