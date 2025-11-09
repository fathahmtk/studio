'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Supplier } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  contactInformation: z.string().min(2, "Contact info must be at least 2 characters."),
});

type SupplierFormValues = z.infer<typeof formSchema>;

interface SupplierFormProps {
    supplier?: Supplier;
    onSuccess: () => void;
}

export function SupplierForm({ supplier, onSuccess }: SupplierFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: supplier || {
      name: "",
      contactInformation: "",
    },
  });

  async function onSubmit(values: SupplierFormValues) {
    try {
        if (supplier) {
            const docRef = doc(firestore, 'suppliers', supplier.id);
            setDocumentNonBlocking(docRef, values, { merge: true });
            toast({ title: "Success", description: "Supplier updated successfully." });
        } else {
            const newId = uuidv4();
            const collectionRef = collection(firestore, 'suppliers');
            const docRef = doc(collectionRef, newId);
            await setDocumentNonBlocking(docRef, { ...values, id: newId }, {});
            toast({ title: "Success", description: "Supplier added successfully." });
        }
        onSuccess();
    } catch (error) {
        console.error("Error saving supplier: ", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to save supplier." });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Qatar Flour Mills" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="contactInformation"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Contact Information</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. contact@qfm.qa" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <Button type="submit" className="w-full">Save Supplier</Button>
      </form>
    </Form>
  );
}
