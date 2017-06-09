'use strict'

/**
 * This class is responsible for rendering the aggregated results
 * for multiple finished games.
 */
class GameResultsRenderer {

    /**
     * Creates a new instance.
     * @param {GameResultsTracker} gameResultsTracker   data source
     */
    constructor(gameResultsTracker) {
        this.gameResultsTracker = gameResultsTracker
    }

    /**
     * Prints all available game results to standard output.
     */
    render() {
        const results = this.gameResultsTracker.getAllResults()
        console.log('-------------------------------------')
        Object.keys(results).forEach((key) => {
            console.log(key + '\t\t' + results[key])
        })
        console.log('-------------------------------------\n\n')
    }
}

module.exports = GameResultsRenderer
