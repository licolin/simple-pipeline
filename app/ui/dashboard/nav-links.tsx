'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import React from "react";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];


interface MenuItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref">>;
}

export default function NavLinks( {item,expanded}: {item:MenuItem,expanded:boolean}) {

  const pathname = usePathname()

  console.log("valid or not "+React.isValidElement(item.icon));
  console.log("icon "+item.icon);

  // @ts-ignore
  return (<Link href={item.href} className={`flex items-center p-2 gap-2 hover:bg-blue-200 rounded-md ${
      pathname === item.href ? "bg-blue-500 rounded-md" : ""
  }`}>
    {/*  <span>*/}
    {/*      {React.isValidElement(item.icon)*/}
    {/*          ? item.icon*/}
    {/*          : React.createElement(item.icon, {key: item.name})}*/}
    {/*</span>*/}

    {/*<span>*/}
    {/*    {React.createElement(item.icon, {key: item.name})}*/}
    {/*  </span>*/}

    <span>
        {/*{React.createElement(item.icon, {key: item.name})}*/}
      <HomeIcon />
      </span>


    <span className={`whitespace-nowrap text-sm transition-opacity duration-1000 ease-in-out ${
        expanded ? "opacity-100" : "opacity-0"
    }`}>
                {item.name}
            </span>
  </Link>)
}
