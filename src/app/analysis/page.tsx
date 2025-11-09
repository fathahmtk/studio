import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { recipes, ingredients } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

const calculateRecipeCost = (recipe: (typeof recipes)[0]) => {
  return recipe.ingredients.reduce((total, item) => {
    const ingredient = ingredients.find((i) => i.id === item.ingredientId);
    if (!ingredient) return total;
    return total + ingredient.cost * item.quantity;
  }, 0);
};

const portionSizes = [
  { name: 'Small', multiplier: 0.75 },
  { name: 'Standard', multiplier: 1 },
  { name: 'Large', multiplier: 1.25 },
];

export default function AnalysisPage() {
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
              {recipes.map((recipe) => {
                const ingredientCost = calculateRecipeCost(recipe);
                const otherCosts = recipe.laborCost + recipe.overhead;
                const totalCost = ingredientCost + otherCosts;
                const suggestedPrice = totalCost * 3; // Standard 3x markup
                const profit = suggestedPrice - totalCost;
                const profitMargin = (profit / suggestedPrice) * 100;

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
                    {recipes.map(recipe => {
                        const baseCost = calculateRecipeCost(recipe) + recipe.laborCost + recipe.overhead;
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
