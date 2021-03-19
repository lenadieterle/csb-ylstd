let newGameBtn = document.getElementById("newgamebutton");
//console.log(newGameBtn);
newGameBtn.addEventListener("click", createNewGame);
async function createNewGame() {
  let gameData = await newGame("https://tictactoe.wntzn.com/api/games");
  console.log(gameData);
  window.location.href =
    "/game.html?gameId=" + gameData.gameId + "&playerId=" + gameData.playerId;
}
async function newGame(apiUrl) {
  let gameData = await fetch(apiUrl);
  return await gameData.json();
  /*let gameData = await (await fetch(apiUrl)).json();
  return gameData;*/
}

let newLinkBtn = document.getElementById("inviteLink");
newLinkBtn.addEventListener("copy", inviteLink);
function inviteLink() {
  const input = document.createElement("input");
  document.body.appendChild(input);
  let params = new URL(document.location).searchParams;
  let game = params.get("gameId");
  //input.value = window.location; //Gesamter Link des Host Spielers wird kopiert, noch kein Austausch der playerId
  input.value = "gameId=" + game;
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}
