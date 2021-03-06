const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

//世界樹
var occupyTime = 0; // -5 = blue 5 = red
var eoccupyTime = 0; // -5 = blue 5 = red
var foccupyTime = {}; // -5 = blue 5 = red
foccupyTime[1] = 0; // -5 = blue 5 = red
foccupyTime[2] = 0; // -5 = blue 5 = red
foccupyTime[3] = 0; // -5 = blue 5 = red
foccupyTime[4] = 0; // -5 = blue 5 = red
foccupyTime[5] = 0; // -5 = blue 5 = red
foccupyTime[6] = 0; // -5 = blue 5 = red
foccupyTime[7] = 0; // -5 = blue 5 = red
foccupyTime[8] = 0; // -5 = blue 5 = red
var spawnTowerList = {}; // -5 = blue 5 = red
spawnTowerList[0] = {x:129,y:1036,team:1};
spawnTowerList[1] = {x:129,y:636,team:1};
spawnTowerList[2] = {x:4019,y:1036,team:2};
spawnTowerList[3] = {x:4019,y:636,team:2};

var bluescore = 0;
var redscore = 0;

var gameUpdateFunction;
var gamestat = 1;         //遊戲狀態 0 尚未開始 1遊戲開始 2 遊戲結算等待重製
var onlineCount = 0;      //遊戲人數
var blueTeamCount = 0;    //藍隊人數
var redTeamCount = 0;     //紅隊人數
var playerlist = {};      //玩家列表與詳細資料
var kdalist = {};      //玩家擊殺死亡與助攻統計
var oplist = {};
var skillObject = {};     //技能物件列表與鄉系資料
var effectlist = {};      //效果列表與詳細資料
var buildinglist = {};      //建築列表與詳細資料
var skillindex = 0;       //系統紀錄SKILL列表長度用
var effectindex = 0;      //系統紀錄EFFECT列表長度用
var buildingindex = 0;      //系統紀錄building列表長度用
var gametick = 0;         //遊戲時刻(每20MS加一)
var gamestarting = false;
//MP AND BP GET
var beegen_count = {};
beegen_count[1] = 0;
beegen_count[2] = 0;
var bp1getTick = 0;
var bp2getTick = 0;

var flowergen_count = {};
flowergen_count[1] = 0;
flowergen_count[2] = 0;
var mp1getTick = 0;
var mp2getTick = 0;

//設定用參數
var password = 'dreamcity';

var gameStartingJoin = false;
var friendlyFire = false;

var mpBasicRegVal = 5;
var bpBasicRegVal = 15;
var bpBasicRegMul = 0.8;
var mpBasicRegMul = 0.8;
var winscore = 300;


io.on('connection', (socket) => {
    console.log('有人連線了!SocketId:'+socket.id);

    socket.on("login", (logData) => {
      try {
        oplist[socket.id] = false;
        onlineCount++;
        if(onlineCount >= 4 && gamestarting == false){
          gamestarting = true;
          io.emit("msg", {message: '遊戲將在10秒後開始!',name: '世界之聲',});
          setTimeout(function(){gameStart();},10000);
        }
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
          bp : 3,
          x : 0.0,
          y : 0.0,
          motion_x : 0.0,
          motion_y : 0.0,
          flip : false,
          speed : 6,
          damage:20,
          animation : 0
        };
        kdalist[socket.id] = {
          kill : 0,
          death : 0,
          support : 0
        };
        if(blueTeamCount > redTeamCount){
          playerlist[socket.id]['team'] = 2;
          redTeamCount += 1;
        }else{
          playerlist[socket.id]['team'] = 1;
          blueTeamCount += 1;
        }
        console.log(playerlist[socket.id]['name']+'進入伺服器-SocketID:'+playerlist[socket.id]['id']);
        if(gamestat <= 1){
          io.to(socket.id).emit("logToWaitingRoom");
          socket.join("GameRoom");
          io.to("GameRoom").emit("playerDataUpdata", playerlist);
        }else{
          if(gameStartingJoin){
            io.to(socket.id).emit("buildDataInt", buildinglist);
            io.to(socket.id).emit("playerDataUpdata", playerlist);
            setTimeout(function(){
              io.to(socket.id).emit("gameStart");
              io.to(socket.id).emit("kdaDataGet", kdalist);//更新KDA版
            },500);
            socket.join("GameRoom");
            io.to("GameRoom").emit("playerDataUpdata", playerlist);
          }else {
            io.to(socket.id).emit("canNotLog");
          }
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
        }
      } catch (e) {
      }
    });
    /*魔力使用*/
    socket.on("mpUse", (msg) => {
      try {
        playerlist[socket.id]['mp'] -= msg.mpuse;
      } catch (e) {

      }
    });
    /*蜂蜜使用*/
    socket.on("bpUse", (msg) => {
      try {
        playerlist[socket.id]['bp'] -= msg.bpuse;
      } catch (e) {

      }
    });
    /*獲取技能資料*/
    socket.on("skillDataGet", (msg) => {
      try {
        skillObject[skillindex] = msg;
        skillindex += 1;
      } catch (e) {

      }
    });
    /*獲取粒子效果資料*/
    socket.on("particleDataGet", (msg) => {
      try {
        io.to('GameRoom').emit("particleDataGet",msg);
      } catch (e) {

      }
    });
    /*獲取藥水資料*/
    socket.on("effectDataGet", (msg) => {
      try {
        effectlist[effectindex] = msg;
        effectindex += 1;
      } catch (e) {

      }
    });
    /*獲取表情資料*/
    socket.on("emotionDataGet", (msg) => {
      try {
        io.to('GameRoom').emit("emotionDataGet",msg,socket.id);
      } catch (e) {

      }
    });
    /*獲取建築資料*/
    socket.on("buildingDataGet", (msg) => {
      try {
        buildinglist[buildingindex] = msg;
        io.to('GameRoom').emit("buildDataGet",msg,buildingindex);
        if(msg.type == 1) beegen_count[msg.team] += 1;
        if(msg.type == 4) flowergen_count[msg.team] += 1;
        buildingindex += 1;
      } catch (e) {

      }
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
        delete kdalist[socket.id];
        io.emit("playerDataUpdata", playerlist);
      } catch (e) {
      }
    });
});

