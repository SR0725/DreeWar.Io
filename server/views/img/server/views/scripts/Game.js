var canvas;
var ctx;
var player;
var offset;
var animationTime = 0;
function gameStart() {
  if(selfPlayer['team'] == 1){
    selfPlayer['x'] = 30;
    selfPlayer['y'] = 760;
  }else{
    selfPlayer['x'] = 3987;
    selfPlayer['y'] = 760;
  }
  document.getElementById("MainSence").innerHTML = '<canvas id="Game_Bg" width="1280" height="720"></canvas>';
  canvas = document.getElementById("Game_Bg");
  ctx = canvas.getContext("2d");
  gamestat = 2;
  gameMouseInput();
  Update();
}

function selfPysicalCal(){
  //wsad移動計算動畫與動量
  if(key_s ==  true && key_w == false){
    if(selfPlayer['motion_y'] <= selfPlayer['speed']){
      selfPlayer['motion_y'] += 0.8;
      selfPlayer['animation'] = 1;
    }
  }else if(key_s == false && key_w == true){
    if((-1*selfPlayer['motion_y']) <= selfPlayer['speed']){
      selfPlayer['motion_y'] -= 0.8;
      selfPlayer['animation'] = 1;
    }
  }
  if(key_d == true && key_a == false){
    if((selfPlayer['motion_x']) <= selfPlayer['speed']){
      selfPlayer['motion_x'] += 0.8;
      selfPlayer['flip'] = false;
      selfPlayer['animation'] = 1;
    }
  }else if(key_d == false && key_a == true){
    if((-1*selfPlayer['motion_x']) <= selfPlayer['speed']){
      selfPlayer['motion_x'] -= 0.8;
      selfPlayer['flip'] = true;
      selfPlayer['animation'] = 1;
    }
  }
  //動畫
  if(key_w == false && key_s == false && key_a == false && key_d == false){
    selfPlayer['animation'] = 0;
  }
  //y軸停止與摩擦計算
  if(key_w == false && key_s == false){

    if(selfPlayer['motion_y'] != 0){//Y向停止
      selfPlayer['motion_y'] -= 0.6*selfPlayer['motion_y'];
      if(Math.abs(selfPlayer['motion_y']) < 0.1){
        selfPlayer['motion_y'] = 0.0;
      }
    }
  }
  //x軸停止與摩擦計算
  if(key_a == false && key_d == false){
    if(selfPlayer['motion_x'] != 0){//X向停止
      selfPlayer['motion_x'] -= 0.6*selfPlayer['motion_x'];
      if(Math.abs(selfPlayer['motion_x']) < 0.1){
        selfPlayer['motion_x'] = 0.0;
      }
    }
  }
  //座標物理計算
  selfPlayer['x'] += selfPlayer['motion_x'];
  selfPlayer['y'] += selfPlayer['motion_y'];
  //邊界設定
  if(selfPlayer['x'] > 4030) selfPlayer['x'] = 4030;
  if(selfPlayer['x'] < 0) selfPlayer['x'] = 0;
  if(selfPlayer['y'] > 1470) selfPlayer['y'] = 1470;
  if(selfPlayer['y'] < 0) selfPlayer['y'] = 0;
}

function Update() {
  //自己位置的物理運算
  selfPysicalCal();
  //獲取個人資料
  for (let player of Object.entries(playerlist)) {
		if(player['1']['id'] == id){
      selfPlayer['health'] = player['1']['health'];
      selfPlayer['team'] = player['1']['team'];
      selfPlayer['mp'] = player['1']['mp'];
      selfPlayer['speed'] = player['1']['speed'];
      break;
		}
  }
  //繪製畫面
  draw();
  animationTime += 1;
  if(animationTime > 300){
    animationTime = 0;
  }
  setTimeout('Update()',20);
  Delaytime += 20;
}

