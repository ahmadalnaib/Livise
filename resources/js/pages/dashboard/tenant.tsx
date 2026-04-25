import { Head } from '@inertiajs/react';
import { HousePlus, Wallet, CalendarClock } from 'lucide-react';
import { tenant } from '@/routes/dashboard';

export default function TenantDashboard() {
    return (
        <>
            <Head title="Tenant Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <HousePlus className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Published rooms</p>
                        <p className="text-2xl font-semibold">7</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <Wallet className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Estimated revenue</p>
                        <p className="text-2xl font-semibold">$2,480</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <CalendarClock className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Upcoming check-ins</p>
                        <p className="text-2xl font-semibold">5</p>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <h2 className="text-lg font-semibold">Tenant area</h2>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                        This dashboard is for tenants (room owners) to monitor listings,
                        booking activity, and rental performance.
                    </p>
                </div>
            </div>
        </>
    );
}

TenantDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Tenant Dashboard',
            href: tenant(),
        },
    ],
};
