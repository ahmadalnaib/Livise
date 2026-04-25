import { Head } from '@inertiajs/react';
import { BedDouble, Heart, MapPinned, RotateCcw, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { seeker } from '@/routes/dashboard';

type RoomCard = {
    id: number;
    title: string;
    city: string;
    pricePerNight: string;
    tags: string[];
    image: string;
};

type PreferenceAnswers = {
    roomSize: string;
    budget: string;
    roommatePreference: string;
    preferredCityType: string;
    stayLength: string;
};

const roomDeck: RoomCard[] = [
    {
        id: 1,
        title: 'Sunset Balcony Studio',
        city: 'Amman',
        pricePerNight: '$46',
        tags: ['Wi-Fi', 'Near Downtown', 'Balcony'],
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 2,
        title: 'Aqaba Sea Breeze Room',
        city: 'Aqaba',
        pricePerNight: '$58',
        tags: ['Sea View', 'Private Bath', 'AC'],
        image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 3,
        title: 'Minimal Corner Loft',
        city: 'Irbid',
        pricePerNight: '$39',
        tags: ['Quiet Area', 'Kitchen', 'Long Stay'],
        image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    },
    {
        id: 4,
        title: 'Olive Garden Room',
        city: 'Jerash',
        pricePerNight: '$41',
        tags: ['Parking', 'Garden', 'Fast Check-in'],
        image: 'https://images.unsplash.com/photo-1464890100898-a385f744067f?auto=format&fit=crop&w=1200&q=80',
    },
];

export default function SeekerDashboard() {
    const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [likedCount, setLikedCount] = useState(0);
    const [passedCount, setPassedCount] = useState(0);
    const [favoriteRooms, setFavoriteRooms] = useState<RoomCard[]>([]);
    const [answers, setAnswers] = useState<PreferenceAnswers>({
        roomSize: '',
        budget: '',
        roommatePreference: '',
        preferredCityType: '',
        stayLength: '',
    });

    const currentRoom = roomDeck[currentIndex];
    const remainingCount = roomDeck.length - currentIndex;
    const hasAnsweredAllQuestions = Object.values(answers).every(Boolean);

    const completion = useMemo(() => {
        return Math.round((currentIndex / roomDeck.length) * 100);
    }, [currentIndex]);

    const handleAnswerChange = (field: keyof PreferenceAnswers, value: string): void => {
        setAnswers((previousAnswers) => ({
            ...previousAnswers,
            [field]: value,
        }));
    };

    const handleQuestionnaireSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (!hasAnsweredAllQuestions) {
            return;
        }

        setIsQuestionnaireCompleted(true);
    };

    const handleLike = useCallback((): void => {
        if (!currentRoom) {
            return;
        }

        setLikedCount((count) => count + 1);
        setFavoriteRooms((rooms) => {
            if (rooms.some((room) => room.id === currentRoom.id)) {
                return rooms;
            }

            return [currentRoom, ...rooms];
        });
        setCurrentIndex((index) => index + 1);
    }, [currentRoom]);

    const handlePass = useCallback((): void => {
        if (!currentRoom) {
            return;
        }

        setPassedCount((count) => count + 1);
        setCurrentIndex((index) => index + 1);
    }, [currentRoom]);

    const resetDeck = (): void => {
        setCurrentIndex(0);
        setLikedCount(0);
        setPassedCount(0);
        setFavoriteRooms([]);
        setIsQuestionnaireCompleted(false);
        setAnswers({
            roomSize: '',
            budget: '',
            roommatePreference: '',
            preferredCityType: '',
            stayLength: '',
        });
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent): void => {
            if (!isQuestionnaireCompleted || !currentRoom) {
                return;
            }

            if (event.key === 'ArrowLeft') {
                handlePass();
            }

            if (event.key === 'ArrowRight') {
                handleLike();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentRoom, handleLike, handlePass, isQuestionnaireCompleted]);

    return (
        <>
            <Head title="Seeker Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <Heart className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Liked rooms</p>
                        <p className="text-2xl font-semibold">{likedCount}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <MapPinned className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Cards remaining</p>
                        <p className="text-2xl font-semibold">{Math.max(remainingCount, 0)}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                        <BedDouble className="mb-2 size-5 text-primary" />
                        <p className="text-xs text-muted-foreground">Passed rooms</p>
                        <p className="text-2xl font-semibold">{passedCount}</p>
                    </div>
                </div>

                {!isQuestionnaireCompleted ? (
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                        <div className="mb-5">
                            <h2 className="text-lg font-semibold">Before we show rooms, answer 5 questions</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                We will use these answers to shape your swipe experience.
                            </p>
                        </div>

                        <form onSubmit={handleQuestionnaireSubmit} className="grid gap-4 md:grid-cols-2">
                            <label className="grid gap-2 text-sm font-medium">
                                1. What room size do you prefer?
                                <select
                                    value={answers.roomSize}
                                    onChange={(event) => handleAnswerChange('roomSize', event.target.value)}
                                    className="h-10 rounded-md border border-sidebar-border/70 bg-transparent px-3 text-sm dark:border-sidebar-border"
                                >
                                    <option value="">Select size</option>
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                            </label>

                            <label className="grid gap-2 text-sm font-medium">
                                2. What is your nightly budget?
                                <select
                                    value={answers.budget}
                                    onChange={(event) => handleAnswerChange('budget', event.target.value)}
                                    className="h-10 rounded-md border border-sidebar-border/70 bg-transparent px-3 text-sm dark:border-sidebar-border"
                                >
                                    <option value="">Select budget</option>
                                    <option value="low">Under $40</option>
                                    <option value="mid">$40 - $60</option>
                                    <option value="high">Over $60</option>
                                </select>
                            </label>

                            <label className="grid gap-2 text-sm font-medium">
                                3. Shared room or private room?
                                <select
                                    value={answers.roommatePreference}
                                    onChange={(event) => handleAnswerChange('roommatePreference', event.target.value)}
                                    className="h-10 rounded-md border border-sidebar-border/70 bg-transparent px-3 text-sm dark:border-sidebar-border"
                                >
                                    <option value="">Select preference</option>
                                    <option value="private">Private</option>
                                    <option value="shared">Shared</option>
                                    <option value="either">Either</option>
                                </select>
                            </label>

                            <label className="grid gap-2 text-sm font-medium">
                                4. Which city type do you like?
                                <select
                                    value={answers.preferredCityType}
                                    onChange={(event) => handleAnswerChange('preferredCityType', event.target.value)}
                                    className="h-10 rounded-md border border-sidebar-border/70 bg-transparent px-3 text-sm dark:border-sidebar-border"
                                >
                                    <option value="">Select city type</option>
                                    <option value="central">Central</option>
                                    <option value="quiet">Quiet area</option>
                                    <option value="coastal">Coastal</option>
                                </select>
                            </label>

                            <label className="grid gap-2 text-sm font-medium md:col-span-2">
                                5. How long is your expected stay?
                                <select
                                    value={answers.stayLength}
                                    onChange={(event) => handleAnswerChange('stayLength', event.target.value)}
                                    className="h-10 rounded-md border border-sidebar-border/70 bg-transparent px-3 text-sm dark:border-sidebar-border"
                                >
                                    <option value="">Select stay length</option>
                                    <option value="short">1-7 days</option>
                                    <option value="medium">1-4 weeks</option>
                                    <option value="long">1+ month</option>
                                </select>
                            </label>

                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    disabled={!hasAnsweredAllQuestions}
                                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Start Tinder Swipe
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Swipe Rooms</h2>
                                <p className="text-xs text-muted-foreground">{completion}% complete</p>
                            </div>

                            {currentRoom ? (
                                <div className="mx-auto max-w-md">
                                    <div className="relative overflow-hidden rounded-2xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-sidebar">
                                        <img
                                            src={currentRoom.image}
                                            alt={currentRoom.title}
                                            className="h-72 w-full object-cover"
                                        />
                                        <div className="space-y-3 p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                        {currentRoom.city}
                                                    </p>
                                                    <h3 className="text-xl font-semibold">{currentRoom.title}</h3>
                                                </div>
                                                <p className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                                                    {currentRoom.pricePerNight}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {currentRoom.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded-full border border-sidebar-border/70 px-2.5 py-1 text-xs dark:border-sidebar-border"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={handlePass}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
                                        >
                                            <X className="size-4" />
                                            Left (Pass)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleLike}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
                                        >
                                            <Heart className="size-4" />
                                            Right (Like)
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-sidebar-border/80 p-8 text-center dark:border-sidebar-border">
                                    <h3 className="text-xl font-semibold">Deck finished</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        You have reviewed all available room cards.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={resetDeck}
                                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                                    >
                                        <RotateCcw className="size-4" />
                                        Start again
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                            <h2 className="text-lg font-semibold">My Favorite Rooms Profile</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Right swipe adds the room to your profile favorites.
                            </p>

                            {favoriteRooms.length > 0 ? (
                                <ul className="mt-4 space-y-3">
                                    {favoriteRooms.map((room) => (
                                        <li
                                            key={room.id}
                                            className="flex items-center gap-3 rounded-lg border border-sidebar-border/70 p-2 dark:border-sidebar-border"
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
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-4 text-sm text-muted-foreground">
                                    No favorite rooms yet. Swipe right to add rooms here.
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
            title: 'Seeker Dashboard',
            href: seeker(),
        },
    ],
};
