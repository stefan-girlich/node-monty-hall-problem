'use strict'

const SEPARATOR = '/'

module.exports = {
    /**
     * Provides a human-readable interpretation of the given
     * positive and negative input options
     * @param {Array} positiveOptions   all positive options
     * @param {Array} negativeOptions   all negative options
     * @return {string} string representation of all input options
     */
    createInputOptionsString: (positiveOptions, negativeOptions) => {
        return positiveOptions.join(SEPARATOR)
            + SEPARATOR
            + negativeOptions.join(SEPARATOR)
    },
}
