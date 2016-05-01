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
            console.log(`A character with the same name already exists in the given game, adding an error`);
            changes.push(new JoiningError("A Character with that name already exists"));
        } else {
            console.log(`No character with that name exists - adding`);
            this.characters.push(character);
            console.log("The character roster will be updated with the following:");
            this.characters.forEach(character => console.log(`\t${character.name}`));
            const game = new Game(this.characters);
            console.log("Games are immutable - creating a clone with the new roster", game);
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
