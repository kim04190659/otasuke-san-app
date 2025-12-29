export async function sendToEchoShow(
    userId: 'mother' | 'gibo',
    title: string,
    message: string
): Promise<{ success: boolean; error?: string }> {
    console.log('='.repeat(60));
    console.log('📱 Echo Show 送信（開発モード）');
    console.log('='.repeat(60));
    console.log('送信先:', userId === 'mother' ? 'お母様（指宿）' : '義母様（旭川）');
    console.log('タイトル:', title);
    console.log('');
    console.log('【メッセージ内容】');
    console.log(message);
    console.log('='.repeat(60));

    // モック実装: 1秒後に成功を返す
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 1000);
    });
}
