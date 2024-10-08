import { useState } from 'react';

const ExecButton: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleClick = () => {
        setIsLoading(true);

        // Simulate an async operation (like an API call)
        setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Change duration as needed
    };

    return (
        <button
            onClick={handleClick}
            className={`flex items-center justify-center w-16 h-7 bg-blue-600 text-xs text-white rounded-sm transition duration-300 ease-in-out transform ${
                isLoading ? 'animate-spin' : ''
            }`}
        >
            {isLoading ? '执行中...' : '执行'}
        </button>
    );
};

export default ExecButton;
