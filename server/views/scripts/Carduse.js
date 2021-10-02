function skillCardRand(){
  for (var i = 0; i < 4; i++) {//判斷是否有普攻卡牌
    if(card[i] == 0 && i != cardchoose){
      break;
    }else if(i == 3){
      return 0;
    }
  }
  for (var i = 0; i < 4; i++) {//判斷是否有建築卡牌
    if(card[i] > 1000 && i != cardchoose){
      break;
    }else if(i == 3){
      return BuildingCard();
    }
  }
  var temp = 0;
  for (var i = 0; i < 4; i++) {//判斷建築卡牌是否大於2
    if(card[i] > 1000 && i != cardchoose){
      temp += 1;
    }
    if(temp > 2){
      return SkillCard();
    }
  }
  var temp_rand = Math.random()*100;
  if(temp_rand < 50){
    return SkillCard();
  }else{
    return BuildingCard();
  }

  function SkillCard(){
    var temp_rand = Math.random()*100;
    if(temp_rand < 40){
      return 0;
    }else if(temp_rand < 60){
      return race*10+1;
    }else if(temp_rand < 80){
      return race*10+2;
    }else{
      return race*10+3;
    }
  }

  function BuildingCard(){
    var temp_rand = Math.random()*100;
    if(temp_rand < 20){
      return 1001;
    }else if(temp_rand < 40){
      return 1002;
    }else if(temp_rand < 60){
      return 1003;
    }else if(temp_rand < 80){
      return 1004;
    }else{
      return 1005;
    }
  }
}

function cardDisplay(num) {
  switch (num) {
    case 0:
      return '<img src="views/img/skill/normal_attack.png" class="card-img-top" align="middle">';
      break;
    case 11:
      return '<img src="views/img/skill/'+race+'_skill1.png" class="card-img-top" align="middle">';
      break;
    case 12:
      return '<img src="views/img/skill/'+race+'_skill2.png" class="card-img-top" align="middle">';
      break;
    case 13:
      return '<img src="views/img/skill/'+race+'_skill3.png" class="card-img-top" align="middle">';
      break;
    case 1001:
      return '<img src="views/img/skill/b_beegen.png" class="card-img-top" align="middle">';
      break;
    case 1002:
      return '<img src="views/img/skill/b_wall.png" class="card-img-top" align="middle">';
      break;
    case 1003:
      return '<img src="views/img/skill/b_fort.png" class="card-img-top" align="middle">';
      break;
    case 1004:
      return '<img src="views/img/skill/b_flowergen.png" class="card-img-top" align="middle">';
      break;
    case 1005:
      return '<img src="views/img/skill/b_hptower.png" class="card-img-top" align="middle">';
      break;
    default:
  }
}

function skillCardInit(){
  for (var i = 0; i < 4; i++){
    card[i] = skillCardRand();
  }
  document.getElementById("card").innerHTML = '<div class="col-1"><div class="card bg-transparent magiccard border-0 card0" id="card0">'+cardDisplay(card[0])+'</div></div><div class="col-1"><div class="card bg-transparent magiccard border-0 card1" id="card1">'+cardDisplay(card[1])+'</div></div><div class="col-1"><div class="card bg-transparent magiccard border-0 card2" id="card2">'+cardDisplay(card[2])+'</div></div><div class="col-1"><div class="card bg-transparent magiccard border-0 card3" id="card3">'+cardDisplay(card[3])+'</div></div>';
  $('#card'+cardchoose).rotate({animateTo:15,duration: 200});
}

