'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
    const router = useRouter();
    const [prefecture, setPrefecture] = useState('鹿児島県');
    const [city, setCity] = useState('指宿市');
    const [ageGroup, setAgeGroup] = useState<'60代' | '70代' | '80代' | '90代'>('80代');

    const handleSubmit = () => {
        // ローカルストレージに保存
        const userSettings = {
            location: { prefecture, city },
            ageGroup,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('otasuke_user_settings', JSON.stringify(userSettings));

        // 航空券検索画面へ遷移
        router.push('/flight');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-blue-500 text-white p-6 shadow-lg">
                <h1 className="text-4xl font-bold text-center">お助けさん</h1>
            </header>

            {/* メインコンテンツ */}
            <main className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            初めまして！
                        </h2>
                        <p className="text-xl text-gray-600">
                            あなたのことを教えてください
                        </p>
                    </div>

                    {/* 地域選択 */}
                    <section className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                        <h3 className="text-2xl font-bold text-gray-800">📍 お住まいの地域</h3>

                        <div>
                            <label className="block text-xl text-gray-700 mb-2">都道府県</label>
                            <select
                                value={prefecture}
                                onChange={(e) => setPrefecture(e.target.value)}
                                className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                            >
                                <option value="鹿児島県">鹿児島県</option>
                                <option value="東京都">東京都</option>
                                <option value="神奈川県">神奈川県</option>
                                <option value="大阪府">大阪府</option>
                                <option value="福岡県">福岡県</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xl text-gray-700 mb-2">市区町村</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                placeholder="例：指宿市"
                            />
                        </div>
                    </section>

                    {/* 年齢層選択 */}
                    <section className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                        <h3 className="text-2xl font-bold text-gray-800">👤 年齢層</h3>

                        <div className="grid grid-cols-2 gap-4">
                            {(['60代', '70代', '80代', '90代'] as const).map((age) => (
                                <button
                                    key={age}
                                    onClick={() => setAgeGroup(age)}
                                    className={`p-4 text-xl font-semibold rounded-xl border-2 transition-all ${ageGroup === age
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white text-gray-800 border-gray-300 hover:border-blue-300'
                                        }`}
                                >
                                    {age}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 次へボタン */}
                    <button
                        onClick={handleSubmit}
                        className="w-full min-h-[80px] bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg text-2xl font-bold transition-all active:scale-95"
                    >
                        次へ進む →
                    </button>
                </div>
            </main>
        </div>
    );
}
