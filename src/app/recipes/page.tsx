'use client'
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, collectionGroup } from "firebase/firestore";
import type { Ingredient, Recipe, RecipeIngredient } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const calculateRecipeCost = (recipe: Recipe, recipeIngredients: RecipeIngredient[] | null, allIngredients: Ingredient[] | null) => {
    if (!recipeIngredients || !allIngredients) return recipe.laborCost + recipe.overheadCost;
    
    const ingredientsForRecipe = recipeIngredients.filter(ri => ri.id.startsWith(recipe.id));

    const ingredientCost = ingredientsForRecipe.reduce((total, item) => {
        const ingredient = allIngredients.find((i) => i.id === item.ingredientId);
        if (!ingredient) return total;
        return total + ingredient.purchaseCost * item.quantity;
    }, 0);

    return ingredientCost + recipe.laborCost + recipe.overheadCost;
};


export default function RecipesPage() {
    const firestore = useFirestore();
    const { user, isUserLoading: isUserLoadingAuth } = useUser();

    const recipesQuery = useMemoFirebase(() => user ? collection(firestore, "recipes") : null, [firestore, user]);
    const { data: recipes, isLoading: isLoadingRecipes } = useCollection<Recipe>(recipesQuery);

    const ingredientsQuery = useMemoFirebase(() => user ? collectionGroup(firestore, "ingredients") : null, [firestore, user]);
    const { data: ingredients, isLoading: isLoadingIngredients } = useCollection<Ingredient>(ingredientsQuery);

    const recipeIngredientsQuery = useMemoFirebase(() => user ? collectionGroup(firestore, 'recipeIngredients') : null, [firestore, user]);
    const { data: recipeIngredients, isLoading: isLoadingRecipeIngredients } = useCollection<RecipeIngredient>(recipeIngredientsQuery);

    const isLoading = isUserLoadingAuth || isLoadingRecipes || isLoadingIngredients || isLoadingRecipeIngredients;


    if (isLoading) {
        return (
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
                        <p className="text-muted-foreground">Build and manage your menu items.</p>
                    </div>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Recipe
                    </Button>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="flex flex-col overflow-hidden">
                            <CardHeader className="p-0 border-b">
                                <Skeleton className="h-[200px] w-full" />
                            </CardHeader>
                            <CardContent className="p-4 flex-1">
                               <Skeleton className="h-6 w-3/4 mb-2" />
                               <Skeleton className="h-4 w-full" />
                               <Skeleton className="h-4 w-5/6 mt-1" />
                            </CardContent>
                             <CardFooter className="p-4 pt-0 flex justify-between items-center bg-muted/50">
                                <div>
                                    <Skeleton className="h-6 w-20 mb-1" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-9 w-24" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
                <p className="text-muted-foreground">Build and manage your menu items.</p>
            </div>
             <Button asChild>
                <Link href="/recipes/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Recipe
                </Link>
            </Button>
        </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes?.map((recipe) => {
          const totalCost = calculateRecipeCost(recipe, recipeIngredients, ingredients);
          return (
            <Card key={recipe.id} className="flex flex-col overflow-hidden">
              <CardHeader className="p-0 border-b">
                <Image
                  src={recipe.imageUrl || "https://picsum.photos/seed/placeholder/600/400"}
                  alt={recipe.name}
                  width={600}
                  height={400}
                  className="object-cover aspect-[3/2]"
                  data-ai-hint={recipe.imageHint || "food"}
                />
              </CardHeader>
              <CardContent className="p-4 flex-1">
                <CardTitle>{recipe.name}</CardTitle>
                <CardDescription className="mt-2 line-clamp-2 h-10">{recipe.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center bg-muted/50">
                <div>
                  <p className="text-lg font-semibold">QAR {totalCost.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Total Menu Price</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href={`/recipes/${recipe.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
