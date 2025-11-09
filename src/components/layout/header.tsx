'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Input } from '../ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const pageTitles: { [key: string]: string } = {
  '/': 'Dashboard',
  '/ingredients': 'Ingredients',
  '/recipes': 'Recipes',
  '/suppliers': 'Suppliers',
  '/recipes/new': 'New Recipe',
  '/recipes/edit': 'Edit Recipe',
  '/analysis': 'Cost Analysis',
};

function getTitle(pathname: string): string {
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }
  if (pathname.startsWith('/recipes/edit')) {
    return 'Edit Recipe';
  }
  if (pathname.startsWith('/recipes/')) {
    return 'Recipe Details';
  }
  return 'Culinary Cost';
}


export function Header() {
  const pathname = usePathname();
  const title = getTitle(pathname);

  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <h1 className="text-xl font-semibold hidden sm:block">{title}</h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <form className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 w-full sm:w-[200px] md:w-[200px] lg:w-[300px]"
          />
        </form>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User" />}
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
