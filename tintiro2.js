const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const path = require('path');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // チンチロ対戦ページ
  if (pathname === '/tintiro') {
    const query = parsedUrl.query;
    let win = Number(query.win) || 0;
    let total = Number(query.total) || 0;

    const [num, num1, num2] = [rand(), rand(), rand()]; // サイコロの目を3つ振る
    const [num3, num4, num5] = [rand(), rand(), rand()];

    const your = judge(num, num1, num2); // プレイヤーの手
    const cpu = judge(num3, num4, num5); // CPUの手

    // 勝敗判定
    let judgement = '引き分け';
    if (compareRank(your) > compareRank(cpu)) {
      judgement = '勝ち';
      win++;
    } else if (compareRank(your) < compareRank(cpu)) {
      judgement = '負け';
    }

    total++;// 勝った回数

    // ejsに渡すデータ
    const data = {
      your: num,
      your1: num1,
      your2: num2,
      cpu: num3,
      cpu1: num4,
      cpu2: num5,
      judgement,
      win,
      total
    };

    // EJSにデータを渡す
    ejs.renderFile('tintiro.ejs', data, (err, str) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error rendering EJS');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(str);
    });

  } else if (req.url.endsWith('.png') || req.url.endsWith('.jpg') || req.url.endsWith('.jpeg') || req.url.endsWith('.gif')) {
    serveStatic(req, res);

  } else {
    // 初期HTMLページ
    fs.readFile('tintiro.html', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }
});

// サーバー起動
server.listen(3000, () => {
  console.log('Server running at http://13.78.91.83:3000/');
});

// 1から6でランダムな数字を出す
function rand() {
  return Math.floor(Math.random() * 6) + 1;
}

// 役を判定する
function judge(a, b, c) {
  const arr = [a, b, c].sort();
  const [x, y, z] = arr;

  if (x === y && y === z) {
    if (x === 1) return 'ピンゾロ';
    return `${x}の嵐`;
  }
  if (x === 1 && y === 2 && z === 3) return 'ヒフミ';
  if (x === 4 && y === 5 && z === 6) return 'シゴロ';
  if (x === y) return `${z}`;
  if (y === z) return `${x}`;
  if (x === z) return `${y}`;
  return '目なし';
}

// 役の強さを比較
function compareRank(hand) {
  const ranks = {
    'ピンゾロ': 100,
    '6の嵐': 99,
    '5の嵐': 98,
    '4の嵐': 97,
    '3の嵐': 96,
    '2の嵐': 95,
    'シゴロ': 50,
    '6': 46, '5': 45, '4': 44, '3': 43, '2': 42, '1': 41,
    '目なし': 10,
    'ヒフミ': 5
  };
  return ranks[hand] || 0;
}

//画像
function serveStatic(req, res) {
  const filePath = '.' + req.url;
  const extname = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.css': 'text/css'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}