$('#login-game').click(function(){
	logging();
});

function redTeamPlayerDisplayer(){
	let msgBox = $('#redTeamPlayer');
	document.getElementById('redTeamPlayer').innerHTML = '<h2><span class="badge bg-danger">紅隊玩家</span></h2>';

  for (let player of Object.entries(playerlist)) {
		if(player['1']['online'] == 1){
			if(player['1']['team'] == 2){
				msgBox.append('<div class="card" style="width: 18rem;" style="margin-top:20px;"><div class="card-body bg-dark"><h5 class="card-title text-light">'+player['1']['name']+'</h5></div></div>');
			}
		}
  }
	msgBox.append('<div class="card" style="width: 18rem;" style="margin-top:20px;"><div class="card-body bg-dark"><button type="button" class="btn btn-danger" id="joinRed">加入紅隊</button></div></div>');
	$('#joinRed').click(function(){
		joinRed();
	});
}

function blueTeamPlayerDisplayer(){
	let msgBox = $('#blueTeamPlayer');
	document.getElementById('blueTeamPlayer').innerHTML = '<h2><span class="badge bg-primary">藍隊玩家</span></h2>';
	for (let player of Object.entries(playerlist)) {
		if(player['1']['online'] == 1){
			if(player['1']['team'] == 1){
				msgBox.append('<div class="card" style="width: 18rem;" style="margin-top:20px;"><div class="card-body bg-dark"><h5 class="card-title text-light">'+player['1']['name']+'</h5></div></div>');
			}
		}
  }
	msgBox.append('<div class="card" style="width: 18rem;" style="margin-top:20px;"><div class="card-body bg-dark"><button type="button" class="btn btn-primary" id="joinBlue">加入藍隊</button></div></div>');
	$('#joinBlue').click(function(){
		joinBlue();
	});
}
