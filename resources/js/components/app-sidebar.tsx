import { Link, usePage } from '@inertiajs/react';
import { BedDouble, BookOpen, Building2, CheckCircle2, Clock3, LayoutGrid, ListChecks, MessagesSquare, PlusCircle, Users } from 'lucide-react';
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
import { list as roomsList } from '@/routes/dashboard/admin/rooms';
import { list as usersList } from '@/routes/dashboard/admin/users';
import { landlord as landlordDashboard, tenant } from '@/routes/dashboard';
import { landlord as landlordWelcome } from '@/routes/welcome';
import tenantRoutes from '@/routes/dashboard/tenant';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as {
        auth: {
            user?: {
                role?: string;
            } | null;
        };
    };

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
        ...(auth.user?.role === 'landlord'
            ? [
                  {
                      title: 'Pending listings',
                      href: landlordDashboard({ query: { status: 'pending' } }),
                      icon: Clock3,
                  },
                  {
                      title: 'Confirmed listings',
                      href: landlordDashboard({ query: { status: 'confirmed' } }),
                      icon: CheckCircle2,
                  },
                  {
                      title: 'Tenant requests',
                      href: landlordDashboard({ query: { status: 'requests' } }),
                      icon: MessagesSquare,
                  },
              ]
            : []),
    ];

    const platformCtaItem: NavItem | undefined =
        auth.user?.role === 'landlord'
            ? {
                  title: 'Create listing',
                  href: landlordWelcome({ query: { create: '1' } }),
                  icon: PlusCircle,
                  variant: 'cta',
              }
            : undefined;

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
                <NavMain items={mainNavItems} ctaItem={platformCtaItem} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
