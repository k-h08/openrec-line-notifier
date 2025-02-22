require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid'); // UUID生成のためのモジュールを追加

const app = express();
app.use(express.json());

// 環境変数の取得
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_USER_ID = process.env.LINE_USER_ID;
const OPENREC_CHANNEL_ID = process.env.OPENREC_CHANNEL_ID;
const OPENREC_API_URL = process.env.OPENREC_API_URL;

let isLiveNotified = false; // 既に通知済みかどうかのフラグ

/**
 * LINEへプッシュメッセージを送信する関数
 */
async function sendLinePushMessage(messages) {
  const payload = {
    to: LINE_USER_ID,
    messages: messages
  };

  try {
    const response = await axios.post(
      'https://api.line.me/v2/bot/message/push',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
          'X-Line-Retry-Key': uuidv4() // UUIDを生成してヘッダーに追加
        }
      }
    );
    console.log('✅ LINEへの通知成功:', response.data);
  } catch (error) {
    console.error('❌ LINE通知失敗:', error.response?.data || error.message);
  }
}

/**
 * OpenREC APIから配信情報を取得する関数
 */
async function fetchOpenrecLiveStatus() {
  const url = `${OPENREC_API_URL}?channel_ids=${OPENREC_CHANNEL_ID}&onair_status=1`;
  console.log('OpenREC API取得中:', url);
  const response = await axios.get(url);
  console.log('✅ OpenREC API取得成功:');
  return response.data[0];
}

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

    if (liveStream && !isLiveNotified) {
      // 配信中でかつ未通知の場合のみLINEへ通知
      const messages = [
        { type: 'text', text: `🎉 配信開始！\n視聴はこちら: https://www.openrec.tv/live/${liveStream.id || ''}` },
      ];
      await sendLinePushMessage(messages);
      isLiveNotified = true;
    } else if (!liveStream && isLiveNotified) {
      // 配信が終了している場合にLINEへ通知
      const messages = [
        { type: 'text', text: '📹 配信が終了しました。' }
      ];
      await sendLinePushMessage(messages);
      isLiveNotified = false;
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
