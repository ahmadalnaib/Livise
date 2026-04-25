import { Head, Link } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { edit as editListing } from '@/actions/App/Http/Controllers/LandlordListingController';
import { Button } from '@/components/ui/button';
import { landlord } from '@/routes/dashboard';
import { ArrowLeft, PencilLine } from 'lucide-react';

type Listing = {
    id: number;
    status: string;
    title: string;
    description: string;
    city_id: string;
    city?: string | null;
    address_line_1: string;
    address_line_2: string | null;
    postal_code: string;
    price_per_night: string;
    price_period: string;
    listing_type: string;
    size_label: string;
    facilities: string[];
    images: Array<{
        id: number;
        url: string;
    }>;
};

type Rating = {
    id: number;
    rater_name: string;
    rating: number;
    comment: string | null;
    type: string;
    created_at: string;
};

type Props = {
    listing: Listing;
    landlordRating?: {
        averageRating: number;
        totalRatings: number;
    };
    ratingsReceived?: Rating[];
};

export default function LandlordListingShow({ listing, landlordRating, ratingsReceived = [] }: Props) {
    return (
        <>
            <Head title={listing.title} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Listing overview</p>
                            <h1 className="mt-1 text-2xl font-semibold">{listing.title}</h1>
                            <div className="mt-3">
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${listing.status === 'confirmed'
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
                                        }`}
                                >
                                    {listing.status === 'confirmed' ? 'Confirmed listing' : 'Pending listing'}
                                </span>
                            </div>
                            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{listing.description}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button type="button" variant="outline" asChild>
                                <Link href={landlord()} className="inline-flex items-center gap-2">
                                    <ArrowLeft className="size-4" />
                                    Back to dashboard
                                </Link>
                            </Button>

                            <Button type="button" asChild>
                                <Link href={editListing(listing.id)} className="inline-flex items-center gap-2">
                                    <PencilLine className="size-4" />
                                    Edit listing
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {listing.images.map((image) => (
                            <div key={image.id} className="overflow-hidden rounded-2xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <img src={image.url} alt={listing.title} className="h-52 w-full object-cover" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-sidebar-border/70 p-5 dark:border-sidebar-border">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Location</h2>
                            <p className="mt-3 text-base font-medium">{listing.address_line_1}</p>
                            {listing.address_line_2 ? <p className="mt-1 text-sm text-muted-foreground">{listing.address_line_2}</p> : null}
                            <p className="mt-1 text-sm text-muted-foreground">
                                {[listing.city, listing.postal_code].filter(Boolean).join(', ')}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-sidebar-border/70 p-5 dark:border-sidebar-border">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Pricing and type</h2>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full border border-sidebar-border/70 px-3 py-1 text-sm font-medium dark:border-sidebar-border">
                                    €{listing.price_per_night}/{listing.price_period === 'month' ? 'month' : 'night'}
                                </span>
                                <span className="rounded-full border border-sidebar-border/70 px-3 py-1 text-sm font-medium capitalize dark:border-sidebar-border">
                                    {listing.listing_type}
                                </span>
                                <span className="rounded-full border border-sidebar-border/70 px-3 py-1 text-sm font-medium dark:border-sidebar-border">
                                    {listing.size_label}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-sidebar-border/70 p-5 dark:border-sidebar-border">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Facilities</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {listing.facilities.map((facility) => (
                                <span key={facility} className="rounded-full border border-sidebar-border/70 px-3 py-1 text-sm capitalize dark:border-sidebar-border">
                                    {facility.replaceAll('_', ' ')}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Landlord Ratings Section */}
                    {landlordRating && landlordRating.totalRatings > 0 && (
                        <div className="mt-6 rounded-2xl border border-sidebar-border/70 p-5 dark:border-sidebar-border">
                            <div className="flex items-center gap-3">
                                <Star className="size-6 text-yellow-500" />
                                <div>
                                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Your Rating</h2>
                                    <p className="text-2xl font-bold">
                                        {landlordRating.averageRating} / 5
                                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                                            ({landlordRating.totalRatings} review{landlordRating.totalRatings !== 1 ? 's' : ''})
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {ratingsReceived.length > 0 && (
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
                                            {rating.comment && (
                                                <p className="mt-2 text-sm text-muted-foreground">{rating.comment}</p>
                                            )}
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                {new Date(rating.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

LandlordListingShow.layout = {
    breadcrumbs: [
        {
            title: 'Landlord Dashboard',
            href: landlord(),
        },
        {
            title: 'View Listing',
            href: '#',
        },
    ],
};
