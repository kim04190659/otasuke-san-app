import Anthropic from '@anthropic-ai/sdk';
import { DailyDeal } from '@/types/dailyDeals';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generateShoppingScript(deal: DailyDeal): Promise<string> {
    const systemPrompt = `あなたは伝説的な通販プレゼンター（ジャパネットたかた風）です。
高齢者の方（お母様や義母様）に向けて、心躍るようなお得な商品の紹介スクラプトを作成してください。

以下のトーン＆マナーを守ってください：
1. 非常にハイテンションで、かつ親しみやすく。
2. 「エェ〜！」「信じられません！」「今だけ！」などの感嘆詞を効果的に使う。
3. 商品の良さだけでなく、それを使うことで生活がどう良くなるかを強調する。
4. 価格の安さを「驚き」として表現する。
5. 長くなりすぎず、30秒〜1分程度で読める分量にする。

出力は、Echo Showでの読み上げを想定したテキスト形式で返してください。`;

    const userPrompt = `
以下の商品の紹介スクリプトを作成してください：

商品名: ${deal.product_name}
店舗名: ${deal.store_name}
通常価格: ${deal.regular_price}円
特売価格: ${deal.sale_price}円
値引き額: ${deal.regular_price - deal.sale_price}円
おすすめポイント: ${deal.recommendation_point || '特になし'}
距離: ${deal.distance || '近く'}
ユーザー: ${deal.user_id === 'mother' ? 'お母様（指宿）' : '義母様（旭川）'}
`;

    try {
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
        });

        const textContent = response.content
            .filter((block) => block.type === 'text')
            .map((block) => ('text' in block ? block.text : ''))
            .join('\n');

        return textContent;
    } catch (error) {
        console.error('Claude API Error (Script Generation):', error);
        throw error;
    }
}
