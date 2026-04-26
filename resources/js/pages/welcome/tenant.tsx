import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useEffectEvent, useId, useRef, useState } from 'react';
import { ArrowRight, BadgeDollarSign, Building2, CalendarCheck2, CheckCircle2, ImagePlus, UploadCloud, Users, X } from 'lucide-react';
import { store } from '@/actions/App/Http/Controllers/LandlordListingController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { dashboard, home, login, register } from '@/routes';
import AppLayout from '@/layouts/app-layout';

const listingSteps = [
    {
        title: 'Add room photos',
        description: 'Upload clear images so seekers can trust your listing quickly.',
        icon: ImagePlus,
    },
    {
        title: 'Set city and price',
        description: 'Pin your location, define nightly price, and publish confidently.',
        icon: Building2,
    },
    {
        title: 'Receive booking requests',
        description: 'Get renter interest from users searching by city and budget.',
        icon: CheckCircle2,
    },
];

type LandlordUser = {
    id: number;
    name: string;
    email: string;
    role?: string;
} | null;

type LandlordOption = {
    value: string;
    label: string;
};

type ExistingListing = {
    id: number;
    status: string | null;
    title: string;
    listing_type: string | null;
    city: string | null;
    address_line_1: string | null;
    postal_code: string | null;
    price_per_night: string | null;
    price_period: string | null;
    size_label: string | null;
    contact_email: string | null;
    facilities: string[];
    volunteer_help_needed: string[];
    image_count: number;
};

type LandlordProps = {
    canRegister?: boolean;
    isLandlordWorkspace?: boolean;
    showCreateListing?: boolean;
    cityOptions?: LandlordOption[];
    pricePeriodOptions?: LandlordOption[];
    listingTypeOptions?: LandlordOption[];
    facilityOptions?: LandlordOption[];
    volunteerHelpOptions?: LandlordOption[];
    existingListings?: ExistingListing[];
};

type PageProps = {
    auth: {
        user: LandlordUser;
    };
};

type LandlordListingForm = {
    title: string;
    description: string;
    city_id: string;
    address_line_1: string;
    address_line_2: string;
    postal_code: string;
    price_per_night: string;
    price_period: string;
    listing_type: string;
    size_label: string;
    facilities: string[];
    volunteer_help_needed: string[];
    photos: File[];
};

type PhotoPreview = {
    name: string;
    url: string;
};

export default function TenantWelcome({
    canRegister = true,
    isLandlordWorkspace = false,
    showCreateListing = false,
    cityOptions = [],
    pricePeriodOptions = [],
    listingTypeOptions = [],
    facilityOptions = [],
    volunteerHelpOptions = [],
    existingListings = [],
}: LandlordProps) {
    const { auth } = usePage<PageProps>().props;

    if (!isLandlordWorkspace) {
        return <GuestTenantWelcome authUser={auth.user} canRegister={canRegister} />;
    }

    return (
        <TenantWorkspace
            authUser={auth.user}
            showCreateListing={showCreateListing}
            cityOptions={cityOptions}
            pricePeriodOptions={pricePeriodOptions}
            listingTypeOptions={listingTypeOptions}
            facilityOptions={facilityOptions}
            volunteerHelpOptions={volunteerHelpOptions}
            existingListings={existingListings}
        />
    );
}

