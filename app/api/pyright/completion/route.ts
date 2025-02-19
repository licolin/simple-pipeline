import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { code, position, sessionId } = body;

    if (!sessionId || !code || !position) {
        return NextResponse.json({ error: "Missing required parameters", status: 400 }, );
    }

    try {
        // Assuming your Pyright server is running on localhost:5000 or another URL
        const response = await fetch(`http://localhost:5000/session/${sessionId}/completion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, position }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching completions:', error);
        return NextResponse.json({ error: "Failed to fetch completions",status: 500 } );
    }
}