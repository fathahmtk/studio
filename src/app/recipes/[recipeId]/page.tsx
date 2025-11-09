'use client';
import { useParams } from 'next/navigation';
import { useDoc, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc, collection, collectionGroup } from 'firebase/firestore';
import type { Recipe, RecipeIngredient, Ingredient } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecipeDetailsPage() {
  const { recipeId } = useParams();
  const firestore = useFirestore();
  const { user, isUserLoading: isUserLoadingAuth } = useUser();

  const recipeRef = useMemoFirebase(() => (recipeId && user) ? doc(firestore, 'recipes', recipeId as string) : null, [firestore, recipeId, user]);
  const { data: recipe, isLoading: isLoadingRecipe } = useDoc<Recipe>(recipeRef);

  const recipeIngredientsRef = useMemoFirebase(() => (recipeId && user) ? collection(firestore, `recipes/${recipeId}/recipeIngredients`) : null, [firestore, recipeId, user]);
  const { data: recipeIngredients, isLoading: isLoadingRecipeIngredients } = useCollection<RecipeIngredient>(recipeIngredientsRef);
  
  const allIngredientsRef = useMemoFirebase(() => user ? collectionGroup(firestore, 'ingredients') : null, [firestore, user]);
  const { data: allIngredients, isLoading: isLoadingAllIngredients } = useCollection<Ingredient>(allIngredientsRef);

  const getIngredientDetails = (ingredientId: string) => {
    return allIngredients?.find(ing => ing.id === ingredientId);
  };
  
  const calculateTotalCost = () => {
    if (!recipe || !recipeIngredients || !allIngredients) return 0;

    const ingredientsCost = recipeIngredients.reduce((acc, item) => {
      const details = getIngredientDetails(item.ingredientId);
      return acc + (details ? details.purchaseCost * item.quantity : 0);
    }, 0);

    return ingredientsCost + recipe.laborCost + recipe.overheadCost;
  };
  
  const calculateIngredientCost = () => {
     if (!recipe || !recipeIngredients || !allIngredients) return 0;
      return recipeIngredients.reduce((acc, item) => {
        const details = getIngredientDetails(item.ingredientId);
        return acc + (details ? details.purchaseCost * item.quantity : 0);
      }, 0);
  }

  const isLoading = isUserLoadingAuth || isLoadingRecipe || isLoadingRecipeIngredients || isLoadingAllIngredients;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-48 w-full" />
                </CardContent>
            </Card>
          </div>
          <div>
            <Card>
                <CardHeader>
                   <Skeleton className="h-7 w-2/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return <div>Recipe not found.</div>;
  }

  const totalCost = calculateTotalCost();
  const ingredientCost = calculateIngredientCost();
  const profit = (totalCost * 3) - totalCost;
  const profitMargin = totalCost > 0 ? (profit / (totalCost*3)) * 100 : 0;

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">{recipe.name}</h1>
             <Button variant="outline" disabled>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Recipe
            </Button>
       </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
           <Card>
             <CardHeader className='p-0'>
                <Image
                    src={recipe.imageUrl || "https://picsum.photos/seed/placeholder/800/450"}
                    alt={recipe.name}
                    width={800}
                    height={450}
                    className="object-cover aspect-video rounded-t-lg"
                    data-ai-hint={recipe.imageHint || "food"}
                    />
             </CardHeader>
            <CardContent className='pt-6'>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{recipe.description}</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
              <CardDescription>List of ingredients required for this recipe.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipeIngredients?.map(item => {
                    const details = getIngredientDetails(item.ingredientId);
                    return (
                      <TableRow key={item.ingredientId}>
                        <TableCell className="font-medium">{details?.name || 'Loading...'}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{details?.unitMeasurement || '...'}</TableCell>
                        <TableCell className="text-right">
                          QAR {(details ? details.purchaseCost * item.quantity : 0).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span>Ingredient Cost</span>
                <span className="font-medium">QAR {ingredientCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Labor Cost</span>
                <span className="font-medium">QAR {recipe.laborCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Overhead Cost</span>
                <span className="font-medium">QAR {recipe.overheadCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total Cost</span>
                <span>QAR {totalCost.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Profitability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                    <span>Suggested Price (3x)</span>
                    <span className="font-medium text-primary">QAR {(totalCost * 3).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Profit</span>
                    <span className="font-medium">QAR {profit.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span>Profit Margin</span>
                    <Badge variant={profitMargin > 65 ? "default" : profitMargin > 60 ? "secondary": "destructive"} className={profitMargin > 65 ? "bg-primary hover:bg-primary/80": ""}>
                        {profitMargin.toFixed(1)}%
                    </Badge>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
