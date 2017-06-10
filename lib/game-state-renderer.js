'use strict'

const chalk = require('chalk')
const Game = require('./game')
const TextIo = require('./text-io-util')

/**
 * This class is responsible for rendering the current state of a game.
 */
class GameStateRenderer {

    /**
     * Creates a new instance.
     * @param {Game} game                   the game to render
     * @param {DoorRepository} doorsRepo    provides doors used in the game
     * @param {Object} symbols              icons for displaying game objects
     * @param {Object} texts                texts representing messages
     */
    constructor(game, doorsRepo, symbols, texts) {
        this.game = game
        this.doorsRepo = doorsRepo
        this.symbols = symbols
        this.texts = texts
    }

    /**
     * Prints the current game state to standard output.
     */
    render() {
        //	process.stdout.write('\033c');

        let output = ''
        this.game.doorStates.forEach((isDoorOpen, index) => {
            output += this.doorsRepo.getDoorNameFromIndex(index) + '\t'
        })

        output += '\n'

        this.game.doorStates.forEach((isDoorOpen, index) => {
            if (!isDoorOpen) {
                output += this.symbols.door + '\t'
                return
            }

            const symbol = index === this.game.carPos
                ? this.symbols.car
                : this.symbols.goat
            output += (symbol) + '\t'
        })

        output += '\n'

        this.game.doorStates.forEach((isDoorOpen, index) => {
            const playerSymbol = index === this.game.playerPos
                ? this.symbols.player
                : ' '
            output += playerSymbol + '\t'
        })

        console.log(output + '\n')

        if (this.game.state === Game.State.STATE_END_WON) {
            const message = TextIo.padToFullWidth(this.texts.wonMessage, 6)
            console.log(chalk.bold.black.bgGreen(message))
            TextIo.dnl()
        } else if (this.game.state === Game.State.STATE_END_LOST) {
            const message = TextIo.padToFullWidth(this.texts.lostMessage, 1)
            console.log(chalk.bold.white.bgBlack(message))
            TextIo.dnl()
        }
    }
}

module.exports = GameStateRenderer
