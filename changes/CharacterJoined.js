module.exports =  class CharacterJoined {
    constructor(game) {
        this.game = game;
    }

    effect(caller) {
        caller.character_joined(this);
    }
}
