import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

interface FlightSearchRequest {
    route: string;
    timing: string;
    timeOfDay: string;
    userLocation: string;
    ageGroup: string;
}

interface FlightSearchResponse {
    summary: {
        lowestPrice: string;
        recommendedAirline: string;
        bestTiming: string;
    };
    advice: {
        mainAdvice: string;
        tips: string[];
        warnings: string[];
        localInfo: string;
    };
    generatedAt: string;
}

export async function searchFlightInfo(
    request: FlightSearchRequest
): Promise<FlightSearchResponse> {
    const systemPrompt = `あなたは高齢者向けの親切な旅行アドバイザーです。
以下のルールを守って回答してください：

1. 優しく、分かりやすい言葉で説明する
2. 難しい専門用語は使わない
3. 具体的な数字（料金・時間）を含める
4. 安全性と便利さを重視する
5. ${request.userLocation}から空港へのアクセス情報を含める
6. ${request.ageGroup}の方に配慮した情報を提供する

必ず以下の項目を含めて回答してください：
- 一番安い航空会社と料金の目安
- おすすめの予約方法
- 安く買うコツ
- 地域情報（空港へのアクセス）
- 注意点`;

    const userPrompt = `${request.route}の航空券について、${request.timing}、${request.timeOfDay}に出発する場合の情報を教えてください。

web_search機能を使って、最新の価格情報を検索してください。

以下のJSON形式で回答してください：
{
  "summary": {
    "lowestPrice": "8,850円くらい",
    "recommendedAirline": "スカイマーク",
    "bestTiming": "2週間前までに予約"
  },
  "advice": {
    "mainAdvice": "指宿から横浜への航空券についてお調べしました...",
    "tips": ["早めに予約するほど安い", "朝7-8時の便が安い"],
    "warnings": ["繁忙期（GW・夏休み・年末年始）は高い"],
    "localInfo": "指宿から鹿児島空港まで：バス約80分（1,500円）"
  }
}`;

    try {
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
            tools: [
                {
                    type: 'web_search_20250305',
                    name: 'web_search',
                },
            ] as any,
        } as any);

        // レスポンスからテキストを抽出
        const textContent = response.content
            .filter((block: any) => block.type === 'text')
            .map((block: any) => ('text' in block ? block.text : ''))
            .join('\n');

        // JSONを抽出してパース
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                ...parsed,
                generatedAt: new Date().toISOString(),
            };
        }

        throw new Error('JSONレスポンスの解析に失敗しました');
    } catch (error) {
        console.error('Claude API Error:', error);
        throw error;
    }
}
