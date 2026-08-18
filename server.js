// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { releaseAlbum, claimAlbum } = require('./releaseService');
const { getAlbumDetail } = require('./tencentQQ');
const { LABEL_NAME } = require('./config');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// 1) 发行接口：必须带夜魔文化厂牌（后端再锁一次）
app.post('/api/release', async (req, res) => {
  try {
    const body = req.body;
    if (!body.title || !body.audioUrl || !body.receiverEmail) {
      return res.status(400).json({ error: '缺少标题/音频/接收人' });
    }
    // 可选：拿 albumMid 去腾讯查一下
    let qqInfo = null;
    if (body.albumMid) qqInfo = await getAlbumDetail(body.albumMid);

    const rec = releaseAlbum({
      title: body.title,
      albumMid: body.albumMid,
      audioUrl: body.audioUrl,
      coverUrl: body.coverUrl,
      receiverEmail: body.receiverEmail,
    });

    res.json({
      ok: true,
      label: LABEL_NAME,
      claimUrl: `/claim.html?token=${rec.claimToken}`,
      qqVerified: !!qqInfo,
      release: rec,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 2) 别人打开领取页
app.get('/api/claim/:token', (req, res) => {
  try {
    const rec = claimAlbum(req.params.token);
    res.json({ ok: true, label: rec.label, title: rec.title, audioUrl: rec.audioUrl, coverUrl: rec.coverUrl });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

app.listen(3000, () => console.log('夜魔文化发行站: http://localhost:3000'));
