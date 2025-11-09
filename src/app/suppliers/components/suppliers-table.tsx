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
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SupplierForm } from "./supplier-form";
import { SupplierActions } from "./supplier-actions";
import type { Supplier } from "@/lib/types";

export function SuppliersTable({ suppliers }: { suppliers: Supplier[] }) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>(undefined);

    const handleAdd = () => {
        setSelectedSupplier(undefined);
        setSheetOpen(true);
    };

    const handleEdit = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setSheetOpen(true);
    };

    const handleSheetClose = () => {
        setSheetOpen(false);
        setSelectedSupplier(undefined);
    };

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                    <CardTitle>Suppliers</CardTitle>
                    <CardDescription>
                        Manage your ingredient suppliers.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <Button onClick={handleAdd} className="w-full sm:w-auto">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Supplier
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-lg">
                            <SheetHeader>
                                <SheetTitle>{selectedSupplier ? 'Edit' : 'Add'} Supplier</SheetTitle>
                            </SheetHeader>
                            <SupplierForm
                                supplier={selectedSupplier}
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
                                <TableHead>Contact Information</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suppliers.map((supplier) => (
                                <TableRow key={supplier.id}>
                                    <TableCell className="font-medium">{supplier.name}</TableCell>
                                    <TableCell>{supplier.contactInformation}</TableCell>
                                    <TableCell className="text-right">
                                        <SupplierActions supplier={supplier} onEdit={() => handleEdit(supplier)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                 {suppliers.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground">
                        No suppliers found. Add one to get started.
                    </div>
                 )}
            </CardContent>
        </Card>
    );
}
