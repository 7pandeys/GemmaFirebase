'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { ExtractClaimEntitiesOutput } from '@/ai/flows/extract-claim-entities';
import { User, Calendar, MapPin, AlertTriangle } from 'lucide-react';

interface EntityExtractionCardProps {
  entities: ExtractClaimEntitiesOutput['entities'] | undefined;
  isLoading: boolean;
}

const EntityList = ({ icon, title, items }: { icon: React.ReactNode, title: string, items: string[] | undefined }) => {
    if (!items || items.length === 0) return null;
    return (
        <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">{icon}{title}</h4>
            <div className="flex flex-wrap gap-2">
                {items.map((item, index) => <Badge variant="secondary" key={index}>{item}</Badge>)}
            </div>
        </div>
    )
}

export function EntityExtractionCard({ entities, isLoading }: EntityExtractionCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Extracted Entities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-8 w-1/4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-28" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!entities) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Extracted Entities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EntityList icon={<User className="h-4 w-4" />} title="Names" items={entities.names} />
        <EntityList icon={<Calendar className="h-4 w-4" />} title="Dates" items={entities.dates} />
        <EntityList icon={<MapPin className="h-4 w-4" />} title="Locations" items={entities.locations} />
        <EntityList icon={<AlertTriangle className="h-4 w-4" />} title="Incident Types" items={entities.incidentTypes} />
      </CardContent>
    </Card>
  );
}
