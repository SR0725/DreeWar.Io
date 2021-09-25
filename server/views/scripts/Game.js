var canvas;
var ctx;
var player;
var offset;
var animationTime = 0;
var animationMainTime = 0;
var hurtAnimationTime = 0;
var phone_joystick = false;

function gameStart() {
  //資料初始化
  for (let player of Object.entries(playerlist)) {
    if(player['1']['id'] == id){
      selfPlayer['health'] = player['1']['health'];
      selfPlayer['team'] = player['1']['team'];
      selfPlayer['mp'] = player['1']['mp'];
      selfPlayer['speed'] = player['1']['speed'];
      break;
    }
  }
  playerlist_Now = playerlist;
  //位置初始化
  if(selfPlayer['team'] == 1){
    selfPlayer['x'] = 30;
    selfPlayer['y'] = 760;
  }else{
    selfPlayer['x'] = 3987;
    selfPlayer['y'] = 760;
  }
  //顯示變更
  document.getElementById("chat_box_collapse").className = "collapse collapse-horizontal";
  document.getElementById('talkroomOpen').style.display='block';
  document.getElementById("MainSence").innerHTML = '<canvas id="Game_Bg" width="'+Window_width+'" height="'+Window_height+'"></canvas>';
  //繪製畫面前置作業
  canvas = document.getElementById("Game_Bg");
  ctx = canvas.getContext("2d");
  //繪製碰撞圖
  obstx.drawImage(obsimg, 0, 0,4230,1650);
  //初始化各功能
  gamestat = 2;
  skillCardInit();
  gameMouseInput();
  Update();
}

function smoothData(classN){
  if(classN == 0){//平滑化玩家資料
    for (let [index,player] of Object.entries(playerlist)) {
      if(player['id'] != id && player['id'] != 'tick'){
        playerlist_Now[index]['motion_x'] = (player['x']-playerlist_Now[index]['x'])/(ping_player/20.0);
        playerlist_Now[index]['motion_y'] = (player['y']-playerlist_Now[index]['y'])/(ping_player/20.0);
        break;
      }
    }
  }else if(classN == 1){//平滑化技能資料
    for (let [index,object] of Object.entries(skillObjectlist)) {
      if(object['id'] != 'tick'){
        skillObjectlist_Now[index]['motion_x'] = (object['x']-skillObjectlist_Now[index]['x'])/(ping_skill/20.0);
        skillObjectlist_Now[index]['motion_y'] = (object['y']-skillObjectlist_Now[index]['y'])/(ping_skill/20.0);
        break;
      }
    }
  }
}

function colliderSenceTest(x,y){
  if(obstx.getImageData(x,y,1,1).data[3] < 200){
    return 0;
  }else if(obstx.getImageData(x,y,1,1).data[0] > 200){
    return 0;
  }else if(obstx.getImageData(x,y,1,1).data[2] > 200){
    return 0.4;
  }else{
    return 1.0;
  }
}//場景互動測試

