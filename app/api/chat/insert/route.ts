// app/api/process/route.ts
import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient, python_scripts} from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const data = await request.json();
        // const data: Omit<python_scripts, 'id'> = await request.json();
        if (!data.title || !data.title.trim()) {
            return NextResponse.json({success: false, error: "标题不可以为空"});
        }
        if (!data.username || !data.username.trim()) {
            return NextResponse.json({success: false, error: "用户信息不能为空"});
        }
        if (!data.message) {
            return NextResponse.json({success: false, error: "消息内容不能为空"});
        }
        // const data: Omit<python_scripts, 'id'> = await request.json();
        // @ts-ignore
        const ret = await prisma.t_posts.create({
            data: {
                title: data.title,
                username: data.username,
                message: data.message ? JSON.stringify(data.message) : {},
                // description: data.script_description || null,
                // create_user: data.create_user || null,
                // update_user: data.update_user || null,
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

    const username: string | null = url.searchParams.get('username');
    try {

        if (username != null) {
            const posts = await prisma.t_posts.groupBy({
                by: ['title', 'username'],
                where: {
                    username: username, // Filter by username
                },
                _max: {
                    insert_time: true, // Get the max insert_time
                },
                orderBy: {
                    _max: {
                        insert_time: 'desc', // Order by latest insert_time
                    },
                },
                take: 15, // Limit the results to 15
            });
            return NextResponse.json({success: true, data: posts});
        } else {
            return NextResponse.json({success: false, data: []})
        }
    } catch (error) {
        console.error('Error saving data:', error);
        return NextResponse.json({success: false, error: (error as Error).message});
    }
}
