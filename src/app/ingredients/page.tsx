'use client';
import { IngredientsTable } from "./components/ingredients-table";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, collectionGroup } from "firebase/firestore";
import type { Ingredient, Supplier } from "@/lib/types";
import { seedDatabase } from "@/lib/data";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function IngredientsPage() {
    const firestore = useFirestore();
    
    // Seed the database if it's empty
    useEffect(() => {
        seedDatabase();
    }, []);

    const ingredientsQuery = useMemoFirebase(() => collectionGroup(firestore, 'ingredients'), [firestore]);
    const { data: ingredients, isLoading: ingredientsLoading } = useCollection<Ingredient>(ingredientsQuery);

    const suppliersQuery = useMemoFirebase(() => collection(firestore, 'suppliers'), [firestore]);
    const { data: suppliers, isLoading: suppliersLoading } = useCollection<Supplier>(suppliersQuery);

    if (ingredientsLoading || suppliersLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-72 w-full" />
            </div>
        )
    }
  
  return <IngredientsTable ingredients={ingredients || []} suppliers={suppliers || []} />;
}
