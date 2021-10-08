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

function distanceCount(x1,y1,x2,y2){
  return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2))
}

function VisibleTest(x1,y1,x2,y2) {
  var distance = Math.pow((x1-x2),2)+Math.pow((y1-y2),2);
  if(distance < 360000){
    if(RayTest(x1,y1,x2,y2))
      return 0.3;
    if(obstx.getImageData(x1,y1,1,1).data[1] > 100) return 0.4;
    return 1;
  }else if(distance < 722500){
    if(RayTest(x1,y1,x2,y2))
      if((0.3 - (distance-360000)/362500) < 0)
        return 0;
      else
        return 0.3 - (distance-360000)/362500;
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
  if(mouseRight)
    emotionSelect();
  //Bossbar
  gameDisplay();
  //新手教學
  if(newPlayerTipAnimation < 19)
    newPlayerTip();
  //人物list
  if(tabUse)
    tabInfoDisplay();
  //勝敗
  if(winAnimation > 0)
    winAnimationDisplay();
  if(loseAnimation > 0)
    loseAnimationDisplay();
  mouseCircle();
  setTimeout('draw()',(1000/FramePerSencond));
}

function tabInfoDisplay() {
  try {
    ctx.fillStyle = "rgba(30,30,30,100)";
    ctx.fillRect(Window_width*0.1, Window_height*0.1, Window_width*0.8,Window_height*0.8)
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = "21px Verdana";

    var temp = 0;
    for (let [index,player] of Object.entries(playerlist_Now)) {
      var temp_x = 0.2* Window_width;
      var temp_y = 0.2* Window_height + 32*temp;
      var msg = player['name']+"－擊殺數："+kdalist[index]['kill']+"－死亡數："+kdalist[index]['death']+"－輔助數："+kdalist[index]['support']
      var txt_len = ctx.measureText(msg).width;
      ctx.fillStyle = "rgba(16,16,16,0.4)";
      ctx.fillRect(temp_x-6,temp_y+16,txt_len+14, 30)
      ctx.fillStyle = "rgba(245,245,245,1)";
      ctx.fillText(msg,temp_x+1,temp_y+32);
      temp += 1;
    }
  } catch (e) {

  }
}

function winAnimationDisplay() {
  winAnimation += 1;
  var temp_x = 0.5*Window_width-192;
  var temp_y = 0.2*Window_height;
  if(winAnimation < 50){
    ctx.fillStyle = "rgba(0,0,0,"+winAnimation*3.5/255+")";
    temp_y = 0.2*Window_height + 400 - winAnimation*8;
  }
  else{
    ctx.fillStyle = "rgba(0,0,0,0.686)";
    temp_y = 0.2*Window_height;
  }
  ctx.fillRect(0, 0, Window_width,Window_height);
  for (var i = 0; i < 6; i++) {
    var img = document.getElementById('wood_'+i);
    ctx.drawImage(img,temp_x+64*i,temp_y,64,64);
  }
}

function loseAnimationDisplay() {
  loseAnimation += 1;
  var temp_x = 0.5*Window_width-160;
  var temp_y = 0.2*Window_height;
  if(loseAnimation < 50){
    ctx.fillStyle = "rgba(0,0,0,"+loseAnimation*3.5/255+")";
    temp_y = 0.2*Window_height + 400 - loseAnimation*8;
  }
  else{
    ctx.fillStyle = "rgba(0,0,0,0.686)";
    temp_y = 0.2*Window_height;
  }
  ctx.fillRect(0, 0, Window_width,Window_height);
  for (var i = 0; i < 5; i++) {
    var img = document.getElementById('metal_'+i);
    ctx.drawImage(img,temp_x+64*i,temp_y,64,64);
  }
}

function emotionSelect(){
  var temp_x = Window_width/2;
  var temp_y = Window_height/2;
  for (var i = 1; i <= 7; i++) {
    var img = document.getElementById('emoteUI_'+i);
    ctx.drawImage(img, temp_x+Math.cos(i/7*2*PI)*200,temp_y+Math.sin(i/7*2*PI)*200,64,76);
  }
}

function gameDisplay(){
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "21px Verdana";

  //occupy
  var temp_x = Window_width*0.45;
  var temp_y = 48;
  var img = document.getElementById('box');
  ctx.drawImage(img,temp_x+32,temp_y,Window_width*0.10,5);

  temp_x = Window_width*0.485;
  temp_y = 30;
  img = document.getElementById('midtree');
  ctx.drawImage(img,temp_x+Window_width*0.066*(occupyTime+5)/10,temp_y,10,20);

  //blue
  temp_x = Window_width*0.45;
  temp_y = 10;
  img = document.getElementById('hudPlayer_blue');
  ctx.drawImage(img,temp_x,temp_y,64,64);

  var txt_len = ctx.measureText(bluescore).width;
  ctx.fillStyle = "rgba(16,16,16,0.4)";
  ctx.fillRect(temp_x-6-txt_len,temp_y+16,txt_len+14, 30)
  ctx.fillStyle = "rgba(245,245,245,1)";
  ctx.fillText(bluescore,temp_x+1-txt_len,temp_y+32);

  //red
  temp_x = Window_width*0.55;
  temp_y = 10;
  img = document.getElementById('hudPlayer_pink');
  ctx.drawImage(img,temp_x,temp_y,64,64);


  txt_len = ctx.measureText(redscore).width;
  ctx.fillStyle = "rgba(16,16,16,0.4)";
  ctx.fillRect(temp_x+56,temp_y+16,txt_len+14, 30)
  ctx.fillStyle = "rgba(245,245,245,1)";
  ctx.fillText(redscore,temp_x+63,temp_y+32);
}

/*
function shaderDraw(){
  var GameScreen = document.getElementById('Game_Bg');
  dataUrl = GameScreen.toDataURL();
  imageFoo = document.createElement('img');
  imageFoo.src = dataUrl;
  imageFoo.onload = onload;

  const gpu = new GPU();
  const kernel = gpu.createKernel(function(imageFoo,lx,ly) {
    const pixel = imageFoo[this.thread.z][this.thread.y][this.thread.x];
    var distance = (this.thread.x-0.5*lx)*(this.thread.x-0.5*lx) + (this.thread.y-0.5*ly)*(this.thread.y-0.5*ly);
    if(distance > 800*800)
      this.color(0, 0, 0, pixel[3]);
    else
      this.color(pixel[0], pixel[1], pixel[2], pixel[3]);

  }).setGraphical(true).setOutput([100, 100]);

  imageFoo.onload = () => {
    kernel(imageFoo,Window_width, Window_height);
    document.getElementById("MainSence").innerHTML = "";
    document.getElementById("MainSence").appendChild(kernel.canvas);
  };
}*/

function TerrainDraw(){
    var img = document.getElementById('scence');
    ctx.drawImage(img, -1*(selfPlayer['x']-(Window_width/2))+(hurtAnimationTime%5)*5,-1*(selfPlayer['y']-(Window_height/2)-75)+(hurtAnimationTime%5)*5,4230,1650);
}

function occupyCircleDraw(temp_x,temp_y){
  if(occupyTime == -5){
    img = document.getElementById("hudPlayer_blue");
    ctx.drawImage(img,temp_x-32,temp_y-232, 64, 64);
  }else if(occupyTime == 5){
    img = document.getElementById("hudPlayer_pink");
    ctx.drawImage(img,temp_x-32,temp_y-232, 64, 64);
  }else{
    if(occupyTime > 0){
      ctx.beginPath();
      ctx.moveTo( temp_x, temp_y-200 );
      ctx.arc(temp_x,temp_y-200,30, 0, Math.PI *2*(occupyTime/5), false);
      ctx.closePath();
      ctx.fillStyle = "rgba(220,130,100,1.0)";
      ctx.fill();
    }else if(occupyTime < 0){
      ctx.beginPath();
      ctx.moveTo( temp_x, temp_y-200 );
      ctx.arc(temp_x,temp_y-200,30, 0, Math.PI *-2*(occupyTime/5), false);
      ctx.closePath();
      ctx.fillStyle = "rgba(100,130,220,1.0)";
      ctx.fill();
    }
    img = document.getElementById("hudPlayer_mid");
    ctx.drawImage(img,temp_x-32,temp_y-232, 64, 64);
  }
}
function foccupyCircleDraw(temp_x,temp_y,frog){
  if(foccupyTime[frog] == -3){
    img = document.getElementById("hudPlayer_blue");
    ctx.drawImage(img,temp_x-32,temp_y-32, 64, 64);
  }else if(foccupyTime[frog] == 3){
    img = document.getElementById("hudPlayer_pink");
    ctx.drawImage(img,temp_x-32,temp_y-32, 64, 64);
  }else{
    if(foccupyTime[frog] > 0){
      ctx.beginPath();
      ctx.moveTo( temp_x, temp_y );
      ctx.arc(temp_x,temp_y,30, 0, Math.PI *2*(foccupyTime[frog]/3), false);
      ctx.closePath();
      ctx.fillStyle = "rgba(220,130,100,1.0)";
      ctx.fill();
    }else if(foccupyTime[frog] < 0){
      ctx.beginPath();
      ctx.moveTo( temp_x, temp_y );
      ctx.arc(temp_x,temp_y,30, 0, Math.PI *-2*(foccupyTime[frog]/3), false);
      ctx.closePath();
      ctx.fillStyle = "rgba(100,130,220,1.0)";
      ctx.fill();
    }
    img = document.getElementById("hudPlayer_mid");
    ctx.drawImage(img,temp_x-32,temp_y-32, 64, 64);
  }
}
function buildingDisplay(){
  //人造地形
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
  //世界之樹
  var temp_x = 2130 - selfPlayer['x'] + (Window_width/2);
  var temp_y = 696 - selfPlayer['y'] + (Window_height/2);
  img = document.getElementById("midtree");
  ctx.drawImage(img,temp_x-102,temp_y-212, 204, 414);
  //佔領列表
  occupyCircleDraw(temp_x,temp_y);
  //青蛙1
  var temp_x = 1614 - selfPlayer['x'] + (Window_width/2);
  var temp_y = 361 - selfPlayer['y'] + (Window_height/2);
  img = document.getElementById("frog_t");
  ctx.drawImage(img,temp_x-128,temp_y-128, 256, 256);
  foccupyCircleDraw(temp_x,temp_y,1);
  //青蛙2
  var temp_x = 1614 - selfPlayer['x'] + (Window_width/2);
  var temp_y = 1212 - selfPlayer['y'] + (Window_height/2);
  img = document.getElementById("frog_t");
  ctx.drawImage(img,temp_x-128,temp_y-128, 256, 256);
  foccupyCircleDraw(temp_x,temp_y,2);
  //青蛙3
  var temp_x = 2692 - selfPlayer['x'] + (Window_width/2);
  var temp_y = 361 - selfPlayer['y'] + (Window_height/2);
  img = document.getElementById("frog");
  ctx.drawImage(img,temp_x-128,temp_y-128, 256, 256);
  foccupyCircleDraw(temp_x,temp_y,3);
  //青蛙4
  var temp_x = 2692 - selfPlayer['x'] + (Window_width/2);
  var temp_y = 1212 - selfPlayer['y'] + (Window_height/2);
  img = document.getElementById("frog");
  ctx.drawImage(img,temp_x-128,temp_y-128, 256, 256);
  foccupyCircleDraw(temp_x,temp_y,4);
  //重生塔B
  var temp_x = 129 - selfPlayer['x'] + (Window_width/2);
  var temp_y = 1036 - selfPlayer['y'] + (Window_height/2);
  img = document.getElementById("fort_blue");
  ctx.drawImage(img,temp_x-55,temp_y-64, 111, 128);

  var temp_x = 129 - selfPlayer['x'] + (Window_width/2);
  var temp_y = 636 - selfPlayer['y'] + (Window_height/2);
  img = document.getElementById("fort_blue");
  ctx.drawImage(img,temp_x-55,temp_y-64, 111, 128);

  //重生塔R
  var temp_x = 4019 - selfPlayer['x'] + (Window_width/2);
  var temp_y = 1036 - selfPlayer['y'] + (Window_height/2);
  img = document.getElementById("fort_red");
  ctx.drawImage(img,temp_x-55,temp_y-64, 111, 128);

  var temp_x = 4019 - selfPlayer['x'] + (Window_width/2);
  var temp_y = 636 - selfPlayer['y'] + (Window_height/2);
  img = document.getElementById("fort_red");
  ctx.drawImage(img,temp_x-55,temp_y-64, 111, 128);
}

function playerEmotion(x,y,emotion){
  img = document.getElementById("emote_"+emotion);
  ctx.drawImage(img,x+8,y-16, 48, 57);
}

function playerDisplay() {
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
        ////emotion
        try {
          if(emotionList[index]['id'] == player['id']){
            playerEmotion(temp_x,temp_y,emotionList[index]['type']);
            if(emotionList[index]['time'] < 0)
              delete emotionList[index];
            else
              emotionList[index]['time'] -= 1;
          }
        } catch (e) {

        }
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
      ////emotion
      try {
        if(emotionList[index]['id'] == player['id']){
          playerEmotion(temp_x,temp_y,emotionList[index]['type']);
          if(emotionList[index]['time'] < 0)
            delete emotionList[index];
          else
            emotionList[index]['time'] -= 1;
        }
      } catch (e) {

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
  temp_x = Window_width-143;
  temp_y = Window_height-121;
  var img = document.getElementById('hp_s');
  ctx.drawImage(img,0,86,95,-86*(selfPlayer['health']/100),temp_x,temp_y+(123-123*(selfPlayer['health']/100)),142,123*(selfPlayer['health']/100));
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
          if(particle['time'] == 1){
            distance = distanceCount(particle['x'],particle['y'],selfPlayer['x'],selfPlayer['y']);
            if(distance < 800){
              musicPlay('boom',BoomVolume*distance/800)
            }
          }
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
          for (var i = 0; i < 10; i++) {
            temp_mx = Math.sin(particle['x']+171.59*i) * particle['time']*0.12 + Math.random()*12;
            temp_my = Math.sin(particle['y']+171.59*i) * particle['time']*0.12 + Math.random()*12;
            ctx.drawImage(img, particle['x'] - selfPlayer['x'] + (Window_width/2)-8+temp_mx,particle['y'] - selfPlayer['y'] + (Window_height/2)-8+temp_my,16,16);
          }
          break;
        case 4:
          var img = document.getElementById('hudPlayer_blue');
          var tempB;
          if(particle['time']> 500){
            ctx.globalAlpha= (1-tempAlpha * (particle['time']-500)/500);
            var tempB = 1;
          }
          var tempB = Math.pow(particle['time']/500,0.5);
          for (var i = 0; i < 20; i++) {
            var tempx = (Math.sin(i))*tempB*150;
            var tempy = (Math.sin(i*1.4))*tempB*150;
            ctx.drawImage(img, particle['x'] - selfPlayer['x'] + (Window_width/2)+tempx,particle['y'] - selfPlayer['y'] + (Window_height/2)+tempy,16,16);
          }
          if(distanceCount(particle['x'],particle['y'],selfPlayer['x'],selfPlayer['y']) < 900)
            musicPlay('occupydown',HumanVolume);
          break;
        case 5:
          var img = document.getElementById('hudPlayer_pink');
          var tempB;
          if(particle['time']> 500){
            ctx.globalAlpha= (1-tempAlpha * (particle['time']-500)/500);
            var tempB = 1;
          }
          var tempB = Math.pow(particle['time']/500,0.5);
          for (var i = 0; i < 20; i++) {
            var tempx = (Math.sin(i))*tempB*150;
            var tempy = (Math.sin(i*1.4))*tempB*150;
            ctx.drawImage(img, particle['x'] - selfPlayer['x'] + (Window_width/2)+tempx,particle['y'] - selfPlayer['y'] + (Window_height/2)+tempy,16,16);
          }
          if(distanceCount(particle['x'],particle['y'],selfPlayer['x'],selfPlayer['y']) < 900){
            musicPlay('occupydown',HumanVolume);
          }
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

function musicPlay(music,volume) {
  var audio = document.getElementById(music);
  audio.currentTime = 0;
  audio.volume = volume*MainVolume;
  audio.play();
}
