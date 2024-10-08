"use client";
import React, { useState } from "react";

export interface TreeNode {
    id: string;
    script_name: string;
    children?: TreeNode[];
};

type TreeViewProps = {
    data: TreeNode[];
};

const TreeView: React.FC<TreeViewProps> = ({ data }) => {
    return (
        <div className="treeview">
            {data.map((node) => (
                <TreeNodeComponent key={node.id} node={node} />
            ))}
        </div>
    );
};

type TreeNodeProps = {
    node: TreeNode;
};

const TreeNodeComponent: React.FC<TreeNodeProps> = ({ node }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => setIsExpanded(!isExpanded);


    const handleDragStart = (e: React.DragEvent) => {
        // e.dataTransfer.setData("text/plain", node.id);
        // console.log(`Dragging node: ${node.name}`);
        e.dataTransfer.setData('application/reactflow', node.script_name);
        e.dataTransfer.setData('scriptId', node.id);
        e.dataTransfer.effectAllowed = 'all';
    };

    return (
        <div className="ml-[1px]">
            <div
                className="cursor-pointer flex items-center p-1 rounded-md hover:bg-gray-200 w-64 truncate"
                draggable={!node.children}
                onClick={toggleExpand}
                onDragStart={!node.children ? handleDragStart : undefined}
                style={{ cursor: !node.children ? "grab" : "pointer" }}
            >
                {node.children && (
                    <span
                        className={`mr-1 transform transition-transform duration-200 text-xs ${
                            isExpanded ? "rotate-90" : "rotate-0"
                        }`}
                    >
            ▶
          </span>
                )}
                <span className={`text-xs ${node.children ? "font-bold" : ""}`}>{node.script_name}</span>
            </div>
            {isExpanded && node.children && (
                <div className="pl-4 text-xs">
                    {node.children.map((child) => (
                        <TreeNodeComponent key={child.id} node={child} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TreeView;
