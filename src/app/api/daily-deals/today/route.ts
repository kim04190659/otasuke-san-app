import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId || !['mother', 'gibo'].includes(userId)) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('daily_deals')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .lte('sale_start_date', today)
            .gte('sale_end_date', today)
            .order('discount_amount', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
