const chai = require('chai');
const expect = chai.expect;

const ASOP = require('../../../util/AsynchronousOperations.js');
const Env = require('../../../util/Env.js');
const M = require('../../../util/M.js');

describe('Asynchronous Operations Utility', function () {
    describe('sequentual operations', function () {
        function asopFactory(name) {
            return function (M, env, success, failure) {
                var names = env.resolve('names') || [];
                names.push(name);
                env = env.subenv(env);
                env.define('names', names);
                M.start(success, env, M.end, failure);
            }
        }

        it('should accept an array of functions and run them in series', function (done) {
            const asopChain = [
                asopFactory("BLUE"),
                asopFactory("GREEN"),
                asopFactory("YELLOW"),
                asopFactory("RED")];

            M.start(ASOP.chain(asopChain), new Env(), successHandler, errorHandler);

            function successHandler (M, env, success, failure) {
                const names = env.resolve('names');
                expect(names).eql(["BLUE", "GREEN", "YELLOW", "RED"]);
                done();
            }

            function errorHandler (error, asop, env, success) {
                done(error);
            }
        });
    });
});
