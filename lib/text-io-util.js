'use strict'

const readlineSync = require('readline-sync')
const chalk = require('chalk')

module.exports = {
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
