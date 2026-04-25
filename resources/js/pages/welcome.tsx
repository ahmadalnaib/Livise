import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, Home, KeyRound, Zap } from 'lucide-react';
import { landlord, tenant } from '@/routes/welcome';

type WelcomeProps = {
    canRegister?: boolean;
};

export default function Welcome({ canRegister = true }: WelcomeProps) {
    return (
        <>
            <Head title="LivingSpace - Find & List Rooms">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=manrope:400,500,600,700,800|fraunces:500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-[#f5f1ea] via-white to-[#f5f1ea] text-stone-900 dark:from-[#101826] dark:via-[#151e2e] dark:to-[#101826] dark:text-stone-100">
                <div
                    className="mx-auto w-full px-6 lg:px-8"
                    style={{ fontFamily: '"Manrope", var(--font-sans)' }}
                >
                    {/* Hero Section */}
                    <div className="mx-auto max-w-6xl py-16 lg:py-24">
                        <div className="text-center">
                            <h1
                                className="text-5xl leading-tight font-bold tracking-tight text-stone-900 sm:text-7xl dark:text-white"
                                style={{ fontFamily: '"Fraunces", serif' }}
                            >
                                Find Your Perfect <span className="text-primary">Room</span>
                            </h1>
                            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-stone-600 dark:text-stone-300">
                                <span className="font-semibold">LivingSpace</span> connects tenants searching for comfortable rooms with landlords who want to rent them out. Simple, fast, and transparent.
                            </p>
                            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                                <div className="inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-200">
                                    <CheckCircle2 className="size-5 text-green-600" />
                                    100% Free to Join
                                </div>
                                <div className="inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-200">
                                    <CheckCircle2 className="size-5 text-green-600" />
                                    Verified Listings
                                </div>
                                <div className="inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-200">
                                    <CheckCircle2 className="size-5 text-green-600" />
                                    Fast Bookings
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mx-auto max-w-6xl pb-20">
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="rounded-2xl border border-black/8 bg-white/50 p-8 dark:border-white/10 dark:bg-white/6">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <Zap className="size-6" />
                                </div>
                                <h3 className="mb-3 text-lg font-bold">Quick & Easy</h3>
                                <p className="text-sm text-stone-600 dark:text-stone-400">
                                    Browse hundreds of verified rooms, compare prices, and book in minutes.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-black/8 bg-white/50 p-8 dark:border-white/10 dark:bg-white/6">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                    <CheckCircle2 className="size-6" />
                                </div>
                                <h3 className="mb-3 text-lg font-bold">Safe & Verified</h3>
                                <p className="text-sm text-stone-600 dark:text-stone-400">
                                    All listings are verified and landlords are trusted members of our community.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-black/8 bg-white/50 p-8 dark:border-white/10 dark:bg-white/6">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                    <ArrowRight className="size-6" />
                                </div>
                                <h3 className="mb-3 text-lg font-bold">Transparent</h3>
                                <p className="text-sm text-stone-600 dark:text-stone-400">
                                    No hidden fees. Clear pricing and instant confirmation for bookings.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="mx-auto max-w-6xl pb-20">
                        <div className="mb-12 text-center">
                            <h2
                                className="text-4xl font-bold text-stone-900 dark:text-white"
                                style={{ fontFamily: '"Fraunces", serif' }}
                            >
                                Choose Your Role
                            </h2>
                            <p className="mt-4 text-stone-600 dark:text-stone-300">
                                Select what you're looking for to get started
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2">
                            <Link
                                href={tenant()}
                                className="group relative overflow-hidden rounded-3xl border-2 border-black/8 bg-gradient-to-br from-white/80 to-white/40 p-10 shadow-lg transition hover:border-primary hover:-translate-y-2 hover:shadow-2xl dark:border-white/10 dark:from-white/8 dark:to-white/4"
                            >
                                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-100 opacity-20 dark:bg-blue-900/20 blur-3xl" />
                                <div className="relative z-10">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        <KeyRound className="size-8" />
                                    </div>
                                    <h3
                                        className="text-4xl font-bold text-stone-900 dark:text-white"
                                        style={{ fontFamily: '"Fraunces", serif' }}
                                    >
                                        I'm a Tenant
                                    </h3>
                                    <p className="mt-4 text-stone-600 dark:text-stone-400">
                                        Browse verified rooms by city, check photos and prices, compare amenities, and find your perfect stay.
                                    </p>
                                    <div className="mt-8 flex items-center gap-2">
                                        <span className="text-sm font-semibold text-primary">
                                            Find a room
                                        </span>
                                        <ArrowRight className="size-5 transition group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href={landlord()}
                                className="group relative overflow-hidden rounded-3xl border-2 border-black/8 bg-gradient-to-br from-white/80 to-white/40 p-10 shadow-lg transition hover:border-green-500 hover:-translate-y-2 hover:shadow-2xl dark:border-white/10 dark:from-white/8 dark:to-white/4"
                            >
                                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-green-100 opacity-20 dark:bg-green-900/20 blur-3xl" />
                                <div className="relative z-10">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                        <Home className="size-8" />
                                    </div>
                                    <h3
                                        className="text-4xl font-bold text-stone-900 dark:text-white"
                                        style={{ fontFamily: '"Fraunces", serif' }}
                                    >
                                        I'm a Landlord
                                    </h3>
                                    <p className="mt-4 text-stone-600 dark:text-stone-400">
                                        List your rooms easily, reach qualified tenants, manage bookings, and earn steady income.
                                    </p>
                                    <div className="mt-8 flex items-center gap-2">
                                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                            Start listing
                                        </span>
                                        <ArrowRight className="size-5 transition group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {canRegister ? (
                            <div className="mt-12 text-center">
                                <p className="text-stone-600 dark:text-stone-400">
                                    No account yet? You can register after choosing your role.
                                </p>
                            </div>
                        ) : null}
                    </div>

                    {/* How It Works Section */}
                    <div className="mx-auto max-w-6xl py-20 lg:py-24">
                        <div className="mb-16 text-center">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-stone-500 dark:text-stone-400">
                                Getting started
                            </p>
                            <h2
                                className="text-4xl font-bold text-stone-900 dark:text-white sm:text-5xl"
                                style={{ fontFamily: '"Fraunces", serif' }}
                            >
                                How It Works
                            </h2>
                            <p className="mt-4 text-stone-600 dark:text-stone-300">
                                Simple steps to get started
                            </p>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-2">
                            <section className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm dark:border-blue-400/20 dark:bg-white/6 sm:p-8">
                                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-500/20" />
                                <div className="relative">
                                    <h3 className="text-2xl font-bold text-stone-900 dark:text-white">For Tenants</h3>
                                    <div className="mt-7 space-y-5">
                                        {[
                                            { step: '1', title: 'Create Account', desc: 'Sign up as a tenant in 30 seconds' },
                                            { step: '2', title: 'Browse Rooms', desc: 'Explore verified listings by city and budget' },
                                            { step: '3', title: 'Request Booking', desc: 'Send a booking request to your favorite room' },
                                            { step: '4', title: 'Move In', desc: 'Get approval and move into your new home' },
                                        ].map((item, index) => (
                                            <div key={item.step} className="group relative flex gap-4 rounded-2xl border border-blue-200/70 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-blue-400/20 dark:bg-white/8">
                                                {index !== 3 ? (
                                                    <span className="absolute left-9 top-14 h-8 w-px bg-blue-300/70 dark:bg-blue-400/40" aria-hidden="true" />
                                                ) : null}
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-sm dark:bg-blue-500">
                                                    {item.step}
                                                </div>
                                                <div className="pt-0.5">
                                                    <h4 className="font-semibold text-stone-900 dark:text-white">{item.title}</h4>
                                                    <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm dark:border-emerald-400/20 dark:bg-white/6 sm:p-8">
                                <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/20" />
                                <div className="relative">
                                    <h3 className="text-2xl font-bold text-stone-900 dark:text-white">For Landlords</h3>
                                    <div className="mt-7 space-y-5">
                                        {[
                                            { step: '1', title: 'Create Account', desc: 'Sign up as a landlord in 30 seconds' },
                                            { step: '2', title: 'List Your Room', desc: 'Add photos, price, and city details' },
                                            { step: '3', title: 'Get Requests', desc: 'Receive booking requests from interested tenants' },
                                            { step: '4', title: 'Approve & Earn', desc: 'Approve bookings and start earning' },
                                        ].map((item, index) => (
                                            <div key={item.step} className="group relative flex gap-4 rounded-2xl border border-emerald-200/70 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-emerald-400/20 dark:bg-white/8">
                                                {index !== 3 ? (
                                                    <span className="absolute left-9 top-14 h-8 w-px bg-emerald-300/70 dark:bg-emerald-400/40" aria-hidden="true" />
                                                ) : null}
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-bold text-white shadow-sm dark:bg-emerald-500">
                                                    {item.step}
                                                </div>
                                                <div className="pt-0.5">
                                                    <h4 className="font-semibold text-stone-900 dark:text-white">{item.title}</h4>
                                                    <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Testimonials Section */}
                    <div className="mx-auto max-w-6xl py-20 lg:py-24">
                        <div className="mb-16 text-center">
                            <h2
                                className="text-4xl font-bold text-stone-900 dark:text-white"
                                style={{ fontFamily: '"Fraunces", serif' }}
                            >
                                What Users Say
                            </h2>
                            <p className="mt-4 text-stone-600 dark:text-stone-300">
                                Join thousands of happy tenants and landlords
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {[
                                {
                                    quote: "Found my perfect apartment in just 2 days! The process was super smooth and the landlord was very responsive.",
                                    author: 'Sarah Johnson',
                                    role: 'Tenant',
                                    rating: 5,
                                },
                                {
                                    quote: "LivingSpace made listing my rooms so easy. I got verified tenants quickly and the whole process is transparent.",
                                    author: 'Ahmed Al-Rashid',
                                    role: 'Landlord',
                                    rating: 5,
                                },
                                {
                                    quote: "The best platform I've used for finding rental rooms. Safe, verified listings and excellent customer support!",
                                    author: 'Maria Chen',
                                    role: 'Tenant',
                                    rating: 5,
                                },
                            ].map((testimonial, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-2xl border border-black/8 bg-white/50 p-8 dark:border-white/10 dark:bg-white/6"
                                >
                                    <div className="mb-4 flex gap-1">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <span key={i} className="text-xl">⭐</span>
                                        ))}
                                    </div>
                                    <p className="mb-6 text-stone-700 dark:text-stone-300">"{testimonial.quote}"</p>
                                    <div>
                                        <p className="font-semibold text-stone-900 dark:text-white">{testimonial.author}</p>
                                        <p className="text-sm text-stone-600 dark:text-stone-400">{testimonial.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mx-auto max-w-3xl py-20 lg:py-24">
                        <div className="mb-16 text-center">
                            <h2
                                className="text-4xl font-bold text-stone-900 dark:text-white"
                                style={{ fontFamily: '"Fraunces", serif' }}
                            >
                                Frequently Asked Questions
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {[
                                {
                                    q: 'Is it free to join LivingSpace?',
                                    a: 'Yes! Creating an account and browsing listings is 100% free. Landlords also list for free, and there are no hidden fees.',
                                },
                                {
                                    q: 'How do I know if a listing is verified?',
                                    a: 'All listings on LivingSpace go through our verification process. We check landlord credentials and room details to ensure quality.',
                                },
                                {
                                    q: 'What happens after I send a booking request?',
                                    a: 'The landlord will review your request and respond within 24-48 hours. Once approved, you can arrange payment and move-in details.',
                                },
                                {
                                    q: 'How do landlords get paid?',
                                    a: 'Landlords can set their own prices and receive secure payments through our platform. Payments are transferred to their bank account.',
                                },
                                {
                                    q: 'Can I cancel my booking?',
                                    a: 'Yes, you can cancel before the move-in date according to our cancellation policy. Both tenants and landlords have protection.',
                                },
                                {
                                    q: 'Is my personal information safe?',
                                    a: 'Your privacy and security are our top priority. We use encryption and follow strict data protection standards.',
                                },
                            ].map((faq, idx) => (
                                <details
                                    key={idx}
                                    className="group rounded-lg border border-black/8 bg-white/50 dark:border-white/10 dark:bg-white/6"
                                >
                                    <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-stone-900 dark:text-white">
                                        {faq.q}
                                        <span className="transition group-open:rotate-180">▼</span>
                                    </summary>
                                    <div className="border-t border-black/8 px-6 pb-6 text-stone-600 dark:border-white/10 dark:text-stone-300">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Welcome.layout = null;

