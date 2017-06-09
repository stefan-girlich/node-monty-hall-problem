'use strict'

const readlineSync = require('readline-sync')

module.exports = {
    formatText: (template, params) => {
        params = params.forEach ? params : [params]
        params.forEach((param) => template = template.replace('{}', param))
        return template
    },

    askForInput: (question) => readlineSync.question(question + '\n'),
}
