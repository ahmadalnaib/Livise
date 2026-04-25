import { Head, Link, usePage } from '@inertiajs/react';
import { ShieldCheck, Users, Building2, ChartNoAxesCombined } from 'lucide-react';
import { admin } from '@/routes/dashboard';
import { approve } from '@/routes/dashboard/admin/bookings';

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
    };
    bookingRequests: BookingRequest[];
};

export default function AdminDashboard() {
    const { stats, bookingRequests } = usePage<PageProps>().props;

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
                        <p className="text-xs text-muted-foreground">Pending requests</p>
                        <p className="text-2xl font-semibold">{stats.pendingRequests}</p>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <h2 className="text-lg font-semibold">All Booking Requests</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Approve tenant booking requests and notify landlords with approved booking details.</p>

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
                                            <p className="font-semibold">{request.room.title}</p>
                                            <p className="text-xs text-muted-foreground">{request.room.city}</p>
                                        </td>
                                        <td className="px-3 py-3 align-top">
                                            <p className="font-medium">{request.tenant.name}</p>
                                            <p className="text-xs text-muted-foreground">{request.tenant.email}</p>
                                        </td>
                                        <td className="px-3 py-3 align-top">
                                            <p className="font-medium">{request.landlord.name}</p>
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
