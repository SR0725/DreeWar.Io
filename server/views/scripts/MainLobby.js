$('#login-game').click(function(){
	logging();
});

function redTeamPlayerDisplayer(){
	let redTeamBox = $('#redTeamPlayer');
	document.getElementById('redTeamPlayer').innerHTML = '<h2><span class="badge bg-danger">紅隊玩家</span></h2>';

  for (let [index,player] of Object.entries(playerlist)) {
		if(player['team'] == 2){
			redTeamBox.append('<div class="card" style="width: 18rem;" style="margin-top:20px;"><div class="card-body bg-dark"><h5 class="card-title text-light">'+player['name']+'</h5></div></div>');
		}
  }
	redTeamBox.append('<div class="card" style="width: 18rem;" style="margin-top:20px;"><div class="card-body bg-dark"><button type="button" class="btn btn-danger" id="joinRed">加入紅隊</button></div></div>');
	$('#joinRed').click(function(){
		joinRed();
	});
}

function blueTeamPlayerDisplayer(){
	let blueTeamBox = $('#blueTeamPlayer');
	document.getElementById('blueTeamPlayer').innerHTML = '<h2><span class="badge bg-primary">藍隊玩家</span></h2>';
	for (let [index,player] of Object.entries(playerlist)) {
		if(player['team'] == 1){
			blueTeamBox.append('<div class="card" style="width: 18rem;" style="margin-top:20px;"><div class="card-body bg-dark"><h5 class="card-title text-light">'+player['name']+'</h5></div></div>');
		}
  }
	blueTeamBox.append('<div class="card" style="width: 18rem;" style="margin-top:20px;"><div class="card-body bg-dark"><button type="button" class="btn btn-primary" id="joinBlue">加入藍隊</button></div></div>');
	$('#joinBlue').click(function(){
		joinBlue();
	});
}
