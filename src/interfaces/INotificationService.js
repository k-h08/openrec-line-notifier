/**
 * 通知サービスのインターフェース
 */
class INotificationService {
  /**
   * 通知メッセージを送信
   * @param {NotificationMessage[]} messages - 送信するメッセージの配列
   * @returns {Promise<void>}
   */
  async sendNotification(messages) {
    throw new Error('sendNotification method must be implemented');
  }
}

module.exports = INotificationService; 