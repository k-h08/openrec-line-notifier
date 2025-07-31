const express = require('express');
const LiveStreamMonitor = require('./application/LiveStreamMonitor');
const Configuration = require('./application/Configuration');

/**
 * アプリケーションのメインエントリーポイント
 */
class Application {
  constructor() {
    this.config = new Configuration();
    this.app = express();
    this.liveStreamMonitor = new LiveStreamMonitor();
    this.setupExpress();
  }

  /**
   * Expressアプリケーションの設定
   */
  setupExpress() {
    this.app.use(express.json());

    // ヘルスチェックエンドポイント
    this.app.get('/', (req, res) => {
      res.send('OpenREC Line Notifier is running!');
    });

    // LINE Webhookエンドポイント（デバッグ用）
    this.app.post('/webhook', (req, res) => {
      console.log(`[${this.getCurrentFormattedDate()}] 📩 LINE Webhook受信:`, req.body);
      res.sendStatus(200);
    });

    // 配信状況確認エンドポイント
    this.app.get('/status', (req, res) => {
      const lastStream = this.liveStreamMonitor.checkLiveStreamUseCase.getLastLiveStream();
      res.json({
        isMonitoring: true,
        lastStream: lastStream ? {
          id: lastStream.id,
          title: lastStream.title,
          isLive: lastStream.isStreaming()
        } : null,
        timestamp: this.getCurrentFormattedDate()
      });
    });
  }

  /**
   * アプリケーションを開始
   */
  start() {
    const serverConfig = this.config.getServerConfig();
    
    this.app.listen(serverConfig.port, () => {
      console.log(`[${this.getCurrentFormattedDate()}] 🚀 サーバーがポート ${serverConfig.port} で起動しました`);
    });

    // 配信監視を開始
    this.liveStreamMonitor.startMonitoring();
  }

  /**
   * 現在の日時をフォーマットして返す
   */
  getCurrentFormattedDate() {
    return new Date().toISOString();
  }
}

// アプリケーションを開始
const app = new Application();
app.start(); 