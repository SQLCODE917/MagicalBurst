const Game = require('./Game.js');

//TODO: in-memory database this
let allGames = [];

module.exports = class GameRepository {
    static get games () {
        return allGames;
    }
    
    static get latest() {
        if (allGames.length > 0) {
            console.log(`There are ${allGames.length} games in progress`);
            console.log(allGames);
            console.log(`Going to attempt to join the latest one.`);
            const lastGame = allGames[allGames.length - 1];
            const cloneGame = Object.assign(Object.create(lastGame), lastGame);
            console.log(`The last game ${cloneGame} is of type ${typeof cloneGame}`);
            console.log(`It has ${cloneGame.characters.length} character(s) in it already:`);
            cloneGame.characters.forEach(function(character){
                console.log(`\t${character.name}`);
            });
            return cloneGame;
        } else {
            console.log(`There are no games in progress`);
            console.log('Going to create a new one');
            const newGame = new Game();
            console.log(`New Game: ${newGame}, a ${typeof newGame}`);
            return newGame;
        }
    }

    static delete(id) {
        console.log(`Deleting game ${id}`);
        const gameIndex = allGames.find(game => game.id === id);
        if (gameIndex) {
            allGames.splice(gameIndex, 1);
        } else {
            console.log('No game found, nothing to do');
        }
    }
    
    static save(game) {
        console.log('Saving the game');
        const thisGameIndex = findGameById(game);
        if (thisGameIndex) {
            allGames.splice(thisGameIndex, 1, game);
            console.log(`Updating game at index ${thisGameIndex}`);
        } else {
            allGames.push(game);
            console.log(`Pushed to the list of all games, which now has ${allGames.length}`);
        }
        
        console.log(allGames);

        function findGameById(game) {
            return allGames.find(existingGame => existingGame.id === game.id);
        }
    }

    static character_joined(change) {
        console.log("A character had joined a game - going to save the change");
        this.save(change.game)
    }

    static joining_error(change) {
        console.log("There has been an error joining a game - nothing to do here");
    }


    static delete_game(change) {
        console.log("A game is going to be deleted");
        this.delete(change.id);
    }

    static apply(changes) {
        changes.forEach( change => change.effect(this));
    }
}
