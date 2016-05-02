const Character = require('./Character.js');
const DeleteGame = require('./changes/DeleteGame.js');
const DeleteReplyContract = require('./DeleteReplyContract.js');
const Game = require('./Game.js');
const GameRepository = require('./GameRepository.js');
const JoinReplyContract = require('./JoinReplyContract.js');

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
        console.log(`Received a request from ${request.payload.name} to join`);
        var changes = [];
        var changeHandler = new JoinReplyContract(reply);
        const character = new Character(request.payload.name);

        console.log("Attempting to find a game to join");
        const game = GameRepository.latest;
        console.log("Attempting to join a game");
        changes = game.join(character, changes);
        console.log("There are pending changes:");
        changes.forEach( change => console.log(`\t${change}`));
        console.log("Applying the changes to the Game Repository");
        GameRepository.apply(changes);
        console.log("Applying the changes to the endpoint's handler");
        changeHandler.apply(changes);
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
        console.log(`Received a request to delete game ${request.params.id}`);
        const changeHandler = new DeleteReplyContract(reply);
        var changes = [new DeleteGame(request.params.id)]; 
        console.log("Applying the changes to the Game Repository");
        GameRepository.apply(changes);
        console.log("Applying the changes to the endpoint's handler");
        changeHandler.apply(changes);
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
