// tencentQQ.js
const axios = require('axios');
const { QQ_OPEN_BASE, QQ_COOKIE } = require('./config');

// 按 albumMid 查专辑详情（腾讯侧校验）
async function getAlbumDetail(albumMid) {
  const url = `${QQ_OPEN_BASE}/fcg_v8_album_info_cp.fcg`;
  const { data } = await axios.get(url, {
    params: {
      albummid: albumMid,
      platform: 'js',
      format: 'json',
    },
    headers: QQ_COOKIE ? { Cookie: QQ_COOKIE } : {},
  });
  return data;
}

// 搜专辑（发行前查重）
async function searchAlbum(keyword) {
  const url = `${QQ_OPEN_BASE}/fcg_search_for_qq_cp.fcg`;
  const { data } = await axios.get(url, {
    params: {
      w: keyword,
      t: 8,            // 8=专辑
      format: 'json',
      platform: 'js',
    },
  });
  return data;
}

module.exports = { getAlbumDetail, searchAlbum };