function selfPysicalCal(){
  //wsad移動計算動畫與動量
  if(key_s ==  true && key_w == false){
    if(selfPlayer['motion_y'] <= selfPlayer['speed']){
      selfPlayer['motion_y'] += 0.8;
      if(selfPlayer['animation'] == 0) selfPlayer['animation'] = 1;
    }
  }else if(key_s == false && key_w == true){
    if((-1*selfPlayer['motion_y']) <= selfPlayer['speed']){
      selfPlayer['motion_y'] -= 0.8;
      if(selfPlayer['animation'] == 0) selfPlayer['animation'] = 1;
    }
  }
  if(key_d == true && key_a == false){
    if((selfPlayer['motion_x']) <= selfPlayer['speed']){
      selfPlayer['motion_x'] += 0.8;
      selfPlayer['flip'] = false;
      if(selfPlayer['animation'] == 0) selfPlayer['animation'] = 1;
    }
  }else if(key_d == false && key_a == true){
    if((-1*selfPlayer['motion_x']) <= selfPlayer['speed']){
      selfPlayer['motion_x'] -= 0.8;
      selfPlayer['flip'] = true;
      if(selfPlayer['animation'] == 0) selfPlayer['animation'] = 1;
    }
  }
  //動畫
  if(key_w == false && key_s == false && key_a == false && key_d == false && selfPlayer['animation'] == 1){
    selfPlayer['animation'] = 0;
  }
  if(selfPlayer['animation'] == 2){
    if(animationMainTime > 6){
      selfPlayer['animation'] = 0;
      animationMainTime = 0;
    }else{
      animationMainTime ++;
    }
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
  //碰撞與物理計算
  selfPlayer['x'] += selfPlayer['motion_x']*colliderSenceTest(selfPlayer['x'] + selfPlayer['motion_x'],selfPlayer['y']);
  selfPlayer['y'] += selfPlayer['motion_y']*colliderSenceTest(selfPlayer['x'],selfPlayer['y'] + selfPlayer['motion_y']);
}

function Update() {
  //資料更新驗證
  try {
    if(playerlist_buffer['tick'] > gametick_player){
      gametick_player = playerlist_buffer['tick'];
      ping_player = Date.now();
      ping_player -= ping_old_player;
      ping_old_player = Date.now();
      playerlist_Now = playerlist;
      playerlist = playerlist_buffer;
      playerlist_UT = 0;
      smoothData(0);
    }
    if(skillObjectlist_buffer['tick'] > gametick_skill){
      gametick_skill = skillObjectlist_buffer['tick'];
      ping_skill = Date.now();
      ping_skill -= ping_old_skill;
      ping_old_skill = Date.now();
      skillObjectlist_Now = skillObjectlist;
      skillObjectlist = skillObjectlist_buffer;
      skillObjectlist_UT = 0;
      smoothData(1);
    }
  } catch (e) {
  }
  if(Window_height != window.innerHeight){
    canvas.height = window.innerHeight;
    Window_height = window.innerHeight;
  }
  if(Window_width != window.innerWidth){
    canvas.width = window.innerWidth;
    Window_width = window.innerWidth;
  }
  //自己位置的物理運算
  selfPysicalCal();
  //獲取個人資料
  for (let player of Object.entries(playerlist_buffer)) {
		if(player['1']['id'] == id){
      selfPlayer['health'] = player['1']['health'];
      selfPlayer['team'] = player['1']['team'];
      selfPlayer['mp'] = player['1']['mp'];
      selfPlayer['speed'] = player['1']['speed'];
      selfPlayer['damage'] = player['1']['damage'];
      break;
		}
  }
  //繪製畫面
  draw();
  animationTime += 1;
  if(animationTime > 300){
    animationTime = 0;
  }
  playerlist_UT += 1;
  setTimeout('Update()',20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //繪製背景
  var img = document.getElementById("blue_desert");
  ctx.drawImage(img,0,0, Window_width, Window_height);
  //繪製地形
  TerrainDraw();
  TerrainDecDraw();
  //繪製場景
  //繪製人物
  for (let player of Object.entries(playerlist_Now)) {
    if(player['1']['id'] != id){//別人
      if(Math.abs(player['1']['x'] - selfPlayer['x']) < (Window_width/2)+50 && Math.abs(player['1']['y'] - selfPlayer['y']) < (Window_height/2)+50){
        var temp_x = player['1']['x']+player['1']['motion_x']*playerlist_UT - selfPlayer['x'] + (Window_width/2);
        var temp_y = player['1']['y']+player['1']['motion_y']*playerlist_UT - selfPlayer['y'] + (Window_height/2);
        if(obstx.getImageData(player['1']['x'],player['1']['y'],1,1).data[1] > 100) ctx.globalAlpha = 0.4;
        if(player['1']['flip'] == true) ObjectFlipDraw(player[1],temp_x,temp_y);
        else ObjectDraw(player[1],temp_x,temp_y);
        ctx.globalAlpha = 1.0;
      }
    }else if(player['1']['id'] != 'tick'){//自己
      var temp_x = (Window_width/2);
      var temp_y = (Window_height/2);
      if(obstx.getImageData(player['1']['x'],player['1']['y'],1,1).data[1] > 100) ctx.globalAlpha = 0.4;

      if(selfPlayer['flip'] == true) ObjectFlipDraw(selfPlayer,temp_x,temp_y);
      else ObjectDraw(selfPlayer,temp_x,temp_y);
      ctx.globalAlpha = 1.0;
    }
  }
  //繪製特殊物品
  ////技能
  for (let object of Object.entries(skillObjectlist)) {
    if(Math.abs(object['1']['x'] - selfPlayer['x']) < (Window_width/2)+50 && Math.abs(object['1']['y'] - selfPlayer['y']) < (Window_height/2)+50){
      var temp_x = object['1']['x']+object['1']['motion_x']*skillObjectlist_UT - selfPlayer['x'] + (Window_width/2);
      var temp_y = object['1']['y'] - selfPlayer['y'] + (Window_height/2);
      var img = document.getElementById("fireball");
      ctx.drawImage(img,temp_x-32,temp_y-32, 64, 64);
    }
  }

  //UI介面繪製
  ////血量
  for (let player of Object.entries(playerlist_Now)) {
    if(player['1']['id'] != id){//別人
      if(Math.abs(player['1']['x'] - selfPlayer['x']) < (Window_width/2)+50 && Math.abs(player['1']['y'] - selfPlayer['y']) < (Window_height/2)+50){
        var temp_x = player['1']['x'] - selfPlayer['x'] + (Window_width/2);
        var temp_y = player['1']['y'] - selfPlayer['y'] + (Window_height/2);
        ctx.fillStyle = "rgba(152,217,95,0.8)";
        ctx.fillRect(temp_x-16, temp_y+18, 96.0*(player['1']['health']/100), 8)
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.strokeRect(temp_x-16, temp_y+18, 96, 8);
      }
    }else if(player['1']['id'] != 'tick'){//自己
      var temp_x = (Window_width/2);
      var temp_y = (Window_height/2);
      ctx.fillStyle = "rgba(152,217,95,0.8)";
      ctx.fillRect(temp_x-16, temp_y+18, 96.0*(player['1']['health']/100), 8)
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.strokeRect(temp_x-16, temp_y+18, 96, 8);
    }
  }
  //mp
  for (let player of Object.entries(playerlist_Now)) {
    if(player['1']['id'] != id){//別人
      if(Math.abs(player['1']['x'] - selfPlayer['x']) < (Window_width/2)+50 && Math.abs(player['1']['y'] - selfPlayer['y']) < (Window_height/2)+50){
        var temp_x = player['1']['x'] - selfPlayer['x'] + (Window_width/2);
        var temp_y = player['1']['y'] - selfPlayer['y'] + (Window_height/2);
        for (var i = 0; i < 10; i++) {
          if(player['1']['mp'] > i){
            var img = document.getElementById('mp_heart');
            ctx.drawImage(img,temp_x-13+i*8,temp_y+24,16,16);
          }else{
            var img = document.getElementById('mp_heart_empty');
            ctx.drawImage(img,temp_x-13+i*8,temp_y+24,16,16);
          }
        }
      }
    }else if(player['1']['id'] != 'tick'){//自己
      var temp_x = (Window_width/2);
      var temp_y = (Window_height/2);
      for (var i = 0; i < 10; i++) {
        if(player['1']['mp'] > i){
          var img = document.getElementById('mp_heart');
          ctx.drawImage(img,temp_x-13+i*8,temp_y+24,16,16);
        }else{
          var img = document.getElementById('mp_heart_empty');
          ctx.drawImage(img,temp_x-13+i*8,temp_y+24,16,16);
        }
      }
    }
  }
  //名子
  for (let player of Object.entries(playerlist_Now)) {
    if(player['1']['id'] != id){
      var temp_x = player['1']['x'] - selfPlayer['x'] + (Window_width/2);
      var temp_y = player['1']['y'] - selfPlayer['y'] + (Window_height/2);
    }else if(player['1']['id'] != 'tick'){
      var temp_x = (Window_width/2);
      var temp_y = (Window_height/2);
    }
    if(player['1']['id'] != 'tick'){
      ctx.fillStyle = "rgba(16,16,16,0.4)";
      ctx.fillRect( temp_x+28-(ctx.measureText(player['1']['name']).width/2), temp_y-12,ctx.measureText(player['1']['name']).width+8, 24)
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "16px Verdana";
      ctx.fillStyle = "rgba(245,245,245,1)";
      ctx.fillText(player['1']['name'], temp_x+32, temp_y);
    }
  }
  //ping
  if(animationTime % 50 == 1){
    ping = Math.floor((ping_skill+ping_player)/2);
  }
  ctx.fillStyle = "rgba(16,16,16,0.4)";
  ctx.fillRect(18,18,ctx.measureText("Ping: "+ping+"ms").width+8, 24)
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "16px Verdana";
  ctx.fillStyle = "rgba(245,245,245,1)";
  ctx.fillText("Ping: "+ping+"ms",20, 31);
  //效果粒子
  var i = 0;
  for (let [index,effect] of Object.entries(effectlist)) {
    var img = document.getElementById('effect'+effect['effect']);
    ctx.drawImage(img, Window_width-80*(i+1),Window_height-80,64,64);
    i ++;
    effect['time'] += 20;
    if(effect['time'] >= effect['maintime']) delete effectlist[index];
  }
  //受傷畫面
  if(hurtAnimationTime > 0){
    ctx.fillStyle = "rgba(255,30,30,"+(0.3*(hurtAnimationTime/10.0)).toString()+")";
    ctx.fillRect(0, 0, Window_width,Window_height)
    hurtAnimationTime -= 1;
  }


  //上傳資料
  playerDataSend();
}

function TerrainDraw(){
    var img = document.getElementById('scence');
    ctx.drawImage(img, -1*(selfPlayer['x']-(Window_width/2))+(hurtAnimationTime%5)*5,-1*(selfPlayer['y']-(Window_height/2)-75)+(hurtAnimationTime%5)*5,4230,1650);
}

function ObjectDraw(object,temp_x,temp_y){
  //0無 1移動 2攻擊or施法
  if(object['animation'] == 1){
    if(animationTime%16 < 8){
      if(object['team'] == 1)
        var img = document.getElementById("alienBlue_walk1");
      else
        var img = document.getElementById("alienPink_walk1");
      ctx.drawImage(img,temp_x,temp_y, 64, 128);
    }else{
      if(object['team'] == 1)
        var img = document.getElementById("alienBlue_walk2");
      else
        var img = document.getElementById("alienPink_walk2");
      ctx.drawImage(img,temp_x,temp_y, 64, 128);
    }
  }else if(object['animation'] == 2){
    if(object['team'] == 1)
      var img = document.getElementById("alienBlue_duck");
    else
      var img = document.getElementById("alienPink_duck");
    ctx.drawImage(img,temp_x,temp_y, 64, 128);
  }else{
    if(object['team'] == 1)
      var img = document.getElementById("alienBlue_front");
    else
      var img = document.getElementById("alienPink_front");
    ctx.drawImage(img,temp_x,temp_y, 64, 128);
  }
}

function ObjectFlipDraw(object,temp_x,temp_y){
  ctx.translate(Window_width+40, 0);
  ctx.scale(-1, 1);
  ctx.translate(((Window_width/2)-temp_x)*2, 0);
  if(object['animation'] == 1){
    if(animationTime%16 < 8){
      if(object['team'] == 1)
        var img = document.getElementById("alienBlue_walk1");
      else
        var img = document.getElementById("alienPink_walk1");
      ctx.drawImage(img,temp_x,temp_y, 64, 128);
    }else{
      if(object['team'] == 1)
        var img = document.getElementById("alienBlue_walk2");
      else
        var img = document.getElementById("alienPink_walk2");
      ctx.drawImage(img,temp_x,temp_y, 64, 128);
    }
  }else if(object['animation'] == 2){
    if(object['team'] == 1)
      var img = document.getElementById("alienBlue_duck");
    else
      var img = document.getElementById("alienPink_duck");
    ctx.drawImage(img,temp_x,temp_y, 64, 128);
  }else{
    if(object['team'] == 1)
      var img = document.getElementById("alienBlue_front");
    else
      var img = document.getElementById("alienPink_front");
    ctx.drawImage(img,temp_x,temp_y, 64, 128);
  }
  ctx.translate(Window_width+40, 0);
  ctx.scale(-1, 1);
  ctx.translate(((Window_width/2)-temp_x)*2, 0);
}

function wavaObjectDraw(object,px,py,lx,ly,r,midx,midy){
  var img = document.getElementById(object);
  if((midy+py-8)%2 == 0)
    ctx.drawImage(img, 130*(px-7)+(Window_width/2)-(selfPlayer['x']%130)+(Math.abs(animationTime-150)/150.0)*100, 98*(py-8)+(Window_height/2)-(selfPlayer['y']%98)+r,lx,ly);
  else
    ctx.drawImage(img, 65 + 130*(px-7)+(Window_width/2)-(selfPlayer['x']%130)+(Math.abs(animationTime-150)/150.0)*100, 98*(py-8)+(Window_height/2)-(selfPlayer['y']%98)+r,lx,ly);
}
function TerrainDecDraw(){
  for(py = 0;py < Math.ceil(Window_width/260)+2;py ++){//7
    for(px = 0;px < Math.ceil(Window_height/196)+2;px ++){//8
      var midx = parseInt(selfPlayer['x']/130);
      var midy = parseInt(selfPlayer['y']/98);
      if(midx+px-7 >= 0 && midx+px-7 < 32 && midy+py-8 >= 0&& midy+py-8 < 16){
        if(Terrain[midy+py-8][midx+px-7] == 'tileWater') {
          wavaObjectDraw('waveWater',px,py,33,10,50,midx,midy);
          wavaObjectDraw('waveWater',px,py,33,10,110,midx,midy);
        }
      }
    }
  }
}
