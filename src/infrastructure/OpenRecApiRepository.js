const axios = require('axios');
const LiveStream = require('../entities/LiveStream');
const ILiveStreamRepository = require('../interfaces/ILiveStreamRepository');

/**
 * OpenREC APIを使用した配信情報リポジトリの実装
 */
class OpenRecApiRepository extends ILiveStreamRepository {
  constructor(apiUrl) {
    super();
    this.apiUrl = apiUrl;
  }

  /**
   * 指定されたチャンネルの現在の配信状況を取得
   * @param {string} channelId - チャンネルID
   * @returns {Promise<LiveStream|null>} 配信情報、配信していない場合はnull
   */
  async getCurrentLiveStream(channelId) {
    try {
      const url = `${this.apiUrl}?channel_ids=${channelId}&onair_status=1`;
      console.log('OpenREC API取得中:', url);
      
      const response = await axios.get(url);
      const data = response.data;
      
      if (data && data.length > 0 && data[0]) {
        const streamData = data[0];
        return new LiveStream(
          streamData.id,
          streamData.title,
          channelId,
          true
        );
      }
      
      return null;
    } catch (error) {
      console.error('OpenREC APIエラー:', error.response?.data || error.message);
      throw new Error(`OpenREC API取得失敗: ${error.message}`);
    }
  }
}

module.exports = OpenRecApiRepository; 