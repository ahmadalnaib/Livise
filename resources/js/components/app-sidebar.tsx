import { Link, usePage } from '@inertiajs/react';
import { BedDouble, Building2, LayoutGrid, ListChecks, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { tenant } from '@/routes/dashboard';
import { list as roomsList } from '@/routes/dashboard/admin/rooms';
import { list as usersList } from '@/routes/dashboard/admin/users';
import tenantRoutes from '@/routes/dashboard/tenant';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;
    const isAdmin = auth.user?.role === 'admin';
    const isTenant = auth.user?.role === 'tenant';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(isAdmin
            ? [
                {
                    title: 'Users',
                    href: usersList(),
                    icon: Users,
                },
                {
                    title: 'Rooms',
                    href: roomsList(),
                    icon: Building2,
                },
            ]
            : []),
        ...(isTenant
            ? [
                {
                    title: 'All Rooms',
                    href: tenant(),
                    icon: ListChecks,
                },
                {
                    title: 'Rented Rooms',
                    href: tenantRoutes.rentedRooms(),
                    icon: BedDouble,
                },
            ]
            : []),
    ];

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
