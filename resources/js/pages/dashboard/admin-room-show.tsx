import { Head, Link } from '@inertiajs/react';
import { admin } from '@/routes/dashboard';
import { list as roomsList } from '@/routes/dashboard/admin/rooms';
import { show as userShow } from '@/routes/dashboard/admin/users';

type RoomProfile = {
    id: number;
    title: string;
    description: string;
    city: string;
    landlord: {
        id: number | null;
        name: string;
        email: string;
    };
    pricePerNight: string;
    status: string;
};

type RentalRow = {
    id: number;
    renterId: number | null;
    renterName: string;
    renterEmail: string;
    startsAt: string;
    endsAt: string;
};

type BookingRequestRow = {
    id: number;
    status: string;
    tenantId: number | null;
    tenantName: string;
    tenantEmail: string;
    startsAt: string;
    endsAt: string;
};

type PageProps = {
    room: RoomProfile;
    rentals: RentalRow[];
    bookingRequests: BookingRequestRow[];
};

export default function AdminRoomShowPage({ room, rentals, bookingRequests }: PageProps) {
    return (
        <>
            <Head title={`Admin Room ${room.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <h2 className="text-lg font-semibold">Room Profile</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Room details used during booking approval checks.</p>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Title</p>
                            <p className="mt-1 text-sm font-semibold">{room.title}</p>
                        </div>
                        <div className="rounded-lg border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">City</p>
                            <p className="mt-1 text-sm font-semibold">{room.city}</p>
                        </div>
                        <div className="rounded-lg border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Price per night</p>
                            <p className="mt-1 text-sm font-semibold">{room.pricePerNight}</p>
                        </div>
                        <div className="rounded-lg border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
                            <p className="mt-1 text-sm font-semibold capitalize">{room.status}</p>
                        </div>
                        <div className="rounded-lg border border-sidebar-border/70 p-4 dark:border-sidebar-border md:col-span-2">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Landlord</p>
                            {room.landlord.id ? (
                                <Link href={userShow(room.landlord.id)} className="mt-1 inline-block text-sm font-semibold text-primary hover:underline">
                                    {room.landlord.name}
                                </Link>
                            ) : (
                                <p className="mt-1 text-sm font-semibold">{room.landlord.name}</p>
                            )}
                            <p className="text-xs text-muted-foreground">{room.landlord.email}</p>
                        </div>
                        <div className="rounded-lg border border-sidebar-border/70 p-4 dark:border-sidebar-border md:col-span-2">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Description</p>
                            <p className="mt-1 text-sm">{room.description}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <h3 className="text-base font-semibold">Rentals</h3>
                    {rentals.length > 0 ? (
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[640px] table-auto border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-sidebar-border/70 text-xs uppercase tracking-wide text-muted-foreground dark:border-sidebar-border">
                                        <th className="px-3 py-3">Renter</th>
                                        <th className="px-3 py-3">Email</th>
                                        <th className="px-3 py-3">Dates</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rentals.map((rental) => (
                                        <tr key={rental.id} className="border-b border-sidebar-border/60 text-sm dark:border-sidebar-border/70">
                                            <td className="px-3 py-3">
                                                {rental.renterId ? (
                                                    <Link href={userShow(rental.renterId)} className="hover:underline">
                                                        {rental.renterName}
                                                    </Link>
                                                ) : (
                                                    <span>{rental.renterName}</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-3 text-muted-foreground">{rental.renterEmail}</td>
                                            <td className="px-3 py-3 text-xs text-muted-foreground">
                                                {rental.startsAt} to {rental.endsAt}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-muted-foreground">No rentals recorded for this room.</p>
                    )}
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <h3 className="text-base font-semibold">Booking Requests</h3>
                    {bookingRequests.length > 0 ? (
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[640px] table-auto border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-sidebar-border/70 text-xs uppercase tracking-wide text-muted-foreground dark:border-sidebar-border">
                                        <th className="px-3 py-3">Tenant</th>
                                        <th className="px-3 py-3">Status</th>
                                        <th className="px-3 py-3">Dates</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookingRequests.map((bookingRequest) => (
                                        <tr key={bookingRequest.id} className="border-b border-sidebar-border/60 text-sm dark:border-sidebar-border/70">
                                            <td className="px-3 py-3">
                                                {bookingRequest.tenantId ? (
                                                    <Link href={userShow(bookingRequest.tenantId)} className="hover:underline">
                                                        {bookingRequest.tenantName}
                                                    </Link>
                                                ) : (
                                                    <p>{bookingRequest.tenantName}</p>
                                                )}
                                                <p className="text-xs text-muted-foreground">{bookingRequest.tenantEmail}</p>
                                            </td>
                                            <td className="px-3 py-3 capitalize">{bookingRequest.status}</td>
                                            <td className="px-3 py-3 text-xs text-muted-foreground">
                                                {bookingRequest.startsAt} to {bookingRequest.endsAt}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-muted-foreground">No booking requests for this room yet.</p>
                    )}
                </div>

                <div>
                    <Link href={roomsList()} className="text-sm text-primary hover:underline">
                        Back to rooms list
                    </Link>
                </div>
            </div>
        </>
    );
}

AdminRoomShowPage.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: admin(),
        },
        {
            title: 'Rooms',
            href: roomsList(),
        },
        {
            title: 'Room Profile',
            href: roomsList(),
        },
    ],
};
