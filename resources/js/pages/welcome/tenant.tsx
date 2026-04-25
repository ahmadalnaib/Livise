import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, CheckCircle2, ImagePlus } from 'lucide-react';
import { dashboard, home, login, register } from '@/routes';

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

type TenantProps = {
    canRegister?: boolean;
};

type PageProps = {
    auth: {
        user: unknown | null;
    };
};

export default function TenantWelcome({ canRegister = true }: TenantProps) {
    const { auth } = usePage<PageProps>().props;
    const primaryHref = auth.user ? dashboard() : login();
    const primaryLabel = auth.user ? 'Manage listings' : 'Log in to list a room';

    return (
        <>
            <Head title="Tenant Welcome" />

            <div className="min-h-screen bg-[#f5f1ea] text-stone-900 dark:bg-[#101826] dark:text-stone-100">
                <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
                    <header className="mb-10 flex items-center justify-between rounded-full border border-black/8 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/6">
                        <p className="text-sm font-semibold">Tenant view</p>
                        <Link href={home()} className="text-sm text-stone-600 underline-offset-4 hover:underline dark:text-stone-300">
                            Switch role
                        </Link>
                    </header>

                    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
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
                                <Link href={primaryHref} className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-stone-900">
                                    {primaryLabel}
                                    <ArrowRight className="size-4" />
                                </Link>
                                {canRegister && !auth.user ? (
                                    <Link
                                        href={register({ query: { role: 'tenant' } })}
                                        className="inline-flex items-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold dark:border-white/10 dark:bg-white/6"
                                    >
                                        Create account
                                    </Link>
                                ) : null}
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-[2rem]">
                            <img
                                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80"
                                alt="Room listing setup"
                                className="h-full min-h-[360px] w-full object-cover"
                            />
                        </div>
                    </section>

                    <section className="mt-10 grid gap-5 md:grid-cols-3">
                        {listingSteps.map(({ title, description, icon: Icon }) => (
                            <article key={title} className="rounded-[1.6rem] border border-black/8 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/6">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-900">
                                    <Icon className="size-4.5" />
                                </div>
                                <h2 className="text-lg font-semibold">{title}</h2>
                                <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">{description}</p>
                            </article>
                        ))}
                    </section>
                </div>
            </div>
        </>
    );
}
