var hurtAnimationTime = 0;

function RayTest(x1,y1,x2,y2) {
  var raymotionx = (x2-x1)/10;
  var raymotiony = (y2-y1)/10;
  for (var i = 1; i < 10; i++) {
    if(obstx.getImageData(x1+raymotionx*i,y1+raymotiony*i,1,1).data[0] > 200){
      return true;
    }
  }
  return false;
}

function BuildVisibleTest(x1,y1,x2,y2) {
  var distance = Math.pow((x1-x2),2)+Math.pow((y1-y2),2);
  if(distance < 360000){
    if(obstx.getImageData(x1,y1,1,1).data[1] > 100) return 0.4;
    return 1;
  }else if(distance < 722500){
    if(obstx.getImageData(x1,y1,1,1).data[1] > 100){
      if((0.1 - (distance-360000)/362500) < 0)
        return 0;
      else
        return 0.1 - (distance-360000)/362500;
    }
    return 1.0 - (distance-360000)/362500;
  }else{
    return 0;
  }
}

function VisibleTest(x1,y1,x2,y2) {
  var distance = Math.pow((x1-x2),2)+Math.pow((y1-y2),2);
  if(distance < 360000){
    if(RayTest(x1,y1,x2,y2))
      return 0;
    if(obstx.getImageData(x1,y1,1,1).data[1] > 100) return 0.4;
    return 1;
  }else if(distance < 722500){
    if(RayTest(x1,y1,x2,y2))
      return 0;
    if(obstx.getImageData(x1,y1,1,1).data[1] > 100){
      if((0.4 - (distance-360000)/362500) < 0)
        return 0;
      else
        return 0.4 - (distance-360000)/362500;
    }
    return 1.0 - (distance-360000)/362500;
  }else{
    return 0;
  }
}

