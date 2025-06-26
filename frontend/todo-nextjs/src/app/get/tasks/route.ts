import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    const token = (await cookies()).get('access_token')?.value;
    if (!token) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();

    const res = await fetch(`api/tasks/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `access_token=${token}`
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}