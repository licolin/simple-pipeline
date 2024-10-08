import { fetchScript } from '@/app/lib/data';
// import { CodeEditor } from '@/app/ui/process/CodeBlock';
import { PythonScript } from "@/app/lib/definitions";
// import { useRouter } from 'next/router';
// import { useState } from 'react';
import {EditorPage} from "@/app/ui/process/Edit"

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    console.log("id " + id);
    const script: PythonScript = await fetchScript(id);
    const content: string = script.script_content;
    const script_name: string = script.script_name;
    const description: string = script.description;
    const Params:string = script.params;

    // Return the server-side content
    return (
        <EditorPage content={content} scriptName={script_name} description={description} params={Params} id={id}/>
    );
}