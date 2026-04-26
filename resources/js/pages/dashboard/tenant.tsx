import { Head, Link, useForm } from '@inertiajs/react';
import { CalendarClock, Eye, Home, HousePlus, PencilLine, Star, X } from 'lucide-react';
import { useState } from 'react';
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

type Rating = {
    id: number;
    rater_name: string;
    rating: number;
    comment: string | null;
    type: string;
    created_at: string;
};

type Tenant = {
    id: number;
    name: string;
    already_rated: boolean;
};

type Props = {
    activeFilter: 'all' | 'pending' | 'confirmed' | 'requests';
    stats: {
        publishedRooms: number;
        pendingListings: number;
        confirmedListings: number;
        estimatedRevenue: number;
        withPhotos: number;
        averageRating?: number;
        totalRatings?: number;
    };
    listings: Listing[];
    ratingsReceived?: Rating[];
    recentTenants?: Tenant[];
};

export default function TenantDashboard({ activeFilter, stats, listings, ratingsReceived = [], recentTenants = [] }: Props) {
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [showRatingViewModal, setShowRatingViewModal] = useState(false);
    const ratingForm = useForm({
        rated_id: 0,
        rating: 5,
        comment: '',
        type: 'landlord_to_tenant' as const,
    });

    const handleOpenRatingModal = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        ratingForm.setData('rated_id', tenant.id);
        setShowRatingModal(true);
    };

    const handleSubmitRating = (e: React.FormEvent) => {
        e.preventDefault();
        ratingForm.post('/dashboard/ratings', {
            onSuccess: () => {
                setShowRatingModal(false);
                setSelectedTenant(null);
                ratingForm.reset();
            },
        });
    };

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

            {/* Rating Modal for Tenants */}
            {showRatingModal && selectedTenant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowRatingModal(false)} />
                    <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 dark:bg-stone-900 shadow-2xl">
                        <button
                            onClick={() => setShowRatingModal(false)}
                            className="absolute right-4 top-4 rounded-full p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                            <X className="size-5" />
                        </button>
                        <h3 className="text-lg font-semibold">Rate {selectedTenant.name}</h3>
                        <form onSubmit={handleSubmitRating} className="mt-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => ratingForm.setData('rating', star)}
                                            className="p-1"
                                        >
                                            <Star
                                                className={`size-8 ${star <= ratingForm.data.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-stone-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Comment (optional)</label>
                                <textarea
                                    value={ratingForm.data.comment}
                                    onChange={(e) => ratingForm.setData('comment', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-600 dark:bg-stone-800"
                                    placeholder="Share your experience..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={ratingForm.processing}
                                    className="flex-1 rounded-xl bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    {ratingForm.processing ? 'Submitting...' : 'Submit Rating'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Ratings Modal */}
            {showRatingViewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowRatingViewModal(false)} />
                    <div className="relative z-10 w-full max-w-lg max-h-[70vh] overflow-y-auto rounded-2xl bg-white p-5 dark:bg-stone-900 shadow-2xl">
                        <button
                            onClick={() => setShowRatingViewModal(false)}
                            className="absolute right-4 top-4 rounded-full p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                            <X className="size-5" />
                        </button>
                        <h3 className="text-lg font-semibold">Your Ratings</h3>
                        {ratingsReceived.length === 0 ? (
                            <p className="mt-4 text-sm text-muted-foreground">No ratings yet.</p>
                        ) : (
                            <div className="mt-4 space-y-3">
                                {ratingsReceived.map((rating) => (
                                    <div key={rating.id} className="rounded-xl border border-stone-200 p-3 dark:border-stone-700">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{rating.rater_name}</span>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`size-4 ${star <= rating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-stone-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {rating.comment && <p className="mt-2 text-sm text-muted-foreground">{rating.comment}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-4">
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
                    {stats.averageRating !== undefined && (
                        <button
                            onClick={() => setShowRatingViewModal(true)}
                            className="rounded-xl border border-sidebar-border/70 bg-white p-4 text-left transition hover:border-green-500 dark:border-sidebar-border dark:bg-sidebar"
                        >
                            <Star className="mb-2 size-5 text-yellow-500" />
                            <p className="text-xs text-muted-foreground">Average Rating</p>
                            <p className="text-2xl font-semibold">
                                {stats.averageRating > 0 ? stats.averageRating : 'No ratings'}
                            </p>
                            {stats.totalRatings !== undefined && stats.totalRatings > 0 && (
                                <p className="text-xs text-green-600">{stats.totalRatings} review{stats.totalRatings !== 1 ? 's' : ''}</p>
                            )}
                        </button>
                    )}
                </div>

                {/* Rate Tenants Section */}
                {recentTenants.length > 0 && (
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <h3 className="font-semibold">Rate Your Tenants</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Rate tenants you've worked with</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {recentTenants.map((tenant) => (
                                <button
                                    key={tenant.id}
                                    onClick={() => !tenant.already_rated && handleOpenRatingModal(tenant)}
                                    disabled={tenant.already_rated}
                                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${tenant.already_rated
                                        ? 'bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                        }`}
                                >
                                    <Star className="size-4" />
                                    {tenant.name}
                                    {tenant.already_rated && <span className="text-xs">(Rated)</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

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
                                    {listing.image && (
                                        <img src={listing.image} alt={listing.title} className="mb-4 h-40 w-full rounded-xl object-cover" />
                                    )}
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                    {listing.listing_type === 'apartment' ? 'Apartment' : 'Room'}
                                                </p>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${listing.status === 'confirmed'
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
