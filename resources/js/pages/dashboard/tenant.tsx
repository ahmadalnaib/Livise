import { Head, Link } from '@inertiajs/react';
import { CalendarClock, Eye, HousePlus, PencilLine } from 'lucide-react';
import { edit as editListing, show as showListing } from '@/actions/App/Http/Controllers/LandlordListingController';
import { landlord } from '@/routes/dashboard';

type Listing = {
    id: number;
    status: string | null;
    title: string;
    listing_type: string | null;
    city: string | null;
    address_line_1: string | null;
    postal_code: string | null;
    price_per_night: string | null;
    price_period: string | null;
    image_count: number;
    facilities: string[];
};

type Props = {
    activeFilter: 'all' | 'pending' | 'confirmed' | 'requests';
    stats: {
        publishedRooms: number;
        pendingListings: number;
        confirmedListings: number;
        estimatedRevenue: number;
        withPhotos: number;
    };
    listings: Listing[];
};

export default function TenantDashboard({ activeFilter, stats, listings }: Props) {
    const listingsTitle =
        activeFilter === 'pending'
            ? 'Pending listings'
            : activeFilter === 'confirmed'
              ? 'Confirmed listings'
              : activeFilter === 'requests'
                ? 'Tenant requests'
                : 'Created listings';

    const listingsDescription =
        activeFilter === 'pending'
            ? 'Listings waiting for admin verification.'
            : activeFilter === 'confirmed'
              ? 'Listings already verified by admin.'
              : activeFilter === 'requests'
                ? 'Review incoming tenant interest and booking activity here.'
                : 'Open any saved listing to review the details and edit it.';

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
                        <CalendarClock className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Listings with photos</p>
                        <p className="text-2xl font-semibold">{stats.withPhotos}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <PencilLine className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Combined price baseline</p>
                        <p className="text-2xl font-semibold">€{Math.round(stats.estimatedRevenue)}</p>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold">{listingsTitle}</h2>
                            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{listingsDescription}</p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                        {listings.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-sidebar-border/80 p-8 text-center text-sm text-muted-foreground dark:border-sidebar-border">
                                {activeFilter === 'pending'
                                    ? 'No pending listings right now.'
                                    : activeFilter === 'confirmed'
                                      ? 'No confirmed listings yet.'
                                      : activeFilter === 'requests'
                                        ? 'No tenant requests yet.'
                                        : 'No listings created yet. Start your first listing from the sidebar.'}
                            </div>
                        ) : (
                            listings.map((listing) => (
                                <article key={listing.id} className="rounded-2xl border border-sidebar-border/70 p-5 dark:border-sidebar-border">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    {listing.listing_type === 'apartment' ? 'Apartment' : 'Room'}
                                                </p>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                                                        listing.status === 'confirmed'
                                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
                                                    }`}
                                                >
                                                    {listing.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                                </span>
                                            </div>
                                            <h3 className="mt-2 text-lg font-semibold">{listing.title}</h3>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {[listing.address_line_1, listing.city, listing.postal_code].filter(Boolean).join(', ')}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="rounded-full border border-sidebar-border/70 px-3 py-1 text-xs font-medium dark:border-sidebar-border">
                                                {listing.image_count} photo{listing.image_count === 1 ? '' : 's'}
                                            </span>
                                            <Link
                                                href={editListing(listing.id)}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-sidebar-border/70 transition hover:bg-accent dark:border-sidebar-border"
                                                aria-label={`Edit ${listing.title}`}
                                            >
                                                <PencilLine className="size-4" />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                                        {listing.price_per_night ? (
                                            <span className="rounded-full border border-sidebar-border/70 px-3 py-1 dark:border-sidebar-border">
                                                €{listing.price_per_night}/{listing.price_period === 'month' ? 'month' : 'night'}
                                            </span>
                                        ) : null}
                                        {listing.facilities.slice(0, 3).map((facility) => (
                                            <span key={facility} className="rounded-full border border-sidebar-border/70 px-3 py-1 dark:border-sidebar-border">
                                                {facility.replaceAll('_', ' ')}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-5">
                                        <Link
                                            href={showListing(listing.id)}
                                            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                                        >
                                            <Eye className="size-4" />
                                            View
                                        </Link>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
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
