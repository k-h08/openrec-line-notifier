/**
 * 配信情報リポジトリのインターフェース
 */
class ILiveStreamRepository {
  /**
   * 指定されたチャンネルの現在の配信状況を取得
   * @param {string} channelId - チャンネルID
   * @returns {Promise<LiveStream|null>} 配信情報、配信していない場合はnull
   */
  async getCurrentLiveStream(channelId) {
    throw new Error('getCurrentLiveStream method must be implemented');
  }
}

module.exports = ILiveStreamRepository; 