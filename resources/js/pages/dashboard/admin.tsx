import { Head, Link, usePage } from '@inertiajs/react';
import { Building2, ChartNoAxesCombined, ShieldCheck, Users } from 'lucide-react';
import { admin } from '@/routes/dashboard';
import { approve } from '@/routes/dashboard/admin/bookings';
import { list as roomsList, show as roomShow } from '@/routes/dashboard/admin/rooms';
import { approve as approveTenant, list as usersList, show as userShow } from '@/routes/dashboard/admin/users';

type BookingRequest = {
    id: number;
    status: 'pending' | 'approved' | 'rejected' | string;
    startsAt: string;
    endsAt: string;
    approvedAt: string | null;
    room: {
        id: number;
        title: string;
        city: string;
    };
    tenant: {
        id: number;
        name: string;
        email: string;
    };
    landlord: {
        id: number;
        name: string;
        email: string;
    };
};

type PageProps = {
    stats: {
        allUsers: number;
        allRooms: number;
        activeRentals: number;
        pendingRequests: number;
        pendingTenants: number;
    };
    pendingTenantUsers: Array<{
        id: number;
        name: string;
        email: string;
        createdAt: string | null;
    }>;
    bookingRequests: BookingRequest[];
};

export default function AdminDashboard() {
    const { stats, pendingTenantUsers, bookingRequests } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <Users className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">All users</p>
                        <p className="text-2xl font-semibold">{stats.allUsers}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <Building2 className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">All rooms</p>
                        <p className="text-2xl font-semibold">{stats.allRooms}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <ChartNoAxesCombined className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Active rentals</p>
                        <p className="text-2xl font-semibold">{stats.activeRentals}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <ShieldCheck className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Pending tenant approvals</p>
                        <p className="text-2xl font-semibold">{stats.pendingTenants}</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Link
                        href={usersList()}
                        className="rounded-xl border border-sidebar-border/70 bg-white p-5 transition hover:border-primary/40 hover:bg-primary/5 dark:border-sidebar-border dark:bg-sidebar"
                    >
                        <p className="text-sm font-semibold">Users Page</p>
                        <p className="mt-1 text-sm text-muted-foreground">Open full users list in a dedicated page.</p>
                    </Link>
                    <Link
                        href={roomsList()}
                        className="rounded-xl border border-sidebar-border/70 bg-white p-5 transition hover:border-primary/40 hover:bg-primary/5 dark:border-sidebar-border dark:bg-sidebar"
                    >
                        <p className="text-sm font-semibold">Rooms Page</p>
                        <p className="mt-1 text-sm text-muted-foreground">Open full rooms list in a dedicated page.</p>
                    </Link>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <h2 className="text-lg font-semibold">Tenant Registration Approvals</h2>
                    <p className="mt-2 text-sm text-muted-foreground">New tenant users can browse rooms but cannot book until approved here.</p>

                    {pendingTenantUsers.length > 0 ? (
                        <div className="mt-5 overflow-x-auto">
                            <table className="w-full min-w-[640px] table-auto border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-sidebar-border/70 text-xs uppercase tracking-wide text-muted-foreground dark:border-sidebar-border">
                                        <th className="px-3 py-3">Tenant</th>
                                        <th className="px-3 py-3">Email</th>
                                        <th className="px-3 py-3">Requested at</th>
                                        <th className="px-3 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingTenantUsers.map((tenantUser) => (
                                        <tr key={tenantUser.id} className="border-b border-sidebar-border/60 text-sm dark:border-sidebar-border/70">
                                            <td className="px-3 py-3 font-medium">
                                                <Link href={userShow(tenantUser.id)} className="text-primary hover:underline">
                                                    {tenantUser.name}
                                                </Link>
                                            </td>
                                            <td className="px-3 py-3 text-muted-foreground">{tenantUser.email}</td>
                                            <td className="px-3 py-3 text-xs text-muted-foreground">{tenantUser.createdAt ?? 'N/A'}</td>
                                            <td className="px-3 py-3 text-right">
                                                <Link
                                                    href={approveTenant(tenantUser.id)}
                                                    method="post"
                                                    as="button"
                                                    className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                                                >
                                                    Approve tenant
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-muted-foreground">No tenant accounts waiting for approval.</p>
                    )}
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <h2 className="text-lg font-semibold">All Booking Requests</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Approve tenant booking requests and review tenant, landlord, and room profiles before approving.</p>

                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[760px] table-auto border-collapse text-left">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 text-xs uppercase tracking-wide text-muted-foreground dark:border-sidebar-border">
                                    <th className="px-3 py-3">Room</th>
                                    <th className="px-3 py-3">Tenant</th>
                                    <th className="px-3 py-3">Landlord</th>
                                    <th className="px-3 py-3">Dates</th>
                                    <th className="px-3 py-3">Status</th>
                                    <th className="px-3 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookingRequests.map((request) => (
                                    <tr key={request.id} className="border-b border-sidebar-border/60 text-sm dark:border-sidebar-border/70">
                                        <td className="px-3 py-3 align-top">
                                            <Link href={roomShow(request.room.id)} className="font-semibold text-primary hover:underline">
                                                {request.room.title}
                                            </Link>
                                            <p className="text-xs text-muted-foreground">{request.room.city}</p>
                                        </td>
                                        <td className="px-3 py-3 align-top">
                                            <Link href={userShow(request.tenant.id)} className="font-medium text-primary hover:underline">
                                                {request.tenant.name}
                                            </Link>
                                            <p className="text-xs text-muted-foreground">{request.tenant.email}</p>
                                        </td>
                                        <td className="px-3 py-3 align-top">
                                            <Link href={userShow(request.landlord.id)} className="font-medium text-primary hover:underline">
                                                {request.landlord.name}
                                            </Link>
                                            <p className="text-xs text-muted-foreground">{request.landlord.email}</p>
                                        </td>
                                        <td className="px-3 py-3 align-top text-xs text-muted-foreground">
                                            {request.startsAt} to {request.endsAt}
                                        </td>
                                        <td className="px-3 py-3 align-top">
                                            <span className="rounded-full border border-sidebar-border/70 px-2.5 py-1 text-xs font-semibold capitalize dark:border-sidebar-border">
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-right align-top">
                                            {request.status === 'pending' ? (
                                                <Link
                                                    href={approve(request.id)}
                                                    method="post"
                                                    as="button"
                                                    className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                                                >
                                                    Approve
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Processed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
