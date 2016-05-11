module.exports = class UnhandledError {
    constructor(message) {
        this.message = message;
    }

    effect(caller) {
        caller.unhandled_error(this);
    }
}
