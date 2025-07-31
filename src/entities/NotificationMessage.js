/**
 * 通知メッセージを表すエンティティ
 */
class NotificationMessage {
	constructor(type, text, metadata = {}) {
		this.type = type;
		this.text = text;
		this.metadata = metadata;
		this.createdAt = new Date();
	}

	/**
	 * LINEメッセージ形式に変換
	 */
	toLineMessage() {
		return {
			type: this.type,
			text: this.text,
			...this.metadata,
		};
	}

	/**
	 * 配信開始通知メッセージを作成
	 */
	static createStreamStartMessage(liveStream) {
		const text = `🎉 配信開始！\n視聴はこちら: ${liveStream.getStreamUrl()}`;
		return new NotificationMessage("text", text);
	}

	/**
	 * 配信終了通知メッセージを作成
	 */
	static createStreamEndMessage() {
		return new NotificationMessage("text", "📹 配信が終了しました。");
	}
}

module.exports = NotificationMessage;
