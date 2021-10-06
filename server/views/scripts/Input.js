$( function() {
  $('#message').autocomplete({
    delay: 0,
    minLength: 1,
    source: [
      {label: '/login dreamcity'},
      {label: '/start'},
      {label: '/data get @a mp'},
      {label: '/data get @a bp'},
      {label: '/data get @a health'},
      {label: '/data get @a speed'},
      {label: '/data get @a name'},
      {label: '/data get @a team'},
      {label: '/data get @a damage'},
      {label: '/data set @a mp'},
      {label: '/data set @a bp'},
      {label: '/data set @a health'},
      {label: '/data set @a speed'},
      {label: '/data set @a name'},
      {label: '/data set @a team'},
      {label: '/data set @a damage'},
      {label: '/gamerule friendlyFire true/false'},
      {label: '/gamerule gameStartingJoin true/false'},
      {label: '/gameval set mpBasicRegVal'},
      {label: '/gameval set bpBasicRegVal'},
      {label: '/gameval get bpBasicRegVal'},
      {label: '/gameval get mpBasicRegVal'}
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

var mouseRight = false;
document.onmousedown=function(event){
  if (event.button==2)
    mouseRight = true;
  else{
    if(gamestat == 2)
      if(cardUseMode == 1)
        skillCardUse();
  }
};

document.onmouseup=function(event){
  if (event.button==2){
    mouseRight = false;
    var temp_x = Window_width/2;
    var temp_y = Window_height/2;
    for (var i = 1; i <= 7; i++) {
      if(distanceCount(mouse_x,mouse_y,temp_x+Math.cos(i/7*2*PI)*200,temp_y+Math.sin(i/7*2*PI)*200) <= 100){
        emotionSend(i);
        return;
      }
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
    musicPlay('Music_switch',UIVolume);
})

$('#CardUseMode_1').change(function () {
    cardUseMode = 1;
    musicPlay('Music_switch',UIVolume);
})
$("#fpsRange").change(function(){
  document.getElementById("fpsValue").innerHTML = $(this).val();
  FramePerSencond = $(this).val();
  musicPlay('Music_mouserelease',UIVolume);
});
$('#displayWaveCheck').on('change', function () {
  if ($('#displayWaveCheck').prop('checked')) {
    displayWave = true;
  }
  else{
    displayWave = false;
  }
  musicPlay('Music_rollover',UIVolume);
})
$('#displayBuildingHpCheck').on('change', function () {
  if ($('#displayBuildingHpCheck').prop('checked')) {
    displayBuildingHp = true;
  }
  else{
    displayBuildingHp = false;
  }
  musicPlay('Music_rollover',UIVolume);
})
$('#displayBuildingMistCheck').on('change', function () {
  if ($('#displayBuildingMistCheck').prop('checked')) {
    displayBuildingMist = true;
  }
  else{
    displayBuildingMist = false;
  }
  musicPlay('Music_rollover',UIVolume);
})
$('#displayMouseCircleWithoutDelayCheck').on('change', function () {
  if ($('#displayMouseCircleWithoutDelayCheck').prop('checked')) {
    displayMouseCircleWithoutDelay = false;
  }
  else{
    displayMouseCircleWithoutDelay = true;
  }
  musicPlay('Music_rollover',UIVolume);
})

$("#MainVolumeRange").change(function(){
  document.getElementById("MainVolumeValue").innerHTML = $(this).val();
  MainVolume = $(this).val()/100;
  musicPlay('Music_mouserelease',UIVolume);
});

$("#BGMVolumeRange").change(function(){
  document.getElementById("BGMVolumeValue").innerHTML = $(this).val();
  BGMVolume = $(this).val()/100;
  musicPlay('Music_mouserelease',UIVolume);
});

$("#ShootVolumeRange").change(function(){
  document.getElementById("ShootVolumeValue").innerHTML = $(this).val();
  ShootVolume = $(this).val()/100;
  musicPlay('Music_mouserelease',UIVolume);
});

$("#UIVolumeRange").change(function(){
  document.getElementById("UIVolumeValue").innerHTML = $(this).val();
  UIVolume = $(this).val()/100;
  musicPlay('Music_mouserelease',UIVolume);
});

$("#HumanVolumeRange").change(function(){
  document.getElementById("HumanVolumeValue").innerHTML = $(this).val();
  UIVolume = $(this).val()/100;
  musicPlay('Music_mouserelease',UIVolume);
});

$("#BoomVolumeRange").change(function(){
  document.getElementById("BoomVolumeValue").innerHTML = $(this).val();
  BoomVolume = $(this).val()/100;
  musicPlay('Music_mouserelease',UIVolume);
});

$("#FootVolumeRange").change(function(){
  document.getElementById("FootVolumeValue").innerHTML = $(this).val();
  FootVolume = $(this).val()/100;
  musicPlay('Music_mouserelease',UIVolume);
});

$("#BuildVolumeRange").change(function(){
  document.getElementById("BuildVolumeValue").innerHTML = $(this).val();
  BuildVolume = $(this).val()/100;
  musicPlay('Music_mouserelease',UIVolume);
});

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
