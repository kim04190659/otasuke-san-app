import { NextRequest, NextResponse } from 'next/server';
import { generateShoppingScript } from '@/lib/generate-shopping-script';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { deal } = body;

        if (!deal) {
            return NextResponse.json({ success: false, error: 'Deal information is required' }, { status: 400 });
        }

        const script = await generateShoppingScript(deal);

        return NextResponse.json({ success: true, data: script });
    } catch (error: any) {
        console.error('Script generation api error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
