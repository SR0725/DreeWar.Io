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

  socket.on("die", function () {
    if(selfPlayer['team'] == 1){
      selfPlayer['x'] = 30;
      selfPlayer['y'] = 760;
    }else if(selfPlayer['team'] == 2){
      selfPlayer['x'] = 3987;
      selfPlayer['y'] = 760;
    }

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

/*遊戲個人資料傳輸*/
function playerDataSend(){
  socket.emit("playerDataGet",{x:selfPlayer['x'],y:selfPlayer['y'],motion_x:selfPlayer['motion_x'],motion_y:selfPlayer['motion_y'],animation:selfPlayer['animation'],flip:selfPlayer['flip'],mp:mp});
}
/*遊戲個人資料傳輸*/
function skillDataSend(SkillOb){
  socket.emit("skillDataGet",SkillOb);
}
/*遊戲個人資料傳輸*/
function effectDataSend(effectOb){
  socket.emit("effectDataGet",effectOb);
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
