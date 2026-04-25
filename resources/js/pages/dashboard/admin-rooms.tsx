import { Head, Link } from '@inertiajs/react';
import { admin } from '@/routes/dashboard';
import { list as roomsList, show as roomShow } from '@/routes/dashboard/admin/rooms';
import { show as userShow } from '@/routes/dashboard/admin/users';

type RoomRow = {
    id: number;
    title: string;
    city: string;
    landlordId: number | null;
    landlordName: string;
    landlordEmail: string;
    rentalsCount: number;
    status: string;
};

type PageProps = {
    rooms: RoomRow[];
};

export default function AdminRoomsPage({ rooms }: PageProps) {
    return (
        <>
            <Head title="Admin Rooms" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <h2 className="text-lg font-semibold">All Rooms</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Complete rooms list with landlord and rental status.</p>

                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[760px] table-auto border-collapse text-left">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 text-xs uppercase tracking-wide text-muted-foreground dark:border-sidebar-border">
                                    <th className="px-3 py-3">Room</th>
                                    <th className="px-3 py-3">City</th>
                                    <th className="px-3 py-3">Landlord</th>
                                    <th className="px-3 py-3">Rentals</th>
                                    <th className="px-3 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room) => (
                                    <tr key={room.id} className="border-b border-sidebar-border/60 text-sm dark:border-sidebar-border/70">
                                        <td className="px-3 py-3 font-medium">
                                            <Link href={roomShow(room.id)} className="text-primary hover:underline">
                                                {room.title}
                                            </Link>
                                        </td>
                                        <td className="px-3 py-3 text-muted-foreground">{room.city}</td>
                                        <td className="px-3 py-3">
                                            {room.landlordId ? (
                                                <Link href={userShow(room.landlordId)} className="hover:underline">
                                                    {room.landlordName}
                                                </Link>
                                            ) : (
                                                <span>{room.landlordName}</span>
                                            )}
                                            <p className="text-xs text-muted-foreground">{room.landlordEmail}</p>
                                        </td>
                                        <td className="px-3 py-3">{room.rentalsCount}</td>
                                        <td className="px-3 py-3 capitalize">{room.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminRoomsPage.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: admin(),
        },
        {
            title: 'Rooms',
            href: roomsList(),
        },
    ],
};
