'use client';

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IngredientActions } from "./ingredient-actions";
import { IngredientForm } from "./ingredient-form";
import type { Ingredient, Supplier } from "@/lib/types";

export function IngredientsTable({ ingredients, suppliers }: { ingredients: Ingredient[], suppliers: Supplier[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | undefined>(undefined);

  const getSupplierName = (supplierId: string) => {
    return suppliers.find(s => s.id === supplierId)?.name || 'Unknown';
  };

  const handleAddClick = () => {
    setSelectedIngredient(undefined);
    setDialogOpen(true);
  }

  const handleEditClick = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setDialogOpen(true);
  }

  const closeDialog = () => {
    setDialogOpen(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Ingredients</CardTitle>
            <CardDescription>Manage your ingredient database.</CardDescription>
          </div>
          <Button onClick={handleAddClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Ingredient
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>In Stock</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell className="font-medium">{ingredient.name}</TableCell>
                <TableCell>{getSupplierName(ingredient.supplierId)}</TableCell>
                <TableCell>QAR {ingredient.purchaseCost.toFixed(2)}</TableCell>
                <TableCell>{ingredient.unitMeasurement}</TableCell>
                <TableCell>{ingredient.stock || 0}</TableCell>
                <TableCell>
                  <IngredientActions ingredient={ingredient} onEdit={() => handleEditClick(ingredient)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}</DialogTitle>
            <DialogDescription>
              {selectedIngredient ? 'Update the details for this ingredient.' : 'Fill in the details for the new ingredient.'}
            </DialogDescription>
          </DialogHeader>
          <IngredientForm 
            ingredient={selectedIngredient} 
            suppliers={suppliers} 
            onSuccess={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
