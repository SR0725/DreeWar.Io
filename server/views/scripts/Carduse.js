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
  var skillspeed = 16.0;
  var motion_x = mouse_x-(Window_width/2);
  console.log(mouse_x);
  var motion_y = mouse_y-(Window_height/2);
  console.log(mouse_y);
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
  particleDataSend({particle:0,time:1,maintime:500,x:selfPlayer.x,y:selfPlayer.y})
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
  particleDataSend({particle:11,time:1,maintime:500,x:selfPlayer.x,y:selfPlayer.y})
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
  particleDataSend({particle:0,time:1,maintime:500,x:selfPlayer.x,y:selfPlayer.y})
}
function building2Down(){
  var buildObject = {
    name : selfPlayer['name'],
    x : selfPlayer['x'],
    y : selfPlayer['y'],
    health :100,
    type :2,
    team :selfPlayer['team']
  }
  buildingDataSend(buildObject);
  particleDataSend({particle:0,time:1,maintime:500,x:selfPlayer.x,y:selfPlayer.y})
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
  particleDataSend({particle:0,time:1,maintime:500,x:selfPlayer.x,y:selfPlayer.y})
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
  particleDataSend({particle:0,time:1,maintime:500,x:selfPlayer.x,y:selfPlayer.y})
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
  particleDataSend({particle:0,time:1,maintime:500,x:selfPlayer.x,y:selfPlayer.y})
}
