// app/api/process/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient,python_scripts   } from '@prisma/client';

const prisma = new PrismaClient();



export async function POST(request: Request) {
    try {
        const data = await request.json();
        // const data: Omit<python_scripts, 'id'> = await request.json();
        if (!data.script_name || !data.script_name.trim()) {
            return NextResponse.json({ success: false, error:"标题不可以为空" });
        }
        if (!data.script_content || !data.script_content.trim()) {
            return NextResponse.json({ success: false, error:"脚本内容不可以为空" });
        }
        if (!data.script_description || !data.script_description.trim()) {
            return NextResponse.json({ success: false, error:"脚本描述不可以为空" });
        }
        // const data: Omit<python_scripts, 'id'> = await request.json();
        // @ts-ignore
        const ret = await prisma.python_scripts.create({
            data: {
                script_name: data.script_name || null,
                script_content: data.script_content || null,
                params: data.script_params ? JSON.stringify(data.script_params) : null,
                description: data.script_description || null,
                create_user: data.create_user || null,
                update_user: data.update_user || null,
                create_time: new Date(),  // Optional: Manually set the create time
                // update_time: null,  //
            },

        });

        return NextResponse.json({ success: true, data: ret });
    } catch (error) {
        console.error('Error saving data:', error);
        return NextResponse.json({ success: false, error: (error as Error).message });
    }
}

export async function GET() {
    try {
        const scripts = await prisma.python_scripts.findMany({
            where: {
                script_name: {
                    not: ''
                },
                script_content: {
                    not: ''
                }
            },
            select: {
                id: true,
                script_name: true
            }
        });

        return NextResponse.json({ success: true, data: scripts });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ success: false, error: (error as Error).message });
    }
}
