import { Head } from '@inertiajs/react';
import { HousePlus, Wallet, CalendarClock } from 'lucide-react';
import { landlord } from '@/routes/dashboard';

type ApprovedBooking = {
    id: number;
    startsAt: string;
    endsAt: string;
    approvedAt: string | null;
    roomTitle: string;
    roomCity: string;
    tenantName: string;
    tenantEmail: string;
};

type TenantDashboardProps = {
    stats?: {
        publishedRooms: number;
        approvedBookings: number;
        upcomingCheckIns: number;
    };
    approvedBookings?: ApprovedBooking[];
};

export default function TenantDashboard({
    stats = {
        publishedRooms: 0,
        approvedBookings: 0,
        upcomingCheckIns: 0,
    },
    approvedBookings = [],
}: TenantDashboardProps) {
    return (
        <>
            <Head title="Landlord Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <HousePlus className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Published rooms</p>
                        <p className="text-2xl font-semibold">{stats.publishedRooms}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <Wallet className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Approved bookings</p>
                        <p className="text-2xl font-semibold">{stats.approvedBookings}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <CalendarClock className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Upcoming check-ins</p>
                        <p className="text-2xl font-semibold">{stats.upcomingCheckIns}</p>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <h2 className="text-lg font-semibold">Approved booking requests</h2>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">When admin approves tenant requests, they appear here with full details.</p>

                    {approvedBookings.length > 0 ? (
                        <div className="mt-5 overflow-x-auto">
                            <table className="w-full min-w-[700px] table-auto border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-sidebar-border/70 text-xs uppercase tracking-wide text-muted-foreground dark:border-sidebar-border">
                                        <th className="px-3 py-3">Room</th>
                                        <th className="px-3 py-3">Tenant</th>
                                        <th className="px-3 py-3">Booking dates</th>
                                        <th className="px-3 py-3">Approved at</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {approvedBookings.map((booking) => (
                                        <tr key={booking.id} className="border-b border-sidebar-border/60 text-sm dark:border-sidebar-border/70">
                                            <td className="px-3 py-3 align-top">
                                                <p className="font-semibold">{booking.roomTitle}</p>
                                                <p className="text-xs text-muted-foreground">{booking.roomCity}</p>
                                            </td>
                                            <td className="px-3 py-3 align-top">
                                                <p className="font-medium">{booking.tenantName}</p>
                                                <p className="text-xs text-muted-foreground">{booking.tenantEmail}</p>
                                            </td>
                                            <td className="px-3 py-3 align-top text-xs text-muted-foreground">
                                                {booking.startsAt} to {booking.endsAt}
                                            </td>
                                            <td className="px-3 py-3 align-top text-xs text-muted-foreground">
                                                {booking.approvedAt ?? 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-muted-foreground">No approved booking requests yet.</p>
                    )}
                </div>
            </div>
        </>
    );
}

TenantDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Landlord Dashboard',
            href: landlord(),
        },
    ],
};
