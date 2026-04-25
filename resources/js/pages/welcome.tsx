import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BedDouble,
    MapPin,
    ShieldCheck,
    Sparkles,
    Star,
    Users,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';

const cityStats = [
    { name: 'Amman', rooms: '120 rooms', vibe: 'City lights and quiet corners' },
    { name: 'Irbid', rooms: '64 rooms', vibe: 'Student-friendly stays' },
    { name: 'Aqaba', rooms: '38 rooms', vibe: 'Sea view weekends' },
];

const featuredRooms = [
    {
        name: 'Sun Court Loft',
        city: 'Amman',
        price: '$48',
        rating: '4.9',
        host: 'Maha',
        accent: 'from-amber-300 via-orange-200 to-rose-100',
        description:
            'Private room with balcony light, fast Wi-Fi, and a five-minute walk to cafes.',
    },
    {
        name: 'Olive Street Studio',
        city: 'Irbid',
        price: '$31',
        rating: '4.7',
        host: 'Yazan',
        accent: 'from-emerald-300 via-lime-200 to-stone-100',
        description:
            'Compact studio for short stays near universities and late-night food spots.',
    },
    {
        name: 'Coral Bay Room',
        city: 'Aqaba',
        price: '$56',
        rating: '5.0',
        host: 'Rama',
        accent: 'from-sky-300 via-cyan-200 to-white',
        description:
            'Relaxed coastal room with shared terrace, sunrise views, and easy beach access.',
    },
];

const highlights = [
    {
        title: 'Trusted hosts',
        description: 'Profiles, reviews, and clear house rules before anyone books.',
        icon: ShieldCheck,
    },
    {
        title: 'Flexible stays',
        description: 'Overnight trips, longer rentals, and city-hopping plans in one feed.',
        icon: BedDouble,
    },
    {
        title: 'Real local picks',
        description: 'Browse rooms by city, neighborhood mood, and practical amenities.',
        icon: MapPin,
    },
];

type WelcomeProps = {
    canRegister?: boolean;
};

type PageProps = {
    auth: {
        user: unknown | null;
    };
};

