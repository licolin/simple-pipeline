import {NextResponse, NextRequest} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const url = new URL(request.url);

    // const id:string | null = url.searchParams.get('id');
    try {
        const files = await prisma.t_pipeline_execution.findMany({
            select: {
                pipeline_id: true,
                exec_info:true,
                executor:true,
                start_time:true,
                end_time:true,
                status:true,
                exec_id:true,
                id:true,
            },
            orderBy: {
                start_time: 'desc', // Sort by start_time in descending order
            },
            take: 20,
        });
        return NextResponse.json({success: true, data: files});

    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({success: false, error: (error as Error).message});
    }
}
