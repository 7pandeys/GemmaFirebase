import { type User, type Claim, type ClaimStatus, type UserRole } from './types';

let users: User[] = [
  { id: 'user-1', name: 'Alex Johnson', role: 'Customer Agent', avatar: 'A' },
  { id: 'user-2', name: 'Ben Carter', role: 'Claim Processor', avatar: 'B' },
  { id: 'user-3', name: 'Chloe Davis', role: 'Claim Processor', avatar: 'C' },
];

let claims: Claim[] = [
  {
    id: 'claim-001',
    policyNumber: 'POL-12345',
    claimantName: 'John Doe',
    claimantEmail: 'john.doe@example.com',
    claimDescription: "On January 15, 2024, I, John Doe, was involved in a rear-end collision on the I-5 freeway near downtown Los Angeles. The other driver, Jane Smith, hit my car from behind. My car, a 2022 Toyota Camry, has significant damage to the rear bumper and trunk. I have a whiplash injury and went to see a doctor at Cedar-Sinai Medical Center.",
    status: 'Open',
    processorId: 'user-2',
    dateFiled: '2024-01-15T14:30:00Z',
    lastUpdated: '2024-01-15T14:30:00Z',
    notes: [],
    incidentReport: "Police Report #LA-98765. States Jane Smith was at fault.",
    medicalRecords: "Cedar-Sinai Medical Center visit on 2024-01-15. Diagnosis: Cervical strain (whiplash).",
    policyDetails: "Comprehensive coverage with $500 deductible. Policy is active."
  },
  {
    id: 'claim-002',
    policyNumber: 'POL-67890',
    claimantName: 'Alice Johnson',
    claimantEmail: 'alice.j@example.com',
    claimDescription: "My basement at 123 Maple Street, Springfield, was flooded during the heavy rainstorm on March 5, 2024. The water damaged the carpet, furniture, and a television.",
    status: 'In Progress',
    processorId: 'user-3',
    dateFiled: '2024-03-06T09:00:00Z',
    lastUpdated: '2024-03-08T11:20:00Z',
    notes: [
      { id: 'note-1', authorId: 'user-3', content: 'Scheduled an inspector visit for March 10th.', createdAt: '2024-03-08T11:20:00Z' }
    ],
    incidentReport: "Homeowner's statement. Photos of the damage provided.",
    medicalRecords: "Not applicable.",
    policyDetails: "Homeowner's insurance with flood rider. Policy is active. $1000 deductible."
  },
  {
    id: 'claim-003',
    policyNumber: 'POL-54321',
    claimantName: 'Bob Williams',
    claimantEmail: 'bob.w@example.com',
    claimDescription: "A pipe burst in my apartment at 456 Oak Avenue, Metropolis, on April 1, 2024. The water leaked into my neighbor's apartment below. My neighbor is Carol White. The building manager, Dave Smith, has been notified.",
    status: 'Needs Information',
    processorId: 'user-2',
    dateFiled: '2024-04-01T18:00:00Z',
    lastUpdated: '2024-04-02T16:45:00Z',
    notes: [
      { id: 'note-2', authorId: 'user-2', content: 'Requested a copy of the building incident report and plumber invoice.', createdAt: '2024-04-02T16:45:00Z' }
    ],
    incidentReport: "Building management filed a report. Awaiting copy.",
    medicalRecords: "Not applicable.",
    policyDetails: "Renter's insurance, liability coverage. Policy is active."
  },
  {
    id: 'claim-004',
    policyNumber: 'POL-11223',
    claimantName: 'Emily Clark',
    claimantEmail: 'emily.c@example.com',
    claimDescription: "My vehicle was stolen from the City Center parking garage on May 20, 2024. The car is a 2023 Honda Civic, license plate 'THX-1138'. I have filed a police report with the Metropolis Police Department.",
    status: 'Approved',
    processorId: 'user-3',
    dateFiled: '2024-05-21T10:00:00Z',
    lastUpdated: '2024-06-15T14:00:00Z',
    notes: [
        { id: 'note-3', authorId: 'user-3', content: 'Police report confirmed. Waiting period for vehicle recovery has passed. Approving claim for vehicle value.', createdAt: '2024-06-15T14:00:00Z' }
    ],
    incidentReport: "Metropolis PD report #MPD-24-12345. Vehicle reported stolen.",
    medicalRecords: "Not applicable.",
    policyDetails: "Comprehensive auto policy with theft coverage. Policy active."
  }
];

// Simulate a database API
export const dataApi = {
  getUsers: async (): Promise<User[]> => {
    return users;
  },
  getUser: async (id: string): Promise<User | undefined> => {
    return users.find((user) => user.id === id);
  },
  getClaims: async (): Promise<Claim[]> => {
    return claims.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  },
  getClaim: async (id: string): Promise<Claim | undefined> => {
    return claims.find((claim) => claim.id === id);
  },
  createClaim: async (newClaimData: Omit<Claim, 'id' | 'lastUpdated' | 'notes' | 'status'>): Promise<Claim> => {
    const newId = `claim-${String(claims.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newClaim: Claim = {
      ...newClaimData,
      id: newId,
      status: 'Open',
      lastUpdated: now,
      notes: [],
    };
    claims.unshift(newClaim);
    return newClaim;
  },
  updateClaim: async (id: string, updates: Partial<Claim>): Promise<Claim | undefined> => {
    const claimIndex = claims.findIndex((claim) => claim.id === id);
    if (claimIndex === -1) return undefined;
    
    const updatedClaim = {
      ...claims[claimIndex],
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    claims[claimIndex] = updatedClaim;
    return updatedClaim;
  },
};