export default function Welcome({ canRegister = true }: WelcomeProps) {
    const { auth } = usePage<PageProps>().props;
    const primaryHref = auth.user ? dashboard() : login();
    const primaryLabel = auth.user ? 'Open dashboard' : 'Start exploring';

    return (
        <>
            <Head title="Rooms in Every City">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=manrope:400,500,600,700,800|sora:400,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,209,102,0.35),_transparent_28%),linear-gradient(180deg,_#f7f1e8_0%,_#f4efe7_48%,_#fffdf8_100%)] text-stone-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(21,94,117,0.28),_transparent_24%),linear-gradient(180deg,_#0f1720_0%,_#101826_52%,_#152033_100%)] dark:text-stone-100">
                <div
                    className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 lg:px-8 lg:py-8"
                    style={{ fontFamily: '"Manrope", var(--font-sans)' }}
                >
                    <header className="mb-10 flex items-center justify-between gap-4 rounded-full border border-white/50 bg-white/65 px-4 py-3 shadow-lg shadow-amber-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-950 text-sm font-semibold tracking-[0.24em] text-amber-200 dark:bg-amber-200 dark:text-stone-950">
                                RR
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">
                                    Rental rooms
                                </p>
                                <p
                                    className="font-semibold"
                                    style={{ fontFamily: '"Sora", var(--font-sans)' }}
                                >
                                    RoomRoam
                                </p>
                            </div>
                        </div>

                        <nav className="flex items-center gap-2 sm:gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-white/70 dark:text-stone-200 dark:hover:bg-white/8"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister ? (
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-amber-200 dark:text-stone-950 dark:hover:bg-amber-100"
                                        >
                                            Create account
                                        </Link>
                                    ) : null}
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="grid flex-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
                        <section className="relative overflow-hidden rounded-[2rem] border border-stone-900/10 bg-white/70 p-6 shadow-[0_30px_80px_-30px_rgba(68,46,22,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6 dark:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.75)] lg:p-10">
                            <div className="absolute top-0 right-0 h-36 w-36 rounded-full bg-amber-300/35 blur-3xl dark:bg-cyan-300/20" />
                            <div className="absolute bottom-10 left-8 h-24 w-24 rounded-full bg-rose-300/30 blur-3xl dark:bg-sky-400/20" />

                            <div className="relative flex flex-col gap-8">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-stone-900/10 bg-stone-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200 dark:border-white/10 dark:bg-white/10 dark:text-amber-100">
                                    <Sparkles className="size-3.5" />
                                    Fake data demo
                                </div>

                                <div className="max-w-2xl space-y-5">
                                    <h1
                                        className="text-4xl leading-none font-semibold tracking-tight sm:text-5xl lg:text-6xl"
                                        style={{ fontFamily: '"Sora", var(--font-sans)' }}
                                    >
                                        Find a room to rent in the city you want, or
                                        list one in minutes.
                                    </h1>
                                    <p className="max-w-xl text-base leading-7 text-stone-600 dark:text-stone-300 sm:text-lg">
                                        One person lists the room, another rents it.
                                        Browse city-based stays, compare hosts, and
                                        preview the whole experience from a single
                                        landing page.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Link
                                        href={primaryHref}
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:bg-stone-800 dark:bg-amber-200 dark:text-stone-950 dark:hover:bg-amber-100"
                                    >
                                        {primaryLabel}
                                        <ArrowRight className="size-4" />
                                    </Link>
                                    {canRegister && !auth.user ? (
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center justify-center rounded-full border border-stone-900/15 bg-white/60 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:bg-white dark:border-white/12 dark:bg-white/6 dark:text-white dark:hover:bg-white/10"
                                        >
                                            Become a host
                                        </Link>
                                    ) : null}
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    {highlights.map(({ title, description, icon: Icon }) => (
                                        <div
                                            key={title}
                                            className="rounded-[1.5rem] border border-stone-900/10 bg-white/75 p-4 backdrop-blur dark:border-white/8 dark:bg-white/6"
                                        >
                                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-200 text-stone-950 dark:bg-cyan-200 dark:text-slate-950">
                                                <Icon className="size-4.5" />
                                            </div>
                                            <h2 className="mb-2 font-semibold">{title}</h2>
                                            <p className="text-sm leading-6 text-stone-600 dark:text-stone-300">
                                                {description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="grid gap-6">
                            <div className="overflow-hidden rounded-[2rem] border border-stone-900/10 bg-stone-950 p-6 text-white shadow-[0_35px_80px_-35px_rgba(33,25,17,0.8)] dark:border-white/10 dark:bg-[#111927] lg:p-7">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/80">
                                            Live cities
                                        </p>
                                        <h2
                                            className="mt-2 text-2xl font-semibold"
                                            style={{ fontFamily: '"Sora", var(--font-sans)' }}
                                        >
                                            Rooms moving fast
                                        </h2>
                                    </div>
                                    <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-stone-300">
                                        Updated 2m ago
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {cityStats.map((city, index) => (
                                        <div
                                            key={city.name}
                                            className="flex items-center justify-between rounded-[1.25rem] border border-white/8 bg-white/5 px-4 py-4 transition hover:bg-white/8"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-amber-100">
                                                    0{index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{city.name}</p>
                                                    <p className="text-sm text-stone-300">{city.vibe}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-amber-200">
                                                {city.rooms}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <div className="rounded-[1.5rem] bg-white/6 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                                            Active hosts
                                        </p>
                                        <p className="mt-3 text-3xl font-semibold">260+</p>
                                    </div>
                                    <div className="rounded-[1.5rem] bg-white/6 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                                            Average stay
                                        </p>
                                        <p className="mt-3 text-3xl font-semibold">4 nights</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[2rem] border border-stone-900/10 bg-white/70 p-6 backdrop-blur dark:border-white/10 dark:bg-white/6">
                                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-stone-500 dark:text-stone-300">
                                    <Users className="size-4" />
                                    Why this works
                                </div>
                                <p className="text-lg leading-8 text-stone-700 dark:text-stone-200">
                                    Owners list rooms with city details and pricing.
                                    Renters compare listings, pick a place, and move
                                    from discovery to booking with much less friction.
                                </p>
                            </div>
                        </section>
                    </main>

                    <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                        <div className="rounded-[2rem] border border-stone-900/10 bg-white/72 p-6 backdrop-blur dark:border-white/10 dark:bg-white/6 lg:p-8">
                            <div className="mb-6 flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">
                                        Featured rooms
                                    </p>
                                    <h2
                                        className="mt-2 text-3xl font-semibold"
                                        style={{ fontFamily: '"Sora", var(--font-sans)' }}
                                    >
                                        Fake listings for the homepage
                                    </h2>
                                </div>
                                <div className="hidden rounded-full border border-stone-900/10 bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600 dark:border-white/10 dark:bg-white/8 dark:text-stone-300 sm:block">
                                    3 highlighted stays
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {featuredRooms.map((room) => (
                                    <article
                                        key={room.name}
                                        className="group overflow-hidden rounded-[1.6rem] border border-stone-900/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#111927]"
                                    >
                                        <div
                                            className={`relative h-44 overflow-hidden bg-gradient-to-br ${room.accent}`}
                                        >
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.9),_transparent_30%)]" />
                                            <div className="absolute right-4 bottom-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-stone-900 backdrop-blur">
                                                {room.city}
                                            </div>
                                        </div>

                                        <div className="space-y-4 p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="font-semibold text-stone-900 dark:text-white">
                                                        {room.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                                        Host: {room.host}
                                                    </p>
                                                </div>
                                                <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-950 dark:bg-amber-200 dark:text-stone-950">
                                                    <Star className="size-3.5 fill-current" />
                                                    {room.rating}
                                                </div>
                                            </div>

                                            <p className="text-sm leading-6 text-stone-600 dark:text-stone-300">
                                                {room.description}
                                            </p>

                                            <div className="flex items-center justify-between border-t border-stone-200 pt-4 dark:border-white/10">
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.16em] text-stone-400">
                                                        per night
                                                    </p>
                                                    <p className="mt-1 text-xl font-semibold text-stone-900 dark:text-white">
                                                        {room.price}
                                                    </p>
                                                </div>
                                                <span className="inline-flex items-center rounded-full bg-stone-950 px-3 py-2 text-xs font-semibold text-white transition group-hover:bg-stone-800 dark:bg-white dark:text-stone-950">
                                                    View demo
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,_rgba(36,26,17,0.96),_rgba(70,49,29,0.96))] p-6 text-stone-100 shadow-[0_30px_80px_-30px_rgba(38,24,13,0.9)] dark:border-white/10 dark:bg-[linear-gradient(180deg,_rgba(18,27,43,0.98),_rgba(12,59,87,0.9))]">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/85">
                                For both sides
                            </p>
                            <h2
                                className="mt-3 text-3xl font-semibold"
                                style={{ fontFamily: '"Sora", var(--font-sans)' }}
                            >
                                Built for hosts and renters.
                            </h2>

                            <div className="mt-6 space-y-4">
                                <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                                    <p className="text-sm font-semibold text-white">
                                        Room owners
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-stone-300">
                                        Add a room, choose the city, set the nightly
                                        price, and let the listing speak clearly.
                                    </p>
                                </div>
                                <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                                    <p className="text-sm font-semibold text-white">
                                        People renting
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-stone-300">
                                        Compare location, price, host quality, and
                                        booking windows before you commit.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 rounded-[1.5rem] bg-white px-4 py-4 text-stone-900">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                                    Demo insight
                                </p>
                                <p className="mt-2 text-lg font-semibold">
                                    The homepage is using fake content only, ready to
                                    be replaced with real room and city data later.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
