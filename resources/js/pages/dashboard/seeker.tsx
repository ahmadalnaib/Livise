import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, BedDouble, Heart, MapPinned, RotateCcw, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { tenant } from '@/routes/dashboard';

type RoomCard = {
    id: number;
    title: string;
    city: string;
    pricePerNight: string;
    tags: string[];
    image: string;
    description: string;
    ownerName: string;
};

type PreferenceAnswers = {
    roomSize: string;
    budget: string;
    roommatePreference: string;
    preferredCityType: string;
    stayLength: string;
};

type SeekerSession = {
    answers: PreferenceAnswers | null;
    likedRoomIds: number[];
    passedRoomIds: number[];
    currentIndex: number;
    questionnaireCompleted: boolean;
};

type PageProps = {
    rooms: RoomCard[];
    favoriteRooms: RoomCard[];
    seekerSession: SeekerSession;
};

const emptyAnswers: PreferenceAnswers = {
    roomSize: '',
    budget: '',
    roommatePreference: '',
    preferredCityType: '',
    stayLength: '',
};

const questions: Array<{
    field: keyof PreferenceAnswers;
    eyebrow: string;
    title: string;
    helper: string;
    options: Array<{ value: string; label: string; caption: string }>;
}> = [
        {
            field: 'roomSize',
            eyebrow: 'Question 1',
            title: 'What kind of room size feels right for you?',
            helper: 'Choose the amount of personal space you want to see first in the deck.',
            options: [
                { value: 'small', label: 'Small', caption: 'Compact and efficient.' },
                { value: 'medium', label: 'Medium', caption: 'Balanced comfort for daily stays.' },
                { value: 'large', label: 'Large', caption: 'Extra space to relax and work.' },
            ],
        },
        {
            field: 'budget',
            eyebrow: 'Question 2',
            title: 'How much do you want to spend per night?',
            helper: 'This keeps the next room cards close to your price comfort zone.',
            options: [
                { value: 'low', label: 'Under $40', caption: 'Budget-first stays.' },
                { value: 'mid', label: '$40 - $60', caption: 'The most balanced range.' },
                { value: 'high', label: 'Over $60', caption: 'Premium feel and location.' },
            ],
        },
        {
            field: 'roommatePreference',
            eyebrow: 'Question 3',
            title: 'Do you want a private or shared setup?',
            helper: 'We will use this to shape the room mood and privacy level you see.',
            options: [
                { value: 'private', label: 'Private', caption: 'Your own calm space.' },
                { value: 'shared', label: 'Shared', caption: 'Social and lower cost.' },
                { value: 'either', label: 'Either', caption: 'Show me the best options.' },
            ],
        },
        {
            field: 'preferredCityType',
            eyebrow: 'Question 4',
            title: 'Which kind of area fits your lifestyle?',
            helper: 'Some seekers want city energy, others want slower and quieter neighborhoods.',
            options: [
                { value: 'central', label: 'Central', caption: 'Walkable and connected.' },
                { value: 'quiet', label: 'Quiet', caption: 'Calm streets and less noise.' },
                { value: 'coastal', label: 'Coastal', caption: 'Relaxed rooms near the sea.' },
            ],
        },
        {
            field: 'stayLength',
            eyebrow: 'Question 5',
            title: 'How long do you expect to stay?',
            helper: 'This helps highlight flexible listings with the right stay rhythm.',
            options: [
                { value: 'short', label: '1-7 days', caption: 'Quick visits and short breaks.' },
                { value: 'medium', label: '1-4 weeks', caption: 'A comfortable medium stay.' },
                { value: 'long', label: '1+ month', caption: 'Long-term living mode.' },
            ],
        },
    ];

function firstIncompleteQuestionIndex(answers: PreferenceAnswers): number {
    const index = questions.findIndex((question) => answers[question.field] === '');

    return index === -1 ? questions.length - 1 : index;
}

