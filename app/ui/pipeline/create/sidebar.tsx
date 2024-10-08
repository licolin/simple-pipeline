import React, {useEffect, useState, FC, Suspense} from 'react';
import TreeView,{TreeNode} from '@/app/ui/pipeline/TreeView';

export default function Sidebar() {
    const [scripts, setScripts] = useState<TreeNode[]>([]);
    useEffect(() => {
        const fetchScripts = async () => {
            try {
                const response = await fetch('/api/process');
                const result = await response.json();
                if (result.success) {
                    console.log("result data "+JSON.stringify(result.data));
                    const ret = {
                        id: 0,
                        script_name:"子流程",
                        children: result.data
                    };
                    // setScripts(result.data);
                    // @ts-ignore
                    setScripts([ret]);
                } else {
                    console.error('Error fetching scripts:', result.error);
                }
            } catch (error) {
                console.error('Error fetching scripts:', error);
            }
        };
        fetchScripts().then(r => console.log("Scripts fetched"));
    }, []);


    return (
        <Suspense fallback={<div>Loading...</div>}>
            <aside className="bg-white p-2 rounded h-full w-64">
                <div className="text-xs mb-2 font-bold">拖拽子流程到右边面板</div>
                <div className="h-full max-h-[calc(100vh-4rem)] overflow-y-auto">
                    {/*<ScriptList />*/}
                    <TreeView data={scripts}></TreeView>
                </div>

            </aside>
        </Suspense>
    );
};
