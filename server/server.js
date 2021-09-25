const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

var gamestat = 1;         //遊戲狀態 0 尚未開始 1遊戲開始 2 遊戲結算等待重製
var onlineCount = 0;      //遊戲人數
var blueTeamCount = 0;    //藍隊人數
var redTeamCount = 0;     //紅隊人數
var playerlist = {};      //玩家列表與詳細資料
var skillObject = {};     //技能物件列表與鄉系資料
var effectlist = {};      //效果列表與詳細資料
var skillindex = 0;       //系統紀錄SKILL列表長度用
var effectindex = 0;      //系統紀錄EFFECT列表長度用
var gametick = 0;         //遊戲時刻(每20MS加一)

io.on('connection', (socket) => {
    console.log('有人連線了!SocketId:'+socket.id);

    socket.on("login", (logData) => {
      try {
        if(gamestat <= 1){
          onlineCount++;
          logData['name'] = logData['name'].replace(/</g, "&lt;");
          logData['name'] = logData['name'].replace(/>/g, "&gt;");
          logData['name'] = logData['name'].replace(/"/g, "&quot;");
          logData['name'] = logData['name'].replace(/'/g, "&#x27;");
          playerlist[socket.id] = {
            id : logData.id,
            name : logData.name,
            health : 100,
            team : 1,
            mp : 10,
            x : 0.0,
            y : 0.0,
            motion_x : 0.0,
            motion_y : 0.0,
            flip : false,
            speed : 12,
            online : 1,
            damage:20,
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
    /*遊戲開始前 加入紅藍隊伍*/
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
    /*獲取玩家資料*/
    socket.on("playerDataGet", (data) => {
      try {
        if(gamestat == 2){
          playerlist[socket.id].x = data.x;
          playerlist[socket.id].y = data.y;
          playerlist[socket.id].motion_x = data.motion_x;
          playerlist[socket.id].motion_y = data.motion_y;
          playerlist[socket.id].animation = data.animation;
          playerlist[socket.id].flip = data.flip;
          playerlist[socket.id].mp = data.mp;
        }
      } catch (e) {
        console.log('有些錯誤在playerDataGet階段發生了!詳細訊息:'+e);
      }
    });
    /*獲取技能資料*/
    socket.on("skillDataGet", (msg) => {
        skillObject[skillindex] = msg;
        skillindex += 1;
    });
    /*獲取藥水資料*/
    socket.on("effectDataGet", (msg) => {
        effectlist[effectindex] = msg;
        effectindex += 1;
    });
    /*獲取玩家聊天文字資料*/
    socket.on("send", (msg) => {
        if (Object.keys(msg).length < 2) return;
        commandTest(msg,socket.id);
    });
    /*獲取剛離線玩家資料*/
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
  return (Math.pow((x1+0.5*lx1)-x2,2)+Math.pow((y1+30+0.5*ly1)-y2,2) <= Math.pow((r+32),2))?true:false
}//碰撞測試,語法:(物件1的X座標,物件1的Y座標,物件1的X長度,物件1的Y長度,物件2的X座標,物件2的Y座標,物件2的半徑)

function gameUpdate(){
  //技能彈
  for (let [index, object] of Object.entries(skillObject)) {
    if(object['time'] < 500){
      //前進
      object['x'] += object['motion_x'];
      object['y'] += object['motion_y'];

      switch (object['skill']) {
        case 0:
          //碰撞運算
          for (let [id ,player] of Object.entries(playerlist)) {
            if(player['team'] != object['team']){
              if(colliderBoxCircle(player['x'],player['y'],64,128,object['x'],object['y'],20)){
                player['health'] -= object['damage'];
                io.to(id).emit("hurt");
                if(player['health'] <= 0){
                  io.to(id).emit("die");
                  player['health'] = 100;
                }
                delete skillObject[index];
              }
            }
          }
          break;
        default:
          break;
      }
      object['time'] += 20;
    }else{
      delete skillObject[index];
    }
  }
  //效果施加
  for (let [index, object] of Object.entries(effectlist)) {
    if(object['time'] < object['maintime']){//維持時間計算
      for (let [id ,player] of Object.entries(playerlist)) {//效果施加
        if(player['team'] == object['effected'] || player['id'] == object['effected']){
          if(colliderBoxCircle(player['x'],player['y'],64,128,object['x'],object['y'],object['distance'])){
            player['damage'] = 20;
            player['speed'] = 12;
            switch (object['type']) {
              case 1:
                playerlist[id]['damage'] *= object['level'];
                if(object['time'] == 0) io.to(id).emit("effectDataGet", {effect:1,time:0,maintime:object['maintime']});
                break;
              case 2:
                playerlist[id]['speed'] *= object['level'];
                if(object['time'] == 0) io.to(id).emit("effectDataGet", {effect:2,time:0,maintime:object['maintime']});
                break;
              default:
            }
          }
        }
      }
      object['time'] += 20;
    }else{
      delete effectlist[index];
    }
  }
  gametick+=1;//遊戲刻增加
  skillObject['tick'] = gametick;//註上發送戳記以方便客戶端判斷資料完整性
  playerlist['tick'] = gametick;//遊戲刻增加
  io.to("GameRoom").emit("skillDataGet", skillObject);
  io.to("GameRoom").emit("playerDataUpdata", playerlist);
}//遊戲每20MS進行一次計算(50FPS)

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
      //XSS防禦
      msg['message'] = msg['message'].replace(/</g, "&lt;");
      msg['message'] = msg['message'].replace(/>/g, "&gt;");
      msg['message'] = msg['message'].replace(/"/g, "&quot;");
      msg['message'] = msg['message'].replace(/'/g, "&#x27;");
      io.emit("msg", msg);
      break;
  }
}//偵測客戶端的訊息是否為遊戲指令

function gameStart(){
  io.to("GameRoom").emit("playerCount",onlineCount);
  io.to("GameRoom").emit("gameStart");
  gamestat = 2;
  setInterval(gameUpdate,20);
  console.log('遊戲開始');
}//遊戲開始

app.get('/', (req, res) => {
    res.sendFile( __dirname + '/views/index.html');
});
app.get('/index.css', (req, res) => {
    res.sendFile( __dirname + '/views/index.css');
});
app.get('/scripts/:id', (req, res) => {
    res.sendFile( __dirname + '/views/scripts/'+req.params.id);
});
app.get('/views/img/:id', (req, res) => {
    res.sendFile( __dirname + '/views/img/'+req.params.id);
});
app.get('/views/img/Blue/:id', (req, res) => {
    res.sendFile( __dirname + '/views/img/Blue/'+req.params.id);
});
app.get('/views/img/Pink/:id', (req, res) => {
    res.sendFile( __dirname + '/views/img/Pink/'+req.params.id);
});
app.get('/views/img/skill/:id', (req, res) => {
    res.sendFile( __dirname + '/views/img/skill/'+req.params.id);
});
app.get('/views/img/effect/:id', (req, res) => {
    res.sendFile( __dirname + '/views/img/effect/'+req.params.id);
});

server.listen(3000, () => {
    console.log("Server Started. http://localhost:3000");
});