function DelayCount(pos,motion){
  var dpos = pos;
  if(Delaytime > 80){
    dpos += motion*Delaytime*0.05;
  }
  return dpos;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //繪製背景
  var img = document.getElementById("blue_desert");
  ctx.drawImage(img,0,0, 1280, 720);
  //繪製地形
  TerrainDraw();
  //繪製場景
  //繪製人物
  for (let player of Object.entries(playerlist)) {
    if(player['1']['id'] != id){//別人
      if(Math.abs(player['1']['x'] - selfPlayer['x']) < 1200 && Math.abs(player['1']['y'] - selfPlayer['y']) < 600){
        var temp_x = DelayCount(player['1']['x'],player['1']['motion_x']) - selfPlayer['x'] + 640;
        var temp_y = DelayCount(player['1']['y'],player['1']['motion_y']) - selfPlayer['y'] + 320;
        if(player['1']['flip'] == true) ObjectFlipDraw(player[1],temp_x,temp_y);
        else ObjectDraw(player[1],temp_x,temp_y);
      }
    }else{//自己
      var temp_x = 640;
      var temp_y = 320;
      if(selfPlayer['flip'] == true) ObjectFlipDraw(selfPlayer,temp_x,temp_y);
      else ObjectDraw(selfPlayer,temp_x,temp_y);
    }
  }
  //繪製特殊物品
  ////技能
  for (let object of Object.entries(skillObjectlist)) {
    if(Math.abs(object['1']['x'] - selfPlayer['x']) < 1200 && Math.abs(object['1']['y'] - selfPlayer['y']) < 600){
      var temp_x = DelayCount(object['1']['x'],object['1']['motion_x']) - selfPlayer['x'] + 640;
      var temp_y = DelayCount(object['1']['y'],object['1']['motion_y']) - selfPlayer['y'] + 320;
      var img = document.getElementById("fireball");
      ctx.drawImage(img,temp_x-32,temp_y-32, 64, 64);
    }
  }

  //UI介面繪製
  ////血量
  for (let player of Object.entries(playerlist)) {
    if(player['1']['id'] != id){//別人
      if(Math.abs(player['1']['x'] - selfPlayer['x']) < 1200 && Math.abs(player['1']['y'] - selfPlayer['y']) < 600){
        var temp_x = DelayCount(player['1']['x'],player['1']['motion_x']) - selfPlayer['x'] + 640;
        var temp_y = DelayCount(player['1']['y'],player['1']['motion_y']) - selfPlayer['y'] + 320;
        ctx.fillStyle = "rgba(152,217,95,0.8)";
        ctx.fillRect(temp_x-16, temp_y+28, 96.0*(player['1']['health']/100), 8)
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.strokeRect(temp_x-16, temp_y+28, 96, 8);
      }
    }else{//自己
      var temp_x = 640;
      var temp_y = 320;
      ctx.fillStyle = "rgba(152,217,95,0.8)";
      ctx.fillRect(temp_x-16, temp_y+28, 96.0*(player['1']['health']/100), 8)
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.strokeRect(temp_x-16, temp_y+28, 96, 8);
    }
  }

  //上傳資料
  playerDataSend();
}

function ObjectDraw(object,temp_x,temp_y){
  if(object['animation'] == 1){
    if(animationTime%16 < 8){
      var img = document.getElementById("alienBlue_walk1");
      ctx.drawImage(img,temp_x,temp_y, 64, 128);
    }else{
      var img = document.getElementById("alienBlue_walk2");
      ctx.drawImage(img,temp_x,temp_y, 64, 128);
    }
  }else{
    var img = document.getElementById("alienBlue_front");
    ctx.drawImage(img,temp_x,temp_y, 64, 128);
  }
}

function ObjectFlipDraw(object,temp_x,temp_y){
  ctx.translate(1320, 0);
  ctx.scale(-1, 1);
  if(object['animation'] == 1){
    if(animationTime%16 < 8){
      var img = document.getElementById("alienBlue_walk1");
      ctx.drawImage(img,(1248-temp_x),temp_y, 64, 128);
    }else{
      var img = document.getElementById("alienBlue_walk2");
      ctx.drawImage(img,(1248-temp_x),temp_y, 64, 128);
    }
  }else{
    var img = document.getElementById("alienBlue_front");
    ctx.drawImage(img,(1248-temp_x),temp_y, 64, 128);
  }
  ctx.translate(1320, 0);
  ctx.scale(-1, 1);
}

function TerrainDraw(){
  for(py = 0;py < 13;py ++){//7
    for(px = 0;px < 15;px ++){//8
      var midx = parseInt(selfPlayer['x']/130);
      var midy = parseInt(selfPlayer['y']/98);
      if(midx+px-7 >= 0 && midx+px-7 < 32 && midy+py-8 >= 0&& midy+py-8 < 16){
        if(Terrain[midy+py-8][midx+px-7] != 'air'){
          var img = document.getElementById(Terrain[midy+py-8][midx+px-7]);
          if((py+midy)%2 == 0){
            ctx.drawImage(img, 130*(px-7)+640-(selfPlayer['x']%130), 98*(py-8)+360-(selfPlayer['y']%98),130,178);
          }else{
            ctx.drawImage(img, 65 + 130*(px-7)+640-(selfPlayer['x']%130), 98*(py-8)+360-(selfPlayer['y']%98),130,178);
          }
        }
      }
    }
  }
};

function Terrain2Draw(){
  for(py = 0;py < 13;py ++){//7
    for(px = 0;px < 15;px ++){//8
      var midx = parseInt(selfPlayer['x']/130);
      var midy = parseInt(selfPlayer['y']/98);
      if(midx+px-7 >= 0 && midx+px-7 < 32 && midy+py-8 >= 0&& midy+py-8 < 16){
        if(Terrain2[midy+py-8][midx+px-7] != 'air'){
          var img = document.getElementById(Terrain2[midy+py-8][midx+px-7]);
          if((py+midy)%2 == 0){
            ctx.drawImage(img, 130*(px-7)+640-(selfPlayer['x']%130), 98*(py-8)+360-(selfPlayer['y']%98),130,178);
          }else{
            ctx.drawImage(img, 65 + 130*(px-7)+640-(selfPlayer['x']%130), 98*(py-8)+360-(selfPlayer['y']%98),130,178);
          }
        }
      }
    }
  }
};
