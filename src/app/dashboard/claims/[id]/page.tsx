import { dataApi } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ClaimDetailsClient } from './_components/claim-details-client';

export default async function ClaimDetailsPage({ params }: { params: { id: string } }) {
  const claim = await dataApi.getClaim(params.id);
  const users = await dataApi.getUsers();
  
  if (!claim) {
    notFound();
  }
  
  const processor = claim.processorId ? await dataApi.getUser(claim.processorId) : null;

  return (
    <ClaimDetailsClient claim={claim} users={users} processor={processor} />
  );
}