export default function SeekerDashboard() {
    const { rooms, seekerSession, favoriteRooms } = usePage<PageProps>().props;
    const [answers, setAnswers] = useState<PreferenceAnswers>(seekerSession.answers ?? emptyAnswers);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() =>
        firstIncompleteQuestionIndex(seekerSession.answers ?? emptyAnswers),
    );

    const remainingCount = Math.max(rooms.length - seekerSession.likedRoomIds.length, 0);
    const likedCount = seekerSession.likedRoomIds.length;
    const isQuestionnaireCompleted = seekerSession.questionnaireCompleted;
    const hasAnsweredAllQuestions = Object.values(answers).every(Boolean);
    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerChange = (field: keyof PreferenceAnswers, value: string): void => {
        setAnswers((previousAnswers) => ({
            ...previousAnswers,
            [field]: value,
        }));
    };

    const handleQuestionAnswer = (field: keyof PreferenceAnswers, value: string): void => {
        handleAnswerChange(field, value);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((index) => Math.min(index + 1, questions.length - 1));
        }
    };

    const handlePreviousQuestion = (): void => {
        setCurrentQuestionIndex((index) => Math.max(index - 1, 0));
    };

    const handleNextQuestion = (): void => {
        if (!answers[currentQuestion.field]) {
            return;
        }

        setCurrentQuestionIndex((index) => Math.min(index + 1, questions.length - 1));
    };

    const handleQuestionnaireSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (!hasAnsweredAllQuestions) {
            return;
        }

        router.post(tenant.preferences.store(), answers, {
            preserveScroll: true,
            preserveState: false,
        });
    };

    const favoriteRoom = (roomId: number): void => {
        if (seekerSession.likedRoomIds.includes(roomId)) {
            return;
        }

        router.post(
            tenant.swipe.store(),
            {
                roomId,
                direction: 'right',
            },
            {
                preserveScroll: true,
                preserveState: false,
            },
        );
    };

    const resetDeck = (): void => {
        router.post(tenant.reset(), {}, {
            preserveScroll: true,
            preserveState: false,
        });
    };

    return (
        <>
            <Head title="Tenant Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <Heart className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Liked rooms</p>
                        <p className="text-2xl font-semibold">{likedCount}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <MapPinned className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Available rooms</p>
                        <p className="text-2xl font-semibold">{Math.max(remainingCount, 0)}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <BedDouble className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Seeded rooms</p>
                        <p className="text-2xl font-semibold">{rooms.length}</p>
                    </div>
                </div>

                {!isQuestionnaireCompleted ? (
                    <div className="overflow-hidden rounded-4xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-sidebar">
                        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                            <div className="bg-[radial-gradient(circle_at_top,rgba(217,119,6,0.18),transparent_58%),linear-gradient(180deg,rgba(24,24,27,0.96),rgba(39,39,42,0.92))] p-8 text-white">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
                                    <Sparkles className="size-3.5" />
                                    Match Setup
                                </div>

                                <h2 className="mt-6 max-w-sm text-3xl font-semibold leading-tight">
                                    Let&apos;s shape your room feed one choice at a time.
                                </h2>
                                <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
                                    Instead of a long form, you answer one focused question, then we open a cleaner room browsing flow.
                                </p>

                                <div className="mt-10 space-y-4">
                                    {questions.map((question, index) => {
                                        const isActive = index === currentQuestionIndex;
                                        const isDone = answers[question.field] !== '';

                                        return (
                                            <div
                                                key={question.field}
                                                className={`rounded-2xl border px-4 py-3 transition ${isActive
                                                    ? 'border-white/30 bg-white/14'
                                                    : isDone
                                                        ? 'border-emerald-300/30 bg-emerald-300/10'
                                                        : 'border-white/10 bg-white/5'
                                                    }`}
                                            >
                                                <p className="text-xs uppercase tracking-[0.25em] text-white/55">{question.eyebrow}</p>
                                                <p className="mt-1 text-sm font-medium text-white/90">{question.title}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <form onSubmit={handleQuestionnaireSubmit} className="flex flex-col justify-between p-8">
                                <div>
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                                {currentQuestion.eyebrow}
                                            </p>
                                            <h3 className="mt-3 max-w-xl text-2xl font-semibold leading-tight">
                                                {currentQuestion.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {currentQuestionIndex + 1} / {questions.length}
                                        </p>
                                    </div>

                                    <div className="mt-6 h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all duration-300"
                                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                                        />
                                    </div>

                                    <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
                                        {currentQuestion.helper}
                                    </p>

                                    <div className="mt-8 grid gap-3">
                                        {currentQuestion.options.map((option) => {
                                            const isSelected = answers[currentQuestion.field] === option.value;

                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => handleQuestionAnswer(currentQuestion.field, option.value)}
                                                    className={`rounded-2xl border px-5 py-4 text-left transition ${isSelected
                                                        ? 'border-primary bg-primary/8 shadow-sm'
                                                        : 'border-sidebar-border/70 hover:border-primary/40 hover:bg-primary/4 dark:border-sidebar-border'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div>
                                                            <p className="text-base font-semibold">{option.label}</p>
                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                {option.caption}
                                                            </p>
                                                        </div>
                                                        <div
                                                            className={`size-4 rounded-full border ${isSelected
                                                                ? 'border-primary bg-primary'
                                                                : 'border-sidebar-border/70 dark:border-sidebar-border'
                                                                }`}
                                                        />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col gap-4 border-t border-sidebar-border/70 pt-6 dark:border-sidebar-border sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={handlePreviousQuestion}
                                            disabled={currentQuestionIndex === 0}
                                            className="inline-flex items-center gap-2 rounded-full border border-sidebar-border/70 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 dark:border-sidebar-border"
                                        >
                                            <ArrowLeft className="size-4" />
                                            Back
                                        </button>

                                        {currentQuestionIndex < questions.length - 1 ? (
                                            <button
                                                type="button"
                                                onClick={handleNextQuestion}
                                                disabled={!answers[currentQuestion.field]}
                                                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Next
                                                <ArrowRight className="size-4" />
                                            </button>
                                        ) : null}
                                    </div>

                                    {currentQuestionIndex === questions.length - 1 ? (
                                        <button
                                            type="submit"
                                            disabled={!hasAnsweredAllQuestions}
                                            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Show room list
                                        </button>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Pick an answer to move forward.
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Available Room List</h2>
                                <button
                                    type="button"
                                    onClick={resetDeck}
                                    className="inline-flex items-center gap-2 rounded-full border border-sidebar-border/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition hover:border-primary/40 hover:text-primary dark:border-sidebar-border"
                                >
                                    <RotateCcw className="size-3.5" />
                                    Reset answers
                                </button>
                            </div>

                            {rooms.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {rooms.map((room) => {
                                        const isFavorite = seekerSession.likedRoomIds.includes(room.id);

                                        return (
                                            <article
                                                key={room.id}
                                                className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-white shadow-sm transition hover:shadow-md dark:border-sidebar-border dark:bg-sidebar"
                                            >
                                                <img src={room.image} alt={room.title} className="h-44 w-full object-cover" />

                                                <div className="space-y-3 p-4">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                                {room.city}
                                                            </p>
                                                            <h3 className="text-base font-semibold">{room.title}</h3>
                                                        </div>
                                                        <p className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                                            {room.pricePerNight}
                                                        </p>
                                                    </div>

                                                    <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                                                        {room.description}
                                                    </p>

                                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                        Hosted by {room.ownerName}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2">
                                                        {room.tags.map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="rounded-full border border-sidebar-border/70 px-2.5 py-1 text-xs dark:border-sidebar-border"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="grid gap-2 pt-1 sm:grid-cols-2">
                                                        <Link
                                                            href={tenant.rooms.show.url(room.id)}
                                                            className="inline-flex items-center justify-center rounded-lg border border-sidebar-border/70 px-3 py-2 text-sm font-semibold transition hover:border-primary/40 hover:bg-primary/5 dark:border-sidebar-border"
                                                        >
                                                            View details
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => favoriteRoom(room.id)}
                                                            disabled={isFavorite}
                                                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            <Heart className="size-4" />
                                                            {isFavorite ? 'Favorited' : 'Add favorite'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-sidebar-border/80 p-8 text-center dark:border-sidebar-border">
                                    <h3 className="text-xl font-semibold">No rooms found</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Seeded rooms will appear here when available.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                            <h2 className="text-lg font-semibold">My Favorite Rooms Profile</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Add favorite to keep the rooms you love in one place.
                            </p>

                            {favoriteRooms.length > 0 ? (
                                <ul className="mt-4 space-y-3">
                                    {favoriteRooms.map((room) => (
                                        <li
                                            key={room.id}
                                            className="rounded-lg border border-sidebar-border/70 p-2 dark:border-sidebar-border"
                                        >
                                            <Link
                                                href={tenant.rooms.show.url(room.id)}
                                                className="flex items-center gap-3"
                                            >
                                                <img
                                                    src={room.image}
                                                    alt={room.title}
                                                    className="h-12 w-14 rounded-md object-cover"
                                                />
                                                <div>
                                                    <p className="text-sm font-semibold">{room.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {room.city} • {room.pricePerNight}
                                                    </p>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-4 text-sm text-muted-foreground">
                                    No favorite rooms yet. Tap Add favorite on any room.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

SeekerDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Tenant Dashboard',
            href: tenant(),
        },
    ],
};
