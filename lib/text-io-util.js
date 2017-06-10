'use strict'

const readlineSync = require('readline-sync')
const chalk = require('chalk')


/**
 * The quasi-default width of a common shell in chars.
 */
const DEFAULT_SHELL_WIDTH = 80

/**
 * Repeats a given char to fill space and returns the
 * concatenated string.
 * @param {number} charCount    how many chars to fill
 * @param {number} char         which char to repeat for filling
 * @return {string}             the concatenated filler
 */
const createFiller = (charCount, char) => {
    char = char || ' '
    let filler = ''
    while (charCount > 0) {
        filler += char
        charCount--
    }
    return filler
}

module.exports = {

    DEFAULT_SHELL_WIDTH: DEFAULT_SHELL_WIDTH,

    createFiller: createFiller,

    /**
     * Adds trailing padding (spaces) to a string.
     * @param {string} string       the string to pad
     * @param {number} targetWidth  the final width in characters
     * @return {string}     the right-padded string
     */
    padRight: (string, targetWidth) => string + createFiller(targetWidth - string.length),

    /**
     * Adds leading padding (spaces) to a string.
     * @param {string} string       the string to pad
     * @param {number} targetWidth  the final width in characters
     * @return {string}     the left-padded string
     */
    padLeft: (string, targetWidth) => createFiller(targetWidth - string.length) + string,

    /**
     * Adds leading and trailing space to a string in order to center
     * it horizontally in the shell.
     * @param {string} string                   the string to pad
     * @param {number} emojiSpaceCorrection     number of spaces to add to trailing space
     * @return {string}     equally padded string
     */
    padToFullWidth: (string, emojiSpaceCorrection) => {
        emojiSpaceCorrection = emojiSpaceCorrection || 0
        const diff = DEFAULT_SHELL_WIDTH - string.length
        const leadSpaceSize = Math.floor(diff / 2)
        const trailSpaceSize =
            DEFAULT_SHELL_WIDTH - leadSpaceSize - string.length + emojiSpaceCorrection
        return createFiller(leadSpaceSize)
            + string
            + createFiller(trailSpaceSize)
    },

    /**
     * Replaces all placeholder ("{}") occurences in a
     * given string an returns the result.
     * @param {string} template     template string containing placeholders
     * @param {params} params       parameters to fill in.
     * @return {string}             the formatted string
     */
    formatText: (template, params) => {
        params = params.forEach ? params : [params]
        params.forEach((param) => template = template.replace('{}', param))
        return template
    },

    /**
     * Prompts the command-line user for input.
     * @param {string} question     a question to ask
     * @param {string} options      options to suggest
     * @return {string}             the user input
     */
    askForInput: (question, options) => {
        question = chalk.bold(`${question}`)
        options = chalk.dim(`[${options}]`)
        return readlineSync.question(question + ' ' + options + '\n')
    },

    /**
     * Prints a line break to standard output.
     */
    nl: () => {
        console.log('')
    },

    /**
    * Prints two line breaks to standard output.
    */
    dnl: () => {
        console.log('\n')
    },
}
