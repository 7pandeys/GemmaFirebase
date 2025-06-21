'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export function RulesAndRegulations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5"/> Guidelines</CardTitle>
        <CardDescription>Rules & Regulations for Processing</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-3">
        <div>
            <h4 className="font-semibold text-foreground">1. Acknowledge Receipt</h4>
            <p>Acknowledge receipt of a claim within 5 business days.</p>
        </div>
        <div>
            <h4 className="font-semibold text-foreground">2. Investigate Promptly</h4>
            <p>Begin a thorough investigation of the claim within 10 business days of receipt.</p>
        </div>
        <div>
            <h4 className="font-semibold text-foreground">3. Decision & Communication</h4>
            <p>Provide a decision (approve/deny) within 30 days. If more time is needed, communicate the reason to the claimant.</p>
        </div>
        <div>
            <h4 className="font-semibold text-foreground">4. Document Everything</h4>
            <p>All communications, findings, and decisions must be clearly documented in the claim notes.</p>
        </div>
      </CardContent>
    </Card>
  );
}
