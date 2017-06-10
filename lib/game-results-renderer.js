'use strict'

const TextIo = require('./text-io-util')
const chalk = require('chalk')

const horizontalLine = TextIo.createFiller(TextIo.DEFAULT_SHELL_WIDTH, '_')

const VALUE_COLUMN_WIDTH = 15

const renderItem = (label, valuePercent, valueAbs) => {
    label = TextIo.padRight(label, TextIo.DEFAULT_SHELL_WIDTH - 2 * VALUE_COLUMN_WIDTH)
    if (valuePercent === null || isNaN(valuePercent)) {
        valuePercent = '-'
    } else {
        valuePercent = valuePercent.toFixed(2)
    }
    valuePercent = TextIo.padLeft(`${valuePercent}%`, VALUE_COLUMN_WIDTH)
    valueAbs = TextIo.padLeft('' + valueAbs, VALUE_COLUMN_WIDTH)
    console.log(label + valuePercent + valueAbs)
}

/**
 * This class is responsible for rendering the aggregated results
 * for multiple finished games.
 */
class GameResultsRenderer {

    /**
     * Creates a new instance.
     * @param {GameResultsTracker} gameResultsTracker   data source
     * @param {Object}             gameResultsTexts     map of texts to display
     */
    constructor(gameResultsTracker, gameResultsTexts) {
        this.gameResultsTracker = gameResultsTracker
        this.gameResultsTexts = gameResultsTexts
    }

    /**
     * Prints all available game results to standard output.
     */
    render() {
        const results = this.gameResultsTracker.getAllResults()

        console.log(horizontalLine)
        console.log(chalk.bold(TextIo.padToFullWidth(this.gameResultsTexts.title)))
        TextIo.nl()

        const totalGames = Object.keys(results).reduce((acc, currVal) => acc + results[currVal], 0)

        Object.keys(results).forEach((key) => {
            const label = this.gameResultsTexts[key]
            const absoluteValue = results[key]
            const percentValue = absoluteValue / totalGames * 100
            renderItem(label, percentValue, absoluteValue)
        })

        console.log(horizontalLine)
        renderItem(this.gameResultsTexts.total, totalGames > 0 ? 100 : null, totalGames)

        TextIo.dnl()
    }
}

module.exports = GameResultsRenderer
