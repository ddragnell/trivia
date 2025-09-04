let Game;
const mod = require('./game.js');
if (typeof mod === 'function') Game = mod;
else if (mod && mod.Game) Game = mod.Game;
else if (global && global.Game) Game = global.Game;
if (!Game) throw new Error('No se pudo resolver Game desde game.js');

describe('Trivia Game - Refactor', () => {
  let game;
  const silentLogger = { log: () => {} };

  beforeEach(() => {
    game = new Game({ logger: silentLogger });
  });

  it('no es jugable con menos de 2 jugadores', () => {
    game.add('Andres');
    expect(game.isPlayable()).toBe(false);
    game.add('Juan');
    expect(game.isPlayable()).toBe(true);
  });

  it('add inicia sin off-by-one y en estado base', () => {
    game.add('Andres'); game.add('Juan');
    const s = game.debugState();
    expect(s.players[0]).toBe('Andres');
    expect(s.players[1]).toBe('Juan');
    expect(s.places[0]).toBe(0);
    expect(s.purses[0]).toBe(0);
    expect(s.inPenaltyBox[0]).toBe(false);
  });

  it('el tablero hace wrap a 12 casillas (0..11)', () => {
    game.add('Andres'); game.add('Juan');
    game.roll(12);
    const s = game.debugState();
    expect(s.places[0]).toBe(0);
  });

  it('penalty box: par NO sale, impar SÍ sale y se mueve', () => {
  game.add('Andres'); game.add('Juan');

  game.wrongAnswer();

  game.roll(1);
  expect(game.wasCorrectlyAnswered()).toBe(true); 

  game.roll(2);
  expect(game.wasCorrectlyAnswered()).toBe(true);

  game.roll(1);
  expect(game.wasCorrectlyAnswered()).toBe(true); 

  game.roll(3);
  expect(game.wasCorrectlyAnswered()).toBe(true); 

  const s = game.debugState();
  expect(s.places[0]).toBe(3);
});
});
