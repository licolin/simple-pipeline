"use client";
import React, { useState, useCallback, DragEvent, Suspense, useEffect,useRef } from 'react';
import ReactFlow, {
    Node,
    Edge,
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Connection,
    ReactFlowInstance,
    NodeTypes,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './NodeSize';
import ParamsTable from "@/app/ui/pipeline/create/ParamsTable";
import Sidebar from '@/app/ui/pipeline/create/sidebar';
import Dialog from "@/app/ui/Dialog";
import { useRouter } from 'next/navigation';

const nodeTypes: NodeTypes = {
    custom: CustomNode,
};

export enum BackgroundVariant {
    Lines = 'lines',
    Dots = 'dots',
    Cross = 'cross',
}

interface FlowProps {
    node: Node[];
    edge: Edge[];
    id: string;
    allParams: { [key: string]: { type: string, name: string, value: string, in_out: string,source_id:string }[] };
}

function getRandomEightDigitString(): string {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export default function FlowComponent({ node, edge, id, allParams }: FlowProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(node);
    const [nodesForRender, setNodesForRender] = useState(node);
    const [edges, setEdges, onEdgesChange] = useEdgesState(edge);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Drawer state
    const componentBRef = useRef<any>(null);


    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogSuccess, setDialogSuccess] = useState(false);
    const router = useRouter();

    const triggerBClick  = async () => {
        if (componentBRef.current) {
            const ret_from = await componentBRef.current.handleSubmit();
            // console.log("ret_from "+JSON.stringify(ret_from));
            // openDialog(ret_from.message,ret_from.status,ret_from.showDialog);
            setDialogMessage(ret_from.message);
            setDialogSuccess(ret_from.success);
            setShowDialog(ret_from.showDialog);
        }
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen); // Toggle drawer visibility
    };

    const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);


    useEffect(() => {
        setNodes((nodes) =>
            nodes.map((node) => {
                /**/console.log("type of nodes "+ JSON.stringify(nodes));
                const parts: string[] = node.id?.split("__");
                return {
                    ...node,
                    type: "custom",
                    data: {
                        label: (
                            <div>
                                <div className="font-bold">{node.className}</div>
                                {/*<div className="text-xs">{node.id}</div>*/}
                                <div className="text-xs py-1">流程ID:{parts[0]}</div>
                                <div className="text-xs py-1">随机ID:{parts[1]}</div>
                            </div>
                        ),
                    },
                };
            })
        );
    }, []);


    const onDrop = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            const name = event.dataTransfer.getData('application/reactflow');
            const script_id: string = event.dataTransfer.getData('scriptId');
            const type = "default";

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance?.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            if (!position) {
                return;
            }

            const count: string = getRandomEightDigitString();

            const newNode: Node = {
                id: `${script_id}` + "__" + count,
                type: "custom",
                position,
                data: {
                    label: (
                        <div>
                            <div className="font-bold py-1">{name}</div>
                            <div className="text-xs py-1">流程ID:{script_id}</div>
                            <div className="text-xs py-1">随机ID:{count}</div>
                        </div>
                    )
                },
                className: `${name}`,
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
            };

            setNodesForRender(prevNodes => [...prevNodes, newNode]);
            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes]
    );

    function SidebarSkeleton() {
        return (
            <aside className="bg-white p-2 rounded shadow-md h-full w-52 overflow-y-auto">
                <div className="text-xs mb-2 font-bold">拖拽子流程到右边面板</div>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                    <div key={i} className="dndnode p-0.5 border border-gray-300 rounded mb-0.5 cursor-grab text-xs">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                ))}
            </aside>
        );
    }

    return (
        <div>
            <Dialog
                message={dialogMessage}
                isVisible={showDialog}
                isSuccess={dialogSuccess}
                onClose={() => setShowDialog(false)}
            />

        <div className="flex relative bg-fuchsia-100 h-screen overflow-hidden">
            <div className="">
                <Suspense fallback={<SidebarSkeleton/>}>
                    <Sidebar/>
                </Suspense>
            </div>
            <div className="" style={{width: '100vw', height: '100vh', marginTop: '0px'}}>
                <div className="flex justify-start py-[1px] bg-fuchsia-50 shadow-md w-full my-[1px]">
                    <div className="w-[400px] flex justify-between">
                        <div>
                            <span className="text-xs font-bold py-[1px]">流程面板</span>
                        </div>
                        <div>
                            <span
                                className="text-xs mx-[2px] border-[1px] rounded-sm border-solid border-zinc-400 px-3 py-[1px] bg-blue-300 hover:bg-blue-500 hover:cursor-pointer"
                                onClick={triggerBClick}>提交</span>
                            <span
                                className="text-xs mx-[2px] border-[1px] rounded-sm border-solid border-zinc-400 px-3 py-[1px] bg-blue-300 hover:bg-blue-500 hover:cursor-pointer"
                                onClick={() => router.push('/dashboard/pipeline')}>返回</span>
                        </div>
                        <div>
                            <span
                                className="text-xs font-bold opacity-30 py-[1px]">点击右侧 {`<`} 维护流程间参数流转关系 </span>
                        </div>

                    </div>


                </div>
                {/*<span className="text-xs font-bold">流程面板</span>*/}
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    nodeTypes={nodeTypes}
                >
                    <Controls/>
                    <MiniMap/>
                    <Background gap={8} size={2} variant={BackgroundVariant.Lines}/>
                </ReactFlow>
            </div>
            <div
                className={`fixed right-0 top-0 h-full z-10 w-min-[800px] bg-white shadow-lg transform transition-transform ${
                    isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <ParamsTable  ref={componentBRef} nodes={nodesForRender} edges={edges} id={id} allParams={allParams}/>
                <button
                    className="absolute w-4 h-8 z-10 top-1/2 mr-4 transform -translate-y-1/2 bg-white text-black p-1 m-0 rounded-l-sm"
                    style={{
                        left: isDrawerOpen ? '-1rem' : '-1rem',
                        right: isDrawerOpen ? 'auto' : '-1rem',
                    }}
                    // bg-teal-500
                    // style={{
                    //     right: isDrawerOpen ? 'auto' : '0', // Ensures the button is at the edge when closed
                    //     left: isDrawerOpen ? '-2rem' : 'auto', // Moves it inside when open
                    // }}
                    onClick={toggleDrawer}
                >
                    {/*{isDrawerOpen ? '←' : '→'}*/}
                    {isDrawerOpen ? '>' : '<'}
                </button>
            </div>


        </div>
        </div>
    );
}
