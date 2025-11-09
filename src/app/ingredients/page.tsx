'use client';
import { IngredientsTable } from "./components/ingredients-table";
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection, collectionGroup } from "firebase/firestore";
import type { Ingredient, Supplier } from "@/lib/types";
import { seedDatabase } from "@/lib/data";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function IngredientsPage() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    
    // Seed the database if it's empty
    useEffect(() => {
        if (user) {
            seedDatabase();
        }
    }, [user]);

    const ingredientsQuery = useMemoFirebase(() => user ? collectionGroup(firestore, 'ingredients') : null, [firestore, user]);
    const { data: ingredients, isLoading: ingredientsLoading } = useCollection<Ingredient>(ingredientsQuery);

    const suppliersQuery = useMemoFirebase(() => user ? collection(firestore, 'suppliers') : null, [firestore, user]);
    const { data: suppliers, isLoading: suppliersLoading } = useCollection<Supplier>(suppliersQuery);

    if (isUserLoading || ingredientsLoading || suppliersLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-72 w-full" />
            </div>
        )
    }
  
  return <IngredientsTable ingredients={ingredients || []} suppliers={suppliers || []} />;
}
