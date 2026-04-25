import { Head } from '@inertiajs/react';
import { ShieldCheck, Users, Building2, ChartNoAxesCombined } from 'lucide-react';
import { admin } from '@/routes/dashboard';

export default function AdminDashboard() {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <Users className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">All users</p>
                        <p className="text-2xl font-semibold">1,280</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <Building2 className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">All rooms</p>
                        <p className="text-2xl font-semibold">364</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <ChartNoAxesCombined className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Active rentals</p>
                        <p className="text-2xl font-semibold">219</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <ShieldCheck className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">System status</p>
                        <p className="text-2xl font-semibold">Healthy</p>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <h2 className="text-lg font-semibold">Admin controls</h2>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                        This dashboard is for administrators and can be expanded with user management,
                        moderation queues, and platform-wide reports.
                    </p>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: admin(),
        },
    ],
};
