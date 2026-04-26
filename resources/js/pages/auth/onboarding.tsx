import { Head, useForm } from '@inertiajs/react';
import { Languages, Sparkles, Heart, ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';

type OnboardingProps = {
    languages?: string[];
    skills?: string[];
    hobbies?: string[];
    bio?: string;
};

const commonLanguages = [
    'English', 'German', 'Spanish', 'French', 'Italian', 'Portuguese',
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Turkish',
    'Polish', 'Dutch', 'Swedish', 'Greek', 'Hindi', 'Vietnamese',
];

const commonSkills = [
    'Cooking', 'Photography', 'Coding', 'Music', 'Art', 'Writing',
    'Fitness', 'Languages', 'DIY', 'Gardening', 'Gaming', 'Reading',
    'Sports', 'Crafts', 'Technology', 'Teaching', 'Cooking', 'Driving',
];

const commonHobbies = [
    'Hiking', 'Gaming', 'Reading', 'Movies', 'Music', 'Travel',
    'Cooking', 'Fitness', 'Art', 'Photography', 'Writing', 'Yoga',
    'Cycling', 'Swimming', 'Dancing', 'Skiing', 'Board games', 'Podcasts',
];

export default function Onboarding({
    languages: initialLanguages = [],
    skills: initialSkills = [],
    hobbies: initialHobbies = [],
    bio = '',
}: OnboardingProps) {
    const { data, setData, post, processing } = useForm({
        languages: initialLanguages,
        skills: initialSkills,
        hobbies: initialHobbies,
        bio: bio,
    });

    const [languageInput, setLanguageInput] = useState(initialLanguages.join(', '));
    const [skillsInput, setSkillsInput] = useState(initialSkills.join(', '));
    const [hobbiesInput, setHobbiesInput] = useState(initialHobbies.join(', '));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setData('languages', languageInput.split(',').map((s) => s.trim()).filter(Boolean));
        setData('skills', skillsInput.split(',').map((s) => s.trim()).filter(Boolean));
        setData('hobbies', hobbiesInput.split(',').map((s) => s.trim()).filter(Boolean));
        post('/onboarding');
    };

    const toggleItem = (field: 'languages' | 'skills' | 'hobbies', item: string) => {
        const current = data[field] || [];
        const updated = current.includes(item)
            ? current.filter((i: string) => i !== item)
            : [...current, item];
        setData(field, updated);
    };

    return (
        <>
            <Head title="Complete Your Profile" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f1ea] via-white to-[#f5f1ea] dark:from-[#101826] dark:via-[#151e2e] dark:to-[#101826] p-4">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-stone-900 dark:text-white" style={{ fontFamily: '"Fraunces", serif' }}>
                            Tell us about yourself
                        </h1>
                        <p className="mt-2 text-stone-600 dark:text-stone-400">
                            Help landlords get to know you better
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Languages */}
                        <div className="rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                    <Languages className="size-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Languages you speak</h2>
                                    <p className="text-sm text-muted-foreground">Select or type your languages</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {commonLanguages.slice(0, 12).map((lang) => (
                                    <button
                                        key={lang}
                                        type="button"
                                        onClick={() => toggleItem('languages', lang)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                                            (data.languages || []).includes(lang)
                                                ? 'bg-primary text-white'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        }`}
                                    >
                                        {(data.languages || []).includes(lang) && <Check className="size-3 inline mr-1" />}
                                        {lang}
                                    </button>
                                ))}
                            </div>

                            <input
                                type="text"
                                value={languageInput}
                                onChange={(e) => setLanguageInput(e.target.value)}
                                placeholder="Or add other languages (comma separated)"
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Skills */}
                        <div className="rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                                    <Sparkles className="size-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Your skills</h2>
                                    <p className="text-sm text-muted-foreground">What are you good at?</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {commonSkills.slice(0, 12).map((skill) => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => toggleItem('skills', skill)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                                            (data.skills || []).includes(skill)
                                                ? 'bg-green-600 text-white'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        }`}
                                    >
                                        {(data.skills || []).includes(skill) && <Check className="size-3 inline mr-1" />}
                                        {skill}
                                    </button>
                                ))}
                            </div>

                            <input
                                type="text"
                                value={skillsInput}
                                onChange={(e) => setSkillsInput(e.target.value)}
                                placeholder="Or add other skills (comma separated)"
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Hobbies */}
                        <div className="rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                                    <Heart className="size-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Hobbies & interests</h2>
                                    <p className="text-sm text-muted-foreground">What do you like to do in your free time?</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {commonHobbies.slice(0, 12).map((hobby) => (
                                    <button
                                        key={hobby}
                                        type="button"
                                        onClick={() => toggleItem('hobbies', hobby)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                                            (data.hobbies || []).includes(hobby)
                                                ? 'bg-amber-600 text-white'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        }`}
                                    >
                                        {(data.hobbies || []).includes(hobby) && <Check className="size-3 inline mr-1" />}
                                        {hobby}
                                    </button>
                                ))}
                            </div>

                            <input
                                type="text"
                                value={hobbiesInput}
                                onChange={(e) => setHobbiesInput(e.target.value)}
                                placeholder="Or add other hobbies (comma separated)"
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Bio */}
                        <div className="rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">About you</h2>
                                <p className="text-sm text-muted-foreground mb-4">Tell landlords a bit about yourself</p>
                                <textarea
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    placeholder="I'm a friendly person who loves meeting new people..."
                                    rows={4}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-lg font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Continue to Dashboard'}
                            <ArrowRight className="size-5" />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

Onboarding.layout = null;