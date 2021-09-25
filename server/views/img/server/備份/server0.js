const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

var gamestat = 0;         //遊戲狀態 0 尚未開始 1遊戲開始 2 遊戲結算等待重製
var onlineCount = 0;      //遊戲人數
var blueTeamCount = 0;    //藍隊人數
var redTeamCount = 0;     //紅隊人數
var gamestat = 1;
var playerlist = {};

var playerControllist = {};

app.get('/', (req, res) => {
    res.sendFile( __dirname + '/views/index.html');
});

app.get('/index.css', (req, res) => {
    res.sendFile( __dirname + '/views/index.css');
});

app.get('/MainLobby.js', (req, res) => {
    res.sendFile( __dirname + '/views/scripts/MainLobby.js');
});

app.get('/Terrain.js', (req, res) => {
    res.sendFile( __dirname + '/views/scripts/Terrain.js');
});

app.get('/Chat.js', (req, res) => {
    res.sendFile( __dirname + '/views/scripts/Chat.js');
});

app.get('/Input.js', (req, res) => {
    res.sendFile( __dirname + '/views/scripts/Input.js');
});

app.get('/Socket.js', (req, res) => {
    res.sendFile( __dirname + '/views/scripts/Socket.js');
});

app.get('/Game.js', (req, res) => {
    res.sendFile( __dirname + '/views/scripts/Game.js');
});

app.get('/views/img/:id', (req, res) => {
    res.sendFile( __dirname + '/views/img/'+req.params.id);
});

app.get('/views/img/Blue/:id', (req, res) => {
    res.sendFile( __dirname + '/views/img/Blue/'+req.params.id);
});

io.on('connection', (socket) => {
    console.log('有人連線了!SocketId:'+socket.id);
    // 有連線發生時增加人數

    socket.on("login", (logData) => {
      try {
        if(gamestat <= 1){
          onlineCount++;
          playerlist[socket.id] = {
            id : logData.id,
            name : logData.name,
            health : 100,
            team : 1,
            mp : 100,
            x : 0.0,
            y : 0.0,
            motion_x : 0.0,
            motion_y : 0.0,
            flip : false,
            speed : 5,
            online : 1,
            animation : 0
          };
          playerControllist[socket.id] = {
            key_w : false,
            key_s : false,
            key_a : false,
            key_d : false
          };

          if(blueTeamCount > redTeamCount){
            playerlist[socket.id]['team'] = 2;
            redTeamCount += 1;
          }else{
            playerlist[socket.id]['team'] = 1;
            blueTeamCount += 1;
          }

          console.log(playerlist[socket.id]['name']+'進入伺服器-SocketID:'+playerlist[socket.id]['id']);

          io.to(socket.id).emit("logToWaitingRoom");
          socket.join("GameRoom");
          io.to("GameRoom").emit("playerDataUpdata", playerlist);
        }else{
          io.to(socket.id).emit("canNotLog");
        }
      } catch (e) {
        console.log('有些錯誤在login階段發生了!詳細訊息:'+e);
      }
    });

    socket.on("blueTeamJoin", () => {
      if(playerlist[socket.id].team == 2){
        playerlist[socket.id].team = 1;
        io.to("GameRoom").emit("playerDataUpdata", playerlist);
        console.log(playerlist[socket.id]['name']+'換隊伍成為了藍隊-SocketID:'+playerlist[socket.id]['id']);
        blueTeamCount += 1;
        redTeamCount -= 1;
      }
    });

    socket.on("redTeamJoin", () => {
      if(playerlist[socket.id].team == 1){
        playerlist[socket.id].team = 2;
        io.to("GameRoom").emit("playerDataUpdata", playerlist);
        console.log(playerlist[socket.id]['name']+'換隊伍成為了紅色隊-SocketID:'+playerlist[socket.id]['id']);
        blueTeamCount -= 1;
        redTeamCount += 1;
      }
    });

    socket.on("controlGet", (controlData) => {
      try {
        if(gamestat == 2){
          playerControllist[socket.id].key_w = controlData.key_w;
          playerControllist[socket.id].key_s = controlData.key_s;
          playerControllist[socket.id].key_a = controlData.key_a;
          playerControllist[socket.id].key_d = controlData.key_d;
        }
      } catch (e) {
        console.log('有些錯誤在controlGet階段發生了!詳細訊息:'+e);
      }
    });

    socket.on("send", (msg) => {
        if (Object.keys(msg).length < 2) return;
        commandTest(msg,socket.id);
    });

    socket.on("socketLoad", (msg) => {
          socket.join("port"+msg.port);
    });

    socket.on('disconnect', () => {
      try {
        // 有人離線了
        if(playerlist[socket.id].online == 1){
          onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
        }
        io.to("GameRoom").emit("playerCount",onlineCount);
        if(playerlist[socket.id].team == 2) redTeamCount -= 1;
        if(playerlist[socket.id].team == 1) blueTeamCount -= 1;
        delete playerlist[socket.id];
        delete playerControllist[socket.id];
        io.emit("playerDataUpdata", playerlist);
      } catch (e) {
        console.log('有些錯誤在disconnect階段發生了!詳細訊息:'+e);
      }
    });
});

