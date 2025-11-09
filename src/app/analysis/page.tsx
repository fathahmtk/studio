'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, collectionGroup } from "firebase/firestore";
import type { Ingredient, Recipe, RecipeIngredient } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const calculateRecipeCost = (recipe: Recipe, recipeIngredients: RecipeIngredient[] | null, allIngredients: Ingredient[] | null) => {
  if (!recipeIngredients || !allIngredients) return 0;

  const ingredientsForRecipe = recipeIngredients.filter(ri => ri.id.startsWith(recipe.id));
  
  const ingredientCost = ingredientsForRecipe.reduce((total, item) => {
    const ingredient = allIngredients.find((i) => i.id === item.ingredientId);
    if (!ingredient) return total;
    return total + ingredient.purchaseCost * item.quantity;
  }, 0);

  return ingredientCost;
};


const portionSizes = [
  { name: 'Small', multiplier: 0.75 },
  { name: 'Standard', multiplier: 1 },
  { name: 'Large', multiplier: 1.25 },
];

export default function AnalysisPage() {
  const firestore = useFirestore();

  const recipesQuery = useMemoFirebase(() => collection(firestore, "recipes"), [firestore]);
  const { data: recipes, isLoading: isLoadingRecipes } = useCollection<Recipe>(recipesQuery);

  const ingredientsQuery = useMemoFirebase(() => collectionGroup(firestore, "ingredients"), [firestore]);
  const { data: ingredients, isLoading: isLoadingIngredients } = useCollection<Ingredient>(ingredientsQuery);

  const recipeIngredientsQuery = useMemoFirebase(() => collectionGroup(firestore, 'recipeIngredients'), [firestore]);
  const { data: recipeIngredients, isLoading: isLoadingRecipeIngredients } = useCollection<RecipeIngredient>(recipeIngredientsQuery);

  const isLoading = isLoadingRecipes || isLoadingIngredients || isLoadingRecipeIngredients;
  
  if (isLoading) {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Menu Profitability</CardTitle>
                    <CardDescription>
                        Analyze profitability and cost breakdown for your menu items.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-64 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Cost by Portion Size</CardTitle>
                    <CardDescription>Review the total cost for different serving sizes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-48 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Menu Profitability</CardTitle>
          <CardDescription>
            Analyze profitability and cost breakdown for your menu items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Recipe</TableHead>
                <TableHead>Ingredient Cost</TableHead>
                <TableHead>Labor & Overhead</TableHead>
                <TableHead>Total Cost (Std)</TableHead>
                <TableHead>Suggested Price</TableHead>
                <TableHead>Profit Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipes?.map((recipe) => {
                const ingredientCost = calculateRecipeCost(recipe, recipeIngredients, ingredients);
                const otherCosts = recipe.laborCost + recipe.overheadCost;
                const totalCost = ingredientCost + otherCosts;
                const suggestedPrice = totalCost * 3; // Standard 3x markup
                const profit = suggestedPrice - totalCost;
                const profitMargin = suggestedPrice > 0 ? (profit / suggestedPrice) * 100 : 0;

                return (
                  <TableRow key={recipe.id}>
                    <TableCell className="font-medium">{recipe.name}</TableCell>
                    <TableCell>QAR {ingredientCost.toFixed(2)}</TableCell>
                    <TableCell>QAR {otherCosts.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold">QAR {totalCost.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold text-primary">QAR {suggestedPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={profitMargin > 65 ? "default" : profitMargin > 60 ? "secondary": "destructive"} className={profitMargin > 65 ? "bg-primary hover:bg-primary/80": ""}>
                        {profitMargin.toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
          <CardHeader>
            <CardTitle>Cost by Portion Size</CardTitle>
            <CardDescription>Review the total cost for different serving sizes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Recipe</TableHead>
                        {portionSizes.map(size => (
                            <TableHead key={size.name}>{size.name} Cost</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recipes?.map(recipe => {
                        const ingredientCost = calculateRecipeCost(recipe, recipeIngredients, ingredients);
                        const baseCost = ingredientCost + recipe.laborCost + recipe.overheadCost;
                        return (
                            <TableRow key={recipe.id}>
                                <TableCell className="font-medium">{recipe.name}</TableCell>
                                {portionSizes.map(size => (
                                    <TableCell key={size.name}>QAR {(baseCost * size.multiplier).toFixed(2)}</TableCell>
                                ))}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
          </CardContent>
      </Card>
    </div>
  );
}
