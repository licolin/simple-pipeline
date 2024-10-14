"use client"
// import StepIndicator from "@/app/ui/pipeline/exec/step";
import {usePathname, useSearchParams} from 'next/navigation';
// import BasicDemo from "@/app/ui/pipeline/exec/tab";
// import {SelectDemo} from "@/app/ui/pipeline/exec/select";
import ExecButton from "@/app/ui/pipeline/exec/button";
import StepIndicator from "@/app/ui/pipeline/exec/step";
import React, {useEffect, useState} from "react";
// import {TabMenu} from "primereact/tabmenu";
import JsonElement, {EditType} from "@/app/ui/pipeline/exec/jsonviewer";
import Dialog from "@/app/ui/Dialog";
import Select, {Option} from "@/app/ui/pipeline/exec/select"

// import Step from "@/app/ui/pipeline/exec/step";

interface Step {
    label: string;
    completed: boolean;
    active: boolean;
    error: boolean;
}

interface ExecDetail {
    id: number;
    exec_id: string;
    status: string;
    start_time: string;
    end_time: string;
    executor: string;
    exec_info: string;
}

const options: Option[] = [
    {value: 'exec', label: '执行'},
    {value: 'stop', label: '暂停'},
    {value: 'cancel', label: '取消'},
    {value: 'rerun', label: '失败重跑'},
    {value: 'continuerun', label: '继续执行'}
];


export default function Page() {
    const [step, setStep] = useState<Step[]>([]);
    const [details, setDetails] = useState<ExecDetail[]>([]);
    const [currentID, setCurrentID] = useState(0);
    const [tab, setTab] = useState(1);

    const [config, setConfig] = useState({});
    const [error, setError] = useState('');

    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogSuccess, setDialogSuccess] = useState(false);


    const pathname = usePathname();

    const segments: string[] = pathname.split('/');
    const id: string = segments[4];
    console.log("id is " + id);

    const handleOptionSelect = (option: Option) => {
        console.log("Selected Option:", option);
    };

    const handleClick = (detail: ExecDetail) => {
        console.log("handleClick " + JSON.stringify(detail.exec_info));
        setStep(JSON.parse(detail.exec_info));
    }

    const handleUpdate = async () => {
        try {
            const res = await fetch(`/api/pipeline/config/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({config}),
            });

            const data = await res.json();

            if (data.success) {
                setDialogMessage('配置更新成功');
                setShowDialog(true);
                setDialogSuccess(true);

            } else {
                setDialogMessage(`Error: ${data.error}`);
                setShowDialog(true);
                setDialogSuccess(false);
            }
        } catch (error) {
            setDialogMessage('Error updating config');
            setShowDialog(true);
            setDialogSuccess(false);
        }
    };

    function handleConfigChange(info: EditType) {
        // console.log(JSON.stringify(info.src));
        setConfig(info.src);
    }

    useEffect(() => {
        // Fetch specialty data from the database on component mount
        async function fetchNodeInfo() {
            const response = await fetch(`/api/exec?id=${id}`);
            const data = await response.json();
            console.log("data info is: " +  JSON.stringify(data));
            if (data?.data?.nodes) {
                const transformedData = JSON.parse(data.data.nodes).map((item: { className: any; }) => ({
                    // label: item.data.label,
                    label: item.className,
                    completed: false,
                    active: false,
                    error: false
                }));
                setStep(transformedData);
                console.log("Transformed Data:", transformedData);
            } else {
                console.log("Data or nodes are null or undefined");
                setStep([]); // Set an empty array or default state
            }

        }

        fetchNodeInfo().then(r => console.log("fetch folder information!"));
    }, []);


    useEffect(() => {
        // Fetch specialty data from the database on component mount
        async function fetchHistory() {
            const response = await fetch(`/api/exec/history`);
            const data = await response.json();
            setDetails(data.data);
        }

        fetchHistory().then(r => console.log("fetch folder information!"));
    }, []);

    useEffect(() => {
        console.log("step information is "+JSON.stringify(step))
        const fetchConfig = async () => {
            try {
                const res = await fetch(`/api/pipeline/config/${id}`);
                const data = await res.json();
                console.log("fetch config information is: " + data.data);

                if (data.success) {
                    console.log("fetch config success!");
                    setConfig(data.data);  // The config object
                } else {
                    console.log("fetch config failed!");
                    console.log("fetch config error information is " + data.error);
                    setError(data.error);
                }
            } catch (err) {
                setError('获取配置信息失败');
            }
        };

        fetchConfig();
    }, []);


    return (
        <div>

            <Dialog
                message={dialogMessage}
                isVisible={showDialog}
                isSuccess={dialogSuccess}
                onClose={() => setShowDialog(false)}
            />

            <div className="flex w-full">
                <div className="mt-2 w-4/5 pr-2">
                    <div className="mt-2 w-full h-32">
                        <div className="border border-slate-300 shadow shadow-slate-300 rounded my-2 mx-1 py-1">
                            <StepIndicator steps={step}/>
                        </div>
                        <div className="flex justify-between mt-2 w-full">
                            <div
                                className="border border-slate-300 shadow shadow-slate-400 rounded my-2 mx-1 py-1 px-2">
                                <span className="text-xs font-bold">执行状态:成功</span>
                                <span className="text-xs font-bold mx-3">执行时长:12分钟</span>
                                <span className="text-xs font-bold mx-3">执行人:yyyyy</span>
                                <span className="text-xs font-bold mx-3">执行时间:2024/08/09/12:13:12</span>
                            </div>
                            <div className="flex my-2 mx-2 px-2">
                                <div>
                                    <Select options={options} placeholder="选择执行方式" onSelect={handleOptionSelect}/>
                                </div>
                                <div className="ml-3">
                                    <ExecButton/>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="mt-3 w-full">
                        {/*<BasicDemo/>*/}
                        <div className="">
                            <nav className="flex space-x-4">
                            <span onClick={() => setTab(1)}
                                  className={`pb-2 text-sm font-bold hover:cursor-pointer ${tab === 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'} `}>执行配置</span>
                                <span onClick={() => setTab(2)}
                                      className={`pb-2 text-sm font-bold hover:cursor-pointer ${tab === 2 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'} `}>执行日志</span>
                            </nav>
                        </div>
                        <div className="w-full mt-1">
                            {tab === 1 ? <div>
                            <span onClick={handleUpdate}
                                  className="mx-[1px] mb-[2px] my-1 px-2 py-1 text-xs border-none rounded-sm bg-fuchsia-400 hover:cursor-pointer text-white">
                                保存配置信息
                            </span>
                                <JsonElement initialData={config} onJsonChange={handleConfigChange}/>
                            </div> : <div
                                className="w-full">yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy</div>}
                        </div>

                    </div>
                </div>
                <div className="mt-2 w-1/5 ml-2 mr-2">
                    <span className="text-xs font-bold">执行历史记录</span>
                    <div
                        className="w-full min-h-[568px] border border-slate-300 shadow shadow-slate-300 rounded font-sans">
                        {details.map((detail, index) => (
                                <div
                                    key={detail.id}
                                    className={`mx-1.5 my-[1px] ${
                                        currentID === index
                                            ? "bg-red-200 hover:bg-red-300"
                                            : "hover:bg-slate-200"
                                    } rounded-sm p-1 cursor-pointer`}
                                >
              <span onClick={() => {
                  setCurrentID(index);
                  handleClick(detail)
              }}
                    className={`text-xs font-bold ${
                        detail.status === "failed" ? "text-red-800" : "text-black"
                    }`}
              >
                {detail.start_time}
              </span>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}