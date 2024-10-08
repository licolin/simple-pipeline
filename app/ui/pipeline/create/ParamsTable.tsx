import React, {useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import {Edge, Node} from 'reactflow';
import BasicDemo from './cas';
import {getElementsBeforeParam, getSelectedKeys, transformData} from './utils';
import CascadeSelect from '@/app/ui/pipeline/cascadeOfParams';


interface ParamsTableProps {
    nodes: Node[];
    edges: Edge[];
    id:string;
    allParams:{ [key: string]:  {
            type: string,
            name: string,
            value: string,
            in_out: string
        }[]
    };
}

// interface ParamsTableRef {
//     handleSubmit: () => Promise<void>; // Define the methods you want to expose via ref
// }

interface ParamsTableRef {
    handleSubmit: () => Promise<{
        message: string;
        success: boolean;
        showDialog: boolean;
    }>;
}


type ParamData = {
    [nodeId: string]: string[];
};

const fetchParamsByNodeId = async (nodeId: string) => {
    try {
        const response = await fetch(`/api/process/params?id=${nodeId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch params for node ${nodeId}`);
        }
        const data = await response.json();
        return data.success ? data.data.params : null;
    } catch (error) {
        console.error('Error fetching params:', error);
        return null;
    }
};

const PARAM_TYPE_OPTIONS = [
    {value: 'fixed', label: '固定值'},
    {value: 'reference', label: '引用'}
];

function getNodeOrder(edges: { map: (arg0: (edge: any) => any[]) => Iterable<readonly [unknown, unknown]> | null | undefined; find: (arg0: { (edge: any): boolean; (edge: any): boolean; }) => { (): any; new(): any; source: any; target: any; }; }) {
    const order = [];
    const map = new Map(edges.map(edge => [edge.target, edge.source]));

    let currentSource = edges.find(edge => !map.has(edge.source)).source;

    while (currentSource) {
        order.push(currentSource);
        currentSource = edges.find(edge => edge.source === currentSource)?.target;
    }

    return order;
}

