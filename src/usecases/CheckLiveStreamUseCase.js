const LiveStream = require("../entities/LiveStream");
const NotificationMessage = require("../entities/NotificationMessage");

/**
 * 配信状況をチェックするユースケース
 */
class CheckLiveStreamUseCase {
	constructor(liveStreamRepository, notificationService) {
		this.liveStreamRepository = liveStreamRepository;
		this.notificationService = notificationService;
		this.lastLiveStream = null;
	}

	/**
	 * 配信状況をチェックし、必要に応じて通知を送信
	 * @param {string} channelId - チェックするチャンネルID
	 * @returns {Promise<void>}
	 */
	async execute(channelId) {
		try {
			const currentLiveStream =
				await this.liveStreamRepository.getCurrentLiveStream(channelId);

			if (currentLiveStream && currentLiveStream.isStreaming()) {
				// 配信開始またはタイトル変更の通知
				if (
					!this.lastLiveStream ||
					currentLiveStream.hasTitleChanged(this.lastLiveStream)
				) {
					const message =
						NotificationMessage.createStreamStartMessage(currentLiveStream);
					await this.notificationService.sendNotification([message]);
					this.lastLiveStream = currentLiveStream;
				}
			} else if (this.lastLiveStream) {
				// 配信終了の通知
				const message = NotificationMessage.createStreamEndMessage();
				await this.notificationService.sendNotification([message]);
				this.lastLiveStream = null;
			}
		} catch (error) {
			console.error("配信状況チェックエラー:", error.message);
			throw error;
		}
	}

	/**
	 * 最後に通知した配信情報を取得
	 * @returns {LiveStream|null}
	 */
	getLastLiveStream() {
		return this.lastLiveStream;
	}
}

module.exports = CheckLiveStreamUseCase;