function draw() {
  //重製背景
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //繪製背景
  var img = document.getElementById("blue_desert");
  ctx.drawImage(img,0,0, Window_width, Window_height);
  //繪製地形
  TerrainDraw();
  if(displayWave == true) TerrainDecDraw();
  //繪製場景
  buildingDisplay();
  //繪製人物
  playerDisplay();
  //技能
  skillDisplay();
  //粒子效果
  particleDisplay();
  /*UI介面繪製*/
  //bp and mp
  UI_bp_mpDisplay();
  //ping and FPS
  UI_pingAndFPSDisplay();
  //效果圖示
  var i = 0;
  for (let [index,effect] of Object.entries(effectlist)) {
    var img = document.getElementById('effect'+effect['effect']);
    ctx.drawImage(img, Window_width-80,Window_height-80*(i+3),64,64);
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
  //死亡畫面
  if(respawnTime > 0){
      var respawnTimeAnimation = respawnTime/500.0 > 0.5 ? respawnTime/500.0 : 0.5;
      ctx.fillStyle = "rgba(0,0,0,"+respawnTimeAnimation.toString()+")";
      ctx.fillRect(0, 0, Window_width,Window_height)
  }
  //FPS實際數值計算是
  fps_T1 = fps_T2;
  fps_T2 = Date.now();
  fps_T = fps_T2 - fps_T1;
  //UI介面 ActionBar
  if(actionBarTime >= 0)
    UI_ActionBarDisplay();
  mouseCircle();
  setTimeout('draw()',(1000/FramePerSencond));
}

function TerrainDraw(){
    var img = document.getElementById('scence');
    ctx.drawImage(img, -1*(selfPlayer['x']-(Window_width/2))+(hurtAnimationTime%5)*5,-1*(selfPlayer['y']-(Window_height/2)-75)+(hurtAnimationTime%5)*5,4230,1650);
}

function buildingDisplay(){
  for (let [index,build] of Object.entries(buildinglist)) {
    if(Math.abs(build['x'] - selfPlayer['x']) < (Window_width/2)+50 && Math.abs(build['y'] - selfPlayer['y']) < (Window_height/2)+50){
      var temp_x = build['x'] - selfPlayer['x'] + (Window_width/2);
      var temp_y = build['y'] - selfPlayer['y'] + (Window_height/2);
      if(displayBuildingMist == true)
        ctx.globalAlpha = BuildVisibleTest(build['x']-55, build['y']-64,selfPlayer['x'],selfPlayer['y']);
      var img;
      switch (build['type']) {
        case 1:
          if(build['team'] == 1)
            img = document.getElementById("beegen_blue");
          else
            img = document.getElementById("beegen_red");
          ctx.drawImage(img,temp_x-55,temp_y-64, 111, 128);
          if (displayBuildingHp == true) {
            hpBarDisplay(temp_x,temp_y,build['health'],20,72,62);
          }
          break;
        case 2:
          img = document.getElementById("wall");
          ctx.drawImage(img,temp_x-55,temp_y-64, 111, 128);
          if (displayBuildingHp == true) {
            hpBarDisplay(temp_x,temp_y,build['health'],100,72,62);
          }
          break;
        case 3:
          if(build['team'] == 1)
            img = document.getElementById("fort_blue");
          else
            img = document.getElementById("fort_red");
          ctx.drawImage(img,temp_x-55,temp_y-64, 111, 128);
          if (displayBuildingHp == true) {
            hpBarDisplay(temp_x,temp_y,build['health'],50,72,62);
          }
          break;
        case 4:
          if(build['team'] == 1)
            img = document.getElementById("flowergen_blue");
          else
            img = document.getElementById("flowergen_red");
          ctx.drawImage(img,temp_x-64,temp_y-64, 128, 128);
          if (displayBuildingHp == true) {
            hpBarDisplay(temp_x,temp_y,build['health'],20,72,62);
          }
          break;
        case 5:
          img = document.getElementById("hptower");
          ctx.drawImage(img,temp_x-55,temp_y-80, 111, 160);
          img = document.getElementById("hptower_animation");
          ctx.drawImage(img,temp_x-55,temp_y-80-Math.sin((animationTime%50)/50*Math.PI)*30, 111, 160);
          if (displayBuildingHp == true) {
            hpBarDisplay(temp_x,temp_y,build['health'],50,72,62);
          }
          break;
        default:
      }
      ctx.globalAlpha = 1.0;
    }
  }
}

function playerDisplay() {
  if(displayWithoutLag == false){
    for (let [index,player] of Object.entries(playerlist_Now)) {
      if(player['id'] != id){//別人
        if(Math.abs(player['x'] - selfPlayer['x']) < (Window_width/2)+50 && Math.abs(player['y'] - selfPlayer['y']) < (Window_height/2)+50){
          var temp_x = player['x']+player['motion_x']*playerlist_UT - selfPlayer['x'] + (Window_width/2);
          var temp_y = player['y']+player['motion_y']*playerlist_UT - selfPlayer['y'] + (Window_height/2);
          ctx.globalAlpha = VisibleTest( player['x'], player['y'],selfPlayer['x'],selfPlayer['y']);
          if(player['flip'] == true) ObjectFlipDraw(player,temp_x,temp_y);
          else ObjectDraw(player,temp_x,temp_y);
          hpBarDisplay(temp_x,temp_y,player['health'],100,42,12);
          mpBarDisplay(temp_x,temp_y,player['mp'],10,42,26);
          nameDisplay(temp_x,temp_y,player['name']);
          ctx.globalAlpha = 1.0;
        }
      }else if(player['id'] != 'tick'){//自己
        var temp_x = (Window_width/2);
        var temp_y = (Window_height/2);
        if(obstx.getImageData(player['x'],player['y'],1,1).data[1] > 100) ctx.globalAlpha = 0.4;
        if(selfPlayer['flip'] == true) ObjectFlipDraw(selfPlayer,temp_x,temp_y);
        else ObjectDraw(selfPlayer,temp_x,temp_y);
        hpBarDisplay(temp_x,temp_y,player['health'],100,42,12);
        mpBarDisplay(temp_x,temp_y,player['mp'],10,42,26);
        nameDisplay(temp_x,temp_y,player['name']);
        ctx.globalAlpha = 1.0;
      }
    }
  }else{
    for (let [index,player] of Object.entries(playerlist_buffer)) {
      if(player['id'] != id){//別人
        if(Math.abs(player['x'] - selfPlayer['x']) < (Window_width/2)+50 && Math.abs(player['y'] - selfPlayer['y']) < (Window_height/2)+50){
          var temp_x = player['x'] - selfPlayer['x'] + (Window_width/2);
          var temp_y = player['y'] - selfPlayer['y'] + (Window_height/2);
          ctx.globalAlpha = VisibleTest( player['x'], player['y'],selfPlayer['x'],selfPlayer['y']);
          if(player['flip'] == true) ObjectFlipDraw(player,temp_x,temp_y);
          else ObjectDraw(player,temp_x,temp_y);
          hpBarDisplay(temp_x,temp_y,player['health'],100,42,12);
          mpBarDisplay(temp_x,temp_y,player['mp'],10,42,26);
          nameDisplay(temp_x,temp_y,player['name']);
          ctx.globalAlpha = 1.0;
        }
      }else if(player['id'] != 'tick'){//自己
        var temp_x = (Window_width/2);
        var temp_y = (Window_height/2);
        if(obstx.getImageData(player['x'],player['y'],1,1).data[1] > 100) ctx.globalAlpha = 0.4;

        if(selfPlayer['flip'] == true) ObjectFlipDraw(selfPlayer,temp_x,temp_y);
        else ObjectDraw(selfPlayer,temp_x,temp_y);
        hpBarDisplay(temp_x,temp_y,player['health'],100,42,12);
        mpBarDisplay(temp_x,temp_y,player['mp'],10,42,26);
        nameDisplay(temp_x,temp_y,player['name']);
        ctx.globalAlpha = 1.0;
      }
    }
  }
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
  ctx.translate(Window_width+70, 0);
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
  ctx.translate(Window_width+70, 0);
  ctx.scale(-1, 1);
  ctx.translate(((Window_width/2)-temp_x)*2, 0);
}

function skillDisplay() {
  for (let [index,object] of Object.entries(skillObjectlist)) {
    switch (object['skill']) {
      case 0:
        if(Math.abs(object['x'] - selfPlayer['x']) < (Window_width/2)+50 && Math.abs(object['y'] - selfPlayer['y']) < (Window_height/2)+50){
          var temp_x = object['x']+object['motion_x']*skillObjectlist_UT - selfPlayer['x'] + (Window_width/2);
          var temp_y = object['y'] - selfPlayer['y'] + (Window_height/2);
          var img = document.getElementById("fireball");
          ctx.globalAlpha = VisibleTest( object['x'], object['y'],selfPlayer['x'],selfPlayer['y']);
          ctx.drawImage(img,temp_x-32,temp_y-32, 64, 64);
          ctx.globalAlpha = 1;
        }
        break;
      case 2:
        switch (object['race']) {
          case 1:
            if(Math.abs(object['x'] - selfPlayer['x']) < (Window_width/2)+50 && Math.abs(object['y'] - selfPlayer['y']) < (Window_height/2)+50){
              var temp_x = object['x']+object['motion_x']*skillObjectlist_UT - selfPlayer['x'] + (Window_width/2);
              var temp_y = object['y'] - selfPlayer['y'] + (Window_height/2);
              var img = document.getElementById("brickBrown");
              ctx.globalAlpha = VisibleTest( object['x'], object['y'],selfPlayer['x'],selfPlayer['y']);
              ctx.drawImage(img,temp_x-8,temp_y-8, 16, 16);
              ctx.globalAlpha = 1;
            }
            break;
          default:

        }
        break;
      default:

    }
  }
}

function UI_bp_mpDisplay(){
  var temp_x = Window_width-250;
  var temp_y = Window_height-194;
  //mp
  var temp_x = Window_width-105;;
  var temp_y = Window_height-94;
  var img = document.getElementById('mp_s');
  for (var i = 0; i < selfPlayer['mp']; i++) {
    ctx.drawImage(img,temp_x+28-Math.cos(i/15*PI)*115,temp_y-Math.sin(i/15*PI)*115,26,45);
  }
  //bar
  temp_x = Window_width-250;
  temp_y = (Window_height-194);
  var img = document.getElementById('Bar');
  ctx.drawImage(img,temp_x,temp_y,250,194);
  //bp
  var img = document.getElementById('bp'+selfPlayer['bp']);
  ctx.drawImage(img,temp_x,temp_y,250,194);
  //hp
  temp_x = Window_width-150;
  temp_y = Window_height-135;
  var img = document.getElementById('hp_s');
  ctx.drawImage(img,0,0,95,86*(selfPlayer['health']/100),temp_x,temp_y,156,137*(selfPlayer['health']/100));
}

function UI_pingAndFPSDisplay(){
  if(animationTime % 50 == 1){
    ping = Math.floor((ping_skill+ping_player)/2);
    fps = Math.floor(1000/fps_T);
  }
  ctx.fillStyle = "rgba(16,16,16,0.4)";
  ctx.fillRect(64,4,ctx.measureText("Ping: "+ping+"ms").width+14, 24)
  ctx.fillRect(64,32,ctx.measureText("FPS: "+fps).width+14, 24)
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "16px Verdana";
  ctx.fillStyle = "rgba(245,245,245,1)";
  ctx.fillText("Ping: "+ping+"ms",72, 17);
  ctx.fillText("FPS: "+fps,72, 45);
}

function ActionBarShow(msg){
  actionBarMSG = msg;
  actionBarTime = 80;
}

function UI_ActionBarDisplay(){
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "21px Verdana";
  ctx.fillStyle = "rgba(16,16,16,0.4)";
  ctx.fillRect(Window_width*0.1-8,Window_height-266+100*(actionBarTime/80),ctx.measureText(actionBarMSG).width+14, 30)
  ctx.fillStyle = "rgba(245,245,245,1)";
  ctx.fillText(actionBarMSG,Window_width*0.1,Window_height-250+100*(actionBarTime/80));
}

function particleDisplay() {
  for (let [index,particle] of Object.entries(particlelist)) {
    if(Math.abs(particle['x'] - selfPlayer['x']) < (Window_width/2)+50 && Math.abs(particle['y'] - selfPlayer['y']) < (Window_height/2)+50){
      ctx.globalAlpha = VisibleTest( particle['x'], particle['y'],selfPlayer['x'],selfPlayer['y']);
      var tempAlpha = VisibleTest( particle['x'], particle['y'],selfPlayer['x'],selfPlayer['y']);
      switch (particle['particle']) {
        case 0:
          var img = document.getElementById('s0_icon');
          ctx.drawImage(img, particle['x'] - selfPlayer['x'] + (Window_width/2),particle['y'] - selfPlayer['y'] + (Window_height/2)-64,64,64);
          break;
        case 1:
          var img = document.getElementById('explosion_'+Math.floor(particle['time']/50));
          ctx.drawImage(img, particle['x'] - selfPlayer['x'] + (Window_width/2)-180,particle['y'] - selfPlayer['y'] + (Window_height/2)-180,196*2,196*2);
          break;
        case 2:
          var img1 = document.getElementById('brickBrown');
          var img2 = document.getElementById('brickGrey');
          var tempB;
          if(particle['time']> 500){
            ctx.globalAlpha= (1-tempAlpha * (particle['time']-500)/500);
            var tempB = 1;
          }
          var tempB = Math.pow(particle['time']/1000,0.333);
          for (var i = 0; i < 20; i++) {
            var tempx = (Math.sin(i))*tempB*80;
            var tempy = (Math.sin(i*1.4))*tempB*80;
            if(i % 2 == 1)
              ctx.drawImage(img1, particle['x'] - selfPlayer['x'] + (Window_width/2)+tempx,particle['y'] - selfPlayer['y'] + (Window_height/2)+tempy,16,16);
            else
              ctx.drawImage(img2, particle['x'] - selfPlayer['x'] + (Window_width/2)+tempx,particle['y'] - selfPlayer['y'] + (Window_height/2)+tempy,16,16);
          }
          break;
        case 3:
          var img = document.getElementById('brickBrown');
          var temp_mx = Math.sin(particle['x']) * particle['time']*0.1;
          var temp_my = Math.sin(particle['y']) * particle['time']*0.1;
          ctx.drawImage(img, particle['x'] - selfPlayer['x'] + (Window_width/2)-8+temp_mx,particle['y'] - selfPlayer['y'] + (Window_height/2)-8+temp_my,16,16);
          temp_mx = Math.sin(particle['x'+0.6]) * particle['time']*0.1;
          temp_my = Math.sin(particle['y'+0.6]) * particle['time']*0.1;
          ctx.drawImage(img, particle['x'] - selfPlayer['x'] + (Window_width/2)-8+temp_mx,particle['y'] - selfPlayer['y'] + (Window_height/2)-8+temp_my,16,16);
          temp_mx = Math.sin(particle['x'+1.2]) * particle['time']*0.1;
          temp_my = Math.sin(particle['y'+1.2]) * particle['time']*0.1;
          var img = document.getElementById('brickGrey');
          ctx.drawImage(img, particle['x'] - selfPlayer['x'] + (Window_width/2)-8+temp_mx,particle['y'] - selfPlayer['y'] + (Window_height/2)-8+temp_my,16,16);
          break;
        case 11:
          var img = document.getElementById('1_s1_icon');
          ctx.drawImage(img, particle['x'] - selfPlayer['x'] + (Window_width/2),particle['y'] - selfPlayer['y'] + (Window_height/2)-64,64,64);
          break;
        case 12:
          var img = document.getElementById('1_s2_icon');
          ctx.drawImage(img, particle['x'] - selfPlayer['x'] + (Window_width/2),particle['y'] - selfPlayer['y'] + (Window_height/2)-64,64,64);
          break;
        case 13:
          var img = document.getElementById('1_s3_icon');
          ctx.drawImage(img, particle['x'] - selfPlayer['x'] + (Window_width/2),particle['y'] - selfPlayer['y'] + (Window_height/2)-64,64,64);
          break;
        default:
      }
      ctx.globalAlpha = 1;
    }
    particle['time'] += 20;
    if(particle['time'] >= particle['maintime']) delete particlelist[index];
  }
}

function wavaObjectDraw(object,px,py,lx,ly,r,midx,midy){
  var img = document.getElementById(object);
  if((midy+py-8)%2 == 0)
    ctx.drawImage(img, 130*(px-7)+(Window_width/2)-(selfPlayer['x']%130)+(Math.abs(animationTime-150)/150.0)*100, 98*(py-8)+(Window_height/2)-(selfPlayer['y']%98)+r,lx,ly);
  else
    ctx.drawImage(img, 65 + 130*(px-7)+(Window_width/2)-(selfPlayer['x']%130)+(Math.abs(animationTime-150)/150.0)*100, 98*(py-8)+(Window_height/2)-(selfPlayer['y']%98)+r,lx,ly);
}

function hpBarDisplay(x,y,health,maxhealth,lx,ly){
  var temp_x = x;
  var temp_y = y;
  var img = document.getElementById('hp_e');
  ctx.drawImage(img,temp_x-lx,temp_y+ly,147,14);
  var img = document.getElementById('hp');
  ctx.drawImage(img,0,0,294.0*(health/maxhealth),56,temp_x-lx,temp_y+ly,147*(health/maxhealth),14);
  var img = document.getElementById('hp_s');
  ctx.drawImage(img,temp_x-lx-18,temp_y+ly-3,18,16);
}

function mpBarDisplay(x,y,mp,maxmp,lx,ly){
  var temp_x = x;
  var temp_y = y;
  var img = document.getElementById('mp_e');
  ctx.drawImage(img,temp_x-lx,temp_y+ly,147,14);
  var img = document.getElementById('mp');
  ctx.drawImage(img,0,0,294.0*(mp/maxmp),56,temp_x-lx,temp_y+ly,147*(mp/maxmp),14);
  var img = document.getElementById('mp_s');
  ctx.drawImage(img,temp_x-lx-14,temp_y+ly,9,15);
}

function nameDisplay(x,y,name){
  var temp_x = x - 52;
  var temp_y = y;
  ctx.fillStyle = "rgba(16,16,16,0.4)";
  ctx.fillRect( temp_x+28-(ctx.measureText(name).width/2), temp_y-12,ctx.measureText(name).width+8, 24)
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "16px Verdana";
  ctx.fillStyle = "rgba(245,245,245,1)";
  ctx.fillText(name, temp_x+32, temp_y);
}

function TerrainDecDraw(){
  for(py = 0;py < Math.ceil(Window_width/260)+2;py ++){//7
    for(px = 0;px < Math.ceil(Window_height/196)+2;px ++){//8
      var midx = parseInt(selfPlayer['x']/130);
      var midy = parseInt(selfPlayer['y']/98);
      if(midx+px-7 >= 0 && midx+px-7 < 32 && midy+py-8 >= 0&& midy+py-8 < 16){
        if(Terrain[midy+py-8][midx+px-7] == 'tileWater') {
          wavaObjectDraw('waveWater',px,py,33,10,100,midx,midy);
          wavaObjectDraw('waveWater',px,py,33,10,160,midx,midy);
        }
      }
    }
  }
}

var mouse_x_animation = 0;
var mouse_y_animation = 0;
var mouse_x_motion = 0;
var mouse_y_motion = 0;
var animationCircleTime;
var mouse_x_animationlist = {};
var mouse_y_animationlist = {};

function mouseCircle() {
  mouse_x_motion = mouse_x_animation-mouse_x;
  mouse_y_motion = mouse_y_animation-mouse_y;

  mouse_x_animation -= mouse_x_motion*0.25;
  mouse_y_animation -= mouse_y_motion*0.25;

  if(mouse_x_motion < 0.001)
    mouse_x_motion = 0;
  if(mouse_y_motion < 0.001)
    mouse_y_motion = 0;

  if (displayMouseCircleWithoutDelay) {
    for (var i = 0; i < 15; i++) {
      mouse_x_animationlist[i] = mouse_x;
      mouse_y_animationlist[i] = mouse_y;
    }
  }else{
    for (var i = 0; i < 15; i++) {
      if(i != 0){
        mouse_x_animationlist[i] = mouse_x_animationlist[i-1];
        mouse_y_animationlist[i] = mouse_y_animationlist[i-1];
      }
    }
    mouse_x_animationlist[0] = mouse_x_animation;
    mouse_y_animationlist[0] = mouse_y_animation;
  }

  animationCircleTime = animationTime%100;
  var mouseCircleColor = "rgba(220,230,255,";
  for (let [index,player] of Object.entries(playerlist_Now)) {
    if(player['id'] != id){
      if(colliderBoxCircle(player['x']+player['motion_x']*playerlist_UT - selfPlayer['x'] + (Window_width/2),player['y']+player['motion_y']*playerlist_UT - selfPlayer['y'] + (Window_height/2),64,128,mouse_x_animation+32,mouse_y_animation+64,24)){
        if(player['team'] != selfPlayer['team'])
          mouseCircleColor = "rgba(250,50,30,";
        else
          mouseCircleColor = "rgba(50,80,250,";
        break;
      }
    }
  }
  if(mouseCircleColor == "rgba(220,230,255,"){
    for (let [index,build] of Object.entries(buildinglist)) {
      if(colliderBoxCircle(build['x'] - selfPlayer['x'] + (Window_width/2),build['y'] - selfPlayer['y'] + (Window_height/2),64,128,mouse_x_animation+64,mouse_y_animation+136,36)){
        if(build['team'] != selfPlayer['team'])
          mouseCircleColor = "rgba(250,50,30,";
        else
          mouseCircleColor = "rgba(50,80,250,";
        break;
      }
    }
  }

  for (var i = 0; i < 15; i++) {
    ctx.beginPath();
    ctx.arc(mouse_x_animationlist[i]+Math.cos(((animationCircleTime-2*i)/100)*2*PI)*15+32,mouse_y_animationlist[i]+Math.sin(((animationCircleTime-2*i)/100)*2*PI)*15+64, 3-(0.15*i), 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = mouseCircleColor+1*(1-(i/14))+")";
    ctx.fill();
  }

  for (var i = 0; i < 15; i++) {
    ctx.beginPath();
    ctx.arc(mouse_x_animationlist[i]+Math.cos(((animationCircleTime+50-2*i)/100)*2*PI)*15+32,mouse_y_animationlist[i]+Math.sin(((animationCircleTime+50-2*i)/100)*2*PI)*15+64, 3-(0.15*i), 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = mouseCircleColor+1*(1-(i/14))+")";
    ctx.fill();
  }
}
