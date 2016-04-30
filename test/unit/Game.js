const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);

const assert = chai.assert;
const expect = chai.expect;

const Game = require('../../Game.js');
const Character = require('../../Character.js');
const CharacterJoined = require('../../changes/CharacterJoined.js');
const JoiningError = require('../../changes/JoiningError.js');

describe('A Game', function () {
    it('should be initialized with a blank roster of characters', function() {
        const testGame = new Game();
        expect(testGame.characters).to.have.lengthOf(0);
    });

    it('could be initialized with an existing roster of characters', function() {
        const bob = new Character('Bob');
        const alice = new Character('Alice');
        const testCharacters = [bob, alice]; 
        const testGame = new Game(testCharacters);
        expect(testGame.characters).to.have.lengthOf(2);
        expect(testGame.characters).to.include(bob);
        expect(testGame.characters).to.include(alice);
    });
    it('should allow a character to join it', function() {
        const testGame = new Game();
        var testChanges = [];
        const bob = new Character('Bob');
        const actualChanges = testGame.join(bob, testChanges);
        expect(actualChanges).to.have.lengthOf(1);
        expect(actualChanges[0]).to.be.instanceOf(CharacterJoined);
        const change = actualChanges[0];
        const newGame = change.game;
        expect(newGame.characters).to.have.lengthOf(1);
        expect(newGame.characters).to.include(bob);
    });
    it('should only allow uniquely named characters to join it', function() {
        const testGame = new Game();
        const bob = new Character('Bob');
        const pseudoBob = new Character('Bob');
        const testChanges = testGame.join(bob, []);
        const gameWithBob = testChanges[0].game;
        const actualChanges = gameWithBob.join(pseudoBob, []);
        expect(actualChanges).to.have.lengthOf(1);
        expect(actualChanges[0]).to.be.instanceOf(JoiningError);
        const change = actualChanges[0];
        expect(change.message).to.equal("A Character with that name already exists");
    });
});
