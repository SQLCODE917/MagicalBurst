const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);

const assert = chai.assert;
const expect = chai.expect;

const Game = require('../../Game.js');
const GameRepository = require('../../GameRepository.js');

describe('The Game Repository', function () {
    describe('latest game getter', function () {
        it('should create a new game, if there are none', function () {
            expect(GameRepository.games).to.have.lengthOf(0);
            const game = GameRepository.latest;
            expect(GameRepository.games).to.have.lengthOf(0);
            expect(game).to.be.instanceOf(Game);
        });

        it('should retrieve the latest game', function () {
            expect(GameRepository.games).to.have.lengthOf(0);
            const game = GameRepository.latest;
            GameRepository.save(game);
            expect(GameRepository.games).to.have.lengthOf(1);
            const testGame = GameRepository.latest;
            expect(testGame.id).to.equal(game.id);
            GameRepository.delete(game.id);
        });
    });

    describe('save game function', function() {
        it('should update underlying game data store', function () {
            expect(GameRepository.games).to.have.lengthOf(0);
            const game = GameRepository.latest;
            GameRepository.save(game);
            expect(GameRepository.games).to.have.lengthOf(1);
            GameRepository.delete(game.id);
        });
    });

    describe('delete game function', function() {
        it('should delete a game with a given ID', function() {
            expect(GameRepository.games).to.have.lengthOf(0);
            const game = GameRepository.latest;
            GameRepository.save(game);
            expect(GameRepository.games).to.have.lengthOf(1);
            GameRepository.delete(game.id);
            expect(GameRepository.games).to.have.lengthOf(0);
        });
    });
});
