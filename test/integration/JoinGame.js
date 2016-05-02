const chai = require('chai');
const Joi = require('joi');
const assert = chai.asset;
const expect = chai.expect;

/*
 * You just lost
 */
const theGame = require('../../index.js');

describe('Join a game', function() {
    let gameIdWithBob, gameIdWithAlice;
    after(function(done) {
        theGame.inject({
            method: 'DELETE',
            url: `/game/${gameIdWithBob}`
        }, function(response) {
            expect(response.statusCode).to.equal(200);
            console.log(`Deleted game with Bob: ${gameIdWithBob}`);

            theGame.inject({
                method:'DELETE',
                url: `/game/${gameIdWithAlice}`
            }, function(response) {
                expect(response.statusCode).to.equal(200);
                console.log(`Deleted game with Alice: ${gameIdWithAlice}`);     
                console.log('Shutting down the Game');
                theGame.stop({ timeout: 5 * 1000 }, function() {
                    console.log('Game shut down');
                    done();
                });
            });
        });
    });
    it('should have a defined interface', function(done) {
        theGame.inject({
            method: 'POST',
            url: '/game/join',
            payload: {
                name: 'Bob'
            }
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            Joi.assert(response.payload, Joi.string().guid());
            gameIdWithBob = response.payload;
            done();
        });
    });

    it('should only allow unique player names', function(done) {
        theGame.inject({
            method: 'POST',
            url: '/game/join',
            payload: {
                name: 'Bob'
            }
        }, (response) => {
            expect(response.statusCode).to.equal(422);
            expect(response.result.message).to.equal("A Character with that name already exists");
            done();
        });
    });

    it('should allow to join an existing game', function(done){
        theGame.inject({
            method: 'POST',
            url: '/game/join',
            payload: {
                name: 'Alice'
            }
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.payload).to.not.equal(gameIdWithBob);
            gameIdWithAlice = response.payload; 
            done();
        });
    });
});
