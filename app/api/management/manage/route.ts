import {NextResponse, NextRequest} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const url = new URL(request.url);

    const system_id:string | null = url.searchParams.get('systemId');
    const model = url.searchParams.get('model');
    const isModel = model === "1";
    console.log("model is "+model);
    try {
        if (system_id != null) {
            const files = await prisma.t_file_management.findMany({
                where: {
                    systemid: parseInt(system_id),
                    model: isModel,
                },
                select: {
                    model: true,
                    systemid: true,
                    filename: true,
                    creator: true,
                    updater: true,
                    create_time: true,
                    update_time: true,
                    id: true,
                    system: {
                        select: {
                            system_name: true,
                        },
                    },
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
