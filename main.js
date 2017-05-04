const readlineSync = require('readline-sync')

const createDoorNameMap = (count) => {
	const doorNamesToIndices = {}
	for (let i = 0; i < count; i++) {
		const key = String.fromCharCode(97 + i).toUpperCase() 	// for letters
		//const key = '' + (i + 1)
		doorNamesToIndices[key] = i
	}

	return doorNamesToIndices
}


const createInitialDoorStates = (count) => {
	const result = []
	for (let i = 0; i < count; i++) {
		result.push(false)
	}

	return result
}

const getDoorIndexFromName = (name) => {
	if (!(name in doorNamesToIndices)) {
		throw new Error('Door not known with name: ' + name)
	}
	return doorNamesToIndices[name]
}

const getDoorNameFromIndex = (index) => {
	const singleDoorName = Object.keys(doorNamesToIndices).filter((key) => doorNamesToIndices[key] === index)
	if (singleDoorName.length === 0) {
		throw new Error('No door name found for index ' + index)
	}

	return singleDoorName[0]
}

const STATE_START = 0
const STATE_QUESTION = 1
const STATE_END_WON = 2
const STATE_END_LOST = 3

class Game {

	constructor(doorCount, changeListener) {
		this.doorCount = doorCount
		this.reset()
		this.changeListener = changeListener
	}

	selectInitialDoor(doorPos) {
		if (this.state !== STATE_START) {
			throw new Error('cannot select initial door anymore')
		}

		if (doorPos < 0 || doorPos > this.doorStates.length - 1) {
			throw new Error('door position needs to be in range [0;doorCount[')
		}

		const self = this

		this.playerPos = doorPos
		this.state = STATE_QUESTION

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
		if (this.state !== STATE_QUESTION) {
			throw new Error('cannot select switch right now')
		}

		if (shouldSwitch) {
			this.playerPos = this.switchPos
		}

		this.doorStates.forEach((isOpen, index) => this.doorStates[index] = true)

		const won = this.playerPos === this.carPos

		this.state = won ? STATE_END_WON : STATE_END_LOST
		this.changeListener()
	}

	reset() {
		this.state = STATE_START
		this.doorStates = createInitialDoorStates(this.doorCount)
		this.carPos = Math.floor(Math.random() * this.doorStates.length)
		this.playerPos = null
		this.switchPos = null

		//console.log('>>>>>>>>>>>> DEBUG: car is in ' + this.carPos + '  ' + getDoorNameFromIndex(this.carPos))
	}
}




const askForInput = (question) => readlineSync.question(question)

const render = () => {
	//	process.stdout.write('\033c');

	let output = ''
	game.doorStates.forEach((isDoorOpen, index) => {
		output += getDoorNameFromIndex(index) + '\t'
	})

	output += '\n'

	game.doorStates.forEach((isDoorOpen, index) => {
		if (!isDoorOpen) {
			output += '🚪\t'
			return
		}

		output += (index === game.carPos ? '🚗' : '🐐') + '\t'
	})

	output += '\n'

	game.doorStates.forEach((isDoorOpen, index) => {
		output += (index === game.playerPos ? '🙎' : ' ') + '\t'
	})

	console.log(output)

	if (game.state === STATE_END_WON) {
		console.log('\nYou won!!!')
	} else if (game.state === STATE_END_LOST) {
		console.log('\nYou lost. :(')
	}

	console.log('\n')
}

const renderResults = (data) => {
	console.log('-------------------------------------')
	Object.keys(data).forEach((key) => {
		console.log(key + '\t\t' + data[key])
	})
	console.log('-------------------------------------\n\n')
}




// main

const args = process.argv
if (args.length !== 3) {
	throw Error('Please provide the number of doors as the only argument.')
}


const doorCount = parseInt(args[2])
if (isNaN(doorCount) || doorCount < 3) {
	throw Error('Please provide a number of doors which is at least 3.')
}

const doorNamesToIndices = createDoorNameMap(doorCount)
const game = new Game(doorCount, render)


const results = {
	wonByStaying: 0,
	wonBySwitching: 0,
	lostByStaying: 0,
	lostBySwitching: 0,
}

while (true) {

	render()

	let initialDoorIndex = null
	while (initialDoorIndex === null) {
		const initialDoorName = askForInput('Which is your first door?\n').toUpperCase()
		try {
			initialDoorIndex = getDoorIndexFromName(initialDoorName)
		} catch (e) { }
	}

	console.log('\n')

	const freeDoorIndex = game.selectInitialDoor(initialDoorIndex)
	const freeDoorName = getDoorNameFromIndex(freeDoorIndex)


	let shouldSwitch = null
	while (shouldSwitch === null) {
		const switchInput = askForInput(`Do you want to switch to door ${freeDoorName}?\n`).toLowerCase()
		if (switchInput === 'yes' || switchInput === 'y') {
			shouldSwitch = true
		} else if (switchInput === 'no' ||  switchInput === 'n') {
			shouldSwitch = false
		}
	}

	console.log('\n')

	game.selectSwitchOrNot(shouldSwitch)

	let resultKey;
	if (game.state === STATE_END_WON) {
		resultKey = shouldSwitch ? 'wonBySwitching' : 'wonByStaying'
	} else {
		resultKey = shouldSwitch ? 'lostBySwitching' : 'lostByStaying'
	}

	results[resultKey]++

	renderResults(results)

	game.reset()
}
