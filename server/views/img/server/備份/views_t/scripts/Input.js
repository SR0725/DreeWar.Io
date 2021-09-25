document.onkeydown=function(event){
  let e = event || window.event || arguments.callee.caller.arguments[0];
  if(e){
    switch (e.keyCode) {
      case 87:
        key_w = true;
        controlSend();
        break;
      case 83:
        key_s = true;
        controlSend();
        break;
      case 65:
        key_a = true;
        controlSend();
        break;
      case 68:
        key_d = true;
        controlSend();
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
        controlSend();
        break;
      case 83:
        key_s = false;
        controlSend();
        break;
      case 65:
        key_a = false;
        controlSend();
        break;
      case 68:
        key_d = false;
        controlSend();
        break;
      default:
    }
  }
};
