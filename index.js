require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const { sendLinePushMessage } = require('./lineNotifier');
const { fetchOpenrecLiveStatus } = require('./openrecApi');

const app = express();
app.use(express.json());

// 環境変数の取得
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_USER_ID = process.env.LINE_USER_ID;
const OPENREC_CHANNEL_ID = process.env.OPENREC_CHANNEL_ID;
const OPENREC_API_URL = process.env.OPENREC_API_URL;

// 環境変数のバリデーション
const requiredEnvVars = ['LINE_CHANNEL_ACCESS_TOKEN', 'LINE_USER_ID', 'OPENREC_CHANNEL_ID', 'OPENREC_API_URL'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`❌ 環境変数 ${varName} が設定されていません`);
    process.exit(1);
  }
});

let isLiveNotified = false; // 既に通知済みかどうかのフラグ
let lastLiveTitle = ''; // 最後に通知した配信タイトル

/**
 * 配信情報をチェックし、必要に応じてLINEへ通知する関数
 */
async function checkOpenrecLiveStatus() {
  try {
    const liveStream = await fetchOpenrecLiveStatus();

    if (liveStream) {
      console.log('📹 配信中:', liveStream.title);
    } else {
      console.log('📹 配信なし');
    }

    if (liveStream && (!isLiveNotified || liveStream.title !== lastLiveTitle)) {
      // 配信中でかつ未通知、またはタイトルが変更された場合のみLINEへ通知
      const messages = [
        { type: 'text', text: `🎉 配信開始！\n視聴はこちら: https://www.openrec.tv/live/${liveStream.id || ''}` },
      ];
      await sendLinePushMessage(messages);
      isLiveNotified = true;
      lastLiveTitle = liveStream.title; // 最後に通知したタイトルを更新
    } else if (!liveStream && isLiveNotified) {
      // 配信が終了している場合にLINEへ通知
      const messages = [
        { type: 'text', text: '📹 配信が終了しました。' }
      ];
      await sendLinePushMessage(messages);
      isLiveNotified = false;
      lastLiveTitle = ''; // 配信終了時にタイトルをリセット
    }
  } catch (error) {
    console.error('❌ OpenREC APIエラー:', error.response?.data || error.message);
  }
}

// 1分ごとに配信状況をチェック
cron.schedule('*/1 * * * *', async () => {
  console.log('🕒 OpenRECの配信状況をチェック中...');
  await checkOpenrecLiveStatus();
});

// 必要に応じてLINE Webhookエンドポイントを用意（今回はデバッグ用）
app.post('/webhook', (req, res) => {
  console.log('📩 LINE Webhook受信:', req.body);
  console.log(JSON.stringify(req.body, null, 2)); // req.body を直接ログに出力
  res.sendStatus(200);
});

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 サーバーがポート ${PORT} で起動しました`);
});
