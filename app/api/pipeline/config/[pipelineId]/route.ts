import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle GET and POST requests
export async function GET(request: Request, { params }: { params: { pipelineId: string } }) {
    try {
        const { pipelineId } = params;
        const pipelineConfig = await prisma.t_config.findUnique({
            where: {
                pipeline_id: parseInt(pipelineId), // Ensure the pipeline_id is an integer
            },
            select: {
                config: true, // Select only the config field
            },
        });

        if (!pipelineConfig) {
            return NextResponse.json({ success: false, error: 'Pipeline config not found' });
        }

        return NextResponse.json({ success: true, data: pipelineConfig.config });
    } catch (error) {
        console.error('Error fetching pipeline config:', error);
        return NextResponse.json({ success: false, error: (error as Error).message });
    }
}

export async function POST(request: Request, { params }: { params: { pipelineId: string } }) {
    try {
        const { pipelineId } = params;
        const { config } = await request.json();

        if (!pipelineId || !config) {
            return NextResponse.json({ success: false, error: 'Pipeline ID and config are required' });
        }

        // Upsert the config based on the pipeline_id
        const result = await prisma.t_config.upsert({
            where: { pipeline_id: parseInt(pipelineId) },  // Unique pipeline_id
            update: {
                config: config, // Update the config
            },
            create: {
                pipeline_id: parseInt(pipelineId),  // Create with pipeline_id
                config: config, // Insert the new config
            },
        });

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error('Error inserting or updating config:', error);
        return NextResponse.json({ success: false, error: (error as Error).message });
    }
}
