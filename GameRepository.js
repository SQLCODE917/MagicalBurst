const Game = require('./Game.js');

//TODO: in-memory database this
let allGames = [];

module.exports = class GameRepository {
    static get latest() {
        if (allGames.length > 0) {
            console.log(`There are ${allGames.length} games in progress`);
            console.log(allGames);
            console.log(`Going to attempt to join the latest one.`);
            const lastGame = allGames[allGames.length - 1];
            debugger;
            console.log(`The last game ${lastGame} is of type ${typeof lastGame}`);
            console.log(`It has ${lastGame.characters.length} character(s) in it already:`);
            lastGame.characters.forEach(function(character){
                console.log(`\t${character.name}`);
            });
            return lastGame;
        } else {
            console.log(`There are no games in progress`);
            console.log('Going to create a new one');
            const newGame = new Game();
            console.log(`New Game: ${newGame}, a ${typeof newGame}`);
            allGames.push(newGame);
            console.log(`Pushed to the list of all games, which now has ${allGames.length}`);
            console.log(allGames);
            return newGame;
        }
    }

    static save(game) {
        console.log("Saving a game to a TBD data store");
        console.log(game);
    }
    static character_joined(change) {
        console.log("A character had joined a game - going to save the change");
        this.save(change.game)
    }

    static joining_error(change) {
        console.log("There has been an error joining a game - nothing to do here");
    }

    static apply(changes) {
        changes.forEach( change => change.effect(this));
    }
}
