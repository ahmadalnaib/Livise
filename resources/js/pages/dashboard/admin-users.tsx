import { Head } from '@inertiajs/react';
import { admin } from '@/routes/dashboard';
import { list as usersList } from '@/routes/dashboard/admin/users';

type UserRow = {
    id: number;
    name: string;
    email: string;
    role: string;
    tenantApproved: boolean;
    createdAt: string | null;
};

type PageProps = {
    users: UserRow[];
};

export default function AdminUsersPage({ users }: PageProps) {
    return (
        <>
            <Head title="Admin Users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar">
                    <h2 className="text-lg font-semibold">All Users</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Complete users list with roles and tenant approval status.</p>

                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[760px] table-auto border-collapse text-left">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 text-xs uppercase tracking-wide text-muted-foreground dark:border-sidebar-border">
                                    <th className="px-3 py-3">Name</th>
                                    <th className="px-3 py-3">Email</th>
                                    <th className="px-3 py-3">Role</th>
                                    <th className="px-3 py-3">Tenant approval</th>
                                    <th className="px-3 py-3">Created at</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-sidebar-border/60 text-sm dark:border-sidebar-border/70">
                                        <td className="px-3 py-3 font-medium">{user.name}</td>
                                        <td className="px-3 py-3 text-muted-foreground">{user.email}</td>
                                        <td className="px-3 py-3 capitalize">{user.role}</td>
                                        <td className="px-3 py-3 text-xs">
                                            {user.role === 'tenant' ? (user.tenantApproved ? 'Approved' : 'Pending') : 'N/A'}
                                        </td>
                                        <td className="px-3 py-3 text-xs text-muted-foreground">{user.createdAt ?? 'N/A'}</td>
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

AdminUsersPage.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: admin(),
        },
        {
            title: 'Users',
            href: usersList(),
        },
    ],
};
