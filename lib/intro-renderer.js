'use strict'

const chalk = require('chalk')
const wordwrap = require('wordwrap')
const TextIo = require('./text-io-util')

const DEFAULT_SHELL_WIDTH = 80
const LEFT_COLUMN_WIDTH = 30


const createFiller = (charCount, char) => {
    char = char || ' '
    let filler = ''
    while (charCount > 0) {
        filler += char
        charCount--
    }
    return filler
}

const FULL_SHELL_WIDTH_SPACE = createFiller(DEFAULT_SHELL_WIDTH)

const wrap = wordwrap(DEFAULT_SHELL_WIDTH)

const padToFullWidth = (string, emojiSpaceCorrection) => {
    emojiSpaceCorrection = emojiSpaceCorrection || 0
    const diff = DEFAULT_SHELL_WIDTH - string.length
    const leadSpaceSize = Math.floor(diff / 2)
    return createFiller(leadSpaceSize)
        + string
        + createFiller(DEFAULT_SHELL_WIDTH - leadSpaceSize - string.length + emojiSpaceCorrection)
}

const pad = (string, targetWidth) => string + createFiller(targetWidth - string.length)

const renderHeader = (input) => console.log(chalk.bold.inverse(input))

const renderStat = (label, val) => console.log(chalk.bold(pad(label, LEFT_COLUMN_WIDTH) + val))


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
        const paddedHeadline = padToFullWidth(headline, decorationSymbols.length * 2)

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
        const paddedHeadline = padToFullWidth(this.introTexts.newRoundHeader)
        renderHeader(paddedHeadline)
        TextIo.nl()
    }

    /**
     * Renders a simple divider line.
     */
    renderStageDivider() {
        console.log(createFiller(DEFAULT_SHELL_WIDTH, '_'))
        TextIo.nl()
    }
}

module.exports = IntroRenderer
