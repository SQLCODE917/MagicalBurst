const Boom = require('boom');

module.exports= class DeleteReplyContract {
    constructor(reply) {
        this.reply = reply;
    }

    delete_game(change) {
        console.log("Successfully deleted a game! Letting the user know.");
        return this.reply("Success");
    }

    apply(changes) {
        changes.forEach( change => change.effect(this) ); 
    }
}
