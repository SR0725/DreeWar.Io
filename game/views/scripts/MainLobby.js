function redTeamPlayerDisplayer(){try{let t=$("#redTeamPlayer");document.getElementById("redTeamPlayer").innerHTML='<h2><span class="badge bg-danger">紅隊玩家</span></h2>';for(let[r,a]of Object.entries(playerlist)){var s=PlayerImgTest(a.name,a.team);2==a.team&&t.append('<div class="card" style="width: 18rem;" style="margin-top:20px;"><div class="card-body bg-dark"><h5 class="card-title text-light">'+s+"  "+a.name+"</h5></div></div>")}t.append('<div class="card" style="width: 18rem;" style="margin-top:20px;"><div class="card-body bg-dark"><button type="button" class="btn btn-danger" id="joinRed">加入紅隊</button></div></div>'),$("#joinRed").click(function(){joinRed()})}catch(s){}}function blueTeamPlayerDisplayer(){try{let t=$("#blueTeamPlayer");document.getElementById("blueTeamPlayer").innerHTML='<h2><span class="badge bg-primary">藍隊玩家</span></h2>';for(let[r,a]of Object.entries(playerlist)){var s=PlayerImgTest(a.name,a.team);1==a.team&&t.append('<div class="card" style="width: 18rem;" style="margin-top:20px;"><div class="card-body bg-dark"><h5 class="card-title text-light">'+s+"  "+a.name+"</h5></div></div>")}t.append('<div class="card" style="width: 18rem;" style="margin-top:20px;"><div class="card-body bg-dark"><button type="button" class="btn btn-primary" id="joinBlue">加入藍隊</button></div></div>'),$("#joinBlue").click(function(){joinBlue()})}catch(s){}}function PlayerImgTest(s,t){switch(s){case"Ray":return'<img src="views/img/Ray.png" class="card-img" style="width:50px;border-radius: 50%;">';case"嗡嗡":return'<img src="https://www.dreamcity.studio/about/images/1.png" class="card-img" style="width:50px;border-radius: 50%;">';case"米格":return'<img src="https://www.dreamcity.studio/about/images/2.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"草莓龍":return'<img src="https://www.dreamcity.studio/about/images/3.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"暮朗":return'<img src="https://www.dreamcity.studio/about/images/5.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"I醬":return'<img src="https://www.dreamcity.studio/about/images/6.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"夜緋羽":return'<img src="https://www.dreamcity.studio/about/images/8.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"小瓜":return'<img src="https://www.dreamcity.studio/about/images/9.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"碎月":return'<img src="https://www.dreamcity.studio/about/images/11.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"CB":return'<img src="https://www.dreamcity.studio/about/images/12.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"悠梨":return'<img src="https://www.dreamcity.studio/about/images/33.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"莫嵐":return'<img src="https://www.dreamcity.studio/about/images/13.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"派大星":return'<img src="https://www.dreamcity.studio/about/images/24.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"唯唏":return'<img src="https://www.dreamcity.studio/about/images/14.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"兔乃":return'<img src="https://www.dreamcity.studio/about/images/15.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"小司":return'<img src="https://www.dreamcity.studio/about/images/16.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"糖渣":return'<img src="https://www.dreamcity.studio/about/images/32.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"葛雷特":return'<img src="https://www.dreamcity.studio/about/images/26.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"夜瑀":return'<img src="https://www.dreamcity.studio/about/images/34.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"毛毛虎":return'<img src="https://www.dreamcity.studio/about/images/18.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"R靈":return'<img src="https://www.dreamcity.studio/about/images/21.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"那卡":img='<img src="https://www.dreamcity.studio/about/images/17.jpg" class="card-img" style="width:50px;border-radius: 50%;">';break;case"yuy":return'<img src="https://www.dreamcity.studio/about/images/20.jpg" class="card-img" style="width:50px;border-radius: 50%;">';case"彩虹提摩":return'<img src="https://www.dreamcity.studio/about/images/23.jpg" class="card-img" style="width:50px;border-radius: 50%;">';default:return 1?'<img src="views/img/UI/hudPlayer_blue.png" class="card-img" style="width:50px;border-radius: 50%;">':'<img src="views/img/UI/hudPlayer_pink.png" class="card-img" style="width:50px;border-radius: 50%;">'}}$("#login-game").click(function(){logging(),musicPlay("Music_click",UIVolume)});
