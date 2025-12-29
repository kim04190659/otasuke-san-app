'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DailyGoodsSearchResponse } from '@/types/dailyGoods';
import { sendToEchoShow } from '@/lib/alexa-mock';

function DailyResultPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [result, setResult] = useState<DailyGoodsSearchResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState<'mother' | 'gibo' | null>(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const product = searchParams.get('product');
                const priority = searchParams.get('priority');

                if (!product || !priority) {
                    setError('検索条件が不足しています');
                    setLoading(false);
                    return;
                }

                // ユーザー設定を取得
                const settings = localStorage.getItem('otasuke_user_settings');
                let userLocation = '不明';
                let transport = '自転車';
                let ageGroup = '80代';

                if (settings) {
                    const parsed = JSON.parse(settings);
                    userLocation = `${parsed.location.prefecture} ${parsed.location.city} ${parsed.location.town || ''}`;
                    transport = parsed.transport || '自転車';
                    ageGroup = parsed.ageGroup;
                }

                // API呼び出し
                const response = await fetch('/api/daily-goods/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        product,
                        priority,
                        userLocation,
                        transport,
                        ageGroup,
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    setResult(data.data);
                } else {
                    setError(data.error || '検索に失敗しました');
                }
            } catch (err) {
                console.error('Error:', err);
                setError('予期しないエラーが発生しました');
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [searchParams]);

    const handleSendToEchoShow = async (userId: 'mother' | 'gibo') => {
        if (!result) return;
        setSending(true);
        setSendSuccess(null);

        try {
            // メッセージを整形
            const title = result.recommendation.productName;
            const message = `
${result.recommendation.productName}の情報です。

お店: ${result.stores[0]?.name || '情報なし'}
価格: ${result.stores[0]?.price || '情報なし'}
距離: ${result.stores[0]?.distance || '情報なし'}

お買い物の参考にしてください。
        `.trim();

            await sendToEchoShow(userId, title, message);
            setSendSuccess(userId);
        } catch (error) {
            console.error('送信エラー:', error);
            alert('送信に失敗しました。もう一度お試しください。');
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex flex-col bg-gray-50">
                <header className="bg-green-500 text-white p-6 shadow-lg">
                    <h1 className="text-4xl font-bold text-center">お助けさん</h1>
                </header>
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-green-500 mx-auto mb-6"></div>
                        <p className="text-3xl text-gray-600 font-semibold">商品を探しています...</p>
                        <p className="text-xl text-gray-500 mt-4">少々お待ちください</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col bg-gray-50">
                <header className="bg-green-500 text-white p-6 shadow-lg">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/daily-goods')} className="text-3xl">←</button>
                        <h1 className="text-4xl font-bold">エラー</h1>
                    </div>
                </header>
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
                        <div className="text-6xl mb-6">⚠️</div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">申し訳ございません</h2>
                        <p className="text-xl text-gray-600 mb-8">{error}</p>
                        <button
                            onClick={() => router.push('/daily-goods')}
                            className="w-full min-h-[60px] bg-green-500 hover:bg-green-600 text-white rounded-2xl text-2xl font-bold"
                        >
                            もう一度探す
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    if (!result) return null;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-green-500 text-white p-6 shadow-lg">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/daily-goods')} className="text-3xl">←</button>
                    <h1 className="text-4xl font-bold">検索結果</h1>
                </div>
            </header>

            <main className="flex-1 p-6 pb-8">
                <div className="max-w-2xl mx-auto space-y-6">

                    {/* おすすめ商品 */}
                    <section className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl shadow-xl p-8">
                        <h2 className="text-3xl font-bold mb-6">🛒 おすすめの商品</h2>
                        <div className="space-y-4 text-xl">
                            <div className="flex items-baseline gap-3">
                                <span className="font-semibold">商品名：</span>
                                <span className="text-2xl font-bold">{result.recommendation.productName}</span>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="font-semibold">メーカー：</span>
                                <span className="text-2xl font-bold">{result.recommendation.brand}</span>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="font-semibold">価格：</span>
                                <span className="text-4xl font-bold">{result.recommendation.price}</span>
                            </div>
                        </div>
                    </section>

                    {/* 店舗情報 */}
                    <section className="bg-white rounded-3xl shadow-xl p-8">
                        <h3 className="text-3xl font-bold mb-6 text-gray-800">🏪 買えるお店</h3>
                        <div className="space-y-6">
                            {result.stores.map((store, index) => (
                                <div key={index} className="p-4 border-2 border-gray-100 rounded-2xl space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-2xl font-bold text-blue-600">{store.name}</h4>
                                        <span className="bg-blue-100 text-blue-800 text-lg font-bold px-3 py-1 rounded-full">{store.distance}</span>
                                    </div>
                                    <p className="text-xl text-gray-600">{store.address}</p>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-2xl font-bold text-green-600">{store.price}</span>
                                        <span className={`text-xl font-bold ${store.availability.includes('あり') ? 'text-blue-500' : 'text-red-500'}`}>
                                            {store.availability}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* アドバイス */}
                    <section className="bg-white rounded-3xl shadow-xl p-8">
                        <p className="text-2xl leading-relaxed text-gray-800 whitespace-pre-line">
                            {result.advice.mainAdvice}
                        </p>
                    </section>

                    {/* お得なコツ */}
                    {result.advice.tips.length > 0 && (
                        <section className="bg-white rounded-3xl shadow-xl p-8">
                            <h3 className="text-3xl font-bold mb-6 text-gray-800">💡 お得なコツ</h3>
                            <ul className="space-y-4">
                                {result.advice.tips.map((tip, index) => (
                                    <li key={index} className="flex items-start text-xl">
                                        <span className="text-green-500 mr-3 text-2xl">✓</span>
                                        <span className="text-gray-700">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* 注意点 */}
                    {result.advice.warnings.length > 0 && (
                        <section className="bg-yellow-50 rounded-3xl shadow-xl p-8">
                            <h3 className="text-3xl font-bold mb-6 text-gray-800">⚠️ 注意点</h3>
                            <ul className="space-y-4">
                                {result.advice.warnings.map((warning, index) => (
                                    <li key={index} className="text-xl text-gray-700">
                                        • {warning}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Echo Showに送信 */}
                    <section className="bg-blue-50 rounded-3xl shadow-xl p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                            <span>📱</span> Echo Showに送信
                        </h2>

                        <p className="text-xl text-gray-600 mb-6">
                            検索結果をお母様や義母様のEcho Showに送ってあげましょう
                        </p>

                        <div className="space-y-4">
                            {/* お母様用ボタン */}
                            <button
                                onClick={() => handleSendToEchoShow('mother')}
                                disabled={sending}
                                className="w-full min-h-[80px] bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-2xl text-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                {sending ? (
                                    <span>送信中...</span>
                                ) : sendSuccess === 'mother' ? (
                                    <>
                                        <span>✅</span>
                                        <span>送信完了！</span>
                                    </>
                                ) : (
                                    <>
                                        <span>👵</span>
                                        <span>お母様のEcho Show（指宿）</span>
                                    </>
                                )}
                            </button>

                            {/* 義母様用ボタン */}
                            <button
                                onClick={() => handleSendToEchoShow('gibo')}
                                disabled={sending}
                                className="w-full min-h-[80px] bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-2xl text-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                {sending ? (
                                    <span>送信中...</span>
                                ) : sendSuccess === 'gibo' ? (
                                    <>
                                        <span>✅</span>
                                        <span>送信完了！</span>
                                    </>
                                ) : (
                                    <>
                                        <span>👵</span>
                                        <span>義母様のEcho Show（旭川）</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {sendSuccess && (
                            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-xl text-center text-xl font-bold animate-bounce">
                                ✅ 送信しました！
                            </div>
                        )}
                    </section>

                    {/* アクションボタン */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button
                            onClick={() => router.push('/daily-goods')}
                            className="min-h-[70px] bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-xl font-bold"
                        >
                            もう一度探す
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="min-h-[70px] bg-green-500 hover:bg-green-600 text-white rounded-2xl text-xl font-bold"
                        >
                            トップに戻る
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function DailyResultPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex flex-col bg-gray-50">
                <header className="bg-green-500 text-white p-6 shadow-lg">
                    <h1 className="text-4xl font-bold text-center">お助けさん</h1>
                </header>
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-green-500 mx-auto mb-6"></div>
                        <p className="text-3xl text-gray-600 font-semibold">読み込み中...</p>
                    </div>
                </main>
            </div>
        }>
            <DailyResultPageContent />
        </Suspense>
    );
}
