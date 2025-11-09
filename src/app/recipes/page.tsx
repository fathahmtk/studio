import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { recipes, ingredients } from "@/lib/data";
import { PlusCircle } from "lucide-react";

const calculateRecipeCost = (recipe: (typeof recipes)[0]) => {
  return recipe.ingredients.reduce((total, item) => {
    const ingredient = ingredients.find((i) => i.id === item.ingredientId);
    if (!ingredient) return total;
    return total + ingredient.cost * item.quantity;
  }, 0);
};

export default function RecipesPage() {
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
                <p className="text-muted-foreground">Build and manage your menu items.</p>
            </div>
            <Button disabled title="Feature coming soon">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Recipe
            </Button>
        </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => {
          const ingredientCost = calculateRecipeCost(recipe);
          const totalCost = ingredientCost + recipe.laborCost + recipe.overhead;
          return (
            <Card key={recipe.id} className="flex flex-col overflow-hidden">
              <CardHeader className="p-0 border-b">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  width={600}
                  height={400}
                  className="object-cover aspect-[3/2]"
                  data-ai-hint={recipe.imageHint}
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
                    <Link href="#" aria-disabled="true" className="pointer-events-none text-muted-foreground">View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
