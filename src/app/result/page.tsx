'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FlightResult {
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
}

function ResultPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [result, setResult] = useState<FlightResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const route = searchParams.get('route');
                const timing = searchParams.get('timing');
                const timeOfDay = searchParams.get('timeOfDay');

                if (!route || !timing || !timeOfDay) {
                    setError('検索条件が不足しています');
                    setLoading(false);
                    return;
                }

                // ユーザー設定を取得
                const settings = localStorage.getItem('otasuke_user_settings');
                let userLocation = '不明';
                let ageGroup = '80代';

                if (settings) {
                    const parsed = JSON.parse(settings);
                    userLocation = `${parsed.location.prefecture} ${parsed.location.city} ${parsed.location.town || ''}`;
                    ageGroup = parsed.ageGroup;
                }

                // API呼び出し
                const response = await fetch('/api/flight/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        route,
                        timing,
                        timeOfDay,
                        userLocation,
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

    if (loading) {
        return (
            <div className="h-screen flex flex-col bg-gray-50">
                <header className="bg-blue-500 text-white p-6 shadow-lg">
                    <h1 className="text-4xl font-bold text-center">お助けさん</h1>
                </header>
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-500 mx-auto mb-6"></div>
                        <p className="text-3xl text-gray-600 font-semibold">情報を探しています...</p>
                        <p className="text-xl text-gray-500 mt-4">少々お待ちください</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col bg-gray-50">
                <header className="bg-blue-500 text-white p-6 shadow-lg">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/flight')} className="text-3xl">←</button>
                        <h1 className="text-4xl font-bold">エラー</h1>
                    </div>
                </header>
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
                        <div className="text-6xl mb-6">⚠️</div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">申し訳ございません</h2>
                        <p className="text-xl text-gray-600 mb-8">{error}</p>
                        <button
                            onClick={() => router.push('/flight')}
                            className="w-full min-h-[60px] bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-2xl font-bold"
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
            <header className="bg-blue-500 text-white p-6 shadow-lg">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/flight')} className="text-3xl">←</button>
                    <h1 className="text-4xl font-bold">検索結果</h1>
                </div>
            </header>

            <main className="flex-1 p-6 pb-8">
                <div className="max-w-2xl mx-auto space-y-6">

                    {/* サマリー */}
                    <section className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl shadow-xl p-8">
                        <h2 className="text-3xl font-bold mb-6">🎫 一番安い方法</h2>
                        <div className="space-y-4 text-xl">
                            <div className="flex items-baseline gap-3">
                                <span className="font-semibold">航空会社：</span>
                                <span className="text-2xl font-bold">{result.summary.recommendedAirline}</span>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="font-semibold">料金：</span>
                                <span className="text-4xl font-bold">{result.summary.lowestPrice}</span>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="font-semibold">いつ買う：</span>
                                <span className="text-2xl font-bold">{result.summary.bestTiming}</span>
                            </div>
                        </div>
                    </section>

                    {/* メインアドバイス */}
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

                    {/* 地域情報 */}
                    {result.advice.localInfo && (
                        <section className="bg-green-50 rounded-3xl shadow-xl p-8">
                            <h3 className="text-3xl font-bold mb-6 text-gray-800">🚌 空港へのアクセス</h3>
                            <p className="text-2xl text-gray-700 leading-relaxed">{result.advice.localInfo}</p>
                        </section>
                    )}

                    {/* アクションボタン */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button
                            onClick={() => router.push('/flight')}
                            className="min-h-[70px] bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-xl font-bold"
                        >
                            もう一度探す
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="min-h-[70px] bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-xl font-bold"
                        >
                            トップに戻る
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function ResultPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex flex-col bg-gray-50">
                <header className="bg-blue-500 text-white p-6 shadow-lg">
                    <h1 className="text-4xl font-bold text-center">お助けさん</h1>
                </header>
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-500 mx-auto mb-6"></div>
                        <p className="text-3xl text-gray-600 font-semibold">読み込み中...</p>
                    </div>
                </main>
            </div>
        }>
            <ResultPageContent />
        </Suspense>
    );
}
