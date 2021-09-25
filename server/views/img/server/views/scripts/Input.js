document.onkeydown=function(event){
  let e = event || window.event || arguments.callee.caller.arguments[0];
  if(e){
    switch (e.keyCode) {
      case 87:
        key_w = true;
        break;
      case 83:
        key_s = true;
        break;
      case 65:
        key_a = true;
        break;
      case 68:
        key_d = true;
        break;
      case 32:
        skill0Down();
        break;
      default:

    }
  }
};

document.onkeyup=function(event){
  let e = event || window.event || arguments.callee.caller.arguments[0];
  if(e){
    switch (e.keyCode) {
      case 87:
        key_w = false;
        break;
      case 83:
        key_s = false;
        break;
      case 65:
        key_a = false;
        break;
      case 68:
        key_d = false;
        break;
      default:
    }
  }
};

function skill0Down(){
  var skillspeed = 16.0;
  var motion_x = mouse_x-640;
  var motion_y = mouse_y-360;
  var temp = Math.sqrt(Math.pow(motion_x, 2) + Math.pow(motion_y, 2));
  motion_x = (skillspeed/temp)*motion_x;
  motion_y = (skillspeed/temp)*motion_y;

  var SkillObject = {
    id : id,
    name : selfPlayer['name'],
    x : selfPlayer['x'],
    y : selfPlayer['y'],
    motion_x :motion_x,
    motion_y :motion_y,
    team :selfPlayer['team'],
    skill :0,
    time :0
  }
  skillDataSend(SkillObject);
}

function gameMouseInput(){
  offset = $("#Game_Bg").offset();
  $('#Game_Bg').mousemove(function(e){
    mouse_x = e.pageX - offset.left;
    mouse_y = e.pageY - offset.top;
  });
}
