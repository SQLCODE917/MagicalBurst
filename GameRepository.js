const Game = require('./Game.js');

//TODO: in-memory database this
let allGames = [];

module.exports = class GameRepository {
    static get games () {
        return allGames;
    }

    static get latest() {
        if (allGames.length > 0) {
            const lastGame = allGames[allGames.length - 1];
            const cloneGame = Object.assign(Object.create(lastGame), lastGame);
            return cloneGame;
        } else {
            const newGame = new Game();
            return newGame;
        }
    }

    static delete(id) {
        const gameIndex = allGames.find(game => game.id === id);
        if (gameIndex) {
            allGames.splice(gameIndex, 1);
        } else {
            console.log('No game found, nothing to do');
        }
    }

    static save(game) {
        const thisGameIndex = this.findById(game.id);
        if (thisGameIndex) {
            allGames.splice(thisGameIndex, 1, game);
        } else {
            allGames.push(game);
        }
    }

    static findById(id) {
        const gameIndex = allGames.find(game => game.id === id);
        console.log(gameIndex);
        if (gameIndex) {
            return allGames[gameIndex];
        } else {
            return false;
        }
    }

    static character_joined(change) {
        this.save(change.game)
    }

    static joining_error(change) {
        console.log("There has been an error joining a game - nothing to do here");
    }


    static delete_game(change) {
        this.delete(change.id);
    }

    static apply(changes) {
        changes.forEach( change => change.effect(this));
    }
}
