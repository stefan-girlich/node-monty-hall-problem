'use strict'

const chalk = require('chalk')
const wordwrap = require('wordwrap')
const TextIo = require('./text-io-util')

const LEFT_COLUMN_WIDTH = 30
const FULL_SHELL_WIDTH_SPACE = TextIo.createFiller(TextIo.DEFAULT_SHELL_WIDTH)

const wrap = wordwrap(TextIo.DEFAULT_SHELL_WIDTH)

const renderHeader = (input) => console.log(chalk.bold.inverse(input))

const renderStat = (label, value) => {
    console.log(chalk.bold(TextIo.padRight(label, LEFT_COLUMN_WIDTH) + value))
}


/**
 * This class is responsible for rendering the introduction texts.
 */
class IntroRenderer {

    /**
     * Creates a new instance.
     * @param {Object} introTexts   map of texts to display
     * @param {Object} symbols      map of symbols for game objects
     * @param {Object} packageInfo  package.json information
     */
    constructor(introTexts, symbols, packageInfo) {
        this.introTexts = introTexts
        this.symbols = symbols
        this.packageInfo = packageInfo
    }

    /**
     * Renders an explanatory text about the game.
     */
    renderIntro() {
        const symbols = this.symbols
        const introTexts = this.introTexts
        const decorationSymbols = [symbols.car, symbols.door, symbols.goat]
        const decoration = decorationSymbols.join('  ')
        const headline = [decoration, introTexts.headline, decoration].join('  ')

        // HOTFIX since each Emoji has length = 2, but seems to take only one space in shell output
        const paddedHeadline = TextIo.padToFullWidth(headline, decorationSymbols.length * 2)

        renderHeader(FULL_SHELL_WIDTH_SPACE)
        renderHeader(paddedHeadline)
        renderHeader(FULL_SHELL_WIDTH_SPACE + '\n')

        console.log(wrap(introTexts.paragraph))

        TextIo.nl()

        renderStat(introTexts.authorLabel, this.packageInfo.author)
        renderStat(introTexts.websiteLabel, 'TODO https://something')   // TODO

        TextIo.dnl()
    }

    /**
     * Renders a header text explaining that a new game has started.
     */
    renderGameHeader() {
        const paddedHeadline = TextIo.padToFullWidth(this.introTexts.newRoundHeader)
        renderHeader(paddedHeadline)
        TextIo.nl()
    }

    /**
     * Renders a simple divider line.
     */
    renderStageDivider() {
        const line = TextIo.createFiller(TextIo.DEFAULT_SHELL_WIDTH, '_')
        console.log(chalk.dim(line))
        TextIo.nl()
    }
}

module.exports = IntroRenderer
