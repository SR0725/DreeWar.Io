document.addEventListener("DOMContentLoaded", () => {

  socket.on("connect", function () {
    let message_input = $('#name_message'); //user message text
    msgBox.append('<div><span class="user_name" style="color:#00BB00">世界之聲</span> : <span class="user_message" style="color:#eeeeee">登入遊戲!</span></div>'); //notify user
    msgBox[0].scrollTop = msgBox[0].scrollHeight;
  });

  socket.on("canNotLog", function () {
    msgBox.append('<div><span class="user_name" style="color:#00BB00">世界之聲</span> : <span class="user_message" style="color:#eeeeee">遊戲已經開始了!無法登入遊戲!</span></div>'); //notify user
  });

  socket.on("logToWaitingRoom", function () {
    document.getElementById("MainSence").innerHTML = '<div style="width:1200px;height:700px;background-color:#121212;"><div class="container"><div class="row"><div class="col-4" id="blueTeamPlayer"><h2><span class="badge bg-primary">藍隊玩家</span></h2></div><div class="col-2"></div><div class="col-4" id="redTeamPlayer"><h2><span class="badge bg-danger">紅隊玩家</span></h2></div></div></div></div>';
    gamestat = 1;
  });

  socket.on("gameStart", function () {
    gameStart();
  });

  socket.on("disconnect", function () {
    msgBox.append('<div><span class="user_name" style="color:#00BB00">世界之聲</span> : <span class="user_message" style="color:#eeeeee">與伺服器離線!</span></div>'); //notify user
    msgBox[0].scrollTop = msgBox[0].scrollHeight;
  });

  socket.on("playerDataUpdata", function (d) {
    playerlist = d;

    if(gamestat == 1){
      blueTeamPlayerDisplayer();
      redTeamPlayerDisplayer();
    }
  });

  socket.on("skillDataGet", function (d) {
    skillObjectlist = d;
  });

  socket.on("die", function () {
    if(selfPlayer['team'] == 1){
      selfPlayer['x'] = 30;
      selfPlayer['y'] = 760;
    }else if(selfPlayer['team'] == 2){
      selfPlayer['x'] = 3987;
      selfPlayer['y'] = 760;
    }

  });

  /*
  socket.on("online", function (amount) {
    online.innerText = amount;
  });
  */

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
function playerDataSend(){
  socket.emit("playerDataGet",{x:selfPlayer['x'],y:selfPlayer['y'],motion_x:selfPlayer['motion_x'],motion_y:selfPlayer['motion_y'],animation:selfPlayer['animation'],flip:selfPlayer['flip']});
}

function skillDataSend(SkillOb){
  socket.emit("skillDataGet",SkillOb);
}

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
