// 'use client';
// import { useState } from 'react';
// import {redirect} from 'next/navigation';
// import Link from "next/link";
//
// interface SportProps {
//     id: string;
//     script_name: string;
//     description: string;
// }
//
// export default function SportCard({sport}: { sport: SportProps }) {
//     const [isHovered, setIsHovered] = useState(false);
//     // console.log("sport");
//     const handleClick = () => {
//         console.log('handleClick');
//         redirect('/dashboard/process/create');
//     };
//
//     return (
//         <Link
//             key={sport.id}
//             href={`/dashboard/processes/${sport.id}/edit`}
//             className="flex flex-col justify-between overflow-hidden text-left transition-shadow duration-200 bg-white rounded shadow-md group hover:shadow-2xl"
//             onClick={() => handleClick()}
//         >
//             <div className="p-3 ">
//                 <div className="flex ">
//                     <div
//                         className="flex items-center justify-center w-8 h-8 mb-4 rounded-full bg-indigo-100 hover:bg-indigo-200">
//                         <svg
//                             className="w-6 h-6 text-deep-purple-accent-400"
//                             stroke="currentColor"
//                             viewBox="0 0 52 52"
//                         >
//                             <polygon
//                                 strokeWidth="3"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 fill="none"
//                                 points="29 13 14 29 25 29 23 39 38 23 27 23"
//                             />
//                         </svg>
//                     </div>
//                 </div>
//                 <p className="mb-2 font-bold text-xs">{sport.script_name}</p>
//                 <p className="px-1 text-xs leading-5 text-gray-900"
//                    onMouseEnter={() => setIsHovered(true)}
//                    onMouseLeave={() => setIsHovered(false)}>
//                     {sport.description ? (sport.description.length > 50 ? sport.description.slice(0, 50) + "..." : sport.description) : ""}
//                 </p>
//                 {isHovered && sport.description.length > 50 && (
//                     <div className="absolute mt-1 w-max max-w-xs p-1 bg-white text-gray-900 text-xs z-10 shadow-lg rounded-lg">
//                         {sport.description}
//                     </div>
//                 )}
//
//             </div>
//             <div
//                 className="w-full h-1 ml-auto duration-300 origin-left transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100"
//             />
//         </Link>
//     );
// }

'use client';
import { useState } from 'react';
import { redirect } from 'next/navigation';
import Link from "next/link";

interface SportProps {
    id: string;
    script_name: string;
    description: string;
}

export default function SportCard({ sport }: { sport: SportProps }) {
    const [isHovered, setIsHovered] = useState(false);
    const [hoverPosition, setHoverPosition] = useState<'left' | 'right'>('left');
    const [verticalPosition, setVerticalPosition] = useState<'top' | 'bottom'>('bottom');

    const handleMouseEnter = (event: React.MouseEvent) => {
        console.log("handleMouseEnter!");
        setIsHovered(true);

        // Check if the card is close to the right or bottom edge and adjust tooltip position
        const cardRect = event.currentTarget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // If close to the right edge, position tooltip to the left
        if (cardRect.right + 200 > viewportWidth) {
            setHoverPosition('right');
        } else {
            setHoverPosition('left');
        }

        // If close to the bottom edge, position tooltip above the card
        if (cardRect.bottom + 100 > viewportHeight) {
            setVerticalPosition('top');
        } else {
            setVerticalPosition('bottom');
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleClick = () => {
        redirect('/dashboard/process/create');
    };

    return (
        <Link
            key={sport.id}
            href={`/dashboard/processes/${sport.id}/edit`}
            className="flex flex-col justify-between overflow-hidden text-left transition-shadow duration-200 bg-white rounded shadow-md group hover:shadow-2xl relative"
            // onClick={handleClick}
        >
            <div className="p-3">
                <div className="flex">
                    <div className="flex items-center justify-center w-8 h-8 mb-4 rounded-full bg-indigo-100 hover:bg-indigo-200">
                        <svg
                            className="w-6 h-6 text-deep-purple-accent-400"
                            stroke="currentColor"
                            viewBox="0 0 52 52"
                        >
                            <polygon
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                points="29 13 14 29 25 29 23 39 38 23 27 23"
                            />
                        </svg>
                    </div>
                </div>
                <p
                    className="mb-2 font-bold text-xs"
                >
                    {sport.script_name}
                </p>
                <p
                    className="px-1 text-xs leading-5 text-gray-900"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {sport.description ? (sport.description.length > 50 ? sport.description.slice(0, 50) + "..." : sport.description) : ""}
                </p>
                {isHovered && sport.description.length > 50 && (
                    <div
                        className={`absolute block w-max max-w-xs p-2 bg-white text-gray-900 text-xs z-10 shadow-lg rounded-lg ${
                            hoverPosition === 'right' ? 'right-1' : 'left-1'
                        } ${
                            verticalPosition === 'top' ? 'top-0 mb-2' : 'top-0 mt-0'
                        }`}
                        style={{ wordWrap: 'break-word', maxWidth: '200px', overflowWrap: 'break-word' }}
                    >
                        {sport.description}
                    </div>
                )}
            </div>
            <div
                className="w-full h-1 ml-auto duration-300 origin-left transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100"
            />
        </Link>
    );
}
