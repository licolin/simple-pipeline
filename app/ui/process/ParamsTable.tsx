import React, {forwardRef, useImperativeHandle, useState} from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

// Define the types for the input/output parameter structure
interface Param {
    name: string;
    value: string;
}

interface TableData {
    in: Param[];
    out: Param[];
}

interface DataTableProps {
    initialData?: TableData; // Make initialData optional
}

const DataTable = forwardRef(({ initialData = { in: [], out: [] } }: DataTableProps, ref) => {
    const [data, setData] = useState<TableData>(initialData);

    useImperativeHandle(ref, () => ({
        getData: () => data
    }));
    const handleInputChange = (type: 'in' | 'out', index: number, name: string, value: string) => {
        const updatedParams = [...data[type]];
        updatedParams[index] = { ...updatedParams[index], [name]: value };
        setData({ ...data, [type]: updatedParams });
    };

    const handleSelectChange = (type: 'in' | 'out', index: number, selectedValue: string) => {

        console.log("change or not? "+type);
        // Clone the current params and find the param being changed
        const currentParam = data[type][index];

        // Remove the param from the current list (either 'in' or 'out')
        const updatedParams = data[type].filter((_, i) => i !== index);

        // Add the param to the opposite list (either 'in' or 'out')
        const newType = selectedValue === 'in' ? 'in' : 'out';
        setData(prevData => ({
            ...prevData,
            [type]: updatedParams,
            [newType]: [...prevData[newType], currentParam]  // Add the param to the opposite list
        }));

        console.log("data info "+JSON.stringify(data));
    };


    const renderRows = (params: Param[], type: 'in' | 'out') => {
        return params.map((item, index) => (
            <tr key={`${type}-${index}`} className="border-b-[1px] border-gray-300 bg-white">
                <td className="px-1 py-[1px] border-l-0 border-gray-300 text-xs text-center">
                    <input
                        type="text"
                        name="name"
                        value={item.name}
                        onChange={(e) => handleInputChange(type, index, 'name', e.target.value)}
                        className="px-0 py-1.5 border-none text-xs focus:outline-none focus:ring-0"
                    />
                </td>
                <td className="px-1 py-[1px] border-r-0 border-gray-300 text-xs">
                    <input
                        type="text"
                        name="value"
                        value={item.value}
                        onChange={(e) => handleInputChange(type, index, 'value', e.target.value)}
                        className="px-0 py-0 border-none text-xs focus:outline-none focus:ring-0"
                    />
                </td>
                <td className="px-1 py-[1px] border-r-0 border-gray-300 text-xs bg-white">
                    <select
                        className="w-16 px-3 py-1 border-none text-xs focus:outline-none focus:ring-0"
                        value={type}
                        onChange={(e) => handleSelectChange(type, index, e.target.value)}
                    >
                        <option value="in">入参</option>
                        <option value="out">出参</option>
                    </select>
                </td>
                <td className="px-1 py-[1px] border-x-0 border-gray-300 text-xs bg-white">
                    <button
                        className="px-0 py-0 rounded"
                        onClick={() => {
                            setData(prevData => ({
                                ...prevData,
                                [type]: prevData[type].filter((_, i) => i !== index)
                            }));
                        }}
                    >
                        {/*删除*/}
                        <TrashIcon className="h-5 w-5 text-blue-500 hover:text-blue-700"/>
                    </button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="w-full">
            <div className="flex mb-0.5 mt-1 justify-between">
                <span className="border-l-[3px] border-indigo-600 h-5 text-xs font-bold pl-[6px]">参数配置</span>
                <span
                    className="text-xs font-bold text-indigo-600 h-5 mr-2 hover:cursor-pointer"
                    onClick={() => setData(prevData => ({
                        ...prevData,
                        in: [...prevData.in, { name: '', value: '' }]
                    }))}
                >
                    +添加参数
                </span>
            </div>

            {/* Table header */}
            <table className="text-xs w-full table-fixed">
                <thead className="bg-gray-200 h-5">
                <tr>
                    <th className="px-1 py-1 border-x-0 border-gray-300 text-left">变量名</th>
                    <th className="px-1 py-0.5 border-x-0 border-gray-300 text-left">值</th>
                    <th className="px-1 py-0.5 border-x-0 border-gray-300">参数类型</th>
                    <th className="px-1 py-0.5 border-x-0 border-gray-300">操作</th>
                </tr>
                </thead>
            </table>

            <div className="overflow-y-auto h-40">
                <table className="text-xs text-center w-full table-fixed">
                    <tbody>
                    {/* Render input parameters (入参) */}
                    {renderRows(data.in, 'in')}
                    {/* Render output parameters (出参) */}
                    {renderRows(data.out, 'out')}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

export default DataTable;
