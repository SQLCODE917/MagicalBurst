const Boom = require('boom');

module.exports= class JoinReplyContract {
    constructor(reply) {
        this.reply = reply;
    }

    character_joined(change) {
        console.log("Successfully joined a game! Letting the user know.");
        return this.reply("Success");
    }

    joining_error(change) {
        console.log(`There has been an error joing a game, replying to the user: ${change.message}`);
        return this.reply(Boom.badData(change.message));
    }

    apply(changes) {
        changes.forEach( change => change.effect(this) );
    }
}
