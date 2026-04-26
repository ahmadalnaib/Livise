import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Star, Languages, Sparkles, Heart } from 'lucide-react';
import { useState } from 'react';
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
    languages = [],
    skills = [],
    hobbies = [],
    bio = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    averageRating?: number;
    totalRatings?: number;
    ratingsReceived?: Rating[];
    ratingsGiven?: Rating[];
    languages?: string[];
    skills?: string[];
    hobbies?: string[];
    bio?: string;
}) {
    const { auth } = usePage().props;
    const [languageInput, setLanguageInput] = useState(languages.join(', '));
    const [skillsInput, setSkillsInput] = useState(skills.join(', '));
    const [hobbiesInput, setHobbiesInput] = useState(hobbies.join(', '));

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

                            {/* Languages */}
                            <div className="grid gap-2 pt-4">
                                <Label htmlFor="languages" className="flex items-center gap-2">
                                    <Languages className="size-4" />
                                    Languages you speak
                                </Label>
                                <Input
                                    id="languages"
                                    className="mt-1 block w-full"
                                    value={languageInput}
                                    onChange={(e) => setLanguageInput(e.target.value)}
                                    name="languages"
                                    placeholder="e.g., English, German, Spanish"
                                />
                                <p className="text-xs text-muted-foreground">Separate multiple languages with commas</p>
                                <input type="hidden" name="languages" value={JSON.stringify(languageInput.split(',').map((s) => s.trim()).filter(Boolean))} />
                            </div>

                            {/* Skills */}
                            <div className="grid gap-2">
                                <Label htmlFor="skills" className="flex items-center gap-2">
                                    <Sparkles className="size-4" />
                                    Your skills
                                </Label>
                                <Input
                                    id="skills"
                                    className="mt-1 block w-full"
                                    value={skillsInput}
                                    onChange={(e) => setSkillsInput(e.target.value)}
                                    name="skills"
                                    placeholder="e.g., Cooking, Photography, Coding"
                                />
                                <p className="text-xs text-muted-foreground">Separate multiple skills with commas</p>
                                <input type="hidden" name="skills" value={JSON.stringify(skillsInput.split(',').map((s) => s.trim()).filter(Boolean))} />
                            </div>

                            {/* Hobbies */}
                            <div className="grid gap-2">
                                <Label htmlFor="hobbies" className="flex items-center gap-2">
                                    <Heart className="size-4" />
                                    Hobbies & interests
                                </Label>
                                <Input
                                    id="hobbies"
                                    className="mt-1 block w-full"
                                    value={hobbiesInput}
                                    onChange={(e) => setHobbiesInput(e.target.value)}
                                    name="hobbies"
                                    placeholder="e.g., Hiking, Gaming, Reading"
                                />
                                <p className="text-xs text-muted-foreground">Separate multiple hobbies with commas</p>
                                <input type="hidden" name="hobbies" value={JSON.stringify(hobbiesInput.split(',').map((s) => s.trim()).filter(Boolean))} />
                            </div>

                            {/* Bio */}
                            <div className="grid gap-2">
                                <Label htmlFor="bio">About you</Label>
                                <textarea
                                    id="bio"
                                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    name="bio"
                                    rows={4}
                                    defaultValue={bio}
                                    placeholder="Tell others a bit about yourself..."
                                />
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
