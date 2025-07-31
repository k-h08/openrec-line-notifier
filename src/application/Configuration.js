require('dotenv').config();

/**
 * アプリケーション設定クラス
 */
class Configuration {
  constructor() {
    this.validateEnvironmentVariables();
  }

  /**
   * 環境変数のバリデーション
   */
  validateEnvironmentVariables() {
    const requiredEnvVars = [
      'LINE_CHANNEL_ACCESS_TOKEN',
      'LINE_USER_ID',
      'OPENREC_CHANNEL_ID',
      'OPENREC_API_URL'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      const missingVarsList = missingVars.join(', ');
      throw new Error(`❌ 環境変数が設定されていません: ${missingVarsList}`);
    }
  }

  /**
   * LINE設定を取得
   */
  getLineConfig() {
    return {
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
      userId: process.env.LINE_USER_ID
    };
  }

  /**
   * OpenREC設定を取得
   */
  getOpenRecConfig() {
    return {
      channelId: process.env.OPENREC_CHANNEL_ID,
      apiUrl: process.env.OPENREC_API_URL
    };
  }

  /**
   * サーバー設定を取得
   */
  getServerConfig() {
    return {
      port: process.env.PORT || 3000
    };
  }
}

module.exports = Configuration; 