const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);

const assert = chai.assert;
const expect = chai.expect;

const CharacterJoined = require('../../../changes/CharacterJoined.js');

describe('Character Joined change', function () {
    it('should invoke the character_joined method in its callers context', function (){
        const testGame = "GAME_OBJECT";
        const testChange = new CharacterJoined(testGame);
        const testCaller = {
            character_joined: function(change) {
                assert.equal(change.game, testGame);
            }
        };
        const callerSpy = chai.spy.on(testCaller, 'character_joined');
        
        testChange.effect(testCaller);
        expect(callerSpy).to.have.been.called.once;
    });
});
