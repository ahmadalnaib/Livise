import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Home, KeyRound } from 'lucide-react';
import { seeker, tenant } from '@/routes/welcome';

type WelcomeProps = {
    canRegister?: boolean;
};

export default function Welcome({ canRegister = true }: WelcomeProps) {

    return (
        <>
            <Head title="Choose Your Role">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=manrope:400,500,600,700,800|fraunces:500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-[#f5f1ea] text-stone-900 dark:bg-[#101826] dark:text-stone-100">
                <div
                    className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 lg:px-8 lg:py-10"
                    style={{ fontFamily: '"Manrope", var(--font-sans)' }}
                >
                    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-8 py-12 lg:py-16">
                        <div className="text-center">
                            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-stone-500 dark:text-stone-400">
                                room rental flow
                            </p>
                            <h1
                                className="text-5xl leading-[0.94] font-semibold tracking-tight text-stone-900 sm:text-6xl dark:text-white"
                                style={{ fontFamily: '"Fraunces", serif' }}
                            >
                                Choose your role first
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-stone-600 dark:text-stone-300 sm:text-lg">
                                Continue as a seeker to find rooms or continue as a tenant
                                (owner) to list rooms for rent.
                            </p>
                        </div>

                        <div className="grid w-full gap-6 md:grid-cols-2">
                            <Link
                                href={seeker()}
                                className="group overflow-hidden rounded-[2rem] border border-black/8 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/6"
                            >
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-900">
                                    <KeyRound className="size-5" />
                                </div>
                                <h2
                                    className="text-3xl font-semibold text-stone-900 dark:text-white"
                                    style={{ fontFamily: '"Fraunces", serif' }}
                                >
                                    I am a seeker
                                </h2>
                                <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
                                    Browse available rooms by city, compare photos and prices,
                                    and find your next stay.
                                </p>
                                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-stone-900">
                                    Open seeker page
                                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                                </div>
                            </Link>

                            <Link
                                href={tenant()}
                                className="group overflow-hidden rounded-[2rem] border border-black/8 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/6"
                            >
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-900">
                                    <Home className="size-5" />
                                </div>
                                <h2
                                    className="text-3xl font-semibold text-stone-900 dark:text-white"
                                    style={{ fontFamily: '"Fraunces", serif' }}
                                >
                                    I am a tenant
                                </h2>
                                <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
                                    Create room listings, add city details and pricing,
                                    and attract the right renters.
                                </p>
                                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-stone-900">
                                    Open tenant page
                                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                                </div>
                            </Link>
                        </div>

                        {canRegister ? (
                            <p className="text-center text-sm text-stone-500 dark:text-stone-400">
                                You can register after choosing your role.
                            </p>
                        ) : null}
                    </main>
                </div>
            </div>
        </>
    );
}
