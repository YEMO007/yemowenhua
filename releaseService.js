// releaseService.js
const crypto = require('crypto');
const { LABEL_NAME } = require('./config');

// 伪数据库，生产换 MySQL/PG
const releases = [];

/**
 * 发行一张专辑给接收人
 * @param {{title:string, albumMid?:string, audioUrl:string, coverUrl:string, receiverEmail:string}} payload
 */
function releaseAlbum(payload) {
  // 硬约束：厂牌必须是夜魔文化
  const label = LABEL_NAME;

  const releaseId = crypto.randomUUID();
  const claimToken = crypto.randomBytes(16).toString('hex');

  const record = {
    releaseId,
    title: payload.title,
    label,                      // ← 夜魔文化 写进每张专辑
    albumMid: payload.albumMid || null,
    audioUrl: payload.audioUrl,
    coverUrl: payload.coverUrl,
    receiver: payload.receiverEmail,
    claimToken,                 // 发给别人的领取凭证
    claimed: false,
    createdAt: new Date().toISOString(),
  };

  releases.push(record);
  return record;
}

function claimAlbum(token) {
  const r = releases.find(x => x.claimToken === token);
  if (!r) throw new Error('无效领取链接');
  r.claimed = true;
  return r;
}

module.exports = { releaseAlbum, claimAlbum, releases };
