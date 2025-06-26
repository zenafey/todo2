import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const FASTAPI_URL = process.env.FASTAPI_URL;

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const token = (await cookies()).get('access_token')?.value;
    const paramsid = (await params).id
    if (!token) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = request.method === 'PUT' ? await request.json() : null;

    const res = await fetch(`api/tasks/${paramsid}`, {
        method: request.method,
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `access_token=${token}`
        },
        body: body ? JSON.stringify(body) : null,
    });

    if (request.method === 'DELETE') {
        return new NextResponse(null, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export { handler as PUT, handler as DELETE };