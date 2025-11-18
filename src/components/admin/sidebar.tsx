//@ts-nocheck
'use client';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Card,
    List,
    ListItem,
    ListItemPrefix,
    Typography,
} from '@material-tailwind/react';
import {
    InboxIcon,
    ArchiveBoxIcon,
    NewspaperIcon,
    PowerIcon,
    Bars3Icon,
    FolderArrowDownIcon,
    ChatBubbleLeftRightIcon,
    PhotoIcon,

} from '@heroicons/react/24/solid';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogClose } from '../ui/dialog';
import { Button } from '../ui/button';

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className: string }>;
}

export function SidebarWithLogo() {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const navItems: NavItem[] = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: InboxIcon },
        { name: 'Laporan Warga', href: '/admin/reports', icon: FolderArrowDownIcon },
        { name: 'Arsip Kematian', href: '/admin/archive', icon: ArchiveBoxIcon },
        { name: 'Berita', href: '/admin/news', icon: NewspaperIcon },
        { name: 'Konten', href: '/admin/slider', icon: PhotoIcon },
        // { name: 'Pesan Masuk', href: '/admin/chat', icon: ChatBubbleLeftRightIcon },
    ];

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + '/');

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        router.push('/login');
    };

    const toggleSidebar = () => setCollapsed(!collapsed);

    return (
        <aside
            className={`sticky top-0 h-screen transition-all duration-300 ${
                collapsed ? 'w-23' : 'w-72'
            }`}
        >
            <Card className="h-full w-full p-4 shadow-xl shadow-blue-gray-900/5 flex flex-col justify-between">
                {/* Header */}
                <div>
                    <div
                        className={`mb-4 flex items-center justify-between p-2 ${
                            collapsed ? 'flex-col' : ''
                        }`}
                    >
                        {!collapsed && (
                            <div className="flex justify-end items-center gap-3">
                                <Image
                                    src="/admin.png"
                                    alt="brand"
                                    className="h-30 w-30 rounded ml-9"
                                    width={100}
                                    height={100}
                                />
                                {/* <Typography
                                    as="h5"
                                    color="blue-gray"
                                    className="font-bold"
                                >
                                    Admin
                                </Typography> */}
                            </div>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded hover:bg-gray-100"
                            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <Bars3Icon className="h-5 w-5 text-gray-700" />
                        </button>
                    </div>

                    <List>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link key={item.href} href={item.href}>
                                    <ListItem
                                        className={`flex items-center gap-4 cursor-pointer transition-all duration-200 ${
                                            active
                                                ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-slate-900 text-white'
                                                : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        <ListItemPrefix>
                                            <Icon className="h-5 w-5" />
                                        </ListItemPrefix>
                                        {!collapsed && <span>{item.name}</span>}
                                    </ListItem>
                                </Link>
                            );
                        })}
                    </List>
                </div>

                {/* Logout */}
                <div className="p-2">
                    <ListItem
                        onClick={() => setOpenLogoutDialog(true)}
                        className="flex items-center gap-4 cursor-pointer transition-colors duration-200 hover:bg-red-50 hover:text-red-700 text-red-600 font-medium"
                    >
                        <ListItemPrefix>
                            <PowerIcon className="h-5 w-5 text-red-600" />
                        </ListItemPrefix>
                        {!collapsed && 'Log Out'}
                    </ListItem>
                </div>
            </Card>

            {/* Dialog Logout */}
            <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
                <DialogContent>
                    <DialogHeader>
                        <h3 className="text-center font-bold">Yakin ingin logout?</h3>
                    </DialogHeader>
                    
                    <DialogFooter className="flex justify-center gap-2">
                        <DialogClose asChild>
                            <Button variant='outline' className=" hover:scale-105">
                                Batal
                            </Button>
                        </DialogClose>
                        <Button className="bg-red-500 text-white hover:bg-red-600 hover:text-white hover:scale-105" onClick={handleLogout}>
                            Logout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </aside>
    );
}
