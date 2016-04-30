module.exports = class JoiningError {
    constructor(message) {
        this.message = message;
    }

    effect(caller) {
        caller.joining_error(this);
    }
}
