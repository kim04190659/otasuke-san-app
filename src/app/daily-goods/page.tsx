'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, PurchasePriority } from '@/types/dailyGoods';

type Step = 'product' | 'priority' | 'confirm';

export default function DailyGoodsPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('product');
    const [selectedProduct, setSelectedProduct] = useState<Product | ''>('');
    const [selectedPriority, setSelectedPriority] = useState<PurchasePriority | ''>('');

    useEffect(() => {
        const settings = localStorage.getItem('otasuke_user_settings');
        if (!settings) {
            router.push('/setup');
        }
    }, [router]);

    const handleCardClick = (value: string) => {
        if (step === 'product') {
            setSelectedProduct(value as Product);
            setStep('priority');
        } else if (step === 'priority') {
            setSelectedPriority(value as PurchasePriority);
            setStep('confirm');
        }
    };

    const handleSearch = () => {
        const params = new URLSearchParams({
            product: selectedProduct,
            priority: selectedPriority,
        });
        router.push(`/daily-result?${params.toString()}`);
    };

    const handleBack = () => {
        if (step === 'priority') {
            setStep('product');
        } else if (step === 'confirm') {
            setStep('priority');
        } else {
            router.push('/');
        }
    };

    // 全15商品のカード
    const productCards = [
        { label: 'トイレットペーパー', value: 'トイレットペーパー', icon: '🧻' },
        { label: 'ティッシュペーパー', value: 'ティッシュペーパー', icon: '📄' },
        { label: 'キッチンペーパー', value: 'キッチンペーパー', icon: '🧽' },
        { label: '洗濯洗剤', value: '洗濯洗剤', icon: '👕' },
        { label: '食器用洗剤', value: '食器用洗剤', icon: '🍽️' },
        { label: '掃除用洗剤', value: '掃除用洗剤', icon: '🧹' },
        { label: 'スポンジ', value: 'スポンジ', icon: '🧽' },
        { label: 'お米', value: 'お米', icon: '🍚' },
        { label: '水・お茶', value: '水・お茶', icon: '💧' },
        { label: '缶詰', value: '缶詰', icon: '🥫' },
        { label: '調味料', value: '調味料', icon: '🧂' },
        { label: '電池', value: '電池', icon: '🔋' },
        { label: '電球', value: '電球', icon: '💡' },
        { label: 'ゴミ袋', value: 'ゴミ袋', icon: '🗑️' },
        { label: 'ラップ・アルミホイル', value: 'ラップ・アルミホイル', icon: '📦' },
    ];

    // 優先条件のカード
    const priorityCards = [
        { label: '一番安い', value: '一番安い', icon: '💰' },
        { label: 'いつもの店', value: 'いつもの店', icon: '🏪' },
        { label: '近いお店', value: '近いお店', icon: '🚗' },
        { label: '評判が良い', value: '評判が良い', icon: '⭐' },
    ];

    const getStepContent = () => {
        switch (step) {
            case 'product':
                return {
                    question: '何を買いますか？',
                    icon: '🛒',
                    cards: productCards,
                    gridCols: 'grid-cols-3',
                };
            case 'priority':
                return {
                    question: '何を優先しますか？',
                    icon: '🎯',
                    cards: priorityCards,
                    gridCols: 'grid-cols-2',
                };
            default:
                return null;
        }
    };

    const content = getStepContent();

    // 確認画面
    if (step === 'confirm') {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
                <header className="bg-green-500 text-white p-6 shadow-lg">
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
                                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                                    <span className="text-3xl">📦</span>
                                    <span className="font-semibold">{selectedProduct}</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                                    <span className="text-3xl">🎯</span>
                                    <span className="font-semibold">{selectedPriority}</span>
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

    // カード選択画面
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
            <header className="bg-green-500 text-white p-6 shadow-lg">
                <div className="flex items-center gap-4">
                    <button onClick={handleBack} className="text-3xl">←</button>
                    <h1 className="text-4xl font-bold">日用品を買う</h1>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center p-6 overflow-y-auto">
                <div className="w-full max-w-3xl">
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">{content?.icon}</div>
                        <h2 className="text-4xl font-bold text-gray-800">
                            {content?.question}
                        </h2>
                    </div>

                    <div className={`grid ${content?.gridCols} gap-6 pb-8`}>
                        {content?.cards.map((card) => (
                            <button
                                key={card.value}
                                onClick={() => handleCardClick(card.value)}
                                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 p-6 min-h-[160px] flex flex-col items-center justify-center gap-3"
                            >
                                <div className="text-5xl">{card.icon}</div>
                                <div className="text-xl font-bold text-gray-800 text-center">
                                    {card.label}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-center gap-2 mt-4 pb-8">
                        <div className={`h-3 w-12 rounded-full ${step === 'product' ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div className={`h-3 w-12 rounded-full ${step === 'priority' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                </div>
            </main>
        </div>
    );
}
