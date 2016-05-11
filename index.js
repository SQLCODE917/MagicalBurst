const Character = require('./Character.js');
const DeleteGame = require('./changes/DeleteGame.js');
const DeleteReplyContract = require('./DeleteReplyContract.js');
const Game = require('./Game.js');
const GameRepository = require('./GameRepository.js');
const JoiningError = require('./changes/JoiningError.js');
const JoinReplyContract = require('./JoinReplyContract.js');

const M = require('./util/M.js');
const Env = require('./util/Env.js');
const ASOP = require('./util/AsynchronousOperations.js');

const Hapi = require('hapi');
const Joi = require('joi');
const server = new Hapi.Server();
server.connection({ port: 3000 });



server.route({
    method: 'POST',
    path: '/game/join',
    /*
     *Do not use fat arrow syntax as they do not allow context binding!
     * */
    handler: function (request, reply) {
        var ASOPChain = [];


        ASOPChain.push(function (M, env, success, failure) {
            const characterName = env.resolve('characterName');
            env.define('character', new Character(characterName));
            M.start(success, env, M.end, failure);
        });
        ASOPChain.push(function (M, env, success, failure) {
            env.define('game', GameRepository.latest);
            M.start(success, env, M.end, failure);
        });
        ASOPChain.push(function (M, env, success, failure) {
            const game = env.resolve('game');
            const character = env.resolve('character');
            var changes = [];
            changes = game.join(character, changes);
            M.start(success, changes, M.end, failure);
        });

        const env = new Env();
        env.define('characterName', request.payload.name);

        ASOP.chain(ASOPChain)(M, env, success, failure);

        function success (M, changes) {
            const changeHandler = new JoinReplyContract(reply);
            GameRepository.apply(changes);
            changeHandler.apply(changes);
        }
        function failure (error, operation, input, nextStep) {
            console.log("Internal Server Error", error);
        }
/*
        var changes = [];
        var changeHandler = new JoinReplyContract(reply);
        const character = new Character(request.payload.name);

        const game = GameRepository.latest;
        changes = game.join(character, changes);
        GameRepository.apply(changes);
        changeHandler.apply(changes);
*/
    },
    config: {
        validate: {
            payload: {
                name: Joi.string().min(3).max(10)
            }
        }
    }
});

server.route({
    method: 'DELETE',
    path: '/game/{id}',
    handler: function (request, reply) {
        const changeHandler = new DeleteReplyContract(reply);
        var changes = [new DeleteGame(request.params.id)];
        GameRepository.apply(changes);
        changeHandler.apply(changes);
    },
    config: {
        validate: {
            params: {
                id: Joi.string().guid()
            }
        }
    }
});

server.route({
    method: 'POST',
    path: '/game/{id}/join',
    handler: function (request, reply) {
        var changes = [];
        const changeHandler = new JoinReplyContract(reply);
        const game = GameRepository.findById(request.params.id);
        if (game) {
            const character = new Character(request.payload.name);
            changes = game.join(character, changes);
        } else {
            changes.push(new JoiningError('Not a valid game ID'));
        }
        GameRepository.apply(changes);
        changeHandler.apply(changes);
    },
    config: {
        validate: {
            params: {
                id: Joi.string().guid()
            },
            payload: {
                name: Joi.string().min(3).max(10)
            }
        }
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }

    console.log('Server running at:' + server.info.uri);
});

/*
 * Export for integration testing
 */
module.exports = server;
