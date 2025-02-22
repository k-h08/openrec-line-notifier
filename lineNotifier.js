const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { LINE_CHANNEL_ACCESS_TOKEN, LINE_USER_ID } = require('./config');

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

module.exports = { sendLinePushMessage };
