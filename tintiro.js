const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/tintiro') {
    const query = parsedUrl.query;
    let win = Number(query.win) || 0;
    let total = Number(query.total) || 0;

    // サイコロ
    const [num, num1, num2] = [rand(), rand(), rand()];
    const [num3, num4, num5] = [rand(), rand(), rand()];

    const your = judge(num, num1, num2); // クライアント判定
    const cpu = judge(num3, num4, num5); //CPU判定

    //勝敗
    let judgement = '引き分け';
    if (compareRank(your) > compareRank(cpu)) {
      judgement = '勝ち';
      win++;
    } else if (compareRank(your) < compareRank(cpu)) {
      judgement = '負け';
    }

    total++;

    // EJS
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

    ejs.renderFile('tintiro.ejs', data, (err, str) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error rendering EJS');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(str);
    });

  } else {
    // 初期ページ
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

server.listen(3000, () => {});

// ランダムサイコロ
function rand() {
  return Math.floor(Math.random() * 6) + 1;
}

// 手役判定
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

// 強さを数値化して比較用
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
