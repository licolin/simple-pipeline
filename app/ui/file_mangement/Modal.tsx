import React, { useState } from "react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (inputValue: string) => void;
    title: string;
    placeholder: string;
};

export default function Modal({ isOpen, onClose, onConfirm, title, placeholder }: ModalProps) {
    const [inputValue, setInputValue] = useState("");

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(inputValue);
        setInputValue(""); // Reset the input after confirmation
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-[400px]">
                <h2 className="text-md font-bold mb-4">{title}</h2>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4 text-sm"
                />
                <div className="flex justify-end">
                    <button className="bg-gray-300 px-3 py-1 rounded mr-2 text-sm" onClick={onClose}>
                        取消
                    </button>
                    <button className="bg-blue-600 px-3 py-1 text-white rounded text-sm" onClick={handleConfirm}>
                        确定
                    </button>
                </div>
            </div>
        </div>
    );
}
