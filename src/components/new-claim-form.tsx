'use client'

import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClaim } from '@/app/actions';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  claimantName: z.string().min(2, { message: 'Claimant name must be at least 2 characters.' }),
  claimantEmail: z.string().email({ message: 'Please enter a valid email.' }),
  policyNumber: z.string().min(5, { message: 'Policy number must be at least 5 characters.' }),
  claimDescription: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
  incidentReport: z.string().optional(),
  medicalRecords: z.string().optional(),
  policyDetails: z.string().optional(),
});

export function NewClaimForm({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { currentUser } = useUser();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      claimantName: '',
      claimantEmail: '',
      policyNumber: '',
      claimDescription: '',
      incidentReport: '',
      medicalRecords: '',
      policyDetails: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "You must be logged in to create a claim.",
        });
        return;
    }

    try {
      await createClaim({
          ...values,
          dateFiled: new Date().toISOString(),
          processorId: null, // Initially unassigned
          incidentReport: values.incidentReport || "N/A",
          medicalRecords: values.medicalRecords || "N/A",
          policyDetails: values.policyDetails || "N/A",
      });
      toast({
        title: "Success",
        description: "New claim has been created.",
      });
      form.reset();
      setOpen(false);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to create claim. Please try again.",
        });
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Create New Claim</DialogTitle>
          <DialogDescription>
            Enter the details for the new insurance claim. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="claimantName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Claimant Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="claimantEmail"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Claimant Email</FormLabel>
                        <FormControl>
                            <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="policyNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Policy Number</FormLabel>
                    <FormControl>
                        <Input placeholder="POL-12345" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="claimDescription"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Claim Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Describe the incident in detail..." className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Claim'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
