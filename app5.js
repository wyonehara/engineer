const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win )||0;
  let total = Number( req.query.total )||0;
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  let judgment = ''
  if (hand === cpu) {
    judgement = '引き分け';
  } else if (
    (hand === 'グー' && cpu === 'チョキ') ||
    (hand === 'チョキ' && cpu === 'パー') ||
    (hand === 'パー' && cpu === 'グー')
  ) {
    judgement = '勝ち';
    win += 1;
  } else {
    judgement = '負け';
  }
  total += 1; 

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

app.get("/tyouhan", (req, res) => {
  let hands = req.query.hands;
  let win = Number( req.query.win )||0;
  let total = Number( req.query.total )||0;
  console.log( {hands, win, total});
  const num = Math.floor( Math.random() * 2) + 1;
  let cpu = '';
  if( num==1 ){
   cpu = '半';
  }else if(num==2){
    cpu = '丁';
  }

  // ここに勝敗の判定を入れる
  let judgement = ''
  if (hands !== '半' && hands !== '丁') {
    judgement = '無効';  // 不正な入力を検出
  } else if (hands === cpu) {
    judgement = '勝ち';
    win += 1;
  } else if (
    (hands === '半' && cpu === '丁') || 
    (hands === '丁' && cpu === '半')
  ) {
    judgement = '負け';
  }
  
  total += 1; 

  const display = {
    your: hands,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'tyouhan', display );
});

