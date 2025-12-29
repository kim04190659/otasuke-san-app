'use client';

import { useState, useEffect } from 'react';
import { DailyDeal, CreateDailyDeal } from '@/types/dailyDeals';

export default function AdminDailyDealsPage() {
    const [deals, setDeals] = useState<DailyDeal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // フォーム用ステート
    const [formData, setFormData] = useState<CreateDailyDeal>({
        user_id: 'mother',
        store_name: '',
        product_name: '',
        regular_price: 0,
        sale_price: 0,
        distance: '',
        sale_start_date: new Date().toISOString().split('T')[0],
        sale_end_date: new Date().toISOString().split('T')[0],
        stock_status: '豊富',
        recommendation_point: '',
        image_url: '',
        is_active: true,
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/daily-deals');
            const data = await res.json();
            if (data.success) {
                setDeals(data.data);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('データの取得に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId
                ? `/api/admin/daily-deals/${editingId}`
                : '/api/admin/daily-deals';

            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                alert(editingId ? '更新しました' : '登録しました');
                setEditingId(null);
                resetForm();
                fetchDeals();
            } else {
                alert('エラー: ' + data.error);
            }
        } catch (err) {
            alert('送信に失敗しました');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('本当に削除しますか？')) return;
        try {
            const res = await fetch(`/api/admin/daily-deals/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                fetchDeals();
            } else {
                alert('エラー: ' + data.error);
            }
        } catch (err) {
            alert('削除に失敗しました');
        }
    };

    const handleEdit = (deal: DailyDeal) => {
        setEditingId(deal.id);
        setFormData({
            user_id: deal.user_id,
            store_name: deal.store_name,
            product_name: deal.product_name,
            regular_price: deal.regular_price,
            sale_price: deal.sale_price,
            distance: deal.distance || '',
            sale_start_date: deal.sale_start_date,
            sale_end_date: deal.sale_end_date,
            stock_status: deal.stock_status,
            recommendation_point: deal.recommendation_point || '',
            image_url: deal.image_url || '',
            is_active: deal.is_active,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({
            user_id: 'mother',
            store_name: '',
            product_name: '',
            regular_price: 0,
            sale_price: 0,
            distance: '',
            sale_start_date: new Date().toISOString().split('T')[0],
            sale_end_date: new Date().toISOString().split('T')[0],
            stock_status: '豊富',
            recommendation_point: '',
            image_url: '',
            is_active: true,
        });
        setEditingId(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">特売情報管理画面</h1>

                {/* 登録・編集フォーム */}
                <section className="bg-white rounded-2xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">
                        {editingId ? '情報を編集' : '新しい特売情報を登録'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">対象ユーザー</label>
                                <select
                                    value={formData.user_id}
                                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value as any })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                >
                                    <option value="mother">お母様（指宿）</option>
                                    <option value="gibo">義母様（旭川）</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">店名</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.store_name}
                                    onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">商品名</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.product_name}
                                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">距離/所要時間</label>
                                <input
                                    type="text"
                                    value={formData.distance}
                                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                                    placeholder="例: 自転車で5分"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">通常価格 (円)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.regular_price}
                                    onChange={(e) => setFormData({ ...formData, regular_price: parseInt(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">特売価格 (円)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.sale_price}
                                    onChange={(e) => setFormData({ ...formData, sale_price: parseInt(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">セール開始日</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.sale_start_date}
                                    onChange={(e) => setFormData({ ...formData, sale_start_date: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">セール終了日</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.sale_end_date}
                                    onChange={(e) => setFormData({ ...formData, sale_end_date: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">おすすめポイント</label>
                            <textarea
                                value={formData.recommendation_point}
                                onChange={(e) => setFormData({ ...formData, recommendation_point: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">有効にする</label>
                            </div>
                            <div className="flex-1"></div>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 shadow-sm"
                            >
                                {editingId ? '更新する' : '登録する'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* 一覧表示 */}
                <section className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">登録済みの特売情報</h2>
                    {loading ? (
                        <p className="text-center py-4">読み込み中...</p>
                    ) : deals.length === 0 ? (
                        <p className="text-center py-4 text-gray-500">データがありません</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">対象</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">店舗・商品</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">価格</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">期間</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {deals.map((deal) => (
                                        <tr key={deal.id} className={deal.is_active ? '' : 'opacity-50'}>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {deal.user_id === 'mother' ? 'お母様' : '義母様'}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-sm font-bold text-gray-900">{deal.store_name}</div>
                                                <div className="text-sm text-gray-500">{deal.product_name}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-red-600">{deal.sale_price}円</div>
                                                <div className="text-xs text-gray-400 line-through">{deal.regular_price}円</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                                                {deal.sale_start_date} ～<br />{deal.sale_end_date}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            const res = await fetch('/api/admin/generate-script', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ deal }),
                                                            });
                                                            const data = await res.json();
                                                            if (data.success) {
                                                                alert('【生成されたスクリプト】\n\n' + data.data);
                                                            } else {
                                                                alert('エラー: ' + data.error);
                                                            }
                                                        } catch (err) {
                                                            alert('生成に失敗しました');
                                                        }
                                                    }}
                                                    className="text-green-600 hover:text-green-900 mr-4"
                                                >
                                                    台本作成
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(deal)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    編集
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(deal.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    削除
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
