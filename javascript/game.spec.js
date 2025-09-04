// game.spec.js
const { Game } = require('./game.js');

describe('Trivia Game - Refactor', () => {
  let game;
  const silentLogger = { log: () => {} };

  beforeEach(() => {
    game = new Game({ logger: silentLogger });
  });

  it('no es jugable con menos de 2 jugadores', () => {
    game.add('Alice');
    expect(game.isPlayable()).toBe(false);
    game.add('Bob');
    expect(game.isPlayable()).toBe(true);
  });

  it('add inicia sin off-by-one y en estado base', () => {
    game.add('Alice'); game.add('Bob');
    const s = game.debugState();
    expect(s.players[0]).toBe('Alice');
    expect(s.players[1]).toBe('Bob');
    expect(s.places[0]).toBe(0);
    expect(s.purses[0]).toBe(0);
    expect(s.inPenaltyBox[0]).toBe(false);
  });

  it('el tablero hace wrap a 12 casillas (0..11)', () => {
    game.add('A'); game.add('B');
    game.roll(12); 
    const s = game.debugState();
    expect(s.places[0]).toBe(0);
  });

  it('penalty box: par NO sale, impar SÍ sale y se mueve', () => {
    game.add('A'); game.add('B');
    game.wrongAnswer(); 

    game.roll(1); game.wasCorrectlyAnswered();

    game.roll(2);
    let s = game.debugState();
    expect(s.inPenaltyBox[0]).toBe(true);
    expect(s.places[0]).toBe(0);

    game.roll(1); game.wasCorrectlyAnswered();

    game.roll(3);
    s = game.debugState();
    expect(s.inPenaltyBox[0]).toBe(true);  
    expect(s.places[0]).toBe(3);         
  });

  it('gana con 6 respuestas correctas (wasCorrectlyAnswered -> false al ganar)', () => {
    game.add('A'); game.add('B');
    for (let i = 0; i < 5; i++) {
      game.roll(1);  // A
      expect(game.wasCorrectlyAnswered()).toBe(true);
      game.roll(1);  // B
      expect(game.wasCorrectlyAnswered()).toBe(true);
    }
    game.roll(1);
    expect(game.wasCorrectlyAnswered()).toBe(false);
  });
});
