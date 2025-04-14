require('dotenv').config();

// 環境変数の取得とバリデーション
const requiredEnvVars = ['LINE_CHANNEL_ACCESS_TOKEN', 'LINE_USER_ID', 'OPENREC_CHANNEL_ID', 'OPENREC_API_URL'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`❌ 環境変数 ${varName} が設定されていません`);
    process.exit(1);
  }
});

module.exports = {
  LINE_CHANNEL_ACCESS_TOKEN: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  LINE_USER_ID: process.env.LINE_USER_ID,
  OPENREC_CHANNEL_ID: process.env.OPENREC_CHANNEL_ID,
  OPENREC_API_URL: process.env.OPENREC_API_URL,
};
