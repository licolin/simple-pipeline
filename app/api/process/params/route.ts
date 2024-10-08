import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        // Check if the query parameter exists
        if (!id) {
            return NextResponse.json({ success: false, error: 'ID query parameter is required' });
        }

        // Fetch data from the database using the provided ID
        const script = await prisma.python_scripts.findUnique({
            where: { id: parseInt(id) },
            select: {
                params: true
            }
        });

        if (!script) {
            return NextResponse.json({ success: false, error: 'Script not found' });
        }

        return NextResponse.json({ success: true, data: script });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ success: false, error: (error as Error).message });
    }
}
