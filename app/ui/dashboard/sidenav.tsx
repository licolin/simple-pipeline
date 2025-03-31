"use client";

import React, { useState, ForwardRefExoticComponent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// @ts-ignore
import { HomeIcon, DocumentDuplicateIcon, UserGroupIcon, ChevronDownIcon, ChevronUpIcon, Square3Stack3DIcon, WrenchIcon, ArrowLongLeftIcon, ArrowLongRightIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

interface MenuItem {
    name: string;
    href: string;
    list: {
        name: string;
        href: string;
        icon: ForwardRefExoticComponent<
            Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
            title?: string | undefined;
            titleId?: string | undefined;
        } & React.RefAttributes<SVGSVGElement>
        >;
    }[];
}

const menuItems: MenuItem[] = [
    // {
    //     name: '看板',
    //     list: [],
    //     href: '/dashboard',
    // },
    {
        name: '运维流程',
        href: "",
        list: [
            {
                name: '子流程库',
                href: '/dashboard/processes',
                icon: WrenchIcon,
            },
            {
                name: '流程集合',
                href: '/dashboard/pipeline',
                icon: WrenchScrewdriverIcon,
            },
        ],
    },
    {
        name: '文件管理',
        list: [],
        href: '/dashboard/management',
    },
    // {
    //     name: '代码生成',
    //     list: [],
    //     href: '/dashboard/chat',
    // },
    // {
    //     name: '文件管理',
    //     href: "",
    //     list: [
    //         {
    //             name: '配置文件',
    //             href: '/dashboard/management',
    //             icon: UserGroupIcon,
    //         },
    //         {
    //             name: '模块文件',
    //             href: '/dashboard/mdx',
    //             icon: UserGroupIcon,
    //         },
    //     ],
    // },
    {
        name: '用户设置',
        list: [],
        href: '/dashboard/customers',
    },

    // {
    //     name: '用户设置',
    //     href: "",
    //     list: [
    //         {
    //             name: '用户配置',
    //             href: '/dashboard/invoices',
    //             icon: UserGroupIcon,
    //         },
    //     ],
    // },
];

interface SideNavProps {
    isExpanded: boolean;
    onToggleExpand: () => void;
}

const SideNav: React.FC<SideNavProps> = ({onToggleExpand }) => {
    const pathname = usePathname();
    const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
    const [hovered, setHovered] = useState(false);

    const toggleSection = (index: number) => {
        const newExpandedSections = new Set(expandedSections);
        if (newExpandedSections.has(index)) {
            newExpandedSections.delete(index);
        } else {
            newExpandedSections.add(index);
        }
        setExpandedSections(newExpandedSections);
    };

    return (
        <nav
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`fixed top-0 left-0 h-screen bg-blue-600 pt-[47px] p-6 font-sans border-r border-blue-300 transition-all z-20 duration-500 ease-in-out ${
                hovered ? 'w-52' : 'w-16'
            } overflow-hidden`}
        >
            {menuItems.map((item, index) => (
                <div key={index} className="mb-1">
                    <div className="flex items-center justify-between hover:cursor-pointer" onClick={() => toggleSection(index)}>
                        <div className="flex items-center">
                            <Square3Stack3DIcon className="h-6 w-6 mb-2 text-white mr-2" />
                            <h3
                                className={`text-white text-xs font-bold mb-2 transition-all duration-300 ease-in-out ${
                                    hovered ? 'block' : 'hidden'
                                }`}
                            >
                                {item.list.length !== 0 ? (
                                    <>{item.name}</>
                                ) : (
                                    <Link href={item.href}>{item.name}</Link>
                                )}
                            </h3>
                        </div>
                        {item.list.length !== 0 && hovered && (
                            <button className="mb-2 h-6">
                                {expandedSections.has(index) ? (
                                    <ChevronUpIcon className="h-4 w-4 text-white font-bold" />
                                ) : (
                                    <ChevronDownIcon className="h-4 w-4 text-white font-bold" />
                                )}
                            </button>
                        )}
                    </div>
                    <ul
                        className={`transition-all duration-300 ease-in-out ${
                            expandedSections.has(index) ? 'visible opacity-100 max-h-screen' : 'invisible opacity-0 max-h-0'
                        }`}
                        style={{ transitionProperty: 'max-height, opacity' }}
                    >
                        {item.list.map((listItem, listIndex) => (
                            <li
                                key={listIndex}
                                className={`mb-2 ml-3 text-white hover:text-white-800 transition-all duration-300 ease-in-out ${
                                    expandedSections.has(index) ? 'block' : 'hidden'
                                } ${hovered ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <Link href={listItem.href} className="flex items-center text-sm">
                                    <listItem.icon className="h-5 w-5 mr-2" />
                                    <span
                                        className={`text-xs transition-all duration-300 ease-in-out ${
                                            hovered ? 'block' : 'hidden'
                                        }`}
                                    >
                                        {listItem.name}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </nav>
    );
};

export default SideNav;
