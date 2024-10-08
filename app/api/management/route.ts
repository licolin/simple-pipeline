import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const systemFileCounts = await prisma.t_system_info.findMany({
            select: {
                id:true,
                system_name: true,
                files: {
                    select: {
                        model: true,
                    },
                },
            },
        });
        return NextResponse.json({ success: true, data: systemFileCounts });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ success: false, error: (error as Error).message });
    }
}
export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log("data "+data);
        // @ts-ignore
        if (data.type === 'addLibrary'){
            const ret = await prisma.t_system_info.create({
                data: {
                    system_name: data.system_name || null,
                },
            });

            return NextResponse.json({ success: true, data: ret });
        }else if(data.type === 'addFile'){
            console.log("unsupported request type!");
        }
        else {
            return NextResponse.json({ success: false, error: 'Unknown request type' });
        }
    } catch (error) {
        console.error('Error saving data:', error);
        return NextResponse.json({ success: false, error: (error as Error).message });
    }
}