function colliderBoxCircle(x1,y1,lx1,ly1,x2,y2,r){
  return (Math.pow((x1+0.5*lx1)-x2,2)+Math.pow((y1+30+0.5*ly1)-y2,2) <= Math.pow((r+32),2))?true:false
}//碰撞測試,語法:(物件1的X座標,物件1的Y座標,物件1的X長度,物件1的Y長度,物件2的X座標,物件2的Y座標,物件2的半徑)

function dataDeal_Player(){
  for (let [id ,player] of Object.entries(playerlist)) {
    player['damage'] = 20;
    player['speed'] = 6;
    if(player['team'] == 1){
      if(mp1getTick > 10000*(Math.pow(0.9,flowergen_count[1]))){
        if(player['mp'] < 10){
          player['mp'] += 1;
        }
      }
      if(bp1getTick > 30000*(Math.pow(0.9,beegen_count[1]))){
        if(player['bp'] < 3){
          player['bp'] += 1;
        }
      }
    }else{
      if(mp2getTick > 10000*(Math.pow(0.9,flowergen_count[2]))){
        if(player['mp'] < 10){
          player['mp'] += 1;
        }
      }
      if(bp2getTick > 30000*(Math.pow(0.9,beegen_count[2]))){
        if(player['bp'] < 3){
          player['bp'] += 1;
        }
      }
    }
  }
}

function mp_bp_Get() {
  if(mp1getTick > mpBasicRegVal*1000*(Math.pow(mpBasicRegMul,flowergen_count[1]))){
    mp1getTick = 0;
    for (let [id ,player] of Object.entries(playerlist))
      if(player['team'] == 1 && player['mp'] < 10)
        player['mp'] += 1;
  }
  if(mp2getTick > mpBasicRegVal*1000*(Math.pow(mpBasicRegMul,flowergen_count[2]))){
    mp2getTick = 0;
    for (let [id ,player] of Object.entries(playerlist))
      if(player['team'] == 2 && player['mp'] < 10)
        player['mp'] += 1;
  }
  if(bp1getTick > bpBasicRegVal*1000*(Math.pow(bpBasicRegMul,beegen_count[1]))){
    bp1getTick = 0;
    for (let [id ,player] of Object.entries(playerlist))
      if(player['team'] == 1 && player['bp'] < 3)
        player['bp'] += 1;
  }
  if(bp2getTick > bpBasicRegVal*1000*(Math.pow(bpBasicRegMul,beegen_count[2]))){
    bp2getTick = 0;
    for (let [id ,player] of Object.entries(playerlist))
      if(player['team'] == 2 && player['bp'] < 3)
        player['bp'] += 1;
  }


  mp1getTick += 20;
  bp1getTick += 20;
  mp2getTick += 20;
  bp2getTick += 20;
}

