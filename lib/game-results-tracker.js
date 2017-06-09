'use strict'

const Game = require('./game')

/**
 * This class is responsible for tracking and aggregating results
 * of finished games. This is important for proving how switching doors
 * increases the chance to win.
 */
class GameResultsTracker {

    /**
     * Creates a new instance.
     * @param {Game} game   game whose results should be retrieved and stored
     */
    constructor(game) {
        this.game = game
        this.results = {
            wonByStaying: 0,
            wonBySwitching: 0,
            lostByStaying: 0,
            lostBySwitching: 0,
        }
    }

    /**
     * Stores the current result of the game.
     * Does nothing if the game is not in a final state.
     * @param {boolean} didSwitch   did the player switch doors?
     */
    trackResult(didSwitch) {
        let resultKey
        if (this.game.state === Game.State.STATE_END_WON) {
            resultKey = didSwitch ? 'wonBySwitching' : 'wonByStaying'
        } else if (this.game.state === Game.State.STATE_END_LOST) {
            resultKey = didSwitch ? 'lostBySwitching' : 'lostByStaying'
        } else {
            return
        }

        this.results[resultKey]++
    }

    /**
     * Returns a map depicting how often each outcome has been counted.
     * @return {Object}     a map with statistics about all finished games
     */
    getAllResults() {
        return this.results
    }
}

module.exports = GameResultsTracker
