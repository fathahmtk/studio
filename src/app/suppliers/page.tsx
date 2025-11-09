'use client';
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Supplier } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { SuppliersTable } from "./components/suppliers-table";

export default function SuppliersPage() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();

    const suppliersQuery = useMemoFirebase(() => user ? collection(firestore, 'suppliers') : null, [firestore, user]);
    const { data: suppliers, isLoading: suppliersLoading } = useCollection<Supplier>(suppliersQuery);

    if (isUserLoading || suppliersLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-72 w-full" />
            </div>
        )
    }
  
  return <SuppliersTable suppliers={suppliers || []} />;
}
