'use strict'

const createInitialDoorStates = (count) => {
	const result = []
	for (let i = 0; i < count; i++) {
		result.push(false)
	}

	return result
}

const State = {
	STATE_START: 0,
	STATE_QUESTION: 1,
	STATE_END_WON: 2,
	STATE_END_LOST: 3,
}

/**
 * Instances of this class represent the game logic for the Monty Hall problem.
 * While each instance only holds the state of a single game, it can be reset
 * to re-run the stages of the game.
 */
class Game {

	/**
	 * Creates a new instance.
	 * @param {number} doorCount			total number of doors available
	 * @param {function} changeListener		invoked on game state changes
	 */
	constructor(doorCount, changeListener) {
		this.doorCount = doorCount
		this.reset()
		this.changeListener = changeListener
	}

	/**
	 * Opens the given door in the initial stage of the game and
	 * opens all other non-goat doors but one.
	 * An error will be thrown if the game is not in the initial state anymore
	 * or when the given door index is outside of the valid range.
	 * @param {number} doorIndex	index of the door to open
	 * @return {number}		the index of the remaining closed door
	 */
	selectInitialDoor(doorIndex) {
		if (this.state !== State.STATE_START) {
			throw new Error('cannot select initial door anymore')
		}

		if (doorIndex < 0 || doorIndex > this.doorStates.length - 1) {
			throw new Error('door position needs to be in range [0;doorCount[')
		}

		const self = this

		this.playerPos = doorIndex
		this.state = State.STATE_QUESTION

		const goatDoorIndices = this.doorStates
			.map((value, index) => index)
			.filter((index) => index !== self.playerPos && index !== self.carPos)

		const hasPlayedSelectedCar = self.playerPos === self.carPos
		const randomGoatDoorIndicesIndex =
			Math.floor(Math.random() * goatDoorIndices.length)
		const randomGoatToHidePos = hasPlayedSelectedCar
			? goatDoorIndices[randomGoatDoorIndicesIndex]
			: null

		goatDoorIndices.forEach((goatDoorIndex) => {
			this.doorStates[goatDoorIndex] = goatDoorIndex !== randomGoatToHidePos
		})

		const freeDoorIndex = this.doorStates
			.map((value, index) => index)
			.filter((index) => index !== self.playerPos && !self.doorStates[index])[0]

		this.switchPos = freeDoorIndex

		this.changeListener()

		return freeDoorIndex
	}

	/**
	 * Finishes the game by opening the initially selected door or the
	 * remaining door depending on the player's decision.
	 * After this step, it is clear if the game has been won or lost.
	 * If the game is not in the final state, an error will be thrown.
	 * @param {boolean} shouldSwitch	open other door (true) or initial one?
	 */
	selectSwitchOrNot(shouldSwitch) {
		if (this.state !== State.STATE_QUESTION) {
			throw new Error('cannot select switch right now')
		}

		if (shouldSwitch) {
			this.playerPos = this.switchPos
		}

		this.doorStates.forEach((isOpen, index) => this.doorStates[index] = true)

		const won = this.playerPos === this.carPos

		this.state = won ? State.STATE_END_WON : State.STATE_END_LOST
		this.changeListener()
	}

	/**
	 * Resets the game logic to its original state.
	 */
	reset() {
		this.state = State.STATE_START
		this.doorStates = createInitialDoorStates(this.doorCount)
		this.carPos = Math.floor(Math.random() * this.doorStates.length)
		this.playerPos = null
		this.switchPos = null
	}
}

module.exports.Game = Game
module.exports.State = State