const ParamsTable = forwardRef<ParamsTableRef, ParamsTableProps>(({nodes, edges,id,allParams},ref) => {
    // @ts-ignore
    const [paramStates, setParamStates] = useState<{
        [key: string]: {
            type: string,
            name: string,
            value: string,
            in_out: string
        }[]
    }>(allParams);
    const [sequences,setSequences] = useState([]);
    const [lastMapping,setLastMapping] = useState({});
    const [idClassName,setIdClassName] = useState({});


    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogSuccess, setDialogSuccess] = useState(false);
    const componentBRef = useRef<any>(null);

    function getDataOptions(id:string){
        const selected_keys:Array<string> = getElementsBeforeParam(sequences,id);
        const optionMaps: { [nodeId: string]: string[] } = getSelectedKeys(lastMapping,selected_keys);
        return transformData(optionMaps,idClassName)
    }

    useImperativeHandle(ref, () => ({
        handleSubmit
    }));

    useEffect(() => {
        const fetchAllParams = async () => {
            const paramsMap: { [key: string]: any } = {};
            const optionsMap: ParamData = {};
            const sourceNodesMap: { [nodeId: string]: string[] } = {};
            const m1: { [id: string]: string } = {};

            for (const node of nodes) {
                const parts = node.id?.split("_");
                // console.log("node: "+node.id);
                const params = await fetchParamsByNodeId(parts[0]);
                if (params) {
                    paramsMap[node.id] = params;
                    const parsedData = JSON.parse(params);
                    optionsMap[node.id] = [
                        ...parsedData.in.map((item: { name: string }) => item.name),
                        ...parsedData.out.map((item: { name: string }) => item.name),
                    ];

                    if(!paramStates.hasOwnProperty(node.id)){
                        paramStates[node.id] = [
                            ...parsedData.in.map((item: any) => ({ ...item, type: "fixed", in_out: "in" })),
                            ...parsedData.out.map((item: any) => ({ ...item, type: "fixed", in_out: "out" }))
                        ];
                    }

                    sourceNodesMap[node.id] = optionsMap[node.id];
                }
                if (!m1.hasOwnProperty(node.id)) {
                    if (node.className != null) {
                        m1[node.id] = node.className;
                    }
                }

            }
            setIdClassName(m1);

            // console.log("sourceNodesMap "+JSON.stringify(sourceNodesMap));

            // @ts-ignore
            setLastMapping(sourceNodesMap);
            // console.log("paramStates = "+JSON.stringify(paramStates));
            // console.log("paramsMap = "+JSON.stringify(paramsMap));
        };
        if(edges.length >0){
            // @ts-ignore
            setSequences(getNodeOrder(edges));
        }
        fetchAllParams().then(r => console.log("fetchAllParams"));
    }, [nodes,edges]);


    const handleParamTypeChange = (nodeId: string, paramIndex: number, value: string) => {
        setParamStates(prev => {
            const updatedParams = [...prev[nodeId]];
            updatedParams[paramIndex] = {...updatedParams[paramIndex], type: value};
            return {...prev, [nodeId]: updatedParams};
        });
    };

    const handleFixedValueChange = (nodeId: string, paramIndex: number, value: string) => {
        setParamStates(prev => {
            const updatedParams = [...prev[nodeId]];
            updatedParams[paramIndex] = {...updatedParams[paramIndex], value: value};
            return {...prev, [nodeId]: updatedParams};
        });
    };

    function updateValue(id: string, name: string, type: string, in_out: string, newValue: string) {
        if (paramStates.hasOwnProperty(id)) {
            paramStates[id].forEach((item) => {
                console.log("item.name = " + item.name);
                console.log("item.type = " + item.type);
                console.log("item.in_out = " + item.in_out);
                if (item.name === name && item.type === type && item.in_out === in_out) {
                    item.value = newValue;
                }
            });
        } else {
            console.log(`ID ${id} not found in the data`);
        }
    }
    function handleSelected(value: string, nodeId: string,paramName:string,in_out:string,param_type:string,node_real_id:string){
        console.log("value "+value);
        console.log("node_real_id "+node_real_id);
        console.log("paramName "+paramName);
        console.log("param_type "+param_type);
        console.log("in_out "+in_out);
        updateValue(node_real_id,paramName,param_type,in_out,value)
    }

    const handleSubmit = async () => {
        const formData = {
            nodes: nodes,
            edges:edges||[],
            paramStates: paramStates || {},
            type: "updatePipeline",
        };
        try {
            const response = await fetch('/api/pipeline', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id:parseInt(id, 10),
                    nodes: JSON.stringify(formData.nodes),
                    edges: JSON.stringify(formData.edges), // Convert age to an integer
                    paramStates:JSON.stringify(formData.paramStates),
                    type:formData.type,
                    // create_user:session?.user?.email,
                }),
            });
            const ret = await response.json();
            if (ret.success) {
                console.log('Data submitted successfully:', ret.data);
                return {
                    message: '提交成功',
                    success: true,
                    showDialog: true,
                };
                // console.log('Data submitted successfully:', ret.data);
                // setDialogMessage('提交成功');
                // setDialogSuccess(true);
                // setShowDialog(true);
                // setTimeout(() => {
                //     setShowDialog(false);
                // }, 1500);
            } else {
                console.error('Submission failed:', ret.error);
                return {
                    message: '提交失败 '+ret.error,
                    success: false,
                    showDialog: true,
                };
                // setDialogMessage('提交失败: ' + ret.error);
                // setDialogSuccess(false);
                // setShowDialog(true);
                // setTimeout(() => {
                //     setShowDialog(false);
                // }, 1500);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            return {
                message: '错误信息 '+error,
                success: false,
                showDialog: true,
            };
            // setDialogMessage('错误信息: ' + error);
            // setDialogSuccess(false);
            // setShowDialog(true);
            // setTimeout(() => {
            //     setShowDialog(false);
            // }, 1500);
        }

    };

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <div>

            {showDialog && (
                <div
                    className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-gray-800 text-white px-4 py-1 rounded-md transition-opacity duration-1000 ${
                        dialogSuccess ? 'bg-green-600' : 'bg-red-600'
                    }`}
                >
                    {dialogMessage}
                </div>
            )}


        <div className="mt-4 ml-2 min-w-full">
            {/*<div className="bg-blue-400">xx</div>*/}
            <div className="flex justify-start mt-[41px]">
                <span className="border-l-[3px] border-indigo-600 pl-[6px] text-xs font-bold my-1">参数列表</span>
                {/*<button className="text-xs px-2 py-1 mr-10 rounded text-white bg-blue-500 transition duration-200 ease-in-out hover:bg-blue-800 hover:opacity-90" onClick={handleSubmit}>提交保存</button>*/}
            </div>

            <table className="min-w-[700px] md:table border-collapse border border-gray-300 rounded-md shadow-sm">
                <thead className="text-left text-xs">
                <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-1  ">子流程名称</th>
                    <th className="border border-gray-300 px-2 py-1  ">参数名</th>
                    <th className="border border-gray-300 px-2 py-1">参数类型</th>
                    <th className="border border-gray-300 px-2 py-1  ">参数值</th>
                    <th className="border border-gray-300 px-2 py-1 mr-1">出入参</th>
                </tr>
                </thead>
                <tbody className="text-xs">
                {nodes.map(node => (
                    paramStates[node.id]?.map((param, index) => (
                        <tr key={`${node.id}-${index}`} className="w-full border border-gray-300">
                            {index === 0 && (
                                <td className="px-1 py-1" rowSpan={paramStates[node.id].length}>
                                    {node.className}
                                </td>
                            )}
                            <td className="whitespace-nowrap border px-2 py-1">{param.name}</td>

                            <td className="whitespace-nowrap border px-2 py-1">
                                <select
                                    className="focus:outline-none border-0 px-0.5 py-1 text-xs w-full"
                                    value={param.type}
                                    onChange={(e) => handleParamTypeChange(node.id, index, e.target.value)}
                                >
                                    {PARAM_TYPE_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-1 py-1">
                                {param.type === 'reference' ? (
                                    <CascadeSelect
                                        options={getDataOptions(node.id)}
                                        node_id={node.className?.toString() || ''}
                                        in_out={param.in_out}
                                        param_type={param.type}
                                        name_of_param={param.name}
                                        default_value = {param.value}
                                        node_real_id = {node.id}
                                        placeholder={param.value}
                                        // onChange={(codes) => console.log("Selected Codes:", codes)}
                                        onChange={handleSelected}
                                    />
                                    // </div>
                                ) : (
                                    <input
                                        type="text"
                                        className="border-0 px-0.5 py-1 text-xs w-full"
                                        value={param.value}
                                        onChange={(e) => handleFixedValueChange(node.id, index, e.target.value)}
                                    />
                                )}
                            </td>
                            <td className="px-4 py-1 border">{param.in_out === 'in' ? '入参' : '出参'}</td>
                        </tr>
                    ))
                ))}
                </tbody>
            </table>
        </div>
        </div>
    );
});

export default ParamsTable;
