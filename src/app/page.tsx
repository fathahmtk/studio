'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ChefHat, Utensils } from "lucide-react";
import { RecipeCostChart } from "@/app/components/recipe-cost-chart";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { Ingredient, Recipe, RecipeIngredient } from "@/lib/types";
import { collection, collectionGroup } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

const calculateRecipeCost = (recipeIngredients: RecipeIngredient[], allIngredients: Ingredient[] | null) => {
  if (!recipeIngredients || !allIngredients) return 0;
  return recipeIngredients.reduce((total, item) => {
    const ingredient = allIngredients.find((i) => i.id === item.ingredientId);
    if (!ingredient) return total;
    return total + ingredient.purchaseCost * item.quantity;
  }, 0);
};


export default function Home() {
  const firestore = useFirestore();

  const recipesQuery = useMemoFirebase(() => collection(firestore, "recipes"), [firestore]);
  const { data: recipes, isLoading: isLoadingRecipes } = useCollection<Recipe>(recipesQuery);

  const ingredientsQuery = useMemoFirebase(() => collectionGroup(firestore, "ingredients"), [firestore]);
  const { data: ingredients, isLoading: isLoadingIngredients } = useCollection<Ingredient>(ingredientsQuery);

  const recipeIngredientsQuery = useMemoFirebase(() => collectionGroup(firestore, 'recipeIngredients'), [firestore]);
    const { data: recipeIngredients, isLoading: isLoadingRecipeIngredients } = useCollection<RecipeIngredient>(recipeIngredientsQuery);


  const recipeCostData = recipes?.map((recipe) => {
    const relevantRecipeIngredients = recipeIngredients?.filter(ri => ri.id.startsWith(recipe.id)) ?? [];
    return {
      name: recipe.name.split(" ").slice(0, 2).join(" "),
      cost: parseFloat(calculateRecipeCost(relevantRecipeIngredients, ingredients).toFixed(2)),
    }
  }) ?? [];

  const totalIngredients = ingredients?.length ?? 0;
  const totalRecipes = recipes?.length ?? 0;
  const averageRecipeCost =
    totalRecipes > 0
      ? (recipeCostData.reduce((acc, r) => acc + r.cost, 0) / totalRecipes).toFixed(2)
      : "0.00";

  const isLoading = isLoadingRecipes || isLoadingIngredients || isLoadingRecipeIngredients;


  if (isLoading) {
    return (
       <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Ingredients</CardTitle>
                    <ChefHat className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-4 w-40 mt-1" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
                    <Utensils className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-4 w-32 mt-1" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Recipe Cost</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-44 mt-1" />
                </CardContent>
            </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recipe Cost Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <Skeleton className="h-full w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Ingredients
            </CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIngredients}</div>
            <p className="text-xs text-muted-foreground">
              Unique ingredients in database
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecipes}</div>
            <p className="text-xs text-muted-foreground">Menu items created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Recipe Cost
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">QAR {averageRecipeCost}</div>
            <p className="text-xs text-muted-foreground">
              Average ingredient cost per recipe
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recipe Cost Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <RecipeCostChart data={recipeCostData} />
        </CardContent>
      </Card>
    </div>
  );
}