function skillCardUse(){
  if(respawnTime > 0) return;
  if(card[cardchoose] > 1000){
    if(buildingTest()){
      ActionBarShow('距離其他建築過近,無法建築!');
      return;
    }
  }
  switch (card[cardchoose]) {
    case 0:
      if(selfPlayer['mp'] >= 1){
        mpUse(1);
        skill0Down();
        var temp = card[cardchoose];
        cardDisplayChange();
        $("#cardUseAnimation").append('<img src="views/img/skill/normal_attack.png" class="card-img-top cardUse" align="middle" style="width: 8rem;">');
        setTimeout(function(){
          document.getElementById("cardUseAnimation").innerHTML = '';
        },1000);
      }else{
        ActionBarShow('花粉魔力不足!');
      }
      break;
    case 11:
      if(race == 1)
        if(selfPlayer['mp'] >= 2){
          mpUse(2);
          skill1_1Down();
          cardDisplayChange();
          $("#cardUseAnimation").append('<img src="views/img/skill/normal_attack.png" class="card-img-top cardUse" align="middle" style="width: 8rem;">');
          setTimeout(function(){
            document.getElementById("cardUseAnimation").innerHTML = '';
          },1000);
        }else{
          ActionBarShow('花粉魔力不足!');
        }
      break;
    case 12:
      if(selfPlayer['mp'] >= 3){
        mpUse(3);
        skill1_2Down();
        cardDisplayChange();
        $("#cardUseAnimation").append('<img src="views/img/skill/normal_attack.png" class="card-img-top cardUse" align="middle" style="width: 8rem;">');
        setTimeout(function(){
          document.getElementById("cardUseAnimation").innerHTML = '';
        },1000);
      }else{
        ActionBarShow('花粉魔力不足!');
      }
      break;
    case 13:
      if(selfPlayer['mp'] >= 4){
        mpUse(4);
        skill1_3Down();
        cardDisplayChange();
        $("#cardUseAnimation").append('<img src="views/img/skill/normal_attack.png" class="card-img-top cardUse" align="middle" style="width: 8rem;">');
        setTimeout(function(){
          document.getElementById("cardUseAnimation").innerHTML = '';
        },1000);
      }else{
        ActionBarShow('花粉魔力不足!');
      }
      break;
    case 1001:
      if(selfPlayer['bp'] >= 3){
        bpUse(3);
        building1Down();
        cardDisplayChange();
        $("#cardUseAnimation").append('<img src="views/img/skill/normal_attack.png" class="card-img-top cardUse" align="middle" style="width: 8rem;">');
        setTimeout(function(){
          document.getElementById("cardUseAnimation").innerHTML = '';
        },1000);
      }else{
        ActionBarShow('蜂蜜不足!');
      }
      break;
    case 1002:
      if(selfPlayer['bp'] >= 1){
        bpUse(1);
        building2Down();
        cardDisplayChange();
        $("#cardUseAnimation").append('<img src="views/img/skill/normal_attack.png" class="card-img-top cardUse" align="middle" style="width: 8rem;">');
        setTimeout(function(){
          document.getElementById("cardUseAnimation").innerHTML = '';
        },1000);
      }else{
        ActionBarShow('蜂蜜不足!');
      }
      break;
    case 1003:
      if(selfPlayer['bp'] >= 2){
        bpUse(2);
        building3Down();
        cardDisplayChange();
        $("#cardUseAnimation").append('<img src="views/img/skill/normal_attack.png" class="card-img-top cardUse" align="middle" style="width: 8rem;">');
        setTimeout(function(){
          document.getElementById("cardUseAnimation").innerHTML = '';
        },1000);
      }else{
        ActionBarShow('蜂蜜不足!');
      }
      break;
    case 1004:
      if(selfPlayer['bp'] >= 3){
        bpUse(3);
        building4Down();
        cardDisplayChange();
        $("#cardUseAnimation").append('<img src="views/img/skill/normal_attack.png" class="card-img-top cardUse" align="middle" style="width: 8rem;">');
        setTimeout(function(){
          document.getElementById("cardUseAnimation").innerHTML = '';
        },1000);
      }else{
        ActionBarShow('蜂蜜不足!');
      }
      break;
    case 1005:
      if(selfPlayer['bp'] >= 3){
        bpUse(3);
        building5Down();
        cardDisplayChange();
        $("#cardUseAnimation").append('<img src="views/img/skill/normal_attack.png" class="card-img-top cardUse" align="middle" style="width: 8rem;">');
        setTimeout(function(){
          document.getElementById("cardUseAnimation").innerHTML = '';
        },1000);
      }else{
        ActionBarShow('蜂蜜不足!');
      }
      break;
    default:
  }
}

