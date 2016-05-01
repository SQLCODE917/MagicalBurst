const UUID = require('uuid');

module.exports = class Character {
    constructor(name) {
        this.id = UUID.v4();
        this.name = name;
    }
}
