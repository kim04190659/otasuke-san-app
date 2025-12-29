import { NextRequest, NextResponse } from 'next/server';
import { searchDailyGoods } from '@/lib/dailyGoods';
import { Product, PurchasePriority } from '@/types/dailyGoods';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { product, priority, userLocation, ageGroup } = body;

        // バリデーション
        if (!product || !priority) {
            return NextResponse.json(
                { error: '必要な情報が不足しています' },
                { status: 400 }
            );
        }

        // Claude APIで検索
        const result = await searchDailyGoods({
            product: product as Product,
            priority: priority as PurchasePriority,
            userLocation: userLocation || '不明',
            ageGroup: ageGroup || '80代',
        });

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Daily goods search error:', error);
        return NextResponse.json(
            {
                success: false,
                error: '商品情報の取得に失敗しました。もう一度お試しください。',
            },
            { status: 500 }
        );
    }
}
