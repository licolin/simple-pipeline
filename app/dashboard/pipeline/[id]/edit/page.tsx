// import Sidebar from "@/app/ui/pipeline/create/sidebar";
import FlowComponent from "@/app/ui/pipeline/create/flow";
import {NodeEdge} from "@/app/lib/definitions";
import {fetchNodeEdge} from "@/app/lib/data";

type Node = {
    id: string;
    type: string;
    position: {
        x: number;
        y: number;
    };
    data: {
        label?: any;  // Optional since we are deleting it
    };
    className: string;
    sourcePosition: string;
    targetPosition: string;
}


export default async function Page({params}: { params: { id: string } }) {
    const id = params.id;
    const result: NodeEdge = await fetchNodeEdge(id);
    const init_nodes = result.nodes ? JSON.parse(result.nodes) : [];
    const init_edges = result.edges ? JSON.parse(result.edges) : [];
    const init_allParams = result.allparams ? JSON.parse(result.allparams) : {};
    init_nodes.forEach((node:Node) => {
        if (node.data && node.data.label) {
            delete node.data.label;  // Remove the label key and its value
        }
    });

    // console.log("init_nodes is "+JSON.stringify(init_nodes));

    return (
        <div>
            <FlowComponent id={id} node={init_nodes} edge={init_edges} allParams={init_allParams}/>
        </div>
    )

}