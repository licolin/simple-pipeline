// app/api/pipeline/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient   } from '@prisma/client';
// import {pipeline} from "node:stream";

const prisma = new PrismaClient();



export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log("data "+data);
        // @ts-ignore
        if (data.type === 'createPipeline'){
            const ret = await prisma.pipelines.create({
                data: {
                    name: data.name || null,
                    description: data.description || null,
                    creator: data.create_user || null,
                },
            });

            return NextResponse.json({ success: true, data: ret });
        }else if(data.type === 'updatePipeline'){
            const pipeline = await prisma.pipelines.update({
                where: {
                    id: data.id,
                },
                data: {
                    nodes: data.nodes,
                    edges: data.edges || null,
                    allparams: data.paramStates,
                },
            });
            return NextResponse.json({ success: true, data: pipeline });
        }
        else {
            return NextResponse.json({ success: false, error: 'Unknown request type' });
        }
    } catch (error) {
        console.error('Error saving data:', error);
        return NextResponse.json({ success: false, error: (error as Error).message });
    }
}

