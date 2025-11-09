'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, DollarSign, LayoutDashboard, ChefHat, Utensils, Truck } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarContent,
  SidebarFooter,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ingredients', label: 'Ingredients', icon: ChefHat },
  { href: '/recipes', label: 'Recipes', icon: Utensils },
  { href: '/suppliers', label: 'Suppliers', icon: Truck },
  { href: '/analysis', label: 'Cost Analysis', icon: DollarSign },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-semibold text-primary">Culinary Cost</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                className="w-full"
                tooltip={link.label}
              >
                <Link href={link.href}>
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2" />
        <div className="p-2 text-center text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
            <p>&copy; {new Date().getFullYear()} CAN F&B</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
