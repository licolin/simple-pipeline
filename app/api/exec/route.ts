import {NextResponse, NextRequest} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const url = new URL(request.url);

    const id:string | null = url.searchParams.get('id');
    try {
        if (id != null) {
            const files = await prisma.pipelines.findUnique({
                where: {
                    id: parseInt(id),
                },
                select: {
                    nodes: true,
                }
            });
            return NextResponse.json({success: true, data: files});
        }else{
            return NextResponse.json({success: false, data:[]})
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({success: false, error: (error as Error).message});
    }
}
