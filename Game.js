const UUID = require('uuid');
const CharacterJoined = require('./changes/CharacterJoined.js');
const JoiningError = require('./changes/JoiningError.js');

module.exports = class Game {
    constructor(characters = []) {
        this.id = UUID.v4();
        this.characters = characters;
    }

    join(character, changes) {
        if( this.hasCharacterWithName(character.name) ) {
            changes.push(new JoiningError("A Character with that name already exists"));
        } else {
            const cloneCharacters = this.characters.slice();
            cloneCharacters.push(character);
            const game = new Game(cloneCharacters);
            changes.push(new CharacterJoined(game));
        }
        return changes;
    }

    hasCharacterWithName(name) {
        return !!this.characters.find(function(character) {
            return character.name === name;
        });
    }
}
