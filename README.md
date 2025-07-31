# OpenREC Line Notifier

特定のOpenRECチャンネルの配信開始を検知し、LINE Botを通じてプッシュ通知を送信するNode.js/Expressアプリケーションです。

## 🏗️ アーキテクチャ

このプロジェクトは**クリーンアーキテクチャ**の原則に従って設計されています：

```
src/
├── entities/           # ビジネスエンティティ
│   ├── LiveStream.js
│   └── NotificationMessage.js
├── usecases/          # ビジネスユースケース
│   └── CheckLiveStreamUseCase.js
├── interfaces/         # インターフェース
│   ├── ILiveStreamRepository.js
│   └── INotificationService.js
├── infrastructure/     # 外部システムとの接続
│   ├── OpenRecApiRepository.js
│   └── LineNotificationService.js
├── application/        # アプリケーション層
│   ├── Configuration.js
│   └── LiveStreamMonitor.js
└── index.js           # エントリーポイント
```

### レイヤー構成

1. **Entities（エンティティ）**: ビジネスロジックの中心
   - `LiveStream`: 配信情報を表すエンティティ
   - `NotificationMessage`: 通知メッセージを表すエンティティ

2. **Use Cases（ユースケース）**: アプリケーションのビジネスルール
   - `CheckLiveStreamUseCase`: 配信状況をチェックするユースケース

3. **Interfaces（インターフェース）**: 外部システムとの抽象化
   - `ILiveStreamRepository`: 配信情報取得のインターフェース
   - `INotificationService`: 通知サービスのインターフェース

4. **Infrastructure（インフラストラクチャ）**: 外部システムとの実装
   - `OpenRecApiRepository`: OpenREC APIとの接続
   - `LineNotificationService`: LINE通知サービスの実装

5. **Application（アプリケーション）**: アプリケーション層
   - `Configuration`: 設定管理
   - `LiveStreamMonitor`: 配信監視アプリケーション

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを作成し、以下の環境変数を設定してください：

```env
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
LINE_USER_ID=your_line_user_id
OPENREC_CHANNEL_ID=your_openrec_channel_id
OPENREC_API_URL=https://public.openrec.tv/external/api/v5/movie/search
PORT=3000
```

### 3. アプリケーションの起動

```bash
# 本番環境
npm start

# 開発環境（nodemon使用）
npm run dev
```

## 📋 機能

- **自動配信監視**: 1分ごとにOpenRECの配信状況をチェック
- **LINE通知**: 配信開始/終了時にLINE Botでプッシュ通知
- **タイトル変更検知**: 配信タイトルが変更された場合も通知
- **REST API**: 配信状況確認用のエンドポイント

## 🔧 API エンドポイント

- `GET /`: ヘルスチェック
- `GET /status`: 現在の配信状況を取得
- `POST /webhook`: LINE Webhook（デバッグ用）

## 🧪 テスト

```bash
npm test
```

## 📝 ライセンス

ISC

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します。
