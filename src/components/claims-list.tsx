'use client'

import Link from 'next/link';
import { useUser } from '@/hooks/use-user';
import type { Claim, ClaimStatus } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

function getStatusVariant(status: ClaimStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'Approved':
      return 'default';
    case 'In Progress':
      return 'secondary';
    case 'Rejected':
      return 'destructive';
    case 'Open':
    case 'Needs Information':
    default:
      return 'outline';
  }
}

export function ClaimsList({ claims }: { claims: Claim[] }) {
  const { currentUser, hasRole } = useUser();
  const [filter, setFilter] = useState('all');

  const filteredClaims = useMemo(() => {
    if (filter === 'my-claims' && currentUser) {
      return claims.filter(c => c.processorId === currentUser.id && c.status === 'Open');
    }
    return claims;
  }, [claims, filter, currentUser]);
  
  return (
    <div className="space-y-4">
       {hasRole('Claim Processor') && (
         <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
                <TabsTrigger value="all">All Claims</TabsTrigger>
                <TabsTrigger value="my-claims">My Open Claims</TabsTrigger>
            </TabsList>
         </Tabs>
       )}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Claimant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Filed</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredClaims.map((claim) => (
                    <TableRow key={claim.id}>
                    <TableCell className="font-medium">{claim.id}</TableCell>
                    <TableCell>{claim.claimantName}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(claim.status)}>{claim.status}</Badge>
                    </TableCell>
                    <TableCell>{format(new Date(claim.dateFiled), 'PP')}</TableCell>
                     <TableCell>{format(new Date(claim.lastUpdated), 'PPpp')}</TableCell>
                    <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/claims/${claim.id}`}>
                            View
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            {filteredClaims.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    No claims found for the selected filter.
                </div>
            )}
        </div>
    </div>
  );
}
