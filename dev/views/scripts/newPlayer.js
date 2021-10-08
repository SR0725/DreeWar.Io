
function newPlayerTip() {
  TipBG();
  switch (newPlayerTipAnimation) {
    case 0:
      TipText('安安!歡迎來到DreeWar.IO\n輸入WSAD能進行前後左右移動!\n點擊右下next進入下一個新手教學');
      break;
    case 1:
      TipText('非常好!請注意!!\n你無法直接穿透防禦型建築與山壁!');
      break;
    case 2:
      TipText('滑鼠左鍵使用技能(注意左下角)');
      break;
    case 3:
      TipText('技能會向你鼠標方向移動');
      break;
    case 4:
      TipText('滾輪更改施放技能(注意左下角)');
      break;
    case 5:
      TipText('你共會有四張卡牌\n使用後會隨機重新獲得一張牌');
      break;
    case 6:
      TipText('目前有三種卡牌');
      break;
    case 7:
      TipText('普通攻擊,技能牌組,建築牌組');
      break;
    case 8:
      TipText('巧妙使用技能能使戰鬥中更具備優勢');
      break;
    case 9:
      TipText('不過技能使用會消耗MP數值');
      break;
    case 10:
      TipText('查看右下角你會看到你的[MP]\n那代表魔力剩餘\n每5秒才會回復一點請警慎使用');
      break;
    case 11:
      TipText('建築牌組能強化我方增益\n加速MP與BP獲取');
      break;
    case 12:
      TipText('不過建築使用會消耗BP數值');
      break;
    case 13:
      TipText('查看右下角你會看到你的[BP]\n那代表魔力剩餘\n每15秒才會回復一點\n請警慎使用');
      break;
    case 14:
      TipText('滑鼠右鍵能發布表情');
      break;
    case 15:
      TipText('遊戲目標\n佔領位於地圖中央被河環繞的世界樹');
      break;
    case 16:
      TipText('遊戲的目標是佔領世界樹\n佔領的一方能獲得每秒一分地加成\n先得到300分玩家得勝');
      break;
    case 17:
      TipText('如果世界樹被敵方佔領\n你可以佔領世界樹旁的青蛙\n他能很快的攻擊佔領樹的敵方');
      break;
    case 18:
      TipText('遊戲教學結束');
      break;
    default:
  }
}

function TipBG(){
  var temp_x = 10;
  var temp_y = 80;
  var img = document.getElementById('UIpanel');
  ctx.drawImage(img,temp_x,temp_y,300,100);
  var img = document.getElementById('wood_T');
  ctx.drawImage(img,temp_x-4,temp_y-6,32,32);
  var img = document.getElementById('wood_I');
  ctx.drawImage(img,temp_x+28,temp_y-6,32,32);
  var img = document.getElementById('wood_P');
  ctx.drawImage(img,temp_x+60,temp_y-6,32,32);
  var img = document.getElementById('UInext');
  ctx.drawImage(img,temp_x+275,temp_y+86,51,28);
  var img = document.getElementById('UIcross');
  ctx.drawImage(img,temp_x+275,temp_y+6,18,18);
}

function TipText(msg) {
    let tipmsg = msg.split("\n");
    var temp_x = 22;
    var temp_y = 122;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = "18px Verdana";
    ctx.fillStyle = "rgba(30,30,30,1)";
    for (var i = 0; i < tipmsg.length; i++) {
      ctx.fillText(tipmsg[i],temp_x,temp_y+18*i);
    }
}
