const axios = require('axios');
const { OPENREC_API_URL, OPENREC_CHANNEL_ID } = require('./config');

/**
 * OpenREC APIから配信情報を取得する関数
 */
async function fetchOpenrecLiveStatus() {
  const url = `${OPENREC_API_URL}?channel_ids=${OPENREC_CHANNEL_ID}&onair_status=1`;
  console.log('OpenREC API取得中:', url);
  const response = await axios.get(url);
  console.log('✅ OpenREC API取得成功:');
  return response.data[0];
}

module.exports = { fetchOpenrecLiveStatus };
