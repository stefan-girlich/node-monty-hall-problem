const Game = require('./game')

class GameResultsTracker {

    constructor(game) {
        this.game = game
        this.results = {
            wonByStaying: 0,
            wonBySwitching: 0,
            lostByStaying: 0,
            lostBySwitching: 0,
        }
    }

    trackResult(didSwitch) {
        let resultKey;
        if (this.game.state === Game.State.STATE_END_WON) {
            resultKey = didSwitch ? 'wonBySwitching' : 'wonByStaying'
        } else if (this.game.state === Game.State.STATE_END_LOST) {
            resultKey = didSwitch ? 'lostBySwitching' : 'lostByStaying'
        }

        this.results[resultKey]++
    }

    getAllResults() {
        return this.results
    }
}

module.exports = GameResultsTracker
