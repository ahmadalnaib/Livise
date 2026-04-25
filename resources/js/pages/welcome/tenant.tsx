import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BadgeDollarSign, Building2, CalendarCheck2, CheckCircle2, ImagePlus, Users } from 'lucide-react';
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
                                {canRegister && !auth.user ? (
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
                                href={canRegister && !auth.user ? register({ query: { role: 'landlord' } }) : primaryHref}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:-translate-y-0.5 dark:bg-stone-900 dark:text-white"
                            >
                                {canRegister && !auth.user ? 'Create landlord account' : primaryLabel}
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

TenantWelcome.layout = null;
