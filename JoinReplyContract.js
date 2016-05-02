const Boom = require('boom');

module.exports= class JoinReplyContract {
    constructor(reply) {
        this.reply = reply;
    }

    character_joined(change) {
        return this.reply(change.game.id);
    }

    joining_error(change) {
        return this.reply(Boom.badData(change.message));
    }

    apply(changes) {
        changes.forEach( change => change.effect(this) );
    }
}
