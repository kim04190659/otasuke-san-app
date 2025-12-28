'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleFlightSearch = () => {
    // ユーザー設定をチェック
    const userSettings = localStorage.getItem('otasuke_user_settings');

    if (userSettings) {
      // 設定済み → 航空券検索へ
      router.push('/flight');
    } else {
      // 未設定 → 設定画面へ
      router.push('/setup');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="bg-blue-500 text-white p-6 shadow-lg">
        <h1 className="text-4xl font-bold text-center">お助けさん</h1>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md space-y-6">
          {/* ウェルカムメッセージ */}
          <div className="text-center mb-8">
            <p className="text-2xl text-gray-700 mb-2">
              こんにちは！
            </p>
            <p className="text-xl text-gray-600">
              何をお探しですか？
            </p>
          </div>

          {/* 航空券ボタン */}
          <button
            onClick={handleFlightSearch}
            className="w-full min-h-[100px] bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg text-2xl font-bold transition-all active:scale-95"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">✈️</span>
              <span>航空券を探す</span>
            </div>
          </button>

          {/* 今後追加予定のボタン（グレーアウト） */}
          <button
            disabled
            className="w-full min-h-[100px] bg-gray-300 text-gray-500 rounded-2xl shadow text-2xl font-bold cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">🏠</span>
              <span>家電を買う（準備中）</span>
            </div>
          </button>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 p-4 text-center">
        <p className="text-gray-500">お助けさん v1.0</p>
      </footer>
    </div>
  );
}
