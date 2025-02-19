"use client";
import {useEffect, useRef, useState} from 'react';
import {CodeEditor,CodeEditorHandle } from "@/app/ui/process/CodeCreate";
import DynamicForm, { DynamicFormHandle } from "@/app/ui/process/ParamsForm";
import {useSession} from "next-auth/react";
import { useRouter } from 'next/navigation';
import Dialog from "@/app/ui/Dialog";
import  TableData from "@/app/ui/process/ParamsTable";
// import { DataTable } from 'primereact/datatable';
import DataTable from "@/app/ui/process/ParamsTable";
import dynamic from "next/dynamic";
import MonacoEditor from "@/app/components/ui/MonacoEditor";

const ME = dynamic(() => import("@/app/components/ui/MonacoEditor"), {
    ssr: false,
});

const initialData = {
    in: [
    ],
    out: [
    ]
};

const initialData1 = {
    in: [
        { name: 'param1', value: 'value1' },
        { name: 'param2', value: 'value2' }
    ],
    out: [
        { name: 'paramA', value: 'valueA' },
        { name: 'paramB', value: 'valueB' }
    ]
};

export default function Page() {
    const tableRef = useRef<any>(null);
    const dynamicFormRef_in = useRef<DynamicFormHandle>(null);
    const dynamicFormRef_out = useRef<DynamicFormHandle>(null);
    const codeEditorRef = useRef<CodeEditorHandle>(null);
    const [codeSessionId,setCodeSessionId] = useState(null);
    const {data: session, status} = useSession();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogSuccess, setDialogSuccess] = useState(false);
    const [code,setCode] = useState('');

    const router = useRouter();

    useEffect(() => {
        // Function to fetch session ID
        const fetchSession = async () => {
            try {
                const response = await fetch('/api/pyright/session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to create session');
                }

                const data = await response.json();
                // Assuming the session ID is returned in a field named 'sessionId'
                setCodeSessionId(data.sessionId);
            } catch (error) {
                console.error('Failed to fetch session:', error);
                // Optionally, you might want to set a fallback state or show an error to the user
            }
        };

        // Fetch session when component mounts
        fetchSession().then(r => {console.log("fetchSession")});

        // Cleanup function to close the session when the component unmounts
        return () => {
            if (codeSessionId) {
                // Function to close session
                const closeSession = async () => {
                    try {
                        const response = await fetch(`/api/pyright/session/${codeSessionId}`, {
                            method: 'DELETE',
                        });

                        if (!response.ok) {
                            throw new Error('Failed to close session');
                        }
                    } catch (error) {
                        console.error('Failed to close session:', error);
                    }
                };

                closeSession().then(r => {console.log("closeSession")});
            }
        };
    }, []);



    function openDialog(msg:string,status:boolean,showOrNot:boolean){
        setDialogMessage(msg);
        setDialogSuccess(status);
        setShowDialog(showOrNot);
    }

    const handleEditorChange = (value: string | undefined, event: any) => {
        console.log('Editor content:', value);
    };

    const handleSubmit = async () => {
        if (!title || title.trim() === "") {
            openDialog("脚本名称不能为空",false,true);
            return;
        }
        if (!codeEditorRef.current?.getCode() || codeEditorRef.current.getCode().trim() === "") {
            openDialog("脚本内容不能为空",false,true);
            return;
        }
        if (!description || description.trim() === "") {
            openDialog("脚本描述不能为空",false,true);
            return;
        }


        const formData = {
            script_name: title,
            script_content:codeEditorRef.current?.getCode()||"",
            script_params_in: dynamicFormRef_in.current?.getData() || [],
            script_params_out: dynamicFormRef_out.current?.getData() || [],
            script_description:description,
        };

        // const params = {in:formData.script_params_in,out:formData.script_params_out}
        const params = tableRef.current.getData() || initialData;
        console.log(params);
        console.log("session user email info "+session?.user?.email);
        // const id:string = `1`;
        try {
            const response = await fetch('/api/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    script_name: formData.script_name,
                    script_content: formData.script_content, // Convert age to an integer
                    script_params:params,
                    script_description:formData.script_description,
                    create_user:session?.user?.email,
                }),
            });

            const result = await response.json();
            if (result.success) {
                console.log('Data submitted successfully:', result.data);
                openDialog("提交成功",true,true);
            } else {
                console.error('Submission failed:', result.error);
                openDialog('提交失败: ' + result.error,false,true);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            openDialog('错误信息: ' + error,false,true);
        }

    };

    // @ts-ignore
    return (
        <div className="h-screen overflow-hidden">
            <Dialog
                message={dialogMessage}
                isVisible={showDialog}
                isSuccess={dialogSuccess}
                onClose={() => setShowDialog(false)}
            />

            <div className="mt-2 flex h-screen w-full">
                <div className="h-screen w-1/2">
                    <div className="mb-0.5">
                        <span className="border-l-[3px] border-indigo-600 h-5 text-xs font-bold pl-[6px]">代码编辑区</span>
                        <span className="text-xs">*</span>
                    </div>
                    {/*<span className="text-xs font-semibold">代码编辑区</span>*/}
                    {/*<CodeEditor ref={codeEditorRef} script={""}/>*/}
                    {/*<MonacoEditor*/}
                    {/*    value="// 在此编写您的代码..."*/}
                    {/*    language="python"*/}
                    {/*    // onChange={handleCodeChange}*/}
                    {/*/>*/}
                    <ME handleChange={handleEditorChange} />


                </div>
                <div className="pl-4 mt-1 h-screen w-1/2 text-xs mb-0.5 mx-1">
                    <div className="flex justify-end gap-2">
                        {/*<div className="flex w-32 gap-2">*/}
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-400 hover:bg-blue-500 text-white text-sm px-4 py-0.5 rounded-sm my-1 mx-1"
                        >
                            提交
                        </button>
                        <button
                            onClick={() => router.push('/dashboard/processes')}
                            className="ml-1 bg-blue-400 hover:bg-blue-500 text-white text-sm px-4 py-0.5 rounded-sm my-1 mx-2"
                        >
                            取消
                        </button>
                        <button
                            onClick={() => router.push('/dashboard/processes')}
                            className="ml-1 bg-blue-400 hover:bg-blue-500 text-white text-sm px-4 py-0.5 rounded-sm my-1 mx-2"
                        >
                            调试
                        </button>
                        {/*</div>*/}

                    </div>
                    <div className="w-full">
                        <div className="mb-0.5">
                            <span
                                className="border-l-[3px] border-indigo-600 h-5 text-xs font-bold pl-[6px]">标题</span>
                            <span className="text-xs">*</span>
                        </div>
                        <input
                            className="w-full text-xs rounded-sm shadow-sm mb-[6px] border border-gray-300 placeholder:text-gray-500"
                            placeholder="请填写流程标题"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="mb-0.5 mt-1">
                        <span
                            className="border-l-[3px] border-indigo-600 h-5 text-xs font-bold pl-[6px]">流程描述</span>
                        <span className="text-xs">*</span>
                    </div>
                    <textarea placeholder="请填写子流程描述"
                              className="w-full h-28 bg-white shadow-sm rounded-sm border border-gray-300 text-sm rounded-xs placeholder:text-gray-500
                              focus:outline-none focus:ring-0"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                    ></textarea>

                    <div className="w-full">
                        <DataTable ref={tableRef} initialData={initialData} />
                    </div>

                    <div className="w-full">
                        <div className="mb-0.5 mt-1">
                            <span
                                className="border-l-[3px] border-indigo-600 h-5 text-xs font-bold pl-[6px]">执行结果</span>
                        </div>
                        {/*<textarea placeholder="调试输出"*/}
                        {/*          className="w-full h-28 bg-white shadow-sm rounded-sm border border-gray-300 text-sm rounded-xs placeholder:text-gray-500*/}
                        {/*  focus:outline-none focus:ring-0"*/}
                        {/*          value={description}*/}
                        {/*          onChange={(e) => setDescription(e.target.value)}*/}
                        {/*></textarea>*/}
                        <span>xxx</span>
                    </div>


                </div>
            </div>
        </div>
    );
}