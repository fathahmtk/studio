import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ChefHat, Utensils } from "lucide-react";
import { recipes, ingredients } from "@/lib/data";
import { RecipeCostChart } from "@/app/components/recipe-cost-chart";

const calculateRecipeCost = (recipe: (typeof recipes)[0]) => {
  return recipe.ingredients.reduce((total, item) => {
    const ingredient = ingredients.find((i) => i.id === item.ingredientId);
    if (!ingredient) return total;
    return total + ingredient.cost * item.quantity;
  }, 0);
};

const recipeCostData = recipes.map((recipe) => ({
  name: recipe.name.split(" ").slice(0, 2).join(" "),
  cost: parseFloat(calculateRecipeCost(recipe).toFixed(2)),
}));

export default function Home() {
  const totalIngredients = ingredients.length;
  const totalRecipes = recipes.length;
  const averageRecipeCost =
    recipes.length > 0
      ? (recipeCostData.reduce((acc, r) => acc + r.cost, 0) / totalRecipes).toFixed(2)
      : 0;

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
