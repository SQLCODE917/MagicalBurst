const Character = require('./Character.js');
const CharacterJoined = require('./changes/CharacterJoined.js');
const Game = require('./Game.js');
const GameRepository = require('./GameRepository.js');
const JoiningError = require('./changes/JoiningError.js');
const JoinReplyContract = require('./JoinReplyContract.js');

const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({ port: 3000 });



server.route({
    method: 'POST',
    path: '/join/{name}',
    /*
     *Do not use fat arrow syntax as they do not allow context binding!
     * */
    handler: function (request, reply) {
        console.log(`Received a request from ${request.params.name} to join`);
        var changes = [];
        var changeHandler = new joinReplyContract(reply);
        const character = new Character(request.params.name);

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
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }

    console.log('Server running at:' + server.info.uri);
});
