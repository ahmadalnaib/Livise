import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BedDouble, Star, X } from 'lucide-react';
import { useState } from 'react';
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
    landlordId: number;
    landlordName: string;
    landlordAlreadyRated: boolean;
};

type Rating = {
    id: number;
    rater_name: string;
    rating: number;
    comment: string | null;
    type: string;
    created_at: string;
};

type PageProps = {
    rentedRooms: RentedRoom[];
    ratingsReceived?: Rating[];
    averageRating?: number;
    totalRatings?: number;
};

export default function SeekerRentedRoomsPage() {
    const { rentedRooms, ratingsReceived = [], averageRating = 0, totalRatings = 0 } = usePage<PageProps>().props;
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedLandlord, setSelectedLandlord] = useState<{ id: number; name: string } | null>(null);
    const [showRatingViewModal, setShowRatingViewModal] = useState(false);
    const ratingForm = useForm({
        rated_id: 0,
        rating: 5,
        comment: '',
        type: 'tenant_to_landlord' as const,
    });

    const handleOpenRatingModal = (room: RentedRoom) => {
        setSelectedLandlord({ id: room.landlordId, name: room.landlordName });
        ratingForm.setData('rated_id', room.landlordId);
        setShowRatingModal(true);
    };

    const handleSubmitRating = (e: React.FormEvent) => {
        e.preventDefault();
        ratingForm.post('/dashboard/ratings', {
            onSuccess: () => {
                setShowRatingModal(false);
                setSelectedLandlord(null);
                ratingForm.reset();
            },
        });
    };

    return (
        <>
            <Head title="My Rented Rooms" />

            {/* Rating Modal for Landlord */}
            {showRatingModal && selectedLandlord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowRatingModal(false)} />
                    <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 dark:bg-stone-900 shadow-2xl">
                        <button
                            onClick={() => setShowRatingModal(false)}
                            className="absolute right-4 top-4 rounded-full p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                            <X className="size-5" />
                        </button>
                        <h3 className="text-lg font-semibold">Rate {selectedLandlord.name}</h3>
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
                {/* Rating Stats */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                        <div className="flex items-center gap-2">
                            <BedDouble className="size-5 text-primary" />
                            <h2 className="text-lg font-semibold">My Rented Rooms</h2>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            All rooms currently booked under your tenant account.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowRatingViewModal(true)}
                        className="rounded-xl border border-sidebar-border/70 bg-white p-6 text-left transition hover:border-green-500 dark:border-sidebar-border dark:bg-sidebar"
                    >
                        <div className="flex items-center gap-2">
                            <Star className="size-5 text-yellow-500" />
                            <h2 className="text-lg font-semibold">Your Rating</h2>
                        </div>
                        <p className="mt-2 text-3xl font-bold">
                            {averageRating > 0 ? averageRating : 'No ratings'}
                        </p>
                        {totalRatings > 0 && (
                            <p className="text-sm text-green-600">{totalRatings} review{totalRatings !== 1 ? 's' : ''} from landlords</p>
                        )}
                    </button>
                </div>

                {/* Rate Landlords Section */}
                {rentedRooms.some((room) => !room.landlordAlreadyRated) && (
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <h3 className="font-semibold">Rate Your Landlords</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Rate landlords you've rented from</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {rentedRooms
                                .filter((room) => !room.landlordAlreadyRated)
                                .map((room) => (
                                    <button
                                        key={room.landlordId}
                                        onClick={() => handleOpenRatingModal(room)}
                                        className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-sm text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                                    >
                                        <Star className="size-4" />
                                        {room.landlordName}
                                    </button>
                                ))}
                        </div>
                    </div>
                )}

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
