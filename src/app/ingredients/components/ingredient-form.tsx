'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Ingredient, Supplier } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  supplierId: z.string().min(1, "Please select a supplier."),
  purchaseCost: z.coerce.number().positive("Cost must be a positive number."),
  unitMeasurement: z.enum(['kg', 'g', 'l', 'ml', 'piece']),
  stock: z.coerce.number().nonnegative("Stock cannot be negative.").optional(),
});

type IngredientFormValues = z.infer<typeof formSchema>;

interface IngredientFormProps {
    ingredient?: Ingredient;
    suppliers: Supplier[];
    onSuccess: () => void;
}

export function IngredientForm({ ingredient, suppliers, onSuccess }: IngredientFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: ingredient ? {
        ...ingredient,
        stock: ingredient.stock ?? 0,
    } : {
      name: "",
      description: "",
      supplierId: "",
      purchaseCost: undefined,
      unitMeasurement: "kg",
      stock: 0,
    },
  });

  async function onSubmit(values: IngredientFormValues) {
    try {
        if (ingredient) {
            // If supplier has changed, we need to move the document.
            // This means deleting the old one and creating a new one.
            if (ingredient.supplierId !== values.supplierId) {
                const oldDocRef = doc(firestore, `suppliers/${ingredient.supplierId}/ingredients`, ingredient.id);
                const { deleteDocumentNonBlocking } = await import('@/firebase/non-blocking-updates');
                deleteDocumentNonBlocking(oldDocRef);

                const newDocRef = doc(firestore, `suppliers/${values.supplierId}/ingredients`, ingredient.id);
                setDocumentNonBlocking(newDocRef, { ...values, id: ingredient.id }, {});
            } else {
                 const docRef = doc(firestore, `suppliers/${values.supplierId}/ingredients`, ingredient.id);
                 setDocumentNonBlocking(docRef, values, { merge: true });
            }
            toast({ title: "Success", description: "Ingredient updated successfully." });
        } else {
            const newId = uuidv4();
            const collectionRef = collection(firestore, `suppliers/${values.supplierId}/ingredients`);
            const docRef = doc(collectionRef, newId);
            await setDocumentNonBlocking(docRef, { ...values, id: newId }, {});
            toast({ title: "Success", description: "Ingredient added successfully." });
        }
        onSuccess();
    } catch (error) {
        console.error("Error saving ingredient: ", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to save ingredient." });
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
              <FormLabel>Ingredient Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Flour" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea placeholder="e.g. All-purpose, unbleached" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
         <FormField
          control={form.control}
          name="supplierId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!suppliers || suppliers.length === 0}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="purchaseCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost (QAR)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="5.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unitMeasurement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="l">l</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="piece">piece</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Save Ingredient</Button>
      </form>
    </Form>
  );
}
