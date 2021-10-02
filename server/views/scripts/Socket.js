document.addEventListener("DOMContentLoaded", () => {

  socket.on("connect", function () {
    let message_input = $('#name_message'); //user message text
    msgBox.append('<div><span class="user_name" style="color:#00BB00">世界之聲</span> : <span class="user_message" style="color:#eeeeee">登入遊戲!</span></div>'); //notify user
    msgBox[0].scrollTop = msgBox[0].scrollHeight;
  });//與伺服器取得連線

  socket.on("canNotLog", function () {
    msgBox.append('<div><span class="user_name" style="color:#00BB00">世界之聲</span> : <span class="user_message" style="color:#eeeeee">遊戲已經開始了!無法登入遊戲!</span></div>'); //notify user
  });//遊戲開始後加入的阻擋

  socket.on("logToWaitingRoom", function () {
    document.getElementById("MainSence").innerHTML = '<div style="position:relative;bottom:'+window.innerHeight*0.2+'px;background-color:#121212;"><div class="container"><div class="row"><div class="col-4" id="blueTeamPlayer"><h2><span class="badge bg-primary">藍隊玩家</span></h2></div><div class="col-2"></div><div class="col-4" id="redTeamPlayer"><h2><span class="badge bg-danger">紅隊玩家</span></h2></div></div></div></div>';
    gamestat = 1;
  });//加入等待大廳

  socket.on("gameStart", function () {
    gameStart();
  });//接受遊戲開始的資訊

  socket.on("disconnect", function () {
    msgBox.append('<div><span class="user_name" style="color:#00BB00">世界之聲</span> : <span class="user_message" style="color:#eeeeee">與伺服器離線!</span></div>'); //notify user
    msgBox[0].scrollTop = msgBox[0].scrollHeight;
  });//失去連線

  socket.on("playerDataUpdata", function (d) {
    playerlist_buffer = d;
    if(gamestat == 1){
      playerlist = d;
      blueTeamPlayerDisplayer();
      redTeamPlayerDisplayer();
    }
  })//獲取玩家資料;

  socket.on("skillDataGet", function (d) {
    skillObjectlist_buffer = d;
  });//獲取技能資料

  socket.on("effectDataGet", function (d) {
    effectlist[Date.now()] = d;
  });//獲取效果資料

  socket.on("particleDataGet", function (d) {
    particlelist[Date.now()] = d;
  });//獲取效果資料

  socket.on("buildDataGet", function (d,index) {
    buildinglist[index] = d;
    if(d['type'] == 2 || d['type'] == 5)
      obstx.drawImage(obsSum, d['x']-100, d['y']-174,111,128);
  });//獲取建築資料
  socket.on("buildDataInt", function (d) {
    buildinglist = d;
    setTimeout(function(){
      for (let [index,build] of Object.entries(buildinglist)){
        if(build['type'] == 2 || build['type'] == 5){
          obstx.drawImage(obsSum, build['x']-100, build['y']-174,111,128);
        }
      }
    },2000);
  });//獲取建築資料
  socket.on("buildDataUpdata", function (d,index) {
    buildinglist[index] = d;
  });//更新建築資料
  socket.on("buildDataDel", function (index) {
    if(buildinglist[index]['type'] == 2 || buildinglist[index]['type'] == 5)
      obstx.drawImage(obsDel, buildinglist[index]['x']-100, buildinglist[index]['y']-174,111,128);
    particleDataSend({particle:2,time:1,maintime:1000,x:buildinglist[index]['x'],y:buildinglist[index]['y']});
    delete buildinglist[index];
  });//更新建築資料

  socket.on("die", function () {
    selfPlayer['x'] = -3000;
    selfPlayer['y'] = 0;
    respawnTime = 500;
    ActionBarShow('你死掉了!請等待十秒復活!');
  });//死去

  socket.on("hurt", function () {
    hurtAnimationTime = 10;

  });//受傷

  //收訊息---------------------------------
  socket.on("msg", function (d) {
    msgBox.append('<div><span class="user_name" style="color:#00BB00">'+d.name+'</span> : <span class="user_message" style="color:#eeeeee">'+d.message+'</span></div>'); //notify user
    msgBox[0].scrollTop = msgBox[0].scrollHeight;
  });
});

//傳訊息----------------------------------
$( "#message" ).on( "keydown", function( event ) {
  if(event.which==13){
    send_message();
  }
});
function send_message(){
  let message_input = $('#message'); //user message text

  if(message_input.val() == ""){ //emtpy message?
    alert("Enter Some message Please!");
    return;
  }

  //prepare json data
  let msg = {
    message: message_input.val(),
    name: selfPlayer.name,
  };
  //convert and send data to server
  socket.emit("send", msg);
  message_input.val(''); //reset message input
}

//mpUse
function mpUse(mp){
  socket.emit("mpUse",{mpuse:mp});
}
//bpUse
function bpUse(bp){
  socket.emit("bpUse",{bpuse:bp});
}

/*遊戲個人資料傳輸*/
function playerDataSend(){
  socket.emit("playerDataGet",{x:selfPlayer['x'],y:selfPlayer['y'],motion_x:selfPlayer['motion_x'],motion_y:selfPlayer['motion_y'],animation:selfPlayer['animation'],flip:selfPlayer['flip'],mp:selfPlayer['mp']});
}
/*遊戲資料資料傳輸*/
function skillDataSend(SkillOb){
  socket.emit("skillDataGet",SkillOb);
}
/*遊戲效果資料傳輸*/
function effectDataSend(effectOb){
  socket.emit("effectDataGet",effectOb);
}
/*遊戲粒子資料傳輸*/
function particleDataSend(particleOb){
  socket.emit("particleDataGet",particleOb);
}
/*遊戲建築資料傳輸*/
function buildingDataSend(buildOb){
  socket.emit("buildingDataGet",buildOb);
}

/*遊戲開始前*/
function logging(){
  let name_input = $('#name_message');
  selfPlayer.name = name_input.val();
  if(selfPlayer.name == ''){
    selfPlayer.name = '匿名';
  }
  socket.emit("login",{id:id,name:selfPlayer.name});
}

function joinRed() {
  socket.emit("redTeamJoin");
}

function joinBlue() {
  socket.emit("blueTeamJoin");
}
