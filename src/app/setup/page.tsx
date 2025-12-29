'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Preset = {
    name: string;
    prefecture: string;
    city: string;
    town: string;
    transport: '徒歩' | '自転車' | '車';
    ageGroup: '60代' | '70代' | '80代' | '90代';
};

const PRESETS: Preset[] = [
    {
        name: 'お母様（指宿）',
        prefecture: '鹿児島県',
        city: '指宿市',
        town: '大牟礼',
        transport: '自転車',
        ageGroup: '80代',
    },
    {
        name: '義母様（旭川）',
        prefecture: '北海道',
        city: '旭川市',
        town: '末広3条',
        transport: '車',
        ageGroup: '80代',
    },
];

export default function SetupPage() {
    const router = useRouter();
    const [prefecture, setPrefecture] = useState('鹿児島県');
    const [city, setCity] = useState('指宿市');
    const [town, setTown] = useState('大牟礼');
    const [transport, setTransport] = useState<'徒歩' | '自転車' | '車'>('自転車');
    const [ageGroup, setAgeGroup] = useState<'60代' | '70代' | '80代' | '90代'>('80代');

    const handlePresetSelect = (preset: Preset) => {
        setPrefecture(preset.prefecture);
        setCity(preset.city);
        setTown(preset.town);
        setTransport(preset.transport);
        setAgeGroup(preset.ageGroup);
    };

    const handleSubmit = () => {
        const settings = {
            location: {
                prefecture,
                city,
                town,
            },
            transport,
            ageGroup,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        localStorage.setItem('otasuke_user_settings', JSON.stringify(settings));
        router.push('/');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-blue-500 text-white p-6 shadow-lg">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/')}
                        className="text-3xl hover:bg-blue-600 rounded-lg px-2 transition-colors"
                    >
                        ←
                    </button>
                    <h1 className="text-4xl font-bold">設定</h1>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                        あなたの情報を教えてください
                    </h2>

                    {/* プリセット選択（新規） */}
                    <div>
                        <label className="block text-xl font-semibold text-gray-700 mb-3">
                            よく使う設定
                        </label>
                        <div className="space-y-3">
                            {PRESETS.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => handlePresetSelect(preset)}
                                    className="w-full p-4 text-left text-xl font-semibold rounded-xl bg-blue-50 hover:bg-blue-100 text-gray-700 border-2 border-blue-200 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{preset.name}</span>
                                        <span className="text-sm text-gray-500">
                                            {preset.city} {preset.town}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="mt-3 text-center text-gray-500">
                            または、以下に直接入力してください
                        </div>
                    </div>

                    {/* 都道府県 */}
                    <div>
                        <label className="block text-xl font-semibold text-gray-700 mb-3">
                            都道府県
                        </label>
                        <select
                            value={prefecture}
                            onChange={(e) => setPrefecture(e.target.value)}
                            className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                        >
                            <option>北海道</option>
                            <option>鹿児島県</option>
                            <option>東京都</option>
                            <option>神奈川県</option>
                            <option>大阪府</option>
                        </select>
                    </div>

                    {/* 市区町村 */}
                    <div>
                        <label className="block text-xl font-semibold text-gray-700 mb-3">
                            市区町村
                        </label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="例：指宿市"
                            className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* 町名 */}
                    <div>
                        <label className="block text-xl font-semibold text-gray-700 mb-3">
                            町名
                        </label>
                        <input
                            type="text"
                            value={town}
                            onChange={(e) => setTown(e.target.value)}
                            placeholder="例：大牟礼"
                            className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* 移動手段 */}
                    <div>
                        <label className="block text-xl font-semibold text-gray-700 mb-3">
                            いつもの移動手段
                        </label>
                        <div className="space-y-3">
                            <button
                                onClick={() => setTransport('徒歩')}
                                className={`w-full p-4 text-xl font-semibold rounded-xl transition-all ${transport === '徒歩'
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'bg-white text-gray-700 border-2 border-gray-200'
                                    }`}
                            >
                                🚶 徒歩（500m以内）
                            </button>
                            <button
                                onClick={() => setTransport('自転車')}
                                className={`w-full p-4 text-xl font-semibold rounded-xl transition-all ${transport === '自転車'
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'bg-white text-gray-700 border-2 border-gray-200'
                                    }`}
                            >
                                🚲 自転車（2-3km以内）
                            </button>
                            <button
                                onClick={() => setTransport('車')}
                                className={`w-full p-4 text-xl font-semibold rounded-xl transition-all ${transport === '車'
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'bg-white text-gray-700 border-2 border-gray-200'
                                    }`}
                            >
                                🚗 車（制限なし）
                            </button>
                        </div>
                    </div>

                    {/* 年齢層 */}
                    <div>
                        <label className="block text-xl font-semibold text-gray-700 mb-3">
                            年齢層
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {(['60代', '70代', '80代', '90代'] as const).map((age) => (
                                <button
                                    key={age}
                                    onClick={() => setAgeGroup(age)}
                                    className={`p-4 text-xl font-semibold rounded-xl transition-all ${ageGroup === age
                                            ? 'bg-blue-500 text-white shadow-md'
                                            : 'bg-white text-gray-700 border-2 border-gray-200'
                                        }`}
                                >
                                    {age}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 保存ボタン */}
                    <button
                        onClick={handleSubmit}
                        className="w-full min-h-[70px] bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-2xl font-bold shadow-lg transition-all"
                    >
                        この内容で保存
                    </button>
                </div>
            </main>
        </div>
    );
}
