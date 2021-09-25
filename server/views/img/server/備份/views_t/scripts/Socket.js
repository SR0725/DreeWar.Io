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
    //四個閥口開啟
    for(var i = 1;i <= 16;i++){
      socket_p[i] = io();
    }

    for(var i = 1;i <= PlayerCount;i++){
      socket_p[i].emit("socketLoad",{id:id,port:i});
    }

    socket_p[1].on("playerDataGet", function (d) {
      console.log(Delaytime[1]);
      Delaytime[1] = 0;
      playerlist[1] = d;
    });

    socket_p[2].on("playerDataGet", function (d) {
      Delaytime[2] = 0;
      playerlist[2] = d;
    });

    socket_p[3].on("playerDataGet", function (d) {
      Delaytime[3] = 0;
      playerlist[3] = d;
    });

    socket_p[4].on("playerDataGet", function (d) {
      Delaytime[4] = 0;
      playerlist[4] = d;
    });

    socket_p[5].on("playerDataGet", function (d) {
      Delaytime[5] = 0;
      playerlist[5] = d;
    });

    socket_p[6].on("playerDataGet", function (d) {
      Delaytime[6] = 0;
      playerlist[6] = d;
    });

    socket_p[7].on("playerDataGet", function (d) {
      Delaytime[7] = 0;
      playerlist[7] = d;
    });

    socket_p[8].on("playerDataGet", function (d) {
      Delaytime[8] = 0;
      playerlist[8] = d;
    });

    socket_p[9].on("playerDataGet", function (d) {
      Delaytime[9] = 0;
      playerlist[9] = d;
    });

    socket_p[10].on("playerDataGet", function (d) {
      Delaytime[10] = 0;
      playerlist[10] = d;
    });

    socket_p[11].on("playerDataGet", function (d) {
      Delaytime[11] = 0;
      playerlist[11] = d;
    });

    socket_p[12].on("playerDataGet", function (d) {
      Delaytime[12] = 0;
      playerlist[12] = d;
    });

    gameStart();
  });

  socket.on("playerCount", function (amount) {
    PlayerCount = amount;
  });

  socket.on("disconnect", function () {
    msgBox.append('<div><span class="user_name" style="color:#00BB00">世界之聲</span> : <span class="user_message" style="color:#eeeeee">與伺服器離線!</span></div>'); //notify user
    msgBox[0].scrollTop = msgBox[0].scrollHeight;
  });

  socket.on("playerDataUpdata", function (d) {
    playerlist[0] = d;
    if(gamestat == 1){
      blueTeamPlayerDisplayer();
      redTeamPlayerDisplayer();
    }
  });


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
function controlSend(){
  socket.emit("controlGet",{key_w:key_w,key_s:key_s,key_a:key_a,key_d:key_d});
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
