import {NextResponse, NextRequest} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const data = await request.json();
    try {
        if (data.title != null) {
            const messages = await prisma.t_posts.findMany({
                where: {
                    title: data.title,
                    username:data.username
                },
                select: {
                    message: true,
                },
                orderBy: {
                    insert_time: 'asc', // or 'desc' for descending order
                },
            });
            return NextResponse.json({success: true, data: messages});
        } else {
            return NextResponse.json({success: false, data: []})
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({success: false, error: (error as Error).message});
    }
}
