'use client'

import { useState } from 'react';
import type { Claim, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { extractClaimEntities, verifyClaimInformation } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { EntityExtractionCard } from './entity-extraction-card';
import { VerificationCard } from './verification-card';
import { StatusUpdateForm } from './status-update-form';
import { RulesAndRegulations } from './rules-and-regulations';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ExtractClaimEntitiesOutput } from '@/ai/flows/extract-claim-entities';
import type { VerifyClaimInformationOutput } from '@/ai/flows/verify-claim-information';


export function ClaimDetailsClient({ claim: initialClaim, users, processor: initialProcessor }: { claim: Claim, users: User[], processor: User | null }) {
  const [claim, setClaim] = useState<Claim>(initialClaim);
  const [processor, setProcessor] = useState<User | null>(initialProcessor);

  const [isExtracting, setIsExtracting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [entities, setEntities] = useState<ExtractClaimEntitiesOutput['entities'] | undefined>(initialClaim.extractedEntities);
  const [verification, setVerification] = useState<VerifyClaimInformationOutput | undefined>(initialClaim.verificationResult);
  const { toast } = useToast();

  const handleExtractEntities = async () => {
    setIsExtracting(true);
    const result = await extractClaimEntities(claim.claimDescription);
    if (result.success) {
      setEntities(result.data);
      toast({ title: 'Success', description: 'Entities extracted from claim description.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsExtracting(false);
  };

  const handleVerifyInformation = async () => {
    setIsVerifying(true);
    const result = await verifyClaimInformation(claim);
    if (result.success) {
      setVerification(result.data);
      toast({ title: 'Success', description: 'Claim information verification complete.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsVerifying(false);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" className="mb-4">
            <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-headline font-bold">Claim #{claim.id}</h1>
                <p className="text-muted-foreground">
                    Filed on {format(new Date(claim.dateFiled), 'MMMM d, yyyy')}
                </p>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={handleExtractEntities} disabled={isExtracting}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isExtracting ? 'Extracting...' : 'Extract Entities'}
                </Button>
                <Button onClick={handleVerifyInformation} disabled={isVerifying}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {isVerifying ? 'Verifying...' : 'Verify Information'}
                </Button>
            </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Claim Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-semibold text-muted-foreground">Claimant:</span> {claim.claimantName}</div>
                    <div><span className="font-semibold text-muted-foreground">Email:</span> {claim.claimantEmail}</div>
                    <div><span className="font-semibold text-muted-foreground">Policy #:</span> {claim.policyNumber}</div>
                    <div><span className="font-semibold text-muted-foreground">Status:</span> <Badge>{claim.status}</Badge></div>
                </div>
                <Separator />
                <div>
                    <h4 className="font-semibold mb-2">Claim Description</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{claim.claimDescription}</p>
                </div>
            </CardContent>
          </Card>
          
          <EntityExtractionCard entities={entities} isLoading={isExtracting} />
          <VerificationCard verification={verification} isLoading={isVerifying} />

           <Card>
                <CardHeader>
                    <CardTitle>Claim History & Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {claim.notes.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No notes have been added yet.</p>
                        ) : (
                            claim.notes.map(note => {
                                const author = users.find(u => u.id === note.authorId);
                                return (
                                    <div key={note.id} className="flex items-start gap-4">
                                        <Avatar>
                                            <AvatarFallback>{author?.name.charAt(0) || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm">{author?.name} <span className="text-xs text-muted-foreground font-normal ml-2">{format(new Date(note.createdAt), 'PPpp')}</span></p>
                                            <p className="text-sm text-muted-foreground">{note.content}</p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
          <StatusUpdateForm claim={claim} users={users} processor={processor} setProcessor={setProcessor} />
          <RulesAndRegulations />
        </div>
      </div>
    </div>
  );
}
