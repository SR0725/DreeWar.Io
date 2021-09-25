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
        if(gamestat == 2)
          skillCardUse();
        break;
      case 81:
        if(gamestat == 2){
          cardchoose -= 1;
          if(cardchoose < 0) cardchoose = 3;
          for (var i = 0; i < 4; i++) $('#card'+i.toString()).rotate({angle:0});
          $('#card'+cardchoose).rotate({animateTo:15,duration: 200});
        }
        break;
      case 69:
        if(gamestat == 2){
          cardchoose += 1;
          if(cardchoose > 3) cardchoose = 0;
          for (var i = 0; i < 4; i++) $('#card'+i.toString()).rotate({angle:0});
          $('#card'+cardchoose).rotate({animateTo:15,duration: 200});
        }
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

function gameMouseInput(){
  offset = $("#Game_Bg").offset();
  $('#Game_Bg').mousemove(function(e){
    mouse_x = e.pageX - offset.left;
    mouse_y = e.pageY - offset.top;
  });
}

function up(){
  key_w = true;
}
function right(){
  key_d = true;
}
function left(){
  key_a = true;
}
function down(){
  key_s = true;
}
function stopup(){
  key_w = false;
}
function stopright(){
  key_d = false;
}
function stopleft(){
  key_a = false;
}
function stopdown(){
  key_s = false;
}