function gameUpdate(){
  for (let player of Object.entries(playerlist)) {
    //wsad移動計算動畫與動量
    if(playerControllist[player['0']]['key_s'] ==  true && playerControllist[player['0']]['key_w'] == false){
      if(player['1']['motion_y'] <= player['1']['speed']){
        player['1']['motion_y'] += 0.4;
        player['1']['animation'] = 1;
      }
    }else if(playerControllist[player['0']]['key_s'] == false && playerControllist[player['0']]['key_w'] == true){
      if((-1*player['1']['motion_y']) <= player['1']['speed']){
        player['1']['motion_y'] -= 0.4;
        player['1']['animation'] = 1;
      }
    }
    if(playerControllist[player['0']]['key_d'] == true && playerControllist[player['0']]['key_a'] == false){
      if((player['1']['motion_x']) <= player['1']['speed']){
        player['1']['motion_x'] += 0.4;
        player['1']['flip'] = false;
        player['1']['animation'] = 1;
      }
    }else if(playerControllist[player['0']]['key_d'] == false && playerControllist[player['0']]['key_a'] == true){
      if((-1*player['1']['motion_x']) <= player['1']['speed']){
        player['1']['motion_x'] -= 0.4;
        player['1']['flip'] = true;
        player['1']['animation'] = 1;
      }
    }
    //動畫
    if(playerControllist[player['0']]['key_w'] == false && playerControllist[player['0']]['key_s'] == false && playerControllist[player['0']]['key_a'] == false && playerControllist[player['0']]['key_d'] == false){
      player['1']['animation'] = 0;
    }
    //y軸停止與摩擦計算
    if(playerControllist[player['0']]['key_w'] == false && playerControllist[player['0']]['key_s'] == false){

      if(player['1']['motion_y'] != 0){//Y向停止
        player['1']['motion_y'] -= 0.4*player['1']['motion_y'];
        if(Math.abs(player['1']['motion_y']) < 0.1){
          player['1']['motion_y'] = 0.0;
        }
      }
    }
    //x軸停止與摩擦計算
    if(playerControllist[player['0']]['key_a'] == false && playerControllist[player['0']]['key_d'] == false){
      if(player['1']['motion_x'] != 0){//X向停止
        player['1']['motion_x'] -= 0.4*player['1']['motion_x'];
        if(Math.abs(player['1']['motion_x']) < 0.1){
          player['1']['motion_x'] = 0.0;
        }
      }
    }
    //座標物理計算
    player['1']['x'] += player['1']['motion_x'];
    player['1']['y'] += player['1']['motion_y'];
    //邊界設定
    if(player['1']['x'] > 4030) player['1']['x'] = 4030;
    if(player['1']['x'] < 0) player['1']['x'] = 0;
    if(player['1']['y'] > 1470) player['1']['y'] = 1470;
    if(player['1']['y'] < 0) player['1']['y'] = 0;
  }
  dataSend();
}

function dataSend(){
  var playerlength = Object.entries(playerlist).length;
  for(i = 0;i < playerlength;i ++){
    io.to("port"+(i+1).toString()).emit("playerDataGet", Object.entries(playerlist)[i]);
  }
}

function commandTest(msg,id){
  let command = msg['message'].split(" ");
  switch (command[0]) {
    case '/':
      switch (command[1]) {
        case 'gs':
          if(gamestat == 1){
            gameStart();
          }
          break;
        default:
          io.to(id).emit("msg", {message: '指令錯誤!',name: '世界之聲',});
      }
      break;
    default:
      io.emit("msg", msg);
  }
}

function gameStart(){
  io.to("GameRoom").emit("playerCount",onlineCount);
  io.to("GameRoom").emit("gameStart");
  gamestat = 2;
  setInterval(gameUpdate,1000);
  console.log('遊戲開始');
}

server.listen(3000, () => {
    console.log("Server Started. http://localhost:3000");
});
