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
var skillObject = {};
var skillindex = 0;
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
            speed : 12,
            online : 1,
            animation : 0
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

    socket.on("playerDataGet", (data) => {
      try {
        if(gamestat == 2){
          playerlist[socket.id].x = data.x;
          playerlist[socket.id].y = data.y;
          playerlist[socket.id].motion_x = data.motion_x;
          playerlist[socket.id].motion_y = data.motion_y;
          playerlist[socket.id].animation = data.animation;
          playerlist[socket.id].flip = data.flip;
        }
      } catch (e) {
        console.log('有些錯誤在playerDataGet階段發生了!詳細訊息:'+e);
      }
    });

    socket.on("send", (msg) => {
        if (Object.keys(msg).length < 2) return;
        commandTest(msg,socket.id);
    });

    socket.on("skillDataGet", (msg) => {
        skillObject[skillindex] = msg;
        skillindex += 1;
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

function colliderBoxCircle(x1,y1,lx1,ly1,x2,y2,r){
  if(Math.pow((x1+0.5*lx1)-x2,2)+Math.pow((y1+30+0.5*ly1)-y2,2) <= Math.pow((r+32),2)){
    return true;
  }else{
    return false
  }
}


function gameUpdate(){
  for (let [index, object] of Object.entries(skillObject)) {
    if(object['time'] < 500){
      //前進
      object['x'] += object['motion_x'];
      object['y'] += object['motion_y'];
      //碰撞運算
      for (let [id ,player] of Object.entries(playerlist)) {
        if(player['team'] != object['team']){
          if(colliderBoxCircle(player['x'],player['y'],64,128,object['x'],object['y'],20)){
            player['health'] -= 10;
            if(player['health'] <= 0){
              io.to(id).emit("die");
              player['health'] = 100;
            }
            delete skillObject[index];
          }
        }
      }
      object['time'] += 20;
    }else{
      delete skillObject[index];
    }
  }

  io.to("GameRoom").emit("skillDataGet", skillObject);
  io.to("GameRoom").emit("playerDataUpdata", playerlist);
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
  setInterval(gameUpdate,20);
  console.log('遊戲開始');
}

server.listen(3000, () => {
    console.log("Server Started. http://localhost:3000");
});
