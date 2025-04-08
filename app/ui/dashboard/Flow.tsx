"use client";
import React, {useState, useCallback, useRef, useEffect} from "react";
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    Handle,
    Position,
    Node,
    Edge,
    Connection,
    applyNodeChanges,
    useReactFlow,
    ReactFlowProvider, // ✅ 确保导入
} from "reactflow";
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/md";
import DropdownMenu from "@/app/ui/dashboard/Dropdown";
import {NodeType} from "@/app/ui/dashboard/Dropdown";
import "reactflow/dist/style.css";

// 🎨 自定义流程节点
const CustomNode = ({data}: any) => (
    <div className="bg-blue-400 border border-blue-600 p-1 rounded text-center cursor-grab shadow-md text-white">
        <span className="text-sm">{data.label}</span><br/>
        <span className="text-sm">{data.details}</span>
        <Handle type="target" position={Position.Left}/>
        <Handle type="source" position={Position.Right}/>
    </div>
);

const nodeTypes = {custom: CustomNode};

const initialNodes: Node[] = [
    {id: "a", type: "custom", position: {x: 50, y: 100}, data: {label: "A", details: "aaaaa"}},
    {id: "b", type: "custom", position: {x: 50, y: 200}, data: {label: "B", details: "bbbbb"}},
    {id: "c", type: "custom", position: {x: 250, y: 150}, data: {label: "C", details: "ccccc"}},
];

const initialEdges: Edge[] = [
    {id: "a-c", source: "a", target: "c"},
    {id: "b-c", source: "b", target: "c"},
];

const availableNodes: NodeType[] = [
    {
        id: '1',
        label: '节点1',
        children: [
            { id: '1-1', label: '子节点1-1' },
            { id: '1-2', label: '子节点1-2' },
        ],
    },
    { id: '2', label: '节点2' },
    {
        id: '3',
        label: '节点3',
        children: [
            { id: '3-1', label: '子节点3-1' },
            { id: '3-2', label: '子节点3-2' },
        ],
    },
    {
        id: '4',
        label: '节点6',
        children: [
            { id: '4-1', label: '子节点4-1' },
            { id: '4-2', label: '子节点4-2' },
            { id: '4-1', label: '子节点4-1' },
            { id: '4-2', label: '子节点4-2' },
        ],
    },
    {
        id: '5',
        label: '节点7',
        children: [
            { id: '3-1', label: '子节点3-1' },
            { id: '3-2', label: '子节点3-2' },
            { id: '3-1', label: '子节点3-1' },
            { id: '3-2', label: '子节点3-2' },
        ],
    },
    {
        id: '6',
        label: '节点7',
        children: [
            { id: '3-1', label: '子节点3-1' },
            { id: '3-2', label: '子节点3-2' },
            { id: '3-1', label: '子节点3-1' },
            { id: '3-2', label: '子节点3-2' },
            { id: '3-1', label: '子节点3-1' },
            { id: '3-2', label: '子节点3-2' },
            { id: '3-1', label: '子节点3-1' },
            { id: '3-2', label: '子节点3-2' },
        ],
    },


];

// const handleDragStart = (event: React.DragEvent<HTMLDivElement>, node: Node) => {
//     event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
//     event.dataTransfer.effectAllowed = 'move';
// };

// <DropdownMenu availableNodes={availableNodes} onDragStart={handleDragStart} />;


// 🎯 **正确的 FlowChart 组件**
function FlowChartComponent() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const reactFlowInstance = useReactFlow();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onConnect = useCallback((connection: Connection) => {
        setEdges((eds) => addEdge(connection, eds));
        console.log("connection " + JSON.stringify(connection));
        console.log("edges " + JSON.stringify(edges));
        console.log("all nodes are " + JSON.stringify(nodes));
    }, [edges, nodes]);

    const onDragStart = (event: React.DragEvent, nodeType: Node) => {
        console.log("onDragStart " + JSON.stringify(nodeType));
        event.dataTransfer.setData("application/reactflow", nodeType?.label);
        event.dataTransfer.effectAllowed = "move";
    };

    const onDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
        if (!reactFlowBounds || !reactFlowInstance) return;

        const type = event.dataTransfer.getData("application/reactflow");
        if (!type) return;

        console.log("type is " + JSON.stringify(type));
        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        const newNode: Node = {
            id: `${Date.now()}`,
            type: "custom",
            position,
            data: {label: type, details: `${Date.now()}`},
        };

        console.log("newNode: " + JSON.stringify(newNode));
        setNodes((nds) => [...nds, newNode]);
        console.log("nodes " + JSON.stringify(nodes));
    };

    useEffect(() => {
        console.log("Updated edges:", edges);
    }, [edges]);

    return (
        <div className="flex w-full">
            <div className="h-screen">
                <div className="font-custom text-sm bg-indigo-400 py-2 px-2 text-white">可拖拽组件信息</div>
                <DropdownMenu availableNodes={availableNodes} onDragStart={onDragStart} />
            </div>
            <div className="flex-grow relative rounded h-screen" ref={reactFlowWrapper}>
                <h3 className="text-sm bg-indigo-400 py-2 px-2 text-white">流程图</h3>
                <div className="w-full h-full">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onConnect={onConnect}
                        onDrop={onDrop}
                        onDragOver={(event) => event.preventDefault()}
                        nodeTypes={nodeTypes}
                        // fitView
                    >
                        <Background/>
                        <Controls/>
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
}

// 🎯 **用 `ReactFlowProvider` 包裹整个组件**
export default function FlowChart() {
    return (
        <ReactFlowProvider>
            <FlowChartComponent/>
        </ReactFlowProvider>
    );
}
