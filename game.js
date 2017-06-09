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

class Game {

	constructor(doorCount, changeListener) {
		this.doorCount = doorCount
		this.reset()
		this.changeListener = changeListener
	}

	selectInitialDoor(doorPos) {
		if (this.state !== State.STATE_START) {
			throw new Error('cannot select initial door anymore')
		}

		if (doorPos < 0 || doorPos > this.doorStates.length - 1) {
			throw new Error('door position needs to be in range [0;doorCount[')
		}

		const self = this

		this.playerPos = doorPos
		this.state = State.STATE_QUESTION

		const goatDoorIndices = this.doorStates
			.map((value, index) => index)
			.filter((index) => index !== self.playerPos && index !== self.carPos)

		const hasPlayedSelectedCar = self.playerPos === self.carPos
		const randomGoatDoorIndicesIndex = Math.floor(Math.random() * goatDoorIndices.length)
		const randomGoatToHidePos = hasPlayedSelectedCar ? goatDoorIndices[randomGoatDoorIndicesIndex] : null

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

	reset() {
		this.state = State.STATE_START
		this.doorStates = createInitialDoorStates(this.doorCount)
		this.carPos = Math.floor(Math.random() * this.doorStates.length)
		this.playerPos = null
		this.switchPos = null

		//console.log('>>>>>>>>>>>> DEBUG: car is in ' + this.carPos + '  ' + getDoorNameFromIndex(this.carPos))
	}
}

module.exports.Game = Game
module.exports.State = State