function deathDeal(deathplayer,killer,deathMessage){
  var killerID = 'n';//找到殺手的後端ID
  for (let [id ,player] of Object.entries(playerlist)) {
    if(player['id'] == killer){
      killerID = id;
      break;
    }
  }
  if(killerID != 'n'){
    kdalist[killerID].kill += 1;
    switch (deathMessage) {
      case 0:
        io.to('GameRoom').emit("msg", {message: playerlist[deathplayer]['name']+'被'+playerlist[killerID]['name']+'的火焰貫穿了!',name: '世界之聲',});//告知所有人死者死亡
        break;
      case 1:
        io.to('GameRoom').emit("msg", {message: playerlist[deathplayer]['name']+'被'+playerlist[killerID]['name']+'招喚的地縫夾殺了!',name: '世界之聲',});//告知所有人死者死亡
        break;
      case 2:
        io.to('GameRoom').emit("msg", {message: playerlist[deathplayer]['name']+'被'+playerlist[killerID]['name']+'重創致死了!',name: '世界之聲',});//告知所有人死者死亡
        break;
      default:
    }
  }else{
    io.to('GameRoom').emit("msg", {message: playerlist[deathplayer]['name']+'在火焰升天!',name: '世界之聲',});//告知所有人死者死亡
  }
  kdalist[deathplayer].death += 1;//KDA加成
  io.to(deathplayer).emit("die");//告知死者死亡
  playerlist[deathplayer]['health'] = 100;//重製死者狀態
  io.to("GameRoom").emit("kdaDataGet", kdalist);//更新KDA版
}

