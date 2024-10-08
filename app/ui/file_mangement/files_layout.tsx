"use client";
import Search from "@/app/ui/search";
import AppointmentTable from "@/app/ui/file_mangement/file_table";
import {useEffect, useState} from "react";
import Modal from "@/app/ui/file_mangement/Modal";
import Dialog from "@/app/ui/Dialog";

export type Folder = {
    id: number;
    system_name: string;
    moduleFileCount:number;
    configFileCount:number;
};


export default function Appointments() {
    const [clickedItemId, setClickedItemId] = useState(1);
    const [folderData, setFolderData] = useState<Folder[]>([]);
    const [tabIndex,setTabIndex] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogSuccess, setDialogSuccess] = useState(false);

    useEffect(() => {
        // Fetch specialty data from the database on component mount
        async function fetchFolderList() {
            const response = await fetch("/api/management");
            const data = await response.json();
            const system_files = data.data;
            const result = system_files.map((system: { files: { filter: (arg0: { (file: any): boolean; (file: any): boolean; }) => { (): any; new(): any; length: any; }; }; id: any; system_name: any; }) => {
                const moduleFileCount = system.files.filter(file => file.model === true).length;
                const configFileCount = system.files.filter(file => file.model === false || file.model === null).length;

                return {
                    id:system.id,
                    system_name: system.system_name,
                    moduleFileCount,
                    configFileCount,
                };
            });

            console.log("data info is "+JSON.stringify(result));

            setFolderData(result);
        }
        fetchFolderList().then(r => console.log("fetch folder information!"));
    }, []);

    function openDialog(msg:string,status:boolean,showOrNot:boolean){
        setDialogMessage(msg);
        setDialogSuccess(status);
        setShowDialog(showOrNot);
    }
    const handleAddDirectory = async (libraryName: string) => {
        console.log(`Library name: ${libraryName}`);
        // Add logic to create the directory with the library name
        setIsModalOpen(false);
        try {
            const response = await fetch('/api/management', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type:'addLibrary',
                    system_name: libraryName,
                    // script_content: formData.script_content, // Convert age to an integer
                    // script_params:params,
                    // script_description:formData.script_description,
                    // create_user:session?.user?.email,
                }),
            });

            const result = await response.json();
            if (result.success) {
                console.log('library add success:', result.data);
                openDialog("新增成功",true,true);
            } else {
                console.error('Submission failed:', result.error);
                openDialog('新增失败: ' + result.error,false,true);
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
        <div className="min-h-screen w-full bg-Fuchsia-50">
            <div className="mx-auto p-0 w-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 w-screen">
                    <h1 className="text-md font-bold">文件/模块管理</h1>
                </div>

                {/* Tabs */}
                <div className="flex border-b mb-4 justify-between w-full">
                    <div>
                        <nav className="flex space-x-4">
                            <span onClick={()=>setTabIndex(1)} className={`pb-2 text-sm font-bold  hover:cursor-pointer ${tabIndex===1?'text-blue-600 border-b-2 border-blue-600':'text-gray-500'} `}>配置文件</span>
                            <span onClick={()=>setTabIndex(2)} className={`pb-2 text-sm font-bold hover:cursor-pointer ${tabIndex===2?'text-blue-600 border-b-2 border-blue-600':'text-gray-500'} `}>公共模块</span>
                        </nav>
                    </div>
                    <div className="mr-[100px]">
                        <button onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 px-4 py-1 text-sm font-medium text-white   hover:bg-blue-500 mx-1 rounded-sm">新增目录
                        </button>
                        <button
                            className="bg-blue-600 px-4 py-1 text-sm font-medium text-white   hover:bg-blue-500 mx-1 rounded-sm">新增文件
                        </button>
                        <button
                            className="bg-blue-600 px-4 py-1 text-sm font-medium text-white   hover:bg-blue-500 mx-1 rounded-sm">上传文件
                        </button>
                    </div>

                </div>

                <div className="flex divide-gray-200 w-full">
                    <div className="w-1/5 p-4 bg-Fuchsia-100 border rounded shadow-md h-[560px]">
                        <h2 className="font-bold text-sm text-gray-600 mb-4">所有文件路径</h2>
                        <ul className="text-sm">
                            {folderData.map((folder, index) => (
                                <li
                                    key={index}
                                    className={`mb-2 flex justify-between hover-item px-2 py-1 rounded-sm hover:cursor-pointer hover:bg-gray-200 ${
                                        folder.id === clickedItemId ? 'bg-gray-300' : ''
                                    }`}
                                    onClick={()=>setClickedItemId(folder.id)}
                                >
                                    <span className="flex-1">{folder.system_name}</span>
                                    <span>{tabIndex === 1?folder.moduleFileCount:folder.configFileCount}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Main Content */}
                    <div className="w-4/5 mr-5">
                        <div className="ml-4 mb-4 flex justify-between w-full">
                            <Search placeholder="文件查询..."/>
                            <div className="h-8"></div>
                        </div>

                        {/* Appointments List */}
                        <div className="w-full ml-4">
                            <div className="bg-white rounded shadow">

                            <AppointmentTable model={tabIndex} system_id = {clickedItemId} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleAddDirectory}
                title="新增目录"
                placeholder="输入目录名称..."
            />
        </div>
        </div>
    );
}

