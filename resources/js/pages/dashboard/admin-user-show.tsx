import { Head, Link } from '@inertiajs/react';
import { admin } from '@/routes/dashboard';
import { list as usersList } from '@/routes/dashboard/admin/users';

type UserProfile = {
    id: number;
    name: string;
    email: string;
    role: string;
    tenantApproved: boolean;
    tenantApprovedAt: string | null;
    createdAt: string | null;
    counts: {
        rooms: number;
        rentals: number;
        bookingRequests: number;
        landlordBookingRequests: number;
    };
};

type PageProps = {
    user: UserProfile;
};

export default function AdminUserShowPage({ user }: PageProps) {
    return (
        <>
            <Head title={`Admin User ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <h2 className="text-lg font-semibold">User Profile</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Detailed user information for admin review.</p>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Name</p>
                            <p className="mt-1 text-sm font-semibold">{user.name}</p>
                        </div>
                        <div className="rounded-lg border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                            <p className="mt-1 text-sm font-semibold">{user.email}</p>
                        </div>
                        <div className="rounded-lg border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Role</p>
                            <p className="mt-1 text-sm font-semibold capitalize">{user.role}</p>
                        </div>
                        <div className="rounded-lg border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Tenant approval</p>
                            <p className="mt-1 text-sm font-semibold">
                                {user.role === 'tenant' ? (user.tenantApproved ? 'Approved' : 'Pending') : 'N/A'}
                            </p>
                            {user.tenantApprovedAt ? (
                                <p className="mt-1 text-xs text-muted-foreground">Approved at: {user.tenantApprovedAt}</p>
                            ) : null}
                        </div>
                        <div className="rounded-lg border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Joined</p>
                            <p className="mt-1 text-sm font-semibold">{user.createdAt ?? 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <h3 className="text-base font-semibold">Activity Summary</h3>
                    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-lg border border-sidebar-border/70 p-4 text-sm dark:border-sidebar-border">
                            <p className="text-muted-foreground">Rooms listed</p>
                            <p className="mt-1 text-xl font-semibold">{user.counts.rooms}</p>
                        </div>
                        <div className="rounded-lg border border-sidebar-border/70 p-4 text-sm dark:border-sidebar-border">
                            <p className="text-muted-foreground">Rentals</p>
                            <p className="mt-1 text-xl font-semibold">{user.counts.rentals}</p>
                        </div>
                        <div className="rounded-lg border border-sidebar-border/70 p-4 text-sm dark:border-sidebar-border">
                            <p className="text-muted-foreground">Tenant requests</p>
                            <p className="mt-1 text-xl font-semibold">{user.counts.bookingRequests}</p>
                        </div>
                        <div className="rounded-lg border border-sidebar-border/70 p-4 text-sm dark:border-sidebar-border">
                            <p className="text-muted-foreground">Landlord requests</p>
                            <p className="mt-1 text-xl font-semibold">{user.counts.landlordBookingRequests}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <Link href={usersList()} className="text-sm text-primary hover:underline">
                        Back to users list
                    </Link>
                </div>
            </div>
        </>
    );
}

AdminUserShowPage.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: admin(),
        },
        {
            title: 'Users',
            href: usersList(),
        },
        {
            title: 'User Profile',
            href: usersList(),
        },
    ],
};