function dataDeal_Skill() {
  for (let [index, object] of Object.entries(skillObject)) {
    if(object['time'] < object['maintime']){
      //前進
      object['x'] += object['motion_x'];
      object['y'] += object['motion_y'];
      switch (object['skill']) {
        case 0:
          //碰撞運算
          for (let [id ,player] of Object.entries(playerlist)) {
            if(friendlyFire == false){
              if(player['team'] != object['team']){
                if(colliderBoxCircle(player['x'],player['y'],64,128,object['x'],object['y'],30)){
                  player['health'] -= object['damage'];
                  io.to('GameRoom').emit("particleDataGet",{particle:1,time:1,maintime:300,x:object['x'],y:object['y']});
                  io.to(id).emit("hurt");
                  if(player['health'] <= 0){
                    deathDeal(id,object['id'],0);
                  }
                  delete skillObject[index];
                  break;
                }
              }
            }else{
              if(player['id'] != object['id']){
                if(colliderBoxCircle(player['x'],player['y'],64,128,object['x'],object['y'],30)){
                  player['health'] -= object['damage'];
                  io.to('GameRoom').emit("particleDataGet",{particle:1,time:1,maintime:300,x:object['x'],y:object['y']});
                  io.to(id).emit("hurt");
                  if(player['health'] <= 0){
                    deathDeal(id,object['id'],0);
                  }
                  delete skillObject[index];
                  break;
                }
              }
            }
          }
          for (let [bindex, build] of Object.entries(buildinglist)){
            if((build['type'] == 2 || build['type'] == 5) || ((build['type'] == 1 || build['type'] == 3  || build['type'] == 4) && build['team'] != object['team'])){
              if(Math.pow((build['x']-object['x']),2)+Math.pow((build['y']-object['y']),2)<4096){
                build['health'] -= object['damage'];
                io.to('GameRoom').emit("particleDataGet",{particle:1,time:1,maintime:300,x:object['x'],y:object['y']});
                io.to("GameRoom").emit("buildDataUpdata",build,bindex);
                delete skillObject[index];
                break;
              }
            }
          }
          break;
        case 2:
          if(object['race'] == 1){
            if(gametick % 5 == 1)
            io.to('GameRoom').emit("particleDataGet",{particle:3,time:1,maintime:500,x:object['x'],y:object['y']});
            //碰撞運算
            for (let [id ,player] of Object.entries(playerlist)) {
              if(friendlyFire == false){
                if(player['team'] != object['team']){
                  if(colliderBoxCircle(player['x'],player['y'],64,128,object['x'],object['y'],50)){
                    player['health'] -= object['damage'];
                    io.to('GameRoom').emit("particleDataGet",{particle:1,time:1,maintime:300,x:object['x'],y:object['y']});
                    io.to(id).emit("hurt");
                    effectlist[effectindex] = {
                      id : object['id'],//施加者id
                      name : object['name'],//施加者名稱
                      team :object['team'],//施加者隊伍
                      x : object['x']+30,//效果施放位置x
                      y : object['y']+70,//效果施放位置y
                      effected :player['id'],//施加隊伍 or 人
                      distance:100,//(施放距離)
                      type :2,//效果(1傷害加乘 2移動速度加乘)
                      level :0,//強度
                      time :0,//系統計時用
                      maintime :1500,//維持時間(ms)
                    };
                    effectindex += 1;
                    if(player['health'] <= 0){
                      deathDeal(id,object['id'],1);
                    }
                    delete skillObject[index];
                    break;
                  }
                }
              }else{
                if(player['id'] != object['id']){
                  if(colliderBoxCircle(player['x'],player['y'],64,128,object['x'],object['y'],50)){
                    player['health'] -= object['damage'];
                    io.to('GameRoom').emit("particleDataGet",{particle:1,time:1,maintime:300,x:object['x'],y:object['y']});
                    io.to(id).emit("hurt");
                    effectlist[effectindex] = {
                      id : object['id'],//施加者id
                      name : object['name'],//施加者名稱
                      team :object['team'],//施加者隊伍
                      x : object['x']+30,//效果施放位置x
                      y : object['y']+70,//效果施放位置y
                      effected :player['id'],//施加隊伍 or 人
                      distance:100,//(施放距離)
                      type :2,//效果(1傷害加乘 2移動速度加乘)
                      level :0,//強度
                      time :0,//系統計時用
                      maintime :1500,//維持時間(ms)
                    };
                    effectindex += 1;
                    if(player['health'] <= 0){
                      deathDeal(id,object['id'],1);
                    }
                    delete skillObject[index];
                    break;
                  }
                }
              }
            }
            for (let [bindex, build] of Object.entries(buildinglist)){
              if((build['type'] == 2 || build['type'] == 5) || ((build['type'] == 1 || build['type'] == 3  || build['type'] == 4) && build['team'] != object['team'])){
                if(Math.pow((build['x']-object['x']),2)+Math.pow((build['y']-object['y']),2)<4096){
                  build['health'] -= object['damage']*6;
                  io.to('GameRoom').emit("particleDataGet",{particle:1,time:1,maintime:300,x:object['x'],y:object['y']});
                  io.to("GameRoom").emit("buildDataUpdata",build,bindex);
                  delete skillObject[index];
                  break;
                }
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
}

function dataDeal_Effect() {
  for (let [index, object] of Object.entries(effectlist)) {
    if(object['time'] < object['maintime']){//維持時間計算
      for (let [id ,player] of Object.entries(playerlist)) {//效果施加
        if(player['team'] == object['effected'] || player['id'] == object['effected']){
          if(colliderBoxCircle(player['x'],player['y'],64,128,object['x'],object['y'],object['distance'])){
            switch (object['type']) {
              case 1:
                playerlist[id]['damage'] *= object['level'];
                if(object['time'] == 0) io.to(id).emit("effectDataGet", {effect:1,time:0,maintime:object['maintime']});
                break;
              case 2:
                playerlist[id]['speed'] *= object['level'];
                if(object['time'] == 0) io.to(id).emit("effectDataGet", {effect:2,time:0,maintime:object['maintime']});
                break;
              case 3:
                player['health'] -= object['level'];
                io.to(id).emit("hurt");
                if(player['health'] <= 0){
                  deathDeal(id,object['id'],2);
                }
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
}

function dataDeal_Building(){
  for (let [index, build] of Object.entries(buildinglist)) {
    if(build['health'] > 1){//是否存在
      switch (build['type']) {
        case 3:
          for (let [id ,player] of Object.entries(playerlist)) {
            if(player['team'] != build['team'] && gametick % 150 == 1){
              if(colliderBoxCircle(player['x'],player['y'],64,128,build['x'],build['y'],800)){
                shoot(build['x'],build['y'],player['x'],player['y'],build['team'],10);
              }
            }
          }
          break;
        case 5:
          for (let [id ,player] of Object.entries(playerlist)) {
            if(gametick % 100 == 1){
              if(colliderBoxCircle(player['x'],player['y'],64,128,build['x'],build['y'],400)){
                player['health'] += 1;
              }
            }
          }
          break;
      }
    }else{
      if(build['type'] == 1){
        beegen_count[build['team']] -= 1;
      }else if(build['type'] == 3){
        flowergen_count[build['team']] -= 1;
      }
      io.to("GameRoom").emit("buildDataDel",index);
      delete buildinglist[index];
    }
  }
}

function gameSystem() {
  //佔領
  for (let [id ,player] of Object.entries(playerlist)) {
    //世界樹
    if(player['x'] < 2291 && player['x'] > 1874 && player['y'] < 955 && player['y'] > 563){
      if(player['team'] == 1){
        occupyTime -= 1;
      }else{
        occupyTime += 1;
      }
    }
    //青蛙1
    else if(player['x'] < 1750 && player['x'] > 1450 && player['y'] < 400 && player['y'] > 281){
      if(player['team'] == 1){
        foccupyTime[1] -= 1;
      }else{
        foccupyTime[1] += 1;
      }
    }
    //青蛙2
    else if(player['x'] < 1750 && player['x'] > 1450 && player['y'] < 1260 && player['y'] > 1100){
      if(player['team'] == 1){
        foccupyTime[2] -= 1;
      }else{
        foccupyTime[2] += 1;
      }
    }
    //青蛙3
    else if(player['x'] < 2842 && player['x'] > 2500 && player['y'] < 400 && player['y'] > 281){
      if(player['team'] == 1){
        foccupyTime[3] -= 1;
      }else{
        foccupyTime[3] += 1;
      }
    }
    //青蛙4
    else if(player['x'] < 2842 && player['x'] > 2500 && player['y'] < 1260 && player['y'] > 1100){
      if(player['team'] == 1){
        foccupyTime[4] -= 1;
      }else{
        foccupyTime[4] += 1;
      }
    }
  }
  if(occupyTime < -5) occupyTime = -5;
  if(occupyTime > 5) occupyTime = 5;
  for (var i = 1; i <= 4; i++) {
    if(foccupyTime[i] > 3) foccupyTime[i] = 3;
    if(foccupyTime[i] < -3) foccupyTime[i] = -3;
  }
  //分數
  if(occupyTime == -5) bluescore += 1;
  if(occupyTime == 5) redscore += 1;
  //判斷勝負
  if(bluescore >= winscore){
    for (let [id ,player] of Object.entries(playerlist)) {
      if(player['team'] == 1)
        io.to(id).emit("winGame");
      else
        io.to(id).emit("loseGame");
    }
    gamestat = 3;
    setTimeout(function(){
      gameRestart();
    },15000);
  }else if(redscore >= winscore){
    for (let [id ,player] of Object.entries(playerlist)) {
      if(player['team'] == 2)
        io.to(id).emit("winGame");
      else
        io.to(id).emit("loseGame");
    }
    gamestat = 3;
    setTimeout(function(){
      gameRestart();
    },15000);
  }
  //佔領成功粒子特效
  for (var i = 1; i <= 4; i++) {
    var temp_x;
    var temp_y;

    switch (i) {
      case 1:
        temp_x = 1614;
        temp_y = 361;
        break;
      case 2:
        temp_x = 1614;
        temp_y = 1212;
        break;
      case 3:
        temp_x = 2692;
        temp_y = 361;
        break;
      case 4:
        temp_x = 2692;
        temp_y = 1212;
        break;
      default:

    }
    if(foccupyTime[i] == 3 && foccupyTime[i+4] != foccupyTime[i]){
      io.to('GameRoom').emit("particleDataGet",{particle:5,time:1,maintime:1000,x:temp_x,y:temp_y});
    }else if(foccupyTime[i] == -3 && foccupyTime[i+4] != foccupyTime[i]){
      io.to('GameRoom').emit("particleDataGet",{particle:4,time:1,maintime:1000,x:temp_x,y:temp_y});
    }
    foccupyTime[i+4] = foccupyTime[i];
  }
  if(occupyTime == 5 && occupyTime != eoccupyTime){
    io.to('GameRoom').emit("particleDataGet",{particle:5,time:1,maintime:1000,x:2130,y:696});
  }else if(occupyTime == -5 && occupyTime != eoccupyTime){
    io.to('GameRoom').emit("particleDataGet",{particle:4,time:1,maintime:1000,x:2130,y:696});
  }
  eoccupyTime = occupyTime;
  //青蛙攻擊
  if(occupyTime == -5){
    for (var i = 1; i <= 4; i++) {
      if(foccupyTime[i] == 3){
        switch (i) {
          case 1:
            for (var j = 0; j < 2; j++) shoot(1614,361,2130+(Math.random()-0.5)*400,796+(Math.random()-0.5)*400,2,5);
            break;
          case 2:
            for (var j = 0; j < 2; j++) shoot(1614,1212,2130+(Math.random()-0.5)*400,796+(Math.random()-0.5)*400,2,5);
            break;
          case 3:
            for (var j = 0; j < 2; j++) shoot(2692,361,2130+(Math.random()-0.5)*400,796+(Math.random()-0.5)*400,2,5);
            break;
          case 4:
            for (var j = 0; j < 2; j++) shoot(2692,1212,2130+(Math.random()-0.5)*400,796+(Math.random()-0.5)*400,2,5);
            break;
          default:

        }
      }
    }
  }else if(occupyTime == 5){
    for (var i = 1; i <= 4; i++) {
      if(foccupyTime[i] == -3){
        switch (i) {
          case 1:
            for (var j = 0; j < 2; j++) shoot(1614,361,2130+(Math.random()-0.5)*400,796+(Math.random()-0.5)*400,1,5);
            break;
          case 2:
            for (var j = 0; j < 2; j++) shoot(1614,1212,2130+(Math.random()-0.5)*400,796+(Math.random()-0.5)*400,1,5);
            break;
          case 3:
            for (var j = 0; j < 2; j++) shoot(2692,361,2130+(Math.random()-0.5)*400,796+(Math.random()-0.5)*400,1,5);
            break;
          case 4:
            for (var j = 0; j < 2; j++) shoot(2692,1212,2130+(Math.random()-0.5)*400,796+(Math.random()-0.5)*400,1,5);
            break;
          default:

        }
      }
    }
  }
  //重生塔攻擊spawnTowerList
  for (let [index ,build] of Object.entries(spawnTowerList)) {
    for (let [id ,player] of Object.entries(playerlist)) {
      if(player['team'] != build['team']){
        if(colliderBoxCircle(player['x'],player['y'],64,128,build['x'],build['y'],700)){
          shoot(build['x'],build['y'],player['x'],player['y'],build['team'],80);
        }
      }
    }
  }

  io.to('GameRoom').emit("gameDataGet",{bluescore:bluescore,redscore:redscore,occupyTime:occupyTime,foccupyTime:foccupyTime});
}

function gameUpdate(){
  //外掛防範與個玩家數據處理
  dataDeal_Player();
  mp_bp_Get();
  //技能彈
  dataDeal_Skill();
  //效果施加
  dataDeal_Effect();
  //建築效果施加
  dataDeal_Building();
  //遊戲核心系統
  if(gametick % 50 == 1 && gamestat != 3)
    gameSystem();
  gametick+=1;//遊戲刻增加
  skillObject['tick'] = gametick;//註上發送戳記以方便客戶端判斷資料完整性
  playerlist['tick'] = gametick;//遊戲刻增加
  io.to("GameRoom").emit("skillDataGet", skillObject);
  io.to("GameRoom").emit("playerDataUpdata", playerlist);
}//遊戲每20MS進行一次計算(50FPS)

function commandTest(msg,id){
  let command = msg['message'].substr(1,msg.length).split(" ");
  switch (msg['message'].substr(0,1)) {
    case '/'://指令前綴詞
      try {
        switch (command[0]) {///判斷第一個字
          case 'start':////遊戲開始
            if(oplist[id] == true){
              if(gamestat == 1)
                gameStart();
            }
            else{
              io.to(id).emit("msg", {message: '你的權限無法使用該指令!',name: '世界之聲'});
            }
            break;
          case 'gamerule':
            if(oplist[id] == true)
              switch (command[1]) {
              case 'gameStartingJoin':
                if(command[2] == 'true'){
                  gameStartingJoin = true;
                  io.emit("msg", {message: '世界規則已經修改,玩家能在遊戲開始後進入',name: '世界之聲',});
                }else if(command[2] == 'true'){
                  gameStartingJoin = false;
                  io.emit("msg", {message: '世界規則已經修改,玩家不能在遊戲開始後進入',name: '世界之聲',});
                }else{
                  gameStartingJoin ? io.emit("msg", {message: '世界規則目前設定,玩家能在遊戲開始後進入',name: '世界之聲',}):io.emit("msg", {message: '世界規則目前設定,玩家不能在遊戲開始後進入',name: '世界之聲',});
                }
                break;
              case 'friendlyFire':
                if(command[2] == 'true'){
                  friendlyFire = true;
                  io.emit("msg", {message: '世界規則已經修改,同隊傷害已開啟',name: '世界之聲',});
                }else if(command[2] == 'true'){
                  friendlyFire = false;
                  io.emit("msg", {message: '世界規則已經修改,同隊傷害已關閉',name: '世界之聲',});
                }else{
                  friendlyFire ? io.emit("msg", {message: '世界規則目前設定,同隊傷害已開啟',name: '世界之聲',}):io.emit("msg", {message: '世界規則目前設定,同隊傷害已關閉',name: '世界之聲',});
                }
                break;
              default:
                io.to(id).emit("msg", {message: '遊戲規則更改失敗，請檢察語法',name: '世界之聲',});
                break;
            }
            else
              io.to(id).emit("msg", {message: '你的權限無法使用該指令!',name: '世界之聲'});
            break;
          case 'login':
            if(command[1] == password){
              oplist[id] = true;
              io.to(id).emit("msg", {message: '你已成功獲得管理員權限!',name: '世界之聲'});
            }else{
              io.to(id).emit("msg", {message: '密碼錯誤!!',name: '世界之聲'});
            }
            break;
          case 'data':
            if(oplist[id] == true)
              if(command[1] == 'get'){
                if(command[2] == '@a')
                  if(command.length == 3)
                    io.to(id).emit("msg", {message: JSON.stringify(playerlist),name: '世界之聲'});
                  else{
                    for (let [id ,player] of Object.entries(playerlist))
                      io.to(id).emit("msg", {message: "id:"+id+":"+JSON.stringify(player[command[3]]),name: '世界之聲'});
                    }
                else
                  io.to(id).emit("msg", {message: "id:"+id+":"+JSON.stringify(playerlist[command[2]][command[3]]),name: '世界之聲'});
              }else if(command[1] == 'set'){
                if(command.length == 3){
                  io.to(id).emit("msg", {message: '更替數值路徑未輸入',name: '世界之聲'});
                }else if(command.length == 4){
                  io.to(id).emit("msg", {message: '數值未輸入',name: '世界之聲'});
                }else if(command[2] == '@a'){
                  for (let [id ,player] of Object.entries(playerlist)) {
                    player[command[3]] = command[4];
                  }
                  io.to(id).emit("msg", {message: '已完成所由玩家的數值更替',name: '世界之聲'});
                }else{
                  playerlist[command[2]][command[3]] = command[4];
                  io.to(id).emit("msg", {message: '已完成單個玩家的數值更替',name: '世界之聲'});
                }
                io.to("GameRoom").emit("playerDataUpdata", playerlist);
              }else{
                io.to(id).emit("msg", {message: '指令輸入不完全!',name: '世界之聲'});
              }
            else
              io.to(id).emit("msg", {message: '你的權限無法使用該指令!',name: '世界之聲'});
            break;
          case 'gameval':
            if(oplist[id] == true)
              if(command[1] == 'get'){
                switch (command[2]) {
                  case 'mpBasicRegVal':
                    io.to(id).emit("msg", {message:'mp獲得時間基礎值為'+mpBasicRegVal,name: '世界之聲'});
                    break;
                  case 'bpBasicRegVal':
                    io.to(id).emit("msg", {message:'bp獲得時間基礎值為'+bpBasicRegVal,name: '世界之聲'});
                    break;
                  case 'mpBasicRegMul':
                    io.to(id).emit("msg", {message:'bp獲得時間基礎值為'+mpBasicRegMul,name: '世界之聲'});
                    break;
                  case 'bpBasicRegMul':
                    io.to(id).emit("msg", {message:'bp獲得時間基礎值為'+bpBasicRegMul,name: '世界之聲'});
                    break;
                  case 'winScore':
                    io.to(id).emit("msg", {message:'勝利分數為'+winscore,name: '世界之聲'});
                    break;
                  default:
                    io.to(id).emit("msg", {message:'查無此世界參數',name: '世界之聲'});
                    break;
                }
              }else if(command[1] == 'set'){
                switch (command[2]) {
                  case 'mpBasicRegVal':
                    mpBasicRegVal = command[3];
                    io.to(id).emit("msg", {message:'mp獲得時間基礎值更改為'+mpBasicRegVal,name: '世界之聲'});
                    break;
                  case 'bpBasicRegVal':
                    bpBasicRegVal = command[3];
                    io.to(id).emit("msg", {message:'bp獲得時間基礎值更改為'+bpBasicRegVal,name: '世界之聲'});
                    break;
                  case 'mpBasicRegMul':
                    mpBasicRegMul = command[3];
                    io.to(id).emit("msg", {message:'花園生產倍率基數更改為'+mpBasicRegMul,name: '世界之聲'});
                    break;
                  case 'bpBasicRegMul':
                    bpBasicRegMul = command[3];
                    io.to(id).emit("msg", {message:'蜂之園生產倍率基數更改為'+bpBasicRegMul,name: '世界之聲'});
                    break;
                  case 'winScore':
                    winscore = command[3];
                    io.to(id).emit("msg", {message:'勝利分數為'+winscore,name: '世界之聲'});
                    break;
                  default:
                    io.to(id).emit("msg", {message:'查無此世界參數',name: '世界之聲'});
                    break;
                }
              }else{
                io.to(id).emit("msg", {message: '指令輸入不完全!',name: '世界之聲'});
              }
            else
              io.to(id).emit("msg", {message: '你的權限無法使用該指令!',name: '世界之聲'});
            break;
          case 'passwordchange':
            if(oplist[id] == true){
              password = command[1];
              io.to(id).emit("msg", {message: '密碼已更正成:'+command[1],name: '世界之聲'});
            }else{
              io.to(id).emit("msg", {message: '你的權限無法使用該指令!',name: '世界之聲'});
            }
            break;
          case 'restart':
            if(oplist[id] == true){
              gameRestart();
            }else{
              io.to(id).emit("msg", {message: '你的權限無法使用該指令!',name: '世界之聲'});
            }
            break;
          case 'oplist':
            io.to(id).emit("msg", {message: JSON.stringify(oplist),name: '世界之聲'});
          default:
            io.to(id).emit("msg", {message: '無此指令!',name: '世界之聲'});
            break;
        }
      } catch (e) {
        io.to(id).emit("msg", {message: '發生錯誤:'+e,name: '世界之聲'});
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

function shoot(bx,by,px,py,team,damage){
  var skillspeed = 32.0;
  var motion_x = px-bx;
  var motion_y = py-by+64;
  var temp = Math.sqrt(Math.pow(motion_x, 2) + Math.pow(motion_y, 2));
  motion_x = (skillspeed/temp)*motion_x;
  motion_y = (skillspeed/temp)*motion_y;
  var SkillObject = {
    id : 'bigAnt',
    name : '砲塔',
    x : bx,
    y : by,
    motion_x :motion_x,
    motion_y :motion_y,
    team :team,
    skill :0,
    race :0,
    damage : damage,
    time :0,
    maintime:1000
  }
  skillObject[skillindex] = SkillObject;
  skillindex += 1;
}

function gameStart(){
  gamestarting = true;
  io.to("GameRoom").emit("playerCount",onlineCount);
  io.to("GameRoom").emit("gameStart");
  io.to("GameRoom").emit("kdaDataGet", kdalist);//更新KDA版
  gamestat = 2;
  gameUpdateFunction = setInterval(gameUpdate,20);
  console.log('遊戲開始');
}//遊戲開始

function gameRestart(){
  io.to('GameRoom').emit("msg", {message: '世界將在1秒後重置!',name: '世界之聲',});
  clearInterval(gameUpdateFunction);
  //世界樹
  gamestarting = false;
  occupyTime = 0; // -5 = blue 5 = red
  eoccupyTime = 0; // -5 = blue 5 = red
  foccupyTime = {}; // -5 = blue 5 = red
  foccupyTime[1] = 0; // -5 = blue 5 = red
  foccupyTime[2] = 0; // -5 = blue 5 = red
  foccupyTime[3] = 0; // -5 = blue 5 = red
  foccupyTime[4] = 0; // -5 = blue 5 = red
  foccupyTime[5] = 0; // -5 = blue 5 = red
  foccupyTime[6] = 0; // -5 = blue 5 = red
  foccupyTime[7] = 0; // -5 = blue 5 = red
  foccupyTime[8] = 0; // -5 = blue 5 = red
  spawnTowerList = {}; // -5 = blue 5 = red

  bluescore = 0;
  redscore = 0;

  gamestat = 1;         //遊戲狀態 0 尚未開始 1遊戲開始 2 遊戲結算等待重製
  onlineCount = 0;      //遊戲人數
  blueTeamCount = 0;    //藍隊人數
  redTeamCount = 0;     //紅隊人數
  playerlist = {};      //玩家列表與詳細資料
  kdalist = {};      //玩家擊殺死亡與助攻統計
  oplist = {};
  skillObject = {};     //技能物件列表與鄉系資料
  effectlist = {};      //效果列表與詳細資料
  buildinglist = {};      //建築列表與詳細資料
  skillindex = 0;       //系統紀錄SKILL列表長度用
  effectindex = 0;      //系統紀錄EFFECT列表長度用
  buildingindex = 0;      //系統紀錄building列表長度用
  gametick = 0;         //遊戲時刻(每20MS加一)

  //MP AND BP GET
  beegen_count = {};
  beegen_count[1] = 0;
  beegen_count[2] = 0;
  bp1getTick = 0;
  bp2getTick = 0;

  flowergen_count = {};
  flowergen_count[1] = 0;
  flowergen_count[2] = 0;
  mp1getTick = 0;
  mp2getTick = 0;

  setTimeout(function(){
    io.emit("restartGame");
  },1000);
}

app.get('/', (req, res) => {
    res.sendFile( __dirname + '/views/index.html');
});
app.get('/index.css', (req, res) => {
    res.sendFile( __dirname + '/views/index.css');
});
app.get('/scripts/:id', (req, res) => {
    res.sendFile( __dirname + '/views/scripts/'+req.params.id);
});
app.get('/scripts/jquery-ui/:id', (req, res) => {
    res.sendFile( __dirname + '/views/scripts/jquery-ui/'+req.params.id);
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
app.get('/views/img/particle/:id', (req, res) => {
    res.sendFile( __dirname + '/views/img/particle/'+req.params.id);
});
app.get('/views/img/build/:id', (req, res) => {
    res.sendFile( __dirname + '/views/img/build/'+req.params.id);
});
app.get('/views/img/UI/:id', (req, res) => {
    res.sendFile( __dirname + '/views/img/UI/'+req.params.id);
});
app.get('/views/img/emotion/:id', (req, res) => {
    res.sendFile( __dirname + '/views/img/emotion/'+req.params.id);
});
app.get('/views/audio/button/:id', (req, res) => {
    res.sendFile( __dirname + '/views/audio/button/'+req.params.id);
});
app.get('/views/audio/game/:id', (req, res) => {
    res.sendFile( __dirname + '/views/audio/game/'+req.params.id);
});
server.listen(3000, () => {
    console.log("Server Started. http://localhost:3000");
});