app.get("/tintiro", (req, res) => {
  let battle = req.query.battle;
  let win = Number( req.query.win )||0;
  let total = Number( req.query.total )||0;
  const num = Math.floor( Math.random() * 6) + 1;
  const num1 = Math.floor( Math.random() * 6) + 1;
  const num2 = Math.floor( Math.random() * 6) + 1;
  const num3 = Math.floor( Math.random() * 6) + 1;
  const num4 = Math.floor( Math.random() * 6) + 1;
  const num5 = Math.floor( Math.random() * 6) + 1;

  console.log( {num, num1, num2, num3, num4, num5, win, total, battle});

  // ここに勝敗の判定を入れる
  let your = ''
  if (num === 1 && num1 === 1 && num2 === 1){
    your = 'ピンゾロ'
  } else if(num === 2 && num1 === 2 && num2 === 2) {
    your = '2の嵐';
  } else if(num === 3 && num1 === 3 && num2 === 3) {
    your = '3の嵐';
  } else if(num === 4 && num1 === 4 && num2 === 4) {
    your = '4の嵐';
  } else if(num === 5 && num1 === 5 && num2 === 5) {
    your = '5の嵐';
  } else if(num === 6 && num1 === 6 &&num2 === 6) {
    your = '6の嵐';
  } else if (
    (num === 4 && num1 === 5 && num2 === 6)||
    (num === 4 && num1 === 6 && num2 === 5)||
    (num === 5 && num1 === 4 && num2 === 6)||
    (num === 5 && num1 === 6 && num2 === 4)||
    (num === 6 && num1 === 4 && num2 === 5)||
    (num === 6 && num1 === 5 && num2 === 4)
  ) {
    your = 'シゴロ'
  } else if (
    (num === num1 && num2 === 1) || 
    (num1 === num2 && num === 1) ||
    (num2 === num && num1 === 1) 
  ) {
    your = '1';
  } else if (
    (num === num1 && num2 === 2) || 
    (num1 === num2 && num === 2) ||
    (num2 === num && num1 === 2) 
  ) {
    your = '2';
  } else if (
    (num === num1 && num2 === 3) || 
    (num1 === num2 && num === 3) ||
    (num2 === num && num1 === 3) 
  ) {
    your = '3';
  } else if (
    (num === num1 && num2 === 4) || 
    (num1 === num2 && num === 4) ||
    (num2 === num && num1 === 4) 
  ) {
    your = '4';
  } else if (
    (num === num1 && num2 === 5) || 
    (num1 === num2 && num === 5) ||
    (num2 === num && num1 === 5) 
  ) {
    your = '5';
  } else if (
    (num === num1 && num2 === 6) || 
    (num1 === num2 && num === 6) ||
    (num2 === num && num1 === 6) 
  ) {
    your = '6';
  } else if (
    (num === 1 && num1 === 2 && num2 === 3)||
    (num === 1 && num1 === 3 && num2 === 2)||
    (num === 2 && num1 === 1 && num2 === 3)||
    (num === 2 && num1 === 3 && num2 === 1)||
    (num === 3 && num1 === 1 && num2 === 2)||
    (num === 3 && num1 === 2 && num2 === 1)
  ) {
    your = 'ヒフミ'
  } else{
    your = '目なし'
  }
  
  let cpu = ''
  if (num3 === 1 && num4 === 1 && num5 === 1){
    cpu = 'ピンゾロ'
  } else if(num3 === 2 && num4 === 2 && num5 === 2) {
    cpu = '2の嵐';
  } else if(num3 === 3 && num4 === 3 && num5 === 3) {
    cpu = '3の嵐';
  } else if(num3 === 4 && num4 === 4 && num5 === 4) {
    cpu = '4の嵐';
  } else if(num3 === 5 && num4 === 5 && num5 === 5) {
    cpu = '5の嵐';
  } else if(num3 === 6 && num4 === 6 && num5 === 6) {
    cpu = '6の嵐';
  } else if (
    (num3 === 4 && num4 === 5 && num5 === 6)||
    (num3 === 4 && num4 === 6 && num5 === 5)||
    (num3 === 5 && num4 === 4 && num5 === 6)||
    (num3 === 5 && num4 === 6 && num5 === 4)||
    (num3 === 6 && num4 === 4 && num5 === 5)||
    (num3 === 6 && num4 === 5 && num5 === 4)
  ) {
    cpu = 'シゴロ'
  } else if (
    (num3 === num4 && num5 === 1) || 
    (num4 === num5 && num3 === 1) ||
    (num5 === num3 && num4 === 1) 
  ) {
    cpu = '1';
  } else if (
    (num3 === num4 && num5 === 2) || 
    (num4 === num5 && num3 === 2) ||
    (num5 === num3 && num4 === 2) 
  ) {
    cpu = '2';
  } else if (
    (num3 === num4 && num5 === 3) || 
    (num4 === num5 && num3 === 3) ||
    (num5 === num3 && num4 === 3) 
  ) {
    cpu = '3';
  } else if (
    (num3 === num4 && num5 === 4) || 
    (num4 === num5 && num3 === 4) ||
    (num5 === num3 && num4 === 4) 
  ) {
    cpu = '4';
  } else if (
    (num3 === num4 && num5 === 5) || 
    (num4 === num5 && num3 === 5) ||
    (num5 === num3 && num4 === 5) 
  ) {
    cpu = '5';
  } else if (
    (num3 === num4 && num5 === 6) || 
    (num4 === num5 && num3 === 6) ||
    (num5 === num3 && num4 === 6) 
  ) {
    cpu = '6';
  } else if (
    (num3 === 1 && num4 === 2 && num5 === 3)||
    (num3 === 1 && num4 === 3 && num5 === 2)||
    (num3 === 2 && num4 === 1 && num5 === 3)||
    (num3 === 2 && num4 === 3 && num5 === 1)||
    (num3 === 3 && num4 === 1 && num5 === 2)||
    (num3 === 3 && num4 === 2 && num5 === 1)
  ) {
    cpu = 'ヒフミ'
  } else{
    cpu = '目なし'
  }

  let judgement = ''
  if (your === cpu){
    judgement = '引き分け';
  } else if(
    (your === 'ピンゾロ' && cpu !== 'ピンゾロ')||
    (your === '6の嵐' && cpu !== 'ピンゾロ' && cpu !== '6の嵐')||
    (your === '5の嵐' && cpu !== 'ピンゾロ' && cpu !== '6の嵐' && cpu !== '5の嵐')||
    (your === '4の嵐' && cpu !== 'ピンゾロ')||
    (your === '4の嵐' && cpu !== '6の嵐')||
    (your === '4の嵐' && cpu !== '5の嵐')||
    (your === '4の嵐' && cpu !== '4の嵐')||
    (your === '3の嵐' && cpu !== 'ピンゾロ')||
    (your === '3の嵐' && cpu !== '6の嵐')||
    (your === '3の嵐' && cpu !== '5の嵐')||
    (your === '3の嵐' && cpu !== '4の嵐')||
    (your === '3の嵐' && cpu !== '3の嵐')||
    (your === '2の嵐' && cpu !== 'ピンゾロ')||
    (your === '2の嵐' && cpu !== '6の嵐')||
    (your === '2の嵐' && cpu !== '5の嵐')||
    (your === '2の嵐' && cpu !== '4の嵐')||
    (your === '2の嵐' && cpu !== '3の嵐')||
    (your === '2の嵐' && cpu !== '2の嵐')||
    (your === 'シゴロ' && cpu === '1')||
    (your === 'シゴロ' && cpu === '2')||
    (your === 'シゴロ' && cpu === '3')||
    (your === 'シゴロ' && cpu === '4')||
    (your === 'シゴロ' && cpu === '5')||
    (your === 'シゴロ' && cpu === '6')||
    (your === 'シゴロ' && cpu === '目なし')||
    (your === 'シゴロ' && cpu === 'ヒフミ')||
    (your === '6' && cpu === '1')||
    (your === '6' && cpu === '2')||
    (your === '6' && cpu === '3')||
    (your === '6' && cpu === '4')||
    (your === '6' && cpu === '5')||
    (your === '6' && cpu === '目なし')||
    (your === '6' && cpu === 'ヒフミ')||
    (your === '5' && cpu === '1')||
    (your === '5' && cpu === '2')||
    (your === '5' && cpu === '3')||
    (your === '5' && cpu === '4')||
    (your === '5' && cpu === '目なし')||
    (your === '5' && cpu === 'ヒフミ')||
    (your === '4' && cpu === '1')||
    (your === '4' && cpu === '2')||
    (your === '4' && cpu === '3')||
    (your === '4' && cpu === '目なし')||
    (your === '4' && cpu === 'ヒフミ')||
    (your === '3' && cpu === '1')||
    (your === '3' && cpu === '2')||
    (your === '3' && cpu === '目なし')||
    (your === '3' && cpu === 'ヒフミ')||
    (your === '2' && cpu === '1')||
    (your === '2' && cpu === '目なし')||
    (your === '2' && cpu === 'ヒフミ')||
    (your === '1' && cpu === '目なし')||
    (your === '1' && cpu === 'ヒフミ')||
    (your === '目なし' && cpu === 'ヒフミ')
  ) {
    judgement = '勝ち';
    win += 1;
  } else {
    judgement = '負け';
  }
  total += 1; 

  const display = {
    your: num,
    your1: num1,
    your2: num2,
    cpu: num3,
    cpu1: num4,
    cpu2: num5,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'tintiro', display );
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
