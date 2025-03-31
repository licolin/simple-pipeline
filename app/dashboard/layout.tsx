"use client"
import SideNav from '@/app/ui/dashboard/sidenav';
import {ReactNode, useState} from "react";
import Header from '@/app/ui/dashboard/header';



type LayoutProps = {
    children: ReactNode;
};

// @ts-ignore
export default function Layout({ children }: LayoutProps) {
    const [isSideNavExpanded, setIsSideNavExpanded] = useState(true);
    return (
        <div className="bg-Fuchsia-50">
            <div className="flex h-screen flex-col">
                <div className="flex max-h-screen flex-shrink-0">
                    <div>
                        <Header/>
                    </div>

                    <div className="flex-1">

                        <div
                            className={`flex-shrink-0 bg-Fuchsia-50 transition-all duration-300 ease-in-out w-16 }`}>

                            <SideNav
                                isExpanded={isSideNavExpanded}
                                onToggleExpand={() => setIsSideNavExpanded(!isSideNavExpanded)}
                            />
                        </div>

                        <div className={`h-screen overflow-hidden pt-10 transition-all duration-300 ease-in-out ml-16 md:pl-2`}>
                            {children}
                            {/*md:pl-4*/}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}