'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, FileWarning, CheckCircle } from 'lucide-react';
import type { VerifyClaimInformationOutput } from '@/ai/flows/verify-claim-information';

interface VerificationCardProps {
  verification: VerifyClaimInformationOutput | undefined;
  isLoading: boolean;
}

const VerificationList = ({ title, items, icon }: { title: string, items: string[], icon: React.ReactNode }) => {
    return (
        <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">{icon}{title}</h4>
            {items.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground">None identified.</p>
            )}
        </div>
    )
}

export function VerificationCard({ verification, isLoading }: VerificationCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Information Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-1/3 mt-4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!verification) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Information Verification</CardTitle>
        <CardDescription>AI-powered analysis of claim information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Verification Summary</h4>
            <p className="text-sm text-muted-foreground">{verification.verificationSummary}</p>
        </div>
        <VerificationList title="Inconsistencies" items={verification.inconsistencies} icon={<FileWarning className="h-4 w-4 text-yellow-500" />} />
        <VerificationList title="Fraud Indicators" items={verification.fraudIndicators} icon={<AlertCircle className="h-4 w-4 text-red-500" />} />
      </CardContent>
    </Card>
  );
}
