import React, { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

// 定义节点的类型
export interface NodeType {
    id: string;
    label: string;
    children?: NodeType[];
}

// 定义组件的 props 类型
interface DropdownMenuProps {
    availableNodes: NodeType[];
    onDragStart: (event: React.DragEvent<HTMLDivElement>, node: NodeType) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ availableNodes, onDragStart }) => {
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

    const toggleMenu = (menuId: string) => {
        setOpenMenus((prevOpenMenus) => ({
            ...prevOpenMenus,
            [menuId]: !prevOpenMenus[menuId],
        }));
    };

    const renderMenuItems = (nodes: Node[], parentId: string = ''): JSX.Element[] => {
        return nodes.map((node) => {
            const menuId = `${parentId}${node.id}`;
            const hasChildren = node.children && node.children.length > 0;
            const isOpen = openMenus[menuId];

            return (
                <div key={menuId} className="relative">
                    <div
                        className={`font-custom border-2 border-solid border-sky-300 rounded p-[1px] text-left shadow hover:bg-gray-200 flex justify-between items-center ${
                            hasChildren ? 'bg-white text-blue-500 text-sm cursor-pointer' : 'bg-sky-200 text-black text-sm cursor-move'
                        }`}
                        draggable={!hasChildren}
                        onDragStart={(event) => onDragStart(event, node)}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(menuId);
                        }}

                    >
                        <span>{node.label}</span>
                        {hasChildren && (
                            <button
                                // onClick={(e) => {
                                //     e.stopPropagation();
                                //     toggleMenu(menuId);
                                // }}
                                className="ml-[2px] focus:outline-none text-sm"
                            >
                                {isOpen ? <MdKeyboardArrowUp size={18}/> : <MdKeyboardArrowDown size={18}/>}
                            </button>
                        )}
                    </div>
                    {hasChildren && isOpen && (
                        <div className={`ml-1 mt-[1px]`} >
                            {renderMenuItems(node.children, `${menuId}-`)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="w-48 bg-gray-100">
            <div className="w-full bg-gray-100 shadow-md rounded">
                {renderMenuItems(availableNodes)}
            </div>
        </div>
    );
};

export default DropdownMenu;