function GuestTenantWelcome({
    authUser,
    canRegister,
}: {
    authUser: LandlordUser;
    canRegister: boolean;
}) {
    const primaryHref = authUser ? dashboard() : login();
    const primaryLabel = authUser ? 'Manage listings' : 'Log in to list a room';

    return (
        <>
            <Head title="LivingSpace - List Your Room" />

            <div className="min-h-screen bg-[radial-gradient(circle_at_85%_15%,#dcfce7_0%,#f5f2ea_45%,#ebe5d8_100%)] text-stone-900 dark:bg-[radial-gradient(circle_at_85%_15%,#18302a_0%,#131f24_50%,#0d141d_100%)] dark:text-stone-100">
                <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
                    <header className="mb-10 flex items-center justify-between rounded-full border border-black/10 bg-white/75 px-4 py-3 backdrop-blur-md dark:border-white/10 dark:bg-white/8">
                        <p className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300">
                            Landlord view
                        </p>
                        <Link href={home()} className="text-sm font-medium text-stone-600 underline-offset-4 hover:underline dark:text-stone-300">
                            Switch role
                        </Link>
                    </header>

                    <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                        <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-stone-500 dark:text-stone-400">
                                List your room
                            </p>
                            <h1 className="text-5xl leading-tight font-semibold sm:text-6xl" style={{ fontFamily: '"Fraunces", serif' }}>
                                Publish elegant room listings.
                            </h1>
                            <p className="mt-5 max-w-xl text-base leading-8 text-stone-600 dark:text-stone-300">
                                Build trust with clean photos, clear pricing, and city-focused details that help seekers decide fast.
                            </p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link href={primaryHref} className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-stone-900">
                                    {primaryLabel}
                                    <ArrowRight className="size-4" />
                                </Link>
                                {canRegister && !authUser ? (
                                    <Link
                                        href={register({ query: { role: 'landlord' } })}
                                        className="inline-flex items-center rounded-full border border-black/10 bg-white/80 px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/8"
                                    >
                                        Create account
                                    </Link>
                                ) : null}
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-[2rem] border border-black/10 shadow-2xl dark:border-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80"
                                alt="Room listing setup"
                                className="h-full min-h-[380px] w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
                            <div className="absolute bottom-4 left-4 rounded-2xl bg-white/90 px-4 py-3 text-xs font-medium text-stone-700 shadow-lg backdrop-blur dark:bg-[#0f1828]/80 dark:text-stone-200">
                                Convert empty space into steady monthly income
                            </div>
                        </div>
                    </section>

                    <section className="mt-10 grid gap-5 md:grid-cols-3">
                        {listingSteps.map(({ title, description, icon: Icon }) => (
                            <article key={title} className="group rounded-[1.6rem] border border-black/8 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/6">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-white transition group-hover:scale-105 dark:bg-white dark:text-stone-900">
                                    <Icon className="size-4.5" />
                                </div>
                                <h2 className="text-lg font-semibold">{title}</h2>
                                <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">{description}</p>
                            </article>
                        ))}
                    </section>

                    <section className="mt-14 grid gap-6 lg:grid-cols-3">
                        {[
                            {
                                icon: Users,
                                title: 'Reach quality tenants',
                                description: 'Get discovered by serious renters actively searching in your city and price range.',
                            },
                            {
                                icon: BadgeDollarSign,
                                title: 'Stable monthly income',
                                description: 'Turn available rooms into a steady income stream with clear listing visibility.',
                            },
                            {
                                icon: CalendarCheck2,
                                title: 'Simple booking management',
                                description: 'Review, approve, and manage requests from one place without extra complexity.',
                            },
                        ].map(({ icon: Icon, title, description }) => (
                            <article key={title} className="rounded-3xl border border-black/8 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-white/8">
                                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300">
                                    <Icon className="size-5" />
                                </div>
                                <h2 className="text-lg font-semibold">{title}</h2>
                                <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">{description}</p>
                            </article>
                        ))}
                    </section>

                    <section className="mt-14 grid gap-8 rounded-[2rem] border border-black/8 bg-white/65 p-6 shadow-sm dark:border-white/10 dark:bg-white/6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">Landlord flow</p>
                            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl" style={{ fontFamily: '"Fraunces", serif' }}>
                                How listing works on LivingSpace
                            </h2>
                            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 dark:text-stone-300">
                                Built for speed and clarity so you can publish quickly and focus on approved renters.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { step: '01', title: 'Create your listing', description: 'Add title, photos, city, and nightly or monthly price details.' },
                                { step: '02', title: 'Receive requests', description: 'Tenants discover your room and send booking requests directly.' },
                                { step: '03', title: 'Approve and host', description: 'Review tenant details, approve quickly, and finalize move-in.' },
                            ].map(({ step, title, description }) => (
                                <article key={step} className="rounded-2xl border border-black/8 bg-white/80 p-4 dark:border-white/10 dark:bg-white/8">
                                    <div className="flex items-start gap-3">
                                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white dark:bg-emerald-500">
                                            {step}
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-stone-900 dark:text-stone-100">{title}</h3>
                                            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{description}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="mt-14 rounded-[2rem] border border-black/8 bg-stone-900 p-7 text-white shadow-lg dark:border-white/10 dark:bg-[#e8f7ef] dark:text-stone-900 lg:p-8">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-white/70 dark:text-stone-700">Ready to publish?</p>
                                <h2 className="mt-2 text-3xl font-semibold" style={{ fontFamily: '"Fraunces", serif' }}>
                                    Start listing and grow your rental income.
                                </h2>
                                <p className="mt-2 text-sm text-white/80 dark:text-stone-700">
                                    Create your landlord profile and post your first room in minutes.
                                </p>
                            </div>
                            <Link
                                href={canRegister && !authUser ? register({ query: { role: 'landlord' } }) : primaryHref}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:-translate-y-0.5 dark:bg-stone-900 dark:text-white"
                            >
                                {canRegister && !authUser ? 'Create landlord account' : primaryLabel}
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

const WelcomeTenantLayout = ({ children }: { children: React.ReactNode }) => {
    const { props } = usePage() as { props: any };
    if (props.isLandlordWorkspace && props.auth?.user) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Create listing', href: '#' }]}>
                {children}
            </AppLayout>
        );
    }
    return <>{children}</>;
};

TenantWelcome.layout = (page: React.ReactNode) => <WelcomeTenantLayout>{page}</WelcomeTenantLayout>;

function TenantWorkspace({
    authUser,
    showCreateListing,
    cityOptions,
    pricePeriodOptions,
    listingTypeOptions,
    facilityOptions,
    volunteerHelpOptions,
    existingListings,
}: {
    authUser: LandlordUser;
    showCreateListing: boolean;
    cityOptions: LandlordOption[];
    pricePeriodOptions: LandlordOption[];
    listingTypeOptions: LandlordOption[];
    facilityOptions: LandlordOption[];
    volunteerHelpOptions: LandlordOption[];
    existingListings: ExistingListing[];
}) {
    const [isFormOpen, setIsFormOpen] = useState(showCreateListing);
    const [isDragActive, setIsDragActive] = useState(false);
    const [photoPreviews, setPhotoPreviews] = useState<PhotoPreview[]>([]);
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const [pendingNavigationUrl, setPendingNavigationUrl] = useState<string | null>(null);
    const [pendingClose, setPendingClose] = useState(false);
    const fileInputId = useId();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const skipLeaveGuardRef = useRef(false);

    const form = useForm<LandlordListingForm>({
        title: '',
        description: '',
        city_id: '',
        address_line_1: '',
        address_line_2: '',
        postal_code: '',
        price_per_night: '',
        price_period: 'night',
        listing_type: '',
        size_label: '',
        facilities: [],
        volunteer_help_needed: [],
        photos: [],
    });

    const hasUnsavedChanges = isFormOpen && (form.isDirty || form.data.photos.length > 0);
    const sizeLabel = form.data.listing_type === 'apartment' ? 'Apartment size' : 'Room size';

    useEffect(() => {
        if (showCreateListing) {
            setIsFormOpen(true);
        }
    }, [showCreateListing]);

    useEffect(() => {
        const nextPreviews = form.data.photos.map((photo) => ({
            name: photo.name,
            url: URL.createObjectURL(photo),
        }));

        setPhotoPreviews(nextPreviews);

        return () => {
            nextPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, [form.data.photos]);

    const handleNativeLeavePrompt = useEffectEvent((event: BeforeUnloadEvent) => {
        if (!hasUnsavedChanges || skipLeaveGuardRef.current) {
            return;
        }

        event.preventDefault();
        event.returnValue = '';
    });

    useEffect(() => {
        window.addEventListener('beforeunload', handleNativeLeavePrompt);

        return () => {
            window.removeEventListener('beforeunload', handleNativeLeavePrompt);
        };
    }, [handleNativeLeavePrompt]);

    const handleInertiaBefore = useEffectEvent((event: CustomEvent<{ visit: { method: string; url: URL | string } }>) => {
        if (!hasUnsavedChanges || skipLeaveGuardRef.current || event.detail.visit.method.toLowerCase() !== 'get') {
            return;
        }

        event.preventDefault();
        setPendingNavigationUrl(event.detail.visit.url.toString());
        setPendingClose(false);
        setShowLeaveDialog(true);
    });

    useEffect(() => {
        const removeListener = router.on('before', handleInertiaBefore);

        return () => {
            removeListener();
        };
    }, [handleInertiaBefore]);

    function openCreateForm(): void {
        setIsFormOpen(true);
    }

    function updatePhotos(nextPhotos: File[]): void {
        form.setData('photos', nextPhotos);
        form.clearErrors('photos');
    }

    function addPhotos(fileList: FileList | File[]): void {
        const files = Array.from(fileList).filter((file) => file.type.startsWith('image/'));

        if (files.length === 0) {
            return;
        }

        updatePhotos([...form.data.photos, ...files].slice(0, 10));
    }

    function removePhoto(index: number): void {
        updatePhotos(form.data.photos.filter((_, photoIndex) => photoIndex !== index));
    }

    function toggleFacility(optionValue: string, checked: boolean): void {
        if (checked) {
            form.setData('facilities', [...form.data.facilities, optionValue]);
            return;
        }

        form.setData(
            'facilities',
            form.data.facilities.filter((facility) => facility !== optionValue),
        );
    }

    function toggleVolunteerHelp(optionValue: string, checked: boolean): void {
        if (checked) {
            form.setData('volunteer_help_needed', [...form.data.volunteer_help_needed, optionValue]);
            return;
        }

        form.setData(
            'volunteer_help_needed',
            form.data.volunteer_help_needed.filter((help) => help !== optionValue),
        );
    }

    function resetDraft(): void {
        form.reset();
        form.clearErrors();
        updatePhotos([]);
        setIsDragActive(false);
    }

    function requestCloseForm(): void {
        if (!hasUnsavedChanges) {
            resetDraft();
            setIsFormOpen(false);
            return;
        }

        setPendingNavigationUrl(null);
        setPendingClose(true);
        setShowLeaveDialog(true);
    }

    function confirmLeave(): void {
        setShowLeaveDialog(false);
        skipLeaveGuardRef.current = true;

        if (pendingClose) {
            resetDraft();
            setIsFormOpen(false);
            setPendingClose(false);
            queueMicrotask(() => {
                skipLeaveGuardRef.current = false;
            });
            return;
        }

        const nextUrl = pendingNavigationUrl;
        setPendingNavigationUrl(null);

        if (nextUrl) {
            router.visit(nextUrl);
        }

        queueMicrotask(() => {
            skipLeaveGuardRef.current = false;
        });
    }

    function cancelLeave(): void {
        setShowLeaveDialog(false);
        setPendingNavigationUrl(null);
        setPendingClose(false);
    }

    function submitListing(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        form.submit(store(), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                resetDraft();
                setIsFormOpen(false);
            },
        });
    }

    return (
        <>
            <Head title="Landlord Workspace" />

            <div className="min-h-screen bg-[#f1ecdf] text-stone-900 dark:bg-[#101826] dark:text-stone-100">
                <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
                    <header className="mb-8 flex items-center justify-between rounded-full border border-black/8 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/6">
                        <div>
                            <p className="text-sm font-semibold">Landlord workspace</p>
                            <p className="text-xs text-stone-500 dark:text-stone-400">{authUser?.email}</p>
                        </div>
                        <Link href={home()} className="text-sm text-stone-600 underline-offset-4 hover:underline dark:text-stone-300">
                            Switch role
                        </Link>
                    </header>

                    <section className={cn('grid gap-6', isFormOpen ? 'grid-cols-1' : 'lg:grid-cols-[0.95fr_1.05fr]')}>
                        {!isFormOpen ? (
                            <div className="space-y-6">
                                <div className="rounded-[2rem] bg-stone-900 p-7 text-white shadow-xl dark:bg-[#182233]">
                                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">Create listing</p>
                                    <h1 className="mt-3 text-4xl leading-tight font-semibold sm:text-5xl" style={{ fontFamily: '"Fraunces", serif' }}>
                                        Build a room profile seekers can trust.
                                    </h1>
                                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/78">
                                        Open the form, choose the listing type, mark the available facilities, and upload photos before you publish.
                                    </p>
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <Button
                                            type="button"
                                            size="lg"
                                            className="rounded-full bg-white px-6 text-stone-900 hover:bg-white/90"
                                            onClick={openCreateForm}
                                            data-test="create-listing-button"
                                        >
                                            Create Listing
                                            <ArrowRight className="size-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            size="lg"
                                            variant="outline"
                                            className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                            asChild
                                        >
                                            <Link href={dashboard()}>Open dashboard</Link>
                                        </Button>
                                    </div>
                                </div>

                                <div className="rounded-[1.8rem] border border-black/8 bg-white/75 p-6 shadow-sm dark:border-white/10 dark:bg-white/6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold">Existing listings</h2>
                                            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                                                {existingListings.length === 0
                                                    ? 'No listings yet. Create your first one from the panel on the right.'
                                                    : `${existingListings.length} listing${existingListings.length === 1 ? '' : 's'} ready to manage.`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 space-y-4">
                                        {existingListings.length === 0 ? (
                                            <div className="rounded-[1.4rem] border border-dashed border-stone-300 bg-stone-50/80 p-5 text-sm leading-7 text-stone-600 dark:border-white/10 dark:bg-[#132031] dark:text-stone-300">
                                                Listings you create here will appear in this summary once saved.
                                            </div>
                                        ) : (
                                            existingListings.map((listing) => (
                                                <article key={listing.id} className="rounded-[1.4rem] border border-black/8 bg-stone-50/90 p-5 dark:border-white/10 dark:bg-[#132031]">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">
                                                                {listing.listing_type === 'apartment' ? 'Apartment' : 'Room'}
                                                            </p>
                                                            <h3 className="mt-2 text-lg font-semibold">{listing.title}</h3>
                                                            <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
                                                                {[listing.address_line_1, listing.city, listing.postal_code].filter(Boolean).join(', ')}
                                                            </p>
                                                        </div>
                                                        <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-stone-900">
                                                            {listing.image_count} photo{listing.image_count === 1 ? '' : 's'}
                                                        </span>
                                                    </div>
                                                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-stone-600 dark:text-stone-300">
                                                        {listing.price_per_night ? (
                                                            <span className="rounded-full bg-white px-3 py-1 dark:bg-white/10">
                                                                €{listing.price_per_night}/{listing.price_period === 'month' ? 'month' : 'night'}
                                                            </span>
                                                        ) : null}
                                                        {listing.size_label ? (
                                                            <span className="rounded-full bg-white px-3 py-1 dark:bg-white/10">{listing.size_label}</span>
                                                        ) : null}
                                                        {listing.facilities.map((facility) => (
                                                            <span key={facility} className="rounded-full bg-white px-3 py-1 capitalize dark:bg-white/10">
                                                                {facility.replaceAll('_', ' ')}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </article>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <div className={cn('rounded-[2rem] border border-black/8 bg-white/82 p-6 shadow-sm dark:border-white/10 dark:bg-[#182233]', isFormOpen ? 'mx-auto w-full max-w-4xl p-7 lg:p-8' : '')}>
                            {!isFormOpen ? (
                                <div className="flex min-h-[38rem] flex-col items-center justify-center rounded-[1.6rem] border border-dashed border-stone-300 bg-stone-50/80 px-8 text-center dark:border-white/10 dark:bg-[#132031]">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-900">
                                        <UploadCloud className="size-6" />
                                    </div>
                                    <h2 className="mt-5 text-2xl font-semibold">Open the listing form</h2>
                                    <p className="mt-3 max-w-md text-sm leading-7 text-stone-600 dark:text-stone-300">
                                        Click `Create Listing` on the left to open the form panel and start uploading room photos.
                                    </p>
                                </div>
                            ) : (
                                <form className="space-y-6" onSubmit={submitListing} data-test="listing-form-panel">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">Listing editor</p>
                                            <h2 className="mt-2 text-2xl font-semibold">Create your listing</h2>
                                            <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">
                                                Add the same essentials guests expect on major rental platforms: address, city, price, size, amenities, and photos.
                                            </p>
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" onClick={requestCloseForm} aria-label="Close listing form">
                                            <X className="size-4" />
                                        </Button>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Listing title</Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g. Bright studio near city center"
                                            value={form.data.title}
                                            onChange={(event) => form.setData('title', event.target.value)}
                                        />
                                        <InputError message={form.errors.title} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            rows={5}
                                            value={form.data.description}
                                            onChange={(event) => form.setData('description', event.target.value)}
                                            className="min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                                            placeholder="Describe the space, nearby highlights, and what makes this listing attractive."
                                        />
                                        <InputError message={form.errors.description} />
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="city_id">City</Label>
                                            <select
                                                id="city_id"
                                                value={form.data.city_id}
                                                onChange={(event) => form.setData('city_id', event.target.value)}
                                                className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                                            >
                                                <option value="">Select a city</option>
                                                {cityOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={form.errors.city_id} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="price_per_night">Price</Label>
                                            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                                                <div className="grid gap-2">
                                                    <Input
                                                        id="price_per_night"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        placeholder="e.g. 65"
                                                        value={form.data.price_per_night}
                                                        onChange={(event) => form.setData('price_per_night', event.target.value)}
                                                    />
                                                    <InputError message={form.errors.price_per_night} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <select
                                                        aria-label="Price period"
                                                        value={form.data.price_period}
                                                        onChange={(event) => form.setData('price_period', event.target.value)}
                                                        className="h-10 min-w-34 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                                                    >
                                                        {pricePeriodOptions.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <InputError message={form.errors.price_period} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="grid gap-2 sm:col-span-2">
                                            <Label htmlFor="address_line_1">Address line 1</Label>
                                            <Input
                                                id="address_line_1"
                                                placeholder="Street address"
                                                value={form.data.address_line_1}
                                                onChange={(event) => form.setData('address_line_1', event.target.value)}
                                            />
                                            <InputError message={form.errors.address_line_1} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="address_line_2">Address line 2</Label>
                                            <Input
                                                id="address_line_2"
                                                placeholder="Apartment, suite, unit, building"
                                                value={form.data.address_line_2}
                                                onChange={(event) => form.setData('address_line_2', event.target.value)}
                                            />
                                            <InputError message={form.errors.address_line_2} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="postal_code">Postal code</Label>
                                            <Input
                                                id="postal_code"
                                                placeholder="e.g. 10115"
                                                value={form.data.postal_code}
                                                onChange={(event) => form.setData('postal_code', event.target.value)}
                                            />
                                            <InputError message={form.errors.postal_code} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="listing_type">Room or apartment</Label>
                                        <select
                                            id="listing_type"
                                            value={form.data.listing_type}
                                            onChange={(event) => {
                                                form.setData('listing_type', event.target.value);
                                                form.setData('size_label', '');
                                            }}
                                            className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
                                            data-test="listing-type-select"
                                        >
                                            <option value="">Select a listing type</option>
                                            {listingTypeOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={form.errors.listing_type} />
                                    </div>

                                    {form.data.listing_type ? (
                                        <div className="grid gap-2">
                                            <Label htmlFor="size_label">{sizeLabel}</Label>
                                            <Input
                                                id="size_label"
                                                placeholder={form.data.listing_type === 'apartment' ? 'e.g. 85 sqm' : 'e.g. 25 sqm'}
                                                value={form.data.size_label}
                                                onChange={(event) => form.setData('size_label', event.target.value)}
                                                data-test="size-label-input"
                                            />
                                            <InputError message={form.errors.size_label} />
                                        </div>
                                    ) : null}

                                    <div className="grid gap-3">
                                        <div>
                                            <Label>Facilities</Label>
                                            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                                                Pick every amenity available in the room or apartment.
                                            </p>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                            {facilityOptions.map((option) => {
                                                const checked = form.data.facilities.includes(option.value);

                                                return (
                                                    <label
                                                        key={option.value}
                                                        className="flex items-center gap-3 rounded-[1rem] border border-black/8 bg-stone-50/80 px-4 py-3 text-sm font-medium dark:border-white/10 dark:bg-[#132031]"
                                                    >
                                                        <Checkbox checked={checked} onCheckedChange={(value) => toggleFacility(option.value, value === true)} />
                                                        <span>{option.label}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        <InputError message={form.errors.facilities} />
                                    </div>

                                    <div className="grid gap-3">
                                        <div>
                                            <Label>Volunteer Help Needed</Label>
                                            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                                                Select what kind of help you're looking for from potential tenants.
                                            </p>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                            {volunteerHelpOptions.map((option) => {
                                                const checked = form.data.volunteer_help_needed.includes(option.value);

                                                return (
                                                    <label
                                                        key={option.value}
                                                        className="flex items-center gap-3 rounded-[1rem] border border-black/8 bg-stone-50/80 px-4 py-3 text-sm font-medium dark:border-white/10 dark:bg-[#132031]"
                                                    >
                                                        <Checkbox checked={checked} onCheckedChange={(value) => toggleVolunteerHelp(option.value, value === true)} />
                                                        <span>{option.label}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        <InputError message={form.errors.volunteer_help_needed} />
                                    </div>

                                    <div className="grid gap-3">
                                        <div>
                                            <Label htmlFor={fileInputId}>Photos</Label>
                                            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                                                Drag and drop images here or click the panel to choose files.
                                            </p>
                                        </div>

                                        <input
                                            ref={fileInputRef}
                                            id={fileInputId}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(event) => {
                                                if (event.target.files) {
                                                    addPhotos(event.target.files);
                                                    event.target.value = '';
                                                }
                                            }}
                                            data-test="listing-photo-input"
                                        />

                                        <button
                                            type="button"
                                            className={cn(
                                                'flex min-h-44 w-full flex-col items-center justify-center rounded-[1.6rem] border border-dashed px-6 text-center transition',
                                                isDragActive
                                                    ? 'border-stone-900 bg-stone-100 dark:border-white dark:bg-white/10'
                                                    : 'border-stone-300 bg-stone-50/80 hover:bg-stone-100 dark:border-white/10 dark:bg-[#132031] dark:hover:bg-[#1a2b41]',
                                            )}
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragEnter={(event) => {
                                                event.preventDefault();
                                                setIsDragActive(true);
                                            }}
                                            onDragOver={(event) => {
                                                event.preventDefault();
                                                setIsDragActive(true);
                                            }}
                                            onDragLeave={(event) => {
                                                event.preventDefault();
                                                if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
                                                    return;
                                                }
                                                setIsDragActive(false);
                                            }}
                                            onDrop={(event) => {
                                                event.preventDefault();
                                                setIsDragActive(false);
                                                addPhotos(event.dataTransfer.files);
                                            }}
                                        >
                                            <UploadCloud className="size-8 text-stone-500 dark:text-stone-300" />
                                            <p className="mt-4 text-base font-semibold">Drop listing photos here</p>
                                            <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">
                                                Up to 10 images. JPG, PNG, GIF, or WebP files only.
                                            </p>
                                        </button>
                                        <InputError message={form.errors.photos} />
                                        <InputError message={form.errors['photos.0']} />

                                        {photoPreviews.length > 0 ? (
                                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                                {photoPreviews.map((preview, index) => (
                                                    <article key={`${preview.name}-${index}`} className="overflow-hidden rounded-[1.2rem] border border-black/8 bg-stone-50 dark:border-white/10 dark:bg-[#132031]">
                                                        <img src={preview.url} alt={preview.name} className="h-40 w-full object-cover" />
                                                        <div className="flex items-center justify-between gap-3 p-3">
                                                            <p className="truncate text-sm font-medium">{preview.name}</p>
                                                            <Button type="button" variant="ghost" size="icon" onClick={() => removePhoto(index)} aria-label={`Remove ${preview.name}`}>
                                                                <X className="size-4" />
                                                            </Button>
                                                        </div>
                                                    </article>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>

                                    {form.progress ? (
                                        <div className="space-y-2">
                                            <div className="h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10">
                                                <div className="h-full rounded-full bg-stone-900 transition-[width] dark:bg-white" style={{ width: `${form.progress.percentage}%` }} />
                                            </div>
                                            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">{form.progress.percentage}% uploaded</p>
                                        </div>
                                    ) : null}

                                    <div className="flex flex-wrap items-center gap-3">
                                        <Button type="submit" disabled={form.processing} className="rounded-full px-5" data-test="submit-listing-button">
                                            {form.processing ? 'Submitting...' : 'Submit'}
                                        </Button>
                                        <Button type="button" variant="outline" className="rounded-full" onClick={requestCloseForm}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            <Dialog open={showLeaveDialog} onOpenChange={(open) => !open && cancelLeave()}>
                <DialogContent data-test="unsaved-changes-dialog">
                    <DialogHeader>
                        <DialogTitle>Leave without saving?</DialogTitle>
                        <DialogDescription>
                            Your listing form has unsaved changes. If you continue, the data you entered will be lost.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={cancelLeave}>
                            No
                        </Button>
                        <Button type="button" variant="destructive" onClick={confirmLeave}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

