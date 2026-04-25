import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Star } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

type Rating = {
    id: number;
    rater_name?: string;
    rated_name?: string;
    rating: number;
    comment: string | null;
    type: string;
    created_at: string;
};

export default function Profile({
    mustVerifyEmail,
    status,
    averageRating = 0,
    totalRatings = 0,
    ratingsReceived = [],
    ratingsGiven = [],
}: {
    mustVerifyEmail: boolean;
    status?: string;
    averageRating?: number;
    totalRatings?: number;
    ratingsReceived?: Rating[];
    ratingsGiven?: Rating[];
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile information"
                    description="Update your name and email address"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Click here to resend the
                                                verification email.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has been
                                                    sent to your email address.
                                                </div>
                                            )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                {/* Ratings Section */}
                <div className="mt-8 border-t pt-6">
                    <Heading
                        variant="small"
                        title="Your Ratings"
                        description={`Average: ${averageRating > 0 ? averageRating : 'No ratings'} (${totalRatings} review${totalRatings !== 1 ? 's' : ''})`}
                    />

                    {totalRatings > 0 && (
                        <div className="mt-4 space-y-3">
                            <h4 className="font-medium">Reviews about you</h4>
                            {ratingsReceived.map((rating) => (
                                <div
                                    key={rating.id}
                                    className="rounded-xl border border-stone-200 p-4 dark:border-stone-700"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{rating.rater_name}</span>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`size-4 ${star <= rating.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-stone-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {rating.comment && (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {rating.comment}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        {new Date(rating.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {ratingsGiven.length > 0 && (
                        <div className="mt-6 space-y-3">
                            <h4 className="font-medium">Reviews you've given</h4>
                            {ratingsGiven.map((rating) => (
                                <div
                                    key={rating.id}
                                    className="rounded-xl border border-stone-200 p-4 dark:border-stone-700"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">To: {rating.rated_name}</span>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`size-4 ${star <= rating.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-stone-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {rating.comment && (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {rating.comment}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        {new Date(rating.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {totalRatings === 0 && ratingsGiven.length === 0 && (
                        <p className="mt-4 text-sm text-muted-foreground">
                            No ratings yet.
                        </p>
                    )}
                </div>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
