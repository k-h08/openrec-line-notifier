const cron = require("node-cron");
const CheckLiveStreamUseCase = require("../usecases/CheckLiveStreamUseCase");
const OpenRecApiRepository = require("../infrastructure/OpenRecApiRepository");
const LineNotificationService = require("../infrastructure/LineNotificationService");
const Configuration = require("./Configuration");

/**
 * 配信監視アプリケーションクラス
 */
class LiveStreamMonitor {
	constructor() {
		this.config = new Configuration();
		this.initializeDependencies();
		this.initializeUseCase();
	}

	/**
	 * 依存関係の初期化
	 */
	initializeDependencies() {
		const openRecConfig = this.config.getOpenRecConfig();
		const lineConfig = this.config.getLineConfig();

		this.liveStreamRepository = new OpenRecApiRepository(openRecConfig.apiUrl);
		this.notificationService = new LineNotificationService(
			lineConfig.channelAccessToken
		);
	}

	/**
	 * ユースケースの初期化
	 */
	initializeUseCase() {
		this.checkLiveStreamUseCase = new CheckLiveStreamUseCase(
			this.liveStreamRepository,
			this.notificationService
		);
	}

	/**
	 * 配信状況をチェック
	 */
	async checkLiveStream() {
		try {
			const openRecConfig = this.config.getOpenRecConfig();
			console.log(
				`[${this.getCurrentFormattedDate()}] 🕒 OpenRECの配信状況をチェック中...`
			);

			await this.checkLiveStreamUseCase.execute(openRecConfig.channelId);

			const lastStream = this.checkLiveStreamUseCase.getLastLiveStream();
			if (lastStream) {
				console.log(
					`[${this.getCurrentFormattedDate()}] 📹 配信中: ${lastStream.title}`
				);
			} else {
				console.log(`[${this.getCurrentFormattedDate()}] 📹 配信なし`);
			}
		} catch (error) {
			console.error(
				`[${this.getCurrentFormattedDate()}] ❌ 配信チェックエラー:`,
				error.message
			);
		}
	}

	/**
	 * 監視を開始
	 */
	startMonitoring() {
		const cronExpression = "*/1 * * * *"; // 1分ごと
		cron.schedule(cronExpression, () => {
			this.checkLiveStream();
		});

		console.log(
			`[${this.getCurrentFormattedDate()}] 🚀 配信監視を開始しました`
		);
	}

	/**
	 * 現在の日時をフォーマットして返す
	 */
	getCurrentFormattedDate() {
		return new Date().toISOString();
	}
}

module.exports = LiveStreamMonitor;
