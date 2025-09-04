exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Game = function() {
  var players          = new Array();
  var places           = new Array(6);
  var purses           = new Array(6);
  var inPenaltyBox     = new Array(6);

  var popQuestions     = new Array();
  var scienceQuestions = new Array();
  var sportsQuestions  = new Array();
  var rockQuestions    = new Array();

  var currentPlayer    = 0;
  var isGettingOutOfPenaltyBox = false;
  var BOARD_SIZE = 12;
  var WIN_COINS  = 6;
  var didPlayerWin = function(){
    return !(purses[currentPlayer] == WIN_COINS)
  };

exports.Game = function(options) {
  options = options || {};
  var logger = options.logger || console;
    if(places[currentPlayer] == 0)
      return 'Pop';
    if(places[currentPlayer] == 4)
      return 'Pop';
    if(places[currentPlayer] == 8)
      return 'Pop';
    if(places[currentPlayer] == 1)
      return 'Science';
    if(places[currentPlayer] == 5)
      return 'Science';
    if(places[currentPlayer] == 9)
      return 'Science';
    if(places[currentPlayer] == 2)
      return 'Sports';
    if(places[currentPlayer] == 6)
      return 'Sports';
    if(places[currentPlayer] == 10)
      return 'Sports';
    return 'Rock';
  };

  this.createRockQuestion = function(index){
    return "Rock Question "+index;
  };

  for(var i = 0; i < 50; i++){
    popQuestions.push("Pop Question "+i);
    scienceQuestions.push("Science Question "+i);
    sportsQuestions.push("Sports Question "+i);
    rockQuestions.push(this.createRockQuestion(i));
  };

  this.isPlayable = function(howManyPlayers){
    return howManyPlayers >= 2;
  };

  this.add = function(playerName){
    places[index] = 0;
    var index = players.push(playerName) - 1;
    purses[index] = 0;
    inPenaltyBox[index] = false;

    logger.log(playerName + " was added");
    logger.log("They are player number " + players.length);

    return true;
  };

  this.howManyPlayers = function(){
    return players.length;
  };

var askQuestion = function(){
  var category = currentCategory();
  var pools = {
    Pop: popQuestions,
    Science: scienceQuestions,
    Sports: sportsQuestions,
    Rock: rockQuestions
  };
  logger.log(pools[category].shift());
};

var currentCategory = function(){
  var r = places[currentPlayer] % 4;
  if (r === 0) return 'Pop';
  if (r === 1) return 'Science';
  if (r === 2) return 'Sports';
  return 'Rock';
};


  this.roll = function(roll){
    logger.log(players[currentPlayer] + " is the current player");
    logger.log("They have rolled a " + roll);

    if(inPenaltyBox[currentPlayer]){
      if(roll % 2 != 0){
        isGettingOutOfPenaltyBox = true;

        logger.log(players[currentPlayer] + " is getting out of the penalty box");
        places[currentPlayer] = places[currentPlayer] + roll;
        if(places[currentPlayer] >= BOARD_SIZE){
          places[currentPlayer] = places[currentPlayer] - BOARD_SIZE;
        }

        logger.log(players[currentPlayer] + "'s new location is " + places[currentPlayer]);
        logger.log("The category is " + currentCategory());
        askQuestion();
      }else{
        logger.log(players[currentPlayer] + " is not getting out of the penalty box");
        isGettingOutOfPenaltyBox = false;
      }
    }else{

      places[currentPlayer] = places[currentPlayer] + roll;
      if(places[currentPlayer] > 11){
        places[currentPlayer] = places[currentPlayer] - 12;
      }

      logger.log(players[currentPlayer] + "'s new location is " + places[currentPlayer]);
      logger.log("The category is " + currentCategory());
      askQuestion();
    }
  };

  this.wasCorrectlyAnswered = function(){
    if(inPenaltyBox[currentPlayer]){
      if(isGettingOutOfPenaltyBox){
        logger.log('Answer was correct!!!!');
        purses[currentPlayer] += 1;
        logger.log(players[currentPlayer] + " now has " +
                    purses[currentPlayer]  + " Gold Coins.");

        var winner = didPlayerWin();
        currentPlayer += 1;
        if(currentPlayer == players.length)
          currentPlayer = 0;

        return winner;
      }else{
        currentPlayer += 1;
        if(currentPlayer == players.length)
          currentPlayer = 0;
        return true;
      }



    }else{

      logger.log("Answer was correct!!!!");

      purses[currentPlayer] += 1;
      logger.log(players[currentPlayer] + " now has " +
                  purses[currentPlayer]  + " Gold Coins.");

      var winner = didPlayerWin();

      currentPlayer += 1;
      if(currentPlayer == players.length)
        currentPlayer = 0;

      return winner;
    }
  };

  this.wrongAnswer = function(){
		logger.log('Question was incorrectly answered');
		logger.log(players[currentPlayer] + " was sent to the penalty box");
		inPenaltyBox[currentPlayer] = true;

    currentPlayer += 1;
    if(currentPlayer == players.length)
      currentPlayer = 0;
		return true;
  };
};

this.debugState = function(){
  return {
    players: players.slice(0),
    places: places.slice(0),
    purses: purses.slice(0),
    inPenaltyBox: inPenaltyBox.slice(0),
    currentPlayer: currentPlayer
  };
};
