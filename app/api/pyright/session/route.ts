import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = await fetch('http://localhost:5000/session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Add body here if your Pyright server expects more data to create a session
        });

        if (!response.ok) {
            throw new Error('Failed to create session');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating session:', error);
        return NextResponse.json({ error: 'Failed to create session',status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { sid: string } }) {
    const { sid } = params;

    try {
        const response = await fetch(`http://localhost:5000/session/${sid}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to close session');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error closing session:', error);
        return NextResponse.json({ error: 'Failed to close session' ,status: 500});
    }
}