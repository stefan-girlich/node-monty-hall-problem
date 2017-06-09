const Game = require('./game')

class GameStateRenderer {

    constructor(game, doorsRepo, symbols, texts) {
        this.game = game
        this.doorsRepo = doorsRepo
        this.symbols = symbols
        this.texts = texts
    }

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

            output += (index === this.game.carPos ? this.symbols.car : this.symbols.goat) + '\t'
        })

        output += '\n'

        this.game.doorStates.forEach((isDoorOpen, index) => {
            output += (index === this.game.playerPos ? this.symbols.player : ' ') + '\t'
        })

        console.log(output)
        console.log('\n')

        if (this.game.state === Game.State.STATE_END_WON) {
            console.log(this.texts.wonMessage)
        } else if (this.game.state === Game.State.STATE_END_LOST) {
            console.log(this.texts.lostMessage)
        }

        console.log('\n')
    }
}

module.exports = GameStateRenderer
