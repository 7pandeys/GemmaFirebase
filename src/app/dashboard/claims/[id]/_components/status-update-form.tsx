'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { Claim, ClaimStatus, User } from '@/lib/types';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { assignProcessor, updateClaimStatus } from '@/app/actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dispatch, SetStateAction } from 'react';

const formSchema = z.object({
  status: z.enum(['Open', 'In Progress', 'Approved', 'Rejected', 'Needs Information']),
  note: z.string().min(10, 'Note must be at least 10 characters.'),
});

interface StatusUpdateFormProps {
  claim: Claim;
  users: User[];
  processor: User | null;
  setProcessor: Dispatch<SetStateAction<User | null>>
}

export function StatusUpdateForm({ claim, users, processor, setProcessor }: StatusUpdateFormProps) {
  const { currentUser, hasRole } = useUser();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: claim.status,
      note: '',
    },
  });

  const claimProcessors = users.filter(u => u.role === 'Claim Processor');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser) return;
    try {
      await updateClaimStatus(claim.id, values.status, values.note, currentUser.id);
      toast({ title: 'Success', description: 'Claim status updated.' });
      form.reset({ status: values.status, note: '' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update status.' });
    }
  }

  const handleAssignProcessor = async (processorId: string) => {
    const newProcessor = users.find(u => u.id === processorId) || null;
    try {
        await assignProcessor(claim.id, newProcessor ? newProcessor.id : null);
        setProcessor(newProcessor);
        toast({ title: "Processor Assigned", description: `${newProcessor?.name || 'Unassigned'} is now handling this claim.`})
    } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to assign processor.' });
    }
  }

  if (!hasRole('Claim Processor')) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Assigned Processor</CardTitle>
            </CardHeader>
            <CardContent>
                {processor ? (
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback>{processor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{processor.name}</p>
                            <p className="text-sm text-muted-foreground">{processor.role}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Unassigned</p>
                )}
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Process Claim</CardTitle>
        <CardDescription>Update status and assign processor.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <Label>Assigned Processor</Label>
            <Select value={processor?.id || 'unassigned'} onValueChange={handleAssignProcessor}>
                <SelectTrigger>
                    <SelectValue placeholder="Assign a processor" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {claimProcessors.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(['Open', 'In Progress', 'Approved', 'Rejected', 'Needs Information'] as ClaimStatus[]).map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add Note</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add a note about the status change..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Updating...' : 'Update Claim'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
