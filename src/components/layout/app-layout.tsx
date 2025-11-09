'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useAuth, useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    if (!user && !isUserLoading) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  if (isUserLoading) {
    return (
       <div className="flex min-h-screen">
        <div className="hidden md:block border-r w-64 p-4">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="border-b h-16 flex items-center p-4">
             <Skeleton className="h-8 w-48" />
             <div className="ml-auto flex items-center gap-4">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
             </div>
          </div>
           <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/30">
            <Skeleton className="h-64 w-full" />
           </main>
        </div>
      </div>
    );
  }


  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/30">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
