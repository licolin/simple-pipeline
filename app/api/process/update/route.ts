// app/api/process/route.ts
import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient, python_scripts} from '@prisma/client';

const prisma = new PrismaClient();


export async function POST(request: Request) {
    try {
        const update_data = await request.json();
        if (!update_data.script_name || !update_data.script_name.trim()) {
            return NextResponse.json({success: false, error: "标题不可以为空"});
        }
        if (!update_data.script_content || !update_data.script_content.trim()) {
            return NextResponse.json({success: false, error: "脚本内容不可以为空"});
        }
        if (!update_data.script_description || !update_data.script_description.trim()) {
            return NextResponse.json({success: false, error: "脚本描述不可以为空"});
        }

        // const data: Omit<python_scripts, 'id'> = await request.json();

        // const data: Omit<python_scripts, 'id'> = await request.json();
        // @ts-ignore
        const ret = await prisma.python_scripts.update({
            where: {
                id: parseInt(update_data.id),
            },
            data: {
                script_name: update_data.script_name || null,
                script_content: update_data.script_content || null,
                params: update_data.script_params ? JSON.stringify(update_data.script_params) : null,
                description: update_data.script_description || null,
                create_user: update_data.create_user || null,
                update_user: update_data.update_user || null,
                // create_time: new Date(),  // Optional: Manually set the create time
                // update_time: null,  //
            },

        });

        return NextResponse.json({success: true, data: ret});
    } catch (error) {
        console.error('Error saving data:', error);
        return NextResponse.json({success: false, error: (error as Error).message});
    }
}

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    // Check if the query parameter exists
    if (!id) {
        return NextResponse.json({success: false, error: 'ID query parameter is required'});
    }
    try {
        const scripts = await prisma.python_scripts.findUnique({
            where: {id: parseInt(id)},
            select: {
                script_name: true,
                script_content: true,
                description: true,
                params: true,
            }
        });

        return NextResponse.json({success: true, data: scripts});
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({success: false, error: (error as Error).message});
    }
}
