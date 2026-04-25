import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { dashboard, home, login, register } from '@/routes';

const featuredRooms = [
    {
        title: 'Garden Light Studio',
        city: 'Amman',
        price: '$44',
        rating: '4.9',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    },
    {
        title: 'Sunset Balcony Room',
        city: 'Aqaba',
        price: '$59',
        rating: '4.8',
        image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    },
    {
        title: 'City Calm Apartment',
        city: 'Irbid',
        price: '$37',
        rating: '4.7',
        image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    },
];

type SeekerProps = {
    canRegister?: boolean;
};

type PageProps = {
    auth: {
        user: unknown | null;
    };
};

export default function SeekerWelcome({ canRegister = true }: SeekerProps) {
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
                                Rooms curated for seekers.
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
                            <article key={room.title} className="group overflow-hidden rounded-[1.6rem] border border-black/8 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#182233]">
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
                            </article>
                        ))}
                    </section>
                </div>
            </div>
        </>
    );
}

SeekerWelcome.layout = null;
