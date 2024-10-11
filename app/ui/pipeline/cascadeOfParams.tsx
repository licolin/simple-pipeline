import React, {useEffect, useRef, useState} from 'react';

// Define a type for your transformed options
export interface TransformedOption {
    code: string;
    name: string;
    children?: TransformedOption[];
    states?: { name: string; code: string }[];
}

// Props for CascadeSelect
interface Props {
    options: TransformedOption[];
    placeholder?: string;
    onChange?: (selectedValue: string, node_id: string, name_of_param: string, in_out: string, param_type: string, node_real_id: string) => void;
    node_id: string;
    name_of_param: string;
    in_out: string;
    param_type: string;
    node_real_id: string;
    default_value: string;
}

// Define findOption outside the component
const findOption = (
    options: TransformedOption[],
    targetCode: string
): TransformedOption | null => {
    for (const option of options) {
        if (option.name === targetCode) {
            return option;
        }
        let found: TransformedOption | null = null;
        if (option.children) {
            found = findOption(option.children, targetCode);
        }
        if (!found && option.states) {
            found = findOption(option.states, targetCode);
        }
        if (found) {
            return found;
        }
    }
    return null;
};

const CascadeSelect: React.FC<Props> = ({
                                            options,
                                            placeholder,
                                            name_of_param,
                                            in_out,
                                            param_type,
                                            node_real_id,
                                            default_value,
                                            node_id,
                                            onChange
                                        }) => {
    const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
    const [cascadeData, setCascadeData] = useState<TransformedOption[][]>([options]);
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [optionInfo, setOptionInfo] = useState("");

    console.log("option info is "+JSON.stringify(options));
    const handleSelect = (name: string, level: number) => {
        let tmp_data = [...options];
        const selectedOption = findOption(cascadeData[level], name)
        // console.log("cascadeData option "+JSON.stringify(cascadeData));
        // console.log("selected option "+JSON.stringify(selectedOption));
        // console.log("option is  "+JSON.stringify(options));
        // console.log("tmp_data is  "+JSON.stringify(tmp_data));

        if (selectedOption) {
            // Update selected codes
            // console.log("selectedOption is "+JSON.stringify(selectedOption));
            console.log("selected name "+JSON.stringify(name));
            const newSelectedCodes = [...selectedCodes.slice(0, level), name];


            setSelectedCodes(newSelectedCodes);
            console.log("newSelectedCodes "+JSON.stringify(newSelectedCodes.length));

            if(newSelectedCodes.length > 0) {
                if(newSelectedCodes.length === 1){
                    setOptionInfo(newSelectedCodes[0]);
                }else if(newSelectedCodes.length===2){
                    setOptionInfo(newSelectedCodes[0] + ">" + newSelectedCodes[1]);
                }
            }

            // if (level === 1) {
            //     // setOptionInfo(selectedOption.code+">"+selectedOption.name);
            //     setOptionInfo(newSelectedCodes[0] + ">" + newSelectedCodes[1]);
            //     // console.log("newSelectedCodes is "+JSON.stringify(newSelectedCodes));
            //     // console.log("selectedOption "+JSON.stringify(selectedOption));
            // }

            if (selectedOption.children || selectedOption.states) {
                const nextOptions = selectedOption.children || selectedOption.states || [];

                // console.log("initial options "+JSON.stringify(cascadeData));
                setCascadeData([...cascadeData.slice(0, level + 1), nextOptions]);
                let ret = [...cascadeData.slice(0, level + 1)];
                // console.log("cascadeData11111 "+JSON.stringify(cascadeData));
                // @ts-ignore
                // setCascadeData( nextOptions);
            } else {
                // If no further children, reset cascade and close
                setIsOpen(false);
                setCascadeData([options]);
            }

            // Notify parent component of selected codes
            if (onChange) {
                console.log("xxxxxx " + name);
                console.log("yyyyyy " + selectedCodes);
                onChange(selectedCodes[0]+">"+name, node_id, name_of_param, in_out, param_type, node_real_id);
            }
        }
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setIsOpen(false);
            setCascadeData([options]);  // Reset the cascade when clicking outside
        }
    };

    function getRandomEightDigitString(): string {
        // Define the character set for the random string
        const chars = '0123456789';

        // Generate a random string of 8 characters
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return result;
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [options]);

    return (
        <div className="relative inline-block text-left" ref={ref}>
            <div>
                <button
                    onClick={() => {
                        // Reset cascade level when button is clicked to re-select
                        setCascadeData([options]);
                        setIsOpen(!isOpen);
                    }}
                    type="button"
                    className="inline-flex justify-between items-center w-64 px-3 py-1 border-none border-gray-300 rounded-[1px] shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                >
                    {optionInfo
                        ? optionInfo
                        : default_value}
                    {/*<svg*/}
                    {/*    className="-mr-1 ml-2 h-4 w-4"*/}
                    {/*    xmlns="http://www.w3.org/2000/svg"*/}
                    {/*    viewBox="0 0 20 20"*/}
                    {/*    fill="currentColor"*/}
                    {/*    aria-hidden="true"*/}
                    {/*>*/}
                    {/*    <path*/}
                    {/*        fillRule="evenodd"*/}
                    {/*        d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"*/}
                    {/*        clipRule="evenodd"*/}
                    {/*    />*/}
                    {/*</svg>*/}
                    <svg
                        className="ml-auto h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>

                </button>
            </div>

            {isOpen && (
                <div
                    className="absolute z-10 mt-2 w-full origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 flex min-w-[250px]">
                    {cascadeData.map((optionsLevel, level) => (
                        <div key={level} className="py-1 w-full" role="menu" aria-orientation="vertical">
                            {optionsLevel.map((option) => (
                                <button
                                    key={option.code + getRandomEightDigitString()}
                                    onClick={() => handleSelect(option.name, level)}
                                    className="flex items-center justify-between px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900  w-full text-left"
                                    role="menuitem"
                                >
                                    <span className="whitespace-nowrap">{option.name}</span>
                                    {/*{option.name}*/}
                                    {(option.children || option.states) && (
                                        <svg
                                            className="inline-block ml-2 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CascadeSelect;
