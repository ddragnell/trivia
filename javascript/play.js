require('./game.js');

var game = new Game(); 
game.add('Andres');
game.add('Juan');
game.add('Manuela');

var notAWinner = false;
do {
  game.roll(Math.floor(Math.random()*6) + 1);
  if (Math.floor(Math.random()*10) == 7) {
    notAWinner = game.wrongAnswer();
  } else {
    notAWinner = game.wasCorrectlyAnswered();
  }
} while (notAWinner);
