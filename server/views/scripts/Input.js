$( function() {
  $('#message').autocomplete({
    delay: 0,
    minLength: 1,
    source: [
      {label: '/login dreamcity'},
      {label: '/start'},
      {label: '/data get'},
      {label: '/data set'},
      {label: '/gamerule friendlyFire true/false'},
      {label: '/gamerule gameStartingJoin true/false'}
    ],
    create: function (event, ui) {
      $(this).data('ui-autocomplete')._renderItem  = function (ul, item) {
        return $("<li>").attr('data-value', item.label).append(
          $("<div>").addClass('ui-menu-item-wrapper').append(
            $("<b>").addClass('text-muted pl-2').html(item.label)
          )
        ).appendTo(ul);
      };
    }
  });
});

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
          if(cardUseMode == 1)
            skillCardUse();
        break;
      case 81:
        if(gamestat == 2){
          if(cardUseMode == 1){
            cardchoose -= 1;
            if(cardchoose < 0) cardchoose = 3;
            for (var i = 0; i < 4; i++) $('#card'+i.toString()).rotate({angle:0});
            $('#card'+cardchoose).rotate({animateTo:15,duration: 200});
          }else if(cardUseMode == 0){
            cardchoose = 0
            for (var i = 0; i < 4; i++) $('#card'+i.toString()).rotate({angle:0});
            $('#card0').rotate({animateTo:15,duration: 200});
            skillCardUse();
          }
        }
        break;
      case 69:
        if(gamestat == 2){
          if(cardUseMode == 1){
            cardchoose += 1;
            if(cardchoose > 3) cardchoose = 0;
            for (var i = 0; i < 4; i++) $('#card'+i.toString()).rotate({angle:0});
            $('#card'+cardchoose).rotate({animateTo:15,duration: 200});
          }else if(cardUseMode == 0){
            cardchoose = 1;
            for (var i = 0; i < 4; i++) $('#card'+i.toString()).rotate({angle:0});
            $('#card1').rotate({animateTo:15,duration: 200});
            skillCardUse();
          }
        }
        break;
      case 82:
        if(gamestat == 2){
          if(cardUseMode == 1){
            cardchoose += 1;
            if(cardchoose > 3) cardchoose = 0;
            for (var i = 0; i < 4; i++) $('#card'+i.toString()).rotate({angle:0});
            $('#card'+cardchoose).rotate({animateTo:15,duration: 200});
          }else if(cardUseMode == 0){
            cardchoose = 2;
            for (var i = 0; i < 4; i++) $('#card'+i.toString()).rotate({angle:0});
            $('#card2').rotate({animateTo:15,duration: 200});
            skillCardUse();
          }
        }
        break;
      case 70:
        if(gamestat == 2){
          if(cardUseMode == 1){
            cardchoose += 1;
            if(cardchoose > 3) cardchoose = 0;
            for (var i = 0; i < 4; i++) $('#card'+i.toString()).rotate({angle:0});
            $('#card'+cardchoose).rotate({animateTo:15,duration: 200});
          }else if(cardUseMode == 0){
            cardchoose = 3;
            for (var i = 0; i < 4; i++) $('#card'+i.toString()).rotate({angle:0});
            $('#card3').rotate({animateTo:15,duration: 200});
            skillCardUse();
          }
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
  $(document).mousemove(function(e){
    mouse_x = e.pageX - offset.left-32;
    mouse_y = e.pageY - offset.top-64;
  });
}
$('#CardUseMode_0').change(function () {
    cardUseMode = 0;
    console.log('1');
})

$('#CardUseMode_1').change(function () {
    cardUseMode = 1;
    console.log('2');
})
$('#displayWaveCheck').on('change', function () {
  if ($('#displayWaveCheck').prop('checked')) {
    displayWave = true;
  }
  else{
    displayWave = false;
  }
})
$('#displayWithoutLagCheck').on('change', function () {
  if ($('#displayWithoutLagCheck').prop('checked')) {
    displayWithoutLag = true;
  }
  else{
    displayWithoutLag = false;
  }
})


/*手機介面操控*/
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
