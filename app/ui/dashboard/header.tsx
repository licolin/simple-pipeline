"use client";
import {LogOut} from '@/app/lib/actions';
import {PowerIcon} from '@heroicons/react/24/outline';
import {useFormState} from 'react-dom';
import {useSession} from "next-auth/react";
import {useRef, useState} from 'react';
import useOnClickOutside from 'use-onclickoutside';


export default function Header() {
    const {data: session, status} = useSession();
    const [errorMessage, dispatch] = useFormState(LogOut, undefined);
    const [isSignOutButtonVisible, setIsSignOutButtonVisible] = useState(false);
    const signOutFormRef = useRef(null);

    const handleEmailClick = () => {
        console.log("email clicked!")
        setIsSignOutButtonVisible(!isSignOutButtonVisible);
    };

    const handleSignOut = (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // Prevent the default form submission behavior
        dispatch();
        setIsSignOutButtonVisible(false); // Hide the sign-out button after successful sign-out
    };

    useOnClickOutside(signOutFormRef, () => {
        setIsSignOutButtonVisible(false);
    });

    return (
        <div>
            <div
                className={`fixed w-full h-10 m-0 z-30 flex shadow-md items-center bg-blue-50 transition-all duration-300 justify-end`}>

                <div
                    onClick={handleEmailClick}
                    className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded text-sm"
                >
                    {session?.user?.email}
                </div>

            </div>
            {isSignOutButtonVisible && (
                <div ref={signOutFormRef} className="absolute right-1 top-10 z-10 bg-gray-300 px-2 rounded-sm">
                    <form onSubmit={handleSignOut}>
                        <button
                            type="submit"
                            className="flex h-7 justify-end items-center px-2"
                        >
                            <PowerIcon className="w-4 mr-1"/>
                            <div className="text-xs">退出登录</div>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
