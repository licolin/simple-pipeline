"use client";
import { useRouter } from 'next/navigation';
import {useRef, useState} from "react";
// import {CodeEditor} from "@/app/ui/process/CodeBlock";
import DynamicForm, { DynamicFormHandle } from "@/app/ui/process/ParamsForm";
import {CodeEditor,CodeEditorHandle } from "@/app/ui/process/CodeCreate";
import {useSession} from "next-auth/react";
import Dialog from "@/app/ui/Dialog";
import DataTable from "@/app/ui/process/ParamsTable";

interface EditorPageProps {
    content: string;
    scriptName: string;
    description: string;
    params:string;
    id:string;
}

interface Row {
    name: string;
    value: string;
}

export function EditorPage({ content, scriptName, description,params,id }:EditorPageProps) {
    const router = useRouter();
    const tableRef_edit = useRef<any>(null);
    const {data: session, status} = useSession();
    const [title, setTitle] = useState(scriptName);
    const [desc, setDesc] = useState(description);

    const formRef = useRef<DynamicFormHandle>(null);
    const formRef_out = useRef<DynamicFormHandle>(null);
    const codeEditorRef = useRef<CodeEditorHandle>(null);

    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogSuccess, setDialogSuccess] = useState(false);

    console.log("params "+params);
    let initialRows_in: Row[] = [];
    let initialRows_out: Row[] = [];


    function openDialog(msg:string,status:boolean,showOrNot:boolean){
        setDialogMessage(msg);
        setDialogSuccess(status);
        setShowDialog(showOrNot);
    }

    const parameters = JSON.parse(params);

    try {
        const Params = JSON.parse(params);

        // Ensure Params is an object and not null
        if (Params && typeof Params === 'object') {
            initialRows_in = Array.isArray(Params.in) ? Params.in : [];
            initialRows_out = Array.isArray(Params.out) ? Params.out : [];

            console.log("initialRows_in", initialRows_in);
            console.log("initialRows_out", initialRows_out);
        } else {
            // Handle the case where Params is not an object
            console.warn("Params is not an object or is null");
            initialRows_in = [];
            initialRows_out = [];
        }
    } catch (error) {
        console.error("Invalid JSON string or parsing error", error);
    }

    const handleSubmit = async () => {
        if (!title || title.trim() === "") {
            openDialog("脚本名称不能为空",false,true);
            return;
        }
        if (!codeEditorRef.current?.getCode() || codeEditorRef.current.getCode().trim() === "") {
            openDialog("脚本内容不能为空",false,true);
            return;
        }
        if (!desc || desc.trim() === "") {
            openDialog("脚本描述不能为空",false,true);
            return;
        }


        const formData = {
            script_name: title,
            script_content:codeEditorRef.current?.getCode()||"",
            // script_params_in: formRef.current?.getData() || [],
            // script_params_out: formRef_out.current?.getData() || [],
            script_description:desc,
        };

        // const update_params = {in:formData.script_params_in,out:formData.script_params_out}
        const update_params = tableRef_edit.current.getData()||{
            in: [

            ],
            out: [
            ]
        };
        try {
            const response = await fetch('/api/process/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id:id,
                    script_name: formData.script_name,
                    script_content: formData.script_content, // Convert age to an integer
                    script_params:update_params,
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


    return (
        <div>
            <Dialog
                message={dialogMessage}
                isVisible={showDialog}
                isSuccess={dialogSuccess}
                onClose={() => setShowDialog(false)}
            />

        <div className="mt-2 flex">
            <div>
                {/*<span className="text-xs font-semibold">代码编辑区</span>*/}
                <div className="mb-0.5">
                    <span className="border-l-[3px] border-indigo-600 h-5 text-xs font-bold pl-[6px]">代码编辑区</span>
                    <span className="text-xs">*</span>
                </div>
                <CodeEditor ref={codeEditorRef} script={content}/>
            </div>
            <div className="w-full ml-2 mt-1 overflow-y-auto h-screen">
                <div className="flex justify-end">
                    <button
                        onClick={() => handleSubmit()}
                        className="bg-blue-400 hover:bg-blue-500 text-white text-sm px-4 py-0.5 rounded-sm my-1 "
                    >
                        提交
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/processes')}
                        className="mx-2 bg-blue-400 hover:bg-blue-500 text-white text-sm px-4 py-0.5 rounded-sm my-1"
                    >
                        取消
                    </button>

                    <button
                        onClick={() => router.push('/dashboard/processes')}
                        className="mx-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-0.5 rounded-sm my-1"
                    >
                        调试
                    </button>
                </div>
                <div className="mb-0.5">
                    <span className="border-l-[3px] border-indigo-600 h-5 text-xs font-bold pl-[6px]">标题</span>
                    <span className="text-xs">*</span>
                </div>
                <input
                    className="w-full text-xs rounded-sm shadow-sm mb-1 border border-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-0"
                    placeholder="请填写流程标题"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div className="mb-0.5 mt-1">
                    <span className="border-l-[3px] border-indigo-600 h-5 text-xs font-bold pl-[6px]">流程描述</span>
                    <span className="text-xs">*</span>
                </div>
                <textarea
                    placeholder="请填写子流程描述"
                    className="w-full h-28 bg-white shadow-sm rounded-sm border border-gray-300 text-sm rounded-xs placeholder:text-gray-500
                          focus:outline-none focus:ring-0"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                ></textarea>
                {/*<DynamicForm ref={formRef} title="入参信息" initialRows={initialRows_in}/>*/}
                {/*<DynamicForm ref={formRef_out} title="出参信息" initialRows={initialRows_out}/>*/}
                <div className="w-full">
                    <DataTable ref={tableRef_edit} initialData={parameters}/>
                </div>

                <div className="mb-0.5 mt-1">
                    <span className="border-l-[3px] border-indigo-600 h-5 text-xs font-bold pl-[6px]">执行结果</span>
                </div>
                <textarea placeholder="调试输出"
                          className="w-full h-28 bg-white shadow-sm rounded-sm  border-gray-300 text-sm rounded-xs placeholder:text-gray-500
                          focus:outline-none focus:ring-0"
                ></textarea>


            </div>
        </div>
        </div>
    );
}
