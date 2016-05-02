module.exports = class DeleteGame {
    constructor(id) {
        this.id = id;
    }

    effect(caller) {
        caller.delete_game(this);
    }
}
