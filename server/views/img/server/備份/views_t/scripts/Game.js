var canvas;
var ctx;
var player;
var offset;
var animationTime = 0;
function gameStart() {
  document.getElementById("MainSence").innerHTML = '<canvas id="Game_Bg" width="1280" height="720"></canvas>';
  canvas = document.getElementById("Game_Bg");
  ctx = canvas.getContext("2d");
  offset = $("#Game_Bg").offset();
  gamestat = 2;
  Update();
  $('#Game_Bg').mousemove(function(e){
    mouse_x = e.pageX - offset.left;
    mouse_y = e.pageY - offset.top;
  });
}

function Update() {
  try {
    //得到我方位置
    for(var i = 1; i <= PlayerCount; i++){
      let player = Object.entries(playerlist[i]);
      if(player['1']['1']['id'] == id){
        selfPlayer['health'] = player['1']['1']['health'];
        selfPlayer['team'] = player['1']['1']['team'];
        selfPlayer['mp'] = player['1']['1']['mp'];
        selfPlayer['x'] = DelayCount(player['1']['1']['x'],player['1']['1']['motion_x'],i);
        selfPlayer['y'] = DelayCount(player['1']['1']['y'],player['1']['1']['motion_y'],i);
        selfPlayer['flip'] = player['1']['1']['rz'];
        selfPlayer['speed'] = player['1']['1']['speed'];
        selfPlayer['animation'] = player['1']['1']['animation'];
        break;
      }
    }
    draw();
    //繪製畫面
  } catch (e) {
    console.log(e);
  }
  animationTime += 1;
  if(animationTime > 300){
    animationTime = 0;
  }
  setTimeout('Update()',10);
  for(i = 1; i <= PlayerCount; i++){
    Delaytime[1] += 1;
  }
}

function DelayCount(pos,motion,i){
  var dpos = pos;
  if(Delaytime[i] > 30){
    dpos+=motion*0.3*Delaytime[i];
  }
  return dpos;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //繪製地形
  TerrainDraw();

  //繪製場景
  //繪製人物
  for(var i = 1; i <= PlayerCount; i++){
    let player = Object.entries(playerlist[i]);
    if(Math.abs(player['1']['1']['x'] - selfPlayer['x']) < 1200 && Math.abs(player['1']['1']['y'] - selfPlayer['y']) < 600){
      var temp_x = DelayCount(player['1']['1']['x'],player['1']['1']['motion_x'],i) - selfPlayer['x'] + 640;
      var temp_y = DelayCount(player['1']['1']['y'],player['1']['1']['motion_y'],i) - selfPlayer['y'] + 320;
      if(player['1']['1']['flip'] == true){
        ctx.translate(1320, 0);
        ctx.scale(-1, 1);
        if(player['1']['1']['animation'] == 1){
          if(animationTime%30 < 15){
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
      }else{
        if(player['1']['1']['animation'] == 1){
          if(animationTime%30 < 15){
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
    }
  }
  //繪製特殊物品
}

function TerrainDraw(){
  for(py = 0;py < 13;py ++){//7
    for(px = 0;px < 15;px ++){//8
      var midx = parseInt(selfPlayer['x']/130);
      var midy = parseInt(selfPlayer['y']/98);
      if(midx+px-7 >= 0 && midx+px-7 < 32 && midy+py-8 >= 0&& midy+py-8 < 16){
        var img = document.getElementById(Terrain[midy+py-8][midx+px-7]);
        if((py+midy)%2 == 0){
          ctx.drawImage(img, 130*(px-7)+640-(selfPlayer['x']%130), 98*(py-8)+360-(selfPlayer['y']%98),130,178);
        }else{
          ctx.drawImage(img, 65 + 130*(px-7)+640-(selfPlayer['x']%130), 98*(py-8)+360-(selfPlayer['y']%98),130,178);
        }
      }
    }
  }
};
