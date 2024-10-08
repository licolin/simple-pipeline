import React, { useEffect } from "react";

type DialogProps = {
    message: string;
    isVisible: boolean;
    isSuccess: boolean;
    duration?: number; // Optional prop to control how long the dialog is shown
    onClose: () => void;
};

export default function Dialog({ message, isVisible, isSuccess, duration = 1000, onClose }: DialogProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 text-white px-4 py-1 rounded-md transition-opacity duration-1000 ${
                isSuccess ? "bg-green-600" : "bg-red-600"
            }`}
        >
            {message}
        </div>
    );
}
