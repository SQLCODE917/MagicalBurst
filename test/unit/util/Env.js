const chai = require('chai');

const expect = chai.expect;

const Env = require('../../../util/Env.js')

describe('Env utility', function() {
    it('could define and look up state variables', function() {
        const env = new Env();
        const expectedValue = 'Hello, World!';
        env.define('test', expectedValue);
        const actualValue= env.resolve('test');
        expect(actualValue).to.equal(expectedValue);
    });

    it('could create a child environment from any environment', function() {
        const parentEnv = new Env();
        const parentValue = 'parent';
        parentEnv.define('value', parentValue);
        const childEnv = parentEnv.subenv(parentEnv);

        expect(childEnv.resolve('value')).to.equal(parentValue);

        const childValue = 'child';
        childEnv.define('value', childValue);

        expect(childEnv.resolve('value')).to.equal(childValue);
        expect(parentEnv.resolve('value')).to.equal(parentValue);
    });
});
