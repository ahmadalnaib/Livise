import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [], ctaItem }: { items: NavItem[]; ctaItem?: NavItem }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
            {ctaItem ? (
                <div className="px-2 pt-4">
                    <Link
                        href={ctaItem.href}
                        prefetch
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
                    >
                        {ctaItem.icon && <ctaItem.icon className="size-4" />}
                        <span>{ctaItem.title}</span>
                    </Link>
                </div>
            ) : null}
        </SidebarGroup>
    );
}
