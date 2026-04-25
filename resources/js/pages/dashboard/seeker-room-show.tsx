import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CalendarDays, ChevronLeft, MapPinned, ShieldCheck, UserRound } from 'lucide-react';
import { tenant } from '@/routes/dashboard';

type BookedRange = {
    id: number;
    startsAt: string;
    endsAt: string;
    renterName: string;
};

type CurrentUserRental = {
    startsAt: string;
    endsAt: string;
};

type CurrentUserPendingRequest = {
    startsAt: string;
    endsAt: string;
};

type RoomDetails = {
    id: number;
    title: string;
    description: string;
    city: string;
    ownerName: string;
    pricePerNight: string;
    image: string;
    tags: string[];
};

type PageProps = {
    room: RoomDetails;
    bookedRanges: BookedRange[];
    currentUserRental: CurrentUserRental | null;
    currentUserPendingRequest: CurrentUserPendingRequest | null;
    canRent: boolean;
};

function addDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);

    return date.toISOString().slice(0, 10);
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));
}

export default function SeekerRoomShow() {
    const { room, bookedRanges, currentUserRental, currentUserPendingRequest, canRent } = usePage<PageProps>().props;
    const form = useForm({
        starts_at: addDays(2),
        ends_at: addDays(7),
    });

    const submit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        form.post(tenant.rooms.rent.store(room.id), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={room.title} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href={tenant.url()}
                        className="inline-flex items-center gap-2 rounded-full border border-sidebar-border/70 px-4 py-2 text-sm font-medium transition hover:border-primary/40 hover:bg-primary/5 dark:border-sidebar-border"
                    >
                        <ChevronLeft className="size-4" />
                        Back to matches
                    </Link>
                    <p className="text-sm text-muted-foreground">Room details and booking</p>
                </div>

                <div className="overflow-hidden rounded-4xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-sidebar">
                    <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="relative min-h-80">
                            <img src={room.image} alt={room.title} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Selected Room</p>
                                <h1 className="mt-3 max-w-xl text-3xl font-semibold leading-tight">{room.title}</h1>
                                <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/85">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5">
                                        <MapPinned className="size-4" />
                                        {room.city}
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5">
                                        <UserRound className="size-4" />
                                        {room.ownerName}
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5">
                                        <CalendarDays className="size-4" />
                                        {room.pricePerNight} / night
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between p-8">
                            <div>
                                <p className="text-sm leading-7 text-muted-foreground">{room.description}</p>

                                <div className="mt-6 flex flex-wrap gap-2">
                                    {room.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full border border-sidebar-border/70 px-3 py-1 text-xs font-medium dark:border-sidebar-border"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {currentUserRental ? (
                                    <div className="mt-6 rounded-2xl border border-emerald-300/50 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                            You already booked this room.
                                        </p>
                                        <p className="mt-1 text-sm text-emerald-700/80 dark:text-emerald-300/80">
                                            {formatDate(currentUserRental.startsAt)} to {formatDate(currentUserRental.endsAt)}
                                        </p>
                                    </div>
                                ) : null}

                                {currentUserPendingRequest ? (
                                    <div className="mt-6 rounded-2xl border border-blue-300/50 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
                                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                            Booking request sent to admin.
                                        </p>
                                        <p className="mt-1 text-sm text-blue-700/80 dark:text-blue-300/80">
                                            Pending approval for {formatDate(currentUserPendingRequest.startsAt)} to {formatDate(currentUserPendingRequest.endsAt)}.
                                        </p>
                                    </div>
                                ) : null}

                                {!canRent ? (
                                    <div className="mt-6 rounded-2xl border border-amber-300/50 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
                                        <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                                            You cannot rent your own room listing.
                                        </p>
                                    </div>
                                ) : null}
                            </div>

                            <form onSubmit={submit} className="mt-8 rounded-3xl border border-sidebar-border/70 bg-black/2 p-5 dark:border-sidebar-border dark:bg-white/3">
                                <div className="flex items-center gap-2 text-sm font-semibold">
                                    <ShieldCheck className="size-4 text-primary" />
                                    Send booking request
                                </div>

                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                    <label className="grid gap-2 text-sm font-medium">
                                        Start date
                                        <input
                                            type="date"
                                            value={form.data.starts_at}
                                            onChange={(event) => form.setData('starts_at', event.target.value)}
                                            className="h-11 rounded-xl border border-sidebar-border/70 bg-white px-3 text-sm dark:border-sidebar-border dark:bg-sidebar"
                                        />
                                        {form.errors.starts_at ? (
                                            <span className="text-xs text-red-600 dark:text-red-300">{form.errors.starts_at}</span>
                                        ) : null}
                                    </label>

                                    <label className="grid gap-2 text-sm font-medium">
                                        End date
                                        <input
                                            type="date"
                                            value={form.data.ends_at}
                                            onChange={(event) => form.setData('ends_at', event.target.value)}
                                            className="h-11 rounded-xl border border-sidebar-border/70 bg-white px-3 text-sm dark:border-sidebar-border dark:bg-sidebar"
                                        />
                                        {form.errors.ends_at ? (
                                            <span className="text-xs text-red-600 dark:text-red-300">{form.errors.ends_at}</span>
                                        ) : null}
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={form.processing || !canRent}
                                    className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {form.processing ? 'Sending request...' : 'Send request to admin'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="rounded-4xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold">Booked dates</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Check the current reservations before selecting your stay window.
                            </p>
                        </div>
                    </div>

                    {bookedRanges.length > 0 ? (
                        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {bookedRanges.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="rounded-2xl border border-sidebar-border/70 p-4 dark:border-sidebar-border"
                                >
                                    <p className="text-sm font-semibold">{booking.renterName}</p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {formatDate(booking.startsAt)} to {formatDate(booking.endsAt)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-5 text-sm text-muted-foreground">
                            No bookings yet. This room is fully available right now.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

SeekerRoomShow.layout = {
    breadcrumbs: [
        {
            title: 'Tenant Dashboard',
            href: tenant(),
        },
        {
            title: 'Room Details',
            href: tenant(),
        },
    ],
};
