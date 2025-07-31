/**
 * 配信情報を表すエンティティ
 */
class LiveStream {
  constructor(id, title, channelId, isLive = false) {
    this.id = id;
    this.title = title;
    this.channelId = channelId;
    this.isLive = isLive;
    this.createdAt = new Date();
  }

  /**
   * 配信が開始されているかどうかを判定
   */
  isStreaming() {
    return this.isLive;
  }

  /**
   * 配信タイトルが変更されたかどうかを判定
   */
  hasTitleChanged(otherStream) {
    return otherStream && this.title !== otherStream.title;
  }

  /**
   * 配信URLを取得
   */
  getStreamUrl() {
    return `https://www.openrec.tv/live/${this.id}`;
  }
}

module.exports = LiveStream; 