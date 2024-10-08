import React, { useState, useEffect, useRef } from 'react';

export interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    options: Option[];
    placeholder: string;
    onSelect?: (option: Option) => void;
}

const Select: React.FC<SelectProps> = ({ options, placeholder, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (option: Option) => {
        setSelectedOption(option);
        setIsOpen(false);
        if (onSelect) {
            onSelect(option);
        }
    };

    return (
        <div ref={dropdownRef} className="relative w-[150px] text-xs">
            {/* Select Trigger */}
            <button
                className="w-full h-8 border border-gray-300 rounded flex items-center justify-between px-2"
                onClick={toggleDropdown}
            >
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <span>▼</span>
            </button>

            {/* Dropdown Content */}
            {isOpen && (
                <div className="absolute mt-1 w-full border border-gray-300 bg-white rounded shadow-lg z-10">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(option)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// export default function MySelectComponent() {
//     const options: Option[] = [
//         { value: 'exec', label: '执行' },
//         { value: 'stop', label: '暂停' },
//         { value: 'cancel', label: '取消' },
//         { value: 'rerun', label: '失败重跑' },
//         { value: 'continuerun', label: '继续执行' }
//     ];
//
//     const handleOptionSelect = (option: Option) => {
//         console.log("Selected Option:", option);
//     };
//
//     return (
//         <div className="p-4">
//             <Select options={options} placeholder="选择执行方式" onSelect={handleOptionSelect} />
//         </div>
//     );
// }

export default Select;