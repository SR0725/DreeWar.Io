function send_message(){let e=$("#message");if(""==e.val())return void alert("Enter Some message Please!");let t={message:e.val(),name:selfPlayer.name};socket.emit("send",t),e.val("")}function emotionSend(e){socket.emit("emotionDataGet",{type:e,time:100,id:id})}function mpUse(e){socket.emit("mpUse",{mpuse:e})}function bpUse(e){socket.emit("bpUse",{bpuse:e})}function playerDataSend(){socket.emit("playerDataGet",{x:selfPlayer.x,y:selfPlayer.y,motion_x:selfPlayer.motion_x,motion_y:selfPlayer.motion_y,animation:selfPlayer.animation,flip:selfPlayer.flip,mp:selfPlayer.mp})}function skillDataSend(e){socket.emit("skillDataGet",e)}function effectDataSend(e){socket.emit("effectDataGet",e)}function particleDataSend(e){socket.emit("particleDataGet",e)}function buildingDataSend(e){socket.emit("buildingDataGet",e)}function logging(){let e=$("#name_message");selfPlayer.name=e.val(),""==selfPlayer.name&&(selfPlayer.name="匿名"),socket.emit("login",{id:id,name:selfPlayer.name})}function joinRed(){socket.emit("redTeamJoin")}function joinBlue(){socket.emit("blueTeamJoin")}document.addEventListener("DOMContentLoaded",()=>{socket.on("connect",function(){$("#name_message");msgBox.append('<div><span class="user_name" style="color:#00BB00">世界之聲</span> : <span class="user_message" style="color:#eeeeee">登入遊戲!</span></div>'),msgBox[0].scrollTop=msgBox[0].scrollHeight}),socket.on("canNotLog",function(){msgBox.append('<div><span class="user_name" style="color:#00BB00">世界之聲</span> : <span class="user_message" style="color:#eeeeee">遊戲已經開始了!無法登入遊戲!</span></div>')}),socket.on("logToWaitingRoom",function(){document.getElementById("MainSence").innerHTML='<div style="position:relative;bottom:'+.2*window.innerHeight+'px;background-color:#121212;"><div class="container"><div class="row"><div class="col-4" id="blueTeamPlayer"><h2><span class="badge bg-primary">藍隊玩家</span></h2></div><div class="col-2"></div><div class="col-4" id="redTeamPlayer"><h2><span class="badge bg-danger">紅隊玩家</span></h2></div></div></div></div>',gamestat=1}),socket.on("gameStart",function(){gameStart()}),socket.on("disconnect",function(){msgBox.append('<div><span class="user_name" style="color:#00BB00">世界之聲</span> : <span class="user_message" style="color:#eeeeee">與伺服器離線!</span></div>'),msgBox[0].scrollTop=msgBox[0].scrollHeight}),socket.on("playerDataUpdata",function(e){playerlist_buffer=e,1==gamestat&&(playerlist=e,blueTeamPlayerDisplayer(),redTeamPlayerDisplayer())}),socket.on("kdaDataGet",function(e){kdalist=e}),socket.on("skillDataGet",function(e){skillObjectlist_buffer=e}),socket.on("effectDataGet",function(e){effectlist[Date.now()]=e}),socket.on("particleDataGet",function(e){particlelist[Date.now()]=e}),socket.on("emotionDataGet",function(e,t){emotionList[t]=e,console.log(e,t)}),socket.on("buildDataGet",function(e,t){buildinglist[t]=e,2!=e.type&&5!=e.type||obstx.drawImage(obsSum,e.x-100,e.y-174,111,128)}),socket.on("buildDataInt",function(e){buildinglist=e,setTimeout(function(){for(let[e,t]of Object.entries(buildinglist))2!=t.type&&5!=t.type||obstx.drawImage(obsSum,t.x-100,t.y-174,111,128)},2e3)}),socket.on("buildDataUpdata",function(e,t){buildinglist[t]=e}),socket.on("buildDataDel",function(e){2!=buildinglist[e].type&&5!=buildinglist[e].type||obstx.drawImage(obsDel,buildinglist[e].x-100,buildinglist[e].y-174,111,128),particleDataSend({particle:2,time:1,maintime:1e3,x:buildinglist[e].x,y:buildinglist[e].y}),delete buildinglist[e]}),socket.on("gameDataGet",function(e){bluescore=e.bluescore,redscore=e.redscore,occupyTime=e.occupyTime,foccupyTime=e.foccupyTime}),socket.on("loseGame",function(){loseAnimation=1,musicPlay("loser",HumanVolume)}),socket.on("winGame",function(){winAnimation=1,musicPlay("winner",HumanVolume)}),socket.on("restartGame",function(){window.location.href=window.location.href,window.location.reload}),socket.on("die",function(){selfPlayer.x=-3e3,selfPlayer.y=0,respawnTime=500,musicPlay("you_lose",HumanVolume),ActionBarShow("你死掉了!請等待十秒復活!")}),socket.on("hurt",function(){hurtAnimationTime=10}),socket.on("msg",function(e){msgBox.append('<div><span class="user_name" style="color:#00BB00">'+e.name+'</span> : <span class="user_message" style="color:#eeeeee">'+e.message+"</span></div>"),msgBox[0].scrollTop=msgBox[0].scrollHeight})}),$("#message").on("keydown",function(e){13==e.which&&send_message()});
