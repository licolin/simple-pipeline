"use client";
import React, { useState } from 'react';
import { Table, Input, Toggle, IconButton, SelectPicker } from 'rsuite';
import { AiFillDelete, AiFillPlusCircle } from 'react-icons/ai';

const { Column, HeaderCell, Cell } = Table;

const dataTypeOptions = [
    { label: 'string', value: 'string' },
    { label: 'number', value: 'number' },
    { label: 'boolean', value: 'boolean' },
    // add more as needed
];

const initialData = [
    { id: 1, variableName: 'content', dataType: 'string', required: true, source: '引用变量' },
    { id: 2, variableName: 'address', dataType: 'string', required: false, source: '引用变量' },
];

const InputVariablesTable = () => {
    const [data, setData] = useState(initialData);

    const handleAddRow = () => {
        const newRow = { id: Date.now(), variableName: '', dataType: '', required: false, source: '引用变量' };
        setData([...data, newRow]);
    };

    const handleDeleteRow = (id: number) => {
        setData(data.filter(row => row.id !== id));
    };

    const handleChange = (id: number, field: string, value: any) => {
        setData(data.map(row => (row.id === id ? { ...row, [field]: value } : row)));
    };

    return (
        <div>
            <div className="border-b-2 border-indigo-600">

            </div>

        </div>
    );
};

export default InputVariablesTable;
