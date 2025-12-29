import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    const { id } = params;

    try {
        const body = await request.json();

        const { data, error } = await supabase
            .from('daily_deals')
            .update({
                user_id: body.user_id,
                store_name: body.store_name,
                product_name: body.product_name,
                regular_price: body.regular_price,
                sale_price: body.sale_price,
                distance: body.distance,
                sale_start_date: body.sale_start_date,
                sale_end_date: body.sale_end_date,
                stock_status: body.stock_status,
                recommendation_point: body.recommendation_point,
                image_url: body.image_url,
                is_active: body.is_active,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('Failed to update daily deal:', error);
        return NextResponse.json(
            {
                success: false,
                error,
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    const { id } = params;

    try {
        const { error } = await supabase
            .from('daily_deals')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error('Failed to delete daily deal:', error);
        return NextResponse.json(
            {
                success: false,
                error,
            },
            { status: 500 }
        );
    }
}
