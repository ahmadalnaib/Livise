import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Check, MapPin, Phone, X } from 'lucide-react';

type LandlordRequest = {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    city: string | null;
    notes: string | null;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
};

type PageProps = {
    requests: LandlordRequest[];
};

export default function AdminLandlordRequests() {
    const { requests } = usePage<PageProps>().props;

    const updateStatus = async (id: number, status: 'approved' | 'rejected') => {
        await fetch(`/dashboard/admin/landlord-requests/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({ status }),
        });
        window.location.reload();
    };

    return (
        <>
            <Head title="Landlord Requests" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-full border border-sidebar-border/70 px-4 py-2 text-sm font-medium transition hover:border-primary/40 hover:bg-primary/5 dark:border-sidebar-border"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Dashboard
                    </Link>
                </div>

                <div className="rounded-4xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <h1 className="text-2xl font-bold">Landlord Requests</h1>
                    <p className="mt-1 text-muted-foreground">People who want to list their rooms</p>

                    {requests.length === 0 ? (
                        <p className="mt-8 text-center text-muted-foreground">No requests yet.</p>
                    ) : (
                        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {requests.map((request) => (
                                <div
                                    key={request.id}
                                    className="rounded-2xl border border-sidebar-border/70 p-5 dark:border-sidebar-border"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold">{request.name}</h3>
                                            <span
                                                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${request.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        : request.status === 'approved'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}
                                            >
                                                {request.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <a
                                            href={`tel:${request.phone}`}
                                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                                        >
                                            <Phone className="size-4" />
                                            {request.phone}
                                        </a>
                                        {request.email && (
                                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                                ✉️ {request.email}
                                            </p>
                                        )}
                                        {(request.address || request.city) && (
                                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="size-4" />
                                                {request.address}
                                                {request.city && `, ${request.city}`}
                                            </p>
                                        )}
                                        {request.notes && (
                                            <p className="mt-2 text-sm text-muted-foreground italic">
                                                "{request.notes}"
                                            </p>
                                        )}
                                    </div>

                                    {request.status === 'pending' && (
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => updateStatus(request.id, 'approved')}
                                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                            >
                                                <Check className="size-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(request.id, 'rejected')}
                                                className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                                            >
                                                <X className="size-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

AdminLandlordRequests.breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Landlord Requests', href: '/dashboard/admin/landlord-requests' },
];