'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Route = {
    from: string;
    to: string;
};

export default function FlightPage() {
    const router = useRouter();
    const [route, setRoute] = useState<Route>({ from: '鹿児島', to: '東京' });
    const [departure, setDeparture] = useState('');
    const [timeOfDay, setTimeOfDay] = useState('');
    const [userLocation, setUserLocation] = useState('');

    useEffect(() => {
        // ユーザー設定を読み込み
        const settings = localStorage.getItem('otasuke_user_settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            setUserLocation(`${parsed.location.prefecture} ${parsed.location.city}`);
        } else {
            // 設定がなければ設定画面へ
            router.push('/setup');
        }
    }, [router]);

    const handleSearch = () => {
        // 検索実行（次のステップで実装）
        alert('検索機能は次のステップで実装します');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-blue-500 text-white p-6 shadow-lg">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/')}
                        className="text-3xl hover:bg-blue-600 rounded-lg px-2 transition-colors"
                    >
                        ←
                    </button>
                    <h1 className="text-4xl font-bold">航空券を探す</h1>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="flex-1 p-6">
                <div className="max-w-md mx-auto space-y-6">

                    {/* よく使う路線 */}
                    <section className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">✈️ よく使う路線</h2>

                        <button
                            onClick={() => setRoute({ from: '鹿児島', to: '東京' })}
                            className={`w-full p-5 text-xl font-semibold rounded-xl transition-all ${route.from === '鹿児島' && route.to === '東京'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            鹿児島 → 東京・横浜
                        </button>

                        <button
                            onClick={() => setRoute({ from: '東京', to: '鹿児島' })}
                            className={`w-full p-5 text-xl font-semibold rounded-xl transition-all ${route.from === '東京' && route.to === '鹿児島'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            東京・横浜 → 鹿児島
                        </button>
                    </section>

                    {/* 出発時期 */}
                    <section className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">📅 いつ行きますか？</h2>

                        <div className="grid grid-cols-2 gap-3">
                            {['来週', '2週間後', '来月', '3ヶ月後'].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setDeparture(option)}
                                    className={`p-5 text-xl font-semibold rounded-xl transition-all ${departure === option
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                            <button
                                onClick={() => setDeparture('まだ決まっていない')}
                                className={`col-span-2 p-5 text-xl font-semibold rounded-xl transition-all ${departure === 'まだ決まっていない'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                            >
                                まだ決まっていない
                            </button>
                        </div>
                    </section>

                    {/* 時間帯 */}
                    <section className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">🕐 時間帯の希望</h2>

                        <div className="space-y-3">
                            {[
                                { value: '朝早く', label: '朝早く（6-9時）' },
                                { value: '午前中', label: '午前中（9-12時）' },
                                { value: '昼過ぎ', label: '昼過ぎ（12-15時）' },
                                { value: '夕方', label: '夕方（15-18時）' },
                                { value: 'いつでもいい', label: 'いつでもいい' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setTimeOfDay(option.value)}
                                    className={`w-full p-5 text-xl font-semibold rounded-xl transition-all ${timeOfDay === option.value
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 検索ボタン */}
                    <button
                        onClick={handleSearch}
                        disabled={!departure || !timeOfDay}
                        className="w-full min-h-[80px] bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl shadow-lg text-2xl font-bold transition-all"
                    >
                        この条件で探す
                    </button>
                </div>
            </main>
        </div>
    );
}
