'use client';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, collectionGroup, doc, writeBatch } from 'firebase/firestore';
import type { Ingredient } from '@/lib/types';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const recipeIngredientSchema = z.object({
  ingredientId: z.string().min(1, "Please select an ingredient."),
  quantity: z.coerce.number().positive("Quantity must be positive."),
});

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  laborCost: z.coerce.number().nonnegative("Labor cost cannot be negative."),
  overheadCost: z.coerce.number().nonnegative("Overhead cost cannot be negative."),
  imageUrl: z.string().url("Please enter a valid image URL.").optional().or(z.literal('')),
  imageHint: z.string().optional(),
  recipeIngredients: z.array(recipeIngredientSchema).min(1, "Please add at least one ingredient."),
});

type RecipeFormValues = z.infer<typeof formSchema>;

export default function NewRecipePage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const ingredientsQuery = useMemoFirebase(() => user ? collectionGroup(firestore, 'ingredients') : null, [firestore, user]);
  const { data: ingredients, isLoading: ingredientsLoading } = useCollection<Ingredient>(ingredientsQuery);

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      laborCost: 0,
      overheadCost: 0,
      imageUrl: "",
      imageHint: "",
      recipeIngredients: [{ ingredientId: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "recipeIngredients",
  });

  async function onSubmit(values: RecipeFormValues) {
    if (!firestore || !user) return;
    const recipeId = uuidv4();
    try {
        const { recipeIngredients, ...recipeData } = values;
        
        const batch = writeBatch(firestore);

        const recipeDocRef = doc(firestore, 'recipes', recipeId);
        batch.set(recipeDocRef, { ...recipeData, id: recipeId });

        const ingredientsCollectionRef = collection(recipeDocRef, 'recipeIngredients');
        for (const ingredient of recipeIngredients) {
            const newIngredientId = uuidv4();
            const ingredientDocRef = doc(ingredientsCollectionRef, newIngredientId);
            batch.set(ingredientDocRef, { ...ingredient, id: newIngredientId, recipeId });
        }
        
        await batch.commit();

        toast({ title: "Success", description: "Recipe created successfully!" });
        router.push('/recipes');
    } catch (error) {
        console.error("Error creating recipe: ", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to create recipe." });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Recipe</h1>
             <Button type="submit" disabled={form.formState.isSubmitting || !user} className="w-full sm:w-auto">
                {form.formState.isSubmitting ? "Saving..." : "Save Recipe"}
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recipe Details</CardTitle>
                        <CardDescription>Provide the basic information for your new recipe.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Recipe Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Classic Chicken Biryani" {...field} />
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
                                    <Textarea placeholder="Describe the recipe..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Ingredients</CardTitle>
                        <CardDescription>Add the ingredients needed for this recipe.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {fields.map((field, index) => (
                             <div key={field.id} className="flex flex-col sm:flex-row items-start sm:items-end gap-4 p-2 rounded-md border">
                                <FormField
                                    control={form.control}
                                    name={`recipeIngredients.${index}.ingredientId`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1 w-full">
                                            <FormLabel>Ingredient</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={ingredientsLoading}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select an ingredient" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {ingredients?.map(ing => (
                                                        <SelectItem key={ing.id} value={ing.id}>{ing.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                     control={form.control}
                                     name={`recipeIngredients.${index}.quantity`}
                                     render={({ field }) => (
                                        <FormItem className='w-full sm:w-32'>
                                             <FormLabel>Quantity</FormLabel>
                                             <FormControl>
                                                <Input type="number" step="0.01" placeholder="1" {...field} />
              </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                     )}
                                />
                                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="w-full sm:w-10 mt-2 sm:mt-0">
                                    <Trash2 className="h-4 w-4" />
                                     <span className="sm:hidden ml-2">Remove</span>
                                </Button>
                             </div>
                        ))}
                         <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => append({ ingredientId: '', quantity: 1 })}
                            >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Ingredient
                        </Button>
                         {form.formState.errors.recipeIngredients?.root && (
                            <p className="text-sm font-medium text-destructive">{form.formState.errors.recipeIngredients.root.message}</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                     <CardHeader>
                        <CardTitle>Costs</CardTitle>
                        <CardDescription>Enter the non-ingredient costs.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <FormField
                            control={form.control}
                            name="laborCost"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Labor Cost (QAR)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="15.00" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="overheadCost"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Overhead Cost (QAR)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="10.00" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Display Image</CardTitle>
                        <CardDescription>Optional image for the recipe card.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://images.unsplash.com/..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="imageHint"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Image Hint</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. spicy chicken" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
      </form>
    </Form>
  );
}
