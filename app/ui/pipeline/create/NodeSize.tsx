import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const CustomNode = ({ data }: NodeProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                width: '150px',
                // height: '200px',
                border: '1px solid #9b59b6',
                borderRadius: '5px',
                padding: '10px',
                backgroundColor: isHovered ? '#ebdef0':'#ffffff',
                boxShadow: isHovered
                    ? '0 6px 10px rgba(0, 0, 0, 0.2)'
                    : '0 2px 4px rgba(0, 0, 0, 0.2)', // Box shadow changes on hover
                transition: 'box-shadow 0.2s ease-in-out' // Smooth transition animation
            }}
        >
            <Handle type="target" position={Position.Left} />
            <div className="text-left text-sm">{data.label}</div>
            <Handle type="source" position={Position.Right} />
        </div>
    );
};

export default memo(CustomNode);
