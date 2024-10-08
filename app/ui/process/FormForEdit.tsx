"use client"
// import React, {useState, forwardRef, useImperativeHandle, useRef} from 'react';
//
// interface Row {
//     name: string;
//     value: string;
// }
//
// interface DynamicFormProps {
//     ref?: React.Ref<DynamicFormHandle>;
//     title: string;
// }
//
// export interface DynamicFormHandle {
//     getData: () => Row[];
// }
//
// // export default function DynamicForm()
// // @ts-ignore
// const DynamicForm = forwardRef<DynamicFormHandle, DynamicFormProps>((props, ref) =>{
//     const [rows, setRows] = useState<Row[]>([{ name: '', value: '' }]);
//     const addRow = () => {
//         setRows([...rows, { name: '', value: '' }]);
//     };
//
//     const removeRow = (index: number) => {
//         const newRows = [...rows];
//         newRows.splice(index, 1);
//         setRows(newRows);
//     };
//
//     const handleInputChange = (index: number, field: 'name' | 'value', value: string) => {
//         const newRows = [...rows];
//         newRows[index][field] = value;
//         setRows(newRows);
//     };
//
//     useImperativeHandle(ref, () => ({
//         getData: () => rows,
//     }));
//
//     return (
//         <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-sm p-4 mt-1 border border-gray-300">
//             <h5 className="text-xs font-bold mb-2 text-rose-800">{props.title}</h5>
//             <div className="space-y-2">
//                 {rows.map((row, index) => (
//                     <div key={index} className="flex items-center justify-between space-x-2">
//                         <input
//                             type="text"
//                             placeholder="参数名称"
//                             value={row.name}
//                             onChange={(e) => handleInputChange(index, 'name', e.target.value)}
//                             className="w-full px-2 py-[1px] border border-gray-300 h-6 text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                         <input
//                             type="text"
//                             placeholder="参数默认值"
//                             value={row.value}
//                             onChange={(e) => handleInputChange(index, 'value', e.target.value)}
//                             className="w-full px-2 py-[1px] border border-gray-300 h-6 text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         />
//                         <button
//                             onClick={() => removeRow(index)}
//                             className="bg-emerald-600 hover:bg-emerald-700 text-white w-28 h-6 text-xs px-4 py-[1px] rounded-sm"
//                         >
//                             删除
//                         </button>
//                     </div>
//                 ))}
//             </div>
//             <button
//                 onClick={addRow}
//                 className="bg-blue-400 hover:bg-blue-500 text-white text-sm px-4 py-0.5 rounded-sm mt-4"
//             >
//                 添加参数
//             </button>
//         </div>
//     );
// })
//
// export default DynamicForm;

"use client"
import React, { useState, forwardRef, useImperativeHandle } from 'react';

interface Row {
    name: string;
    value: string;
}

interface DynamicFormProps {
    initialRows?: Row[]; // New prop to initialize rows
    ref?: React.Ref<DynamicFormHandle>;
    title: string;
}

export interface DynamicFormHandle {
    getData: () => Row[];
}

const DynamicForm = forwardRef<DynamicFormHandle, DynamicFormProps>((props, ref) => {
    // Initialize rows with either initialRows prop or a default row
    const [rows, setRows] = useState<Row[]>(props.initialRows || [{ name: '', value: '' }]);

    const addRow = () => {
        setRows([...rows, { name: '', value: '' }]);
    };

    const removeRow = (index: number) => {
        const newRows = [...rows];
        newRows.splice(index, 1);
        setRows(newRows);
    };

    const handleInputChange = (index: number, field: 'name' | 'value', value: string) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    useImperativeHandle(ref, () => ({
        getData: () => rows,
    }));

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-sm p-4 mt-1 border border-gray-300">
            <h5 className="text-xs font-bold mb-2 text-rose-800">{props.title}</h5>
            <div className="space-y-2">
                {rows.map((row, index) => (
                    <div key={index} className="flex items-center justify-between space-x-2">
                        <input
                            type="text"
                            placeholder="参数名称"
                            value={row.name}
                            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                            className="w-full px-2 py-[1px] border border-gray-300 h-6 text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="参数默认值"
                            value={row.value}
                            onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                            className="w-full px-2 py-[1px] border border-gray-300 h-6 text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => removeRow(index)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white w-28 h-6 text-xs px-4 py-[1px] rounded-sm"
                        >
                            删除
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={addRow}
                className="bg-blue-400 hover:bg-blue-500 text-white text-sm px-4 py-0.5 rounded-sm mt-4"
            >
                添加参数
            </button>
        </div>
    );
});

export default DynamicForm;
