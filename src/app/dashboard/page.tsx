import { dataApi } from '@/lib/data';
import { ClaimsList } from '@/components/claims-list';
import { NewClaimForm } from '@/components/new-claim-form';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Claim } from '@/lib/types';

export default async function DashboardPage() {
  const claims: Claim[] = await dataApi.getClaims();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-headline font-bold">Claims Dashboard</h1>
            <p className="text-muted-foreground">
                View and manage all insurance claims.
            </p>
        </div>
        <div className="flex-shrink-0">
          <NewClaimForm>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Claim
            </Button>
          </NewClaimForm>
        </div>
      </div>
      <ClaimsList claims={claims} />
    </div>
  );
}
