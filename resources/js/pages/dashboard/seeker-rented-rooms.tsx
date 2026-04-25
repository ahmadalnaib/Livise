import { Head, Link, usePage } from '@inertiajs/react';
import { BedDouble } from 'lucide-react';
import { tenant } from '@/routes/dashboard';
import tenantRoutes from '@/routes/dashboard/tenant';

type RentedRoom = {
    rentalId: number;
    id: number;
    title: string;
    city: string;
    pricePerNight: string;
    image: string;
    startsAt: string;
    endsAt: string;
};

type PageProps = {
    rentedRooms: RentedRoom[];
};

export default function SeekerRentedRoomsPage() {
    const { rentedRooms } = usePage<PageProps>().props;

    return (
        <>
            <Head title="My Rented Rooms" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <div className="flex items-center gap-2">
                        <BedDouble className="size-5 text-primary" />
                        <h2 className="text-lg font-semibold">My Rented Rooms</h2>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                        All rooms currently booked under your tenant account.
                    </p>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    {rentedRooms.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {rentedRooms.map((room) => (
                                <article
                                    key={room.rentalId}
                                    className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-white shadow-sm dark:border-sidebar-border dark:bg-sidebar"
                                >
                                    <img src={room.image} alt={room.title} className="h-44 w-full object-cover" />

                                    <div className="space-y-3 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                    {room.city}
                                                </p>
                                                <h3 className="text-base font-semibold">{room.title}</h3>
                                            </div>
                                            <p className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                                {room.pricePerNight}
                                            </p>
                                        </div>

                                        <p className="text-xs text-muted-foreground">
                                            Rental period: {room.startsAt} to {room.endsAt}
                                        </p>

                                        <Link
                                            href={tenant.rooms.show.url(room.id)}
                                            className="inline-flex items-center justify-center rounded-lg border border-sidebar-border/70 px-3 py-2 text-sm font-semibold transition hover:border-primary/40 hover:bg-primary/5 dark:border-sidebar-border"
                                        >
                                            View details
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-sidebar-border/80 p-8 text-center dark:border-sidebar-border">
                            <h3 className="text-xl font-semibold">No rented rooms yet</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Once your booking requests are approved, your rented rooms will appear here.
                            </p>
                            <Link
                                href={tenant()}
                                className="mt-4 inline-flex items-center justify-center rounded-lg border border-sidebar-border/70 px-3 py-2 text-sm font-semibold transition hover:border-primary/40 hover:bg-primary/5 dark:border-sidebar-border"
                            >
                                Browse available rooms
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

SeekerRentedRoomsPage.layout = {
    breadcrumbs: [
        {
            title: 'Tenant Dashboard',
            href: tenant(),
        },
        {
            title: 'Rented Rooms',
            href: tenantRoutes.rentedRooms(),
        },
    ],
};
