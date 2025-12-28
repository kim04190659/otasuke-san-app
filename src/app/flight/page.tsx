'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Step = 'route' | 'timing' | 'timeOfDay' | 'confirm';

export default function FlightPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('route');
    const [selectedRoute, setSelectedRoute] = useState('');
    const [selectedTiming, setSelectedTiming] = useState('');
    const [selectedTimeOfDay, setSelectedTimeOfDay] = useState('');

    useEffect(() => {
        // ユーザー設定を確認
        const settings = localStorage.getItem('otasuke_user_settings');
        if (!settings) {
            router.push('/setup');
        }
    }, [router]);

    const handleCardClick = (value: string) => {
        if (step === 'route') {
            setSelectedRoute(value);
            setStep('timing');
        } else if (step === 'timing') {
            setSelectedTiming(value);
            setStep('timeOfDay');
        } else if (step === 'timeOfDay') {
            setSelectedTimeOfDay(value);
            setStep('confirm');
        }
    };

    const handleSearch = () => {
        alert('検索機能は次のステップで実装します');
    };

    const handleBack = () => {
        if (step === 'timing') {
            setStep('route');
        } else if (step === 'timeOfDay') {
            setStep('timing');
        } else if (step === 'confirm') {
            setStep('timeOfDay');
        } else {
            router.push('/');
        }
    };

    // ステップごとの質問とカード
    const getStepContent = () => {
        switch (step) {
            case 'route':
                return {
                    question: 'どちらに行きますか？',
                    icon: '✈️',
                    cards: [
                        { label: '鹿児島 → 東京', value: '鹿児島→東京', icon: '🌸' },
                        { label: '東京 → 鹿児島', value: '東京→鹿児島', icon: '🌋' },
                        { label: '鹿児島 → 大阪', value: '鹿児島→大阪', icon: '🏯' },
                        { label: 'その他の行き先', value: 'その他', icon: '🗺️' },
                    ],
                };
            case 'timing':
                return {
                    question: 'いつ頃行きますか？',
                    icon: '📅',
                    cards: [
                        { label: '来週', value: '来週', icon: '🚀' },
                        { label: '来月', value: '来月', icon: '📆' },
                        { label: '3ヶ月後', value: '3ヶ月後', icon: '🗓️' },
                        { label: 'まだ決まっていない', value: 'まだ決まっていない', icon: '🤔' },
                    ],
                };
            case 'timeOfDay':
                return {
                    question: '何時頃がいいですか？',
                    icon: '🕐',
                    cards: [
                        { label: '朝（6-9時）', value: '朝', icon: '🌅' },
                        { label: '昼（9-15時）', value: '昼', icon: '☀️' },
                        { label: '夕方（15-18時）', value: '夕方', icon: '🌆' },
                        { label: 'いつでもいい', value: 'いつでもいい', icon: '⏰' },
                    ],
                };
            default:
                return null;
        }
    };

    const content = getStepContent();

    if (step === 'confirm') {
        return (
            <div className="h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
                <header className="bg-blue-500 text-white p-6 shadow-lg">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBack} className="text-3xl">←</button>
                        <h1 className="text-4xl font-bold">確認</h1>
                    </div>
                </header>

                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-md space-y-6">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                                この内容でよろしいですか？
                            </h2>

                            <div className="space-y-4 text-xl">
                                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                                    <span className="text-3xl">✈️</span>
                                    <span className="font-semibold">{selectedRoute}</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                                    <span className="text-3xl">📅</span>
                                    <span className="font-semibold">{selectedTiming}</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                                    <span className="text-3xl">🕐</span>
                                    <span className="font-semibold">{selectedTimeOfDay}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSearch}
                                className="w-full min-h-[80px] bg-green-500 hover:bg-green-600 text-white rounded-2xl text-2xl font-bold shadow-lg transition-all"
                            >
                                この条件で探す
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
            {/* ヘッダー */}
            <header className="bg-blue-500 text-white p-6 shadow-lg">
                <div className="flex items-center gap-4">
                    <button onClick={handleBack} className="text-3xl">←</button>
                    <h1 className="text-4xl font-bold">航空券を探す</h1>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-2xl">
                    {/* 質問 */}
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">{content?.icon}</div>
                        <h2 className="text-4xl font-bold text-gray-800">
                            {content?.question}
                        </h2>
                    </div>

                    {/* カード（2x2グリッド） */}
                    <div className="grid grid-cols-2 gap-6">
                        {content?.cards.map((card) => (
                            <button
                                key={card.value}
                                onClick={() => handleCardClick(card.value)}
                                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 p-8 min-h-[200px] flex flex-col items-center justify-center gap-4"
                            >
                                <div className="text-6xl">{card.icon}</div>
                                <div className="text-2xl font-bold text-gray-800 text-center">
                                    {card.label}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* プログレスインジケーター */}
                    <div className="flex justify-center gap-2 mt-8">
                        <div className={`h-3 w-12 rounded-full ${step === 'route' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                        <div className={`h-3 w-12 rounded-full ${step === 'timing' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                        <div className={`h-3 w-12 rounded-full ${step === 'timeOfDay' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    </div>
                </div>
            </main>
        </div>
    );
}
