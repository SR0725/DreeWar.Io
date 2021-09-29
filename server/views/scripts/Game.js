var canvas;
var ctx;
var player;
var offset;
var animationTime = 0;
var animationMainTime = 0;

function gameStart() {
  //資料初始化
  for (let [index,player] of Object.entries(playerlist_buffer)) {
    if(player['id'] == id){
      selfPlayer['health'] = player['health'];
      selfPlayer['team'] = player['team'];
      selfPlayer['mp'] = player['mp'];
      selfPlayer['speed'] = player['speed'];
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
  draw();
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
  if(colliderSenceTest(selfPlayer['x'],selfPlayer['y']) == 0){
    selfPlayer['x'] += selfPlayer['motion_x'];
    selfPlayer['y'] += selfPlayer['motion_y'];
  }else{
    selfPlayer['x'] += selfPlayer['motion_x']*colliderSenceTest(selfPlayer['x'] + selfPlayer['motion_x'],selfPlayer['y']);
    selfPlayer['y'] += selfPlayer['motion_y']*colliderSenceTest(selfPlayer['x'],selfPlayer['y'] + selfPlayer['motion_y']);
  }
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
  for (let [index,player] of Object.entries(playerlist_buffer)) {
		if(player['id'] == id){
      selfPlayer['health'] = player['health'];
      selfPlayer['team'] = player['team'];
      selfPlayer['mp'] = player['mp'];
      selfPlayer['bp'] = player['bp'];
      selfPlayer['speed'] = player['speed'];
      selfPlayer['damage'] = player['damage'];
      break;
		}
  }
  animationTime += 1; if(animationTime > 300) animationTime = 0;
  playerlist_UT += 1;
  //上傳資料
  playerDataSend();
  setTimeout('Update()',20);
}
