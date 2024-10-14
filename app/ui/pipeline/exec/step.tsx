import React from 'react';

interface Step {
    label: string;
    completed: boolean;
    active: boolean;
    error: boolean;
}

interface StepIndicatorProps {
    steps: Step[];
}



const StepIndicator: React.FC<StepIndicatorProps> = ({ steps }) => {
    console.log("steps information "+JSON.stringify(steps));
    return (
        <div className="flex items-center justify-between py-4 mx-2">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    {/* Step Item */}
                    <div className="flex items-center hover:cursor-pointer">
                        {step.completed ? (
                            <div className="flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full">
                                <span className="text-xl">✓</span>
                            </div>
                        ) : (
                            <div className={`flex items-center justify-center w-10 h-10 border-2 
  ${step.error ? 'bg-red-400' : step.active ? 'bg-gray-300 border-blue-600' : 'bg-gray-300 border-gray-400'} 
  rounded-full`}>
                                <span className={`${step.error ? 'text-gray-300' : step.active ? 'text-blue-600' : 'text-gray-400'}`}>{step.error ? 'x' : index}</span>
                            </div>
                        )}
                        <div className={`text-xs ml-2 ${step.completed ? 'text-gray-900' : step.active ? 'text-blue-600' : 'text-gray-400'}`}>
                            {step.label}
                        </div>
                    </div>
                    {index < steps.length - 1 && (
                        <div className="flex-grow h-[1px] bg-slate-500 mx-1"></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default StepIndicator;
