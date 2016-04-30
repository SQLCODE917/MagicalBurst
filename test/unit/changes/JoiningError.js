const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);

const assert = chai.assert;
const expect = chai.expect;

const JoiningError = require('../../../changes/JoiningError.js');

describe('Joining Error change', function () {
    it('should invoke the joining_error method in its callers context', function () {
        const testMessage = "YOU_AINT_ON_THE_LIST";
        const testError = new JoiningError(testMessage);
        const testCaller = {
            joining_error: function(error) {
                assert.equal(error.message, testMessage);
            }
        };
        const callerSpy = chai.spy.on(testCaller, 'joining_error');
        
        testError.effect(testCaller);
        expect(callerSpy).to.have.been.called.once;
    });
});
