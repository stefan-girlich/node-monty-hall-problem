'use strict'

const Game = require('../lib/game')

const assert = require('assert')
describe('Game', () => {
    describe('#selectInitialDoor()', () => {
        it('should throw an error when the initial door has already been selected', () => {
            const game = new Game.Game(3, () => { })
            game.selectInitialDoor(1)

            assert.throws(() => game.selectInitialDoor(1), Error)
        })

        it('should throw an error when an illegal door index has been given', () => {
            const game = new Game.Game(3, () => { })

            assert.throws(() => game.selectInitialDoor(10), Error)

            assert.throws(() => game.selectInitialDoor(-1), Error)
        })

        it('should not offer the "car" door as an option when the player chose it', () => {
            const game = new Game.Game(3, () => { })

            const freeDoorIndex = game.selectInitialDoor(game.carPos)

            assert.notEqual(freeDoorIndex, game.carPos)
        })

        it('should not offer "player" door as an option for switching', () => {
            const playerPos = 1

            const game = new Game.Game(3, () => { })
            game.carPos = 0

            const freeDoorIndex = game.selectInitialDoor(playerPos)

            assert.notEqual(freeDoorIndex, playerPos)
        })

        it('should only open exactly one "goat" door', () => {
            const game = new Game.Game(3, () => { })
            game.carPos = 0

            const freeDoorIndex = game.selectInitialDoor(1)

            assert.equal(freeDoorIndex, 0)

            assert(!game.doorStates[0])
            assert(!game.doorStates[1])
            assert(game.doorStates[2])
        })
    })

    describe('#selectSwitchOrNot()', () => {
        it('should throw an error when the initial door has not been selected yet', () => {
            const game = new Game.Game(3, () => { })

            assert.throws(() => game.selectSwitchOrNot(true), Error)
        })

        it('should open all doors', () => {
            const game = new Game.Game(3, () => { })

            game.selectInitialDoor(0)
            game.selectSwitchOrNot(false)

            game.doorStates.forEach((isOpen) => assert(isOpen))
        })

        it('should move into "won" state when the player position is correct', () => {
            const game = new Game.Game(3, () => { })

            game.selectInitialDoor(game.carPos)
            game.selectSwitchOrNot(false)

            assert(game.state === Game.State.STATE_END_WON)
        })

        it('should move into "lost" state when the player position is not correct', () => {
            const game = new Game.Game(3, () => { })

            game.selectInitialDoor(game.carPos)
            game.selectSwitchOrNot(true)

            assert(game.state === Game.State.STATE_END_LOST)
        })
    })

    describe('#reset()', () => {
        const assertInitialState = (game) => {
            game.doorStates.forEach((isOpen) => assert(!isOpen))
            assert(game.state === Game.State.STATE_START)
            assert(game.playerPos === null)
            assert(game.switchPos === null)
        }

        it('should move the game back into its initial state', () => {
            const game = new Game.Game(3, () => { })
            game.reset()
            assertInitialState(game)

            game.selectInitialDoor(0)
            game.reset()
            assertInitialState(game)

            game.selectInitialDoor(0)
            game.selectSwitchOrNot(true)
            game.reset()
            assertInitialState(game)
        })
    })
})
