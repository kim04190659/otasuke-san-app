import Anthropic from '@anthropic-ai/sdk';
import { DailyGoodsSearchRequest, DailyGoodsSearchResponse } from '@/types/dailyGoods';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function searchDailyGoods(
    request: DailyGoodsSearchRequest
): Promise<DailyGoodsSearchResponse> {

    // 移動手段による距離制限の文言を作成
    let distanceLimit = '';
    if (request.transport === '徒歩') {
        distanceLimit = '徒歩で行ける範囲（半径500m以内）';
    } else if (request.transport === '自転車') {
        distanceLimit = '自転車で行ける範囲（半径2-3km以内）';
    } else {
        distanceLimit = '車で行ける範囲（制限なし）';
    }

    const systemPrompt = `あなたは高齢者向けの親切なお買い物アドバイザーです。
以下のルールを守って回答してください：

1. 優しく、分かりやすい言葉で説明する
2. 難しい専門用語は使わない
3. 具体的な商品名・価格・店舗を含める
4. ${request.userLocation}から${distanceLimit}の店舗のみを検索
5. ${request.ageGroup}の方に配慮した情報を提供する
6. 優先条件は「${request.priority}」を最重視
7. 移動手段は「${request.transport}」なので、その範囲内の店舗のみ紹介

必ず以下の項目を含めて回答してください：
- おすすめの具体的な商品（メーカー・商品名・価格・内容量）
- 購入できる店舗（店名・距離・住所・価格・在庫状況）を最大3店舗
  ※必ず${distanceLimit}の店舗のみに絞ること
- お得なコツ
- 注意点`;

    const userPrompt = `${request.product}を買いたいです。
優先条件：${request.priority}
現在地：${request.userLocation}
移動手段：${request.transport}（${distanceLimit}）

web_search機能を使って、${request.userLocation}から${distanceLimit}の店舗の最新の商品情報と店舗情報を検索してください。

重要：必ず${distanceLimit}の店舗のみを紹介してください。遠い店舗は含めないでください。

以下のJSON形式で回答してください：
{
  "recommendation": {
    "productName": "エリエール トイレットペーパー12ロール",
    "brand": "エリエール",
    "price": "498円",
    "quantity": "12ロール（ダブル）"
  },
  "stores": [
    {
      "name": "ドラッグストア マツモトキヨシ 指宿店",
      "distance": "自転車で5分（1.2km）",
      "address": "鹿児島県指宿市○○町1-2-3",
      "price": "498円",
      "availability": "在庫あり"
    }
  ],
  "advice": {
    "mainAdvice": "${request.userLocation}で${request.product}をお探しですね。${request.transport}で行ける範囲で、${request.priority}という条件で、おすすめの商品と購入場所をお調べしました...",
    "tips": ["自転車で行ける範囲なので、重すぎないものがおすすめ", "天気の良い日に買い物すると安全"],
    "warnings": ["雨の日は無理せず、晴れの日に買い物しましょう"]
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

        const textContent = response.content
            .filter((block: any) => block.type === 'text')
            .map((block: any) => ('text' in block ? block.text : ''))
            .join('\n');

        // 引用タグを削除
        const cleanedText = textContent.replace(/<cite[^>]*>|<\/cite>/g, '');

        // JSONを抽出してパース
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
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
