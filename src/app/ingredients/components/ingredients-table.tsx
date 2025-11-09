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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { IngredientForm } from "./ingredient-form";
import { IngredientActions } from "./ingredient-actions";
import type { Ingredient, Supplier } from "@/lib/types";
import { IngredientImport } from "./ingredient-import";
import * as XLSX from 'xlsx';

export function IngredientsTable({ ingredients, suppliers }: { ingredients: Ingredient[], suppliers: Supplier[] }) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | undefined>(undefined);

    const supplierMap = new Map(suppliers.map(s => [s.id, s.name]));

    const handleAdd = () => {
        setSelectedIngredient(undefined);
        setSheetOpen(true);
    };

    const handleEdit = (ingredient: Ingredient) => {
        setSelectedIngredient(ingredient);
        setSheetOpen(true);
    };

    const handleSheetClose = () => {
        setSheetOpen(false);
        setSelectedIngredient(undefined);
    };

    const handleExport = () => {
        const dataToExport = ingredients.map(ing => ({
            Name: ing.name,
            Description: ing.description || '',
            PurchaseCost: ing.purchaseCost,
            UnitMeasurement: ing.unitMeasurement,
            SupplierName: supplierMap.get(ing.supplierId) || 'N/A',
            Stock: ing.stock || 0,
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ingredients");
        XLSX.writeFile(workbook, "ingredients_export.xlsx");
    };

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                    <CardTitle>Ingredients</CardTitle>
                    <CardDescription>
                        Manage your inventory and supplier costs.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <IngredientImport suppliers={suppliers} />
                     <Button onClick={handleExport} variant="outline" className="w-full sm:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <Button onClick={handleAdd} className="w-full sm:w-auto">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Ingredient
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-lg">
                            <SheetHeader>
                                <SheetTitle>{selectedIngredient ? 'Edit' : 'Add'} Ingredient</SheetTitle>
                            </SheetHeader>
                            <IngredientForm
                                ingredient={selectedIngredient}
                                suppliers={suppliers}
                                onSuccess={handleSheetClose}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Supplier</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ingredients.map((ingredient) => (
                                <TableRow key={ingredient.id}>
                                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                                    <TableCell>{supplierMap.get(ingredient.supplierId) || 'N/A'}</TableCell>
                                    <TableCell>QAR {ingredient.purchaseCost.toFixed(2)} / {ingredient.unitMeasurement}</TableCell>
                                    <TableCell>
                                        <Badge variant={ingredient.stock && ingredient.stock < 10 ? "destructive" : "secondary"}>
                                            {ingredient.stock || 0}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <IngredientActions ingredient={ingredient} onEdit={() => handleEdit(ingredient)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                 {ingredients.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground">
                        No ingredients found. Add one to get started.
                    </div>
                 )}
            </CardContent>
        </Card>
    );
}