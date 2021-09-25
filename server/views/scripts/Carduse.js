function skillCardRand(){
  var temp_rand = Math.random()*100;
  for (var i = 0; i < 4; i++) {
    if(card[i] == 0 && i != cardchoose){
      break;
    }else if(i == 3){
      return 0;
    }
  }
  if(temp_rand < 40){
    return 0;
  }else if(temp_rand < 60){
    return 1;
  }else if(temp_rand < 80){
    return 2;
  }else{
    return 3;
  }
}

function cardDisplay(num) {
  switch (num) {
    case 0:
      return '<img src="views/img/skill/normal_attack.png" class="card-img-top" align="middle">';
      break;
    case 1:
      return '<img src="views/img/skill/'+race+'_skill1.png" class="card-img-top" align="middle">';
      break;
    case 2:
      return '<img src="views/img/skill/'+race+'_skill2.png" class="card-img-top" align="middle">';
      break;
    case 3:
      return '<img src="views/img/skill/'+race+'_skill3.png" class="card-img-top" align="middle">';
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
      if(mp >= 1){
        mp -= 1;
        skill0Down();
        cardDisplayChange();
      }
      break;
      case 1:
        if(race == 1)
          if(mp >= 2){
            mp -= 2;
            skill1_1Down();
            cardDisplayChange();
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
    time :0
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
