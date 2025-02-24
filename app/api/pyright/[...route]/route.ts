import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { route: string[] } }) {
    const [endpoint, ...rest] = params.route;
    console.log("endpoint: ", endpoint);

    // 这里假设你的 Pyright 服务运行在 http://localhost:3001
    const PYRIGHT_URL = process.env.PYRIGHT_URL || 'http://localhost:5000/api';

    const url = `${PYRIGHT_URL}/${endpoint}${
        rest.length ? `/${rest.join('/')}` : ''
    }`;

    const body = await req.json();

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: { route: string[] } }) {
    const [endpoint, ...rest] = params.route;
    const PYRIGHT_URL = process.env.PYRIGHT_URL || 'http://localhost:5000';

    const url = `${PYRIGHT_URL}/${endpoint}${
        rest.length ? `/${rest.join('/')}` : ''
    }`;

    const response = await fetch(url, { method: 'DELETE' });
    return NextResponse.json({ success: response.ok });
}