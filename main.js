const readlineSync = require('readline-sync')
const config = require('./config.json')
const Game = require('./game')

const formatText = (template, params) => {
	params = params.forEach ? params : [params]
	params.forEach((param) => template = template.replace('{}', param))
	return template
}

const createDoorNameMap = (count) => {
	const doorNamesToIndices = {}
	for (let i = 0; i < count; i++) {
		//const key = String.fromCharCode(97 + i).toUpperCase() 	// for letters
		const key = '' + (i + 1)
		doorNamesToIndices[key] = i
	}

	return doorNamesToIndices
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
			output += config.symbols.door + '\t'
			return
		}

		output += (index === game.carPos ? config.symbols.car : config.symbols.goat) + '\t'
	})

	output += '\n'

	game.doorStates.forEach((isDoorOpen, index) => {
		output += (index === game.playerPos ? config.symbols.player : ' ') + '\t'
	})

	console.log(output)
	console.log('\n')

	if (game.state === Game.State.STATE_END_WON) {
		console.log(config.texts.wonMessage)
	} else if (game.state === Game.State.STATE_END_LOST) {
		console.log(config.texts.lostMessage)
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

const doorCount = config.game.defaultDoorCount
if (doorCount < 3) {
	throw Error('Please provide a number of doors which is at least 3.')
}

const doorNamesToIndices = createDoorNameMap(doorCount)
const game = new Game.Game(doorCount, render)


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
		const initialDoorName = askForInput(config.texts.pickFirstDoorQuestion + '\n').toUpperCase()
		try {
			initialDoorIndex = getDoorIndexFromName(initialDoorName)
		} catch (e) { }
	}

	console.log('\n')

	const freeDoorIndex = game.selectInitialDoor(initialDoorIndex)
	const freeDoorName = getDoorNameFromIndex(freeDoorIndex)


	let shouldSwitch = null
	while (shouldSwitch === null) {
		const switchInput = askForInput(formatText(config.texts.switchDoorQuestion, freeDoorName) +  `\n`).toLowerCase()
		if (switchInput === 'yes' || switchInput === 'y') {
			shouldSwitch = true
		} else if (switchInput === 'no' ||  switchInput === 'n') {
			shouldSwitch = false
		}
	}

	console.log('\n')

	game.selectSwitchOrNot(shouldSwitch)

	let resultKey;
	if (game.state === Game.State.STATE_END_WON) {
		resultKey = shouldSwitch ? 'wonBySwitching' : 'wonByStaying'
	} else {
		resultKey = shouldSwitch ? 'lostBySwitching' : 'lostByStaying'
	}

	results[resultKey]++

	renderResults(results)

	game.reset()
}
