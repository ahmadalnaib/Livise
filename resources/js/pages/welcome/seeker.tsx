import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Clock3, MapPin, ShieldCheck, Star, WalletCards } from 'lucide-react';
import { dashboard, home, login, register } from '@/routes';
import { show as roomShow } from '@/routes/dashboard/tenant/rooms';

type FeaturedRoom = {
    id: number;
    title: string;
    city: string;
    price: string;
    rating: string;
    image: string;
};

type SeekerProps = {
    canRegister?: boolean;
    featuredRooms?: FeaturedRoom[];
};

type PageProps = {
    auth: {
        user: {
            role?: string;
        } | null;
    };
};

export default function SeekerWelcome({ canRegister = true, featuredRooms = [] }: SeekerProps) {
    const { auth } = usePage<PageProps>().props;
    const primaryHref = auth.user ? dashboard() : login();
    const primaryLabel = auth.user ? 'Go to dashboard' : 'Log in to browse';

    return (
        <>
            <Head title="LivingSpace - Find Your Room" />

            <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#e8f2ff_0%,#f6f4ee_45%,#ece7dc_100%)] text-stone-900 dark:bg-[radial-gradient(circle_at_20%_20%,#1b2b45_0%,#121a2a_55%,#0b1220_100%)] dark:text-stone-100">
                <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
                    <header className="mb-10 flex items-center justify-between rounded-full border border-black/10 bg-white/75 px-4 py-3 backdrop-blur-md dark:border-white/10 dark:bg-white/8">
                        <p className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 dark:bg-blue-400/20 dark:text-blue-300">
                            Tenant view
                        </p>
                        <Link href={home()} className="text-sm font-medium text-stone-600 underline-offset-4 hover:underline dark:text-stone-300">
                            Switch role
                        </Link>
                    </header>

                    <section className="mb-12 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
                        <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-stone-500 dark:text-stone-400">
                                Find your next room
                            </p>
                            <h1 className="text-5xl leading-tight font-semibold sm:text-6xl" style={{ fontFamily: '"Fraunces", serif' }}>
                                Rooms curated for tenants.
                            </h1>
                            <p className="mt-5 max-w-xl text-base leading-8 text-stone-600 dark:text-stone-300">
                                Browse calm, photo-rich listings across cities and pick the stay that fits your budget and style.
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link href={primaryHref} className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-stone-900">
                                    {primaryLabel}
                                    <ArrowRight className="size-4" />
                                </Link>
                                {canRegister && !auth.user ? (
                                    <Link
                                        href={register({ query: { role: 'tenant' } })}
                                        className="inline-flex items-center rounded-full border border-black/10 bg-white/80 px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/8"
                                    >
                                        Create account
                                    </Link>
                                ) : null}
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-[2rem] border border-black/10 shadow-2xl dark:border-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1464890100898-a385f744067f?auto=format&fit=crop&w=1400&q=80"
                                alt="Elegant rental room"
                                className="h-full min-h-[380px] w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
                            <div className="absolute bottom-4 left-4 rounded-2xl bg-white/90 px-4 py-3 text-xs font-medium text-stone-700 shadow-lg backdrop-blur dark:bg-[#0f1828]/80 dark:text-stone-200">
                                Handpicked spaces in top cities
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-5 md:grid-cols-3">
                        {featuredRooms.map((room) => (
                            <Link
                                key={room.id}
                                href={auth.user?.role === 'tenant' ? roomShow(room.id) : login()}
                                className="group overflow-hidden rounded-[1.6rem] border border-black/8 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#182233]"
                            >
                                <img src={room.image} alt={room.title} className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" />
                                <div className="space-y-3 p-5">
                                    <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                                        <MapPin className="size-3.5" />
                                        {room.city}
                                    </p>
                                    <h2 className="text-xl font-semibold">{room.title}</h2>
                                    <div className="flex items-center justify-between border-t border-black/8 pt-4 text-sm dark:border-white/10">
                                        <span className="font-semibold">{room.price} / night</span>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold dark:bg-white/10">
                                            <Star className="size-3.5 fill-current" />
                                            {room.rating}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </section>

                    <section className="mt-14 grid gap-6 lg:grid-cols-3">
                        {[
                            {
                                icon: ShieldCheck,
                                title: 'Verified listings',
                                description: 'Every listing includes clear details, photos, and host information for confident decisions.',
                            },
                            {
                                icon: WalletCards,
                                title: 'Budget-friendly choices',
                                description: 'Compare options quickly and choose a room that matches your budget and lifestyle.',
                            },
                            {
                                icon: Clock3,
                                title: 'Fast booking flow',
                                description: 'Send requests in minutes and track your booking progress without back-and-forth confusion.',
                            },
                        ].map(({ icon: Icon, title, description }) => (
                            <article key={title} className="rounded-3xl border border-black/8 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-white/8">
                                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300">
                                    <Icon className="size-5" />
                                </div>
                                <h2 className="text-lg font-semibold">{title}</h2>
                                <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">{description}</p>
                            </article>
                        ))}
                    </section>

                    <section className="mt-14 grid gap-8 rounded-[2rem] border border-black/8 bg-white/65 p-6 shadow-sm dark:border-white/10 dark:bg-white/6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">Tenant journey</p>
                            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl" style={{ fontFamily: '"Fraunces", serif' }}>
                                How renting works on LivingSpace
                            </h2>
                            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 dark:text-stone-300">
                                A clear path from browsing to moving in, designed to keep everything simple and transparent.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { step: '01', title: 'Explore rooms', description: 'Search by city, check photos, and shortlist your favorite options.' },
                                { step: '02', title: 'Send a request', description: 'Submit your booking request with confidence in a few clicks.' },
                                { step: '03', title: 'Get approved', description: 'Receive updates and finalize your move with the landlord.' },
                            ].map(({ step, title, description }) => (
                                <article key={step} className="rounded-2xl border border-black/8 bg-white/80 p-4 dark:border-white/10 dark:bg-white/8">
                                    <div className="flex items-start gap-3">
                                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white dark:bg-blue-500">
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

                    <section className="mt-14 rounded-[2rem] border border-black/8 bg-stone-900 p-7 text-white shadow-lg dark:border-white/10 dark:bg-[#e6edf8] dark:text-stone-900 lg:p-8">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-white/70 dark:text-stone-700">Ready to start?</p>
                                <h2 className="mt-2 text-3xl font-semibold" style={{ fontFamily: '"Fraunces", serif' }}>
                                    Discover your next room today.
                                </h2>
                                <p className="mt-2 text-sm text-white/80 dark:text-stone-700">
                                    Join as a tenant and start browsing verified listings right away.
                                </p>
                            </div>
                            <Link
                                href={canRegister && !auth.user ? register({ query: { role: 'tenant' } }) : primaryHref}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:-translate-y-0.5 dark:bg-stone-900 dark:text-white"
                            >
                                {canRegister && !auth.user ? 'Create tenant account' : primaryLabel}
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

SeekerWelcome.layout = null;
