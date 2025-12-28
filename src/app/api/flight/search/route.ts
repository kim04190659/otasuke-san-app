import { NextRequest, NextResponse } from 'next/server';
import { searchFlightInfo } from '@/lib/claude';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { route, timing, timeOfDay, userLocation, ageGroup } = body;

        // バリデーション
        if (!route || !timing || !timeOfDay) {
            return NextResponse.json(
                { error: '必要な情報が不足しています' },
                { status: 400 }
            );
        }

        // Claude APIで検索
        const result = await searchFlightInfo({
            route,
            timing,
            timeOfDay,
            userLocation: userLocation || '不明',
            ageGroup: ageGroup || '80代',
        });

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Flight search error:', error);
        return NextResponse.json(
            {
                success: false,
                error: '航空券情報の取得に失敗しました。もう一度お試しください。',
            },
            { status: 500 }
        );
    }
}
