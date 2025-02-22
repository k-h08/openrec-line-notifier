# OpenREC LINE Notifier

特定のOpenRECチャンネルの配信開始および終了を検知し、LINE Botを通じてプッシュ通知を送信するNode.js/Expressアプリケーションです。

## 機能概要

- OpenREC APIを定期的にポーリングして、対象チャンネルの配信状況をチェック
- 配信が開始されたタイミングおよび終了したタイミングで、LINE Messaging APIを使って指定ユーザーに通知を送信
- 環境変数により設定を簡単に変更可能

## 動作環境

- Node.js (推奨バージョン 14.x 以上)
- npm

## インストール

1. リポジトリをクローン

   ```bash
   git clone https://github.com/k-h08/openrec-line-notifier.git
   cd openrec-line-notifier
   ```

2. 依存パッケージのインストール

   ```bash
   npm install
   ```

3. `.env` ファイルをプロジェクトルートに作成し、以下の内容を記載

   ```env
   # LINE設定
   LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
   LINE_USER_ID=your_line_user_id

   # OpenREC設定
   OPENREC_CHANNEL_ID=target_user_id
   OPENREC_API_URL=https://public.openrec.tv/external/api/v5/movies
   ```

## 使い方

1. サーバーを起動

   ```bash
   node index.js
   ```

2. サーバー起動後、1分ごとにOpenREC APIをチェックし、指定したチャンネルが配信中になった場合、LINEにプッシュ通知が送信されます。配信が終了した場合も通知が送信されます。

## コード構成

- `index.js`  
  メインのサーバーファイル。Expressサーバーの起動、OpenREC APIのポーリング、LINE通知の送信処理を実装しています。

## カスタマイズ

- **ポーリング間隔の変更:**  
  `node-cron` の設定を変更することでチェック間隔を調整可能です。

- **通知内容の変更:**  
  `sendLinePushMessage` 関数内のメッセージフォーマットを変更することで、通知メッセージをカスタマイズできます。

## デプロイ

HerokuやRender、Vercelなどのクラウドサービスにデプロイして利用できます。公開する場合は、LINE DevelopersコンソールにWebhook URLを登録してください。

このプロジェクトを気に入っていただけたら、スターやフォークも大歓迎です！
