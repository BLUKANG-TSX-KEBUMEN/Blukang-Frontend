// @ts-nocheck
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
} from '@material-tailwind/react';
import {
    InboxIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    PowerIcon,
    ArchiveBoxIcon,
    NewspaperIcon,
} from '@heroicons/react/24/solid';
import Image from 'next/image';

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className: string }>;
    badge?: number;
}

export function SidebarWithLogo() {
    const pathname = usePathname();

    const navItems: NavItem[] = [
        {
            name: 'Laporan',
            href: '/admin/dashboard',
            icon: InboxIcon,
            badge: 14,
        },
        {
            name: 'Arsip Kematian',
            href: '/admin/archive',
            icon: ArchiveBoxIcon,
        },
        {
            name: 'Berita',
            href: '/admin/news',
            icon: NewspaperIcon,
        }, {
            name: 'Settings',
            href: '/settings',
            icon: Cog6ToothIcon,
        },
        {
            name: 'Settings',
            href: '/settings',
            icon: Cog6ToothIcon,
        },
        {
            name: 'Settings',
            href: '/settings',
            icon: Cog6ToothIcon,
        },
    ];

    const isActive = (href: string) => {
        return pathname === href || pathname.startsWith(href + '/');
    };

    return (
        <aside className="sticky top-0 h-screen">
            <Card className="h-full w-[18rem] p-4 shadow-xl shadow-blue-gray-900/5 flex flex-col justify-between">
                {/* Header */}
                <div>
                    <div className="mb-2 flex items-center gap-4 p-4">
                        <Image
                            src="/hero-desa.jpg"
                            alt="brand"
                            className="h-8 w-8 rounded"
                            width={32}
                            height={32}
                        />
                        <Typography as="h5" color="blue-gray" className='font-bold'>
                            Admin
                        </Typography>
                    </div>

                    <List>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link key={item.href} href={item.href}>
                                    <ListItem
                                        className={`gap-5 cursor-pointer transition-colors duration-200 ${active
                                            ? 'bg-blue-50 text-blue-900'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <ListItemPrefix>
                                            <Icon className="h-5 w-5" />
                                        </ListItemPrefix>
                                        {item.name}
                                        {item.badge && (
                                            <ListItemSuffix>
                                                <Chip
                                                    value={item.badge}
                                                    size="sm"
                                                    variant="ghost"
                                                    color="blue-gray"
                                                    className="rounded-full"
                                                />
                                            </ListItemSuffix>
                                        )}
                                    </ListItem>
                                </Link>
                            );
                        })}
                    </List>
                </div>

                {/* Logout button */}
                <div className="p-2">
                    <ListItem
                        className="gap-5 cursor-pointer transition-colors duration-200 hover:bg-red-50 hover:text-red-700 text-red-600 font-medium"
                    >
                        <ListItemPrefix>
                            <PowerIcon className="h-5 w-5 text-red-600" />
                        </ListItemPrefix>
                        Log Out
                    </ListItem>
                </div>
            </Card>
        </aside>
    );
}