function cardDisplayChange(){
  card[cardchoose] = skillCardRand();
  document.getElementById("card"+cardchoose.toString()).innerHTML = cardDisplay(card[cardchoose]);
}

function skill0Down(){
  var skillspeed = 32.0;
  var motion_x = mouse_x-(Window_width/2);
  var motion_y = mouse_y-(Window_height/2);
  var temp = Math.sqrt(Math.pow(motion_x, 2) + Math.pow(motion_y, 2));
  motion_x = (skillspeed/temp)*motion_x;
  motion_y = (skillspeed/temp)*motion_y;
  selfPlayer['animation'] = 2;
  selfPlayer['motion_x'] = 0;
  selfPlayer['motion_y'] = 0;
  animationMainTime = 0;
  var SkillObject = {
    id : id,
    name : selfPlayer['name'],
    x : selfPlayer['x']+30,
    y : selfPlayer['y']+70,
    motion_x :motion_x,
    motion_y :motion_y,
    team :selfPlayer['team'],
    skill :0,
    race :race,
    damage : selfPlayer['damage'],
    time :0,
    maintime:1000
  }
  skillDataSend(SkillObject);
}

function skill1_1Down(){

  selfPlayer['animation'] = 2;
  selfPlayer['motion_x'] = 0;
  selfPlayer['motion_y'] = 0;
  animationMainTime = 0;
  var effectObject = {
    id : id,//施加者id
    name : selfPlayer['name'],//施加者名稱
    team :selfPlayer['team'],//施加者隊伍
    x : selfPlayer['x']+30,//效果施放位置x
    y : selfPlayer['y']+70,//效果施放位置y
    effected :selfPlayer['team'],//施加隊伍 or 人
    distance:480,//(施放距離)
    type :1,//效果(1傷害加乘 2移動速度加乘)
    level :1.2,//強度
    time :0,//系統計時用
    maintime :5000,//維持時間(ms)
  }
  effectDataSend(effectObject);
  if(selfPlayer['team'] == 1) var temp = 2;
  else var temp = 1;
  var effectObject = {
    id : id,//施加者id
    name : selfPlayer['name'],//施加者名稱
    team :selfPlayer['team'],//施加者隊伍
    x : selfPlayer['x']+30,//效果施放位置x
    y : selfPlayer['y']+70,//效果施放位置y
    effected :temp,//施加隊伍 or 人
    distance:480,//(施放距離)
    type :2,//效果(1傷害加乘 2移動速度加乘)
    level :0.8,//強度
    time :0,//系統計時用
    maintime :5000,//維持時間(ms)
  }
  effectDataSend(effectObject);
}
function skill1_2Down(){
  var skillspeed = 12.0;
  var motion_x = mouse_x-(Window_width/2);
  var motion_y = mouse_y-(Window_height/2);
  var temp = Math.sqrt(Math.pow(motion_x, 2) + Math.pow(motion_y, 2));
  motion_x = (skillspeed/temp)*motion_x;
  motion_y = (skillspeed/temp)*motion_y;
  selfPlayer['animation'] = 2;
  selfPlayer['motion_x'] = 0;
  selfPlayer['motion_y'] = 0;
  animationMainTime = 0;
  var SkillObject = {
    id : id,
    name : selfPlayer['name'],
    x : selfPlayer['x']+30,
    y : selfPlayer['y']+70,
    motion_x :motion_x,
    motion_y :motion_y,
    team :selfPlayer['team'],
    skill :2,
    race :race,
    damage : 10,
    time :0,
    maintime:1000
  }
  skillDataSend(SkillObject);
}
function skill1_3Down(){
  selfPlayer['animation'] = 2;
  //尋找最近敵人
  var finded = false;
  var distance= 99999999;
  var playerNeast = 0;//後端ID
  var playerNeastID = id;//前端ID
  for (let [index,player] of Object.entries(playerlist_Now)) {
    if(player['id'] != id){
      if(Math.pow(player['x']-selfPlayer['x'],2)+Math.pow(player['y']-selfPlayer['y'],2) < distance && player['x'] > -100){
        playerNeast = index;
        playerNeastID = player['id'];
        distance = Math.pow(player['x']-selfPlayer['x'],2)+Math.pow(player['y']-selfPlayer['y'],2);
        finded = true;
      }
    }
  }
  if(finded == false){
    ActionBarShow('場上沒有任何存活的敵對玩家!');
    return;
  }
  //追蹤敵人
  Tracing = true;
  TracingObmx = 0.025*(playerlist_Now[playerNeast]['x']-selfPlayer['x']);
  TracingObmy = 0.025*(playerlist_Now[playerNeast]['y']-selfPlayer['y']);
  TracingOs = 0;
  //
  selfPlayer['motion_x'] = 0;
  selfPlayer['motion_y'] = 0;
  animationMainTime = 0;
  var effectObject = {
    id : id,//施加者id
    name : selfPlayer['name'],//施加者名稱
    team :selfPlayer['team'],//施加者隊伍
    x : playerlist[playerNeast]['x'],//效果施放位置x
    y : playerlist[playerNeast]['y'],//效果施放位置y
    effected :playerNeastID,//施加隊伍 or 人
    distance:100,//(施放距離)
    type :3,//效果(1傷害加乘 2移動速度加乘)
    level :30,//強度
    time :1,//系統計時用
    maintime :2,//維持時間(ms)
  }
  effectDataSend(effectObject);
  var effectObject = {
    id : id,//施加者id
    name : selfPlayer['name'],//施加者名稱
    team :selfPlayer['team'],//施加者隊伍
    x : selfPlayer['x']+30,//效果施放位置x
    y : selfPlayer['y']+70,//效果施放位置y
    effected :id,//施加隊伍 or 人
    distance:100,//(施放距離)
    type :1,//效果(1傷害加乘 2移動速度加乘)
    level :1.5,//強度
    time :0,//系統計時用
    maintime :2000,//維持時間(ms)
  }
  effectDataSend(effectObject);
  var effectObject = {
    id : id,//施加者id
    name : selfPlayer['name'],//施加者名稱
    team :selfPlayer['team'],//施加者隊伍
    x : selfPlayer['x']+30,//效果施放位置x
    y : selfPlayer['y']+70,//效果施放位置y
    effected :id,//施加隊伍 or 人
    distance:480,//(施放距離)
    type :2,//效果(1傷害加乘 2移動速度加乘)
    level :0.5,//強度
    time :0,//系統計時用
    maintime :2000,//維持時間(ms)
  }
  effectDataSend(effectObject);
}
function building1Down(){
  animationMainTime = 0;
  var buildObject = {
    name : selfPlayer['name'],
    x : selfPlayer['x']+32,
    y : selfPlayer['y']+64,
    health :20,
    type :1,
    team :selfPlayer['team']
  }
  buildingDataSend(buildObject);
}
function building2Down(){
  var buildObject = {
    name : selfPlayer['name'],
    x : selfPlayer['x']+32,
    y : selfPlayer['y']+64,
    health :100,
    type :2,
    team :selfPlayer['team']
  }
  buildingDataSend(buildObject);
}
function building3Down(){
  var buildObject = {
    name : selfPlayer['name'],
    x : selfPlayer['x']+32,
    y : selfPlayer['y']+64,
    health :50,
    type :3,
    team :selfPlayer['team']
  }
  buildingDataSend(buildObject);
}
function building4Down(){
  var buildObject = {
    name : selfPlayer['name'],
    x : selfPlayer['x']+32,
    y : selfPlayer['y']+64,
    health :20,
    type :4,
    team :selfPlayer['team']
  }
  buildingDataSend(buildObject);
}
function building5Down(){
  var buildObject = {
    name : selfPlayer['name'],
    x : selfPlayer['x']+32,
    y : selfPlayer['y']+64,
    health :50,
    type :5,
    team :selfPlayer['team']
  }
  buildingDataSend(buildObject);
}

function buildingTest() {
  for (let [index,build] of Object.entries(buildinglist)) {
    if(Math.pow(build['x']-55-selfPlayer['x'], 2) + Math.pow(build['y']-64-selfPlayer['y'], 2) < 15000){
      return true;
    }
  }
  return false;
}
