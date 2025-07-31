const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const INotificationService = require("../interfaces/INotificationService");

/**
 * LINE通知サービスの実装
 */
class LineNotificationService extends INotificationService {
	constructor(channelAccessToken) {
		super();
		this.channelAccessToken = channelAccessToken;
		this.apiUrl = "https://api.line.me/v2/bot/message/broadcast";
	}

	/**
	 * 通知メッセージを送信
	 * @param {Array} messages - 送信するメッセージの配列
	 * @returns {Promise<void>}
	 */
	async sendNotification(messages) {
		try {
			const payload = {
				messages: messages.map((message) => message.toLineMessage()),
			};

			const response = await axios.post(this.apiUrl, payload, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.channelAccessToken}`,
					"X-Line-Retry-Key": uuidv4(),
				},
			});

			console.log("✅ LINEへの通知成功:", response.data);
		} catch (error) {
			console.error("❌ LINE通知失敗:", error.response?.data || error.message);
			throw new Error(`LINE通知失敗: ${error.message}`);
		}
	}
}

module.exports = LineNotificationService;
