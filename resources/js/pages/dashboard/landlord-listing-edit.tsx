import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useEffectEvent, useId, useRef, useState } from 'react';
import { update } from '@/actions/App/Http/Controllers/LandlordListingController';
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
import { landlord } from '@/routes/dashboard';
import { ArrowLeft, UploadCloud, X } from 'lucide-react';

type Option = {
    value: string;
    label: string;
};

type Listing = {
    id: number;
    status: string;
    title: string;
    description: string;
    city_id: string;
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

type Props = {
    listing: Listing;
    cityOptions: Option[];
    pricePeriodOptions: Option[];
    listingTypeOptions: Option[];
    facilityOptions: Option[];
};

type ListingForm = {
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
    photos: File[];
};

type PhotoPreview = {
    name: string;
    url: string;
};

export default function LandlordListingEdit({
    listing,
    cityOptions,
    pricePeriodOptions,
    listingTypeOptions,
    facilityOptions,
}: Props) {
    const [isDragActive, setIsDragActive] = useState(false);
    const [photoPreviews, setPhotoPreviews] = useState<PhotoPreview[]>([]);
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const [pendingNavigationUrl, setPendingNavigationUrl] = useState<string | null>(null);
    const fileInputId = useId();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const skipLeaveGuardRef = useRef(false);

    const form = useForm<ListingForm>({
        title: listing.title,
        description: listing.description,
        city_id: listing.city_id,
        address_line_1: listing.address_line_1,
        address_line_2: listing.address_line_2 ?? '',
        postal_code: listing.postal_code,
        price_per_night: listing.price_per_night,
        price_period: listing.price_period,
        listing_type: listing.listing_type,
        size_label: listing.size_label,
        facilities: listing.facilities,
        photos: [],
    });

    const hasUnsavedChanges = form.isDirty || form.data.photos.length > 0;
    const sizeLabel = form.data.listing_type === 'apartment' ? 'Apartment size' : 'Room size';

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
        setShowLeaveDialog(true);
    });

    useEffect(() => {
        const removeListener = router.on('before', handleInertiaBefore);

        return () => {
            removeListener();
        };
    }, [handleInertiaBefore]);

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

    function confirmLeave(): void {
        setShowLeaveDialog(false);
        skipLeaveGuardRef.current = true;

        if (pendingNavigationUrl) {
            router.visit(pendingNavigationUrl);
        }

        queueMicrotask(() => {
            skipLeaveGuardRef.current = false;
            setPendingNavigationUrl(null);
        });
    }

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        form.submit(update(listing.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.setData('photos', []);
            },
        });
    }

    return (
        <>
            <Head title={`Edit ${listing.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Saved listing</p>
                            <h1 className="text-2xl font-semibold">{listing.title}</h1>
                            <div className="mt-3">
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                                        listing.status === 'confirmed'
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
                                    }`}
                                >
                                    {listing.status === 'confirmed' ? 'Confirmed listing' : 'Pending listing'}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Review the current listing, update its details, and add more photos if needed.
                            </p>
                        </div>

                        <Button type="button" variant="outline" asChild>
                            <Link href={landlord()} className="inline-flex items-center gap-2">
                                <ArrowLeft className="size-4" />
                                Back to dashboard
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {listing.images.map((image) => (
                            <div key={image.id} className="overflow-hidden rounded-2xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <img src={image.url} alt={listing.title} className="h-44 w-full object-cover" />
                            </div>
                        ))}
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={submit}>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Listing title</Label>
                            <Input id="title" value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} />
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
                                <Input id="address_line_1" value={form.data.address_line_1} onChange={(event) => form.setData('address_line_1', event.target.value)} />
                                <InputError message={form.errors.address_line_1} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address_line_2">Address line 2</Label>
                                <Input id="address_line_2" value={form.data.address_line_2} onChange={(event) => form.setData('address_line_2', event.target.value)} />
                                <InputError message={form.errors.address_line_2} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="postal_code">Postal code</Label>
                                <Input id="postal_code" value={form.data.postal_code} onChange={(event) => form.setData('postal_code', event.target.value)} />
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
                                <Input id="size_label" value={form.data.size_label} onChange={(event) => form.setData('size_label', event.target.value)} />
                                <InputError message={form.errors.size_label} />
                            </div>
                        ) : null}

                        <div className="grid gap-3">
                            <div>
                                <Label>Facilities</Label>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Update the amenities that are currently available in this listing.
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {facilityOptions.map((option) => {
                                    const checked = form.data.facilities.includes(option.value);

                                    return (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-3 rounded-[1rem] border border-sidebar-border/70 px-4 py-3 text-sm font-medium dark:border-sidebar-border"
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
                                <Label htmlFor={fileInputId}>Add more photos</Label>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Existing photos stay on the listing. New uploads are added to the gallery.
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
                            />

                            <button
                                type="button"
                                className={cn(
                                    'flex min-h-44 w-full flex-col items-center justify-center rounded-[1.6rem] border border-dashed px-6 text-center transition',
                                    isDragActive
                                        ? 'border-stone-900 bg-stone-100 dark:border-white dark:bg-white/10'
                                        : 'border-sidebar-border/70 hover:bg-primary/3 dark:border-sidebar-border',
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
                                <UploadCloud className="size-8 text-muted-foreground" />
                                <p className="mt-4 text-base font-semibold">Drop new photos here</p>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">Up to 10 additional images. JPG, PNG, GIF, or WebP files only.</p>
                            </button>
                            <InputError message={form.errors.photos} />
                            <InputError message={form.errors['photos.0']} />

                            {photoPreviews.length > 0 ? (
                                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {photoPreviews.map((preview, index) => (
                                        <article key={`${preview.name}-${index}`} className="overflow-hidden rounded-[1.2rem] border border-sidebar-border/70 dark:border-sidebar-border">
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
                                <p className="text-xs font-medium text-muted-foreground">{form.progress.percentage}% uploaded</p>
                            </div>
                        ) : null}

                        <div className="flex flex-wrap items-center gap-3">
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? 'Saving...' : 'Save changes'}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href={landlord()}>Back to dashboard</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <Dialog open={showLeaveDialog} onOpenChange={(open) => !open && setShowLeaveDialog(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Leave without saving?</DialogTitle>
                        <DialogDescription>Your listing has unsaved changes. If you continue, your edits will be lost.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setShowLeaveDialog(false)}>
                            Stay here
                        </Button>
                        <Button type="button" variant="destructive" onClick={confirmLeave}>
                            Leave page
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

LandlordListingEdit.layout = {
    breadcrumbs: [
        {
            title: 'Landlord Dashboard',
            href: landlord(),
        },
        {
            title: 'Edit Listing',
            href: '#',
        },
    ],
};
